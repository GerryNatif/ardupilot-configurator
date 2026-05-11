import { Injectable, computed, signal } from '@angular/core';
import { AppError } from './app-error';

export interface UiErrorState {
  readonly open: boolean;
  readonly titleKey: string;
  readonly messageKey: string;
  readonly messageParams?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class UiErrorService {
  private readonly stateSig = signal<UiErrorState>({
    open: false,
    titleKey: 'errors.titles.generic',
    messageKey: 'errors.unexpected',
  });

  readonly state = computed(() => this.stateSig());

  /**
   * Display the error dialog.
   * @param error  An AppError (carries an i18n key) or any other thrown value.
   * @param titleKey  i18n key for the dialog title.
   */
  show(error: unknown, titleKey = 'errors.titles.generic'): void {
    const { messageKey, messageParams } = this.resolveMessage(error);
    this.stateSig.set({ open: true, titleKey, messageKey, messageParams });
  }

  close(): void {
    this.stateSig.update((current) => ({ ...current, open: false }));
  }

  private resolveMessage(error: unknown): { messageKey: string; messageParams?: Record<string, unknown> } {
    if (error instanceof AppError) {
      return { messageKey: error.key, messageParams: error.params };
    }
    return { messageKey: 'errors.unexpected' };
  }
}