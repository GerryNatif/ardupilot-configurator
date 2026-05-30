import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-channel-gauge',
  imports: [],
  templateUrl: './channel-gauge.html',
  styleUrl: './channel-gauge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelGauge {
  private static nextInputId = 0;

  title = input.required<string>();
  value = input<number>(0);
  min = input<number>(0);
  max = input<number>(0);
  trim = input<number | null>(null);
  unit = input<string>('');
  color = input<string>('#ff3a35');
  channelIndex = input<number | null>(null);
  selectedMode = input<string>('THROTTLE');
  modeOptions = input<ReadonlyArray<string>>([]);
  showMode = input(true);
  reversed = input<boolean>(false);
  deadZone = model<number>(150);
  showDeadZone = input(true);
  readonly deadZoneInputId = `channel-gauge-dead-zone-${ChannelGauge.nextInputId++}`;
  readonly selectedModeChange = output<string>();
  readonly reversedChange = output<boolean>();

  fillPercent = computed(() => {
    const min = this.min();
    const max = this.max();
    const value = this.displayedValue();

    if (max <= min) {
      return 0;
    }

    const normalized = ((value - min) / (max - min)) * 100;
    return Math.min(100, Math.max(0, normalized));
  });

  clampedValue = computed(() => {
    const min = this.min();
    const max = this.max();
    const value = this.value();

    if (max <= min) {
      return value;
    }

    return Math.min(max, Math.max(min, value));
  });

  displayedValue = computed(() => {
    const min = this.min();
    const max = this.max();
    const value = this.clampedValue();

    if (!this.reversed()) {
      return value;
    }

    // Mirror the displayed signal around the [min, max] range when channel is reversed.
    return min + (max - value);
  });

  range = computed(() => {
    const min = this.min();
    const max = this.max();
    return max > min ? max - min : 0;
  });

  centerValue = computed(() => {
    const min = this.min();
    const max = this.max();
    const trim = this.trim();

    if (typeof trim === 'number' && Number.isFinite(trim)) {
      return Math.min(max, Math.max(min, trim));
    }

    return min + this.range() / 2;
  });

  mid = computed(() => this.centerValue());

  midPercent = computed(() => {
    const range = this.range();
    if (range <= 0) {
      return 50;
    }

    return this.valueToPercent(this.centerValue());
  });

  deadZoneStartPercent = computed(() => {
    const range = this.range();
    if (range <= 0) {
      return 50;
    }

    const halfDeadZone = this.deadZone() / 2;
    const startPercent = this.valueToPercent(this.centerValue() - halfDeadZone);
    const endPercent = this.valueToPercent(this.centerValue() + halfDeadZone);
    return Math.min(startPercent, endPercent);
  });

  deadZoneWidthPercent = computed(() => {
    const range = this.range();
    if (range <= 0 || this.deadZone() <= 0) {
      return 0;
    }

    const halfDeadZone = this.deadZone() / 2;
    const startPercent = this.valueToPercent(this.centerValue() - halfDeadZone);
    const endPercent = this.valueToPercent(this.centerValue() + halfDeadZone);
    const width = Math.abs(endPercent - startPercent);
    return Math.min(100, Math.max(0, width));
  });

  effectiveModeOptions = computed(() => {
    const options = this.modeOptions();
    if (options.length > 0) {
      return options;
    }

    return [this.selectedMode()];
  });

  displayTitle = computed(() => {
    const index = this.channelIndex();
    return index != null ? String(index) : this.title();
  });

  valueLabel = computed(() => {
    const unit = this.unit().trim();
    return unit.length > 0 ? `${this.clampedValue()} ${unit}` : String(this.clampedValue());
  });

  onDeadZoneChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    if (!inputElement) {
      return;
    }

    const nextValue = Number(inputElement.value);
    if (!Number.isFinite(nextValue)) {
      return;
    }

    this.deadZone.set(nextValue);
  }

  onSelectedModeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    if (!selectElement) {
      return;
    }

    this.selectedModeChange.emit(selectElement.value);
  }

  onReversedChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    if (!inputElement) {
      return;
    }

    this.reversedChange.emit(inputElement.checked);
  }

  private valueToPercent(value: number): number {
    const min = this.min();
    const max = this.max();
    const range = max - min;

    if (!Number.isFinite(value) || !Number.isFinite(range) || range <= 0) {
      return 50;
    }

    const percent = ((value - min) / range) * 100;
    return Math.min(100, Math.max(0, percent));
  }
}
