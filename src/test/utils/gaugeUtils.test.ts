import {describe, it, expect} from 'vitest';
import {formatValue, colorSelector, getTileColor} from '../../utils/gaugeUtils';
import {FormatterType} from '../../utils/constants';

describe('formatValue', () => {
    it('uses unitTickFormatter when provided and not returning UNIT', () => {
        const unitTickFormatter = (value: number) => `Custom ${value}`;
        expect(formatValue(42, unitTickFormatter)).toBe('Custom 42');
    });

    it('uses unit formatter when unitTickFormatter returns UNIT', () => {
        const unitTickFormatter = () => FormatterType.UNIT;
        const unit = (value: number) => `${value} km/h`;
        expect(formatValue(42, unitTickFormatter, unit)).toBe('42 km/h');
    });

    it('uses unit formatter when unitTickFormatter is not provided', () => {
        const unit = (value: number) => `${value} km/h`;
        expect(formatValue(42, undefined, unit)).toBe('42 km/h');
    });

    it('falls back to toString when no formatters are provided', () => {
        expect(formatValue(42)).toBe('42');
    });
});

describe('colorSelector', () => {
    it('returns default color when value is below middle threshold', () => {
        expect(colorSelector(80, 60, '#f00', '#ff0', '#0f0', 30)).toBe('#0f0');
    });

    it('returns middle color when value is between middle and max thresholds', () => {
        expect(colorSelector(80, 60, '#f00', '#ff0', '#0f0', 70)).toBe('#ff0');
    });

    it('returns max color when value is at or above max threshold', () => {
        expect(colorSelector(80, 60, '#f00', '#ff0', '#0f0', 80)).toBe('#f00');
    });

    it('handles edge cases correctly', () => {
        expect(colorSelector(80, 60, '#f00', '#ff0', '#0f0', 60)).toBe('#ff0');
    });
});

describe('getTileColor', () => {
    const config = {
        isTileColorGradient: false,
        gradientType: 'tile',
        thresholdYellowNormalized: 0.75,
        thresholdRedNormalized: 1,
        colorTileThresholdDefault: '#00ff00',
        colorTileThresholdYellow: '#ffff00',
        colorTileThresholdRed: '#ff0000',
    };

    it('returns threshold colors based on value when not using gradient', () => {
        expect(getTileColor(0.5, 0, config, null)).toBe('#00ff00');
        expect(getTileColor(0.8, 0, config, null)).toBe('#ffff00');
        expect(getTileColor(1, 0, config, null)).toBe('#ff0000');
    });

    it('uses colorScale when using full gradient', () => {
        const colorScale = (value: number) => `scaled-${value}`;
        expect(getTileColor(0.5, 0, {
            ...config,
            isTileColorGradient: true,
            gradientType: 'full',
        }, colorScale)).toBe('scaled-0.5');
    });

    it('returns gradient URL when using tile gradient', () => {
        expect(getTileColor(0.5, 3, {
            ...config,
            isTileColorGradient: true,
            gradientType: 'tile',
        }, null, 'tiles')).toBe('url(#gradient-tiles-3)');
    });
});