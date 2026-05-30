import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-rc-stick',
  imports: [],
  templateUrl: './rc-stick.html',
  styleUrl: './rc-stick.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RcStick {
  x = input<number>(0); // -100 -> +100
  y = input<number>(0); // -100 -> +100
  xLabel = input<string>('RUDDER');
  yLabel = input<string>('THROTTLE');

  private readonly maxTravelPx = 45;
  private readonly iconBasePath = '/assets/icons/';

  readonly horizontalIconPath = `${this.iconBasePath}arrow-left-right.svg`;
  readonly verticalIconPath = `${this.iconBasePath}arrow-up-down.svg`;

  readonly clampedX = computed(() => this.clamp(this.x()));
  readonly clampedY = computed(() => this.clamp(this.y()));

  readonly xPercent = computed(() => this.clampedX());
  readonly yPercent = computed(() => -this.clampedY()); // inversion Y UI

  readonly transform = computed(() => {
    const xPx = (this.xPercent() / 100) * this.maxTravelPx;
    const yPx = (this.yPercent() / 100) * this.maxTravelPx;
    return `translate(calc(-50% + ${xPx}px), calc(-50% + ${yPx}px))`;
  });

  private clamp(value: number): number {
    return Math.max(-100, Math.min(100, value));
  }
}
