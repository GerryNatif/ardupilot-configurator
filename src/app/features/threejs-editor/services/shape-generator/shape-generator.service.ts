import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { SHAPE_DEFINITIONS } from './shape-definitions';
import {
  ShapeConfig,
  ShapeDefinition,
  ShapeParameterMap,
  ShapeParameterValue,
  ShapeSnapshot,
  ShapeType,
} from './shape-generator.models';
import { asNumber } from './shape-generator.utils';

export type {
  ShapeConfig,
  ShapeControlDefinition,
  ShapeDefinition,
  ShapeParameterMap,
  ShapeParameterValue,
  ShapeSnapshot,
  ShapeType,
} from './shape-generator.models';

const SHAPE_COLOR = 0x60507f;

@Injectable({ providedIn: 'root' })
export class ShapeGeneratorService {
  private counter: Record<string, number> = {};
  private defsByType = new Map<ShapeType, ShapeDefinition>(
    SHAPE_DEFINITIONS.map((shape) => [shape.type, shape]),
  );

  getShapeDefinitions(): ReadonlyArray<ShapeDefinition> {
    return SHAPE_DEFINITIONS;
  }

  getShapeDefinition(type: ShapeType): ShapeDefinition {
    return this.defsByType.get(type) ?? SHAPE_DEFINITIONS[0];
  }

  create(config: ShapeConfig): THREE.Mesh {
    const definition = this.getShapeDefinition(config.type);
    const params = this.normalizeParams(definition, config.params);
    const color = config.color ?? SHAPE_COLOR;
    const geometry = definition.createGeometry(params);

    const material = new THREE.MeshPhongMaterial({
      color,
      side: THREE.DoubleSide,
      shininess: 30,
      flatShading: false,
      opacity: 1,
      transparent: false,
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Name
    this.counter[definition.type] = (this.counter[definition.type] ?? 0) + 1;
    const nameMap: Record<string, string> = {
      box: 'Cube',
      sphere: 'Sphere',
      cylinder: 'Cylindre',
      torus: 'Tore',
      cone: 'Cone',
      wing: 'Aile',
      hull: 'Coque',
      fuselage: 'Fuselage',
      stick: 'Stick',
    };
    mesh.name = `${nameMap[definition.type] ?? definition.type} ${this.counter[definition.type]}`;
    mesh.userData['name'] = mesh.name;
    mesh.userData['shapeType'] = definition.type;
    mesh.userData['shapeParams'] = params;

    return mesh;
  }

  applyParams(mesh: THREE.Mesh, patch: Partial<ShapeParameterMap>): ShapeParameterMap {
    const type = (mesh.userData['shapeType'] as ShapeType | undefined) ?? 'wing';
    const definition = this.getShapeDefinition(type);
    const current = this.getParamsForMesh(mesh);
    const merged = this.normalizeParams(definition, { ...current, ...patch });

    const nextGeometry = definition.createGeometry(merged);
    mesh.geometry.dispose();
    mesh.geometry = nextGeometry;
    mesh.userData['shapeParams'] = merged;

    return merged;
  }

  getParamsForMesh(mesh: THREE.Mesh): ShapeParameterMap {
    const type = (mesh.userData['shapeType'] as ShapeType | undefined) ?? 'wing';
    const definition = this.getShapeDefinition(type);
    const raw = mesh.userData['shapeParams'] as Partial<ShapeParameterMap> | undefined;
    return this.normalizeParams(definition, raw);
  }

  getSnapshotForMesh(mesh: THREE.Mesh): ShapeSnapshot {
    const type = (mesh.userData['shapeType'] as ShapeType | undefined) ?? 'wing';
    const definition = this.getShapeDefinition(type);
    return {
      type,
      name: (mesh.userData['name'] as string | undefined) ?? mesh.name ?? definition.label,
      params: this.getParamsForMesh(mesh),
      controls: definition.controls,
    };
  }

  private normalizeParams(
    definition: ShapeDefinition,
    raw?: Partial<ShapeParameterMap>,
  ): ShapeParameterMap {
    const next: ShapeParameterMap = { ...definition.defaults };
    if (raw) {
      for (const [key, value] of Object.entries(raw)) {
        if (typeof value === 'number' || typeof value === 'boolean') {
          next[key] = value;
        }
      }
    }

    for (const control of definition.controls) {
      if (control.control !== 'range') {
        continue;
      }
      const current = asNumber(next[control.key], asNumber(definition.defaults[control.key], 0));
      const min = control.min ?? Number.NEGATIVE_INFINITY;
      const max = control.max ?? Number.POSITIVE_INFINITY;
      next[control.key] = Math.max(min, Math.min(max, current));
    }

    return next;
  }
}
