import * as d3 from 'd3';
import type {BarConfig, BarLayer, BarOrientation, BarRect, GaugeScale} from '../types';
import type {GaugeTheme} from '../types/theme.types';
import {GradientType} from '../utils/constants';
import {normalize} from '../utils/gaugeCalculations';
import {resolveTileCount} from '../utils/gaugeGuards';
import {computeTickLabelValues} from '../utils/computeTickLabelValues';
import {resolveBarTrackBounds} from '../utils/barGuards';
import type {BarLayout} from '../utils/computeBarLayout';
import {
    type BarTileSegmentRenderData,
    computeBarTileSegments,
} from '../utils/computeBarTileSegments';
import {buildTilePositions, createValueScale, mapBarFillRect} from './barGeometry';
import {
    createZoneColorScale,
    resolveLayerValues,
    topologicalSortLayers,
} from './resolveLayerValues';
import type {ResolvedInteractiveLayer} from './resolvedLayerBase';
import {
    resolveLayerColor,
    resolveSegmentedStyle,
    type SegmentedLayerStyle,
} from './resolveSegmentedStyle';

export interface ResolvedBarLayer extends ResolvedInteractiveLayer {
    render: BarLayer['render'];
    zIndex: number;
    orientation: BarOrientation;
    trackInner: number;
    trackOuter: number;
    fillStart: number;
    fillEnd: number;
    barConfig: Required<BarConfig>;
    solidRect: BarRect | null;
    hoverSolidRect: BarRect | null;
    segments: BarTileSegmentRenderData[];
    tilePositions: { start: number; end: number }[];
    segmentCount: number;
    segmentedStyle: SegmentedLayerStyle;
}

export interface ResolvedBarChartLayers {
    layers: ResolvedBarLayer[];
    colorScale: d3.ScaleLinear<string, string>;
    tickLabels: number[];
    gradientLayerIds: string[];
}

function resolveBarConfig(layer: BarLayer, theme: GaugeTheme, render: BarLayer['render']): Required<BarConfig> {
    return {
        cornerRadius: layer.bar?.cornerRadius ?? theme.bar.cornerRadius,
        gap: layer.bar?.gap ?? (render === 'segmented' ? theme.bar.tileGap : theme.bar.solidGap),
        pad: layer.bar?.pad ?? theme.bar.tilePad,
    };
}

function buildHoverSolidRect(
    solidRect: BarRect,
    orientation: BarOrientation,
    theme: GaugeTheme,
): BarRect {
    const offset = theme.interaction.hoverHighlight.barThicknessOffset;
    const halfOffset = offset / 2;

    if (orientation === 'horizontal') {
        return {
            ...solidRect,
            y: solidRect.y - halfOffset,
            height: solidRect.height + offset,
        };
    }

    return {
        ...solidRect,
        x: solidRect.x - halfOffset,
        width: solidRect.width + offset,
    };
}

function buildFillRect(
    fillStart: number,
    fillEnd: number,
    trackInner: number,
    trackOuter: number,
    orientation: BarOrientation,
    cornerRadius: number,
): BarRect {
    return mapBarFillRect(fillStart, fillEnd, trackInner, trackOuter, orientation, cornerRadius);
}

function buildHitAreaRect(
    trackInner: number,
    trackOuter: number,
    trackLength: number,
    orientation: BarOrientation,
): BarRect {
    if (orientation === 'horizontal') {
        return {
            x: 0,
            y: trackInner,
            width: trackLength,
            height: trackOuter - trackInner,
        };
    }

    return {
        x: trackInner,
        y: 0,
        width: trackOuter - trackInner,
        height: trackLength,
    };
}

