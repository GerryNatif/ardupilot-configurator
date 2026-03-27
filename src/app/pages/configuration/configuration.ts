import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { TitlePage } from '../../components/ui/title-page/title-page';
import {
  ParamTable,
  ParamTableSection,
  ParamTableValue,
  ParamTableValueChangeEvent,
} from '../../components/ui/param-table/param-table';
import { SaveBar } from '../../core/services/save-bar';

const INITIAL_PARAMETER_SECTIONS: ReadonlyArray<ParamTableSection> = [
  /*
  {
    id: 'arming',
    title: 'Arme',
    display: {
      showName: false,
      showTitle: true,
      showDescription: true,
      showHelp: true,
    },
    rows: [
      {
        name: 'ANGLE_MAX_ARMING',
        type: 'number',
        value: 0,
        title: 'Angle maximum pour armer [degres]',
        description: 'Limite d inclinaison autorisee pour l armement des moteurs.',
        min: 0,
        max: 180,
        step: 1,
      },
      {
        name: 'GYRO_CAL_ON_FIRST_ARM',
        type: 'checkbox',
        value: false,
        title: 'Calibrer le Gyro a la premiere activation des moteurs',
        description: 'Relance une calibration du gyro au premier armement apres demarrage.',
      },
    ],
  },
  {
    id: 'other-features',
    title: 'Autres fonctionnalites',
    display: {
      showName: true,
      showTitle: true,
      showDescription: false,
      showHelp: true,
    },
    rows: ['AHRS_ORIENTATION', 'NTF_BUZZ_TYPES', 'NTF_BUZZ_VOLUME']
  },*/
];

@Component({
  selector: 'app-configuration',
  imports: [TitlePage, ParamTable],
  templateUrl: './configuration.html',
  styleUrl: './configuration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Configuration {
  private static readonly SAVE_CONTEXT_ID = 'configuration';

  private readonly saveBar = inject(SaveBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly parameterSections = signal<ReadonlyArray<ParamTableSection>>(INITIAL_PARAMETER_SECTIONS);
  private readonly baselineSignature = signal(this.createValueSignature(INITIAL_PARAMETER_SECTIONS));
  readonly currentSignature = computed(() => this.createValueSignature(this.parameterSections()));
  readonly isDirty = computed(() => this.currentSignature() !== this.baselineSignature());

  constructor() {
    this.saveBar.registerContext(Configuration.SAVE_CONTEXT_ID, {
      label: 'Sauvegarder et redemarrer',
      onSave: () => this.saveChanges(),
    });

    effect(() => {
      this.saveBar.setDirty(Configuration.SAVE_CONTEXT_ID, this.isDirty());
    });

    this.destroyRef.onDestroy(() => {
      this.saveBar.unregisterContext(Configuration.SAVE_CONTEXT_ID);
    });
  }

  onParameterValueChange(event: ParamTableValueChangeEvent): void {
    this.parameterSections.update((sections) =>
      sections.map((section) => ({
        ...section,
        rows: section.rows.map((row) =>
          row.name === event.name
            ? { ...row, value: this.normalizeValue(row.type, event.value) }
            : row
        ),
      }))
    );
  }

  private normalizeValue(type: ParamTableSection['rows'][number]['type'], value: ParamTableValue): ParamTableValue {
    if (type === 'checkbox') {
      return value === true;
    }

    return value;
  }

  private async saveChanges(): Promise<void> {
    this.baselineSignature.set(this.currentSignature());
  }

  private createValueSignature(sections: ReadonlyArray<ParamTableSection>): string {
    return JSON.stringify(
      sections.map((section) => ({
        id: section.id,
        rows: section.rows.map((row) => ({
          name: row.name,
          value: row.value,
        })),
      }))
    );
  }
}


/*
BATT_ARM_VOLT
BATT_ARM_MAH
*/