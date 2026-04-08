import * as THREE from 'three';
import type { ViewPlane } from '../components/threejs-canva/threejs-canva';

/**
 * GridPlanes
 * Renders the 3 construction planes (front, top, right) with a grid pattern.
 * Planes are semi-transparent, clickable, and can be shown/hidden individually.
 */
export class GridPlanes {
  private planes: THREE.Mesh[] = [];
  private planeMap = new Map<ViewPlane, THREE.Mesh>();

  private readonly PLANE_SIZE = 12;

  constructor(private scene: THREE.Scene) {
    this.buildPlanes();
  }

  getPlanes(): THREE.Mesh[] {
    return this.planes;
  }

  setVisiblePlane(active: ViewPlane) {
    for (const [name, mesh] of this.planeMap) {
      mesh.visible = name === active;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (name === active) {
        mat.opacity = 0.16;
      } else {
        mat.opacity = 0.08;
      }
    }
  }

  private buildPlanes() {
    const defs: Array<{ name: ViewPlane; rotation: THREE.Euler; position: THREE.Vector3; color: number }> = [
      {
        name: 'front',
        rotation: new THREE.Euler(0, 0, 0),
        position: new THREE.Vector3(0, 0, 0),
        color: 0x1f6fff,
      },
      {
        name: 'top',
        rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
        position: new THREE.Vector3(0, 0, 0),
        color: 0x37c56d,
      },
      {
        name: 'right',
        rotation: new THREE.Euler(0, Math.PI / 2, 0),
        position: new THREE.Vector3(0, 0, 0),
        color: 0xd94a4a,
      },
    ];

    for (const def of defs) {
      // Background quad
      const geo = new THREE.PlaneGeometry(this.PLANE_SIZE, this.PLANE_SIZE);
      const mat = new THREE.MeshBasicMaterial({
        color: def.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: def.name === 'top' ? 0.06 : 0.12,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.copy(def.rotation);
      mesh.position.copy(def.position);
      mesh.userData['planeName'] = def.name;
      mesh.visible = true;

      this.scene.add(mesh);
      this.planes.push(mesh);
      this.planeMap.set(def.name, mesh);
    }
  }

  updateGridVisibility(_active: ViewPlane) {
    for (const [, mesh] of this.planeMap) {
      mesh.visible = true;
    }
  }
}
