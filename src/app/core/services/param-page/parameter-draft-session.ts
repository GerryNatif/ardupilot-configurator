import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  ParameterSaveWorkflow,
  ParameterWriteChange,
} from './parameter-save-workflow';
import { SaveBar } from '../save-bar';

/**
 * Service de session de brouillon pour les modifications de parametres.
 * Il conserve les changements en attente pour un contexte donne, expose les
 * valeurs de brouillon pour l'interface, met a jour l'etat de la barre de
 * sauvegarde et declenche l'enregistrement via le workflow de sauvegarde.
 *
 * Draft session service for parameter edits.
 * It keeps pending changes for a given context, exposes draft values to the UI,
 * updates the save bar state, and triggers persistence through the save workflow.
 */
@Injectable()
export class ParameterDraftSession {
  private readonly saveBar = inject(SaveBar);
  private readonly saveWorkflow = inject(ParameterSaveWorkflow);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly contextId = signal<string | null>(null);
  private readonly pendingChangesState = signal<Record<string, ParameterWriteChange>>({});

  readonly pendingChanges = computed(() => this.pendingChangesState());
  readonly changes = computed<ReadonlyArray<ParameterWriteChange>>(() =>
    Object.values(this.pendingChangesState())
  );
  readonly draftValues = computed<Record<string, number>>(() => {
    const next: Record<string, number> = {};

    for (const change of this.changes()) {
      next[change.name] = change.value;
    }

    return next;
  });
  readonly hasPendingChanges = computed(() => this.changes().length > 0);
  readonly hasPendingRebootChanges = computed(() =>
    this.changes().some((change) => change.rebootRequired)
  );

  constructor() {
    effect(() => {
      const activeContextId = this.contextId();
      if (!activeContextId) {
        return;
      }

      this.saveBar.setDirty(activeContextId, this.hasPendingChanges());
      this.saveBar.setLabel(
        activeContextId,
        this.hasPendingRebootChanges() ? 'Sauvegarder et redemarrer' : 'Sauvegarder'
      );
    });

    this.destroyRef.onDestroy(() => {
      const activeContextId = this.contextId();
      if (!activeContextId) {
        return;
      }

      this.saveBar.unregisterContext(activeContextId);
    });
  }

  start(contextId: string): void {
    const previousContextId = this.contextId();
    if (previousContextId && previousContextId !== contextId) {
      this.saveBar.unregisterContext(previousContextId);
    }

    this.contextId.set(contextId);
    this.saveBar.registerContext(contextId, {
      label: 'Sauvegarder',
      onSave: () => this.save(),
    });
  }

  setChange(change: ParameterWriteChange, currentValue: number | null | undefined): void {
    if (currentValue != null && this.isSameValue(currentValue, change.value)) {
      this.removeChange(change.name);
      return;
    }

    this.pendingChangesState.update((state) => ({
      ...state,
      [change.name]: change,
    }));
  }

  removeChange(name: string): void {
    this.pendingChangesState.update((state) => {
      if (!state[name]) {
        return state;
      }

      const nextState = { ...state };
      delete nextState[name];
      return nextState;
    });
  }

  clear(): void {
    this.pendingChangesState.set({});
  }

  async save(returnUrl = this.router.url): Promise<void> {
    await this.saveWorkflow.apply(this.changes(), returnUrl);
    this.clear();
  }

  private isSameValue(current: number, next: number): boolean {
    return Math.abs(current - next) <= Number.EPSILON;
  }
}