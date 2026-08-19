import {describe, it, expect} from 'vitest';
import {resolveLayers} from '../../core/resolveLayers';
import {DEFAULT_THEME} from '../../theme/defaultTheme';
import {mergeTheme} from '../../theme/mergeTheme';
import {
    classicThreeLayerGauge,
    offsetLayer,
    primaryLayer,
    secondaryLayer,
    testScale,
    tileLayer,
} from '../fixtures/gaugeFixtures';

describe('resolveLayers', () => {
    it('resolves segmented and solid layers with deterministic ordering', () => {
        const resolved = resolveLayers([
            {...primaryLayer, zIndex: 2},
            {...tileLayer, zIndex: 0},
        ], testScale, 240, mergeTheme());

        expect(resolved.layers).toHaveLength(2);
        expect(resolved.layers[0].id).toBe('tiles');
        expect(resolved.layers[1].id).toBe('primary');
        expect(resolved.layers[0].segmentCount).toBe(10);
        expect(resolved.layers[1].solidPath).toBeTruthy();
    });

    it('resolves a classic three-layer gauge', () => {
        const resolved = resolveLayers(classicThreeLayerGauge, testScale, 240, DEFAULT_THEME);

        expect(resolved.layers).toHaveLength(3);
        expect(resolved.pointers).toHaveLength(2);
        expect(resolved.tickLabels.length).toBeGreaterThan(0);
    });

    it('resolves cumulative layer angles from base layer', () => {
        const resolved = resolveLayers([primaryLayer, secondaryLayer], testScale, 240, DEFAULT_THEME);

        const primary = resolved.layers.find((layer) => layer.id === 'primary');
        const secondary = resolved.layers.find((layer) => layer.id === 'secondary');
        expect(secondary?.startAngle).toBe(primary?.endAngle);
    });

    it('resolves offset layer angles from offset value', () => {
        const resolved = resolveLayers([offsetLayer], testScale, 240, DEFAULT_THEME);
        const layer = resolved.layers[0];

        expect(layer.startAngle).toBeGreaterThan(DEFAULT_THEME.geometry.startAngle);
        expect(layer.endAngle).toBeGreaterThan(layer.startAngle);
    });

    it('orders four layers by zIndex', () => {
        const resolved = resolveLayers([
            {...primaryLayer, zIndex: 3},
            {...tileLayer, zIndex: 0},
            {...secondaryLayer, zIndex: 2},
            {...offsetLayer, zIndex: 1},
        ], testScale, 240, DEFAULT_THEME);

        expect(resolved.layers.map((layer) => layer.id)).toEqual([
            'tiles',
            'offset',
            'secondary',
            'primary',
        ]);
    });

    it('builds pointer markers from enabled layer pointers', () => {
        const resolved = resolveLayers([
            {
                id: 'sum',
                value: 60,
                innerRadius: 0.6,
                outerRadius: 0.7,
                render: 'solid',
                color: '#aaa',
                pointer: {enabled: true, color: '#0f0', scale: 1, strokeScale: 1},
            },
        ], testScale, 240, DEFAULT_THEME);

        expect(resolved.pointers).toHaveLength(1);
        expect(resolved.pointerMarkers[0].id).toBe('sum');
    });

    it('builds tile angles from geometry sweep', () => {
        const geometry = {
            ...DEFAULT_THEME.geometry,
            startAngle: 0,
            endAngle: Math.PI,
        };
        const resolved = resolveLayers([
            {...tileLayer, segments: 4},
        ], testScale, 240, {...DEFAULT_THEME, geometry});

        expect(resolved.layers[0].tileAngles).toHaveLength(4);
        expect(resolved.layers[0].tileAngles[0]).toBe(0);
    });
});