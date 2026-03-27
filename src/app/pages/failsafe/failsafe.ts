import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
  ParamTable,
  ParamTableValueChangeEvent,
} from '../../components/ui/param-table/param-table';
import { TitlePage } from '../../components/ui/title-page/title-page';
import { ParameterDraftSession } from '../../core/services/parameter-draft-session';
import { ParamPageBase } from '../../core/services/param-page-base';
import { RtlVisualizer } from "../../components/rtl-visualizer/rtl-visualizer";


const FAILSAFE_PARAMETER_NAMES: ReadonlyArray<string> = [
  'RTL_CLIMB_MIN',
  'RTL_ALT',
  'RTL_ALT_FINAL',
  'RTL_SPEED',
  'RTL_CONE_SLOPE',
  'RTL_LOIT_TIME',
  'RTL_ALT_TYPE',
  'LAND_SPD_MS',
];

@Component({
  selector: 'app-failsafe',
  imports: [TitlePage, ParamTable, RtlVisualizer],
  templateUrl: './failsafe.html',
  styleUrl: './failsafe.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ParameterDraftSession],
})
export class Failsafe extends ParamPageBase {
  private static readonly SAVE_CONTEXT_ID = 'failsafe';

  private readonly failsafeSectionBase = this.paramBuilder.buildSectionSignal({
    id: 'failsafe-main',
    title: 'FailSafe',
    parameterNames: FAILSAFE_PARAMETER_NAMES,
    display: {
      showName: false,
      showTitle: true,
      showDescription: false,
      showHelp: true,
    },
    includeUnavailable: true,
  });

  readonly failsafeSection = computed(() => this.withDrafts(this.failsafeSectionBase()));

  constructor() {
    super();
    this.draftSession.start(Failsafe.SAVE_CONTEXT_ID);
  }

  onFailsafeParameterValueChange(event: ParamTableValueChangeEvent): void {
    this.onParameterChange(event);
  }
}
