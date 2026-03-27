import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { DroneLinkFacade } from '../mavlink/facade/drone-link.facade';

export interface ParameterWriteChange {
  readonly name: string;
  readonly value: number;
  readonly rebootRequired: boolean;
}

/**
 * Service de workflow pour la sauvegarde des parametres.
 * Il applique les ecritures de parametres en attente dans l'ordre, detecte si
 * un redemarrage de l'autopilote est necessaire, puis relance la connexion et
 * restaure eventuellement la navigation vers la page d'origine.
 *
 * Workflow service for saving parameter changes.
 * It applies pending parameter writes in order, detects whether an autopilot
 * reboot is required, then reinitializes the connection and optionally restores
 * navigation back to the original page.
 */
@Injectable({ providedIn: 'root' })
export class ParameterSaveWorkflow {
  private readonly link = inject(DroneLinkFacade);
  private readonly router = inject(Router);

  async apply(changes: ReadonlyArray<ParameterWriteChange>, returnUrl = this.router.url): Promise<void> {
    if (changes.length === 0) {
      return;
    }

    for (const change of changes) {
      await this.link.setParameter(change.name, change.value);
    }

    const requiresReboot = changes.some((change) => change.rebootRequired);
    if (!requiresReboot) {
      return;
    }

    await this.router.navigate(['/connection'], {
      queryParams: {
        returnUrl,
      },
    });

    await this.link.rebootAutopilotAndReinitialize();

    if (this.router.url !== returnUrl) {
      await this.router.navigateByUrl(returnUrl);
    }
  }
}
