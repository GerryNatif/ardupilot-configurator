import * as THREE from 'three';
import { ShapeParameterMap } from '../shape-generator/shape-generator.models';
import { asNumber } from '../shape-generator/shape-generator.utils';

export function createStickGeometry(params: ShapeParameterMap): THREE.BufferGeometry {
  const length = asNumber(params['length'], 4);
  const diameter = asNumber(params['diameter'], 0.4);
  const radius = Math.max(0.001, diameter / 2);

  const geometry = new THREE.CylinderGeometry(radius, radius, Math.max(0.001, length), 32);
  geometry.rotateZ(-Math.PI / 2);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
