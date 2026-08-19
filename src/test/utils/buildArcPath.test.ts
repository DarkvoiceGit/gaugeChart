import {describe, it, expect} from 'vitest';
import {buildArcPath} from '../../utils/gaugeCalculations';

describe('buildArcPath', () => {
    const baseSpec = {
        innerRadius: 50,
        outerRadius: 100,
        startAngle: 0,
        endAngle: Math.PI / 2,
        cornerRadius: 2,
        padAngle: 0.01,
        padRadius: 1,
    };

    it('returns an SVG path starting with M', () => {
        const path = buildArcPath(baseSpec);
        expect(path).toBeTruthy();
        expect(path?.startsWith('M')).toBe(true);
    });

    it('returns different paths for different angle ranges', () => {
        const shortArc = buildArcPath(baseSpec);
        const longArc = buildArcPath({
            ...baseSpec,
            endAngle: Math.PI,
        });

        expect(shortArc).not.toBe(longArc);
    });

    it('returns different paths for different radii', () => {
        const innerArc = buildArcPath(baseSpec);
        const widerArc = buildArcPath({
            ...baseSpec,
            outerRadius: 120,
        });

        expect(innerArc).not.toBe(widerArc);
    });

    it('handles zero-thickness arcs without throwing', () => {
        expect(() => buildArcPath({
            ...baseSpec,
            innerRadius: 100,
            outerRadius: 100,
        })).not.toThrow();
    });
});