export type FirmwareFamily =
  | 'arducopter'
  | 'arduplane'
  | 'ardurover'
  | 'ardusub'
  | 'unknown';

export type VehicleKind =
  | 'copter'
  | 'plane'
  | 'rover'
  | 'boat'
  | 'sub'
  | 'station'
  | 'unknown';

export interface FirmwareVersion {
  raw: number | null;
  major: number | null;
  minor: number | null;
  patch: number | null;
  buildType: number | null;
  text: string | null;
}

export interface VehicleIdentityState {
  discovered: boolean;
  targetSystemId: number | null;
  targetComponentId: number | null;
  autopilot: number | null;
  mavType: number | null;
  baseMode: number | null;
  customMode: number | null;
  vehicleKind: VehicleKind;
  firmwareFamily: FirmwareFamily;
  isArduPilot: boolean;
  version: FirmwareVersion;
  discoveredAtMs: number | null;
  versionReceivedAtMs: number | null;
}

export const INITIAL_VEHICLE_IDENTITY_STATE: VehicleIdentityState = {
  discovered: false,
  targetSystemId: null,
  targetComponentId: null,
  autopilot: null,
  mavType: null,
  baseMode: null,
  customMode: null,
  vehicleKind: 'unknown',
  firmwareFamily: 'unknown',
  isArduPilot: false,
  version: {
    raw: null,
    major: null,
    minor: null,
    patch: null,
    buildType: null,
    text: null
  },
  discoveredAtMs: null,
  versionReceivedAtMs: null
};

// MAV_AUTOPILOT enum
export const MAV_AUTOPILOT_ARDUPILOTMEGA = 3;


// MAV_TYPE enum (valeurs MAVLink officielles)
export enum MAV_TYPE {
  GENERIC = 0, // Generic micro air vehicle
  FIXED_WING = 1, // Fixed wing aircraft
  QUADROTOR = 2, // Quadrotor
  COAXIAL = 3, // Coaxial helicopter
  HELICOPTER = 4, // Normal helicopter with tail rotor
  ANTENNA_TRACKER = 5, // Ground installation
  GCS = 6, // Operator control unit / ground control station
  AIRSHIP = 7, // Airship, controlled
  FREE_BALLOON = 8, // Free balloon, uncontrolled
  ROCKET = 9, // Rocket
  GROUND_ROVER = 10, // Ground rover
  SURFACE_BOAT = 11, // Surface vessel, boat, ship
  SUBMARINE = 12, // Submarine
  HEXAROTOR = 13, // Hexarotor
  OCTOROTOR = 14, // Octorotor
  TRICOPTER = 15, // Tricopter
  FLAPPING_WING = 16, // Flapping wing
  KITE = 17, // Kite
  ONBOARD_CONTROLLER = 18, // Onboard companion controller
  VTOL_TAILSITTER_DUOROTOR = 19, // Two-rotor Tailsitter VTOL
  VTOL_TAILSITTER_QUADROTOR = 20, // Quad-rotor Tailsitter VTOL
  VTOL_TILTROTOR = 21, // Tiltrotor VTOL
  VTOL_FIXEDROTOR = 22, // VTOL with separate fixed rotors
  VTOL_TAILSITTER = 23, // Tailsitter VTOL
  VTOL_TILTWING = 24, // Tiltwing VTOL
  VTOL_RESERVED5 = 25, // VTOL reserved 5
  GIMBAL = 26, // Gimbal
  ADSB = 27, // ADSB system
  PARAFOIL = 28, // Steerable, nonrigid airfoil
  DODECAROTOR = 29, // Dodecarotor
  CAMERA = 30, // Camera
  CHARGING_STATION = 31, // Charging station
  FLARM = 32, // FLARM collision avoidance system
  SERVO = 33, // Servo
  ODID = 34, // Open Drone ID
  DECAROTOR = 35, // Decarotor
  BATTERY = 36, // Battery
  PARACHUTE = 37, // Parachute
  LOG = 38, // Log
  OSD = 39, // OSD
  IMU = 40, // IMU
  GPS = 41, // GPS
  WINCH = 42, // Winch
  GENERIC_MULTIROTOR = 43, // Generic multirotor
  ILLUMINATOR = 44, // Illuminator
  SPACECRAFT_ORBITER = 45, // Orbiter spacecraft
  GROUND_QUADRUPED = 46, // Four-legged ground vehicle
  VTOL_GYRODYNE = 47, // VTOL hybrid of helicopter and autogyro
  GRIPPER = 48, // Gripper
  RADIO = 49 // Radio
}

const COPTER_TYPES = new Set<number>([
  MAV_TYPE.QUADROTOR,
  MAV_TYPE.COAXIAL,
  MAV_TYPE.HELICOPTER,
  MAV_TYPE.HEXAROTOR,
  MAV_TYPE.OCTOROTOR,
  MAV_TYPE.TRICOPTER,
  MAV_TYPE.HELICOPTER,
  MAV_TYPE.DODECAROTOR
]);

const PLANE_TYPES = new Set<number>([
  MAV_TYPE.FIXED_WING,
  MAV_TYPE.FLAPPING_WING,
  MAV_TYPE.VTOL_TAILSITTER_DUOROTOR,
  MAV_TYPE.VTOL_TAILSITTER_QUADROTOR,
  MAV_TYPE.VTOL_TILTROTOR,
  MAV_TYPE.VTOL_FIXEDROTOR,
  MAV_TYPE.VTOL_TAILSITTER,
  MAV_TYPE.VTOL_TILTWING,
  MAV_TYPE.VTOL_RESERVED5,
]);


export function isArduPilotAutopilot(autopilot: number | null): boolean {
  return autopilot === MAV_AUTOPILOT_ARDUPILOTMEGA;
}

//Type de véhicule pour l'application, dérivé du type MAVLink 
export function mapVehicleKind(mavType: number | null): VehicleKind {
  console.log('Mapping MAV type to vehicle kind:', mavType);
  if (mavType == null) return 'unknown';
  if (COPTER_TYPES.has(mavType)) return 'copter';
  if (PLANE_TYPES.has(mavType)) return 'plane';
  if (mavType === MAV_TYPE.GROUND_ROVER) return 'rover';
  if (mavType === MAV_TYPE.SURFACE_BOAT) return 'boat';
  if (mavType === MAV_TYPE.SUBMARINE) return 'sub';
  if (mavType === MAV_TYPE.GCS) return 'station';
  return 'unknown';
}

//Type de firmware pour l'application
export function mapFirmwareFamily(
  autopilot: number | null,
  mavType: number | null
): FirmwareFamily {
  if (!isArduPilotAutopilot(autopilot)) {
    return 'unknown';
  }

  const vehicleKind = mapVehicleKind(mavType);

  if (vehicleKind === 'copter') return 'arducopter';
  if (vehicleKind === 'plane') return 'arduplane';
  if (vehicleKind === 'rover' || vehicleKind === 'boat') return 'ardurover';
  if (vehicleKind === 'sub') return 'ardusub';

  return 'unknown';
}

export function decodeFlightSwVersion(raw: number | null): FirmwareVersion {
  if (raw == null) {
    return {
      raw: null,
      major: null,
      minor: null,
      patch: null,
      buildType: null,
      text: null
    };
  }

  const major = (raw >>> 24) & 0xff;
  const minor = (raw >>> 16) & 0xff;
  const patch = (raw >>> 8) & 0xff;
  const buildType = raw & 0xff;

  return {
    raw,
    major,
    minor,
    patch,
    buildType,
    text: `${major}.${minor}.${patch}`
  };
}