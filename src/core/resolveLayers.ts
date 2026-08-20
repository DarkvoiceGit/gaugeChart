import * as d3 from 'd3';
import type {GaugeTheme} from '../types/theme.types';
import type {ArcConfig, GaugeLayer, GaugeScale} from '../types';
import {computeTileSegments, TileSegmentRenderData} from '../utils/computeTileSegment';
import type {PointerMarkerSpec} from '../components/GaugePointerMarkers';
import {buildArcPath, calculatePointer, normalize, valueToAngle} from '../utils/gaugeCalculations';
import {resolveTileCount} from '../utils/gaugeGuards';
import {GradientType} from '../utils/constants';
import {buildTileAngles, resolveLayerRadii} from "./gaugeGeometry";
import {computeTickLabelValues} from "../utils/computeTickLabelValues";
import {resolveLayerValues, topologicalSortLayers} from './resolveLayerValues';
import {resolveSegmentedStyle, resolveLayerColor} from './resolveSegmentedStyle';
import type { SegmentedLayerStyle } from './resolveSegmentedStyle';

export type { SegmentedLayerStyle } from './resolveSegmentedStyle';

export interface ResolvedPointer {
    layerId: string;
    x: number;
    y: number;
    color: string;
    scale: number;
    strokeScale: number;
    style: 'arrow' | 'needle'
}

import {ResolvedInteractiveLayer} from './resolvedLayerBase';
// (Removed SegmentedLayerStyle interface)

export interface ResolvedLayer extends ResolvedInteractiveLayer {
    render: GaugeLayer['render'];
    zIndex: number;
    // id, rawValue, normalizedValue, color, hoverable, tooltip are inherited
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

// (Removed LayerAngleContext)

// (Removed local topologicalSortLayers, resolveLayerColor, resolveSegmentedStyle)

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

// (Removed resolveSegmentedStyle)

function resolvePointer(
    layer: GaugeLayer,
    normalizedValue: number,
    radius: number,
    theme: GaugeTheme,
): ResolvedPointer | undefined {
    if (!layer.pointer?.enabled) {
        return undefined;
    }

    const style : ResolvedPointer['style'] = layer.pointer.style === 'needle' ? 'needle' : 'arrow';

    const pointerConfig = {
        scale: layer.pointer.scale ?? theme.pointer.defaultScale,
        strokeScale: layer.pointer.strokeScale ?? theme.pointer.defaultStrokeScale,
        color: layer.pointer.color ?? layer.color,
        lengthRatio: layer.pointer.lengthRatio ?? theme.pointer.secondaryLengthRatio,
        style
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
        style: pointerConfig.style,
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
    hideCrowdedEndTick?: boolean | number,
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
        ]);

    const sortedByDependency = topologicalSortLayers(layers);
    const valueContexts = resolveLayerValues(layers, max);

    const resolvedLayers: ResolvedLayer[] = [];
    const tileAnglesByLayerId: Record<string, number[]> = {};
    const gradientLayerIds: string[] = [];
    const pointers: ResolvedPointer[] = [];

    for (const layer of sortedByDependency) {
        const gaugeLayer = layer as GaugeLayer;
        const context = valueContexts.get(layer.id)!;
        const rawNormalizedValue = context.rawNormalized;
        
        const {innerRatio, outerRatio} = resolveLayerRadii(gaugeLayer)
        const innerRadius = baseRadius * innerRatio;
        const outerRadius = baseRadius * outerRatio;
        const arcConfig = resolveArcConfig(gaugeLayer, theme);
        const segmentCount = gaugeLayer.render === 'segmented'
            ? resolveTileCount(gaugeLayer.segments, theme.tiles.minCount)
            : 0;

        const {startAngle, endAngle, effectiveEndValue} = resolveLayerAngles(rawNormalizedValue, context.effectiveStartNormalized, theme.geometry);

        const tileAngles = gaugeLayer.render === 'segmented'
            ? buildTileAngles(theme.geometry, segmentCount)
            : [];

        if (gaugeLayer.render === 'segmented') {
            tileAnglesByLayerId[gaugeLayer.id] = tileAngles;
            if (gaugeLayer.gradient?.enabled && gaugeLayer.gradient.type !== GradientType.FULL) {
                gradientLayerIds.push(gaugeLayer.id);
            }
        }

        const solidPaths = gaugeLayer.render === 'solid'
            ? buildSolidPaths(innerRadius, outerRadius, startAngle, endAngle, arcConfig, theme)
            : {solidPath: null, hoverSolidPath: null};

        const segmentedStyle = resolveSegmentedStyle(gaugeLayer, scale, theme, thresholdYellowNormalized);
        const segments = gaugeLayer.render === 'segmented' ? resolveLayerSegments(
            gaugeLayer,
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

        const pointer = resolvePointer(gaugeLayer, effectiveEndValue, baseRadius, theme);
        if (pointer) {
            pointers.push(pointer);
        }

        resolvedLayers.push({
            id: gaugeLayer.id,
            render: gaugeLayer.render,
            zIndex: gaugeLayer.zIndex ?? 0,
            hoverable: gaugeLayer.hoverable ?? false,
            tooltip: gaugeLayer.tooltip ? {
                enabled: gaugeLayer.tooltip.enabled,
                label: gaugeLayer.tooltip.label,
                mode: gaugeLayer.tooltip.mode,
                color: gaugeLayer.tooltip.color
            } : undefined,
            rawValue: gaugeLayer.value,
            normalizedValue: rawNormalizedValue,
            color: resolveLayerColor(gaugeLayer),
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
    const scaleMin = scale.min ?? 0

    return {
        layers: resolvedLayers,
        colorScale,
        tickLabels: computeTickLabelValues(scaleMin, max, resolvedTickStep, {hideCrowdedEndTick}),
        tileAnglesByLayerId,
        gradientLayerIds,
        pointerMarkers: pointers.filter((pointer) => pointer.style === 'arrow').map((pointer)=>({
            id: pointer.layerId,
            color: pointer.color,
            scale: pointer.scale,
        })),
        pointers,
    };
}