import * as d3 from 'd3';
import type {GaugeTheme} from '../types/theme.types';
import type {GaugeLayout} from './computeGaugeLayout';
import type {PointerMarkerSpec} from '../components/GaugePointerMarkers.tsx';
import type {ResolvedGaugeConfig} from './resolveGaugeConfig';
import {calculatePointer, normalize} from './gaugeCalculations';

export interface GaugeNormalizedValues {
    primary: number;
    secondary: number;
    sum: number;
    thresholdYellow: number;
    thresholdRed: number;
}

export interface GaugePointerPositions {
    primary: { x: number; y: number; angle: number };
    secondary: { x: number; y: number; angle: number };
}

export interface GaugeDerivedData {
    normalized: GaugeNormalizedValues;
    tileAngles: number[];
    tickLabels: number[];
    colorScale: d3.ScaleLinear<string, string>;
    pointers: GaugePointerPositions;
    showPrimaryPointer: boolean;
    pointerMarkers: PointerMarkerSpec[];
}

export function computeNormalizedValues(
    primaryValue: number,
    secondaryValue: number,
    thresholdRed: number,
    thresholdYellow: number,
    normalizedMax: number,
): GaugeNormalizedValues {
    return {
        primary: normalize(primaryValue, thresholdRed),
        secondary: normalize(secondaryValue, thresholdRed),
        sum: normalize(primaryValue + secondaryValue, thresholdRed),
        thresholdYellow: normalize(thresholdYellow, thresholdRed),
        thresholdRed: normalizedMax,
    };
}

export function computeTileAngles(
    numTiles: number,
    startAngle: number,
    endAngle: number,
): number[] {
    return d3.range(startAngle, endAngle, Math.PI / numTiles);
}

export function computeTickLabelValues(
    thresholdRed: number,
    tickEveryNThStep: number,
    numTiles: number,
    rangeUpperBoundOffset: number,
): number[] {
    const step = tickEveryNThStep === 0 ? thresholdRed / numTiles : tickEveryNThStep;
    return d3.range(0, thresholdRed + rangeUpperBoundOffset, step);
}

export function buildPointerMarkers(
    showPrimaryPointer: boolean,
    primaryColor: string,
    primaryScale: number,
    secondaryColor: string,
    secondaryScale: number,
): PointerMarkerSpec[] {
    const secondaryMarker: PointerMarkerSpec = {
        id: 'secondary',
        color: secondaryColor,
        scale: secondaryScale,
    };

    if (!showPrimaryPointer) {
        return [secondaryMarker];
    }

    return [
        {id: 'primary', color: primaryColor, scale: primaryScale},
        secondaryMarker,
    ];
}

export function resolvePointerStrokeScale(
    scaleFactor: number,
    strokeScale: number,
    referenceScaleFactor: number,
): number {
    if (scaleFactor === referenceScaleFactor || strokeScale !== referenceScaleFactor) {
        return strokeScale;
    }
    return strokeScale * scaleFactor;
}

export function computeGaugeDerivedData(
    config: ResolvedGaugeConfig,
    layout: GaugeLayout,
    theme: GaugeTheme,
): GaugeDerivedData {
    const normalized = computeNormalizedValues(
        config.primaryValue,
        config.secondaryValue,
        config.thresholdRed,
        config.thresholdYellow,
        theme.scale.normalizedMax,
    );

    const colorScale = d3.scaleLinear<string>()
        .domain([0, normalized.thresholdYellow, normalized.thresholdRed])
        .range([
            config.tile.colorTileThresholdDefault,
            config.tile.colorTileThresholdYellow,
            config.tile.colorTileThresholdRed,
        ]);

    const showPrimaryPointer = normalized.secondary !== 0
        && normalized.primary !== normalized.sum
        && config.enableInnerArc;

    return {
        normalized,
        tileAngles: computeTileAngles(
            config.numTiles,
            theme.geometry.startAngle,
            theme.geometry.endAngle,
        ),
        tickLabels: computeTickLabelValues(
            config.thresholdRed,
            config.tile.tickEveryNThStep,
            config.numTiles,
            theme.ticks.rangeUpperBoundOffset,
        ),
        colorScale,
        pointers: {
            primary: calculatePointer(
                normalized.primary,
                layout.radius,
                theme.pointer.primaryLengthRatio * config.primary.pointerPrimaryConfig.scale,
                theme.geometry.pointerAngleOffset,
            ),
            secondary: calculatePointer(
                normalized.sum,
                layout.radius,
                theme.pointer.secondaryLengthRatio * config.secondary.pointerSumConfig.scale,
                theme.geometry.pointerAngleOffset,
            ),
        },
        showPrimaryPointer,
        pointerMarkers: buildPointerMarkers(
            showPrimaryPointer,
            config.primary.pointerPrimaryConfig.color,
            config.primary.pointerPrimaryConfig.scale,
            config.secondary.pointerSumConfig.color,
            config.secondary.pointerSumConfig.scale,
        ),
    };
}