import * as THREE from 'three';
import { ShapeParameterMap } from '../shape-generator/shape-generator.models';
import { asNumber, lerpNumber } from '../shape-generator/shape-generator.utils';

export function createHullGeometry(params: ShapeParameterMap): THREE.BufferGeometry {
  const length = asNumber(params['length'], 10);
  const beam = asNumber(params['beam'], 2.5);
  const draft = asNumber(params['draft'], 1.2);
  const freeboard = asNumber(params['freeboard'], 0.8);
  const cb = asNumber(params['cb'], 0.45);
  const cm = asNumber(params['cm'], 0.72);
  const roundness = asNumber(params['roundness'], 0.5);
  const bow = asNumber(params['bow'], 0.3);
  const stern = asNumber(params['stern'], 0.6);
  const midzone = asNumber(params['midzone'], 0.4);
  const flare = asNumber(params['flare'], 0.2);
  const deckCamber = asNumber(params['deckCamber'], 0.08);
  const sheer = asNumber(params['sheer'], 0.3);
  const segments = Math.max(6, Math.floor(asNumber(params['segments'], 24)));
  const points = Math.max(6, Math.floor(asNumber(params['points'], 20)));
  const deckDivisions = Math.max(8, Math.floor(points / 2));

  const sections: Array<Array<{ x: number; y: number; z: number }>> = [];
  for (let si = 0; si <= segments; si++) {
    const t = si / segments;
    const section = generateHullSection(t, {
      beam,
      draft,
      freeboard,
      cb,
      cm,
      roundness,
      bow,
      stern,
      midzone,
      flare,
      points,
    });
    sections.push(section.map((pt) => ({
      x: -length / 2 + t * length,
      y: pt.y,
      z: pt.x,
    })));
  }

  const positions: number[] = [];
  const indices: number[] = [];

  const hullVertexIndex = (side: 0 | 1, si: number, pi: number) => {
    return side * (segments + 1) * (points + 1) + si * (points + 1) + pi;
  };

  for (let side = 0 as 0 | 1; side <= 1; side = (side + 1) as 0 | 1) {
    const sign = side === 0 ? 1 : -1;
    for (let si = 0; si <= segments; si++) {
      for (let pi = 0; pi <= points; pi++) {
        const pt = sections[si][pi];
        positions.push(pt.x, pt.y, pt.z * sign);
      }
    }
  }

  for (let side = 0 as 0 | 1; side <= 1; side = (side + 1) as 0 | 1) {
    for (let si = 0; si < segments; si++) {
      for (let pi = 0; pi < points; pi++) {
        const a = hullVertexIndex(side, si, pi);
        const b = hullVertexIndex(side, si + 1, pi);
        const c = hullVertexIndex(side, si + 1, pi + 1);
        const d = hullVertexIndex(side, si, pi + 1);
        if (side === 0) {
          indices.push(a, b, c, a, c, d);
        } else {
          indices.push(a, c, b, a, d, c);
        }
      }
    }
  }

  for (let si = 0; si < segments; si++) {
    const aStarboard = hullVertexIndex(0, si, 0);
    const bStarboard = hullVertexIndex(0, si + 1, 0);
    const aPort = hullVertexIndex(1, si, 0);
    const bPort = hullVertexIndex(1, si + 1, 0);
    indices.push(aStarboard, bPort, bStarboard);
    indices.push(aStarboard, aPort, bPort);
  }

  const deckRows: Array<Array<{ x: number; y: number; z: number }>> = [];
  for (let si = 0; si <= segments; si++) {
    const edge = sections[si][points];
    const x = edge.x;
    const yEdge = edge.y + hullSheerOffset(si, segments, sheer, freeboard);
    const zHalf = edge.z;
    const row: Array<{ x: number; y: number; z: number }> = [];
    for (let di = 0; di <= deckDivisions; di++) {
      const u = di / deckDivisions;
      const z = lerpNumber(-zHalf, zHalf, u);
      const camberOffset = deckCamber * zHalf * 2 * 4 * u * (1 - u);
      row.push({ x, y: yEdge + camberOffset, z });
    }
    deckRows.push(row);
  }

  const deckOffset = positions.length / 3;
  for (const row of deckRows) {
    for (const point of row) {
      positions.push(point.x, point.y, point.z);
    }
  }

  for (let si = 0; si < segments; si++) {
    for (let di = 0; di < deckDivisions; di++) {
      const a = deckOffset + si * (deckDivisions + 1) + di;
      const b = deckOffset + (si + 1) * (deckDivisions + 1) + di;
      const c = deckOffset + (si + 1) * (deckDivisions + 1) + di + 1;
      const d = deckOffset + si * (deckDivisions + 1) + di + 1;
      indices.push(a, c, b, a, d, c);
    }
  }

  appendHullEndCap({
    positions,
    indices,
    section: sections[segments],
    deckRow: deckRows[segments],
    sectionPoints: points,
    deckDivisions,
    frontFacing: true,
  });
  appendHullEndCap({
    positions,
    indices,
    section: sections[0],
    deckRow: deckRows[0],
    sectionPoints: points,
    deckDivisions,
    frontFacing: false,
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.rotateY(Math.PI / 2);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function generateHullSection(
  t: number,
  params: {
    beam: number;
    draft: number;
    freeboard: number;
    cb: number;
    cm: number;
    roundness: number;
    bow: number;
    stern: number;
    midzone: number;
    flare: number;
    points: number;
  },
): Array<{ x: number; y: number }> {
  const halfMidStart = 0.5 - params.midzone * 0.5;
  const halfMidEnd = 0.5 + params.midzone * 0.5;

  let beamFactor: number;
  if (t < halfMidStart) {
    const u = halfMidStart <= 0 ? 1 : t / halfMidStart;
    beamFactor = Math.pow(u, 1 + (1 - params.bow) * 2);
    beamFactor *= lerpNumber(0.7, 1.0, params.cb);
  } else if (t <= halfMidEnd) {
    beamFactor = 1.0;
  } else {
    const denom = Math.max(0.0001, 1 - halfMidEnd);
    const u = (t - halfMidEnd) / denom;
    beamFactor = lerpNumber(1.0, params.stern, u);
    beamFactor *= lerpNumber(0.7, 1.0, params.cb);
  }

  const halfB = (params.beam / 2) * beamFactor;
  const totalH = params.draft + params.freeboard;
  const waterS = params.draft / Math.max(0.0001, totalH);
  const section: Array<{ x: number; y: number }> = [];

  for (let i = 0; i <= params.points; i++) {
    const s = i / params.points;
    const y = -params.draft + s * totalH;
    let x: number;

    if (s <= waterS) {
      const depthT = waterS <= 0 ? 0 : s / waterS;
      const roundProfile = lerpNumber(depthT, Math.sqrt(depthT), params.roundness);
      const cmFactor = lerpNumber(0.5, 0.98, params.cm);
      x = halfB * roundProfile * cmFactor;
    } else {
      const aboveT = (s - waterS) / Math.max(0.0001, 1 - waterS);
      x = halfB * (1 + params.flare * aboveT);
    }

    section.push({ x, y });
  }

  return section;
}

function hullSheerOffset(si: number, segments: number, sheer: number, freeboard: number): number {
  const t = si / Math.max(1, segments);
  return -sheer * freeboard * 0.5 * 4 * t * (1 - t);
}

function appendHullEndCap(input: {
  positions: number[];
  indices: number[];
  section: Array<{ x: number; y: number; z: number }>;
  deckRow: Array<{ x: number; y: number; z: number }>;
  sectionPoints: number;
  deckDivisions: number;
  frontFacing: boolean;
}): void {
  const contour: THREE.Vector3[] = [];

  for (let pi = 0; pi <= input.sectionPoints; pi++) {
    const pt = input.section[pi];
    contour.push(new THREE.Vector3(pt.x, pt.y, pt.z));
  }
  for (let di = input.deckDivisions - 1; di >= 0; di--) {
    const pt = input.deckRow[di];
    contour.push(new THREE.Vector3(pt.x, pt.y, pt.z));
  }
  for (let pi = input.sectionPoints - 1; pi >= 0; pi--) {
    const pt = input.section[pi];
    contour.push(new THREE.Vector3(pt.x, pt.y, -pt.z));
  }

  let cx = 0;
  let cy = 0;
  let cz = 0;
  for (const vertex of contour) {
    cx += vertex.x;
    cy += vertex.y;
    cz += vertex.z;
  }
  cx /= contour.length;
  cy /= contour.length;
  cz /= contour.length;

  const startIndex = input.positions.length / 3;
  for (const vertex of contour) {
    input.positions.push(vertex.x, vertex.y, vertex.z);
  }
  const centerIndex = input.positions.length / 3;
  input.positions.push(cx, cy, cz);

  for (let i = 0; i < contour.length; i++) {
    const a = startIndex + i;
    const b = startIndex + ((i + 1) % contour.length);
    if (input.frontFacing) {
      input.indices.push(centerIndex, b, a);
    } else {
      input.indices.push(centerIndex, a, b);
    }
  }
}
