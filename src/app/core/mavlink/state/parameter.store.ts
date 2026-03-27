import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  INITIAL_PARAMETER_STATE,
  ParameterEntry,
  ParameterState,
  normalizeParamId
} from '../models/parameter.model';
import { MavlinkParserService } from '../protocol/mavlink-parser.service';

@Injectable({ providedIn: 'root' })

/**
 * Store d'etat des parametres MAVLink.
 * Ce service maintient la liste des parametres recus, suit la progression de
 * leur synchronisation, expose des vues derivees pour l'interface et marque les
 * valeurs en attente lors des ecritures locales.
 *
 * MAVLink parameter state store.
 * This service keeps the list of received parameters, tracks synchronization
 * progress, exposes derived views for the UI, and marks pending values during
 * local writes.
 */
export class ParameterStore {
  private readonly stateSig = signal<ParameterState>(INITIAL_PARAMETER_STATE);
  private completionTimerId: ReturnType<typeof setTimeout> | null = null;
  private readonly syncSeenNames = new Set<string>();

  readonly state = computed(() => this.stateSig());
  readonly sync = computed(() => this.stateSig().sync);
  readonly list = computed(() =>
    Array.from(this.stateSig().byName.values()).sort((a, b) => a.name.localeCompare(b.name))
  );

  constructor(private readonly parser: MavlinkParserService) {
    this.bindParamValue();
  }

  reset(): void {
    this.clearCompletionTimer();
    this.syncSeenNames.clear();
    this.stateSig.set(INITIAL_PARAMETER_STATE);
  }

  startSync(): void {
    this.clearCompletionTimer();
    this.syncSeenNames.clear();
    this.stateSig.update((current) => ({
      byName: current.byName,
      sync: {
        startedAtMs: Date.now(),
        completedAtMs: null,
        expectedCount: null,
        receivedUniqueCount: 0,
        inProgress: true,
        complete: false,
        timedOut: false,
        lastError: null
      }
    }));
  }

  markTimeout(message = 'Timeout de synchronisation des paramètres'): void {
    this.stateSig.update((current) => ({
      ...current,
      sync: {
        ...current.sync,
        inProgress: false,
        timedOut: true,
        lastError: message
      }
    }));
  }

  getParameter(name: string): ParameterEntry | undefined {
    return this.stateSig().byName.get(name);
  }

  markPending(name: string, nextValue: number): void {
    this.stateSig.update((current) => {
      const byName = new Map(current.byName);
      const existing = byName.get(name);

      if (!existing) {
        return current;
      }

      byName.set(name, {
        ...existing,
        value: nextValue,
        pending: true,
        updatedAtMs: Date.now()
      });

      return { ...current, byName };
    });
  }

  private bindParamValue(): void {
    this.parser.onType$('PARAM_VALUE')
      .pipe(takeUntilDestroyed())
      .subscribe((msg: any) => {
        const name = normalizeParamId(msg.param_id);
        if (!name) {
          return;
        }

        this.stateSig.update((current) => {
          const byName = new Map(current.byName);
          const alreadySeenInCurrentSync = this.syncSeenNames.has(name);
          if (!alreadySeenInCurrentSync) {
            this.syncSeenNames.add(name);
          }

          byName.set(name, {
            name,
            value: msg.param_value ?? 0,
            type: msg.param_type ?? 0,
            index: msg.param_index ?? null,
            count: msg.param_count ?? null,
            updatedAtMs: Date.now(),
            pending: false
          });

          const expectedCount = current.sync.expectedCount ?? msg.param_count ?? null;
          const receivedUniqueCount = alreadySeenInCurrentSync
            ? current.sync.receivedUniqueCount
            : current.sync.receivedUniqueCount + 1;
          const complete = expectedCount != null && receivedUniqueCount >= expectedCount;

          return {
            byName,
            sync: {
              ...current.sync,
              expectedCount,
              receivedUniqueCount,
              complete,
              inProgress: complete ? false : current.sync.inProgress,
              completedAtMs: complete ? Date.now() : current.sync.completedAtMs
            }
          };
        });

        this.scheduleCompletionDebounce();
      });
  }

  private scheduleCompletionDebounce(): void {
    this.clearCompletionTimer();

    this.completionTimerId = setTimeout(() => {
      this.stateSig.update((current) => {
        if (!current.sync.complete) {
          return current;
        }

        return {
          ...current,
          sync: {
            ...current.sync,
            inProgress: false,
            completedAtMs: current.sync.completedAtMs ?? Date.now()
          }
        };
      });
    }, 500);
  }

  private clearCompletionTimer(): void {
    if (this.completionTimerId) {
      clearTimeout(this.completionTimerId);
      this.completionTimerId = null;
    }
  }
}