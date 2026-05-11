import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ShapeParameterMap } from '../shape-generator/shape-generator.models';

const ARROW_PATH_D =
	'M -90,-6 A 91,91 0 0 1 89,-23 l -15,2 27,25 a 101,101 0 0 0 -201,-18 z';

const BASE_CENTER_RADIUS = 0.5;
const BASE_SECONDARY_INNER_RADIUS = 0.5;
const BASE_SECONDARY_OUTER_RADIUS = 1.5;
const BASE_SVG_SCALE = 0.02;

// Single knob for global rotor size in the XZ plane.
const GLOBAL_DIAMETER = BASE_SECONDARY_OUTER_RADIUS * 2;
const GLOBAL_SCALE = GLOBAL_DIAMETER / (BASE_SECONDARY_OUTER_RADIUS * 2);

const THICKNESS = 0.02;
const CENTER_RADIUS = BASE_CENTER_RADIUS * GLOBAL_SCALE;
const SECONDARY_INNER_RADIUS = BASE_SECONDARY_INNER_RADIUS * GLOBAL_SCALE;
const SECONDARY_OUTER_RADIUS = BASE_SECONDARY_OUTER_RADIUS * GLOBAL_SCALE;
const SVG_SCALE = BASE_SVG_SCALE * GLOBAL_SCALE;

export interface RotorDiskDiagnostics {
	hasPositionAttribute: boolean;
	vertexCount: number;
	groupCount: number;
	groups: Array<{ start: number; count: number; materialIndex: number }>;
	boundingRadius: number;
}

function toMergeSafeGeometry(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
	const safe = geometry.index ? geometry.toNonIndexed() : geometry.clone();
	safe.deleteAttribute('tangent');
	return safe;
}

function createThickRingGeometry(
	innerRadius: number,
	outerRadius: number,
	depth: number,
	segments = 96,
): THREE.BufferGeometry {
	const shape = new THREE.Shape();
	shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

	const hole = new THREE.Path();
	hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
	shape.holes.push(hole);

	const ring = new THREE.ExtrudeGeometry(shape, {
		depth,
		bevelEnabled: false,
		curveSegments: segments,
	});

	// Extrude on Z then rotate to Y and center vertically around y=0.
	ring.rotateX(-Math.PI / 2);
	ring.translate(0, -depth * 0.5, 0);
	ring.computeVertexNormals();
	return ring;
}

function buildSvgArrowGeometry(direction: 1 | -1): THREE.BufferGeometry {
	const loader = new SVGLoader();
	const doc = loader.parse(
		`<svg xmlns="http://www.w3.org/2000/svg"><path fill="#000" d="${ARROW_PATH_D}"/></svg>`,
	);

	const path = doc.paths[0];
	const shapes = path ? path.toShapes(true) : [];
	if (shapes.length === 0) {
		return new THREE.BufferGeometry();
	}

	const geos: THREE.BufferGeometry[] = [];
	for (const shape of shapes) {
		const original = new THREE.ExtrudeGeometry(shape, {
			depth: THICKNESS,
			bevelEnabled: true,
			bevelThickness: 0.02,
			bevelSize: 0.015,
			bevelSegments: 4,
			curveSegments: 96,
		});

		original.scale(SVG_SCALE, SVG_SCALE, 1);
		const clone = original.clone();
		clone.rotateZ(Math.PI);
		geos.push(original, clone);
	}

	const merged =
		mergeGeometries(geos.map((geo) => toMergeSafeGeometry(geo)), false) ??
		new THREE.BufferGeometry();
	merged.computeBoundingBox();
	const center = new THREE.Vector3();
	merged.boundingBox?.getCenter(center);
	merged.translate(-center.x, -center.y, -center.z);

	// Extrude on Z then rotate to Y and center vertically around y=0.
	merged.rotateX(-Math.PI / 2);
	merged.translate(0, -THICKNESS * 0.5, 0);

	if (direction === -1) {
		merged.scale(-1, 1, 1);
	}

	merged.computeVertexNormals();
	return merged;
}

export function createRotorDiskGeometry(params: ShapeParameterMap): THREE.BufferGeometry {
	const clockwise = Boolean(params['clockwise']);
	const counterClockwise = Boolean(params['counterClockwise']);
	const showClockwise = clockwise || (!clockwise && !counterClockwise);
	const showCounterClockwise = counterClockwise;

	const arrows: THREE.BufferGeometry[] = [];
	if (showClockwise) {
		const cw = buildSvgArrowGeometry(1);
		if (cw.getAttribute('position')?.count) arrows.push(cw);
	}
	if (showCounterClockwise) {
		const ccw = buildSvgArrowGeometry(-1);
		if (ccw.getAttribute('position')?.count) arrows.push(ccw);
	}

	const arrowsGeometry =
		arrows.length > 0
			? (mergeGeometries(arrows.map((geo) => toMergeSafeGeometry(geo)), false) ??
				new THREE.BufferGeometry())
			: new THREE.BufferGeometry();

	const centerDisk = new THREE.CylinderGeometry(CENTER_RADIUS, CENTER_RADIUS, THICKNESS, 64);

	const secondaryRing = createThickRingGeometry(
		SECONDARY_INNER_RADIUS,
		SECONDARY_OUTER_RADIUS,
		THICKNESS,
		96,
	);

	const parts: THREE.BufferGeometry[] = [centerDisk, secondaryRing];
	if (arrowsGeometry.getAttribute('position')?.count) {
		parts.unshift(arrowsGeometry);
	}

	const merged = mergeGeometries(parts.map((geo) => toMergeSafeGeometry(geo)), true);
	if (!merged) {
		return new THREE.CylinderGeometry(0.8, 0.8, THICKNESS, 48);
	}

	merged.computeVertexNormals();
	merged.computeBoundingSphere();
	return merged;
}

export function getRotorDiskDiagnostics(params: ShapeParameterMap): RotorDiskDiagnostics {
	const geometry = createRotorDiskGeometry(params);
	const position = geometry.getAttribute('position');

	if (!geometry.boundingSphere) {
		geometry.computeBoundingSphere();
	}

	return {
		hasPositionAttribute: !!position,
		vertexCount: position?.count ?? 0,
		groupCount: geometry.groups.length,
		groups: geometry.groups.map((group) => ({
			start: group.start,
			count: group.count,
			materialIndex: group.materialIndex ?? 0,
		})),
		boundingRadius: geometry.boundingSphere?.radius ?? 0,
	};
}
