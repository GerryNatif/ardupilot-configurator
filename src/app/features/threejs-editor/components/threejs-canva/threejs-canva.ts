import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  inject,
  signal,
  computed,
  NgZone,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import {
  ShapeGeneratorService,
  ShapeConfig,
  ShapeControlDefinition,
  ShapeParameterMap,
} from '../../services/shape-generator/shape-generator.service';
import { TransformGizmo } from '../../gizmo/transform-gizmo';
import { GridPlanes } from '../../scene/grid-planes';
import { IconMenu } from '../../../../components/ui/icon-menu/icon-menu';

export type TransformMode = 'translate' | 'rotate' | 'scale';
export type ViewPlane = 'front' | 'top' | 'right' | null;
export type ShapeType = ShapeConfig['type'];
type SymmetryPlane = 'front' | 'right';

interface SymmetryLink {
  sourceId: string;
  mirrorId: string;
  plane: SymmetryPlane;
}

interface CircularRepeatLink {
  masterId: string;
  slaveIds: string[];
  center: THREE.Vector3;
}

// Descripteur générique pour un lien maitre/esclave stocké dans userData.
interface SlaveRelationDescriptor {
  roleKey: string;
  masterIdKey: string;
  masterRoleValue: string;
  slaveRoleValue: string;
}

export interface CanvasShapeSnapshot {
  id: string;
  name: string;
  type: ShapeType;
  controls: ReadonlyArray<ShapeControlDefinition>;
  params: ShapeParameterMap;
}

