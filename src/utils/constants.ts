export const ANGLE_RANGE = {
    START: -Math.PI / 2,
    END: Math.PI / 2
};

export const RADIUS_SCALES = {
    INNER_ARC: 0.6,
    OUTER_ARC: 0.7,
    TILE_ARC: 1.0,
    TICK_LABEL: 1.15,
    HOVER_DETECTION: 0.72,
    HOVER_INNER_SCALE: 0.92,
    HOVER_OUTER_SCALE: 1.07
};

export const OPTIONS_DEFAULTS = {
    withOpacitySwitch: true,
    enableInnerArc: false,
    circleScale: 0.5,
    thresholdRed: 80,
    thresholdYellow: 60,
    enableToolTip: true,
    enableUnitTicks: true,
    tickFontSize: '1rem',
    tickLabelColor: '#fff',
    tickColor: '#000',
    fontColor: '#fff',
};

export enum TileFillStyle {
    FILLED = 'filled',
    DOTTED = 'dotted',
    DASHED = 'dashed',
    OUTLINED = 'outlined'
}

export const TILE_ARC_DEFAULTS = {
    tiles: 10,
    colorTileThresholdYellow: '#ffff00',
    colorTileThresholdRed: '#ff0c4d',
    colorTileThresholdDefault: '#00ff00',
    isTileColorGradient: false,
    gradientType: 'tile',
    colorTileBg: '#ddd',
    fillStyle: TileFillStyle.FILLED,
    borderColor: '#000',
    borderThickness: 1,
    tickEveryNThStep: 0,
    arcConfig: {
        cornerRadius: 5,
        padAngle: 2,
        padRadius: 2
    },
    toolTipLabel: 'Total',
};

export const SECONDARY_ARC_DEFAULTS = {
    arcConfig: {
        cornerRadius: 5,
        padAngle: 0,
        padRadius: 0
    },
    pointerSumConfig: {
        scale: 1,
        strokeScale: 1,
        color: '#0ed30e'
    },
    colorSecondaryBar: '#aaa',
    toolTipLabel: 'Secondary',
};

export const PRIMARY_ARC_DEFAULTS = {
    arcConfig: {
        cornerRadius: 5,
        padAngle: 0,
        padRadius: 0
    },
    pointerPrimaryConfig: {
        scale: 1,
        strokeScale: 1,
        color: '#025bff'
    },
    colorPrimaryBar: '#000',
    toolTipLabel: 'Primary',
    tickFontSize: '1rem',
    fontColor: '#fff',
    tooltipBgColor: {
        r: 0,
        g: 0,
        b: 0,
        a: 0.8
    }
};

export enum GradientType {
    FULL = 'full',
    TILE = 'tile'
}

export enum FormatterType {
    UNIT = 'unit',
    CUSTOM = 'custom'
}

export const REFERENCE_WIDTH = 600;

export const ARC_CONSTANTS = {
    ANGLE_OFFSET: 0.01,
    STROKE_WIDTH_THIN: 0.5,
    STROKE_WIDTH_NORMAL: 1,
    HOVER_OFFSET_INNER: 15,
    HOVER_OFFSET_OUTER: 10,

    DOTTED_STROKE_PATTERN: "1,3",
    DASHED_STROKE_PATTERN: "5,5"
};