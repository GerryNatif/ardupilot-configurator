import { ShapeParameterValue } from './shape-generator.models';

export function asNumber(value: ShapeParameterValue | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function lerpNumber(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
