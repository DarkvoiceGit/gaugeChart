import {DEFAULT_THEME} from "../theme/defaultTheme.ts";

export const ANGLE_RANGE = {
    START: DEFAULT_THEME.geometry.startAngle,
    END: DEFAULT_THEME.geometry.endAngle
};

export const RADIUS_SCALES = {
    INNER_ARC: DEFAULT_THEME.radius.innerArc,
    OUTER_ARC: DEFAULT_THEME.radius.outerArc,
    TILE_ARC: DEFAULT_THEME.radius.tileArc,
    TICK_LABEL: DEFAULT_THEME.radius.tickLabel,
    HOVER_DETECTION: DEFAULT_THEME.interaction.hoverHitAreaInnerRatio,
    HOVER_INNER_SCALE: DEFAULT_THEME.interaction.hoverHighlight.innerScale,
    HOVER_OUTER_SCALE: DEFAULT_THEME.interaction.hoverHighlight.outerScale
};

export const OPTIONS_DEFAULTS = {
    withOpacitySwitch: true,
    enableInnerArc: false,
    circleScale: DEFAULT_THEME.options.defaultCircleScale,
    thresholdRed: DEFAULT_THEME.threshold.defaultRed,
    thresholdYellow: DEFAULT_THEME.threshold.defaultYellow,
    enableToolTip: true,
    enableUnitTicks: true,
    tickFontSize: DEFAULT_THEME.ticks.defaultFontSize,
    tickLabelColor: DEFAULT_THEME.colors.tickLabel,
    tickColor: DEFAULT_THEME.colors.tick,
    fontColor: DEFAULT_THEME.colors.font,
    tooltipBgColor: DEFAULT_THEME.tooltip.background
};

export enum TileFillStyle {
    FILLED = 'filled',
    DOTTED = 'dotted',
    DASHED = 'dashed',
    OUTLINED = 'outlined'
}

export const TILE_ARC_DEFAULTS = {
    tiles: DEFAULT_THEME.tiles.defaultCount,
    colorTileThresholdYellow: DEFAULT_THEME.colors.tileYellow,
    colorTileThresholdRed: DEFAULT_THEME.colors.tileRed,
    colorTileThresholdDefault: DEFAULT_THEME.colors.tileDefault,
    isTileColorGradient: false,
    gradientType: 'tile',
    colorTileBg: DEFAULT_THEME.colors.tileBg,
    fillStyle: TileFillStyle.FILLED,
    borderColor: DEFAULT_THEME.colors.tileBorder,
    borderThickness: DEFAULT_THEME.tiles.defaultBorderThickness,
    tickEveryNThStep: 0,
    arcConfig: {
        cornerRadius: DEFAULT_THEME.arc.defaultCornerRadius,
        padAngle: DEFAULT_THEME.arc.tilePadAngle,
        padRadius: DEFAULT_THEME.arc.tilePadRadius
    },
    toolTipLabel: 'Total',
};

export const SECONDARY_ARC_DEFAULTS = {
    arcConfig: {
        cornerRadius: DEFAULT_THEME.arc.defaultCornerRadius,
        padAngle: DEFAULT_THEME.arc.tilePadAngle,
        padRadius: DEFAULT_THEME.arc.tilePadRadius
    },
    pointerSumConfig: {
        scale: DEFAULT_THEME.pointer.defaultScale,
        strokeScale: DEFAULT_THEME.pointer.defaultStrokeScale,
        color: DEFAULT_THEME.colors.pointerSecondary
    },
    colorSecondaryBar: DEFAULT_THEME.colors.secondaryBar,
    toolTipLabel: 'Secondary',
};

export const PRIMARY_ARC_DEFAULTS = {
    arcConfig: {
        cornerRadius: DEFAULT_THEME.arc.defaultCornerRadius,
        padAngle: DEFAULT_THEME.arc.tilePadAngle,
        padRadius: DEFAULT_THEME.arc.tilePadRadius
    },
    pointerPrimaryConfig: {
        scale: DEFAULT_THEME.pointer.defaultScale,
        strokeScale: DEFAULT_THEME.pointer.defaultStrokeScale,
        color: DEFAULT_THEME.colors.pointerPrimary
    },
    colorPrimaryBar: DEFAULT_THEME.colors.primaryBar,
    toolTipLabel: 'Primary',
    tickFontSize: DEFAULT_THEME.ticks.defaultFontSize,
    fontColor: DEFAULT_THEME.colors.font,
    tooltipBgColor: DEFAULT_THEME.tooltip.background
};

export enum GradientType {
    FULL = 'full',
    TILE = 'tile'
}

export enum FormatterType {
    UNIT = 'unit',
    CUSTOM = 'custom'
}

export const REFERENCE_WIDTH = DEFAULT_THEME.layout.referenceWidth;

export const ARC_CONSTANTS = {
    ANGLE_OFFSET: DEFAULT_THEME.geometry.angleOffset,
    STROKE_WIDTH_THIN: DEFAULT_THEME.stroke.thin,
    STROKE_WIDTH_NORMAL: DEFAULT_THEME.stroke.normal,
    HOVER_OFFSET_INNER: DEFAULT_THEME.interaction.hoverHighlight.tileInnerOffset,
    HOVER_OFFSET_OUTER: DEFAULT_THEME.interaction.hoverHighlight.tileOuterOffset,

    DOTTED_STROKE_PATTERN: DEFAULT_THEME.arc.dottedStrokePattern,
    DASHED_STROKE_PATTERN: DEFAULT_THEME.arc.dashedStrokePattern
};

/**
 * Logical size presets for the gauge. These represent the internal coordinate
 * system used for the SVG viewBox and are chosen to preserve a 4:3 aspect ratio
 * that matches the existing 800x600 default while providing smaller and larger
 * variants with minimal outer whitespace.
 */
export const GAUGE_SIZE_PRESETS = DEFAULT_THEME.sizesPresets
