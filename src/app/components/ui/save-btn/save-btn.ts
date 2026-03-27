import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SaveBar } from '../../../core/services/save-bar';

@Component({
  selector: 'app-save-btn',
  imports: [],
  templateUrl: './save-btn.html',
  styleUrl: './save-btn.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveBtn {
  private readonly saveBar = inject(SaveBar);

  readonly state = this.saveBar.state;

  async onSave(): Promise<void> {
    await this.saveBar.triggerSave();
  }
}
