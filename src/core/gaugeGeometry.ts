import * as d3 from 'd3';
import type {GaugeThemeGeometry} from '../types/theme.types';
import {GaugeLayer, LayerRadiusGrow} from "../types.ts";


export interface ResolvedLayerRadii {
    innerRatio: number;
    outerRatio: number;
}

export function resolveLayerRadii(layer: Pick<GaugeLayer, 'radius' | 'thickness' | 'grow'>): ResolvedLayerRadii {
    const grow: LayerRadiusGrow = layer.grow ?? 'inward'
    const {radius, thickness} = layer

    switch (grow){
        case 'inward':
            return { innerRatio: radius - thickness, outerRatio: radius}
        case 'outward':
            return { innerRatio: radius, outerRatio: radius + thickness }
        case 'center':
        return { innerRatio: radius - thickness / 2, outerRatio: radius + thickness / 2 }
    }
}

export function createAngleScale(geometry: Pick<GaugeThemeGeometry, 'startAngle' | 'endAngle'>) {
    return d3.scaleLinear<number, number>()
        .domain([0, 1])
        .range([geometry.startAngle, geometry.endAngle]);
}

export function valueToAngle(normalizedValue: number, geometry: GaugeThemeGeometry): number {
    const scale = createAngleScale(geometry);
    return Math.min(scale(normalizedValue), geometry.endAngle);
}

export function labelAngleFromNormalized(normalizedValue: number, geometry: GaugeThemeGeometry): number {
    return createAngleScale(geometry)(normalizedValue) - geometry.pointerAngleOffset;
}

export function computeTileAngleStep(geometry: GaugeThemeGeometry, segmentCount: number): number {
    if (segmentCount <= 0) {
        return 0;
    }
    return (geometry.endAngle - geometry.startAngle) / segmentCount;
}

export function buildTileAngles(geometry: GaugeThemeGeometry, segmentCount: number): number[] {
    const step = computeTileAngleStep(geometry, segmentCount);
    if (step <= 0) {
        return [];
    }
    return d3.range(geometry.startAngle, geometry.endAngle, step);
}

export function computeGaugeContentBounds(
    geometry: GaugeThemeGeometry,
    radius: number,
    tickLabelRadius: number,
    sampleSteps = 24,
): { minX: number; maxX: number; minY: number; maxY: number } {
    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;
    let initialized = false;

    const includePoint = (x: number, y: number) => {
        if (!initialized) {
            minX = maxX = x;
            minY = maxY = y;
            initialized = true;
            return;
        }
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    };

    includePoint(0, 0);

    for (let index = 0; index <= sampleSteps; index += 1) {
        const normalizedValue = index / sampleSteps;
        const labelAngle = labelAngleFromNormalized(normalizedValue, geometry);
        for (const ringRadius of [radius, tickLabelRadius]) {
            includePoint(
                Math.cos(labelAngle) * ringRadius,
                Math.sin(labelAngle) * ringRadius,
            );
        }
    }

    return {minX, maxX, minY, maxY};
}

export function resolveGeometry(
    themeGeometry: GaugeThemeGeometry,
    override?: Partial<GaugeThemeGeometry>,
): GaugeThemeGeometry {
    if (!override) {
        return themeGeometry;
    }
    return {...themeGeometry, ...override};
}