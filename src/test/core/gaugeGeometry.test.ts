import {describe, it, expect} from 'vitest';
import {
    buildTileAngles,
    computeGaugeContentBounds,
    computeTileAngleStep,
    createAngleScale,
    labelAngleFromNormalized,
    resolveGeometry,
    valueToAngle,
} from '../../core/gaugeGeometry';
import {DEFAULT_THEME} from '../../theme/defaultTheme';
import {assertValidGeometry} from '../../utils/gaugeGuards';

describe('createAngleScale', () => {
    it('maps normalized values to configured angle range', () => {
        const scale = createAngleScale(DEFAULT_THEME.geometry);
        expect(scale(0)).toBe(-Math.PI / 2);
        expect(scale(1)).toBe(Math.PI / 2);
        expect(scale(0.5)).toBeCloseTo(0);
    });

    it('supports custom geometry ranges', () => {
        const geometry = {
            ...DEFAULT_THEME.geometry,
            startAngle: -Math.PI,
            endAngle: Math.PI / 2,
        };
        const scale = createAngleScale(geometry);
        expect(scale(0)).toBe(-Math.PI);
        expect(scale(1)).toBe(Math.PI / 2);
    });
});

describe('valueToAngle', () => {
    it('caps values at endAngle', () => {
        expect(valueToAngle(2, DEFAULT_THEME.geometry)).toBe(Math.PI / 2);
    });
});

describe('buildTileAngles', () => {
    it('uses geometry sweep instead of hardcoded pi', () => {
        const geometry = {
            ...DEFAULT_THEME.geometry,
            startAngle: 0,
            endAngle: Math.PI,
        };
        const angles = buildTileAngles(geometry, 4);
        expect(angles).toHaveLength(4);
        expect(angles[0]).toBe(0);
        expect(computeTileAngleStep(geometry, 4)).toBe(Math.PI / 4);
    });
});

describe('labelAngleFromNormalized', () => {
    it('applies pointerAngleOffset for tick and pointer placement', () => {
        expect(labelAngleFromNormalized(0, DEFAULT_THEME.geometry)).toBeCloseTo(-Math.PI);
        expect(labelAngleFromNormalized(1, DEFAULT_THEME.geometry)).toBeCloseTo(0);
    });
});

describe('computeGaugeContentBounds', () => {
    it('produces wider bounds for larger angle sweeps', () => {
        const semicircle = computeGaugeContentBounds(DEFAULT_THEME.geometry, 100, 115);
        const nearFullCircle = computeGaugeContentBounds({
            ...DEFAULT_THEME.geometry,
            startAngle: -Math.PI + 0.01,
            endAngle: Math.PI - 0.01,
        }, 100, 115);

        const semicircleSpan = (semicircle.maxX - semicircle.minX) + (semicircle.maxY - semicircle.minY);
        const fullSpan = (nearFullCircle.maxX - nearFullCircle.minX) + (nearFullCircle.maxY - nearFullCircle.minY);
        expect(fullSpan).toBeGreaterThan(semicircleSpan);
    });
});

describe('resolveGeometry', () => {
    it('merges partial overrides onto theme defaults', () => {
        const resolved = resolveGeometry(DEFAULT_THEME.geometry, {endAngle: Math.PI});
        expect(resolved.startAngle).toBe(DEFAULT_THEME.geometry.startAngle);
        expect(resolved.endAngle).toBe(Math.PI);
    });
});

describe('assertValidGeometry', () => {
    it('rejects invalid sweeps', () => {
        expect(() => assertValidGeometry({startAngle: 1, endAngle: 1})).toThrow(RangeError);
        expect(() => assertValidGeometry({startAngle: 0, endAngle: Math.PI})).not.toThrow();
    });
});