import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  ParamTable,
  ParamTableValueChangeEvent,
} from '../../components/ui/param-table/param-table';
import { TitlePage, TitlePageAction } from '../../components/ui/title-page/title-page';
import { ParameterDraftSession } from '../../core/parameter/param-page/parameter-draft-session';
import { ParamPageBase } from '../../core/parameter/param-page/param-page-base';

// Base names shared by all battery instances (MONITOR is always first)
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

const LOG_BITMASK_PARAM = 'LOG_BITMASK';
const MAX_BATTERY_INDEX = 9;

// BATT_ for index 1, BATT{N}_ for index 2–9
function battParamName(index: number, baseName: string): string {
  const prefix = index === 1 ? 'BATT_' : `BATT${index}_`;
  return `${prefix}${baseName}`;
}

// Returns type-specific base parameter names based on BATT_MONITOR value
function getTypeSpecificBaseNames(monitorType: number): ReadonlyArray<string> {
  // Analog voltage only
  if (monitorType === 3) {
    return ['VOLT_PIN', 'VOLT_MULT', 'AMP_OFFSET', 'VLT_OFFSET'];
  }
  // Analog voltage + current
  if (monitorType === 4) {
    return ['VOLT_PIN', 'CURR_PIN', 'VOLT_MULT', 'AMP_PERVLT', 'AMP_OFFSET', 'VLT_OFFSET'];
  }
  // Synthetic current sensor
  if (monitorType === 25) {
    return ['VOLT_PIN', 'VOLT_MULT', 'AMP_PERVLT', 'AMP_OFFSET'];
  }
  // DroneCAN
  if (monitorType === 8) {
    return ['SERIAL_NUM', 'CURR_MULT'];
  }
  // SMBus generic + variants (types 7 and 13–19)
  if (monitorType === 7 || (monitorType >= 13 && monitorType <= 19)) {
    return ['SERIAL_NUM', 'CURR_MULT'];
  }
  // ESC telemetry
  if (monitorType === 9) {
    return ['ESC_INDEX', 'ESC_MASK'];
  }
  // Sum of selected monitors
  if (monitorType === 10) {
    return ['SUM_MASK'];
  }
  return [];
}

@Component({
  selector: 'app-power',
  imports: [TitlePage, ParamTable],
  templateUrl: './power.html',
  styleUrls: ['./power.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ParameterDraftSession],
})
export class Power extends ParamPageBase {
  private static readonly SAVE_CONTEXT_ID = 'power';

  private readonly locallyAddedIndices = signal<ReadonlyArray<number>>([]);

  // Indices of batteries that are either stored with MONITOR > 0 or locally added
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

  // One merged section per battery: common params + type-specific params
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

      return { index, section };
    });
  });

  constructor() {
    super();
    this.draftSession.start(Power.SAVE_CONTEXT_ID);
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

  onParameterValueChange(event: ParamTableValueChangeEvent): void {
    this.onParameterChange(event);
  }
}
