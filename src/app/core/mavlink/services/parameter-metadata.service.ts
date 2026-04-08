import { Injectable, computed, inject, signal } from '@angular/core';
import { AppError } from '../../../core/services/error/app-error';
import {
  INITIAL_PARAMETER_METADATA_STATE,
  ParameterMetadata,
  ParameterMetadataState
} from '../models/parameter-metadata.model';
import { FirmwareFamily, VehicleIdentityState } from '../models/vehicle-identity.model';
import { ParameterTranslationService } from '../../services/param-translation/param-translation.service';

interface RepositoryPayload {
  [section: string]: unknown;
}

interface RepositoryRange {
  low?: string;
  high?: string;
}

interface RepositoryParameterRecord {
  DisplayName?: string;
  Description?: string;
  Increment?: string;
  Units?: string;
  User?: string;
  ReadOnly?: string;
  RebootRequired?: string;
  Range?: RepositoryRange;
  Values?: Record<string, string>;
  Bitmask?: Record<string, string>;
}

/**
 * Service de chargement et de normalisation des metadonnees de parametres.
 * Il telecharge les definitions depuis le ParameterRepository d'ArduPilot selon
 * la famille firmware et la version detectee, convertit les donnees brutes en
 * modeles internes et expose un etat reactif de chargement.
 *
 * Parameter metadata loading and normalization service.
 * It downloads definitions from ArduPilot's ParameterRepository based on the
 * detected firmware family and version, converts raw payloads into internal
 * models, and exposes a reactive loading state.
 */
@Injectable({ providedIn: 'root' })
export class ParameterMetadataService {
  private static readonly REPOSITORY_BASE_URL =
    'https://raw.githubusercontent.com/ArduPilot/ParameterRepository/main';

  private readonly translationService = inject(ParameterTranslationService);
  private readonly stateSig = signal<ParameterMetadataState>(INITIAL_PARAMETER_METADATA_STATE);

  readonly state = computed(() => this.stateSig());

  reset(): void {
    this.stateSig.set(INITIAL_PARAMETER_METADATA_STATE);
  }

  get(name: string): ParameterMetadata | undefined {
    return this.stateSig().byName.get(name);
  }

  has(name: string): boolean {
    return this.stateSig().byName.has(name);
  }

  async loadForVehicle(identity: VehicleIdentityState): Promise<void> {
    const releaseTag = this.resolveReleaseTag(identity.firmwareFamily, identity.version.major, identity.version.minor);

    if (!releaseTag) {
      this.stateSig.set({
        ...INITIAL_PARAMETER_METADATA_STATE,
        loaded: true,
        lastError: 'Firmware/version non disponible pour charger les metadonnees.'
      });
      return;
    }

    this.stateSig.set({
      ...INITIAL_PARAMETER_METADATA_STATE,
      inProgress: true
    });

    const urls = this.buildCandidateUrls(releaseTag.name, releaseTag.version);

    let lastError: string | null = null;
    for (const source of urls) {
      try {
        const payload = await this.fetchRepositoryPayload(source);
        const byName = this.parseRepositoryPayload(payload);

        this.stateSig.set({
          inProgress: false,
          loaded: true,
          loadedAtMs: Date.now(),
          source,
          lastError: null,
          byName
        });

        // Traduction en arriere-plan : le signal est mis a jour une seconde fois
        // avec les textes traduits des qu'ils sont disponibles.
        void this.applyTranslationInBackground(byName, source);

        return;
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Erreur de chargement des metadonnees.';
      }
    }

    this.stateSig.set({
      ...INITIAL_PARAMETER_METADATA_STATE,
      loaded: true,
      lastError: lastError ?? 'Aucune metadonnee n\'a pu etre chargee.'
    });
  }

  private async applyTranslationInBackground(
    byName: Map<string, ParameterMetadata>,
    source: string
  ): Promise<void> {
    const browserLang = navigator.language ?? 'en';
    const targetLang = browserLang.split('-')[0];

    if (targetLang === 'en') {
      return;
    }

    try {
      const translatedByName = await this.translationService.translateMetadata(byName, targetLang);

      // Ne pas ecraser si l'etat a change entre temps (ex: reset ou nouveau chargement)
      const current = this.stateSig();
      if (current.source !== source) {
        return;
      }

      this.stateSig.set({
        ...current,
        byName: translatedByName,
      });
    } catch (error) {
      console.warn('[ParameterMetadata] Echec de la traduction en arriere-plan:', error);
    }
  }

