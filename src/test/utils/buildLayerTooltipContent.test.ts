import {describe, it, expect} from 'vitest';
import {buildLayerTooltipContent} from '../../utils/buildLayerTooltipContent';
import type {ResolvedLayer} from '../../core/resolveLayers';
import {TileFillStyle} from '../../utils/constants';

function createResolvedLayer(overrides: Partial<ResolvedLayer> & Pick<ResolvedLayer, 'id'>): ResolvedLayer {
    return {
        render: 'solid',
        zIndex: 0,
        hoverable: true,
        rawValue: 40,
        normalizedValue: 0.5,
        color: '#000',
        startAngle: 0,
        endAngle: 1,
        innerRadius: 100,
        outerRadius: 120,
        arcConfig: {padAngle: 0, padRadius: 0, cornerRadius: 0},
        solidPath: null,
        hoverSolidPath: null,
        segments: [],
        tileAngles: [],
        segmentCount: 0,
        segmentedStyle: {
            isTileColorGradient: false,
            gradientType: 'tile',
            thresholdYellowNormalized: 0.75,
            thresholdRedNormalized: 1,
            colorTileThresholdDefault: '#0f0',
            colorTileThresholdYellow: '#ff0',
            colorTileThresholdRed: '#f00',
            colorTileBg: '#ccc',
            fillStyle: TileFillStyle.FILLED,
            borderColor: '#000',
            borderThickness: 1,
        },
        ...overrides,
    };
}

describe('buildLayerTooltipContent', () => {
    const layers = [
        createResolvedLayer({id: 'tiles', tooltipLabel: 'Total', rawValue: 60, color: '#0f0'}),
        createResolvedLayer({id: 'primary', tooltipLabel: 'Primary', rawValue: 40, color: '#00f'}),
    ];

    it('shows only hovered layer in layer mode', () => {
        const items = buildLayerTooltipContent({
            layers,
            hoveredLayerId: 'primary',
            tooltipMode: 'layer',
        });

        expect(items).toHaveLength(1);
        expect(items[0].label).toBe('Primary:');
        expect(items[0].value).toBe('40');
        expect(items[0].color).toBe('#00f');
    });

    it('shows all hoverable layers in all mode', () => {
        const items = buildLayerTooltipContent({
            layers,
            hoveredLayerId: 'tiles',
            tooltipMode: 'all',
        });

        expect(items).toHaveLength(2);
        expect(items[0].label).toBe('Total:');
        expect(items[1].label).toBe('Primary:');
    });

    it('uses value formatter when provided', () => {
        const items = buildLayerTooltipContent({
            layers,
            hoveredLayerId: 'primary',
            tooltipMode: 'layer',
            formatters: {
                value: (value) => `${value}%`,
            },
        });

        expect(items[0].value).toBe('40%');
    });

    it('falls back to layer id when tooltip label is missing', () => {
        const items = buildLayerTooltipContent({
            layers: [createResolvedLayer({id: 'sum', rawValue: 10})],
            hoveredLayerId: 'sum',
            tooltipMode: 'layer',
        });

        expect(items[0].label).toBe('sum:');
    });
});