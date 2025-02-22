import {FormatterType} from './constants';

/**
 * Element type constants for getOpacity function
 */
export enum ElementType {
    NONE = 0,
    FILLED_TILE = 1,
    PRIMARY_BAR = 2,
    SECONDARY_BAR = 3
}

/**
 * Calculates the opacity for elements based on hover states
 * @param elementType Type of the element (FILLED_TILE, PRIMARY_BAR, SECONDARY_BAR, or NONE)
 * @param hoverStates Object containing hover states for different elements
 * @param enableOpacityEffect Whether the opacity effect is enabled
 * @returns The calculated opacity value
 */
export const getOpacity = (
    elementType: ElementType,
    hoverStates: {
        tile: boolean;
        primaryBar: boolean;
        secondaryBar: boolean;
    },
    enableOpacityEffect: boolean
): number => {
    if (!enableOpacityEffect) return 1;

    const {tile: isTileHovered, primaryBar: isBarPrimaryHovered, secondaryBar: isBarSecondaryHovered} = hoverStates;

    // Return 100% opacity for hovered elements
    if (isBarPrimaryHovered && elementType === ElementType.PRIMARY_BAR) return 1;
    if (isBarSecondaryHovered && elementType === ElementType.SECONDARY_BAR) return 1;
    if (isTileHovered && elementType === ElementType.FILLED_TILE) return 1;

    // Return 80% opacity for non-hovered elements when any element is hovered
    if (isTileHovered || isBarPrimaryHovered || isBarSecondaryHovered) {
        return 0.5;
    }

    // Return 100% opacity when nothing is hovered
    return 1;
};

/**
 * Formats a value using the provided formatters
 * @param value The value to format
 * @param unitTickFormatter Optional formatter for unit ticks
 * @param unit Optional unit formatter
 * @returns The formatted value as a string
 */
export const formatValue = (
    value: number,
    unitTickFormatter?: (value: number) => string,
    unit?: (value: number) => string
): string => {
    // If unitTickFormatter exists and doesn't return 'unit', use its result
    if (unitTickFormatter) {
        const formattedValue = unitTickFormatter(value);
        if (formattedValue !== FormatterType.UNIT) {
            return formattedValue;
        }
    }

    // If unit formatter exists, use it
    if (unit) {
        return unit(value);
    }

    // Fallback to simple string conversion
    return value.toString();
};

/**
 * Selects a color based on a value and thresholds
 * @param thresholdMax The maximum threshold value
 * @param thresholdMid The middle threshold value
 * @param colorMax The color for values above thresholdMax
 * @param colorMid The color for values between thresholdMid and thresholdMax
 * @param colorDefault The color for values below thresholdMid
 * @param value The value to check
 * @returns The selected color
 */
export const colorSelector = (
    thresholdMax: number,
    thresholdMid: number,
    colorMax: string,
    colorMid: string,
    colorDefault: string,
    value: number
): string => {
    if (value < thresholdMid) {
        return colorDefault;
    } else if (value >= thresholdMid && value < thresholdMax) {
        return colorMid;
    } else {
        return colorMax;
    }
};

/**
 * Gets the color for a tile based on its value and configuration
 * @param value The normalized value
 * @param index The index of the tile
 * @param config The configuration object
 * @param colorScale The D3 color scale function
 * @returns The color for the tile
 */
export const getTileColor = (
    value: number,
    index: number,
    config: {
        isTileColorGradient: boolean;
        gradientType: string;
        thresholdYellowNormalized: number;
        thresholdRedNormalized: number;
        colorTileThresholdDefault: string;
        colorTileThresholdYellow: string;
        colorTileThresholdRed: string;
    },
    colorScale: any
): string => {
    const {
        isTileColorGradient,
        gradientType,
        thresholdYellowNormalized,
        thresholdRedNormalized,
        colorTileThresholdDefault,
        colorTileThresholdYellow,
        colorTileThresholdRed
    } = config;

    // If not using gradient, select color based on thresholds
    if (!isTileColorGradient) {
        if (value >= thresholdRedNormalized) return colorTileThresholdRed;
        if (value >= thresholdYellowNormalized) return colorTileThresholdYellow;
        return colorTileThresholdDefault;
    }

    // If using full gradient, use color scale
    if (gradientType === "full") {
        return colorScale(value);
    }

    // If using tile gradient, use gradient ID
    return `url(#gradient-${index})`;
};