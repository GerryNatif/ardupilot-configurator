import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
  afterNextRender
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DroneLinkFacade } from '../../core/mavlink/facade/drone-link.facade';
import { GuiBox } from '../ui/gui-box/gui-box';

@Component({
  selector: 'app-three-viewer',
  imports: [GuiBox],
  templateUrl: './three-viewer.html',
  styleUrl: './three-viewer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreeViewer {
  private static readonly MODEL_ASSET_PATH = 'assets/3d_models/quad_x.gltf';
  private static readonly ROTATION_SMOOTHING = 16;

  private readonly link = inject(DroneLinkFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewportRef = viewChild.required<ElementRef<HTMLDivElement>>('viewport');

  readonly attitude = computed(() => this.link.telemetry().attitude);
  readonly rollText = computed(() => this.formatDeg(this.attitude().rollDeg));
  readonly pitchText = computed(() => this.formatDeg(this.attitude().pitchDeg));
  readonly yawText = computed(() => this.formatDeg(this.attitude().yawDeg));
  readonly hasAttitude = computed(() => this.attitude().lastSeenMs != null);
  readonly loadState = signal<'loading' | 'ready' | 'error'>('loading');
  readonly errorMessage = signal<string | null>(null);
  readonly statusMessage = computed(() => {
    if (this.loadState() === 'loading') {
      return 'Chargement du modele 3D...';
    }

    if (this.loadState() === 'error') {
      return this.errorMessage() ?? 'Impossible de charger le modele 3D';
    }

    if (!this.hasAttitude()) {
      return 'En attente des donnees ATTITUDE';
    }

    return null;
  });

  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  private readonly rendererHost = new THREE.Group();
  private readonly lightRig = this.createLightRig();
  private readonly targetRotation = new THREE.Euler(0, 0, 0, 'YXZ');

  private renderer: THREE.WebGLRenderer | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private resizeCleanup: (() => void) | null = null;
  private frameId: number | null = null;
  private modelRoot: THREE.Object3D | null = null;
  private lastFrameTimeMs: number | null = null;

  constructor() {
    this.scene.add(this.rendererHost);
    this.scene.add(this.lightRig);
    this.rendererHost.rotation.order = 'YXZ';
    this.camera.position.set(0, 1.8, 4.2);
    this.camera.lookAt(0, 0, 0);

    effect(() => {
      const rollRad = THREE.MathUtils.degToRad(this.attitude().rollDeg ?? 0);
      const pitchRad = THREE.MathUtils.degToRad(this.attitude().pitchDeg ?? 0);
      const yawRad = THREE.MathUtils.degToRad(this.attitude().yawDeg ?? 0);

      this.targetRotation.x = pitchRad;
      this.targetRotation.y = -yawRad;
      this.targetRotation.z = -rollRad;
    });

    afterNextRender(() => {
      void this.initializeScene();
    });

    this.destroyRef.onDestroy(() => {
      this.destroyScene();
    });
  }

  private async initializeScene(): Promise<void> {
    const viewport = this.viewportRef().nativeElement;

    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      this.loadState.set('error');
      this.errorMessage.set('WebGL indisponible dans cet environnement');
      return;
    }

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);

    viewport.replaceChildren(this.renderer.domElement);
    this.updateRendererSize();
    this.bindResize(viewport);
    this.startRenderLoop();

    try {
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync(ThreeViewer.MODEL_ASSET_PATH);
      const model = gltf.scene;
      this.prepareModel(model);
      this.rendererHost.add(model);
      this.modelRoot = model;
      this.loadState.set('ready');
      this.renderFrame();
    } catch (error) {
      console.error('[ThreeViewer] model loading failed', error);
      this.loadState.set('error');
      this.errorMessage.set('Le modele 3D est introuvable ou invalide');
    }
  }

  private prepareModel(model: THREE.Object3D): void {
    // Calculate bounds and center
    const bounds = new THREE.Box3().setFromObject(model);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.15 / maxAxis;

    // Center the model in its pivot by moving it to -center
    model.position.copy(center.multiplyScalar(-1));
    model.scale.setScalar(scale);

    model.traverse((child: THREE.Object3D) => {
      if (!(child instanceof THREE.Mesh)) {
        return;
      }

      child.castShadow = false;
      child.receiveShadow = false;

      const materials = Array.isArray(child.material) ? child.material : [child.material];
      for (const material of materials) {
        if ('metalness' in material) {
          material.metalness = Math.min(material.metalness ?? 0.35, 0.35);
        }

        if ('roughness' in material) {
          material.roughness = Math.max(material.roughness ?? 0.65, 0.65);
        }
      }
    });
  }

  private bindResize(viewport: HTMLDivElement): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateRendererSize();
      });
      this.resizeObserver.observe(viewport);
      return;
    }

    const onResize = () => {
      this.updateRendererSize();
    };

    window.addEventListener('resize', onResize);
    this.resizeCleanup = () => {
      window.removeEventListener('resize', onResize);
    };
  }

  private updateRendererSize(): void {
    const viewport = this.viewportRef().nativeElement;
    const renderer = this.renderer;

    if (!renderer) {
      return;
    }

    const width = Math.max(viewport.clientWidth, 1);
    const height = Math.max(viewport.clientHeight, 1);

    renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderFrame();
  }

  private startRenderLoop(): void {
    const tick = () => {
      this.renderFrame();
      this.frameId = window.requestAnimationFrame(tick);
    };

    this.frameId = window.requestAnimationFrame(tick);
  }

  private renderFrame(): void {
    this.animateOrientation();
    this.renderer?.render(this.scene, this.camera);
  }

  private animateOrientation(): void {
    const now = performance.now();
    const deltaSec = this.lastFrameTimeMs == null ? 1 / 60 : Math.min((now - this.lastFrameTimeMs) / 1000, 0.1);
    this.lastFrameTimeMs = now;

    const current = this.rendererHost.rotation;
    const target = this.targetRotation;

    current.x = THREE.MathUtils.damp(current.x, target.x, ThreeViewer.ROTATION_SMOOTHING, deltaSec);
    current.y = THREE.MathUtils.damp(
      current.y,
      this.wrapAngleNear(current.y, target.y),
      ThreeViewer.ROTATION_SMOOTHING,
      deltaSec
    );
    current.z = THREE.MathUtils.damp(
      current.z,
      this.wrapAngleNear(current.z, target.z),
      ThreeViewer.ROTATION_SMOOTHING,
      deltaSec
    );
  }

  private wrapAngleNear(current: number, target: number): number {
    const twoPi = Math.PI * 2;
    const delta = THREE.MathUtils.euclideanModulo(target - current + Math.PI, twoPi) - Math.PI;
    return current + delta;
  }

  private createLightRig(): THREE.Group {
    const rig = new THREE.Group();

    const ambient = new THREE.AmbientLight(0xffffff, 1.9);
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 5);

    const rim = new THREE.DirectionalLight(0x9fc3ff, 1.25);
    rim.position.set(-4, 2, -3);

    rig.add(ambient, key, rim);

    return rig;
  }

  private destroyScene(): void {
    if (this.frameId != null) {
      window.cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }

    this.lastFrameTimeMs = null;

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    this.resizeCleanup?.();
    this.resizeCleanup = null;

    if (this.modelRoot) {
      this.rendererHost.remove(this.modelRoot);
      this.disposeObject(this.modelRoot);
      this.modelRoot = null;
    }

    this.renderer?.dispose();
    this.renderer = null;
  }

  private disposeObject(root: THREE.Object3D): void {
    root.traverse((child: THREE.Object3D) => {
      if (!(child instanceof THREE.Mesh)) {
        return;
      }

      child.geometry.dispose();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      for (const material of materials) {
        material.dispose();
      }
    });
  }

  private formatDeg(value: number | null): string {
    return value == null ? '--' : `${value.toFixed(1)} deg`;
  }
}
