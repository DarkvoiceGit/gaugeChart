// Export main component
export {default as GaugeChart} from './GaugeChart';

// Export types
export type {
    GaugeChartProps,
    GaugeLayer,
    GaugeScale,
    GaugeZone,
    GaugeGeometryConfig,
    GaugeInteractionConfig,
    GaugeAnimationConfig,
    GaugeTicksConfig,
    GaugeHubConfig,
    GaugeFormatters,
    LayerValueMode,
    LayerRenderMode,
    LayerRadiusGrow,
    PointerConfig,
    ArcConfig,
    LayerPointerConfig,
    LayerTooltipConfig,
    TooltipState,
    TooltipItem,
    GaugeSize,
} from './types';

export type {
    GaugeTheme,
    GaugeThemeGeometry,
    GaugeThemeAnimation,
    DeepPartial,
    RgbaColor
} from './types/theme.types';

// Export utility functions that might be useful for consumers
export {formatValue, colorSelector} from './utils/gaugeUtils';
export {calculatePointer, normalize, buildArcPath, valueToAngle} from './utils/gaugeCalculations';
export {computeGaugeLayout, computeGaugeLayoutFromSize, resolveSizePreset} from './utils/computeGaugeLayout';
export {resolveLayerRadii} from './core/gaugeGeometry'
export {computeTileSegments} from './utils/computeTileSegment'
export {useAnimatedSvgAttribute} from './hooks/useAnimatedSvgAttribute'
export {DEFAULT_THEME} from './theme/defaultTheme'
export {mergeTheme} from './theme/mergeTheme'

// Export constants that might be useful for consumers
export {
    GradientType,
    TileFillStyle,
    GAUGE_SIZE_PRESETS,
    ANGLE_RANGE,
} from './utils/constants';