import * as d3 from 'd3';
import type {GaugeTheme} from '../types/theme.types';
import type {ArcConfig, GaugeLayer, GaugeScale} from '../types';
import {computeTileSegments, TileSegmentRenderData} from '../utils/computeTileSegment';
import type {PointerMarkerSpec} from '../components/GaugePointerMarkers';
import {buildArcPath, calculatePointer, normalize, valueToAngle} from '../utils/gaugeCalculations';
import {resolveTileCount} from '../utils/gaugeGuards';
import {GradientType, TileFillStyle} from '../utils/constants';
import {buildTileAngles, resolveLayerRadii} from "./gaugeGeometry";

export interface ResolvedPointer {
    layerId: string;
    x: number;
    y: number;
    color: string;
    scale: number;
    strokeScale: number;
}

export interface SegmentedLayerStyle {
    isTileColorGradient: boolean;
    gradientType: string;
    thresholdYellowNormalized: number;
    thresholdRedNormalized: number;
    colorTileThresholdDefault: string;
    colorTileThresholdYellow: string;
    colorTileThresholdRed: string;
    colorTileBg: string;
    fillStyle: TileFillStyle;
    borderColor: string;
    borderThickness: number;
}

export interface ResolvedLayer {
    id: string;
    render: GaugeLayer['render'];
    zIndex: number;
    hoverable: boolean;
    tooltip?: {
        enabled?: boolean;
        label?: string;
        mode?: "self" | "all" | "none";
    };
    rawValue: number;
    normalizedValue: number;
    color: string;
    startAngle: number;
    endAngle: number;
    innerRadius: number;
    outerRadius: number;
    arcConfig: ArcConfig;
    solidPath: string | null;
    hoverSolidPath: string | null;
    segments: TileSegmentRenderData[];
    tileAngles: number[];
    segmentCount: number;
    segmentedStyle: SegmentedLayerStyle;
    pointer?: ResolvedPointer;
}

export interface ResolvedGaugeLayers {
    layers: ResolvedLayer[];
    colorScale: d3.ScaleLinear<string, string>;
    tickLabels: number[];
    tileAnglesByLayerId: Record<string, number[]>;
    gradientLayerIds: string[];
    pointerMarkers: PointerMarkerSpec[];
    pointers: ResolvedPointer[];
}

interface LayerAngleContext {
    id: string;
    normalizedValue: number;
    effectiveNormalizedValue: number;
    endAngle: number;
}

function resolveLayerColor(layer: GaugeLayer): string {
    return layer.color;
}

