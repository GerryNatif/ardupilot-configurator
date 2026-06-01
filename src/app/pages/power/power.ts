import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  ParamTable,
  ParamTableValue,
  ParamTableValueChangeEvent,
} from '../../components/ui/param-table/param-table';
import { TitlePage, TitlePageAction } from '../../components/ui/title-page/title-page';
import { ParameterDraftSession } from '../../core/parameter/param-page/parameter-draft-session';
import { ParamPageBase } from '../../core/parameter/param-page/param-page-base';
import CHEMISTRY_DATA from '../../../assets/data/battery-chemistries.json';

interface BatteryChemistry {
  readonly id: string;
  readonly name: string;
  readonly cellVoltages: {
    readonly max: number;
    readonly low: number;
    readonly critical: number;
    readonly arm: number;
  };
}

const CHEMISTRIES: ReadonlyArray<BatteryChemistry> = CHEMISTRY_DATA;
const CELL_COUNTS: ReadonlyArray<number> = Array.from({ length: 14 }, (_, i) => i + 1);

const BATT_COMMON_BASE_NAMES: ReadonlyArray<string> = [
  'MONITOR',
  'CAPACITY',
  'MAX_VOLT',
  'LOW_VOLT',
  'CRT_VOLT',
  'LOW_MAH',
  'CRT_MAH',
  'ARM_VOLT',
  'ARM_MAH',
  'FS_VOLTSRC',
  'FS_LOW_ACT',
  'FS_CRT_ACT',
  'LOW_TIMER',
  'OPTIONS',
];

const VOLTAGE_FILL_BASE_NAMES: ReadonlyArray<string> = ['MAX_VOLT', 'LOW_VOLT', 'CRT_VOLT', 'ARM_VOLT'];
const LOG_BITMASK_PARAM = 'LOG_BITMASK';
const MAX_BATTERY_INDEX = 9;

function battParamName(index: number, baseName: string): string {
  const prefix = index === 1 ? 'BATT_' : `BATT${index}_`;
  return `${prefix}${baseName}`;
}

function getTypeSpecificBaseNames(monitorType: number): ReadonlyArray<string> {
  if (monitorType === 3) {
    return ['VOLT_PIN', 'VOLT_MULT', 'AMP_OFFSET', 'VLT_OFFSET'];
  }
  if (monitorType === 4) {
    return ['VOLT_PIN', 'CURR_PIN', 'VOLT_MULT', 'AMP_PERVLT', 'AMP_OFFSET', 'VLT_OFFSET'];
  }
  if (monitorType === 25) {
    return ['VOLT_PIN', 'VOLT_MULT', 'AMP_PERVLT', 'AMP_OFFSET'];
  }
  if (monitorType === 8) {
    return ['SERIAL_NUM', 'CURR_MULT'];
  }
  if (monitorType === 7 || (monitorType >= 13 && monitorType <= 19)) {
    return ['SERIAL_NUM', 'CURR_MULT'];
  }
  if (monitorType === 9) {
    return ['ESC_INDEX', 'ESC_MASK'];
  }
  if (monitorType === 10) {
    return ['SUM_MASK'];
  }
  return [];
}

@Component({
  selector: 'app-power',
  imports: [TitlePage, ParamTable],
  templateUrl: './power.html',
  styleUrl: './power.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ParameterDraftSession],
})
export class Power extends ParamPageBase {
  private static readonly SAVE_CONTEXT_ID = 'power';

  private readonly locallyAddedIndices = signal<ReadonlyArray<number>>([]);
  private readonly selectedChemistries = signal<Record<number, string>>({});
  private readonly selectedCellCounts = signal<Record<number, number>>({});
  // Tracks voltage params manually edited after the last auto-fill per battery index
  private readonly protectedVoltageParams = signal<Record<number, ReadonlySet<string>>>({});

  readonly chemistries = CHEMISTRIES;
  readonly cellCounts = CELL_COUNTS;

  readonly displayedBatteryIndices = computed<ReadonlyArray<number>>(() => {
    const paramStore = this.link.parameterState();
    const added = this.locallyAddedIndices();
    const result = new Set<number>();

    for (let i = 1; i <= MAX_BATTERY_INDEX; i++) {
      const storeValue = paramStore.byName.get(battParamName(i, 'MONITOR'))?.value ?? 0;
      if (storeValue > 0) {
        result.add(i);
      }
    }
    added.forEach(i => result.add(i));

    return Array.from(result).sort((a, b) => a - b);
  });

  readonly canAddBattery = computed(() => this.displayedBatteryIndices().length < MAX_BATTERY_INDEX);

  readonly addBatteryAction = computed<ReadonlyArray<TitlePageAction>>(() => [
    { id: 'add-battery', label: 'Ajouter une alimentation', disabled: !this.canAddBattery() },
  ]);