@Component({
  selector: 'app-threejs-canvas',
  standalone: true,
  imports: [CommonModule, IconMenu],
  templateUrl: './threejs-canva.html',
  styleUrl: './threejs-canva.scss',
})
export class ThreejsCanvas implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('wrapperRef') wrapperRef!: ElementRef<HTMLDivElement>;

  private ngZone = inject(NgZone);
  private shapeService = inject(ShapeGeneratorService);
  readonly selectedShapeChange = output<CanvasShapeSnapshot | null>();

  // ── Signals ──────────────────────────────────────────────────────────────
  selectedObject = signal<THREE.Object3D | null>(null);
  transformMode = signal<TransformMode>('translate');
  activePlane = signal<ViewPlane>(null);
  showGrid = signal(true);
  contextMenuPos = signal<{ x: number; y: number } | null>(null);

  selectedObjectName = computed(() => {
    const obj = this.selectedObject();
    return obj ? (obj.userData['name'] ?? obj.name ?? 'Objet') : '';
  });
  objectCount = signal(0);
  transformModeLabel = computed(() => {
    const map: Record<TransformMode, string> = {
      translate: 'Déplacer',
      rotate: 'Rotation',
      scale: 'Échelle',
    };
    return map[this.transformMode()];
  });

  private symmetryVersion = signal(0);
  isSymmetryMirrorSelected = computed(() => {
    this.symmetryVersion();
    this.circularRepeatVersion();
    const obj = this.selectedObject();
    return obj instanceof THREE.Mesh && this.isLockedSelection(obj);
  });
  private circularRepeatVersion = signal(0);
  canCreateCircularRepeat = computed(() => {
    this.circularRepeatVersion();
    this.symmetryVersion();
    const obj = this.selectedObject();
    if (!(obj instanceof THREE.Mesh)) return false;
    return !this.isLockedSelection(obj);
  });
  hasCircularRepeat = computed(() => {
    this.circularRepeatVersion();
    const obj = this.selectedObject();
    if (!(obj instanceof THREE.Mesh)) return false;

    const asMaster = this.getCircularRepeatLinkByMasterId(obj.uuid);
    if (asMaster) return asMaster.slaveIds.length > 0;

    const asSlave = this.getCircularRepeatLinkBySlaveId(obj.uuid);
    return !!asSlave && asSlave.slaveIds.length > 0;
  });
  circularRepeatCount = computed(() => {
    this.circularRepeatVersion();
    const obj = this.selectedObject();
    if (!(obj instanceof THREE.Mesh)) return 1;

    const asMaster = this.getCircularRepeatLinkByMasterId(obj.uuid);
    if (asMaster) return asMaster.slaveIds.length + 1;

    const asSlave = this.getCircularRepeatLinkBySlaveId(obj.uuid);
    if (asSlave) return asSlave.slaveIds.length + 1;

    return 1;
  });
  canCreateSymmetry = computed(() => {
    this.symmetryVersion();
    this.circularRepeatVersion();
    const obj = this.selectedObject();
    if (!(obj instanceof THREE.Mesh)) return false;
    if (this.isLockedSelection(obj)) return false;
    return !this.getSymmetryLinkBySourceId(obj.uuid);
  });
  canToggleSymmetryPlane = computed(() => {
    this.symmetryVersion();
    const obj = this.selectedObject();
    if (!(obj instanceof THREE.Mesh)) return false;
    return !!this.getSymmetryLinkBySourceId(obj.uuid);
  });
  hasSymmetryLink = computed(() => {
    this.symmetryVersion();
    const obj = this.selectedObject();
    if (!(obj instanceof THREE.Mesh)) return false;
    return !!this.getSymmetryLinkBySourceId(obj.uuid);
  });
  currentSymmetryPlane = computed<SymmetryPlane>(() => {
    this.symmetryVersion();
    const obj = this.selectedObject();
    if (!(obj instanceof THREE.Mesh)) return 'right';
    const link = this.getSymmetryLinkBySourceId(obj.uuid);
    return link?.plane ?? 'right';
  });

  // ── Three.js internals ────────────────────────────────────────────────────
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private composer!: EffectComposer;
  private renderPass!: RenderPass;
  private selectedOutlinePass!: OutlinePass;
  private hoverOutlinePass!: OutlinePass;
  private fxaaPass!: ShaderPass;
  private outputPass!: OutputPass;

  private objects: THREE.Mesh[] = [];
  private hoveredObject: THREE.Mesh | null = null;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  private gizmo!: TransformGizmo;
  private gridPlanes!: GridPlanes;
  private gridHelper!: THREE.GridHelper;

  // Camera orbit state
  private isOrbiting = false;
  private orbitMoved = false;
  private suppressNextClick = false;
  private orbitStart = new THREE.Vector2();
  private spherical = new THREE.Spherical(12, Math.PI / 3, 0);
  private cameraTarget = new THREE.Vector3();

  private animFrameId = 0;
  private resizeObserver!: ResizeObserver;

  // Liens métier entre objets.
  private symmetryLinks = new Map<string, SymmetryLink>();
  private circularRepeatLinks = new Map<string, CircularRepeatLink>();

  // Configuration des métadonnées userData pour chaque type de relation.
  private readonly symmetryRelation: SlaveRelationDescriptor = {
    roleKey: 'symmetryRole',
    masterIdKey: 'symmetrySourceId',
    masterRoleValue: 'source',
    slaveRoleValue: 'mirror',
  };

  private readonly circularRepeatRelation: SlaveRelationDescriptor = {
    roleKey: 'circularRepeatRole',
    masterIdKey: 'circularRepeatMasterId',
    masterRoleValue: 'master',
    slaveRoleValue: 'slave',
  };

  private readonly reflectionFront = new THREE.Matrix4().makeScale(1, 1, -1);
  private readonly reflectionRight = new THREE.Matrix4().makeScale(-1, 1, 1);
  private readonly tmpSourceMatrix = new THREE.Matrix4();
  private readonly tmpMirroredMatrix = new THREE.Matrix4();
  private readonly tmpPosition = new THREE.Vector3();
  private readonly tmpQuaternion = new THREE.Quaternion();
  private readonly tmpScale = new THREE.Vector3();

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit() {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initScene();
      this.initLights();
      this.initGrid();
      this.initPostProcessing();
      this.gizmo = new TransformGizmo(this.scene, this.camera, this.renderer);
      this.gridPlanes = new GridPlanes(this.scene);
      this.bindEvents();
      this.animate();
      this.setupResizeObserver();
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animFrameId);
    this.resizeObserver?.disconnect();
    this.renderer?.dispose();
    this.unbindEvents();
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  private initScene() {
    const canvas = this.canvasRef.nativeElement;
    const { width, height } = canvas.getBoundingClientRect();

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(width || 800, height || 600);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    const bgCss = getComputedStyle(document.documentElement)
      .getPropertyValue('--surface-100')
      .trim();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(bgCss);

    this.camera = new THREE.PerspectiveCamera(55, (width || 800) / (height || 600), 0.1, 200);
    this.updateCameraPosition();
  }

  private initLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(2048, 2048);
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 60;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    this.scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-10, -5, -5);
    this.scene.add(directionalLight2);
  }

  private initGrid() {
    this.gridHelper = new THREE.GridHelper(30, 30, 0x334455, 0x222a38);
    this.gridHelper.position.y = -0.01;
    this.scene.add(this.gridHelper);

    // Shadow plane
    const shadowGeo = new THREE.PlaneGeometry(30, 30);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    this.scene.add(shadowPlane);
  }

  private initPostProcessing() {
    const canvas = this.canvasRef.nativeElement;
    const { width, height } = canvas.getBoundingClientRect();
    const size = new THREE.Vector2(width || 800, height || 600);

    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.selectedOutlinePass = new OutlinePass(size, this.scene, this.camera);
    this.hoverOutlinePass = new OutlinePass(size, this.scene, this.camera);
    this.fxaaPass = new ShaderPass(FXAAShader);
    this.outputPass = new OutputPass();

    this.selectedOutlinePass.edgeStrength = 5;
    this.selectedOutlinePass.edgeThickness = 2;
    this.selectedOutlinePass.pulsePeriod = 0;
    this.selectedOutlinePass.visibleEdgeColor.set(0x00d9ff);
    this.selectedOutlinePass.hiddenEdgeColor.set(0x007a8f);

    this.hoverOutlinePass.edgeStrength = 3;
    this.hoverOutlinePass.edgeThickness = 1.2;
    this.hoverOutlinePass.pulsePeriod = 0;
    this.hoverOutlinePass.visibleEdgeColor.set(0xffffff);
    this.hoverOutlinePass.hiddenEdgeColor.set(0x8f8f8f);

    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.hoverOutlinePass);
    this.composer.addPass(this.selectedOutlinePass);
    this.composer.addPass(this.fxaaPass);
    this.composer.addPass(this.outputPass);

    this.updateFxaaResolution(size.x, size.y);
  }

  private updateFxaaResolution(width: number, height: number) {
    const pixelRatio = this.renderer.getPixelRatio();
    const safeWidth = Math.max(1, width * pixelRatio);
    const safeHeight = Math.max(1, height * pixelRatio);
    this.fxaaPass.material.uniforms['resolution'].value.set(1 / safeWidth, 1 / safeHeight);
  }

  // ── Render loop ───────────────────────────────────────────────────────────
  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);
    this.clock.getDelta();

    this.syncSymmetryLinks();
    this.syncCircularRepeats();

    this.gizmo.update(this.selectedObject(), this.transformMode());
    this.composer.render();
  };

  // ── Events ────────────────────────────────────────────────────────────────
  private boundMouseMove!: (e: MouseEvent) => void;
  private boundMouseDown!: (e: MouseEvent) => void;
  private boundMouseUp!: (e: MouseEvent) => void;
  private boundClick!: (e: MouseEvent) => void;
  private boundKeyDown!: (e: KeyboardEvent) => void;
  private boundWheel!: (e: WheelEvent) => void;
  private boundWindowMouseUp!: (e: MouseEvent) => void;

  private bindEvents() {
    const canvas = this.canvasRef.nativeElement;
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseDown = this.onMouseDown.bind(this);
    this.boundMouseUp = this.onMouseUp.bind(this);
    this.boundClick = this.onClick.bind(this);
    this.boundKeyDown = this.onKeyDown.bind(this);
    this.boundWheel = this.onWheel.bind(this);
    this.boundWindowMouseUp = this.onMouseUp.bind(this);

    canvas.addEventListener('mousemove', this.boundMouseMove);
    canvas.addEventListener('mousedown', this.boundMouseDown);
    canvas.addEventListener('mouseup', this.boundMouseUp);
    canvas.addEventListener('click', this.boundClick);
    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('mouseup', this.boundWindowMouseUp);
    canvas.addEventListener('wheel', this.boundWheel, { passive: false });
  }

  private unbindEvents() {
    const canvas = this.canvasRef.nativeElement;
    if (!canvas) return;
    canvas.removeEventListener('mousemove', this.boundMouseMove);
    canvas.removeEventListener('mousedown', this.boundMouseDown);
    canvas.removeEventListener('mouseup', this.boundMouseUp);
    canvas.removeEventListener('click', this.boundClick);
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('mouseup', this.boundWindowMouseUp);
    canvas.removeEventListener('wheel', this.boundWheel);
  }

  private getMouseNDC(e: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
  }

  private onMouseMove(e: MouseEvent) {
    this.mouse.copy(this.getMouseNDC(e));

    // Orbit camera
    if (this.isOrbiting) {
      const pixelDx = e.clientX - this.orbitStart.x;
      const pixelDy = e.clientY - this.orbitStart.y;
      if (Math.abs(pixelDx) > 1 || Math.abs(pixelDy) > 1) {
        this.orbitMoved = true;
      }

      const dx = (e.clientX - this.orbitStart.x) * 0.005;
      const dy = (e.clientY - this.orbitStart.y) * 0.005;
      this.spherical.theta -= dx;
      this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.spherical.phi - dy));
      this.orbitStart.set(e.clientX, e.clientY);
      this.updateCameraPosition();
      return;
    }

    // Keep gizmo hover feedback updated even when not dragging.
    this.gizmo.onMouseMove(this.mouse, this.camera);

    // Gizmo drag
    if (this.gizmo.isDragging()) {
      this.contextMenuPos.set(null);
      this.gizmo.onMouseMove(this.mouse, this.camera);
      this.emitSelectedShapeChange();
      return;
    }

    // Hover detection
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.objects, false);
    const hit = hits.length > 0 ? (hits[0].object as THREE.Mesh) : null;

    if (hit !== this.hoveredObject) {
      this.hoveredObject = hit;
      this.updateOutlinePasses();
      this.canvasRef.nativeElement.style.cursor = hit ? 'pointer' : 'default';
    }
  }

  private onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;

    // Try gizmo first
    if (this.selectedObject()) {
      const ndc = this.getMouseNDC(e);
      if (this.gizmo.onMouseDown(ndc, this.camera)) {
        this.contextMenuPos.set(null);
        return;
      }
    }

    // Check object
    this.raycaster.setFromCamera(this.getMouseNDC(e), this.camera);
    const objHits = this.raycaster.intersectObjects(this.objects, false);
    if (objHits.length === 0) {
      // Start orbit
      this.isOrbiting = true;
      this.orbitMoved = false;
      this.orbitStart.set(e.clientX, e.clientY);
      this.contextMenuPos.set(null);
      this.canvasRef.nativeElement.style.cursor = 'grabbing';
    }
  }

  private onMouseUp(e: MouseEvent) {
    if (this.isOrbiting) {
      if (this.orbitMoved) {
        this.suppressNextClick = true;
      }
      this.isOrbiting = false;
      this.canvasRef.nativeElement.style.cursor = 'default';
    }
    this.gizmo.onMouseUp();
    this.updateContextMenuPos();
    this.emitSelectedShapeChange();
  }

  private onClick(e: MouseEvent) {
    if (this.suppressNextClick) {
      this.suppressNextClick = false;
      return;
    }
    if (this.isOrbiting) return;
    if (this.gizmo.hasDragged()) return;

    const ndc = this.getMouseNDC(e);
    this.raycaster.setFromCamera(ndc, this.camera);

    const visiblePlanes = this.gridPlanes.getPlanes().filter((plane) => plane.visible);
    const planeHits = this.raycaster.intersectObjects(visiblePlanes, false);
    const hits = this.raycaster.intersectObjects(this.objects, false);

    this.ngZone.run(() => {
      if (hits.length > 0) {
        const mesh = hits[0].object as THREE.Mesh;
        this.selectObject(mesh);
      } else if (planeHits.length > 0) {
        const planeName = planeHits[0].object.userData['planeName'] as ViewPlane;
        this.activePlane.set(planeName ?? null);
      } else {
        this.deselectObject();
      }
    });
  }

  private onKeyDown(e: KeyboardEvent) {
    const selected = this.selectedObject();
    if (!(selected instanceof THREE.Mesh)) return;

    if (this.isLockedSelection(selected)) {
      this.ngZone.run(() => {
        if (e.key === 'Delete' || e.key === 'Backspace') this.deleteSelected();
        if (e.key === 'Escape') this.deselectObject();
      });
      return;
    }

    this.ngZone.run(() => {
      if (e.key === 'g') this.setTransformMode('translate');
      if (e.key === 'r') this.setTransformMode('rotate');
      if (e.key === 's') this.setTransformMode('scale');
      if (e.key === 'Delete' || e.key === 'Backspace') this.deleteSelected();
      if (e.key === 'Escape') this.deselectObject();
    });
  }

  private onWheel(e: WheelEvent) {
    e.preventDefault();
    this.spherical.radius = Math.max(2, Math.min(60, this.spherical.radius + e.deltaY * 0.02));
    this.updateCameraPosition();
  }

  // ── Camera ────────────────────────────────────────────────────────────────
  private updateCameraPosition() {
    const pos = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(pos.add(this.cameraTarget));
    this.camera.lookAt(this.cameraTarget);
  }

  // ── Selection ─────────────────────────────────────────────────────────────
  private selectObject(mesh: THREE.Mesh) {
    this.selectedObject.set(mesh);
    this.updateOutlinePasses();
    if (this.isLockedSelection(mesh)) {
      this.gizmo.detach();
    } else {
      this.gizmo.attach(mesh);
    }
    this.updateContextMenuPos();
    this.emitSelectedShapeChange();
  }

  private deselectObject() {
    this.selectedObject.set(null);
    this.updateOutlinePasses();
    this.gizmo.detach();
    this.contextMenuPos.set(null);
    this.emitSelectedShapeChange();
  }

  private updateContextMenuPos() {
    const obj = this.selectedObject();
    if (!obj) return;

    const bbox = new THREE.Box3().setFromObject(obj);
    const center = bbox.getCenter(new THREE.Vector3());
    const bottom = new THREE.Vector3(center.x, bbox.min.y, center.z);

    const projected = bottom.clone().project(this.camera);
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    // Relative to wrapper
    const x = ((projected.x + 1) / 2) * rect.width;
    const y = ((-projected.y + 1) / 2) * rect.height + 24;

    this.ngZone.run(() => this.contextMenuPos.set({ x, y }));
  }

  // ── Outline ───────────────────────────────────────────────────────────────
  private updateOutlinePasses() {
    const selected = this.selectedObject();
    const hovered = this.hoveredObject;

    this.selectedOutlinePass.selectedObjects = selected instanceof THREE.Mesh ? [selected] : [];
    this.hoverOutlinePass.selectedObjects =
      hovered instanceof THREE.Mesh && hovered !== selected ? [hovered] : [];
  }

  // ── Public actions ────────────────────────────────────────────────────────
  async exportTransparentPng(fileName = 'model-transparent.png'): Promise<void> {
    if (!this.renderer || !this.scene || !this.composer) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const selectedBeforeExport = this.selectedObject();
    const previousGridVisible = this.gridHelper?.visible ?? false;
    const planeVisibility = this.gridPlanes
      .getPlanes()
      .map((plane) => ({ plane, visible: plane.visible }));
    const previousBackground = this.scene.background;
    const previousClearColor = new THREE.Color();
    this.renderer.getClearColor(previousClearColor);
    const previousClearAlpha = this.renderer.getClearAlpha();
    const previousSelectedOutlineEnabled = this.selectedOutlinePass.enabled;
    const previousHoverOutlineEnabled = this.hoverOutlinePass.enabled;

    try {
      if (this.gridHelper) {
        this.gridHelper.visible = false;
      }

      for (const { plane } of planeVisibility) {
        plane.visible = false;
      }

      // Hide transform gizmo from export.
      this.gizmo.detach();
      this.selectedOutlinePass.enabled = false;
      this.hoverOutlinePass.enabled = false;

      this.scene.background = null;
      this.renderer.setClearColor(0x000000, 0);
      this.composer.render();

      const blob = await this.canvasToPngBlob(canvas);
      if (!blob) {
        return;
      }

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      this.scene.background = previousBackground;
      this.renderer.setClearColor(previousClearColor, previousClearAlpha);
      this.selectedOutlinePass.enabled = previousSelectedOutlineEnabled;
      this.hoverOutlinePass.enabled = previousHoverOutlineEnabled;

      if (this.gridHelper) {
        this.gridHelper.visible = previousGridVisible;
      }

      for (const { plane, visible } of planeVisibility) {
        plane.visible = visible;
      }

      if (selectedBeforeExport instanceof THREE.Mesh && !this.isLockedSelection(selectedBeforeExport)) {
        this.gizmo.attach(selectedBeforeExport);
      }
    }
  }

  addShape(type: ShapeConfig['type']) {
    const mesh = this.shapeService.create({ type });
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    // Ajout a l'origine pour un placement deterministe.
    mesh.position.set(0, 0, 0);
    this.scene.add(mesh);
    this.objects.push(mesh);
    this.ngZone.run(() => this.objectCount.set(this.objects.length));
    this.selectObject(mesh);
  }

  applySelectedShapePatch(patch: Partial<ShapeParameterMap>) {
    const obj = this.selectedObject();
    if (!(obj instanceof THREE.Mesh)) return;
    if (this.isLockedSelection(obj)) return;

    this.shapeService.applyParams(obj, patch);

    const circular = this.getCircularRepeatLinkByMasterId(obj.uuid);
    if (circular) {
      for (const slaveId of circular.slaveIds) {
        const slave = this.getMeshById(slaveId);
        if (slave) {
          this.shapeService.applyParams(slave, patch);
        }
      }
    }

    const link = this.getSymmetryLinkBySourceId(obj.uuid);
    if (link) {
      const mirror = this.getMeshById(link.mirrorId);
      if (mirror) {
        this.shapeService.applyParams(mirror, patch);
      }
    }

    this.updateContextMenuPos();
    this.emitSelectedShapeChange();
  }

  setTransformMode(mode: TransformMode) {
    const obj = this.selectedObject();
    if (obj instanceof THREE.Mesh && this.isLockedSelection(obj)) return;
    this.transformMode.set(mode);
    this.gizmo.setMode(mode);
  }

  toggleGrid() {
    this.showGrid.update((v) => !v);
    this.gridHelper.visible = this.showGrid();
  }

  togglePlane(plane: ViewPlane) {
    const current = this.activePlane();
    const next: ViewPlane = current === plane ? null : plane;
    this.activePlane.set(next);
    this.gridPlanes.updateGridVisibility(next);
  }

  deleteSelected() {
    const obj = this.selectedObject();
    if (!(obj instanceof THREE.Mesh)) return;

    const asSource = this.getSymmetryLinkBySourceId(obj.uuid);
    if (asSource) {
      const mirror = this.getMeshById(asSource.mirrorId);
      if (mirror) {
        this.detachMirrorFromSymmetry(mirror);
      }
      this.clearSourceSymmetry(obj);
      this.symmetryLinks.delete(obj.uuid);
      this.bumpSymmetryVersion();
    }

    const asMirror = this.getSymmetryLinkByMirrorId(obj.uuid);
    if (asMirror) {
      const source = this.getMeshById(asMirror.sourceId);
      if (source) {
        this.clearSourceSymmetry(source);
      }
      this.symmetryLinks.delete(asMirror.sourceId);
      this.bumpSymmetryVersion();
    }

    const circularAsMaster = this.getCircularRepeatLinkByMasterId(obj.uuid);
    if (circularAsMaster) {
      for (const slaveId of circularAsMaster.slaveIds) {
        const slave = this.getMeshById(slaveId);
        if (slave) {
          this.detachCircularSlave(slave);
        }
      }
      this.clearCircularMaster(obj);
      this.circularRepeatLinks.delete(obj.uuid);
      this.bumpCircularRepeatVersion();
    }

    const circularAsSlave = this.getCircularRepeatLinkBySlaveId(obj.uuid);
    if (circularAsSlave) {
      circularAsSlave.slaveIds = circularAsSlave.slaveIds.filter((id) => id !== obj.uuid);
      this.detachCircularSlave(obj);

      const master = this.getMeshById(circularAsSlave.masterId);
      if (circularAsSlave.slaveIds.length === 0) {
        if (master) {
          this.clearCircularMaster(master);
        }
        this.circularRepeatLinks.delete(circularAsSlave.masterId);
      }
      this.bumpCircularRepeatVersion();
    }

    this.scene.remove(obj);
    this.objects = this.objects.filter((o) => o !== obj);
    if (this.hoveredObject === obj) {
      this.hoveredObject = null;
    }
    this.deselectObject();
    this.ngZone.run(() => this.objectCount.set(this.objects.length));
  }

  duplicateSelected() {
    const obj = this.selectedObject() as THREE.Mesh;
    if (!obj) return;
    if (this.isLockedSelection(obj)) return;
    const clone = obj.clone() as THREE.Mesh;
    clone.position.x += 1.2;
    clone.userData = { ...obj.userData, name: obj.userData['name'] + ' (copie)' };
    this.scene.add(clone);
    this.objects.push(clone);
    this.ngZone.run(() => this.objectCount.set(this.objects.length));
    this.selectObject(clone);
  }

  createCircularRepeatClone() {
    const master = this.selectedObject();
    if (!(master instanceof THREE.Mesh)) return;
    if (this.isLockedSelection(master)) return;

    const link =
      this.getCircularRepeatLinkByMasterId(master.uuid) ?? this.createCircularRepeatLink(master);

    const slave = master.clone() as THREE.Mesh;
    slave.userData = {
      ...master.userData,
      name: `${master.userData['name'] ?? master.name ?? 'Objet'} (rep ${link.slaveIds.length + 2})`,
    };

    this.scene.add(slave);
    this.objects.push(slave);

    link.slaveIds.push(slave.uuid);
    this.markCircularSlave(slave, master.uuid);

    this.updateCircularRepeatLayout(master, link);
    this.bumpCircularRepeatVersion();
    this.ngZone.run(() => this.objectCount.set(this.objects.length));
    this.selectObject(master);
  }

  // ── Symétrie (spécifique) ───────────────────────────────────────────────
  createSymmetryClone() {
    const source = this.selectedObject();
    if (!(source instanceof THREE.Mesh)) return;
    if (this.isLockedSelection(source)) return;
    if (this.getSymmetryLinkBySourceId(source.uuid)) return;

    const mirror = source.clone() as THREE.Mesh;
    mirror.userData = {
      ...source.userData,
      name: `${source.userData['name'] ?? source.name ?? 'Objet'} (sym)`,
    };

    this.scene.add(mirror);
    this.objects.push(mirror);

    const link: SymmetryLink = {
      sourceId: source.uuid,
      mirrorId: mirror.uuid,
      plane: 'right',
    };
    this.symmetryLinks.set(source.uuid, link);

    this.markSymmetrySource(source, mirror.uuid, link.plane);
    this.markSymmetryMirror(mirror, source.uuid, link.plane);

    this.applyMirroredTransform(source, mirror, link.plane);
    this.bumpSymmetryVersion();
    this.ngZone.run(() => this.objectCount.set(this.objects.length));
    this.selectObject(source);
  }

  toggleSelectedSymmetryPlane() {
    const source = this.selectedObject();
    if (!(source instanceof THREE.Mesh)) return;

    const link = this.getSymmetryLinkBySourceId(source.uuid);
    if (!link) return;

    link.plane = link.plane === 'front' ? 'right' : 'front';
    source.userData['symmetryPlane'] = link.plane;

    const mirror = this.getMeshById(link.mirrorId);
    if (mirror) {
      mirror.userData['symmetryPlane'] = link.plane;
      this.applyMirroredTransform(source, mirror, link.plane);
    }

    this.bumpSymmetryVersion();
  }

  private emitSelectedShapeChange() {
    const snapshot = this.buildSelectedShapeSnapshot();
    this.ngZone.run(() => this.selectedShapeChange.emit(snapshot));
  }

  private buildSelectedShapeSnapshot(): CanvasShapeSnapshot | null {
    const obj = this.selectedObject();
    if (!(obj instanceof THREE.Mesh)) return null;
    if (this.isLockedSelection(obj)) return null;

    const base = this.shapeService.getSnapshotForMesh(obj);
    return {
      id: obj.uuid,
      name: base.name,
      type: base.type,
      controls: base.controls,
      params: base.params,
    };
  }

  private syncSymmetryLinks() {
    for (const [sourceId, link] of this.symmetryLinks) {
      const source = this.getMeshById(sourceId);
      const mirror = this.getMeshById(link.mirrorId);

      if (!source && mirror) {
        this.detachMirrorFromSymmetry(mirror);
        this.symmetryLinks.delete(sourceId);
        this.bumpSymmetryVersion();
        continue;
      }

      if (source && !mirror) {
        this.clearSourceSymmetry(source);
        this.symmetryLinks.delete(sourceId);
        this.bumpSymmetryVersion();
        continue;
      }

      if (source && mirror) {
        this.applyMirroredTransform(source, mirror, link.plane);
      }
    }
  }

  // ── Répétition Circulaire (spécifique) ──────────────────────────────────
  private syncCircularRepeats() {
    for (const [masterId, link] of this.circularRepeatLinks) {
      const master = this.getMeshById(masterId);

      if (!master) {
        this.detachSlaveMeshes(link.slaveIds, (slave) => this.detachCircularSlave(slave));
        this.circularRepeatLinks.delete(masterId);
        this.bumpCircularRepeatVersion();
        continue;
      }

      link.slaveIds = link.slaveIds.filter((slaveId) => this.getMeshById(slaveId) !== null);

      if (link.slaveIds.length === 0) {
        this.clearCircularMaster(master);
        this.circularRepeatLinks.delete(masterId);
        this.bumpCircularRepeatVersion();
        continue;
      }

      this.updateCircularRepeatLayout(master, link);
    }
  }

  // Initialise une relation de répétition circulaire pour un master.
  private createCircularRepeatLink(master: THREE.Mesh): CircularRepeatLink {
    const center = new THREE.Vector3(0, master.position.y, 0);
    const link: CircularRepeatLink = {
      masterId: master.uuid,
      slaveIds: [],
      center,
    };

    this.circularRepeatLinks.set(master.uuid, link);
    this.markCircularMaster(master);
    return link;
  }

  // Recalcule la répartition des esclaves autour du centre commun.
  private updateCircularRepeatLayout(master: THREE.Mesh, link: CircularRepeatLink) {
    const count = link.slaveIds.length + 1;
    if (count <= 1) return;

    link.center.y = master.position.y;

    const center = link.center;
    const dx = master.position.x - center.x;
    const dz = master.position.z - center.z;
    const radius = Math.max(0.001, Math.hypot(dx, dz));
    const masterAngle = Math.atan2(-dz, dx);
    const yAxis = new THREE.Vector3(0, 1, 0);

    for (let index = 0; index < link.slaveIds.length; index++) {
      const slave = this.getMeshById(link.slaveIds[index]);
      if (!slave) continue;

      const angle = masterAngle + ((index + 1) * Math.PI * 2) / count;
      slave.position.set(
        center.x + radius * Math.cos(angle),
        master.position.y,
        center.z - radius * Math.sin(angle),
      );

      const radial = new THREE.Vector3(
        slave.position.x - center.x,
        0,
        slave.position.z - center.z,
      ).normalize();

      // Oriente chaque esclave selon sa position sur l'orbite (radial sortant).
      const deltaAngle = ((index + 1) * Math.PI * 2) / count;
      const orbitQuat = new THREE.Quaternion().setFromAxisAngle(yAxis, deltaAngle);

      // Applique d'abord l'offset orbital dans le repere monde (axe Y),
      // puis conserve l'orientation du master sur les autres axes.
      slave.quaternion.copy(master.quaternion).premultiply(orbitQuat);

      slave.scale.copy(master.scale);
      slave.matrixAutoUpdate = true;
      slave.updateMatrix();
      slave.updateMatrixWorld(true);
    }
  }

  // ── Symétrie: transform miroir ───────────────────────────────────────────
  private applyMirroredTransform(source: THREE.Mesh, mirror: THREE.Mesh, plane: SymmetryPlane) {
    source.updateMatrix();

    const reflection = plane === 'front' ? this.reflectionFront : this.reflectionRight;
    this.tmpSourceMatrix.copy(source.matrix);
    this.tmpMirroredMatrix.multiplyMatrices(reflection, this.tmpSourceMatrix);

    // Keep the mirrored object as a direct matrix transform to preserve the -1 reflection.
    mirror.matrixAutoUpdate = false;
    mirror.matrix.copy(this.tmpMirroredMatrix);
    mirror.matrixWorldNeedsUpdate = true;
    mirror.updateMatrixWorld(true);
  }

  private getMeshById(uuid: string): THREE.Mesh | null {
    return this.objects.find((mesh) => mesh.uuid === uuid) ?? null;
  }

  private getSymmetryLinkBySourceId(sourceId: string): SymmetryLink | undefined {
    return this.symmetryLinks.get(sourceId);
  }

  private getSymmetryLinkByMirrorId(mirrorId: string): SymmetryLink | undefined {
    for (const link of this.symmetryLinks.values()) {
      if (link.mirrorId === mirrorId) return link;
    }
    return undefined;
  }

  private getCircularRepeatLinkByMasterId(masterId: string): CircularRepeatLink | undefined {
    return this.circularRepeatLinks.get(masterId);
  }

  private getCircularRepeatLinkBySlaveId(slaveId: string): CircularRepeatLink | undefined {
    for (const link of this.circularRepeatLinks.values()) {
      if (link.slaveIds.includes(slaveId)) return link;
    }
    return undefined;
  }

  // ── Répétition Circulaire: marquage et nettoyage ────────────────────────
  private markCircularMaster(master: THREE.Mesh) {
    this.setMasterRelation(master, this.circularRepeatRelation);
  }

  private clearCircularMaster(master: THREE.Mesh) {
    this.clearMasterRelation(master, this.circularRepeatRelation);
  }

  private markCircularSlave(slave: THREE.Mesh, masterId: string) {
    this.setSlaveRelation(slave, masterId, this.circularRepeatRelation);
  }

  private detachCircularSlave(slave: THREE.Mesh) {
    this.clearSlaveRelation(slave, this.circularRepeatRelation);
  }

  // ── Verrouillage des objets esclaves ─────────────────────────────────────
  private isLockedSymmetryMirror(mesh: THREE.Mesh): boolean {
    return this.isLockedSlaveRelation(
      mesh,
      this.symmetryRelation,
      (sourceId) => !!this.symmetryLinks.get(sourceId),
    );
  }

  private isLockedCircularSlave(mesh: THREE.Mesh): boolean {
    return this.isLockedSlaveRelation(
      mesh,
      this.circularRepeatRelation,
      (masterId) => !!this.circularRepeatLinks.get(masterId),
    );
  }

  private isLockedSelection(mesh: THREE.Mesh): boolean {
    return this.isLockedSymmetryMirror(mesh) || this.isLockedCircularSlave(mesh);
  }

  // ── Symétrie: nettoyage source/esclave ───────────────────────────────────
  private detachMirrorFromSymmetry(mirror: THREE.Mesh) {
    if (!mirror.matrixAutoUpdate) {
      mirror.matrix.decompose(this.tmpPosition, this.tmpQuaternion, this.tmpScale);
      mirror.position.copy(this.tmpPosition);
      mirror.quaternion.copy(this.tmpQuaternion);
      mirror.scale.copy(this.tmpScale);
      mirror.matrixAutoUpdate = true;
      mirror.updateMatrix();
      mirror.updateMatrixWorld(true);
    }

    this.clearSlaveRelation(mirror, this.symmetryRelation);
    delete mirror.userData['symmetryPlane'];
  }

  private clearSourceSymmetry(source: THREE.Mesh) {
    this.clearMasterRelation(source, this.symmetryRelation);
    delete source.userData['symmetryMirrorId'];
    delete source.userData['symmetryPlane'];
  }

  private markSymmetrySource(source: THREE.Mesh, mirrorId: string, plane: SymmetryPlane) {
    this.setMasterRelation(source, this.symmetryRelation);
    source.userData['symmetryMirrorId'] = mirrorId;
    source.userData['symmetryPlane'] = plane;
  }

  private markSymmetryMirror(mirror: THREE.Mesh, sourceId: string, plane: SymmetryPlane) {
    this.setSlaveRelation(mirror, sourceId, this.symmetryRelation);
    mirror.userData['symmetryPlane'] = plane;
  }

  // ── Helpers génériques maitre/esclave (mutualisés) ──────────────────────
  private setMasterRelation(mesh: THREE.Mesh, descriptor: SlaveRelationDescriptor) {
    mesh.userData[descriptor.roleKey] = descriptor.masterRoleValue;
  }

  private clearMasterRelation(mesh: THREE.Mesh, descriptor: SlaveRelationDescriptor) {
    delete mesh.userData[descriptor.roleKey];
  }

  private setSlaveRelation(
    mesh: THREE.Mesh,
    masterId: string,
    descriptor: SlaveRelationDescriptor,
  ) {
    mesh.userData[descriptor.roleKey] = descriptor.slaveRoleValue;
    mesh.userData[descriptor.masterIdKey] = masterId;
  }

  private clearSlaveRelation(mesh: THREE.Mesh, descriptor: SlaveRelationDescriptor) {
    delete mesh.userData[descriptor.roleKey];
    delete mesh.userData[descriptor.masterIdKey];
  }

  private isLockedSlaveRelation(
    mesh: THREE.Mesh,
    descriptor: SlaveRelationDescriptor,
    hasMasterLink: (masterId: string) => boolean,
  ): boolean {
    const role = mesh.userData[descriptor.roleKey];
    const masterId = mesh.userData[descriptor.masterIdKey];
    return (
      role === descriptor.slaveRoleValue && typeof masterId === 'string' && hasMasterLink(masterId)
    );
  }

  private detachSlaveMeshes(
    slaveIds: ReadonlyArray<string>,
    detachFn: (slave: THREE.Mesh) => void,
  ) {
    for (const slaveId of slaveIds) {
      const slave = this.getMeshById(slaveId);
      if (slave) {
        detachFn(slave);
      }
    }
  }

  private bumpSymmetryVersion() {
    this.symmetryVersion.update((value) => value + 1);
  }

  private bumpCircularRepeatVersion() {
    this.circularRepeatVersion.update((value) => value + 1);
  }

  private canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  }

  // ── Resize ────────────────────────────────────────────────────────────────
  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
        this.selectedOutlinePass.setSize(width, height);
        this.hoverOutlinePass.setSize(width, height);
        this.updateFxaaResolution(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
      }
    });
    this.resizeObserver.observe(this.wrapperRef.nativeElement);
  }
}
