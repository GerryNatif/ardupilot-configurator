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
import { ParameterDraftSession } from '../../core/services/param-page/parameter-draft-session';
import { ParamPageBase } from '../../core/services/param-page/param-page-base';

const POWER_PARAMETER_NAMES: ReadonlyArray<string> = [
  'MOT_PWM_TYPE',
  'MOT_PWM_MIN',
  'MOT_PWM_MAX',
  'SERVO_BLH_POLES',
  'MOT_SPIN_ARM',
  'MOT_SPIN_MIN',
  'MOT_SPIN_MAX',
];

const POWER_LOG_BITMASK_PARAMETER_NAME = 'LOG_BITMASK';

@Component({
  selector: 'app-power',
  imports: [TitlePage, ParamTable],
  templateUrl: './motors.html',
  styleUrl: './motors.scss',changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ParameterDraftSession],
  })
  export class Motors extends ParamPageBase {
    private static readonly SAVE_CONTEXT_ID = 'motors';
  
    private readonly powerSectionBase = this.paramBuilder.buildSectionSignal({
      id: 'motors-main',
      title: 'Fonctionnalités ESC / Moteurs',
      parameterNames: POWER_PARAMETER_NAMES,
      display: {
        showName: false,
        showTitle: true,
        showDescription: false,
        showHelp: true,
      },
      includeUnavailable: true,
    });
  
  
    readonly powerSection = computed(() => this.withDrafts(this.powerSectionBase()));
  
    constructor() {
      super();
      this.draftSession.start(Motors.SAVE_CONTEXT_ID);
    }
  
    onPowerParameterValueChange(event: ParamTableValueChangeEvent): void {
      this.onParameterChange(event);
    }
  }
  