  private resolveReleaseTag(
    family: FirmwareFamily,
    major: number | null,
    minor: number | null
  ): { name: string; version: string } | null {
    if (major == null || minor == null) {
      return null;
    }

    const nameByFamily: Record<FirmwareFamily, string | null> = {
      arducopter: 'Copter',
      arduplane: 'Plane',
      ardurover: 'Rover',
      ardusub: 'Sub',
      unknown: null
    };

    const releaseName = nameByFamily[family];
    if (!releaseName) {
      return null;
    }

    return {
      name: releaseName,
      version: `${major}.${minor}`
    };
  }

  private buildCandidateUrls(releaseName: string, version: string): string[] {
    const parts = version.split('.');
    const major = Number(parts[0]);
    const minor = Number(parts[1]);

    if (!Number.isInteger(major) || !Number.isInteger(minor) || minor < 0) {
      return [
        `${ParameterMetadataService.REPOSITORY_BASE_URL}/${releaseName}-${version}/apm.pdef.json`
      ];
    }

    const minMinor = Math.max(0, minor - 3);
    const urls: string[] = [];

    for (let currentMinor = minor; currentMinor >= minMinor; currentMinor -= 1) {
      urls.push(
        `${ParameterMetadataService.REPOSITORY_BASE_URL}/${releaseName}-${major}.${currentMinor}/apm.pdef.json`
      );
    }

    return urls;
  }

  private async fetchRepositoryPayload(url: string): Promise<RepositoryPayload> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new AppError('errors.http.request_failed', { status: response.status, url });
    }

    return response.json() as Promise<RepositoryPayload>;
  }

  private parseRepositoryPayload(payload: RepositoryPayload): Map<string, ParameterMetadata> {
    const map = new Map<string, ParameterMetadata>();

    for (const [sectionName, sectionValue] of Object.entries(payload)) {
      if (sectionName === 'json' || !this.isRecord(sectionValue)) {
        continue;
      }

      for (const [paramName, rawRecord] of Object.entries(sectionValue)) {
        if (!this.isRecord(rawRecord)) {
          continue;
        }

        map.set(paramName, this.toParameterMetadata(paramName, rawRecord));
      }
    }

    return map;
  }

  private toParameterMetadata(name: string, rawRecord: RepositoryParameterRecord): ParameterMetadata {
    const range = this.isRecord(rawRecord.Range) ? rawRecord.Range : {};
    const values = this.parseNumericDictionary(rawRecord.Values);
    const bitmask = this.parseNumericDictionary(rawRecord.Bitmask);

    return {
      name,
      displayName: this.toText(rawRecord.DisplayName),
      description: this.toText(rawRecord.Description),
      min: this.parseNumber(range.low),
      max: this.parseNumber(range.high),
      increment: this.parseNumber(rawRecord.Increment),
      units: this.toText(rawRecord.Units),
      user: this.toText(rawRecord.User),
      readOnly: this.toBoolean(rawRecord.ReadOnly),
      rebootRequired: this.toBoolean(rawRecord.RebootRequired),
      values,
      bitmask
    };
  }

  private parseNumericDictionary(raw: unknown): ReadonlyMap<number, string> {
    const map = new Map<number, string>();

    if (!this.isRecord(raw)) {
      return map;
    }

    for (const [key, value] of Object.entries(raw)) {
      const code = this.parseNumber(key);
      if (code == null || typeof value !== 'string') {
        continue;
      }

      map.set(code, value);
    }

    return map;
  }

  private parseNumber(raw: unknown): number | null {
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      return raw;
    }

    if (typeof raw !== 'string') {
      return null;
    }

    const normalized = raw.trim().replace(/\+/, '');
    if (!normalized) {
      return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private toText(raw: unknown): string | null {
    if (typeof raw !== 'string') {
      return null;
    }

    const normalized = raw.trim();
    return normalized.length > 0 ? normalized : null;
  }

  private toBoolean(raw: unknown): boolean {
    if (typeof raw !== 'string') {
      return false;
    }

    const normalized = raw.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }

  private isRecord(value: unknown): value is Record<string, any> {
    return typeof value === 'object' && value !== null;
  }
}
