import { GradientType, TileFillStyle } from './utils/constants';

/**
 * Configuration for pointer appearance
 */
export interface PointerConfig {
    /** Scale factor for pointer size */
    scale: number;
    /** Scale factor for pointer stroke width */
    strokeScale: number;
    /** Color of the pointer */
    color: string;
}

/**
 * Configuration for arc appearance
 */
export interface ArcConfig {
    /** Padding angle between arcs */
    padAngle: number;
    /** Padding radius for arcs */
    padRadius: number;
    /** Corner radius for arcs */
    cornerRadius: number;
}

/**
 * Configuration for tile arcs
 */
export interface TileArcConfig {
    /** Color for values above red threshold */
    colorTileThresholdRed?: string;
    /** Color for values above yellow threshold but below red */
    colorTileThresholdYellow?: string;
    /** Default color for values below yellow threshold */
    colorTileThresholdDefault?: string;
    /** Background color for unfilled tiles */
    colorTileBg?: string;
    /** Fill style for tiles (filled, dotted, dashed, outlined) */
    fillStyle?: TileFillStyle;
    /** Border color for outlined tiles */
    borderColor?: string;
    /** Border thickness for outlined tiles */
    borderThickness?: number;
    /** Number of tiles to display */
    tiles?: number;
    /** Whether to use gradient coloring for tiles */
    isTileColorGradient?: boolean;
    /** Type of gradient to use */
    gradientType?: GradientType | string;
    /** Step size for tick labels */
    tickEveryNThStep?: number;
    /** Arc configuration for tiles */
    arcConfig?: ArcConfig;
    /** Label for tile tooltip */
    toolTipLabel?: string;
}

/**
 * Configuration for primary arc
 */
export interface PrimaryArcConfig {
    /** Color for primary bar */
    colorPrimaryBar?: string;
    /** Pointer configuration for primary value */
    pointerPrimaryConfig?: PointerConfig;
    /** Arc configuration for primary arc */
    arcConfig?: ArcConfig;
    /** Label for primary tooltip */
    toolTipLabel?: string;
}

/**
 * Configuration for secondary arc
 */
export interface SecondaryArcConfig {
    /** Color for secondary bar */
    colorSecondaryBar?: string;
    /** Pointer configuration for sum value */
    pointerSumConfig?: PointerConfig;
    /** Arc configuration for secondary arc */
    arcConfig?: ArcConfig;
    /** Label for secondary tooltip */
    toolTipLabel?: string;
}

/**
 * General configuration for gauge
 */
export interface GaugeConfig {
    /** Threshold value for yellow warning level */
    thresholdYellow?: number;
    /** Threshold value for red warning level */
    thresholdRed?: number;
    /** Whether to enable opacity changes on hover */
    withOpacitySwitch?: boolean;
    /** Whether to show tooltips */
    enableToolTip?: boolean;
    /** Whether to show unit ticks */
    enableUnitTicks?: boolean;
    /** Font size for tick labels */
    tickFontsize?: string;
    /** Scale factor for center circle */
    circleScale?: number;
    /** Whether to show inner arcs */
    enableInnerArc?: boolean;
    /** Font color for labels and tooltips */
    fontColor?: string;
    /** Background color for tooltips */
    tooltipBgColor?: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
}

/**
 * Data structure for tooltip content
 */
export interface TooltipItem {
    /** Label text */
    label: string;
    /** Value text */
    value: string;
    /** Color indicator */
    color: string;
}

/**
 * Data structure for tooltip state
 */
export interface TooltipState {
    /** Array of tooltip items to display */
    text: TooltipItem[];
    /** X position of tooltip */
    x: number;
    /** Y position of tooltip */
    y: number;
}

/**
 * Props for the Gauge component
 */
export interface GaugeProps {
    /** Width of the SVG (default: 800) */
    width?: number;
    /** Height of the SVG (default: 600) */
    height?: number;
    /** Primary value to display */
    primary: number;
    /** Secondary value to display (optional) */
    secondary?: number;
    /** General gauge configuration */
    options?: GaugeConfig;
    /** Configuration for tile arcs */
    tileArc: TileArcConfig;
    /** Configuration for primary arc */
    primaryArcConfig?: PrimaryArcConfig;
    /** Configuration for secondary arc */
    secondaryArcConfig?: SecondaryArcConfig;
    /** Formatter function for unit tick labels */
    unitTickFormatter?: (value: number) => string;
    /** Formatter function for unit display */
    unit?: (value: number) => string;
}