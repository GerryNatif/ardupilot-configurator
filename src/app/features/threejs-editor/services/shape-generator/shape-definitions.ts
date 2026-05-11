import { ShapeDefinition } from './shape-generator.models';
import * as THREE from 'three';
import { createWingGeometry } from '../geometry/wing-geometry';
import { createHullGeometry } from '../geometry/hull-geometry';
import { createFuselageGeometry } from '../geometry/fuselage-geometry';
import { createStickGeometry } from '../geometry/stick-geometry';
import { createRotorDiskGeometry } from '../geometry/rotor-disk-geometry';

export const SHAPE_DEFINITIONS: ReadonlyArray<ShapeDefinition> = [
  {
    type: 'wing',
    label: 'Aile',
    controls: [
      { key: 'span', label: 'Envergure', control: 'range', group: 'Dimensions', min: 2, max: 20, step: 0.1 },
      { key: 'rootChord', label: 'Corde racine', control: 'range', group: 'Dimensions', min: 0.5, max: 6, step: 0.1 },
      { key: 'tipChord', label: 'Corde extremite', control: 'range', group: 'Dimensions', min: 0.2, max: 4, step: 0.1 },
      { key: 'sweepDeg', label: 'Fleche', control: 'range', group: 'Geometrie', min: -30, max: 60, step: 1, unit: 'deg' },
      { key: 'dihedralDeg', label: 'Diedre', control: 'range', group: 'Geometrie', min: -20, max: 30, step: 1, unit: 'deg' },
      { key: 'twistDeg', label: 'Vrillage', control: 'range', group: 'Geometrie', min: -15, max: 15, step: 0.5, unit: 'deg' },
      { key: 'thicknessPct', label: 'Epaisseur', control: 'range', group: 'Profil', min: 5, max: 20, step: 0.5, unit: '%' },
      { key: 'camberPct', label: 'Cambrure', control: 'range', group: 'Profil', min: 0, max: 8, step: 0.2, unit: '%' },
      { key: 'wingletEnabled', label: 'Activer winglets', control: 'checkbox', group: 'Winglets' },
      { key: 'wingletHeight', label: 'Hauteur winglet', control: 'range', group: 'Winglets', min: 0.2, max: 4, step: 0.1 },
      { key: 'wingletSweepDeg', label: 'Fleche winglet', control: 'range', group: 'Winglets', min: 0, max: 60, step: 1, unit: 'deg' },
      { key: 'wingletTaper', label: 'Effilement winglet', control: 'range', group: 'Winglets', min: 0.2, max: 1, step: 0.05 },
    ],
    defaults: {
      span: 9.60,
      rootChord: 4.60,
      tipChord: 1.30,
      sweepDeg: 11,
      dihedralDeg: 0,
      twistDeg: -3.00,
      thicknessPct: 11,
      camberPct: 2.60,
      wingletEnabled: true,
      wingletHeight: 0.90,
      wingletSweepDeg: 20,
      wingletTaper: 0.50,
    },
    createGeometry: (params) => createWingGeometry(params),
  },
  {
    type: 'hull',
    label: 'Coque',
    controls: [
      { key: 'length', label: 'Longueur', control: 'range', group: 'Dimensions', min: 3, max: 40, step: 0.5 },
      { key: 'beam', label: 'Maitre-bau', control: 'range', group: 'Dimensions', min: 0.5, max: 12, step: 0.1 },
      { key: 'draft', label: 'Tirant eau', control: 'range', group: 'Dimensions', min: 0.1, max: 6, step: 0.05 },
      { key: 'freeboard', label: 'Franc-bord', control: 'range', group: 'Dimensions', min: 0.1, max: 4, step: 0.05 },
      { key: 'cb', label: 'Coeff bloc', control: 'range', group: 'Forme', min: 0.25, max: 0.85, step: 0.01 },
      { key: 'cm', label: 'Coeff maitre', control: 'range', group: 'Forme', min: 0.35, max: 0.99, step: 0.01 },
      { key: 'roundness', label: 'Rondeur', control: 'range', group: 'Forme', min: 0, max: 1, step: 0.01 },
      { key: 'bow', label: 'Etrave', control: 'range', group: 'Extremites', min: 0, max: 1, step: 0.01 },
      { key: 'stern', label: 'Tableau', control: 'range', group: 'Extremites', min: 0, max: 1, step: 0.01 },
      { key: 'midzone', label: 'Zone maitre', control: 'range', group: 'Extremites', min: 0.1, max: 0.8, step: 0.01 },
      { key: 'flare', label: 'Flare', control: 'range', group: 'Pont', min: -0.3, max: 0.8, step: 0.01 },
      { key: 'deckCamber', label: 'Cambrure pont', control: 'range', group: 'Pont', min: 0, max: 0.5, step: 0.01 },
      { key: 'sheer', label: 'Tonture', control: 'range', group: 'Pont', min: 0, max: 1, step: 0.01 },
      { key: 'segments', label: 'Sections', control: 'range', group: 'Resolution', min: 6, max: 60, step: 2 },
      { key: 'points', label: 'Points section', control: 'range', group: 'Resolution', min: 6, max: 40, step: 2 },
    ],
    defaults: {
      length: 10,
      beam: 2.5,
      draft: 1.2,
      freeboard: 0.8,
      cb: 0.45,
      cm: 0.67,
      roundness: 0.43,
      bow: 0.65,
      stern: 0.49,
      midzone: 0.38,
      flare: -0.18,
      deckCamber: 0.13,
      sheer: 0,
      segments: 24,
      points: 20,
    },
    createGeometry: (params) => createHullGeometry(params),
  },
  {
    type: 'fuselage',
    label: 'Fuselage',
    controls: [
      { key: 'length', label: 'Longueur', control: 'range', group: 'Dimensions', min: 2, max: 15, step: 0.5 },
      { key: 'radius', label: 'Rayon max', control: 'range', group: 'Dimensions', min: 0.5, max: 3, step: 0.1 },
      { key: 'taperFront', label: 'Effilement avant', control: 'range', group: 'Profil', min: 0.1, max: 10, step: 0.1 },
      { key: 'taperBack', label: 'Effilement arriere', control: 'range', group: 'Profil', min: 0.1, max: 10, step: 0.1 },
      { key: 'profileSegments', label: 'Segments profil', control: 'range', group: 'Resolution', min: 20, max: 100, step: 5 },
      { key: 'radialSegments', label: 'Segments radiaux', control: 'range', group: 'Resolution', min: 12, max: 64, step: 2 },
    ],
    defaults: {
      length: 12.00,
      radius: 1.50,
      taperFront: 2.50,
      taperBack: 7.00,
      profileSegments: 50,
      radialSegments: 32,
    },
    createGeometry: (params) => createFuselageGeometry(params),
  },
  {
    type: 'stick',
    label: 'Stick',
    controls: [
      { key: 'length', label: 'Longueur', control: 'range', group: 'Dimensions', min: 0.1, max: 30, step: 0.1 },
      { key: 'diameter', label: 'Diametre', control: 'range', group: 'Dimensions', min: 0.01, max: 5, step: 0.01 },
    ],
    defaults: {
      length: 4,
      diameter: 0.4,
    },
    createGeometry: (params) => createStickGeometry(params),
  },
  {
    type: 'rotorDisk',
    label: 'Disque rotor',
    controls: [
      { key: 'clockwise', label: 'Horaire', control: 'checkbox', group: 'Sens' },
      { key: 'counterClockwise', label: 'Anti horaire', control: 'checkbox', group: 'Sens' },
      { key: 'colorType', label: 'Type couleur', control: 'range', group: 'Style', min: 0, max: 2, step: 1 },
    ],
    defaults: {
      clockwise: true,
      counterClockwise: false,
      colorType: 0,
    },
    createGeometry: (params) => createRotorDiskGeometry(params),
    createMaterials: (params) => {
      const colorType = Math.max(0, Math.min(2, Math.round(Number(params['colorType'] ?? 0))));
      const accent = [0x15a9d5, 0x37c837, 0x66558a][colorType];

      return [
        new THREE.MeshPhongMaterial({ color: accent, side: THREE.DoubleSide, shininess: 35 }),
        new THREE.MeshPhongMaterial({ color: accent, side: THREE.DoubleSide, shininess: 35 }),
        new THREE.MeshPhongMaterial({
          color: 0xbdbdbd,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
          depthWrite: false,
          shininess: 8,
        }),
      ];
    },
  },
];
