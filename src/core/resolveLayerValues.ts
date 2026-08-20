import * as d3 from 'd3';
import {GaugeLayer, GaugeScale} from '../types';
import {normalize} from '../utils/gaugeCalculations';
import {GaugeTheme} from '../types/theme.types';

export interface GenericLayer {
    id: string;
    value: number;
    valueMode?: 'absolute' | 'cumulative' | 'offset';
    baseLayerId?: string;
    offsetValue?: number;
}

export interface ResolvedLayerValueContext {
    id: string;
    rawValue: number;
    rawNormalized: number;
    effectiveStartNormalized: number;
    effectiveEndNormalized: number;
}

export function topologicalSortLayers(layers: GaugeLayer[]): GaugeLayer[] {
    const sorted: GaugeLayer[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    function visit(layer: GaugeLayer) {
        if (visited.has(layer.id)) return;
        if (visiting.has(layer.id)) throw new Error(`Cyclic dependency detected for layer ${layer.id}`);

        visiting.add(layer.id);
        if (layer.baseLayerId) {
            const baseLayer = layers.find(l => l.id === layer.baseLayerId);
            if (baseLayer) {
                visit(baseLayer);
            }
        }
        visiting.delete(layer.id);
        visited.add(layer.id);
        sorted.push(layer);
    }

    for (const layer of layers) {
        visit(layer);
    }
    return sorted;
}

export function resolveLayerValues(
    layers: GaugeLayer[],
    scaleMax: number
): Map<string, ResolvedLayerValueContext> {
    const sorted = topologicalSortLayers(layers);
    const contexts = new Map<string, ResolvedLayerValueContext>();

    for (const layer of sorted) {
        const rawNormalized = normalize(layer.value, scaleMax);
        const baseLayerContext = layer.baseLayerId ? contexts.get(layer.baseLayerId) : undefined;

        let effectiveStartNormalized = 0;
        if (layer.valueMode === 'cumulative' && baseLayerContext) {
            effectiveStartNormalized = baseLayerContext.effectiveEndNormalized;
        } else if (layer.valueMode === 'offset') {
            effectiveStartNormalized = normalize(layer.offsetValue ?? 0, scaleMax);
        }

        const effectiveEndNormalized = Math.min(1, effectiveStartNormalized + rawNormalized);

        contexts.set(layer.id, {
            id: layer.id,
            rawValue: layer.value,
            rawNormalized,
            effectiveStartNormalized,
            effectiveEndNormalized,
        });
    }

    return contexts;
}

export function createZoneColorScale(scale: GaugeScale, theme: GaugeTheme) {
    const max = scale.max;
    const yellowThreshold = scale.zones?.[1]?.upTo ?? theme.threshold.defaultYellow;
    const thresholdYellowNormalized = normalize(yellowThreshold, max);

    return d3.scaleLinear<string>()
        .domain([0, thresholdYellowNormalized, theme.scale.normalizedMax])
        .range([
            scale.zones?.[0]?.color ?? theme.colors.tileDefault,
            scale.zones?.[1]?.color ?? theme.colors.tileYellow,
            scale.zones?.[scale.zones.length - 1]?.color ?? theme.colors.tileRed,
        ]);
}