  readonly batteryConfigs = computed(() => {
    const draftValues = this.draftSession.draftValues();
    const paramStore = this.link.parameterState();

    return this.displayedBatteryIndices().map(index => {
      const monitorParam = battParamName(index, 'MONITOR');
      const monitorType = draftValues[monitorParam] ?? paramStore.byName.get(monitorParam)?.value ?? 0;

      const paramNames = [
        ...BATT_COMMON_BASE_NAMES.map(base => battParamName(index, base)),
        ...getTypeSpecificBaseNames(monitorType).map(base => battParamName(index, base)),
      ];

      const section = this.withDrafts(
        this.paramBuilder.buildSection({
          id: `battery-${index}`,
          title: `Batterie ${index}`,
          parameterNames: paramNames,
          display: {
            showName: false,
            showTitle: true,
            showDescription: false,
            showHelp: true,
          },
          includeUnavailable: true,
        }),
      );

      return { index, section, monitorType };
    });
  });

  private readonly logBitmaskSectionBase = this.paramBuilder.buildBitmaskSectionSignal({
    id: 'power-log-bitmask',
    title: 'Journalisation',
    parameterNames: [LOG_BITMASK_PARAM],
    display: {
      showName: false,
      showTitle: true,
      showDescription: false,
      showHelp: true,
    },
    includeUnavailable: true,
  });

  readonly logBitmaskSection = computed(() => this.withDrafts(this.logBitmaskSectionBase()));

  constructor() {
    super();
    this.draftSession.start(Power.SAVE_CONTEXT_ID);
  }

  isVoltageMeasurementType(monitorType: number): boolean {
    return monitorType === 3 || monitorType === 4 || monitorType === 25;
  }

  getSelectedChemistry(index: number): string {
    return this.selectedChemistries()[index] ?? '';
  }

  getSelectedCellCount(index: number): number {
    return this.selectedCellCounts()[index] ?? 1;
  }

  addBattery(): void {
    if (!this.canAddBattery()) {
      return;
    }
    const displayed = this.displayedBatteryIndices();
    for (let i = 1; i <= MAX_BATTERY_INDEX; i++) {
      if (!displayed.includes(i)) {
        this.locallyAddedIndices.update(arr => [...arr, i]);
        break;
      }
    }
  }

  onChemistryChange(index: number, chemistryId: string): void {
    this.selectedChemistries.update(s => ({ ...s, [index]: chemistryId }));
    // Fresh chemistry intent: clear manual-edit protection for this battery
    this.protectedVoltageParams.update(m => ({ ...m, [index]: new Set<string>() }));
    const cellCount = this.selectedCellCounts()[index] ?? 1;
    if (chemistryId) {
      this.applyChemistryFill(index, chemistryId, cellCount);
    }
  }

  onCellCountChange(index: number, cellCount: number): void {
    this.selectedCellCounts.update(s => ({ ...s, [index]: cellCount }));
    const chemistryId = this.selectedChemistries()[index] ?? '';
    if (chemistryId) {
      this.applyChemistryFill(index, chemistryId, cellCount);
    }
  }

  onParameterValueChange(event: ParamTableValueChangeEvent): void {
    this.trackManualVoltageEdit(event.name);
    this.clearChemistryOnMonitorChange(event.name, event.value);
    this.onParameterChange(event);
  }

  private applyChemistryFill(index: number, chemistryId: string, cellCount: number): void {
    const chemistry = CHEMISTRIES.find(c => c.id === chemistryId);
    if (!chemistry || cellCount < 1) {
      return;
    }

    const protected_ = this.protectedVoltageParams()[index] ?? new Set<string>();
    const round2 = (v: number): number => Math.round(v * 100) / 100;

    const fills: ReadonlyArray<[string, number]> = [
      ['MAX_VOLT', round2(chemistry.cellVoltages.max * cellCount)],
      ['LOW_VOLT', round2(chemistry.cellVoltages.low * cellCount)],
      ['CRT_VOLT', round2(chemistry.cellVoltages.critical * cellCount)],
      ['ARM_VOLT', round2(chemistry.cellVoltages.arm * cellCount)],
    ];

    for (const [base, value] of fills) {
      if (!protected_.has(base)) {
        this.onParameterChange({ name: battParamName(index, base), value });
      }
    }
  }

  // Marks a voltage threshold param as manually edited (protected from future cell-count auto-fill)
  private trackManualVoltageEdit(paramName: string): void {
    for (let i = 1; i <= MAX_BATTERY_INDEX; i++) {
      for (const base of VOLTAGE_FILL_BASE_NAMES) {
        if (paramName === battParamName(i, base)) {
          this.protectedVoltageParams.update(m => ({
            ...m,
            [i]: new Set([...(m[i] ?? []), base]),
          }));
          return;
        }
      }
    }
  }

  // Clears chemistry state when MONITOR changes to a non-voltage type
  private clearChemistryOnMonitorChange(paramName: string, value: ParamTableValue): void {
    for (let i = 1; i <= MAX_BATTERY_INDEX; i++) {
      if (paramName === battParamName(i, 'MONITOR')) {
        const newMonitorType = typeof value === 'number' ? value : 0;
        if (!this.isVoltageMeasurementType(newMonitorType)) {
          this.selectedChemistries.update(s => { const next = { ...s }; delete next[i]; return next; });
          this.selectedCellCounts.update(s => { const next = { ...s }; delete next[i]; return next; });
          this.protectedVoltageParams.update(m => { const next = { ...m }; delete next[i]; return next; });
        }
        return;
      }
    }
  }
}
