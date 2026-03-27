import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { InfoBulle, InfoBulleItem } from '../info-bulle/info-bulle';
import { GuiBox } from '../gui-box/gui-box';

export type ParamTableValue = boolean | number | string;
export type ParamTableEditorType = 'checkbox' | 'number' | 'select';

export interface ParamTableOption {
  readonly value: number | string;
  readonly label: string;
}

export interface ParamTableDisplayOptions {
  readonly showName?: boolean;
  readonly showTitle?: boolean;
  readonly showDescription?: boolean;
  readonly showHelp?: boolean;
}

export interface ParamTableRow {
  readonly name: string;
  readonly type: ParamTableEditorType;
  readonly value: ParamTableValue;
  readonly unavailable?: boolean;
  readonly unit?: string;
  readonly title?: string;
  readonly description?: string;
  readonly helpTitle?: string;
  readonly helpDescription?: string;
  readonly helpItems?: ReadonlyArray<InfoBulleItem>;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly options?: ReadonlyArray<ParamTableOption>;
  readonly disabled?: boolean;
}

export interface ParamTableSection {
  readonly id: string;
  readonly title: string;
  readonly display?: ParamTableDisplayOptions;
  readonly rows: ReadonlyArray<ParamTableRow>;
}

export interface ParamTableValueChangeEvent {
  readonly name: string;
  readonly value: ParamTableValue;
}

@Component({
  selector: 'app-param-table',
  imports: [GuiBox, InfoBulle],
  templateUrl: './param-table.html',
  styleUrl: './param-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParamTable {
  private static readonly DEFAULT_DISPLAY_OPTIONS: Required<ParamTableDisplayOptions> = {
    showName: true,
    showTitle: true,
    showDescription: true,
    showHelp: true,
  };

  readonly section = input.required<ParamTableSection>();
  readonly disabled = input(false);
  readonly showHeader = input(false);

  readonly valueChange = output<ParamTableValueChangeEvent>();

  readonly display = computed(() => ({
    ...ParamTable.DEFAULT_DISPLAY_OPTIONS,
    ...this.section().display,
  }));

  hasHelp(row: ParamTableRow): boolean {
    return Boolean(
      row.helpTitle?.trim() ||
        row.helpDescription?.trim() ||
        row.description?.trim() ||
        row.title?.trim() ||
        row.helpItems?.length
    );
  }

  getHelpTitle(row: ParamTableRow): string {
    return row.helpTitle?.trim() || row.title?.trim() || row.name;
  }

  getHelpDescription(row: ParamTableRow): string {
    return row.helpDescription?.trim() || row.description?.trim() || '';
  }

  getOptionValue(option: ParamTableOption): string {
    return String(option.value);
  }

  isOptionSelected(row: ParamTableRow, option: ParamTableOption): boolean {
    if (row.unavailable === true) {
      return false;
    }

    return this.getOptionValue(option) === String(row.value);
  }

  isRowDisabled(row: ParamTableRow): boolean {
    return this.disabled() || row.disabled === true;
  }

  getNumberInputWidth(row: ParamTableRow): string {
    const decimals = this.resolveDecimalCount(row);
    const candidates = [row.min, row.max, this.toFiniteNumber(row.value)]
      .filter((value): value is number => value != null)
      .map((value) => this.formatNumberForWidth(value, decimals));

    const maxChars = Math.max(...candidates.map((value) => value.length), 1);
    const widthCh = Math.max(4, maxChars + 1);

    return `${widthCh}ch`;
  }

  onCheckboxChange(row: ParamTableRow, event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    this.valueChange.emit({
      name: row.name,
      value: inputElement?.checked ?? false,
    });
  }

  onNumberChange(row: ParamTableRow, event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    if (!inputElement) {
      return;
    }

    const nextValue = Number(inputElement.value);
    if (!Number.isFinite(nextValue)) {
      return;
    }

    this.valueChange.emit({
      name: row.name,
      value: nextValue,
    });
  }

  onSelectChange(row: ParamTableRow, event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    if (!selectElement) {
      return;
    }

    this.valueChange.emit({
      name: row.name,
      value: this.resolveSelectValue(row, selectElement.value),
    });
  }

  private resolveSelectValue(row: ParamTableRow, rawValue: string): string | number {
    const matchingOption = row.options?.find((option) => String(option.value) === rawValue);
    return matchingOption?.value ?? rawValue;
  }

  private resolveDecimalCount(row: ParamTableRow): number {
    if (typeof row.step === 'number' && Number.isFinite(row.step)) {
      return this.countDecimals(row.step);
    }

    const values = [row.min, row.max, this.toFiniteNumber(row.value)].filter(
      (value): value is number => value != null
    );

    return values.reduce((maxDecimals, value) => Math.max(maxDecimals, this.countDecimals(value)), 0);
  }

  private formatNumberForWidth(value: number, decimals: number): string {
    if (decimals > 0) {
      return value.toFixed(decimals);
    }

    return Number.isInteger(value) ? String(value) : String(value);
  }

  private toFiniteNumber(value: ParamTableValue): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
  }

  private countDecimals(value: number): number {
    const text = value.toString();
    if (!text.includes('.')) {
      return 0;
    }

    return text.split('.')[1]?.length ?? 0;
  }
}