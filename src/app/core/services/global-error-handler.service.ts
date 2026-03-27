import { ErrorHandler, Injectable, inject } from '@angular/core';
import { UiErrorService } from './ui-error.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  private readonly uiError = inject(UiErrorService);

  handleError(error: unknown): void {
    const normalized = this.normalizeError(error);
    this.uiError.show(normalized, 'errors.titles.unexpected');
    console.error(error);
  }

  private normalizeError(error: unknown): unknown {
    if (this.isErrorWithOriginalError(error)) {
      return error.originalError;
    }

    if (this.isErrorWithRejection(error)) {
      return error.rejection;
    }

    return error;
  }

  private isErrorWithOriginalError(value: unknown): value is { originalError: unknown } {
    return typeof value === 'object' && value != null && 'originalError' in value;
  }

  private isErrorWithRejection(value: unknown): value is { rejection: unknown } {
    return typeof value === 'object' && value != null && 'rejection' in value;
  }
}
