import * as d3 from 'd3';
import type {GaugeTheme} from '../types/theme.types';
import type {ArcConfig, GaugeLayer, GaugeScale} from '../types';
import type {TileSegmentRenderData} from '../utils/computeTileSegment';
import type {PointerMarkerSpec} from '../components/GaugePointerMarkers';
import {buildArcPath, calculatePointer, normalize, valueToAngle} from '../utils/gaugeCalculations';
import {resolveTileCount} from '../utils/gaugeGuards';
import {GradientType, TileFillStyle} from '../utils/constants';
import {buildTileAngles} from "./gaugeGeometry.ts";

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
    tooltipLabel?: string;
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
    endAngle: number;
}

function resolveLayerColor(layer: GaugeLayer): string {
    return layer.color;
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
    layer: GaugeLayer,
    normalizedValue: number,
    scaleMax: number,
    geometry: GaugeTheme['geometry'],
    baseLayer?: LayerAngleContext,
): { startAngle: number; endAngle: number } {
    const valueMode = layer.valueMode ?? 'absolute';
    const startBase = geometry.startAngle + geometry.angleOffset;

    if (valueMode === 'offset') {
        const offsetNormalized = normalize(layer.offsetValue ?? 0, scaleMax);
        return {
            startAngle: valueToAngle(offsetNormalized, geometry),
            endAngle: valueToAngle(Math.min(1, offsetNormalized + normalizedValue), geometry),
        };
    }

    if (valueMode === 'cumulative' && baseLayer) {
        return {
            startAngle: baseLayer.endAngle,
            endAngle: valueToAngle(Math.min(1, baseLayer.normalizedValue + normalizedValue)),
        };
    }

    return {
        startAngle: startBase,
        endAngle: valueToAngle(normalizedValue, geometry),
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

export function resolveLayers(
    layers: GaugeLayer[],
    scale: GaugeScale,
    baseRadius: number,
    theme: GaugeTheme,
    tickStep?: number,
): ResolvedGaugeLayers {
    const max = scale.max;
    const yellowThreshold = scale.zones?.[1]?.upTo ?? theme.threshold.defaultYellow;
    const thresholdYellowNormalized = normalize(yellowThreshold, max);

    const sortedLayers = [...layers].sort(
        (left, right) => (left.zIndex ?? 0) - (right.zIndex ?? 0),
    );

    const angleContexts = new Map<string, LayerAngleContext>();
    const resolvedLayers: ResolvedLayer[] = [];
    const tileAnglesByLayerId: Record<string, number[]> = {};
    const gradientLayerIds: string[] = [];
    const pointers: ResolvedPointer[] = [];

    for (const layer of sortedLayers) {
        const normalizedValue = normalize(layer.value, max);
        const baseLayer = layer.baseLayerId ? angleContexts.get(layer.baseLayerId) : undefined;
        const angles = resolveLayerAngles(layer, normalizedValue, max, theme.geometry, baseLayer);
        const innerRadius = baseRadius * layer.innerRadius;
        const outerRadius = baseRadius * layer.outerRadius;
        const arcConfig = resolveArcConfig(layer, theme);
        const segmentCount = layer.render === 'segmented'
            ? resolveTileCount(layer.segments, theme.tiles.minCount)
            : 0;

        angleContexts.set(layer.id, {
            id: layer.id,
            normalizedValue,
            endAngle: angles.endAngle,
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
            ? buildSolidPaths(innerRadius, outerRadius, angles.startAngle, angles.endAngle, arcConfig, theme)
            : {solidPath: null, hoverSolidPath: null};

        const segmentedStyle = resolveSegmentedStyle(layer, scale, theme, thresholdYellowNormalized);

        const pointer = resolvePointer(layer, normalizedValue, baseRadius, theme);
        if (pointer) {
            pointers.push(pointer);
        }

        resolvedLayers.push({
            id: layer.id,
            render: layer.render,
            zIndex: layer.zIndex ?? 0,
            hoverable: layer.hoverable ?? false,
            tooltipLabel: layer.tooltip?.label,
            rawValue: layer.value,
            normalizedValue,
            color: resolveLayerColor(layer),
            startAngle: angles.startAngle,
            endAngle: angles.endAngle,
            innerRadius,
            outerRadius,
            arcConfig,
            solidPath: solidPaths.solidPath,
            hoverSolidPath: solidPaths.hoverSolidPath,
            segments: [],
            tileAngles,
            segmentCount,
            segmentedStyle,
            pointer,
        });
    }

    const colorScale = d3.scaleLinear<string>()
        .domain([0, thresholdYellowNormalized, theme.scale.normalizedMax])
        .range([
            scale.zones?.[0]?.color ?? theme.colors.tileDefault,
            scale.zones?.[1]?.color ?? theme.colors.tileYellow,
            scale.zones?.[scale.zones.length - 1]?.color ?? theme.colors.tileRed,
        ]);

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