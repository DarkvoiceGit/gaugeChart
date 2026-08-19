import type {GaugeProps} from '../types';
import type {GaugeTheme} from '../types/theme.types';
import {
    OPTIONS_DEFAULTS,
    PRIMARY_ARC_DEFAULTS,
    SECONDARY_ARC_DEFAULTS,
    TILE_ARC_DEFAULTS,
    TileFillStyle,
} from './constants';
import {assertPositiveThreshold, assertValidThresholdPair, resolveTileCount, toFiniteNumber} from './gaugeGuards';

export interface ResolvedGaugeConfig {
    withOpacitySwitch: boolean;
    enableInnerArc: boolean;
    circleScale: number;
    thresholdRed: number;
    thresholdYellow: number;
    enableToolTip: boolean;
    enableUnitTicks: boolean;
    tickLabelColor: string;
    tickColor: string;
    fontColor: string;
    tickFontSize: string;
    tickRadiusScale: number | undefined;
    tooltipBgColor: { r: number; g: number; b: number; a: number };
    numTiles: number;
    tile: {
        colorTileThresholdYellow: string;
        colorTileThresholdRed: string;
        colorTileThresholdDefault: string;
        isTileColorGradient: boolean;
        gradientType: string;
        colorTileBg: string;
        fillStyle: TileFillStyle;
        borderColor: string;
        borderThickness: number;
        tickEveryNThStep: number;
        arcConfig: { cornerRadius: number; padAngle: number; padRadius: number };
        toolTipLabel: string;
    };
    secondary: {
        arcConfig: { cornerRadius: number; padAngle: number; padRadius: number };
        pointerSumConfig: { scale: number; strokeScale: number; color: string };
        colorSecondaryBar: string;
        toolTipLabel: string;
    };
    primary: {
        arcConfig: { cornerRadius: number; padAngle: number; padRadius: number };
        pointerPrimaryConfig: { scale: number; strokeScale: number; color: string };
        colorPrimaryBar: string;
        toolTipLabel: string;
    };
    primaryValue: number;
    secondaryValue: number;
    sumValue: number;
}

export function resolveGaugeConfig(props: GaugeProps, theme: GaugeTheme): ResolvedGaugeConfig {
    const options = {...OPTIONS_DEFAULTS, ...props.options};
    const tileArc = {...TILE_ARC_DEFAULTS, ...props.tileArc};
    const secondaryArcConfig = {...SECONDARY_ARC_DEFAULTS, ...props.secondaryArcConfig};
    const primaryArcConfig = {...PRIMARY_ARC_DEFAULTS, ...props.primaryArcConfig};

    const thresholdRed = assertPositiveThreshold(options.thresholdRed ?? theme.threshold.defaultRed);
    const thresholdYellow = toFiniteNumber(options.thresholdYellow, theme.threshold.defaultYellow);
    assertValidThresholdPair(thresholdRed, thresholdYellow);

    const primaryValue = toFiniteNumber(props.primary);
    const secondaryValue = toFiniteNumber(props.secondary);

    return {
        withOpacitySwitch: options.withOpacitySwitch ?? true,
        enableInnerArc: options.enableInnerArc ?? false,
        circleScale: options.circleScale ?? theme.options.defaultCircleScale,
        thresholdRed,
        thresholdYellow,
        enableToolTip: options.enableToolTip ?? true,
        enableUnitTicks: options.enableUnitTicks ?? true,
        tickLabelColor: options.tickLabelColor ?? theme.colors.tickLabel,
        tickColor: options.tickColor ?? theme.colors.tick,
        fontColor: options.fontColor ?? theme.colors.font,
        tickFontSize: options.tickFontSize ?? theme.ticks.defaultFontSize,
        tickRadiusScale: options.tickRadiusScale,
        tooltipBgColor: options.tooltipBgColor ?? theme.tooltip.background,
        numTiles: resolveTileCount(tileArc.tiles, theme.tiles.minCount),
        tile: {
            colorTileThresholdYellow: tileArc.colorTileThresholdYellow ?? theme.colors.tileYellow,
            colorTileThresholdRed: tileArc.colorTileThresholdRed ?? theme.colors.tileRed,
            colorTileThresholdDefault: tileArc.colorTileThresholdDefault ?? theme.colors.tileDefault,
            isTileColorGradient: tileArc.isTileColorGradient ?? false,
            gradientType: tileArc.gradientType ?? 'tile',
            colorTileBg: tileArc.colorTileBg ?? theme.colors.tileBg,
            fillStyle: tileArc.fillStyle ?? TileFillStyle.FILLED,
            borderColor: tileArc.borderColor ?? theme.colors.tileBorder,
            borderThickness: tileArc.borderThickness ?? theme.tiles.defaultBorderThickness,
            tickEveryNThStep: tileArc.tickEveryNThStep ?? 0,
            arcConfig: tileArc.arcConfig ?? {
                cornerRadius: theme.arc.defaultCornerRadius,
                padAngle: theme.arc.tilePadAngle,
                padRadius: theme.arc.tilePadRadius,
            },
            toolTipLabel: tileArc.toolTipLabel ?? 'Total',
        },
        secondary: {
            arcConfig: secondaryArcConfig.arcConfig ?? {
                cornerRadius: theme.arc.defaultCornerRadius,
                padAngle: theme.arc.solidPadAngle,
                padRadius: theme.arc.solidPadRadius,
            },
            pointerSumConfig: secondaryArcConfig.pointerSumConfig ?? {
                scale: theme.pointer.defaultScale,
                strokeScale: theme.pointer.defaultStrokeScale,
                color: theme.colors.pointerSecondary,
            },
            colorSecondaryBar: secondaryArcConfig.colorSecondaryBar ?? theme.colors.secondaryBar,
            toolTipLabel: secondaryArcConfig.toolTipLabel ?? 'Secondary',
        },
        primary: {
            arcConfig: primaryArcConfig.arcConfig ?? {
                cornerRadius: theme.arc.defaultCornerRadius,
                padAngle: theme.arc.solidPadAngle,
                padRadius: theme.arc.solidPadRadius,
            },
            pointerPrimaryConfig: primaryArcConfig.pointerPrimaryConfig ?? {
                scale: theme.pointer.defaultScale,
                strokeScale: theme.pointer.defaultStrokeScale,
                color: theme.colors.pointerPrimary,
            },
            colorPrimaryBar: primaryArcConfig.colorPrimaryBar ?? theme.colors.primaryBar,
            toolTipLabel: primaryArcConfig.toolTipLabel ?? 'Primary',
        },
        primaryValue,
        secondaryValue,
        sumValue: primaryValue + secondaryValue,
    };
}