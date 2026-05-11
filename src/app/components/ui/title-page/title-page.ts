import { Component, computed, input, output } from '@angular/core';

export interface TitlePageAction {
  readonly id: string;
  readonly label: string;
  readonly url?: string;
  readonly target?: string;
  readonly disabled?: boolean;
}

@Component({
  selector: 'app-title-page',
  standalone: true,
  imports: [],
  templateUrl: './title-page.html',
  styleUrl: './title-page.scss',
})
export class TitlePage {
  title = input.required<string>();
  actionLabel = input<string>('');
  actionUrl = input<string>('');
  actionTarget = input<string>('_blank');
  actions = input<ReadonlyArray<TitlePageAction>>([]);

  readonly actionTriggered = output<TitlePageAction>();

  readonly resolvedActions = computed<ReadonlyArray<TitlePageAction>>(() => {
    const explicitActions = this.actions();
    if (explicitActions.length > 0) {
      return explicitActions;
    }

    if (this.actionUrl()) {
      return [
        {
          id: 'default-action',
          label: this.actionLabel(),
          url: this.actionUrl(),
          target: this.actionTarget(),
        },
      ];
    }

    return [];
  });

  onActionClick(action: TitlePageAction, event?: Event): void {
    if (action.disabled) {
      event?.preventDefault();
      return;
    }

    this.actionTriggered.emit(action);
  }
}