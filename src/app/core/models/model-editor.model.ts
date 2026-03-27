import { FirmwareFamily, VehicleKind } from '../mavlink/models/vehicle-identity.model';

export type RotationDirection = 'cw' | 'ccw';

export interface PropellerPartDefinition {
  readonly id: string;
  readonly label: string;
  readonly pwmOutput: number;
  readonly position: readonly [number, number, number];
  readonly radius: number;
  readonly rotationDirection: RotationDirection;
}

export interface ServoPartDefinition {
  readonly id: string;
  readonly label: string;
  readonly pwmOutput: number;
  readonly position: readonly [number, number, number];
  readonly axis: 'x' | 'y' | 'z';
}

export interface ModelDefinition {
  readonly id: string;
  readonly label: string;
  readonly firmwareFamily: FirmwareFamily | 'any';
  readonly vehicleKind: VehicleKind | 'any';
  readonly bodyRadius: number;
  readonly bodyHeight: number;
  readonly propellers: ReadonlyArray<PropellerPartDefinition>;
  readonly servos: ReadonlyArray<ServoPartDefinition>;
}

export const MODEL_DEFINITIONS: ReadonlyArray<ModelDefinition> = [
  {
    id: 'arducopter-quad-x',
    label: 'ArduCopter Test Rig',
    firmwareFamily: 'arducopter',
    vehicleKind: 'copter',
    bodyRadius: 0.3,
    bodyHeight: 0.14,
    propellers: [
      { id: 'prop-1', label: 'Propeller 1', pwmOutput: 1, position: [0.95, 0.12, -0.95], radius: 0.33, rotationDirection: 'ccw' },
      { id: 'prop-2', label: 'Propeller 2', pwmOutput: 2, position: [0.95, 0.12, 0.95], radius: 0.33, rotationDirection: 'cw' },
      { id: 'prop-3', label: 'Propeller 3', pwmOutput: 3, position: [-0.95, 0.12, 0.95], radius: 0.33, rotationDirection: 'ccw' },
      { id: 'prop-4', label: 'Propeller 4', pwmOutput: 4, position: [-0.95, 0.12, -0.95], radius: 0.33, rotationDirection: 'cw' },
      { id: 'prop-5', label: 'Propeller 5', pwmOutput: 5, position: [1.45, 0.12, 0], radius: 0.28, rotationDirection: 'ccw' },
      { id: 'prop-6', label: 'Propeller 6', pwmOutput: 6, position: [-1.45, 0.12, 0], radius: 0.28, rotationDirection: 'cw' },
      { id: 'prop-7', label: 'Propeller 7', pwmOutput: 7, position: [0, 0.12, 1.45], radius: 0.28, rotationDirection: 'ccw' },
      { id: 'prop-8', label: 'Propeller 8', pwmOutput: 8, position: [0, 0.12, -1.45], radius: 0.28, rotationDirection: 'cw' },
      { id: 'prop-9', label: 'Propeller 9', pwmOutput: 9, position: [0.55, 0.12, 1.55], radius: 0.24, rotationDirection: 'ccw' },
      { id: 'prop-10', label: 'Propeller 10', pwmOutput: 10, position: [-0.55, 0.12, 1.55], radius: 0.24, rotationDirection: 'cw' },
      { id: 'prop-11', label: 'Propeller 11', pwmOutput: 11, position: [0.55, 0.12, -1.55], radius: 0.24, rotationDirection: 'cw' },
      { id: 'prop-12', label: 'Propeller 12', pwmOutput: 12, position: [-0.55, 0.12, -1.55], radius: 0.24, rotationDirection: 'ccw' },
    ],
    servos: [
      { id: 'servo-cam-tilt', label: 'Camera Tilt', pwmOutput: 13, position: [0.25, 0.2, -0.25], axis: 'x' },
      { id: 'servo-cam-pan', label: 'Camera Pan', pwmOutput: 14, position: [-0.25, 0.2, -0.25], axis: 'y' },
      { id: 'servo-gripper-a', label: 'Gripper A', pwmOutput: 15, position: [0.5, 0.2, 0.5], axis: 'z' },
      { id: 'servo-gripper-b', label: 'Gripper B', pwmOutput: 16, position: [-0.5, 0.2, 0.5], axis: 'z' },
      { id: 'servo-payload-1', label: 'Payload Servo 1', pwmOutput: 17, position: [0.75, 0.2, 0], axis: 'x' },
      { id: 'servo-payload-2', label: 'Payload Servo 2', pwmOutput: 18, position: [-0.75, 0.2, 0], axis: 'x' },
    ],
  },
  {
    id: 'arduplane-standard',
    label: 'ArduPlane Standard',
    firmwareFamily: 'arduplane',
    vehicleKind: 'plane',
    bodyRadius: 0.35,
    bodyHeight: 0.12,
    propellers: [
      { id: 'prop-main', label: 'Main Propeller', pwmOutput: 1, position: [0, 0.12, -1.2], radius: 0.38, rotationDirection: 'cw' },
    ],
    servos: [
      { id: 'servo-aileron-l', label: 'Aileron Left', pwmOutput: 2, position: [-1.35, 0.12, 0.1], axis: 'x' },
      { id: 'servo-aileron-r', label: 'Aileron Right', pwmOutput: 3, position: [1.35, 0.12, 0.1], axis: 'x' },
      { id: 'servo-elevator', label: 'Elevator', pwmOutput: 4, position: [0, 0.12, 1.45], axis: 'x' },
      { id: 'servo-rudder', label: 'Rudder', pwmOutput: 5, position: [0.18, 0.45, 1.45], axis: 'y' },
    ],
  },
  {
    id: 'ardurover-skid',
    label: 'ArduRover Skid',
    firmwareFamily: 'ardurover',
    vehicleKind: 'rover',
    bodyRadius: 0.42,
    bodyHeight: 0.2,
    propellers: [],
    servos: [
      { id: 'servo-steering', label: 'Steering Servo', pwmOutput: 1, position: [0, 0.12, -0.95], axis: 'y' },
      { id: 'servo-throttle', label: 'Throttle Servo', pwmOutput: 3, position: [0.55, 0.12, -0.35], axis: 'x' },
    ],
  },
  {
    id: 'generic-empty',
    label: 'Generic Empty Body',
    firmwareFamily: 'any',
    vehicleKind: 'any',
    bodyRadius: 0.3,
    bodyHeight: 0.14,
    propellers: [],
    servos: [],
  },
];
