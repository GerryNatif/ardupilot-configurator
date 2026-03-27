import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import * as THREE from 'three';
import { DroneLinkFacade } from '../../core/mavlink/facade/drone-link.facade';
import {
  MODEL_DEFINITIONS,
  ModelDefinition,
} from '../../core/models/model-editor.model';
import {
  BuiltModel,
  EditorEntity,
  ModelEditorBuilderService,
} from '../../core/services/model-editor-builder.service';
import { TitlePage } from '../../components/ui/title-page/title-page';
import { GuiBox } from '../../components/ui/gui-box/gui-box';
import {
  ComponentList,
  ComponentListItem,
} from '../../components/ui/component-list/component-list';

@Component({
  selector: 'app-model-editor',
  imports: [TitlePage, GuiBox, ComponentList],
  templateUrl: './model-editor.html',
  styleUrl: './model-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

/*
FRAME_CLASS
FRAME_TYPE
*/

export class ModelEditor {
  private readonly link = inject(DroneLinkFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly modelBuilder = inject(ModelEditorBuilderService);
  private readonly viewportRef = viewChild.required<ElementRef<HTMLDivElement>>('viewport');

  readonly identity = this.link.vehicleIdentity;
  readonly allModels = MODEL_DEFINITIONS;
  readonly selectedModelId = signal<string>(MODEL_DEFINITIONS[0]?.id ?? 'generic-empty');
  readonly statusMessage = signal('Ready');

  readonly compatibleModels = computed(() => {
    const identity = this.identity();

    // During startup, identity can be unknown; keep all models available so
    // the editor still shows a rich test model instead of only generic-empty.
    if (identity.firmwareFamily === 'unknown' || identity.vehicleKind === 'unknown') {
      return this.allModels;
    }

    return this.allModels.filter((model) => {
      const firmwareMatches =
        model.firmwareFamily === 'any' || model.firmwareFamily === identity.firmwareFamily;
      const vehicleMatches =
        model.vehicleKind === 'any' || model.vehicleKind === identity.vehicleKind;
      return firmwareMatches && vehicleMatches;
    });
  });

  readonly selectedModel = computed(() => {
    const selectedId = this.selectedModelId();
    return this.allModels.find((model) => model.id === selectedId) ?? this.allModels[0];
  });

  readonly selectedEntityId = signal<string | null>(null);
  readonly componentItems = signal<ReadonlyArray<ComponentListItem>>([]);

  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private readonly dragIntersection = new THREE.Vector3();
  private readonly dragOffset = new THREE.Vector3();
  private readonly entityMap = new Map<string, EditorEntity>();
  private readonly objectToEntityId = new Map<string, string>();
  private readonly cameraFocusPosition = new THREE.Vector3();
  private readonly cameraLookAtCurrent = new THREE.Vector3(0, 0, 0);
  private readonly cameraLookAtTarget = new THREE.Vector3(0, 0, 0);

  private renderer: THREE.WebGLRenderer | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private builtModel: BuiltModel | null = null;
  private selectedOutline: THREE.BoxHelper | null = null;
  private draggingEntityId: string | null = null;
  private animationFrameId: number | null = null;
  private readonly debugSelection = true;

  constructor() {
    this.scene.background = new THREE.Color(0xf1f5f9);
    this.camera.position.set(0, 4, 6.2);
    this.camera.lookAt(0, 0, 0);
    this.cameraFocusPosition.copy(this.camera.position);

    this.setupLights();

    effect(() => {
      const preferred = this.compatibleModels()[0];
      if (!preferred) {
        return;
      }

      const currentId = this.selectedModelId();
      const currentExists = this.compatibleModels().some((model) => model.id === currentId);
      if (!currentExists) {
        this.selectedModelId.set(preferred.id);
      }
    });

    effect(() => {
      const model = this.selectedModel();
      if (!model) {
        return;
      }
      this.buildAndAttachModel(model);
    });

    afterNextRender(() => {
      this.initializeScene();
    });

    this.destroyRef.onDestroy(() => {
      this.destroyScene();
    });
  }

  onComponentSelect(id: string): void {
    const didSelect = this.selectEntity(id);
    if (!didSelect) {
      this.statusMessage.set(`Selection failed for ${id} (entity not found).`);
      if (this.debugSelection) {
        console.debug('[ModelEditor] selection failed from list', {
          id,
          knownEntityIds: Array.from(this.entityMap.keys()),
        });
      }
      this.renderFrame();
      return;
    }

    this.statusMessage.set(`Selected ${id}`);
    this.focusOnEntity(id);
    if (this.debugSelection) {
      console.debug('[ModelEditor] selection from list', { id });
    }
    this.renderFrame();
  }

  onViewportPointerDown(event: PointerEvent): void {
    const hitEntity = this.pickEntity(event);
    if (!hitEntity) {
      this.draggingEntityId = null;
      this.renderFrame();
      return;
    }

    this.selectEntity(hitEntity.id);
    this.focusOnEntity(hitEntity.id);
    this.draggingEntityId = hitEntity.id;

    const selectedEntity = this.entityMap.get(hitEntity.id);
    if (selectedEntity && this.resolvePlaneIntersection(event, this.dragIntersection)) {
      this.dragOffset.copy(selectedEntity.mesh.position).sub(this.dragIntersection);
    } else {
      this.dragOffset.set(0, 0, 0);
    }

    this.renderFrame();
  }

  onViewportPointerMove(event: PointerEvent): void {
    if (!this.draggingEntityId) {
      return;
    }

    const entity = this.entityMap.get(this.draggingEntityId);
    if (!entity) {
      return;
    }

    if (!this.resolvePlaneIntersection(event, this.dragIntersection)) {
      return;
    }

    entity.mesh.position.x = this.dragIntersection.x + this.dragOffset.x;
    entity.mesh.position.z = this.dragIntersection.z + this.dragOffset.z;
    this.renderFrame();
  }

  onViewportPointerUp(): void {
    this.draggingEntityId = null;
  }

  private initializeScene(): void {
    const viewport = this.viewportRef().nativeElement;

    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      this.statusMessage.set('WebGL is not available.');
      return;
    }

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(viewport.clientWidth || 1, viewport.clientHeight || 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    viewport.replaceChildren(this.renderer.domElement);

    this.resizeObserver = new ResizeObserver(() => this.updateRendererSize());
    this.resizeObserver.observe(viewport);

    this.animationFrameId = window.requestAnimationFrame(this.animationLoop);
    this.renderFrame();
  }

  private readonly animationLoop = (): void => {
    this.renderFrame();
    this.animationFrameId = window.requestAnimationFrame(this.animationLoop);
  };

  private buildAndAttachModel(definition: ModelDefinition): void {
    if (this.builtModel) {
      this.scene.remove(this.builtModel.root);
    }

    this.clearSelectionOutline();

    this.builtModel = this.modelBuilder.build(definition);
    this.scene.add(this.builtModel.root);
    this.entityMap.clear();
    this.objectToEntityId.clear();

    const items: ComponentListItem[] = [];
    for (const entity of this.builtModel.entities) {
      this.entityMap.set(entity.id, entity);
      entity.mesh.traverse((object) => {
        this.objectToEntityId.set(object.uuid, entity.id);
      });
      items.push({
        id: entity.id,
        kind: entity.kind,
        label: entity.label,
        pwmOutput: entity.pwmOutput,
      });
    }

    this.componentItems.set(items);
    this.selectedEntityId.set(items[0]?.id ?? null);
    this.updateSelectionVisuals();
    if (items[0]?.id) {
      this.focusOnEntity(items[0].id, true);
    }
    this.statusMessage.set(
      `${definition.label} loaded (${definition.propellers.length} propellers, ${definition.servos.length} servos).`,
    );

    this.renderFrame();
  }

  private selectEntity(id: string): boolean {
    if (!this.entityMap.has(id)) {
      return false;
    }
    this.selectedEntityId.set(id);
    this.updateSelectionVisuals();
    return true;
  }

  private updateSelectionVisuals(): void {
    const selectedId = this.selectedEntityId();
    let selectedMesh: THREE.Object3D | null = null;

    for (const entity of this.entityMap.values()) {
      const isSelected = entity.id === selectedId;
      entity.mesh.scale.setScalar(isSelected ? 1.08 : 1);
      if (isSelected) {
        selectedMesh = entity.mesh;
      }
    }

    this.updateSelectionOutline(selectedMesh);
  }

  private updateSelectionOutline(mesh: THREE.Object3D | null): void {
    this.clearSelectionOutline();

    if (!mesh) {
      return;
    }

    this.selectedOutline = new THREE.BoxHelper(mesh, 0xffffff);
    this.scene.add(this.selectedOutline);
    this.selectedOutline.update();
  }

  private clearSelectionOutline(): void {
    if (!this.selectedOutline) {
      return;
    }

    this.scene.remove(this.selectedOutline);
    this.selectedOutline.geometry.dispose();

    const material = this.selectedOutline.material;
    if (Array.isArray(material)) {
      for (const entry of material) {
        entry.dispose();
      }
    } else {
      material.dispose();
    }

    this.selectedOutline = null;
  }

  private pickEntity(event: PointerEvent): EditorEntity | null {
    if (!this.renderer || this.entityMap.size === 0) {
      return null;
    }

    const canvasRect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    const targets = Array.from(this.entityMap.values()).map((entity) => entity.mesh);
    const hits = this.raycaster.intersectObjects(targets, true);
    const hit = hits[0];
    if (!hit) {
      return null;
    }

    let object: THREE.Object3D | null = hit.object;
    while (object) {
      const entityId = this.objectToEntityId.get(object.uuid);
      if (entityId) {
        return this.entityMap.get(entityId) ?? null;
      }
      object = object.parent;
    }

    return null;
  }

  private resolvePlaneIntersection(event: PointerEvent, out: THREE.Vector3): boolean {
    if (!this.renderer) {
      return false;
    }

    const canvasRect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    return this.raycaster.ray.intersectPlane(this.dragPlane, out) != null;
  }

  private updateRendererSize(): void {
    if (!this.renderer) {
      return;
    }

    const viewport = this.viewportRef().nativeElement;
    const width = Math.max(1, viewport.clientWidth);
    const height = Math.max(1, viewport.clientHeight);

    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderFrame();
  }

  private setupLights(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(4, 6, 3);
    this.scene.add(key);

    const groundGrid = new THREE.GridHelper(12, 24, 0x94a3b8, 0xcbd5e1);
    this.scene.add(groundGrid);
  }

  private renderFrame(): void {
    if (!this.renderer) {
      return;
    }

    this.camera.position.lerp(this.cameraFocusPosition, 0.15);
    this.cameraLookAtCurrent.lerp(this.cameraLookAtTarget, 0.15);
    this.camera.lookAt(this.cameraLookAtCurrent);

    this.selectedOutline?.update();
    this.renderer.render(this.scene, this.camera);
  }

  private focusOnEntity(id: string, immediate = false): void {
    const entity = this.entityMap.get(id);
    if (!entity) {
      return;
    }

    const bounds = new THREE.Box3().setFromObject(entity.mesh);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const radius = Math.max(size.x, size.y, size.z, 0.4);

    const viewDirection = new THREE.Vector3().subVectors(this.camera.position, this.cameraLookAtCurrent);
    if (viewDirection.lengthSq() < 1e-6) {
      viewDirection.set(0.25, 0.5, 1);
    }
    viewDirection.normalize();

    this.cameraFocusPosition.copy(center).addScaledVector(viewDirection, radius * 4.2);
    this.cameraLookAtTarget.copy(center);

    if (immediate) {
      this.camera.position.copy(this.cameraFocusPosition);
      this.cameraLookAtCurrent.copy(this.cameraLookAtTarget);
      this.camera.lookAt(this.cameraLookAtCurrent);
    }
  }

  private destroyScene(): void {
    this.clearSelectionOutline();

    if (this.animationFrameId != null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    this.renderer?.dispose();
    this.renderer = null;
  }
}
