// Export main component
export { default as GaugeChart } from './GaugeChart';

// Export types
export type {
  GaugeChartProps,
    GaugeLayer,
    GaugeScale,
    GaugeGeometryConfig,
    GaugeInteractionConfig,
    GaugeTicksConfig,
    GaugeHubConfig,
    GaugeFormatters,
    LayerValueMode,
    LayerRenderMode,
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
    DeepPartial,
    RgbaColor
} from './types/theme.types';

// Export utility functions that might be useful for consumers
export { formatValue, colorSelector } from './utils/gaugeUtils';
export { calculatePointer, normalize, buildArcPath, valueToAngle } from './utils/gaugeCalculations';
export { computeGaugeLayout, computeGaugeLayoutFromSize, resolveSizePreset } from './utils/computeGaugeLayout';
export { DEFAULT_THEME } from './theme/defaultTheme'
export { mergeTheme } from './theme/mergeTheme'

// Export constants that might be useful for consumers
export {
  ANGLE_RANGE,
  GradientType,
  TileFillStyle,
  GAUGE_SIZE_PRESETS,
} from './utils/constants';