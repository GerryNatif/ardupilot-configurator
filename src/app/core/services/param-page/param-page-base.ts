import { inject } from '@angular/core';
import {
  ParamTableSection,
  ParamTableValue,
  ParamTableValueChangeEvent,
} from '../../../components/ui/param-table/param-table';
import { DroneLinkFacade } from '../../mavlink/facade/drone-link.facade';
import { ParamBuilderService } from '../param-builder/param-builder.service';
import { ParameterDraftSession } from './parameter-draft-session';

/**
 * Abstract base class for page components that manage MAVLink parameters.
 *
 * Provides shared injection of the three core parameter services and the
 * common logic for tracking draft changes and applying them to a section.
 *
 * Usage:
 *   @Component({ ..., providers: [ParameterDraftSession] })
 *   export class MyPage extends ParamPageBase {
 *     private static readonly SAVE_CONTEXT_ID = 'my-page';
 *
 *     constructor() {
 *       super();
 *       this.draftSession.start(MyPage.SAVE_CONTEXT_ID);
 *     }
 *
 *     readonly mySection = computed(() =>
 *       this.withDrafts(this.mySectionBase())
 *     );
 *   }
 */
export abstract class ParamPageBase {
  protected readonly link = inject(DroneLinkFacade);
  protected readonly paramBuilder = inject(ParamBuilderService);
  protected readonly draftSession = inject(ParameterDraftSession);

  readonly isConnected = this.link.isConnected;

  /**
   * Generic handler for ParamTable value-change events.
   * Resolves the write request and records the change in the draft session.
   */
  protected onParameterChange(event: ParamTableValueChangeEvent): void {

    //résout la requête d'écriture à partir du nom et de la valeur modifiée
    const request = this.paramBuilder.resolveWriteRequest(event.name, event.value);
    if (!request) {
      return;
    }

    //lecture du paramètre en cours pour comparer avec la valeur modifiée
    const current = this.link.parameterState().byName.get(request.name)?.value;
    //détermine si le changement nécessite un reboot en fonction des métadonnées du paramètre
    const rebootRequired = this.link.getParameterMetadata(request.name)?.rebootRequired === true;

    //enregistre le changement dans la session de brouillon
    this.draftSession.setChange(
      { name: request.name, value: request.value, rebootRequired },
      current,
    );
  }

  /**
    * Superpose les valeurs de brouillon en attente sur un instantané de section en direct.
    * Passe la valeur brute du signal de section et la map courante des brouillons.
   */
  protected withDrafts(section: ParamTableSection): ParamTableSection {
    const draftValues = this.draftSession.draftValues();
    return {
      ...section,
      rows: section.rows.map((row) => {
        const draftValue = draftValues[row.name];
        if (draftValue == null) {
          return row;
        }
        return { ...row, value: this.draftToRowValue(row.type, draftValue) };
      }),
    };
  }

  private draftToRowValue(
    type: ParamTableSection['rows'][number]['type'],
    value: number,
  ): ParamTableValue {
    return type === 'checkbox' ? value !== 0 : value;
  }
}
