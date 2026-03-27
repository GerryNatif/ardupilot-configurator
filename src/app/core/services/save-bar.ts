import { Injectable, computed, signal } from '@angular/core';

export interface SaveBarState {
  readonly visible: boolean;
  readonly dirty: boolean;
  readonly saving: boolean;
  readonly disabled: boolean;
  readonly label: string;
}

export interface SaveBarRegistration {
  readonly label?: string;
  readonly disabled?: boolean;
  readonly onSave?: (() => Promise<void> | void) | null;
}

interface SaveBarContext {
  readonly id: string;
  readonly label: string;
  readonly onSave: (() => Promise<void> | void) | null;
  readonly dirty: boolean;
  readonly saving: boolean;
  readonly disabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class SaveBar {
  private static readonly DEFAULT_LABEL = 'Sauvegarder et redemarrer';

  private readonly activeContext = signal<SaveBarContext | null>(null);

  readonly state = computed<SaveBarState>(() => {
    const context = this.activeContext();

    if (!context) {
      return {
        visible: false,
        dirty: false,
        saving: false,
        disabled: true,
        label: SaveBar.DEFAULT_LABEL,
      };
    }

    return {
      visible: context.dirty,
      dirty: context.dirty,
      saving: context.saving,
      disabled: context.disabled || context.saving || !context.onSave,
      label: context.label,
    };
  });

  registerContext(id: string, registration: SaveBarRegistration = {}): void {
    this.activeContext.set({
      id,
      label: registration.label ?? SaveBar.DEFAULT_LABEL,
      onSave: registration.onSave ?? null,
      dirty: false,
      saving: false,
      disabled: registration.disabled ?? false,
    });
  }

  unregisterContext(id: string): void {
    if (this.activeContext()?.id !== id) {
      return;
    }

    this.activeContext.set(null);
  }

  setDirty(id: string, dirty: boolean): void {
    this.updateContext(id, (context) => ({
      ...context,
      dirty,
    }));
  }

  setDisabled(id: string, disabled: boolean): void {
    this.updateContext(id, (context) => ({
      ...context,
      disabled,
    }));
  }

  setLabel(id: string, label: string): void {
    this.updateContext(id, (context) => ({
      ...context,
      label,
    }));
  }

  async triggerSave(): Promise<void> {
    const context = this.activeContext();
    if (!context || !context.onSave || context.disabled || context.saving) {
      return;
    }

    this.updateContext(context.id, (current) => ({
      ...current,
      saving: true,
    }));

    try {
      await context.onSave();
    } finally {
      this.updateContext(context.id, (current) => ({
        ...current,
        saving: false,
      }));
    }
  }

  private updateContext(id: string, updater: (context: SaveBarContext) => SaveBarContext): void {
    this.activeContext.update((context) => {
      if (!context || context.id !== id) {
        return context;
      }

      return updater(context);
    });
  }
}