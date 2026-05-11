import { Signal, computed, inject, Injectable } from '@angular/core';

import { InfoBulleItem } from '../../../components/ui/info-bulle/info-bulle';
import {
  ParamTableDisplayOptions,
  ParamTableEditorType,
  ParamTableOption,
  ParamTableRow,
  ParamTableSection,
  ParamTableValue,
} from '../../../components/ui/param-table/param-table';
import { DroneLinkFacade } from '../../mavlink/facade/drone-link.facade';
import { ParameterMetadata } from '../../mavlink/models/parameter-metadata.model';
import { ParameterEntry } from '../../mavlink/models/parameter.model';

export interface ParamSectionDef {
  readonly id: string;
  readonly title: string;
  readonly display?: ParamTableDisplayOptions;
  readonly includeUnavailable?: boolean;
  readonly parameterNames: ReadonlyArray<string>;
}

export interface ParamBuilderWriteRequest {
  readonly name: string;
  readonly value: number;
}

/**
 * Service de construction des sections et lignes de la table de parametres.
 * Il transforme les definitions de sections, les metadonnees MAVLink et les valeurs
 * courantes en modeles d'affichage exploitables par l'interface, puis normalise
 * les valeurs avant ecriture, y compris pour les parametres de type bitmask.
 *
 * Service responsible for building parameter table sections and rows.
 * It converts section definitions, MAVLink metadata, and current parameter values
 * into UI-ready display models, then normalizes outgoing write values,
 * including support for bitmask-based parameters.
 */
@Injectable({
  providedIn: 'root',
})
export class ParamBuilderService {
  private static readonly BITMASK_ROW_NAME_SEPARATOR = '::bit::';

  private readonly link = inject(DroneLinkFacade);

  buildSectionSignal(definition: ParamSectionDef): Signal<ParamTableSection> {
    return computed(() => this.buildSection(definition));
  }

  buildSectionsSignal(definitions: ReadonlyArray<ParamSectionDef>): Signal<ReadonlyArray<ParamTableSection>> {
    return computed(() => definitions.map((definition) => this.buildSection(definition)));
  }

  buildBitmaskSectionSignal(definition: ParamSectionDef): Signal<ParamTableSection> {
    return computed(() => this.buildBitmaskSection(definition));
  }

  buildSection(definition: ParamSectionDef): ParamTableSection {
    return {
      id: definition.id,
      title: definition.title,
      display: definition.display,
      rows: this.buildRows(definition.parameterNames, definition.includeUnavailable ?? true),
    };
  }

  buildBitmaskSection(definition: ParamSectionDef): ParamTableSection {
    const parameterName = definition.parameterNames[0];

    return {
      id: definition.id,
      title: definition.title,
      display: definition.display,
      rows: parameterName
        ? this.buildBitmaskRows(parameterName, definition.includeUnavailable ?? true)
        : [],
    };
  }

  buildRows(
    parameterNames: ReadonlyArray<string>,
    includeUnavailable = true
  ): ReadonlyArray<ParamTableRow> {
    return parameterNames
      .map((name) => this.buildRow(name))
      .filter((row) => includeUnavailable || row.disabled !== true || this.hasParameterValue(row.name));
  }

  buildBitmaskRows(parameterName: string, includeUnavailable = true): ReadonlyArray<ParamTableRow> {
    const parameterEntry = this.getParameterEntry(parameterName);
    const metadata = this.getParameterMetadata(parameterName);
    const isAvailable = parameterEntry != null;

    if (!metadata || metadata.bitmask.size === 0) {
      if (!includeUnavailable && !isAvailable) {
        return [];
      }

      return [this.buildRow(parameterName)];
    }

    if (!includeUnavailable && !isAvailable) {
      return [];
    }

    const description = this.resolveDescription(metadata, isAvailable);
    const parameterTitle = this.resolveTitle(parameterName, metadata);
    const currentValue = parameterEntry?.value ?? 0;

    return Array.from(metadata.bitmask.entries())
      .sort(([left], [right]) => left - right)
      .map(([bitIndex, label]) => ({
        name: this.buildBitmaskRowName(parameterName, bitIndex),
        type: 'checkbox',
        value: this.resolveBitmaskValue(currentValue, bitIndex),
        title: label,
        description,
        helpTitle: `${parameterTitle} - ${label}`,
        helpDescription: description,
        helpItems: this.buildBitmaskHelpItems(metadata, bitIndex),
        disabled: metadata.readOnly === true || !isAvailable,
      }));
  }

