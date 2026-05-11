import * as THREE from 'three';
import { ShapeParameterMap } from '../shape-generator/shape-generator.models';
import { asNumber } from '../shape-generator/shape-generator.utils';

export function createFuselageGeometry(params: ShapeParameterMap): THREE.BufferGeometry {
  const length = asNumber(params['length'], 12);
  const radius = asNumber(params['radius'], 1.5);
  const taperFront = asNumber(params['taperFront'], 2);
  const taperBack = asNumber(params['taperBack'], 2.5);
  const profileSegments = Math.max(12, Math.floor(asNumber(params['profileSegments'], 50)));
  const radialSegments = Math.max(8, Math.floor(asNumber(params['radialSegments'], 32)));

  const points: THREE.Vector2[] = [];
  const halfLength = length / 2;

  for (let i = 0; i <= profileSegments; i++) {
    const t = i / profileSegments;
    const x = t * length - halfLength;

    let profileRadius: number;
    if (x < -halfLength + taperBack) {
      const localT = Math.max(0, Math.min(1, (x + halfLength) / Math.max(0.001, taperBack)));
      profileRadius = radius * Math.pow(localT, 0.5);
    } else if (x > halfLength - taperFront) {
      const localT = Math.max(0, Math.min(1, (halfLength - x) / Math.max(0.001, taperFront)));
      profileRadius = radius * Math.pow(localT, 0.5);
    } else {
      profileRadius = radius;
    }

    points.push(new THREE.Vector2(profileRadius, x));
  }

  const geometry = new THREE.LatheGeometry(points, radialSegments);
  geometry.rotateX(Math.PI / 2);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