function topologicalSortLayers(layers: GaugeLayer[]): GaugeLayer[] {
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

function resolveArcConfig(layer: GaugeLayer, theme: GaugeTheme): ArcConfig {
    const defaults = layer.render === 'segmented'
        ? {
            cornerRadius: theme.arc.defaultCornerRadius,
            padAngle: theme.arc.tilePadAngle,
            padRadius: theme.arc.tilePadRadius,
        }
        : {
            cornerRadius: theme.arc.defaultCornerRadius,
            padAngle: theme.arc.solidPadAngle,
            padRadius: theme.arc.solidPadRadius,
        };

    return {
        cornerRadius: layer.arc?.cornerRadius ?? defaults.cornerRadius,
        padAngle: layer.arc?.padAngle ?? defaults.padAngle,
        padRadius: layer.arc?.padRadius ?? defaults.padRadius,
    };
}

function resolveLayerAngles(
    normalizedValue: number,
    effectiveStartValue: number,
    geometry: GaugeTheme['geometry'],
): { startAngle: number; endAngle: number; effectiveEndValue: number } {
    const effectiveEndValue = Math.min(1, effectiveStartValue + normalizedValue);
    
    return {
        startAngle: valueToAngle(effectiveStartValue, geometry),
        endAngle: valueToAngle(effectiveEndValue, geometry),
        effectiveEndValue: effectiveEndValue
    };
}

function buildSolidPaths(
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number,
    arcConfig: ArcConfig,
    theme: GaugeTheme,
): { solidPath: string | null; hoverSolidPath: string | null } {
    const solidPath = buildArcPath({
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        ...arcConfig,
    });

    const hoverSolidPath = buildArcPath({
        innerRadius: innerRadius * theme.interaction.hoverHighlight.innerScale,
        outerRadius: outerRadius * theme.interaction.hoverHighlight.outerScale,
        startAngle,
        endAngle,
        cornerRadius: arcConfig.cornerRadius,
    });

    return {solidPath, hoverSolidPath};
}

function resolveSegmentedStyle(
    layer: GaugeLayer,
    scale: GaugeScale,
    theme: GaugeTheme,
    thresholdYellowNormalized: number,
): SegmentedLayerStyle {
    const zoneDefault = scale.zones?.[0]?.color ?? theme.colors.tileDefault;
    const zoneWarning = scale.zones?.[1]?.color ?? theme.colors.tileYellow;
    const zoneCritical = scale.zones?.[scale.zones.length - 1]?.color ?? theme.colors.tileRed;

    return {
        isTileColorGradient: layer.gradient?.enabled ?? false,
        gradientType: layer.gradient?.type ?? GradientType.TILE,
        thresholdYellowNormalized,
        thresholdRedNormalized: theme.scale.normalizedMax,
        colorTileThresholdDefault: zoneDefault,
        colorTileThresholdYellow: zoneWarning,
        colorTileThresholdRed: zoneCritical,
        colorTileBg: layer.backgroundColor ?? theme.colors.tileBg,
        fillStyle: layer.fillStyle ?? TileFillStyle.FILLED,
        borderColor: layer.borderColor ?? theme.colors.tileBorder,
        borderThickness: layer.borderThickness ?? theme.tiles.defaultBorderThickness,
    };
}

function resolvePointer(
    layer: GaugeLayer,
    normalizedValue: number,
    radius: number,
    theme: GaugeTheme,
): ResolvedPointer | undefined {
    if (!layer.pointer?.enabled) {
        return undefined;
    }

    const pointerConfig = {
        scale: layer.pointer.scale ?? theme.pointer.defaultScale,
        strokeScale: layer.pointer.strokeScale ?? theme.pointer.defaultStrokeScale,
        color: layer.pointer.color ?? layer.color,
        lengthRatio: layer.pointer.lengthRatio ?? theme.pointer.secondaryLengthRatio,
    };

    const position = calculatePointer(
        normalizedValue,
        radius,
        pointerConfig.lengthRatio * pointerConfig.scale,
        theme.geometry
    );

    return {
        layerId: layer.id,
        x: position.x,
        y: position.y,
        color: pointerConfig.color,
        scale: pointerConfig.scale,
        strokeScale: pointerConfig.strokeScale,
    };
}

function resolveLayerSegments(
    layer: GaugeLayer,
    segmentedStyle: SegmentedLayerStyle,
    arcConfig: ArcConfig,
    tileAngles: number[],
    segmentCount: number,
    normalizedValue: number,
    scaleMax: number,
    innerRadius: number,
    outerRadius: number,
    scaleFactor: number,
    colorScale: d3.ScaleLinear<string, string>,
    theme: GaugeTheme
): TileSegmentRenderData[] {
    return computeTileSegments({
            layerId: layer.id,
            tileAngles,
            numberOfTiles: segmentCount,
            sumNormalized: normalizedValue,
            thresholdRed: scaleMax,
            innerRadius,
            outerRadius,
            scaleFactor,
            isTileHovered: false,
            enableOpacityEffect: false,
            colorScale,
            config: {
                ...segmentedStyle,
                arcConfig
            },
            theme
        }
    )
}

export function resolveLayers(
    layers: GaugeLayer[],
    scale: GaugeScale,
    baseRadius: number,
    theme: GaugeTheme,
    tickStep?: number,
    scaleFactor = 1,
): ResolvedGaugeLayers {
    const max = scale.max;
    const yellowThreshold = scale.zones?.[1]?.upTo ?? theme.threshold.defaultYellow;
    const thresholdYellowNormalized = normalize(yellowThreshold, max);

    const colorScale = d3.scaleLinear<string>()
        .domain([0, thresholdYellowNormalized, theme.scale.normalizedMax])
        .range([
            scale.zones?.[0]?.color ?? theme.colors.tileDefault,
            scale.zones?.[1]?.color ?? theme.colors.tileYellow,
            scale.zones?.[scale.zones.length - 1]?.color ?? theme.colors.tileRed,
        ])

    const sortedByDependency = topologicalSortLayers(layers);

    const angleContexts = new Map<string, LayerAngleContext>();
    const resolvedLayers: ResolvedLayer[] = [];
    const tileAnglesByLayerId: Record<string, number[]> = {};
    const gradientLayerIds: string[] = [];
    const pointers: ResolvedPointer[] = [];

    for (const layer of sortedByDependency) {
        const rawNormalizedValue = normalize(layer.value, max);
        const baseLayerContext = layer.baseLayerId ? angleContexts.get(layer.baseLayerId) : undefined;

        const {innerRatio, outerRatio} = resolveLayerRadii(layer)
        const innerRadius = baseRadius * innerRatio;
        const outerRadius = baseRadius * outerRatio;
        const arcConfig = resolveArcConfig(layer, theme);
        const segmentCount = layer.render === 'segmented'
            ? resolveTileCount(layer.segments, theme.tiles.minCount)
            : 0;

        let effectiveStartValueNormalized = 0;
        if (layer.valueMode === 'cumulative' && baseLayerContext) {
            effectiveStartValueNormalized = baseLayerContext.effectiveNormalizedValue;
        } else if (layer.valueMode === 'offset') {
            effectiveStartValueNormalized = normalize(layer.offsetValue ?? 0, max);
        }

        const {startAngle, endAngle, effectiveEndValue} = resolveLayerAngles(rawNormalizedValue, effectiveStartValueNormalized, theme.geometry);

        angleContexts.set(layer.id, {
            id: layer.id,
            normalizedValue: rawNormalizedValue,
            effectiveNormalizedValue: effectiveEndValue,
            endAngle: endAngle,
        });

        const tileAngles = layer.render === 'segmented'
            ? buildTileAngles(theme.geometry, segmentCount)
            : [];

        if (layer.render === 'segmented') {
            tileAnglesByLayerId[layer.id] = tileAngles;
            if (layer.gradient?.enabled && layer.gradient.type !== GradientType.FULL) {
                gradientLayerIds.push(layer.id);
            }
        }

        const solidPaths = layer.render === 'solid'
            ? buildSolidPaths(innerRadius, outerRadius, startAngle, endAngle, arcConfig, theme)
            : {solidPath: null, hoverSolidPath: null};

        const segmentedStyle = resolveSegmentedStyle(layer, scale, theme, thresholdYellowNormalized);
        const segments = layer.render === 'segmented' ? resolveLayerSegments(
            layer,
            segmentedStyle,
            arcConfig,
            tileAngles,
            segmentCount,
            rawNormalizedValue,
            max,
            innerRadius,
            outerRadius,
            scaleFactor,
            colorScale,
            theme
        ) : []

        const pointer = resolvePointer(layer, effectiveEndValue, baseRadius, theme);
        if (pointer) {
            pointers.push(pointer);
        }

        resolvedLayers.push({
            id: layer.id,
            render: layer.render,
            zIndex: layer.zIndex ?? 0,
            hoverable: layer.hoverable ?? false,
            tooltip: layer.tooltip ? {
                enabled: layer.tooltip.enabled,
                label: layer.tooltip.label,
                mode: layer.tooltip.mode,
            } : undefined,
            rawValue: layer.value,
            normalizedValue: rawNormalizedValue,
            color: resolveLayerColor(layer),
            startAngle,
            endAngle,
            innerRadius,
            outerRadius,
            arcConfig,
            solidPath: solidPaths.solidPath,
            hoverSolidPath: solidPaths.hoverSolidPath,
            segments,
            tileAngles,
            segmentCount,
            segmentedStyle,
            pointer,
        });
    }

    resolvedLayers.sort((a, b) => a.zIndex - b.zIndex);

    const referenceLayer = resolvedLayers.find((layer) => layer.render === 'segmented');
    const defaultStep = referenceLayer?.segmentCount
        ? max / referenceLayer.segmentCount
        : max / theme.tiles.defaultCount;
    const resolvedTickStep = tickStep ?? defaultStep;

    return {
        layers: resolvedLayers,
        colorScale,
        tickLabels: d3.range(0, max + theme.ticks.rangeUpperBoundOffset, resolvedTickStep),
        tileAnglesByLayerId,
        gradientLayerIds,
        pointerMarkers: pointers.map((pointer) => ({
            id: pointer.layerId,
            color: pointer.color,
            scale: pointer.scale,
        })),
        pointers,
    };
}