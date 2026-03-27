import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {
  ModelDefinition,
  PropellerPartDefinition,
  ServoPartDefinition,
} from '../models/model-editor.model';

export type EditorEntityKind = 'fixed-body' | 'propeller' | 'servo';

export interface EditorEntity {
  readonly id: string;
  readonly kind: EditorEntityKind;
  readonly label: string;
  readonly pwmOutput: number | null;
  readonly mesh: THREE.Object3D;
}

export interface BuiltModel {
  readonly root: THREE.Group;
  readonly entities: ReadonlyArray<EditorEntity>;
}

@Injectable({ providedIn: 'root' })
export class ModelEditorBuilderService {
  build(definition: ModelDefinition): BuiltModel {
    const root = new THREE.Group();
    root.name = `model-${definition.id}`;

    const entities: EditorEntity[] = [];

    const fixedBody = this.createFixedBody(definition);
    root.add(fixedBody);
    entities.push({
      id: 'fixed-body',
      kind: 'fixed-body',
      label: 'Fixed Body',
      pwmOutput: null,
      mesh: fixedBody,
    });

    for (const propeller of definition.propellers) {
      const propellerMesh = this.createPropeller(propeller);
      root.add(propellerMesh);
      entities.push({
        id: propeller.id,
        kind: 'propeller',
        label: propeller.label,
        pwmOutput: propeller.pwmOutput,
        mesh: propellerMesh,
      });
    }

    for (const servo of definition.servos) {
      const servoMesh = this.createServo(servo);
      root.add(servoMesh);
      entities.push({
        id: servo.id,
        kind: 'servo',
        label: servo.label,
        pwmOutput: servo.pwmOutput,
        mesh: servoMesh,
      });
    }

    return { root, entities };
  }

  private createFixedBody(definition: ModelDefinition): THREE.Group {
    const group = new THREE.Group();
    group.name = 'fixed-body';

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(definition.bodyRadius, definition.bodyRadius, definition.bodyHeight, 24),
      new THREE.MeshStandardMaterial({ color: 0x6b7280, metalness: 0.35, roughness: 0.6 }),
    );
    group.add(body);

    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(definition.bodyRadius * 0.22, definition.bodyRadius * 0.5, 3),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.15, roughness: 0.5 }),
    );
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, definition.bodyHeight * 0.55, -(definition.bodyRadius + definition.bodyRadius * 0.2));
    group.add(nose);

    return group;
  }

  private createPropeller(part: PropellerPartDefinition): THREE.Group {
    const group = new THREE.Group();
    group.name = part.id;

    const color = part.rotationDirection === 'cw' ? 0xef4444 : 0x3b82f6;

    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.1, 12),
      new THREE.MeshStandardMaterial({ color, metalness: 0.4, roughness: 0.45 }),
    );
    hub.position.y = 0.05;
    group.add(hub);

    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(part.radius, 32),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.25, side: THREE.DoubleSide }),
    );
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = 0.105;
    group.add(disc);

    const label = this.createLabelSprite(`PWM ${part.pwmOutput}`);
    label.position.set(0, 0.2, 0);
    group.add(label);

    group.position.set(part.position[0], part.position[1], part.position[2]);
    return group;
  }

  private createServo(part: ServoPartDefinition): THREE.Group {
    const group = new THREE.Group();
    group.name = part.id;

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.12, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.2, roughness: 0.55 }),
    );
    group.add(base);

    const horn = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.03, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x064e3b, metalness: 0.3, roughness: 0.4 }),
    );
    horn.position.y = 0.08;
    group.add(horn);

    const label = this.createLabelSprite(`PWM ${part.pwmOutput}`);
    label.position.set(0, 0.22, 0);
    group.add(label);

    group.position.set(part.position[0], part.position[1], part.position[2]);
    return group;
  }

  private createLabelSprite(text: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 192;
    canvas.height = 56;

    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'rgba(15, 23, 42, 0.9)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#e2e8f0';
      context.font = 'bold 26px sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvas.width / 2, canvas.height / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.5, 0.16, 1);
    return sprite;
  }
}
