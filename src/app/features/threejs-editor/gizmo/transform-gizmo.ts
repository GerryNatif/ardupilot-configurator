import * as THREE from 'three';
import type { TransformMode } from '../components/threejs-canva/threejs-canva';

/**
 * TransformGizmo
 * A custom gizmo that renders colored axes handles (X=red, Y=green, Z=blue)
 * for translate, rotate and scale operations — similar to the Three.js editor.
 */
export class TransformGizmo {
  private group = new THREE.Group();
  private handles: THREE.Mesh[] = [];
  private activeHandle: THREE.Mesh | null = null;
  private hoveredHandle: THREE.Mesh | null = null;
  private target: THREE.Object3D | null = null;
  private mode: TransformMode = 'translate';
  private raycaster = new THREE.Raycaster();
  private _isDragging = false;
  private _hasDragged = false;
  private lastRotateAngle: number | null = null;
  private rotateAccumDelta = 0;
  private dragStart = new THREE.Vector2();
  private dragPlane = new THREE.Plane();
  private dragOffset = new THREE.Vector3();
  private startValue = new THREE.Vector3();
  private startRotation = new THREE.Euler();
  private startScale = new THREE.Vector3();
  private worldQuat = new THREE.Quaternion();
  private rotateDragFrozenPos = new THREE.Vector3();
  private rotateDragFrozenQuat = new THREE.Quaternion();
  private readonly TRANSLATE_SNAP_STEP = 0.1;
  private readonly ROTATE_SNAP_STEP_RAD = THREE.MathUtils.degToRad(5);

