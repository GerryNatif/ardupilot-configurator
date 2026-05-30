import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SaveParam } from '../../../core/parameter/param-page/save-param';

@Component({
  selector: 'app-save-btn',
  imports: [],
  templateUrl: './save-btn.html',
  styleUrl: './save-btn.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveBtn {
  private readonly saveParam = inject(SaveParam);

  readonly state = this.saveParam.state;

  async onSave(): Promise<void> {
    await this.saveParam.triggerSave();
  }
}
