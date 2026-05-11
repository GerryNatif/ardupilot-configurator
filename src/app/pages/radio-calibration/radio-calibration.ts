import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RcStick } from '../../components/rc-stick/rc-stick';

type RadioMode = 'MODE 1' | 'MODE 2' | 'MODE 3' | 'MODE 4';

type StickLabels = {
  left: { x: string; y: string };
  right: { x: string; y: string };
};

@Component({
  selector: 'app-radio-calibration',
  imports: [FormsModule, RcStick],
  templateUrl: './radio-calibration.html',
  styleUrl: './radio-calibration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioCalibration {
  readonly modeOptions: ReadonlyArray<RadioMode> = ['MODE 1', 'MODE 2', 'MODE 3', 'MODE 4'];
  readonly selectedMode = signal<RadioMode>('MODE 2');

  private readonly labelsByMode: Record<RadioMode, StickLabels> = {
    'MODE 1': {
      left: { x: 'YAW', y: 'PITCH' },
      right: { x: 'ROLL', y: 'THROTTLE' },
    },
    'MODE 2': {
      left: { x: 'YAW', y: 'THROTTLE' },
      right: { x: 'ROLL', y: 'PITCH' },
    },
    'MODE 3': {
      left: { x: 'ROLL', y: 'PITCH' },
      right: { x: 'YAW', y: 'THROTTLE' },
    },
    'MODE 4': {
      left: { x: 'ROLL', y: 'THROTTLE' },
      right: { x: 'YAW', y: 'PITCH' },
    },
  };

  readonly stickLabels = computed(() => this.labelsByMode[this.selectedMode()]);

  // Demo positions for the calibration illustration.
  readonly leftStickX = signal(-75);
  readonly leftStickY = signal(75);
  readonly rightStickX = signal(0);
  readonly rightStickY = signal(0);
}
