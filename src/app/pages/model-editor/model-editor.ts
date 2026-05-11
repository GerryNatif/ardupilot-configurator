import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { TitlePage } from '../../components/ui/title-page/title-page';
import {
  CanvasShapeSnapshot,
  ShapeType,
  ThreejsCanvas,
} from '../../features/threejs-editor/components/threejs-canva/threejs-canva';
import {
  ShapeControlDefinition,
  ShapeGeneratorService,
  ShapeParameterValue,
} from '../../features/threejs-editor/services/shape-generator/shape-generator.service';
import { GuiBox } from '../../components/ui/gui-box/gui-box';
import {
  ComponentList,
  ComponentListItem,
} from '../../components/ui/component-list/component-list';

@Component({
  selector: 'app-model-editor',
  imports: [TitlePage, ThreejsCanvas, GuiBox, ComponentList],
  templateUrl: './model-editor.html',
  styleUrl: './model-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelEditor {
  private readonly shapeService = inject(ShapeGeneratorService);
  private readonly canvas = viewChild.required(ThreejsCanvas);
  private readonly shapeTypes = this.shapeService.getShapeDefinitions().map((shape) => shape.type);

  readonly selectedShape = signal<CanvasShapeSnapshot | null>(null);
  readonly selectedShapeId = computed(() => this.selectedShape()?.id ?? null);
  readonly shapeListItems: ReadonlyArray<ComponentListItem> = this.shapeService.getShapeDefinitions().map((shape) => ({
    id: shape.type,
    label: shape.label,
    kind: 'fixed-body',
    pwmOutput: null,
  }));

  readonly shapeControlGroups = computed(() => {
    const shape = this.selectedShape();
    if (!shape) return [] as Array<{ group: string; controls: ReadonlyArray<ShapeControlDefinition> }>;

    const map = new Map<string, ShapeControlDefinition[]>();
    for (const control of shape.controls) {
      const list = map.get(control.group) ?? [];
      list.push(control);
      map.set(control.group, list);
    }

    return Array.from(map.entries()).map(([group, controls]) => ({ group, controls }));
  });

  onSelectedShapeChange(shape: CanvasShapeSnapshot | null) {
    this.selectedShape.set(shape);
  }

  onCanvasDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  onCanvasDrop(event: DragEvent) {
    event.preventDefault();
    const type = this.readShapeTypeFromTransfer(event.dataTransfer);
    if (!type) return;
    this.canvas().addShape(type);
  }

  onShapeAddFromList(id: string) {
    if (!this.isShapeType(id)) return;
    this.canvas().addShape(id);
  }

  async exportTransparentPng(): Promise<void> {
    await this.canvas().exportTransparentPng();
  }

  updateShapeParam(control: ShapeControlDefinition, event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;

    const next: ShapeParameterValue = control.control === 'checkbox'
      ? target.checked
      : Number(target.value);

    if (control.control === 'range' && (!Number.isFinite(next as number))) {
      return;
    }

    this.canvas().applySelectedShapePatch({ [control.key]: next });

    const current = this.selectedShape();
    if (!current) return;
    this.selectedShape.set({
      ...current,
      params: {
        ...current.params,
        [control.key]: next,
      },
    });
  }

  getParamValue(shape: CanvasShapeSnapshot, control: ShapeControlDefinition): ShapeParameterValue {
    return shape.params[control.key] ?? this.getDefaultParamValue(control);
  }

  formatParamValue(value: ShapeParameterValue, control: ShapeControlDefinition): string {
    if (typeof value === 'boolean') {
      return value ? 'On' : 'Off';
    }
    const fixed = control.step && control.step < 1 ? 2 : 0;
    return `${value.toFixed(fixed)}${control.unit ?? ''}`;
  }

  private getDefaultParamValue(control: ShapeControlDefinition): ShapeParameterValue {
    if (control.control === 'checkbox') {
      return false;
    }
    return control.min ?? 0;
  }

  private readShapeTypeFromTransfer(dataTransfer: DataTransfer | null): ShapeType | null {
    if (!dataTransfer) return null;
    const raw = dataTransfer.getData('application/x-ardu-shape') || dataTransfer.getData('text/plain');
    if (!this.isShapeType(raw)) return null;
    return raw;
  }

  private isShapeType(value: string): value is ShapeType {
    return this.shapeTypes.includes(value as ShapeType);
  }
}
