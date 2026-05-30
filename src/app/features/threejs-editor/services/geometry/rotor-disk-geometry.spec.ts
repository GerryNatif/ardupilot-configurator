import { describe, expect, it } from 'vitest';
import { getRotorDiskDiagnostics } from './rotor-disk-geometry';

describe('RotorDisk geometry diagnostics', () => {
	it('builds a full geometry with arrows + center + secondary ring', () => {
		const diagnostics = getRotorDiskDiagnostics({
			clockwise: true,
			counterClockwise: false,
		});

		expect(diagnostics.hasPositionAttribute).toBe(true);
		expect(diagnostics.vertexCount).toBeGreaterThan(0);
		// Expect 3 material groups: arrows, center disk, secondary ring.
		expect(diagnostics.groupCount).toBe(3);
		expect(diagnostics.groups[0].count).toBeGreaterThan(0);
		expect(diagnostics.boundingRadius).toBeGreaterThan(0.1);
	});

	it('still includes arrows when both directions are enabled', () => {
		const diagnostics = getRotorDiskDiagnostics({
			clockwise: true,
			counterClockwise: true,
		});

		expect(diagnostics.groupCount).toBe(3);
		expect(diagnostics.groups[0].count).toBeGreaterThan(0);
	});
});
