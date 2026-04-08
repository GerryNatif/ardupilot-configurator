import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { TransformGizmo } from './transform-gizmo';

describe('TransformGizmo mode switching', () => {
  it('clears previous mode visuals when switching modes', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const gizmo = new TransformGizmo(scene, camera, {} as THREE.WebGLRenderer);
    const group = (gizmo as unknown as { group: THREE.Group }).group;

    // Initial mode is translate: 3 arrow groups + 3 hit zones + 1 center mesh.
    expect(group.children.length).toBe(7);

    gizmo.setMode('rotate');

    // Rotate mode should not keep translate arrow groups.
    expect(group.children.length).toBe(4);
    expect(group.children.every((child) => !(child instanceof THREE.Group))).toBe(true);

    gizmo.setMode('scale');

    // Scale mode should be rebuilt from scratch.
    expect(group.children.length).toBe(7);

    const handles = (gizmo as unknown as { handles: THREE.Mesh[] }).handles;
    expect(handles.length).toBe(4);
  });
});
