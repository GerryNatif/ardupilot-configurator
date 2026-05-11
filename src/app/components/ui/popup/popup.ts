import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-popup',
  imports: [],
  templateUrl: './popup.html',
  styleUrl: './popup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class Popup {
  readonly open = input(false);
  readonly title = input("L'application doit etre mise a jour");
  readonly confirmLabel = input('Oui');
  readonly cancelLabel = input('Non');
  readonly closeOnBackdrop = input(true);
  readonly closeOnEscape = input(true);
  readonly showDefaultActions = input(true);

  readonly confirm = output<void>();
  readonly cancel = output<void>();
  readonly closed = output<'confirm' | 'cancel' | 'backdrop' | 'escape'>();

  onConfirm(): void {
    this.confirm.emit();
    this.closed.emit('confirm');
  }

  onCancel(): void {
    this.cancel.emit();
    this.closed.emit('cancel');
  }

  onBackdropClick(event: MouseEvent): void {
    if (!this.closeOnBackdrop()) {
      return;
    }

    if (event.target === event.currentTarget) {
      this.cancel.emit();
      this.closed.emit('backdrop');
    }
  }

  onEscape(): void {
    if (!this.open() || !this.closeOnEscape()) {
      return;
    }

    this.cancel.emit();
    this.closed.emit('escape');
  }
}