  constructor(
    private scene: THREE.Scene,
    private camera: THREE.PerspectiveCamera,
    private renderer: THREE.WebGLRenderer,
  ) {
  
    this.group.userData['isGizmo'] = true;
    this.group.visible = false;
    scene.add(this.group);
    this.buildHandles('translate');
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  attach(object: THREE.Object3D) {
    this.target = object;
    this.group.visible = true;
    this.syncTransform();
  }

  detach() {
    this.target = null;
    this.group.visible = false;
  }

  setMode(mode: TransformMode) {
    this.mode = mode;
    this.buildHandles(mode);
  }

  update(selected: THREE.Object3D | null, mode: TransformMode) {
    if (!selected) {
      this.group.visible = false;
      return;
    }
    if (mode !== this.mode) {
      this.mode = mode;
      this.buildHandles(mode);
    }
    this.group.visible = true;
    this.syncTransform();

    // Scale gizmo to stay same screen size
    const dist = this.camera.position.distanceTo(this.group.position);
    const scale = dist * 0.12;
    this.group.scale.setScalar(scale);
  }

  isDragging() { return this._isDragging; }
  hasDragged() {
    const v = this._hasDragged;
    this._hasDragged = false;
    return v;
  }

  onMouseDown(ndc: THREE.Vector2, camera: THREE.PerspectiveCamera): boolean {
    this.raycaster.setFromCamera(ndc, camera);
    const hits = this.raycaster.intersectObjects(this.handles, false);
    if (hits.length === 0) return false;

    this.activeHandle = hits[0].object as THREE.Mesh;
    this._isDragging = true;
    this._hasDragged = false;
    this.dragStart.copy(ndc);
    this.lastRotateAngle = null;
    this.rotateAccumDelta = 0;

    if (this.target) {
      this.startValue.copy(this.target.position);
      this.startRotation.copy(this.target.rotation);
      this.startScale.copy(this.target.scale);

      // Drag plane perpendicular to camera
      const normal = new THREE.Vector3().subVectors(camera.position, this.target.position).normalize();
      this.dragPlane.setFromNormalAndCoplanarPoint(normal, this.target.position);

      // Initial point on drag plane, used to keep object "attached" to cursor.
      const ray = this.raycaster.ray.clone();
      const hitPoint = new THREE.Vector3();
      const hasPlaneHit = ray.intersectPlane(this.dragPlane, hitPoint) !== null;
      if (!hasPlaneHit) {
        hitPoint.copy(hits[0].point);
      }
      this.dragOffset.subVectors(hitPoint, this.target.position);
    }

    this.setHandleHighlight(this.activeHandle, true);
    if (this.mode === 'rotate') {
      const axis = this.activeHandle.userData['axis'] as string;
      this.rotateDragFrozenPos.copy(this.group.position);
      this.rotateDragFrozenQuat.copy(this.group.quaternion);
      this.lastRotateAngle = this.getMouseAngleOnRotateCircle(axis, ndc);
    }
    this.applyInteractionVisualState();
    return true;
  }

  onMouseMove(ndc: THREE.Vector2, camera: THREE.PerspectiveCamera) {
    if (this._isDragging && this.activeHandle && this.target) {
      this._hasDragged = true;

      const axis = this.activeHandle.userData['axis'] as string;
      const delta = new THREE.Vector2().subVectors(ndc, this.dragStart);

      if (this.mode === 'translate') {
        this.applyTranslation(axis, ndc);
      } else if (this.mode === 'rotate') {
        this.applyRotation(axis, ndc);
      } else if (this.mode === 'scale') {
        this.applyScale(axis, delta);
      }

      this.dragStart.copy(ndc);
      return;
    }

    this.raycaster.setFromCamera(ndc, camera);
    const hits = this.raycaster.intersectObjects(this.handles, false);
    const nextHovered = hits.length > 0 ? (hits[0].object as THREE.Mesh) : null;

    if (nextHovered !== this.hoveredHandle) {
      this.hoveredHandle = nextHovered;
      this.applyInteractionVisualState();
    }
  }

  onMouseUp() {
    if (this.activeHandle) {
      this.setHandleHighlight(this.activeHandle, false);
    }
    this.activeHandle = null;
    this._isDragging = false;
    this.lastRotateAngle = null;
    this.rotateAccumDelta = 0;

    this.applyInteractionVisualState();
  }

  // ── Internal ───────────────────────────────────────────────────────────────
  private syncTransform() {
    if (this.target) {
      if (this.mode === 'rotate') {
        this.group.position.copy(this.target.position);
        this.group.quaternion.identity();
      } else if (this.mode === 'scale') {
        this.group.position.copy(this.target.position);
        this.target.getWorldQuaternion(this.worldQuat);
        this.group.quaternion.copy(this.worldQuat);
      } else {
        this.group.position.copy(this.target.position);
        this.group.quaternion.identity();
      }

      this.group.updateMatrixWorld(true);
    }
  }

  private buildHandles(mode: TransformMode) {
    // Clear all previous visuals from the group (not only pickable handles)
    // to avoid leftovers when switching between translate/rotate/scale.
    while (this.group.children.length > 0) {
      const child = this.group.children[0];
      this.group.remove(child);
      this.disposeObject3D(child);
    }
    this.handles = [];

    const axes: Array<{ axis: string; dir: THREE.Vector3; color: number }> = [
      { axis: 'x', dir: new THREE.Vector3(1, 0, 0), color: 0xff3333 },
      { axis: 'y', dir: new THREE.Vector3(0, 1, 0), color: 0x33ff66 },
      { axis: 'z', dir: new THREE.Vector3(0, 0, 1), color: 0x3366ff },
    ];

    for (const { axis, dir, color } of axes) {
      if (mode === 'translate') {
        this.addArrow(axis, dir, color);
      } else if (mode === 'rotate') {
        this.addRotateArc(axis, dir, color);
      } else if (mode === 'scale') {
        this.addScaleHandle(axis, dir, color);
      }
    }

    // Center sphere
    const centerGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const centerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const center = new THREE.Mesh(centerGeo, centerMat);
    center.userData['axis'] = 'xyz';
    this.handles.push(center);
    this.group.add(center);
  }

  private disposeObject3D(object: THREE.Object3D) {
    object.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }

      const material = mesh.material;
      if (Array.isArray(material)) {
        for (const mat of material) mat.dispose();
      } else if (material) {
        material.dispose();
      }
    });
  }

  private addArrow(axis: string, dir: THREE.Vector3, color: number) {
    const mat = new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true });
    const matLine = mat.clone();

    // Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8);
    const shaft = new THREE.Mesh(shaftGeo, matLine);

    // Tip
    const tipGeo = new THREE.ConeGeometry(0.1, 0.25, 8);
    const tip = new THREE.Mesh(tipGeo, mat);
    tip.position.y = 0.35 + 0.125;

    const arrow = new THREE.Group();
    arrow.userData['axis'] = axis;
    arrow.add(shaft, tip);

    // Rotate to axis
    if (axis === 'x') arrow.rotation.z = -Math.PI / 2;
    if (axis === 'z') arrow.rotation.x = Math.PI / 2;

    arrow.position.copy(dir.clone().multiplyScalar(0.35));

    const hitGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.0, 8);
    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthTest: false });
    const hitZone = new THREE.Mesh(hitGeo, hitMat);
    hitZone.userData['axis'] = axis;
    hitZone.userData['isHitZone'] = true;
    if (axis === 'x') hitZone.rotation.z = -Math.PI / 2;
    if (axis === 'z') hitZone.rotation.x = Math.PI / 2;
    hitZone.position.copy(dir.clone().multiplyScalar(0.5));

    this.handles.push(hitZone);
    this.group.add(arrow, hitZone);
  }

  private addRotateArc(axis: string, dir: THREE.Vector3, color: number) {
    const segments = 48;
    const radius = 0.85;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    const curve = new THREE.CatmullRomCurve3(points, true);
    const tubeGeo = new THREE.TubeGeometry(curve, segments, 0.04, 6, true);
    const mat = new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true });
    const arc = new THREE.Mesh(tubeGeo, mat);
    arc.userData['axis'] = axis;

    if (axis === 'x') arc.rotation.z = Math.PI / 2;
    if (axis === 'z') arc.rotation.x = Math.PI / 2;

    this.handles.push(arc);
    this.group.add(arc);
  }

  private addScaleHandle(axis: string, dir: THREE.Vector3, color: number) {
    const mat = new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true });

    // Line shaft
    const shaftGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.7, 6);
    const shaft = new THREE.Mesh(shaftGeo, mat);

    // Cube end
    const boxGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const box = new THREE.Mesh(boxGeo, mat);
    box.position.y = 0.35 + 0.09;

    const g = new THREE.Group();
    g.userData['axis'] = axis;
    g.add(shaft, box);
    if (axis === 'x') g.rotation.z = -Math.PI / 2;
    if (axis === 'z') g.rotation.x = Math.PI / 2;
    g.position.copy(dir.clone().multiplyScalar(0.35));

    // Hit zone
    const hitGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.0, 6);
    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthTest: false });
    const hitZone = new THREE.Mesh(hitGeo, hitMat);
    hitZone.userData['axis'] = axis;
    hitZone.userData['isHitZone'] = true;
    if (axis === 'x') hitZone.rotation.z = -Math.PI / 2;
    if (axis === 'z') hitZone.rotation.x = Math.PI / 2;
    hitZone.position.copy(dir.clone().multiplyScalar(0.5));

    this.handles.push(hitZone);
    this.group.add(g, hitZone);
  }

  private applyTranslation(axis: string, mouseNdc: THREE.Vector2) {
    if (!this.target) return;
    this.raycaster.setFromCamera(mouseNdc, this.camera);

    const planeHit = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.dragPlane, planeHit) === null) return;

    const desired = planeHit.sub(this.dragOffset);
    const snap = (value: number) => this.snapTranslationValue(value);

    if (axis === 'x') this.target.position.x = snap(desired.x);
    else if (axis === 'y') this.target.position.y = snap(desired.y);
    else if (axis === 'z') this.target.position.z = snap(desired.z);
    else if (axis === 'xyz') {
      this.target.position.set(
        snap(desired.x),
        snap(desired.y),
        snap(desired.z),
      );
    }
  }

  private snapTranslationValue(rawValue: number): number {
    return Math.round(rawValue / this.TRANSLATE_SNAP_STEP) * this.TRANSLATE_SNAP_STEP;
  }

  private applyRotation(axis: string, mouseNdc: THREE.Vector2) {
    if (!this.target) return;

    const angle = this.getMouseAngleOnRotateCircle(axis, mouseNdc);
    if (angle == null) return;

    if (this.lastRotateAngle == null) {
      this.lastRotateAngle = angle;
      return;
    }

    let deltaAngle = angle - this.lastRotateAngle;
    if (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
    if (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;

    const axisSign = axis === 'y' ? -1 : 1;
    this.rotateAccumDelta += deltaAngle * axisSign;

    if (axis === 'x') {
      this.target.rotation.x = this.snapRotationAngle(this.startRotation.x + this.rotateAccumDelta);
    } else if (axis === 'y') {
      this.target.rotation.y = this.snapRotationAngle(this.startRotation.y + this.rotateAccumDelta);
    } else if (axis === 'z') {
      this.target.rotation.z = this.snapRotationAngle(this.startRotation.z + this.rotateAccumDelta);
    }

    this.lastRotateAngle = angle;
  }

  private snapRotationAngle(rawAngle: number): number {
    return Math.round(rawAngle / this.ROTATE_SNAP_STEP_RAD) * this.ROTATE_SNAP_STEP_RAD;
  }

  private getMouseAngleOnRotateCircle(axis: string, mouseNdc: THREE.Vector2): number | null {
    const center = this.group.position.clone();
    const centerNdc = center.clone().project(this.camera);

    const delta = new THREE.Vector2(mouseNdc.x - centerNdc.x, mouseNdc.y - centerNdc.y);
    if (delta.lengthSq() < 1e-10) return null;

    // Build 2D basis for the selected rotation circle from projected world axes.
    const basis = this.getRotationBasis(axis);
    if (!basis) return Math.atan2(delta.y, delta.x);

    const uNdc = center.clone().add(basis.u).project(this.camera);
    const vNdc = center.clone().add(basis.v).project(this.camera);
    const u2 = new THREE.Vector2(uNdc.x - centerNdc.x, uNdc.y - centerNdc.y);
    const v2 = new THREE.Vector2(vNdc.x - centerNdc.x, vNdc.y - centerNdc.y);

    const uLenSq = u2.lengthSq();
    const vLenSq = v2.lengthSq();
    if (uLenSq < 1e-10 || vLenSq < 1e-10) {
      return Math.atan2(delta.y, delta.x);
    }

    const x = delta.dot(u2) / uLenSq;
    const y = delta.dot(v2) / vLenSq;
    return Math.atan2(y, x);
  }

  private getRotationBasis(axis: string): { u: THREE.Vector3; v: THREE.Vector3 } | null {
    const applyGizmoOrientation = (basis: { u: THREE.Vector3; v: THREE.Vector3 }) => {
      if (this.mode === 'rotate') {
        return {
          u: basis.u.applyQuaternion(this.group.quaternion),
          v: basis.v.applyQuaternion(this.group.quaternion),
        };
      }

      return basis;
    };

    if (axis === 'x') {
      return applyGizmoOrientation({ u: new THREE.Vector3(0, 1, 0), v: new THREE.Vector3(0, 0, 1) });
    }
    if (axis === 'y') {
      return applyGizmoOrientation({ u: new THREE.Vector3(1, 0, 0), v: new THREE.Vector3(0, 0, 1) });
    }
    if (axis === 'z') {
      return applyGizmoOrientation({ u: new THREE.Vector3(1, 0, 0), v: new THREE.Vector3(0, 1, 0) });
    }
    return null;
  }

  private applyScale(axis: string, delta: THREE.Vector2) {
    if (!this.target) return;
    let signedDelta = delta.x - delta.y;
    if (axis === 'y' || axis === 'z') {
      signedDelta *= -1;
    }
    const amount = 1 + signedDelta * 2;
    if (axis === 'x') this.target.scale.x = Math.max(0.05, this.target.scale.x * amount);
    else if (axis === 'y') this.target.scale.y = Math.max(0.05, this.target.scale.y * amount);
    else if (axis === 'z') this.target.scale.z = Math.max(0.05, this.target.scale.z * amount);
    else if (axis === 'xyz') this.target.scale.multiplyScalar(Math.max(0.9, Math.min(1.1, amount)));
  }

  private setHandleHighlight(handle: THREE.Mesh, active: boolean) {
    const mat = handle.material as THREE.MeshBasicMaterial;
    if (active) {
      mat.color.set(0xffff00);
    } else {
      // Restore based on axis
      const colors: Record<string, number> = { x: 0xff3333, y: 0x33ff66, z: 0x3366ff, xyz: 0xffffff };
      mat.color.set(colors[handle.userData['axis']] ?? 0xffffff);
    }
  }

  private applyInteractionVisualState() {
    const draggedAxis = this.activeHandle?.userData['axis'] as string | undefined;
    const hoveredAxis = this.hoveredHandle?.userData['axis'] as string | undefined;

    for (const child of this.group.children) {
      const axis = child.userData['axis'] as string | undefined;
      const isHitZone = child.userData['isHitZone'] === true;

      if (this._isDragging && draggedAxis) {
        child.visible = axis === draggedAxis;
        if (!isHitZone) this.setObjectOpacity(child, 1);
        continue;
      }

      child.visible = true;

      if (isHitZone) {
        this.setObjectOpacity(child, 0);
        continue;
      }

      if (hoveredAxis && axis !== hoveredAxis) {
        this.setObjectOpacity(child, 0.3);
      } else {
        this.setObjectOpacity(child, 1);
      }
    }
  }

  private setObjectOpacity(object: THREE.Object3D, opacity: number) {
    object.traverse((node) => {
      const mesh = node as THREE.Mesh;
      const material = mesh.material;
      if (Array.isArray(material)) {
        for (const mat of material) {
          mat.transparent = true;
          mat.opacity = opacity;
        }
      } else if (material) {
        material.transparent = true;
        material.opacity = opacity;
      }
    });
  }
}
