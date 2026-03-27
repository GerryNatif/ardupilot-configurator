export interface ParameterMetadata {
  name: string;
  displayName: string | null;
  description: string | null;
  min: number | null;
  max: number | null;
  increment: number | null;
  units: string | null;
  user: string | null;
  readOnly: boolean;
  rebootRequired: boolean;
  values: ReadonlyMap<number, string>;
  bitmask: ReadonlyMap<number, string>;
}

export interface ParameterMetadataState {
  inProgress: boolean;
  loaded: boolean;
  loadedAtMs: number | null;
  source: string | null;
  lastError: string | null;
  byName: Map<string, ParameterMetadata>;
}

export const INITIAL_PARAMETER_METADATA_STATE: ParameterMetadataState = {
  inProgress: false,
  loaded: false,
  loadedAtMs: null,
  source: null,
  lastError: null,
  byName: new Map<string, ParameterMetadata>()
};
