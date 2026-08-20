import type {BarOrientation, BarRect} from '../types';
import type {GaugeTheme} from '../types/theme.types';
import type {SegmentedLayerStyle} from '../core/resolveSegmentedStyle';
import {TileFillStyle} from './constants';
import {normalize} from './gaugeCalculations';
import {getTileColor} from './gaugeUtils';

export interface BarTileSegmentRenderData {
    index: number;
    fillRatio: number;
    fillColor: string;
    backgroundRect: BarRect | null;
    foregroundRect: BarRect | null;
    stroke: string;
    strokeWidth: number;
    strokeDasharray: string;
    backgroundFill: string;
}

export interface ComputeBarTileSegmentsOptions {
    layerId: string;
    tilePositions: { start: number; end: number }[];
    numberOfTiles: number;
    sumNormalized: number;
    thresholdRed: number;
    orientation: BarOrientation;
    trackInner: number;
    trackOuter: number;
    scaleFactor?: number;
    isTileHovered: boolean;
    enableOpacityEffect: boolean;
    colorScale: ((value: number) => string) | null;
    config: SegmentedLayerStyle & { cornerRadius: number };
    theme: GaugeTheme;
}

export function computeBarTileSegments(options: ComputeBarTileSegmentsOptions): BarTileSegmentRenderData[] {
    const {
        tilePositions,
        numberOfTiles,
        sumNormalized,
        thresholdRed,
        orientation,
        trackInner,
        trackOuter,
        theme,
    } = options;

    if (numberOfTiles <= 0 || tilePositions.length === 0) {
        return [];
    }

    const segments: BarTileSegmentRenderData[] = [];

    for (let index = 0; index < tilePositions.length; index += 1) {
        const {start: tileStart, end: tileEnd} = tilePositions[index];
        const tileValueRange = thresholdRed / numberOfTiles;
        const tileMinValue = index * tileValueRange;
        const tileMinValueNormalized = normalize(tileMinValue, thresholdRed);
        const tileValueRangeNormalized = normalize(tileValueRange, thresholdRed);

        const fillRatio = Math.min(
            theme.scale.normalizedMax,
            Math.max(0, (sumNormalized - tileMinValueNormalized) / tileValueRangeNormalized),
        );

        const tileLength = tileEnd - tileStart;
        const fillLength = fillRatio * tileLength;

        const backgroundInner = trackInner;
        const backgroundOuter = trackOuter;

        const foregroundInner = options.isTileHovered && options.enableOpacityEffect
            ? backgroundInner - (theme.interaction.hoverHighlight.tileThicknessOffset * (options.scaleFactor ?? 1))
            : backgroundInner;
        const foregroundOuter = options.isTileHovered && options.enableOpacityEffect
            ? backgroundOuter + (theme.interaction.hoverHighlight.tileThicknessOffset * (options.scaleFactor ?? 1))
            : backgroundOuter;

        const fillColor = getTileColor(sumNormalized, index, options.config, options.colorScale, options.layerId);
        const isOutlined = options.config.fillStyle !== TileFillStyle.FILLED;

        const backgroundRect: BarRect = orientation === 'horizontal'
            ? {
                x: tileStart,
                y: backgroundInner,
                width: tileLength,
                height: backgroundOuter - backgroundInner,
                rx: options.config.cornerRadius,
            }
            : {
                x: backgroundInner,
                y: tileStart,
                width: backgroundOuter - backgroundInner,
                height: tileLength,
                rx: options.config.cornerRadius,
            };

        const foregroundRect = fillLength > 0
            ? (orientation === 'horizontal'
                ? {
                    x: tileStart,
                    y: foregroundInner,
                    width: fillLength,
                    height: foregroundOuter - foregroundInner,
                    rx: options.config.cornerRadius,
                }
                : {
                    x: foregroundInner,
                    y: tileStart,
                    width: foregroundOuter - foregroundInner,
                    height: fillLength,
                    rx: options.config.cornerRadius,
                })
            : null;

        segments.push({
            index,
            fillRatio,
            fillColor,
            backgroundRect,
            foregroundRect,
            stroke: isOutlined ? options.config.borderColor : theme.stroke.color,
            strokeWidth: isOutlined ? options.config.borderThickness : theme.stroke.normal,
            strokeDasharray: options.config.fillStyle === TileFillStyle.DOTTED
                ? theme.arc.dottedStrokePattern
                : options.config.fillStyle === TileFillStyle.DASHED
                    ? theme.arc.dashedStrokePattern
                    : 'none',
            backgroundFill: isOutlined ? 'transparent' : options.config.colorTileBg,
        });
    }

    return segments;
}