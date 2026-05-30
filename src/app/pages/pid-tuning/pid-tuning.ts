import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PidTable, PidParameterDraftChange } from '../../components/pid-table/pid-table';
import { TitlePage } from '../../components/ui/title-page/title-page';
import { DroneLinkFacade } from '../../core/mavlink/facade/drone-link.facade';
import { ParameterDraftSession } from '../../core/parameter/param-page/parameter-draft-session';

@Component({
  selector: 'app-pid-tuning',
  standalone: true,
  imports: [PidTable, TitlePage],
  templateUrl: './pid-tuning.html',
  styleUrls: ['./pid-tuning.scss'],
  providers: [ParameterDraftSession],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PidTuning {
  private static readonly SAVE_CONTEXT_ID = 'pid-tuning';

  private readonly link = inject(DroneLinkFacade);
  private readonly draftSession = inject(ParameterDraftSession);

  readonly draftValues = this.draftSession.draftValues;

  constructor() {
    this.draftSession.start(PidTuning.SAVE_CONTEXT_ID);
  }

  onPidDraftChange(event: PidParameterDraftChange): void {
    const current = this.link.parameterState().byName.get(event.name)?.value;
    this.draftSession.setChange(
      {
        name: event.name,
        value: event.value,
        rebootRequired: event.rebootRequired,
      },
      current
    );
  }
}

/*
KDE_NPOLE
*/