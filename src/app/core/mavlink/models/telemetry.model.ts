export type LinkStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface GpsState {
  fixType: number | null;
  satellitesVisible: number | null;
  latDeg: number | null;
  lonDeg: number | null;
  altM: number | null;
}

export interface BatteryState {
  voltageV: number | null;
  currentA: number | null;
  remainingPct: number | null;
}

export interface HeartbeatState {
  lastSeenMs: number | null;
  armed: boolean;
  baseMode: number | null;
  customMode: number | null;
}

export interface AttitudeState {
  lastSeenMs: number | null;
  rollDeg: number | null;
  pitchDeg: number | null;
  yawDeg: number | null;
}

export interface RcState {
  lastSeenMs: number | null;
  channelCount: number | null;
  rssi: number | null;
  channelsRaw: Array<number | null>;
}

export interface TelemetryState {
  heartbeat: HeartbeatState;
  gps: GpsState;
  battery: BatteryState;
  attitude: AttitudeState;
  rc: RcState;
}



export const INITIAL_TELEMETRY_STATE: TelemetryState = {
  heartbeat: { lastSeenMs: null, armed: false, baseMode: null, customMode: null },
  gps: { fixType: null, satellitesVisible: null, latDeg: null, lonDeg: null, altM: null },
  battery: { voltageV: null, currentA: null, remainingPct: null },
  attitude: { lastSeenMs: null, rollDeg: null, pitchDeg: null, yawDeg: null },
  rc: {
    lastSeenMs: null,
    channelCount: null,
    rssi: null,
    channelsRaw: Array.from<number | null>({ length: 8 }).fill(null)
  }
};