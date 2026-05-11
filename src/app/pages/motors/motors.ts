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
  

  /* Paramètres utiles pour les moteurs et ESC, comme les types de PWM, les limites de PWM, les paramètres de spin, etc.
SERVO_RATE: Servo default output rate
SERVO_DSHOT_RATE: Servo DShot output rate
SERVO_DSHOT_ESC: Servo DShot ESC type

SERVO_BLH_BDMASK: a bitmap used to enable BLHeli32, AM32, or BLHeli_S bi-directional DShot support. On autopilots without IOMCU this would normally be set to 15 to indicate four active channels. On autopilots with an IOMCU this can be set to 3840 to indicate four active AUX channels (bi-directional DShot will only work on the AUX outputs).
SERVO_BLH_POLES defaults to 14 which applies to the majority of brushless motors and normally does not need to be changed. Adjust as required if you’re using motors with a pole count other than 14 to calculate true motor shaft RPM from ESC’s e-field RPM (small motors might have 12 poles).
SERVO_DSHOT_ESC must be set to the type of Dshot ESC you are using.


SERVO1_MIN: Minimum PWM
SERVO1_MAX: Maximum PWM
SERVO1_TRIM: Trim PWM
SERVO1_REVERSED: Servo reverse
SERVO1_FUNCTION: Servo output function




  */