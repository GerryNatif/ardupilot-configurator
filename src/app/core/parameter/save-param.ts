import { Injectable, computed, signal } from '@angular/core';

export interface SaveParamState {
  readonly visible: boolean;
  readonly dirty: boolean;
  readonly saving: boolean;
  readonly disabled: boolean;
  readonly label: string;
}

export interface SaveParamRegistration {
  readonly label?: string;
  readonly disabled?: boolean;
  readonly onSave?: (() => Promise<void> | void) | null;
}

interface SaveParamContext {
  readonly id: string;
  readonly label: string;
  readonly onSave: (() => Promise<void> | void) | null;
  readonly dirty: boolean;
  readonly saving: boolean;
  readonly disabled: boolean;
}

/**
 * Service centralisé de gestion du bouton de sauvegarde des paramètres.
 *
 * Ce service maintient un contexte actif unique, enregistré par la page courante
 * via `registerContext()`. Il expose un état réactif (`state`) calculé à partir
 * de ce contexte : visibilité du bouton, état "modifié" (dirty), état "en cours
 * de sauvegarde" et libellé personnalisable.
 *
 * Seule la page active enregistre un contexte à la fois. Lorsqu'une page quitte
 * la vue, elle doit appeler `unregisterContext()` pour masquer le bouton et éviter
 * des effets de bord sur les autres pages.
 *
 * Le déclenchement de la sauvegarde (`triggerSave()`) exécute le callback `onSave`
 * fourni à l'enregistrement, en gérant l'état `saving` automatiquement via un
 * bloc try/finally, ce qui garantit la réinitialisation même en cas d'erreur.
 *
 * Usage:
 * - Appeler `registerContext(id, { label, onSave })` dans `ngOnInit` ou le constructeur.
 * - Appeler `setDirty(id, true)` dès qu'un paramètre est modifié localement.
 * - Appeler `unregisterContext(id)` dans `ngOnDestroy`.
 *
 * ---
 *
 * Centralized service for managing the parameter save button.
 *
 * This service maintains a single active context, registered by the current page
 * via `registerContext()`. It exposes a reactive state (`state`) derived from
 * that context: button visibility, dirty flag, saving flag, and a customizable label.
 *
 * Only one page registers a context at a time. When a page leaves the view, it
 * must call `unregisterContext()` to hide the button and avoid side effects on
 * other pages.
 *
 * Saving is triggered via `triggerSave()`, which executes the `onSave` callback
 * provided at registration. The `saving` flag is managed automatically through a
 * try/finally block, ensuring it is reset even if an error occurs.
 *
 * Usage:
 * - Call `registerContext(id, { label, onSave })` in `ngOnInit` or the constructor.
 * - Call `setDirty(id, true)` whenever a parameter is modified locally.
 * - Call `unregisterContext(id)` in `ngOnDestroy`.
 */
@Injectable({ providedIn: 'root' })
export class SaveParam {
  private static readonly DEFAULT_LABEL = 'Sauvegarder et redemarrer';

  private readonly activeContext = signal<SaveParamContext | null>(null);

  readonly state = computed<SaveParamState>(() => {
    const context = this.activeContext();

    if (!context) {
      return {
        visible: false,
        dirty: false,
        saving: false,
        disabled: true,
        label: SaveParam.DEFAULT_LABEL,
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

  registerContext(id: string, registration: SaveParamRegistration = {}): void {
    this.activeContext.set({
      id,
      label: registration.label ?? SaveParam.DEFAULT_LABEL,
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

  private updateContext(id: string, updater: (context: SaveParamContext) => SaveParamContext): void {
    this.activeContext.update((context) => {
      if (!context || context.id !== id) {
        return context;
      }

      return updater(context);
    });
  }
}
