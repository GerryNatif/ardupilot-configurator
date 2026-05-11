import * as THREE from 'three';

export type ShapeParameterValue = number | boolean;
export type ShapeParameterMap = Record<string, ShapeParameterValue>;

export interface ShapeControlDefinition {
  key: string;
  label: string;
  control: 'range' | 'checkbox';
  group: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export type ShapeType = 'wing' | 'hull' | 'fuselage' | 'stick' | 'rotorDisk';

export interface ShapeDefinition {
  type: ShapeType;
  label: string;
  controls: ReadonlyArray<ShapeControlDefinition>;
  defaults: ShapeParameterMap;
  createGeometry: (params: ShapeParameterMap) => THREE.BufferGeometry;
  createMaterials?: (
    params: ShapeParameterMap,
    baseColor: number,
  ) => THREE.Material | THREE.Material[];
}

export interface ShapeSnapshot {
  type: ShapeType;
  name: string;
  params: ShapeParameterMap;
  controls: ReadonlyArray<ShapeControlDefinition>;
}

export interface ShapeConfig {
  type: ShapeType;
  color?: number;
  params?: Partial<ShapeParameterMap>;
}
