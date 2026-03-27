import {
  ChangeDetectionStrategy,
  Component,
  computed,
} from '@angular/core';
import {
  ParamTable,
  ParamTableValueChangeEvent,
} from '../../components/ui/param-table/param-table';
import { TitlePage } from '../../components/ui/title-page/title-page';
import { ParameterDraftSession } from '../../core/services/parameter-draft-session';
import { ParamPageBase } from '../../core/services/param-page-base';

const POWER_PARAMETER_NAMES: ReadonlyArray<string> = [
  'BATT_MONITOR',
  'BATT_VOLT_PIN',
  'BATT_CAPACITY',
  'BATT_MAX_VOLT',
  'BATT_LOW_VOLT',
  'BATT_CRT_VOLT',
  'BATT_LOW_MAH',
  'BATT_CRT_MAH',
  'BATT_FS_VOLTSRC',
  'BATT_FS_LOW_ACT',
];

const POWER_LOG_BITMASK_PARAMETER_NAME = 'LOG_BITMASK';

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

  private readonly powerSectionBase = this.paramBuilder.buildSectionSignal({
    id: 'power-main',
    title: 'Batterie',
    parameterNames: POWER_PARAMETER_NAMES,
    display: {
      showName: false,
      showTitle: true,
      showDescription: false,
      showHelp: true,
    },
    includeUnavailable: true,
  });

  private readonly logBitmaskSectionBase = this.paramBuilder.buildBitmaskSectionSignal({
    id: 'power-log-bitmask',
    title: 'Journalisation',
    parameterNames: [POWER_LOG_BITMASK_PARAMETER_NAME],
    display: {
      showName: false,
      showTitle: true,
      showDescription: false,
      showHelp: true,
    },
    includeUnavailable: true,
  });

  readonly powerSection = computed(() => this.withDrafts(this.powerSectionBase()));
  readonly logBitmaskSection = computed(() => this.withDrafts(this.logBitmaskSectionBase()));

  constructor() {
    super();
    this.draftSession.start(Power.SAVE_CONTEXT_ID);
  }

  onPowerParameterValueChange(event: ParamTableValueChangeEvent): void {
    this.onParameterChange(event);
  }
}
