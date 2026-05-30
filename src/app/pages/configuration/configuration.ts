import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TitlePage } from '../../components/ui/title-page/title-page';
import {
  ParamTable,
  ParamTableValueChangeEvent,
} from '../../components/ui/param-table/param-table';
import { ParamSectionDef } from '../../core/parameter/param-builder/param-builder.service';
import { ParameterDraftSession } from '../../core/parameter/param-page/parameter-draft-session';
import { ParamPageBase } from '../../core/parameter/param-page/param-page-base';

const ARMING_PARAMETER_NAMES: ReadonlyArray<string> = [
  'ANGLE_MAX_ARMING',
  'GYRO_CAL_ON_FIRST_ARM',
];

const OTHER_FEATURES_PARAMETER_NAMES: ReadonlyArray<string> = [
  'AHRS_ORIENTATION',
  'NTF_BUZZ_TYPES',
  'NTF_BUZZ_VOLUME',
];

const CONFIGURATION_SECTIONS: ReadonlyArray<ParamSectionDef> = [
  {
    id: 'configuration-arming',
    title: 'Arme',
    parameterNames: ARMING_PARAMETER_NAMES,
    display: {
      showName: false,
      showTitle: true,
      showDescription: true,
      showHelp: true,
    },
    includeUnavailable: true,
  },
  {
    id: 'configuration-other-features',
    title: 'Autres fonctionnalites',
    parameterNames: OTHER_FEATURES_PARAMETER_NAMES,
    display: {
      showName: true,
      showTitle: true,
      showDescription: false,
      showHelp: true,
    },
    includeUnavailable: true,
  },
];

@Component({
  selector: 'app-configuration',
  imports: [TitlePage, ParamTable],
  templateUrl: './configuration.html',
  styleUrl: './configuration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ParameterDraftSession],
})
export class Configuration extends ParamPageBase {
  private static readonly SAVE_CONTEXT_ID = 'configuration';

  private readonly parameterSectionsBase = this.paramBuilder.buildSectionsSignal(CONFIGURATION_SECTIONS);

  readonly parameterSections = computed(() =>
    this.parameterSectionsBase().map((section) => this.withDrafts(section))
  );

  constructor() {
    super();
    this.draftSession.start(Configuration.SAVE_CONTEXT_ID);
  }

  onParameterValueChange(event: ParamTableValueChangeEvent): void {
    this.onParameterChange(event);
  }
}


/*
BATT_ARM_VOLT
BATT_ARM_MAH
*/