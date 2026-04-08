import * as THREE from 'three';
import { ShapeParameterMap } from '../shape-generator/shape-generator.models';
import { asNumber } from '../shape-generator/shape-generator.utils';

export function createWingGeometry(params: ShapeParameterMap): THREE.BufferGeometry {
  const span = asNumber(params['span'], 10);
  const rootChord = asNumber(params['rootChord'], 3);
  const tipChord = asNumber(params['tipChord'], 1);
  const sweepDeg = asNumber(params['sweepDeg'], 20);
  const dihedralDeg = asNumber(params['dihedralDeg'], 5);
  const twistDeg = asNumber(params['twistDeg'], -3);
  const thicknessPct = asNumber(params['thicknessPct'], 12);
  const camberPct = asNumber(params['camberPct'], 2);
  const wingletEnabled = Boolean(params['wingletEnabled']);
  const wingletHeight = asNumber(params['wingletHeight'], 1.5);
  const wingletSweepDeg = asNumber(params['wingletSweepDeg'], 30);
  const wingletTaper = asNumber(params['wingletTaper'], 0.5);

  const segments = 40;
  const profilePoints = 50;
  const vertices: number[] = [];
  const indices: number[] = [];
  let vertexIndex = 0;
  const allSections: number[][] = [];

  const addProfileSection = (
    spanPos: number,
    yPos: number,
    zPos: number,
    chord: number,
    twistAngle: number,
  ): number[] => {
    const profile = createAirfoilProfile(chord, thicknessPct, camberPct, profilePoints);
    const section: number[] = [];

    for (const point of profile) {
      const x = spanPos;
      const y = point.y * Math.cos(twistAngle) - point.x * Math.sin(twistAngle) + yPos;
      const z = point.y * Math.sin(twistAngle) + point.x * Math.cos(twistAngle) + zPos;
      vertices.push(x, y, z);
      section.push(vertexIndex++);
    }

    return section;
  };

  const connectSections = (a: number[], b: number[]) => {
    const n = a.length;
    for (let i = 0; i < n; i++) {
      const i2 = (i + 1) % n;
      indices.push(a[i], b[i], a[i2]);
      indices.push(a[i2], b[i], b[i2]);
    }
  };

  const closeSection = (sectionVertices: number[], frontFacing: boolean) => {
    const numPoints = sectionVertices.length;

    let cx = 0;
    let cy = 0;
    let cz = 0;
    for (const id of sectionVertices) {
      const idx = id * 3;
      const vx = vertices[idx];
      const vy = vertices[idx + 1];
      const vz = vertices[idx + 2];
      cx += vx;
      cy += vy;
      cz += vz;
    }
    cx /= numPoints;
    cy /= numPoints;
    cz /= numPoints;

    const centerIndex = vertexIndex++;
    vertices.push(cx, cy, cz);
    for (let i = 0; i < numPoints; i++) {
      const v1 = sectionVertices[i];
      const v2 = sectionVertices[(i + 1) % numPoints];
      if (frontFacing) {
        indices.push(centerIndex, v1, v2);
      } else {
        indices.push(centerIndex, v2, v1);
      }
    }
  };

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const spanPos = t * span;
    const sweepOffset = Math.tan(THREE.MathUtils.degToRad(sweepDeg)) * spanPos;
    const dihedralOffset = Math.tan(THREE.MathUtils.degToRad(dihedralDeg)) * spanPos;
    const chord = rootChord + (tipChord - rootChord) * t;
    const twist = THREE.MathUtils.degToRad(twistDeg * t);

    allSections.push(addProfileSection(spanPos, dihedralOffset, sweepOffset, chord, twist));
  }

  for (let i = 0; i < segments; i++) {
    connectSections(allSections[i], allSections[i + 1]);
  }

  closeSection(allSections[0], false);

  if (wingletEnabled) {
    const wingletSegments = 20;
    const wingletSections: number[][] = [];
    const endSpan = span;
    const endZ = Math.tan(THREE.MathUtils.degToRad(sweepDeg)) * endSpan;
    const endY = Math.tan(THREE.MathUtils.degToRad(dihedralDeg)) * endSpan;
    const endTwist = THREE.MathUtils.degToRad(twistDeg);

    for (let i = 0; i <= wingletSegments; i++) {
      const t = i / wingletSegments;
      const y = endY + t * wingletHeight;
      const z = endZ + Math.tan(THREE.MathUtils.degToRad(wingletSweepDeg)) * t * wingletHeight;
      const chord = Math.max(0.18, tipChord * (1 - t * (1 - wingletTaper)));
      const twist = endTwist + t * THREE.MathUtils.degToRad(5);
      wingletSections.push(addProfileSection(endSpan, y, z, chord, twist));
    }

    connectSections(allSections[allSections.length - 1], wingletSections[0]);
    for (let i = 0; i < wingletSegments; i++) {
      connectSections(wingletSections[i], wingletSections[i + 1]);
    }
    closeSection(wingletSections[wingletSections.length - 1], true);
  } else {
    closeSection(allSections[allSections.length - 1], true);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.rotateY(Math.PI);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createAirfoilProfile(
  chord: number,
  thicknessPct: number,
  camberPct: number,
  numPoints: number,
): THREE.Vector2[] {
  const points: THREE.Vector2[] = [];
  const t = thicknessPct / 100;
  const m = camberPct / 100;
  const p = 0.4;

  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * chord;
    const xNorm = Math.max(0, Math.min(1, x / chord));
    const yt = 5 * t * chord * (
      0.2969 * Math.sqrt(xNorm) -
      0.1260 * xNorm -
      0.3516 * xNorm * xNorm +
      0.2843 * xNorm * xNorm * xNorm -
      0.1015 * xNorm * xNorm * xNorm * xNorm
    );

    let yc = 0;
    if (xNorm < p) {
      yc = (m / (p * p)) * (2 * p * xNorm - xNorm * xNorm);
    } else {
      yc = (m / ((1 - p) * (1 - p))) * ((1 - 2 * p) + 2 * p * xNorm - xNorm * xNorm);
    }
    yc *= chord;

    points.push(new THREE.Vector2(x - chord / 2, yc + yt));
  }

  for (let i = numPoints; i >= 0; i--) {
    const x = (i / numPoints) * chord;
    const xNorm = Math.max(0, Math.min(1, x / chord));
    const yt = 5 * t * chord * (
      0.2969 * Math.sqrt(xNorm) -
      0.1260 * xNorm -
      0.3516 * xNorm * xNorm +
      0.2843 * xNorm * xNorm * xNorm -
      0.1015 * xNorm * xNorm * xNorm * xNorm
    );

    let yc = 0;
    if (xNorm < p) {
      yc = (m / (p * p)) * (2 * p * xNorm - xNorm * xNorm);
    } else {
      yc = (m / ((1 - p) * (1 - p))) * ((1 - 2 * p) + 2 * p * xNorm - xNorm * xNorm);
    }
    yc *= chord;

    points.push(new THREE.Vector2(x - chord / 2, yc - yt));
  }

  return points;
}
