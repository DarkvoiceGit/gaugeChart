import {DeepPartial, GaugeTheme, GaugeThemeGeometry} from "./types/theme.types";
import {GradientType, TileFillStyle} from "./utils/constants";

export type GaugeGeometryConfig = Partial<GaugeThemeGeometry>

export type GaugeSize =
    | 'default'
    | 'xxs'
    | 'xs'
    | 's'
    | 'sm'
    | 'm'
    | 'l'
    | 'xl'
    | 'xxl'
    | 'xxxl';

export type LayerValueMode = 'absolute' | 'cumulative' | 'offset'
export type LayerRenderMode = 'solid' | 'segmented'
export type LayerRadiusGrow  = 'inward' | 'outward' | 'center'

export type PointerStlye = 'arrow' | 'needle'

export interface PointerConfig {
    scale: number;
    strokeScale: number;
    color: string;
    lengthRatio?: number;
    /** Visual Pointer style. Defaults to `'arrow'` (line + arrowhead) */
    style?: PointerStlye
}


export interface ArcConfig {
    padAngle: number;
    padRadius: number;
    cornerRadius: number;
}

export interface LayerPointerConfig extends Partial<PointerConfig> {
    enabled?: boolean;
}

export interface LayerTooltipConfig {
    enabled?: boolean;
    label?: string;
    mode?: "self" | "all" | "none";
    /** Optional tooltip swatch color. Falls back to the layer/bar color when unset. */
    color?: string
}

export interface LayerGradientConfig {
    enabled?: boolean;
    type?: GradientType | string;
}

export interface GaugeLayer {
    id: string;
    value: number;
    radius: number;
    thickness: number;
    grow?: LayerRadiusGrow;
    render: LayerRenderMode;
    segments?: number;
    valueMode?: LayerValueMode;
    baseLayerId?: string;
    offsetValue?: number;
    color: string;
    fillStyle?: TileFillStyle;
    backgroundColor?: string;
    borderColor?: string;
    borderThickness?: number;
    gradient?: LayerGradientConfig,
    arc?: Partial<ArcConfig>,
    pointer?: LayerPointerConfig,
    tooltip?: LayerTooltipConfig,
    hoverable?: boolean,
    zIndex?: number,
}

export interface GaugeZone {
    upTo: number,
    color: string
}

export interface GaugeScale {
    min?: number;
    max: number;
    zones?: GaugeZone[];
}

export interface GaugeInteractionConfig {
    hoverDimming?: boolean;
    tooltips?: boolean;
    tooltipMode?: 'layer' | 'all'
}

export interface GaugeTicksConfig {
    enabled?: boolean;
    step?: number;
    fontSize?: string;
    labelColor?: string;
    tickColor?: string;
    radiusScale?: number;
}

export interface GaugeHubConfig {
    scale?: number;
    color?: string;
}

export interface GaugeFormatters {
    value?: (value: number) => string;
    tick?: (value: number) => string;
}

export interface TooltipItem {
    label: string;
    value: string;
    color: string;
}

export interface TooltipState {
    text: TooltipItem[];
    x: number;
    y: number;
}

export interface GaugeAnimationConfig {
    enabled?: boolean;
    durationMs?: number;
}

export interface GaugeChartProps {
    size?: GaugeSize;
    scale: GaugeScale;
    layers: GaugeLayer[];
    geometry?: GaugeGeometryConfig;
    ticks?: GaugeTicksConfig;
    interaction?: GaugeInteractionConfig
    hub?: GaugeHubConfig;
    formatters?: GaugeFormatters;
    animation?: GaugeAnimationConfig;
    theme?: DeepPartial<GaugeTheme>;
    debugMode?: boolean;
}