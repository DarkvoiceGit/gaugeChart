import {describe, it, expect} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import {createRef, type MouseEvent as ReactMouseEvent} from 'react';
import {useGaugeInteraction} from '../../hooks/useGaugeInteraction';
import {DEFAULT_THEME} from '../../theme/defaultTheme';
import type {ResolvedLayer} from '../../core/resolveLayers';
import {TileFillStyle} from '../../utils/constants';

function createLayer(id: string, overrides: Partial<ResolvedLayer> = {}): ResolvedLayer {
    return {
        id,
        render: 'solid',
        zIndex: 0,
        hoverable: true,
        tooltip: {label: id},
        rawValue: 10,
        normalizedValue: 0.5,
        color: '#000',
        startAngle: 0,
        endAngle: 1,
        innerRadius: 100,
        outerRadius: 120,
        arcConfig: {padAngle: 0, padRadius: 0, cornerRadius: 0},
        solidPath: 'M0 0',
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

describe('useGaugeInteraction', () => {
    const layers = [
        createLayer('primary'),
        createLayer('secondary', {rawValue: 20, color: '#aaa'}),
    ];

    it('tracks hovered layer and builds tooltip on enter', () => {
        const svgRef = createRef<SVGSVGElement>();
        const {result} = renderHook(() => useGaugeInteraction({
            svgRef,
            layers,
            tooltipMode: 'layer',
            tooltipsEnabled: true,
            hoverDimming: true,
            interaction: DEFAULT_THEME.interaction,
        }));

        const event = {
            clientX: 100,
            clientY: 200,
        } as ReactMouseEvent;

        act(() => {
            result.current.getLayerHandlers('primary').onMouseEnter(event);
        });

        expect(result.current.hoveredLayerId).toBe('primary');
        expect(result.current.tooltip?.text).toHaveLength(1);
        expect(result.current.tooltip?.text[0].label).toBe('primary:');
    });

    it('clears state on mouse leave', () => {
        const svgRef = createRef<SVGSVGElement>();
        const {result} = renderHook(() => useGaugeInteraction({
            svgRef,
            layers,
            tooltipMode: 'layer',
            tooltipsEnabled: true,
            hoverDimming: true,
            interaction: DEFAULT_THEME.interaction,
        }));

        act(() => {
            result.current.getLayerHandlers('primary').onMouseEnter({
                clientX: 0,
                clientY: 0,
            } as ReactMouseEvent);
        });

        act(() => {
            result.current.getLayerHandlers('primary').onMouseLeave();
        });

        expect(result.current.hoveredLayerId).toBeNull();
        expect(result.current.tooltip).toBeNull();
    });

    it('dims non-hovered layers via getLayerOpacity', () => {
        const svgRef = createRef<SVGSVGElement>();
        const {result} = renderHook(() => useGaugeInteraction({
            svgRef,
            layers,
            tooltipMode: 'layer',
            tooltipsEnabled: false,
            hoverDimming: true,
            interaction: DEFAULT_THEME.interaction,
        }));

        act(() => {
            result.current.getLayerHandlers('primary').onMouseEnter({
                clientX: 0,
                clientY: 0,
            } as ReactMouseEvent);
        });

        expect(result.current.getLayerOpacity('primary')).toBe(DEFAULT_THEME.interaction.activeOpacity);
        expect(result.current.getLayerOpacity('secondary')).toBe(DEFAULT_THEME.interaction.dimedOpacity);
        expect(result.current.tooltip).toBeNull();
    });

    it('shows all hoverable layers when tooltipMode is all', () => {
        const svgRef = createRef<SVGSVGElement>();
        const {result} = renderHook(() => useGaugeInteraction({
            svgRef,
            layers,
            tooltipMode: 'all',
            tooltipsEnabled: true,
            hoverDimming: true,
            interaction: DEFAULT_THEME.interaction,
        }));

        act(() => {
            result.current.getLayerHandlers('primary').onMouseEnter({
                clientX: 0,
                clientY: 0,
            } as ReactMouseEvent);
        });

        expect(result.current.tooltip?.text).toHaveLength(2);
    });
});