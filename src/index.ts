// Export main component
export { default as GaugeChart } from './GaugeChart';

// Export types
export type {
  GaugeProps,
  GaugeConfig,
  TileArcConfig,
  PrimaryArcConfig,
  SecondaryArcConfig,
  PointerConfig,
  ArcConfig,
  TooltipState,
  TooltipItem,
  GaugeSize,
} from './types';

export type {
  GaugeTheme,
    DeepPartial,
    RgbaColor
} from './types/theme.types';

// Export utility functions that might be useful for consumers
export { formatValue, colorSelector } from './utils/gaugeUtils';
export { calculatePointer, normalize, buildArcPath, valueToAngle } from './utils/gaugeCalculations';
export { computeGaugeLayout, computeGaugeLayoutFromSize, resolveSizePreset } from './utils/computeGaugeLayout';

// Export constants that might be useful for consumers
export {
  ANGLE_RANGE,
  ARC_CONSTANTS,
  OPTIONS_DEFAULTS,
  PRIMARY_ARC_DEFAULTS,
  RADIUS_SCALES,
  REFERENCE_WIDTH,
  SECONDARY_ARC_DEFAULTS,
  TILE_ARC_DEFAULTS,
  GradientType,
  TileFillStyle,
  GAUGE_SIZE_PRESETS,
} from './utils/constants';