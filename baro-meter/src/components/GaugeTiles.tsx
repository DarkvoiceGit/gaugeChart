import React from 'react';
import * as d3 from 'd3';
import { getTileColor, getOpacity } from '../utils/gaugeUtils';
import { ANGLE_RANGE, RADIUS_SCALES, ARC_CONSTANTS, TileFillStyle } from '../utils/constants';

interface GaugeTilesProps {
  radius: number;
  tileAngles: number[];
  numberOfTiles: number;
  sumNormalized: number;
  thresholdRed: number;
  colorScale: d3.ScaleLinear<string, string>;
  config: {
    isTileColorGradient: boolean;
    gradientType: string;
    thresholdYellowNormalized: number;
    thresholdRedNormalized: number;
    colorTileThresholdDefault: string;
    colorTileThresholdYellow: string;
    colorTileThresholdRed: string;
    colorTileBg: string;
    fillStyle: TileFillStyle;
    borderColor: string;
    borderThickness: number;
    arcConfig: {
      cornerRadius: number;
      padAngle: number;
      padRadius: number;
    };
  };
  hoverStates: {
    tile: boolean;
    primaryBar: boolean;
    secondaryBar: boolean;
  };
  enableOpacityEffect: boolean;
  scaleFactor: number;
  onMouseEnter: (event: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onMouseMove?: (event: React.MouseEvent) => void;
}

/**
 * Component for rendering the tile arcs of the gauge
 */
const GaugeTiles: React.FC<GaugeTilesProps> = ({
  radius,
  tileAngles,
  numberOfTiles,
  sumNormalized,
  thresholdRed,
  colorScale,
  config,
  hoverStates,
  enableOpacityEffect,
  scaleFactor,
  onMouseEnter,
  onMouseLeave,
  onMouseMove
}) => {
  // Helper function to normalize values
  const normalize = (value: number) => {
    return Math.min(1, value / thresholdRed);
  };

  return (
    <>
      {tileAngles.map((angle, index) => {
        const tileStartAngle = angle;
        const tileEndAngle = angle + (Math.PI / numberOfTiles);
        const tileValueRange = thresholdRed / numberOfTiles;
        const tileMinValue = index * tileValueRange;
        const tileMinValueNormalized = normalize(tileMinValue);
        const tileValueRangeNormalized = normalize(tileValueRange);
        
        // Determine how much of the tile should be filled
        const fillRatio = Math.min(
          1, 
          Math.max(0, (sumNormalized - tileMinValueNormalized) / tileValueRangeNormalized)
        );
        const tileFillEndAngle = tileStartAngle + fillRatio * (tileEndAngle - tileStartAngle);

        // Create arc generators for background and foreground
        const tileBackgroundArc = d3.arc<d3.DefaultArcObject>()
          .innerRadius(radius * RADIUS_SCALES.OUTER_ARC)
          .outerRadius(radius)
          .startAngle(tileStartAngle)
          .endAngle(tileEndAngle)
          .padRadius(config.arcConfig.padRadius)
          .padAngle(config.arcConfig.padAngle)
          .cornerRadius(config.arcConfig.cornerRadius);

        // Adjust inner/outer radius when hovered for visual effect
        const tileForegroundArc = d3.arc<d3.DefaultArcObject>()
          .innerRadius(hoverStates.tile && enableOpacityEffect ? radius * RADIUS_SCALES.OUTER_ARC - (ARC_CONSTANTS.HOVER_OFFSET_INNER * scaleFactor) : radius * RADIUS_SCALES.OUTER_ARC)
          .outerRadius(hoverStates.tile && enableOpacityEffect ? radius + (ARC_CONSTANTS.HOVER_OFFSET_OUTER * scaleFactor) : radius)
          .startAngle(tileStartAngle)
          .endAngle(tileFillEndAngle)
          .padRadius(config.arcConfig.padRadius)
          .padAngle(config.arcConfig.padAngle)
          .cornerRadius(config.arcConfig.cornerRadius);

        const fillColor = getTileColor(
          sumNormalized,
          index,
          config,
          colorScale
        );

        return (
          <g key={index}>
            {/* Unfilled part of the tile */}
            <path
              d={tileBackgroundArc({} as any)}
              stroke={config.fillStyle !== TileFillStyle.FILLED ? config.borderColor : "#000"}
              strokeWidth={config.fillStyle !== TileFillStyle.FILLED ? config.borderThickness : ARC_CONSTANTS.STROKE_WIDTH_NORMAL}
              strokeDasharray={
                config.fillStyle === TileFillStyle.DOTTED ? ARC_CONSTANTS.DOTTED_STROKE_PATTERN :
                config.fillStyle === TileFillStyle.DASHED ? ARC_CONSTANTS.DASHED_STROKE_PATTERN : 
                "none"
              }
              opacity={getOpacity(false, false, false, hoverStates, enableOpacityEffect)}
              fill={config.fillStyle !== TileFillStyle.FILLED ? "transparent" : config.colorTileBg}
            />
            
            {/* Filled part of the tile */}
            {fillRatio > 0 && (
              <path
                d={tileForegroundArc({} as any)}
                fill={fillColor}
                strokeWidth={ARC_CONSTANTS.STROKE_WIDTH_NORMAL}
                opacity={getOpacity(true, false, false, hoverStates, enableOpacityEffect)}
              />
            )}
          </g>
        );
      })}
      
      {/* Invisible overlay for hover detection */}
      <path
        d={d3.arc<d3.DefaultArcObject>()
          .innerRadius(radius * RADIUS_SCALES.HOVER_DETECTION)
          .outerRadius(radius)
          .startAngle(ANGLE_RANGE.START)
          .endAngle(ANGLE_RANGE.END)({} as any)}
        fill="transparent"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      />
    </>
  );
};

export default GaugeTiles;