import { Injectable } from '@angular/core';
import { ParameterMetadata } from '../mavlink/models/parameter-metadata.model';

/**
 * Reponse brute de l'endpoint gratuit Google Translate (client=gtx).
 * Format : [[['texte traduit','texte original',...], ...], null, 'en', ...]
 */
type GtxResponse = Array<Array<Array<string | null>> | null | string>;

/**
 * Service de traduction des metadonnees de parametres ArduPilot.
 * Utilise l'endpoint public Google Translate (sans cle API, sans quota facturable).
 *
 * Fonctionnement :
 * - Les traductions sont mises en cache dans localStorage sous UNE seule cle par langue
 *   (gct-cache:{lang}), contenant un objet JSON { texte_anglais: texte_traduit }.
 *   Cela evite la pollution de localStorage avec des centaines de cles individuelles.
 * - Seuls les textes absents du cache sont envoyes a l'API.
 * - Les requetes sont envoyees par groupes de 5 en parallele pour eviter de surcharger l'endpoint.
 * - La traduction est ignoree si la langue cible est 'en'.
 */
@Injectable({ providedIn: 'root' })
export class ParameterTranslationService {
  private static readonly CACHE_PREFIX = 'gct-cache:';
  private static readonly API_URL =
    'https://translate.googleapis.com/translate_a/single';
  /** Nombre de requetes paralleles max pour ne pas surcharger l'endpoint. */
  private static readonly CONCURRENCY = 5;

  /** Cache en memoire : evite de relire localStorage a chaque acces. */
  private readonly memoryCache = new Map<string, Record<string, string>>();

  /**
   * Traduit une Map de metadonnees vers la langue cible.
   * Retourne une nouvelle Map avec les champs textuels traduits.
   * En cas d'erreur ou de quota atteint, retourne la Map originale.
   */
  /**
   * Traduit une Map de metadonnees vers la langue cible.
   * Retourne une nouvelle Map avec les champs textuels traduits.
   * En cas d'erreur reseau, les textes anglais originaux sont conserves.
   */
  async translateMetadata(
    byName: Map<string, ParameterMetadata>,
    targetLang: string
  ): Promise<Map<string, ParameterMetadata>> {
    if (targetLang === 'en' || targetLang.startsWith('en-')) {
      return byName;
    }

    const lang = targetLang.split('-')[0];

    const textsToTranslate = this.collectUniqueTexts(byName);
    if (textsToTranslate.length === 0) {
      return byName;
    }

    const uncachedTexts = textsToTranslate.filter(
      (text) => this.getFromCache(lang, text) === null
    );

    if (uncachedTexts.length > 0) {
      await this.fetchAndCacheTranslations(uncachedTexts, lang);
    }

    return this.applyTranslations(byName, lang);
  }

  // ---------------------------------------------------------------------------
  // Privé
  // ---------------------------------------------------------------------------

  private collectUniqueTexts(byName: Map<string, ParameterMetadata>): string[] {
    const set = new Set<string>();

    for (const meta of byName.values()) {
      if (meta.displayName) set.add(meta.displayName);
      if (meta.description) set.add(meta.description);
      for (const label of meta.values.values()) {
        if (label) set.add(label);
      }
      for (const label of meta.bitmask.values()) {
        if (label) set.add(label);
      }
    }

    return Array.from(set);
  }

  private applyTranslations(
    byName: Map<string, ParameterMetadata>,
    lang: string
  ): Map<string, ParameterMetadata> {
    const translated = new Map<string, ParameterMetadata>();

    for (const [name, meta] of byName.entries()) {
      translated.set(name, {
        ...meta,
        displayName: meta.displayName
          ? (this.getFromCache(lang, meta.displayName) ?? meta.displayName)
          : null,
        description: meta.description
          ? (this.getFromCache(lang, meta.description) ?? meta.description)
          : null,
        values: this.translateMap(meta.values, lang),
        bitmask: this.translateMap(meta.bitmask, lang),
      });
    }

    return translated;
  }

  private translateMap(
    original: ReadonlyMap<number, string>,
    lang: string
  ): ReadonlyMap<number, string> {
    const result = new Map<number, string>();
    for (const [key, label] of original.entries()) {
      result.set(key, this.getFromCache(lang, label) ?? label);
    }
    return result;
  }

  /**
   * Envoie les textes non caches a l'endpoint GTX par groupes de CONCURRENCY requetes
   * en parallele (une requete par texte) et stocke les reponses dans le cache.
   */
  private async fetchAndCacheTranslations(texts: string[], lang: string): Promise<void> {
    const concurrency = ParameterTranslationService.CONCURRENCY;

    for (let i = 0; i < texts.length; i += concurrency) {
      const batch = texts.slice(i, i + concurrency);

      await Promise.all(
        batch.map(async (text) => {
          const translated = await this.fetchSingleTranslation(text, lang);
          if (translated !== null) {
            this.setInCache(lang, text, translated);
          }
        })
      );
    }
  }

  /**
   * Traduit un seul texte via l'endpoint public GTX.
   * Retourne null en cas d'echec.
   *
   * URL : https://translate.googleapis.com/translate_a/single
   *   ?client=gtx&sl=en&tl={lang}&dt=t&q={texte encode}
   *
   * Format de reponse : [[['traduit','original',...], ...], null, 'en', ...]
   * La traduction complete est obtenue en joignant les segments response[0][*][0].
   */
  private async fetchSingleTranslation(text: string, lang: string): Promise<string | null> {
    try {
      const url =
        `${ParameterTranslationService.API_URL}` +
        `?client=gtx&sl=en&tl=${encodeURIComponent(lang)}&dt=t&q=${encodeURIComponent(text)}`;

      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`[ParameterTranslation] Reponse ${response.status} pour "${text}"`);
        return null;
      }

      const data = (await response.json()) as GtxResponse;

      // data[0] est un tableau de segments [['traduit', 'original', ...], ...]
      const segments = data[0];
      if (!Array.isArray(segments)) {
        return null;
      }

      const joined = segments
        .map((segment) => (Array.isArray(segment) ? segment[0] : null))
        .filter((part): part is string => typeof part === 'string')
        .join('');

      return joined.length > 0 ? joined : null;
    } catch (error) {
      console.warn(`[ParameterTranslation] Erreur reseau pour "${text}":`, error);
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Cache localStorage (une cle par langue, objet JSON { original: traduit })
  // ---------------------------------------------------------------------------

  private langCacheKey(lang: string): string {
    return `${ParameterTranslationService.CACHE_PREFIX}${lang}`;
  }

  /**
   * Charge le cache de la langue depuis localStorage vers la memoire.
   * Appele une seule fois par langue lors du premier acces.
   */
  private loadCacheForLang(lang: string): Record<string, string> {
    if (this.memoryCache.has(lang)) {
      return this.memoryCache.get(lang)!;
    }

    try {
      const raw = localStorage.getItem(this.langCacheKey(lang));
      const parsed = raw ? (JSON.parse(raw) as Record<string, string>) : {};
      this.memoryCache.set(lang, parsed);
      return parsed;
    } catch {
      const empty: Record<string, string> = {};
      this.memoryCache.set(lang, empty);
      return empty;
    }
  }

  private getFromCache(lang: string, text: string): string | null {
    const cache = this.loadCacheForLang(lang);
    return cache[text] ?? null;
  }

  private setInCache(lang: string, original: string, translated: string): void {
    const cache = this.loadCacheForLang(lang);
    cache[original] = translated;

    try {
      localStorage.setItem(this.langCacheKey(lang), JSON.stringify(cache));
    } catch {
      // localStorage plein — on ignore silencieusement
    }
  }

}
