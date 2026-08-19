import type {GaugeTheme} from '../types/theme.types';
import {TileFillStyle} from './constants';
import {buildArcPath, normalize} from './gaugeCalculations';
import {getTileColor} from './gaugeUtils';

export interface TileSegmentRenderData {
    index: number;
    fillRatio: number;
    fillColor: string;
    backgroundPath: string | null;
    foregroundPath: string | null;
    stroke: string;
    strokeWidth: number;
    strokeDasharray: string;
    backgroundFill: string;
}

export interface ComputeTileSegmentsOptions {
    layerId: string;
    tileAngles: number[];
    numberOfTiles: number;
    sumNormalized: number;
    thresholdRed: number;
    radius: number;
    scaleFactor: number;
    isTileHovered: boolean;
    enableOpacityEffect: boolean;
    colorScale: ((value: number) => string) | null;
    config: {
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
        arcConfig: {
            cornerRadius: number;
            padAngle: number;
            padRadius: number;
        };
    };
    theme: GaugeTheme;
}

export function computeTileSegments(options: ComputeTileSegmentsOptions): TileSegmentRenderData[] {
    const {tileAngles, numberOfTiles, sumNormalized, thresholdRed, radius, theme} = options;
    const segments: TileSegmentRenderData[] = [];

    for (let index = 0; index < tileAngles.length; index += 1) {
        const tileStartAngle = tileAngles[index];
        const tileEndAngle = tileStartAngle + (Math.PI / numberOfTiles);
        const tileValueRange = thresholdRed / numberOfTiles;
        const tileMinValue = index * tileValueRange;
        const tileMinValueNormalized = normalize(tileMinValue, thresholdRed);
        const tileValueRangeNormalized = normalize(tileValueRange, thresholdRed);

        const fillRatio = Math.min(
            theme.scale.normalizedMax,
            Math.max(0, (sumNormalized - tileMinValueNormalized) / tileValueRangeNormalized),
        );
        const tileFillEndAngle = tileStartAngle + fillRatio * (tileEndAngle - tileStartAngle);

        const backgroundInnerRadius = radius * theme.radius.outerArc;
        const backgroundOuterRadius = radius;

        const foregroundInnerRadius = options.isTileHovered && options.enableOpacityEffect
            ? backgroundInnerRadius - (theme.interaction.hoverHighlight.tileInnerOffset * options.scaleFactor)
            : backgroundInnerRadius;
        const foregroundOuterRadius = options.isTileHovered && options.enableOpacityEffect
            ? radius + (theme.interaction.hoverHighlight.tileOuterOffset * options.scaleFactor)
            : radius;

        const arcParams = {
            padRadius: options.config.arcConfig.padRadius,
            padAngle: options.config.arcConfig.padAngle,
            cornerRadius: options.config.arcConfig.cornerRadius,
        };

        const fillColor = getTileColor(sumNormalized, index, options.config, options.colorScale, options.layerId);
        const isOutlined = options.config.fillStyle !== TileFillStyle.FILLED;

        segments.push({
            index,
            fillRatio,
            fillColor,
            backgroundPath: buildArcPath({
                innerRadius: backgroundInnerRadius,
                outerRadius: backgroundOuterRadius,
                startAngle: tileStartAngle,
                endAngle: tileEndAngle,
                ...arcParams,
            }),
            foregroundPath: fillRatio > 0
                ? buildArcPath({
                    innerRadius: foregroundInnerRadius,
                    outerRadius: foregroundOuterRadius,
                    startAngle: tileStartAngle,
                    endAngle: tileFillEndAngle,
                    ...arcParams,
                })
                : null,
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