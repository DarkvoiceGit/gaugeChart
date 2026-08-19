import {DEFAULT_THEME} from "../theme/defaultTheme";

export const ANGLE_RANGE = {
    START: DEFAULT_THEME.geometry.startAngle,
    END: DEFAULT_THEME.geometry.endAngle
};

export enum TileFillStyle {
    FILLED = 'filled',
    DOTTED = 'dotted',
    DASHED = 'dashed',
    OUTLINED = 'outlined',
}

export enum GradientType {
    FULL = 'full',
    TILE = 'tile'
}

export enum FormatterType {
    UNIT = 'unit',
    CUSTOM = 'custom'
}

/**
 * Logical size presets for the gauge. These represent the internal coordinate
 * system used for the SVG viewBox and are chosen to preserve a 4:3 aspect ratio
 * that matches the existing 800x600 default while providing smaller and larger
 * variants with minimal outer whitespace.
 */
export const GAUGE_SIZE_PRESETS = DEFAULT_THEME.sizesPresets
