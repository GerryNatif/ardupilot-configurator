export interface ParameterEntry {
  name: string;
  value: number;
  type: number;
  index: number | null;
  count: number | null;
  updatedAtMs: number;
  pending: boolean;
}

export interface ParameterSyncState {
  startedAtMs: number | null;
  completedAtMs: number | null;
  expectedCount: number | null;
  receivedUniqueCount: number;
  inProgress: boolean;
  complete: boolean;
  timedOut: boolean;
  lastError: string | null;
}

export interface ParameterState {
  byName: Map<string, ParameterEntry>;
  sync: ParameterSyncState;
}

export const INITIAL_PARAMETER_STATE: ParameterState = {
  byName: new Map<string, ParameterEntry>(),
  sync: {
    startedAtMs: null,
    completedAtMs: null,
    expectedCount: null,
    receivedUniqueCount: 0,
    inProgress: false,
    complete: false,
    timedOut: false,
    lastError: null
  }
};

export function normalizeParamId(raw: string | Uint8Array | null | undefined): string {
  if (typeof raw === 'string') {
    return raw.replace(/\0+$/g, '').trim();
  }

  if (raw instanceof Uint8Array) {
    const decoded = new TextDecoder().decode(raw);
    return decoded.replace(/\0+$/g, '').trim();
  }

  return '';
}