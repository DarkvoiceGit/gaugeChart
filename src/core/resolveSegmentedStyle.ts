import {BaseLayer, GaugeScale} from '../types';
import {GaugeTheme} from '../types/theme.types';
import {GradientType, TileFillStyle} from '../utils/constants';

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

export function resolveLayerColor(layer: BaseLayer): string {
    return layer.color;
}

export function resolveSegmentedStyle(
    layer: BaseLayer,
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
