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
  TooltipItem
} from './types';

// Export utility functions that might be useful for consumers
export { formatValue, colorSelector } from './utils/gaugeUtils';
export { calculatePointer, normalize } from './utils/gaugeCalculations';

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
  TileFillStyle
} from './utils/constants';