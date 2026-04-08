import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { Card } from '../card/card';
import { CardDetail } from '../card/card';

export interface ComponentListItem {
  readonly id: string;
  readonly label: string;
  readonly kind: 'fixed-body' | 'propeller' | 'servo';
  readonly pwmOutput: number | null;
}

@Component({
  selector: 'app-component-list',
  imports: [Card],
  templateUrl: './component-list.html',
  styleUrl: './component-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentList {
  readonly items = input<ReadonlyArray<ComponentListItem>>([]);
  readonly selectedId = input<string | null>(null);
  readonly enableDrag = input(false);
  readonly selectItem = output<string>();
  readonly dragItem = output<string>();
  readonly visualSelectedId = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.visualSelectedId.set(this.selectedId());
    });
  }

  onSelect(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const id = target?.value;
    if (!id) {
      return;
    }
    this.visualSelectedId.set(id);
    console.debug('[ComponentList] select change', { id, selectedId: this.selectedId() });
    this.selectItem.emit(id);
  }

  onItemClick(id: string): void {
    this.visualSelectedId.set(id);
    console.debug('[ComponentList] item click', { id, selectedId: this.selectedId() });
    this.selectItem.emit(id);
  }

  onItemDragStart(id: string, event: DragEvent): void {
    if (!this.enableDrag()) {
      return;
    }
    event.dataTransfer?.setData('application/x-ardu-shape', id);
    event.dataTransfer?.setData('text/plain', id);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
    }
    this.dragItem.emit(id);
  }

  isSelected(id: string): boolean {
    return this.visualSelectedId() === id;
  }

  formatLabel(item: ComponentListItem): string {
    if (item.pwmOutput == null) {
      return `${item.label} (fixed)`;
    }
    return `${item.label} (PWM ${item.pwmOutput})`;
  }

  getCardDetails(item: ComponentListItem): CardDetail[] {
    const pwmValue = item.pwmOutput == null ? 'n/a' : `${item.pwmOutput}`;
    return [
      { label: 'Type', value: item.kind },
      { label: 'PWM', value: pwmValue },
    ];
  }
}