  normalizeValueForWrite(name: string, value: ParamTableValue): number | null {
    const numericValue = this.toNumericValue(value);
    if (numericValue == null) {
      return null;
    }

    return this.normalizeNumberValue(name, numericValue);
  }

  resolveWriteRequest(name: string, value: ParamTableValue): ParamBuilderWriteRequest | null {
    const bitmaskBinding = this.parseBitmaskRowName(name);
    if (bitmaskBinding) {
      return this.resolveBitmaskWriteRequest(bitmaskBinding.parameterName, bitmaskBinding.bitIndex, value);
    }

    const normalizedValue = this.normalizeValueForWrite(name, value);
    if (normalizedValue == null) {
      return null;
    }

    return {
      name,
      value: normalizedValue,
    };
  }

  private buildRow(name: string): ParamTableRow {
    const parameterEntry = this.getParameterEntry(name);
    const metadata = this.getParameterMetadata(name);
    const type = this.resolveEditorType(metadata);
    const options = type === 'select' ? this.buildOptions(metadata) : undefined;
    const isAvailable = parameterEntry != null;
    const description = this.resolveDescription(metadata, isAvailable);

    return {
      name,
      type,
      value: this.resolveDisplayValue(parameterEntry, metadata, type, options),
      unavailable: !isAvailable,
      unit: metadata?.units ?? undefined,
      title: this.resolveTitle(name, metadata),
      description,
      helpTitle: `[${name}] ${this.resolveTitle(name, metadata)}`,
      helpDescription: description,
      helpItems: this.buildHelpItems(metadata),
      min: type === 'number' ? metadata?.min ?? undefined : undefined,
      max: type === 'number' ? metadata?.max ?? undefined : undefined,
      step: type === 'number' ? metadata?.increment ?? 1 : undefined,
      options,
      disabled: metadata?.readOnly === true || !isAvailable,
    };
  }

  private getParameterEntry(name: string): ParameterEntry | undefined {
    return this.link.parameterState().byName.get(name);
  }

  private getParameterMetadata(name: string): ParameterMetadata | undefined {
    return this.link.parameterMetadataState().byName.get(name) ?? this.link.getParameterMetadata(name);
  }

  private hasParameterValue(name: string): boolean {
    return this.getParameterEntry(name) != null;
  }

  private resolveTitle(name: string, metadata: ParameterMetadata | undefined): string {
    return metadata?.displayName?.trim() || name;
  }

  private resolveDescription(metadata: ParameterMetadata | undefined, isAvailable: boolean): string {
    const baseDescription = metadata?.description?.trim() ?? '';

    if (isAvailable) {
      return baseDescription;
    }

    if (baseDescription.length > 0) {
      return `${baseDescription} Parametre non synchronise.`;
    }

    return 'Parametre non synchronise.';
  }

  private resolveEditorType(metadata: ParameterMetadata | undefined): ParamTableEditorType {
    if (!metadata) {
      return 'number';
    }

    if (metadata.values.has(0) && metadata.values.has(1) && metadata.values.size === 2) {
      return 'checkbox';
    }

    if (metadata.values.size > 0) {
      return 'select';
    }

    return 'number';
  }

  private resolveDisplayValue(
    parameterEntry: ParameterEntry | undefined,
    metadata: ParameterMetadata | undefined,
    type: ParamTableEditorType,
    options: ReadonlyArray<ParamTableOption> | undefined
  ): ParamTableValue {
    if (type === 'checkbox') {
      return (parameterEntry?.value ?? 0) !== 0;
    }

    if (type === 'select') {
      if (parameterEntry) {
        return parameterEntry.value;
      }

      return '';
    }

    if (!parameterEntry) {
      return metadata?.min ?? 0;
    }

    return this.link.getRoundedParameterValue(parameterEntry.name) ?? parameterEntry.value;
  }

