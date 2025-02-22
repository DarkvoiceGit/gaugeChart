import {describe, it, expect} from 'vitest';
import {getOpacity, formatValue, colorSelector, getTileColor, ElementType} from '../../utils/gaugeUtils';
import {FormatterType} from '../../utils/constants';

describe('getOpacity', () => {
    it('returns 1 when opacity effect is disabled', () => {
        const hoverStates = {tile: false, primaryBar: false, secondaryBar: false};
        expect(getOpacity(ElementType.FILLED_TILE, hoverStates, false)).toBe(1);
        expect(getOpacity(ElementType.PRIMARY_BAR, hoverStates, false)).toBe(1);
        expect(getOpacity(ElementType.SECONDARY_BAR, hoverStates, false)).toBe(1);
    });

    it('returns 1 for hovered elements', () => {
        // Primary bar hovered
        expect(getOpacity(ElementType.PRIMARY_BAR, {tile: false, primaryBar: true, secondaryBar: false}, true)).toBe(1);

        // Secondary bar hovered
        expect(getOpacity(ElementType.SECONDARY_BAR, {
            tile: false,
            primaryBar: false,
            secondaryBar: true
        }, true)).toBe(1);

        // Tile hovered
        expect(getOpacity(ElementType.FILLED_TILE, {tile: true, primaryBar: false, secondaryBar: false}, true)).toBe(1);
    });

    it('returns 0.5 for non-hovered elements when any element is hovered', () => {
        // Primary bar hovered, checking secondary bar and tile
        expect(getOpacity(ElementType.FILLED_TILE, {
            tile: false,
            primaryBar: true,
            secondaryBar: false
        }, true)).toBe(0.5);
        expect(getOpacity(ElementType.SECONDARY_BAR, {
            tile: false,
            primaryBar: true,
            secondaryBar: false
        }, true)).toBe(0.5);

        // Secondary bar hovered, checking primary bar and tile
        expect(getOpacity(ElementType.FILLED_TILE, {
            tile: false,
            primaryBar: false,
            secondaryBar: true
        }, true)).toBe(0.5);
        expect(getOpacity(ElementType.PRIMARY_BAR, {
            tile: false,
            primaryBar: false,
            secondaryBar: true
        }, true)).toBe(0.5);

        // Tile hovered, checking primary and secondary bars
        expect(getOpacity(ElementType.PRIMARY_BAR, {
            tile: true,
            primaryBar: false,
            secondaryBar: false
        }, true)).toBe(0.5);
        expect(getOpacity(ElementType.SECONDARY_BAR, {
            tile: true,
            primaryBar: false,
            secondaryBar: false
        }, true)).toBe(0.5);
    });

    it('returns 1 when nothing is hovered', () => {
        const hoverStates = {tile: false, primaryBar: false, secondaryBar: false};
        expect(getOpacity(ElementType.FILLED_TILE, hoverStates, true)).toBe(1);
        expect(getOpacity(ElementType.PRIMARY_BAR, hoverStates, true)).toBe(1);
        expect(getOpacity(ElementType.SECONDARY_BAR, hoverStates, true)).toBe(1);
    });
});

describe('formatValue', () => {
    it('uses unitTickFormatter when provided and not returning UNIT', () => {
        const unitTickFormatter = (value: number) => `Custom ${value}`;
        expect(formatValue(42, unitTickFormatter)).toBe('Custom 42');
    });

    it('uses unit formatter when unitTickFormatter returns UNIT', () => {
        const unitTickFormatter = () => FormatterType.UNIT;
        const unit = (value: number) => `${value} units`;
        expect(formatValue(42, unitTickFormatter, unit)).toBe('42 units');
    });

    it('uses unit formatter when unitTickFormatter is not provided', () => {
        const unit = (value: number) => `${value} units`;
        expect(formatValue(42, undefined, unit)).toBe('42 units');
    });

    it('falls back to toString when no formatters are provided', () => {
        expect(formatValue(42)).toBe('42');
    });
});

describe('colorSelector', () => {
    it('returns default color when value is below middle threshold', () => {
        expect(colorSelector(100, 50, 'red', 'yellow', 'green', 25)).toBe('green');
    });

    it('returns middle color when value is between middle and max thresholds', () => {
        expect(colorSelector(100, 50, 'red', 'yellow', 'green', 75)).toBe('yellow');
    });

    it('returns max color when value is at or above max threshold', () => {
        expect(colorSelector(100, 50, 'red', 'yellow', 'green', 100)).toBe('red');
        expect(colorSelector(100, 50, 'red', 'yellow', 'green', 150)).toBe('red');
    });

    it('handles edge cases correctly', () => {
        // Exactly at middle threshold
        expect(colorSelector(100, 50, 'red', 'yellow', 'green', 50)).toBe('yellow');

        // Exactly at max threshold
        expect(colorSelector(100, 50, 'red', 'yellow', 'green', 100)).toBe('red');
    });
});

describe('getTileColor', () => {
    it('returns threshold colors based on value when not using gradient', () => {
        const config = {
            isTileColorGradient: false,
            gradientType: 'tile',
            thresholdYellowNormalized: 0.6,
            thresholdRedNormalized: 0.8,
            colorTileThresholdDefault: 'green',
            colorTileThresholdYellow: 'yellow',
            colorTileThresholdRed: 'red'
        };

        // Below yellow threshold
        expect(getTileColor(0.5, 0, config, null)).toBe('green');

        // Between yellow and red thresholds
        expect(getTileColor(0.7, 0, config, null)).toBe('yellow');

        // Above red threshold
        expect(getTileColor(0.9, 0, config, null)).toBe('red');
    });

    it('uses colorScale when using full gradient', () => {
        const config = {
            isTileColorGradient: true,
            gradientType: 'full',
            thresholdYellowNormalized: 0.6,
            thresholdRedNormalized: 0.8,
            colorTileThresholdDefault: 'green',
            colorTileThresholdYellow: 'yellow',
            colorTileThresholdRed: 'red'
        };

        const colorScale = (value: number) => `color-${value}`;
        expect(getTileColor(0.5, 0, config, colorScale)).toBe('color-0.5');
    });

    it('returns gradient URL when using tile gradient', () => {
        const config = {
            isTileColorGradient: true,
            gradientType: 'tile',
            thresholdYellowNormalized: 0.6,
            thresholdRedNormalized: 0.8,
            colorTileThresholdDefault: 'green',
            colorTileThresholdYellow: 'yellow',
            colorTileThresholdRed: 'red'
        };

        expect(getTileColor(0.5, 3, config, null)).toBe('url(#gradient-3)');
    });
});