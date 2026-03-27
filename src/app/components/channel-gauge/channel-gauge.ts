import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-channel-gauge',
  imports: [],
  templateUrl: './channel-gauge.html',
  styleUrl: './channel-gauge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelGauge {
  title = input.required<string>();
  value = input<number>(0);
  min = input<number>(0);
  max = input<number>(0);
  unit = input<string>('');
  color = input<string>('#4caf50');

  fillPercent = computed(() => {
    const min = this.min();
    const max = this.max();
    const value = this.value();

    if (max <= min) {
      return 0;
    }

    const normalized = ((value - min) / (max - min)) * 100;
    return Math.min(100, Math.max(0, normalized));
  });
}
