import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
  ParamTable,
  ParamTableValueChangeEvent,
} from '../../components/ui/param-table/param-table';
import { TitlePage } from '../../components/ui/title-page/title-page';
import { ParameterDraftSession } from '../../core/parameter/param-page/parameter-draft-session';
import { ParamPageBase } from '../../core/parameter/param-page/param-page-base';
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
  selector: 'app-rtl',
  imports: [TitlePage, ParamTable, RtlVisualizer],
  templateUrl: './rtl.html',
  styleUrl: './rtl.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ParameterDraftSession],
})
export class Rtl extends ParamPageBase {
  private static readonly SAVE_CONTEXT_ID = 'rtl';

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
    this.draftSession.start(Rtl.SAVE_CONTEXT_ID);
  }

  onFailsafeParameterValueChange(event: ParamTableValueChangeEvent): void {
    this.onParameterChange(event);
  }
}
