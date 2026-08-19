import {describe, it, expect} from 'vitest';
import {
    computeGaugeLayout,
    computeGaugeLayoutFromSize,
    resolveSizePreset,
} from '../../utils/computeGaugeLayout';
import {GAUGE_SIZE_PRESETS} from '../../utils/constants';
import {DEFAULT_THEME} from '../../theme/defaultTheme';

describe('computeGaugeLayout', () => {
    it('derives radius and scale factor from logical dimensions', () => {
        const layout = computeGaugeLayout(800, 600);

        expect(layout.radius).toBe(Math.min(800, 600) / DEFAULT_THEME.layout.radiusDivisor);
        expect(layout.scaleFactor).toBe(800 / DEFAULT_THEME.layout.referenceWidth);
        expect(layout.logicalWidth).toBe(800);
        expect(layout.logicalHeight).toBe(600);
    });

    it('builds a viewBox string from geometry-aware bounds', () => {
        const layout = computeGaugeLayout(800, 600);
        const [minX, minY, width, height] = layout.viewBox.split(' ').map(Number);

        expect(minX).toBe(layout.viewBoxMinX);
        expect(width).toBe(layout.viewBoxWidth);
        expect(height).toBe(layout.viewBoxHeight);
        expect(minY).toBeGreaterThanOrEqual(0);
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('rejects non-positive dimensions', () => {
        expect(() => computeGaugeLayout(0, 600)).toThrow(RangeError);
        expect(() => computeGaugeLayout(800, -1)).toThrow(RangeError);
    });

    it.each(Object.keys(GAUGE_SIZE_PRESETS))('matches preset dimensions for size %s', (sizeKey) => {
        const preset = GAUGE_SIZE_PRESETS[sizeKey as keyof typeof GAUGE_SIZE_PRESETS];
        const fromPreset = computeGaugeLayoutFromSize(sizeKey as keyof typeof GAUGE_SIZE_PRESETS);
        const direct = computeGaugeLayout(preset.width, preset.height);

        expect(fromPreset.viewBox).toBe(direct.viewBox);
        expect(fromPreset.viewBoxWidth).toBe(direct.viewBoxWidth);
        expect(fromPreset.viewBoxHeight).toBe(direct.viewBoxHeight);
        expect(fromPreset.radius).toBe(direct.radius);
    });

    it('maps default size to the m preset', () => {
        const defaultLayout = computeGaugeLayoutFromSize('default');
        const mediumLayout = computeGaugeLayoutFromSize('m');

        expect(defaultLayout.viewBox).toBe(mediumLayout.viewBox);
    });

    it('expands viewBox when geometry sweep increases', () => {
        const semicircle = computeGaugeLayout(800, 600);
        const wideSweep = computeGaugeLayout(800, 600, DEFAULT_THEME.layout, DEFAULT_THEME.radius, {
            ...DEFAULT_THEME.geometry,
            startAngle: -Math.PI + 0.01,
            endAngle: Math.PI - 0.01,
        });

        expect(wideSweep.viewBoxWidth).toBeGreaterThan(semicircle.viewBoxWidth - 1);
    });
});

describe('resolveSizePreset', () => {
    it('falls back to m for unknown keys', () => {
        const preset = resolveSizePreset('default');
        expect(preset).toEqual(GAUGE_SIZE_PRESETS.m);
    });
});