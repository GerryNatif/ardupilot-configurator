import { ChangeDetectionStrategy, Component, ElementRef, computed, input, signal, viewChild } from '@angular/core';

export interface InfoBulleItem {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'app-info-bulle',
  standalone: true,
  imports: [],
  templateUrl: './info-bulle.html',
  styleUrl: './info-bulle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoBulle {
  private readonly hostRef = viewChild.required<ElementRef<HTMLElement>>('host');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly items = input<ReadonlyArray<InfoBulleItem>>([]);
  readonly ariaLabel = input<string>('Aide parametre');
  readonly icon = input<string>('?');
  readonly placeBelow = signal(false);
  readonly placeBelowLeft = signal(false);
  readonly placeLeft = signal(false);

  readonly hasContent = computed(() =>
    this.title().trim().length > 0 ||
    this.description().trim().length > 0 ||
    this.items().length > 0
  );

  updatePlacement(): void {
    if (!this.hasContent()) {
      return;
    }

    window.requestAnimationFrame(() => {
      const panel = this.panelRef()?.nativeElement;
      const host = this.hostRef().nativeElement;
      if (!panel) {
        return;
      }

      const hostRect = host.getBoundingClientRect();
      const panelWidth = panel.offsetWidth;
      const panelHeight = panel.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 8;

      const spaceRight = viewportWidth - hostRect.right;
      const spaceLeft = hostRect.left;
      const spaceBelow = viewportHeight - hostRect.bottom;

      let nextPlaceBelow = false;
      let nextPlaceLeft = false;
      let nextPlaceBelowLeft = false;

      if (spaceRight < panelWidth + margin) {
        if (spaceLeft >= panelWidth + margin) {
          nextPlaceLeft = true;
        } else {
          nextPlaceBelow = true;
        }
      }

      if (!nextPlaceBelow && hostRect.top < panelHeight + margin) {
        nextPlaceBelow = true;
      }

      if (nextPlaceBelow && spaceBelow < panelHeight + margin && hostRect.top > panelHeight + margin) {
        nextPlaceBelow = false;
      }

      if (nextPlaceBelow) {
        const canPlaceBelowLeft = hostRect.left + panelWidth + margin <= viewportWidth;
        const canPlaceBelowRight = hostRect.right - panelWidth - margin >= 0;

        if (canPlaceBelowLeft) {
          nextPlaceBelowLeft = true;
        } else if (canPlaceBelowRight) {
          nextPlaceBelowLeft = false;
        } else {
          nextPlaceBelowLeft = spaceRight >= spaceLeft;
        }
      }

      this.placeBelow.set(nextPlaceBelow);
      this.placeBelowLeft.set(nextPlaceBelowLeft);
      this.placeLeft.set(nextPlaceLeft && !nextPlaceBelow);
    });
  }
}
