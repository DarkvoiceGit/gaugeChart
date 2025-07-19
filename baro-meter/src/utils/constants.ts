// Angle constants
export const ANGLE_RANGE = {
  START: -Math.PI / 2, // Start angle for the gauge (pointing left)
  END: Math.PI / 2     // End angle for the gauge (pointing right)
};

// Radius scale factors
export const RADIUS_SCALES = {
  INNER_ARC: 0.6,  // Scale factor for inner arc radius
  OUTER_ARC: 0.7,  // Scale factor for outer arc radius
  TILE_ARC: 1.0,   // Scale factor for tile arc radius
  TICK_LABEL: 1.05, // Scale factor for tick label radius
  HOVER_DETECTION: 0.72, // Scale factor for hover detection overlay
  HOVER_INNER_SCALE: 0.92, // Scale factor for inner radius on hover
  HOVER_OUTER_SCALE: 1.07 // Scale factor for outer radius on hover
};

// Default options for the gauge
export const OPTIONS_DEFAULTS = {
  withOpacitySwitch: true,   // Whether to enable opacity changes on hover
  enableInnerArc: false,     // Whether to show inner arcs
  circleScale: 0.5,          // Scale factor for center circle (0.5 = 5% of radius)
  thresholdRed: 80,          // Value at which to show red warning
  thresholdYellow: 60,       // Value at which to show yellow warning
  enableToolTip: true,       // Whether to show tooltips
  enableUnitTicks: true,     // Whether to show unit ticks
  tickFontSize: '1rem'       // Font size for tick labels
};

// Tile fill style types
export enum TileFillStyle {
  FILLED = 'filled',   // Solid fill
  DOTTED = 'dotted',   // Transparent with dotted border
  DASHED = 'dashed',   // Transparent with dashed border
  OUTLINED = 'outlined' // Transparent with solid border
}

// Default configuration for tile arcs
export const TILE_ARC_DEFAULTS = {
  tiles: 10,                           // Number of tiles to display
  colorTileThresholdYellow: '#ffff00', // Yellow warning color
  colorTileThresholdRed: '#ff0c4d',    // Red warning color
  colorTileThresholdDefault: '#00ff00', // Default color (below warning threshold)
  isTileColorGradient: false,          // Whether to use gradient coloring
  gradientType: 'tile',                // Type of gradient ('tile' or 'full')
  colorTileBg: '#ddd',                 // Background color for unfilled tiles
  fillStyle: TileFillStyle.FILLED,     // Style for unfilled tiles (filled, dotted, dashed, outlined)
  borderColor: '#000',                 // Border color for outlined tiles
  borderThickness: 1,                  // Border thickness for outlined tiles
  tickEveryNThStep: 0,                 // Step size for tick labels (0 = auto)
  arcConfig: {
    cornerRadius: 5,                   // Radius for arc corners
    padAngle: 2,                       // Padding angle between arcs
    padRadius: 2                       // Padding radius for arcs
  },
  toolTipLabel: 'Total',               // Label for tile tooltip (was 'Gesamt')
};

// Default configuration for secondary arcs
export const SECONDARY_ARC_DEFAULTS = {
  arcConfig: {
    cornerRadius: 5,
    padAngle: 0,
    padRadius: 0
  },
  pointerSumConfig: {
    scale: 1,                // Scale factor for pointer size
    strokeScale: 1,          // Scale factor for pointer stroke width
    color: '#0ed30e'         // Color for secondary pointer (green)
  },
  colorSecondaryBar: '#aaa', // Color for secondary bar (gray)
  toolTipLabel: 'Secondary', // Label for secondary tooltip
};

// Default configuration for primary arcs
export const PRIMARY_ARC_DEFAULTS = {
  arcConfig: {
    cornerRadius: 5,
    padAngle: 0,
    padRadius: 0
  },
  pointerPrimaryConfig: {
    scale: 1,
    strokeScale: 1,
    color: '#025bff'         // Color for primary pointer (blue)
  },
  colorPrimaryBar: '#000',   // Color for primary bar (black)
  toolTipLabel: 'Primary',   // Label for primary tooltip
  tickFontSize: '1rem',
  fontColor: '#fff',         // Font color for labels and tooltips
  tooltipBgColor: {
    r: 0,
    g: 0,
    b: 0,
    a: 0.8                   // Semi-transparent black background for tooltips
  }
};

// Gradient types
export enum GradientType {
  FULL = 'full', // Full gradient across all tiles
  TILE = 'tile'  // Gradient within each tile
}

// Formatter types
export enum FormatterType {
  UNIT = 'unit', // Special value returned by unitTickFormatter to indicate unit should be used
  CUSTOM = 'custom' // Any other value returned by unitTickFormatter
}

// Reference width for scaling
export const REFERENCE_WIDTH = 600; // Base width for scaling calculations

// Arc rendering constants
export const ARC_CONSTANTS = {
  ANGLE_OFFSET: 0.01, // Small offset for start angle to prevent rendering issues
  STROKE_WIDTH_THIN: 0.5, // Thin stroke width for arcs
  STROKE_WIDTH_NORMAL: 1, // Normal stroke width for arcs
  HOVER_OFFSET_INNER: 15, // Inner offset for hover effect
  HOVER_OFFSET_OUTER: 10, // Outer offset for hover effect
  
  // Stroke dash patterns for different tile fill styles
  DOTTED_STROKE_PATTERN: "1,3", // Small dots with larger gaps (dash length 1, gap length 3)
  DASHED_STROKE_PATTERN: "5,5"  // Medium dashes with equal gaps (dash length 5, gap length 5)
};