  private buildOptions(metadata: ParameterMetadata | undefined): ReadonlyArray<ParamTableOption> {
    if (!metadata) {
      return [];
    }

    return Array.from(metadata.values.entries())
      .sort(([left], [right]) => left - right)
      .map(([value, label]) => ({ value, label }));
  }

  private buildHelpItems(metadata: ParameterMetadata | undefined): ReadonlyArray<InfoBulleItem> {
    if (!metadata) {
      return [];
    }

    const items: InfoBulleItem[] = [];

    if (metadata.units) {
      items.push({ label: 'Unites', value: metadata.units });
    }

    if (metadata.min != null || metadata.max != null) {
      items.push({
        label: 'Plage',
        value: `${metadata.min ?? '-inf'} a ${metadata.max ?? '+inf'}`,
      });
    }

    if (metadata.increment != null) {
      items.push({ label: 'Pas', value: String(metadata.increment) });
    }

    if (metadata.user) {
      items.push({ label: 'Profil', value: metadata.user });
    }

    if (metadata.readOnly) {
      items.push({ label: 'Acces', value: 'Lecture seule' });
    }

    if (metadata.rebootRequired) {
      items.push({ label: 'Redemarrage', value: 'Requis' });
    }

    for (const [code, label] of Array.from(metadata.values.entries()).sort(([left], [right]) => left - right)) {
      items.push({ label: `Valeur ${code}`, value: label });
    }

    return items;
  }

  private buildBitmaskHelpItems(
    metadata: ParameterMetadata,
    bitIndex: number
  ): ReadonlyArray<InfoBulleItem> {
    const items = [...this.buildHelpItems(metadata)];
    items.unshift({ label: 'Bit', value: String(bitIndex) });
    return items;
  }

  private buildBitmaskRowName(parameterName: string, bitIndex: number): string {
    return `${parameterName}${ParamBuilderService.BITMASK_ROW_NAME_SEPARATOR}${bitIndex}`;
  }

  private resolveBitmaskValue(value: number, bitIndex: number): boolean {
    if (!Number.isFinite(value) || bitIndex < 0) {
      return false;
    }

    const mask = Math.pow(2, bitIndex);
    return Math.floor(value) % (mask * 2) >= mask;
  }

  private parseBitmaskRowName(name: string): { parameterName: string; bitIndex: number } | null {
    const separatorIndex = name.indexOf(ParamBuilderService.BITMASK_ROW_NAME_SEPARATOR);
    if (separatorIndex < 0) {
      return null;
    }

    const parameterName = name.slice(0, separatorIndex).trim();
    const bitIndexText = name.slice(separatorIndex + ParamBuilderService.BITMASK_ROW_NAME_SEPARATOR.length).trim();
    const bitIndex = Number(bitIndexText);

    if (!parameterName || !Number.isInteger(bitIndex) || bitIndex < 0) {
      return null;
    }

    return { parameterName, bitIndex };
  }

  private resolveBitmaskWriteRequest(
    parameterName: string,
    bitIndex: number,
    value: ParamTableValue
  ): ParamBuilderWriteRequest | null {
    const numericValue = this.toNumericValue(value);
    if (numericValue == null) {
      return null;
    }

    const shouldEnableBit = numericValue !== 0;
    const currentValue = this.getParameterEntry(parameterName)?.value ?? 0;
    const currentInteger = Number.isFinite(currentValue) ? Math.trunc(currentValue) : 0;
    const mask = Math.pow(2, bitIndex);
    const bitCurrentlyEnabled = this.resolveBitmaskValue(currentInteger, bitIndex);

    let nextValue = currentInteger;

    if (shouldEnableBit && !bitCurrentlyEnabled) {
      nextValue += mask;
    }

    if (!shouldEnableBit && bitCurrentlyEnabled) {
      nextValue -= mask;
    }

    return {
      name: parameterName,
      value: this.normalizeNumberValue(parameterName, nextValue),
    };
  }

  private toNumericValue(value: ParamTableValue): number | null {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }

    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
  }

  private normalizeNumberValue(name: string, value: number): number {
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