export function resolveBarLayers(
    layers: BarLayer[],
    scale: GaugeScale,
    layout: BarLayout,
    theme: GaugeTheme,
    orientation: BarOrientation,
    tickStep?: number,
    hideCrowdedEndTick?: boolean | number,
    scaleFactor = 1,
): ResolvedBarChartLayers {
    const max = scale.max;
    const scaleMin = scale.min ?? 0;
    const yellowThreshold = scale.zones?.[1]?.upTo ?? theme.threshold.defaultYellow;
    const thresholdYellowNormalized = normalize(yellowThreshold, max);
    const colorScale = createZoneColorScale(scale, theme);
    const valueScale = createValueScale({
        min: scaleMin,
        max,
        trackLength: layout.trackLength,
        orientation,
        padding: 0,
    });

    const resolvedValues = resolveLayerValues(layers, max);
    const sortedLayers = topologicalSortLayers(layers) as BarLayer[];
    const resolvedLayers: ResolvedBarLayer[] = [];
    const gradientLayerIds: string[] = [];

    for (const layer of sortedLayers) {
        const resolvedValue = resolvedValues.get(layer.id)!;
        const trackBounds = resolveBarTrackBounds(layer);
        const trackInner = layout.crossAxisOffset + trackBounds.innerRatio * layout.crossAxisLength;
        const trackOuter = layout.crossAxisOffset + trackBounds.outerRatio * layout.crossAxisLength;
        const barConfig = resolveBarConfig(layer, theme, layer.render);
        const segmentedStyle = resolveSegmentedStyle(layer, scale, theme, thresholdYellowNormalized);

        const startValue = scaleMin + resolvedValue.effectiveStartNormalized * (max - scaleMin);
        const endValue = scaleMin + resolvedValue.effectiveEndNormalized * (max - scaleMin);
        const fillStart = valueScale(startValue);
        const fillEnd = valueScale(endValue);

        const solidRect = layer.render === 'solid'
            ? buildFillRect(fillStart, fillEnd, trackInner, trackOuter, orientation, barConfig.cornerRadius)
            : null;

        const hoverSolidRect = solidRect && layer.hoverable
            ? buildHoverSolidRect(solidRect, orientation, theme)
            : null;

        const segmentCount = layer.render === 'segmented'
            ? resolveTileCount(layer.segments, theme.tiles.minCount)
            : 0;

        const tilePositions = layer.render === 'segmented'
            ? buildTilePositions(segmentCount, layout.trackLength, barConfig.gap, barConfig.pad, orientation)
            : [];

        if (layer.render === 'segmented' && layer.gradient?.enabled && layer.gradient.type !== GradientType.FULL) {
            gradientLayerIds.push(layer.id);
        }

        const segments = layer.render === 'segmented'
            ? computeBarTileSegments({
                layerId: layer.id,
                tilePositions,
                numberOfTiles: segmentCount,
                sumNormalized: resolvedValue.rawNormalized,
                thresholdRed: max,
                orientation,
                trackInner,
                trackOuter,
                scaleFactor,
                isTileHovered: false,
                enableOpacityEffect: false,
                colorScale,
                config: {
                    ...segmentedStyle,
                    cornerRadius: barConfig.cornerRadius,
                },
                theme,
            })
            : [];

        resolvedLayers.push({
            id: layer.id,
            render: layer.render,
            zIndex: layer.zIndex ?? 0,
            hoverable: layer.hoverable ?? false,
            tooltip: layer.tooltip ? {
                enabled: layer.tooltip.enabled,
                label: layer.tooltip.label,
                mode: layer.tooltip.mode,
                color: layer.tooltip.color,
            } : undefined,
            rawValue: layer.value,
            normalizedValue: resolvedValue.rawNormalized,
            color: resolveLayerColor(layer),
            orientation,
            trackInner,
            trackOuter,
            fillStart,
            fillEnd,
            barConfig,
            solidRect,
            hoverSolidRect,
            segments,
            tilePositions,
            segmentCount,
            segmentedStyle,
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
        tickLabels: computeTickLabelValues(scaleMin, max, resolvedTickStep, {hideCrowdedEndTick}),
        gradientLayerIds,
    };
}

export function getBarLayerHitArea(layer: ResolvedBarLayer, trackLength: number): BarRect {
    return buildHitAreaRect(layer.trackInner, layer.trackOuter, trackLength, layer.orientation);
}

export function buildBarGradientLayers(
    layers: ResolvedBarLayer[], gradientLayerIds: string[]): Array<Pick<ResolvedBarLayer, 'id' | 'segmentCount' | 'tilePositions' | 'orientation'>> {
    return layers.filter((layer) => gradientLayerIds.includes(layer.id))
        .map((layer) => ({
            id: layer.id,
            segmentCount: layer.segmentCount,
            tilePositions: layer.tilePositions,
            orientation: layer.orientation,
        }));
}
