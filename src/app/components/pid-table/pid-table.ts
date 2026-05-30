import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { DroneLinkFacade } from '../../core/mavlink/facade/drone-link.facade';
import { ParameterMetadata } from '../../core/mavlink/models/parameter-metadata.model';
import { InfoBulle, InfoBulleItem } from '../ui/info-bulle/info-bulle';

type PidAxis = 'RLL' | 'PIT' | 'YAW';
type PidTerm = 'P' | 'I' | 'D' | 'FF';

interface PidAxisConfig {
  readonly key: PidAxis;
  readonly label: string;
  readonly cssClass: string;
  readonly color: string;
}

interface PidHelpInfo {
  readonly title: string;
  readonly description: string;
  readonly items: ReadonlyArray<InfoBulleItem>;
}

export interface PidParameterDraftChange {
  readonly name: string;
  readonly value: number;
  readonly rebootRequired: boolean;
}

@Component({
  selector: 'app-pid-table',
  standalone: true,
  imports: [InfoBulle],
  templateUrl: './pid-table.html',
  styleUrl: './pid-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PidTable {
  private static readonly DEFAULT_MIN = 0;
  private static readonly DEFAULT_STEP = 0.001;

  private readonly link = inject(DroneLinkFacade);

  readonly draftValues = input<Record<string, number>>({});
  readonly draftChange = output<PidParameterDraftChange>();

  readonly isConnected = this.link.isConnected;
  readonly parameterState = this.link.parameterState;
  readonly parameterMetadataState = this.link.parameterMetadataState;
  readonly syncStatus = computed(() => this.parameterState().sync);

  readonly axes: ReadonlyArray<PidAxisConfig> = [
    { key: 'RLL', label: 'ROLL', cssClass: 'pid_roll', color: '#e24761' },
    { key: 'PIT', label: 'PITCH', cssClass: 'pid_pitch', color: '#49c747' },
    { key: 'YAW', label: 'YAW', cssClass: 'pid_yaw', color: '#477ac7' },
  ];

  readonly columns: ReadonlyArray<{ term: PidTerm; label: string; max: number }> = [
    { term: 'P', label: 'Proportionnel', max: 250 },
    { term: 'I', label: 'Intégral', max: 250 },
    { term: 'D', label: 'Dérivé', max: 250 },
    { term: 'FF', label: 'Feedforward', max: 2000 },
  ];

  getParameterName(axis: PidAxis, term: PidTerm): string {
    return `ATC_RAT_${axis}_${term}`;
  }

  getParameterValue(name: string): number | null {
    const draft = this.draftValues()[name];
    if (Number.isFinite(draft)) {
      return draft;
    }

    return this.link.getRoundedParameterValue(name);
  }

  isParameterDirty(name: string): boolean {
    return Number.isFinite(this.draftValues()[name]);
  }

  isParameterPending(name: string): boolean {
    return this.parameterState().byName.get(name)?.pending ?? false;
  }

  isParameterAvailable(name: string): boolean {
    const availableFromVehicle = this.parameterState().byName.has(name);
    const metadataState = this.parameterMetadataState();

    if (!metadataState.loaded || metadataState.byName.size === 0) {
      return availableFromVehicle;
    }

    return availableFromVehicle && metadataState.byName.has(name);
  }

  getParameterHelpInfo(name: string): PidHelpInfo | null {
    const metadata = this.getParameterMetadata(name);
    if (!metadata) {
      return null;
    }

    const items: InfoBulleItem[] = [];

    if (metadata.min != null || metadata.max != null) {
      items.push({
        label: 'Plage : ',
        value: `De ${metadata.min ?? '-inf'} à ${metadata.max ?? '+inf'}`,
      });
    }

    if (metadata.increment != null) {
      items.push({
        label: 'Increment :',
        value: String(metadata.increment),
      });
    }

    if (metadata.units) {
      items.push({
        label: 'Units',
        value: metadata.units,
      });
    }

    const title = metadata.name;
    const description = (metadata.description ?? '').trim();
    if (!title && !description && items.length === 0) {
      return null;
    }

    return {
      title,
      description,
      items,
    };
  }

  getParameterMin(name: string): number {
    return this.getParameterMetadata(name)?.min ?? PidTable.DEFAULT_MIN;
  }

  getParameterMax(name: string, fallbackMax: number): number {
    return this.getParameterMetadata(name)?.max ?? fallbackMax;
  }

  getParameterStep(name: string): number {
    return this.getParameterMetadata(name)?.increment ?? PidTable.DEFAULT_STEP;
  }

  onCommit(axis: PidAxis, term: PidTerm, event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!input) {
      return;
    }

    const nextValue = Number(input.value);
    if (!Number.isFinite(nextValue)) {
      return;
    }

    const paramName = this.getParameterName(axis, term);

    if (!this.isParameterAvailable(paramName)) {
      return;
    }

    const normalizedValue = this.normalizeInputValue(paramName, nextValue);
    if (normalizedValue == null) {
      return;
    }

    if (normalizedValue !== nextValue) {
      input.value = String(normalizedValue);
    }

    this.draftChange.emit({
      name: paramName,
      value: normalizedValue,
      rebootRequired: this.getParameterMetadata(paramName)?.rebootRequired === true,
    });
  }

  private getParameterMetadata(name: string): ParameterMetadata | undefined {
    return this.link.getParameterMetadata(name);
  }

  private normalizeInputValue(name: string, value: number): number | null {
    if (!Number.isFinite(value)) {
      return null;
    }

    const metadata = this.getParameterMetadata(name);
    if (!metadata) {
      return value;
    }

    let normalized = value;

    if (metadata.min != null) {
      normalized = Math.max(metadata.min, normalized);
    }

    if (metadata.max != null) {
      normalized = Math.min(metadata.max, normalized);
    }

    if (metadata.increment != null && metadata.increment > 0) {
      const decimals = this.countDecimals(metadata.increment);
      const base = metadata.min ?? 0;
      const rawSteps = (normalized - base) / metadata.increment;
      const snapped = Math.round(rawSteps) * metadata.increment + base;
      normalized = Number(snapped.toFixed(decimals));
    }

    return normalized;
  }

  private countDecimals(value: number): number {
    const asText = value.toString();
    const decimalSeparatorIndex = asText.indexOf('.');
    return decimalSeparatorIndex < 0 ? 0 : asText.length - decimalSeparatorIndex - 1;
  }
}
