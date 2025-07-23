import React from 'react';
import * as d3 from 'd3';
import { getOpacity } from '../utils/gaugeUtils';
import { ANGLE_RANGE, RADIUS_SCALES, ARC_CONSTANTS } from '../utils/constants';

interface GaugeArcsProps {
  radius: number;
  normalizedValues: {
    primary: number;
    secondary: number;
    sum: number;
  };
  config: {
    primaryArc: {
      color: string;
      arcConfig: {
        cornerRadius: number;
        padAngle: number;
        padRadius: number;
      };
    };
    secondaryArc: {
      color: string;
      arcConfig: {
        cornerRadius: number;
        padAngle: number;
        padRadius: number;
      };
    };
  };
  hoverStates: {
    tile: boolean;
    primaryBar: boolean;
    secondaryBar: boolean;
  };
  enableOpacityEffect: boolean;
  onPrimaryMouseEnter: (event: React.MouseEvent) => void;
  onPrimaryMouseLeave: () => void;
  onPrimaryMouseMove?: (event: React.MouseEvent) => void;
  onSecondaryMouseEnter: (event: React.MouseEvent) => void;
  onSecondaryMouseLeave: () => void;
  onSecondaryMouseMove?: (event: React.MouseEvent) => void;
}

/**
 * Component for rendering the inner arcs of the gauge
 */
const GaugeArcs: React.FC<GaugeArcsProps> = ({
  radius,
  normalizedValues,
  config,
  hoverStates,
  enableOpacityEffect,
  onPrimaryMouseEnter,
  onPrimaryMouseLeave,
  onPrimaryMouseMove,
  onSecondaryMouseEnter,
  onSecondaryMouseLeave,
  onSecondaryMouseMove
}) => {
  const { primary: primaryNormalized, secondary: secondaryNormalized } = normalizedValues;
  const innerRadius = radius * RADIUS_SCALES.INNER_ARC;
  const outerRadius = radius * RADIUS_SCALES.OUTER_ARC;
  
  // Determine the start angle for the secondary arc based on hover state
  // Only adjust the start angle when opacity effects are enabled
  const secondaryStartAngle = (hoverStates.secondaryBar || hoverStates.tile) && enableOpacityEffect 
    ? d3.scaleLinear().domain([0, 1]).range([ANGLE_RANGE.START, ANGLE_RANGE.END])(primaryNormalized) 
    : ANGLE_RANGE.START + ARC_CONSTANTS.ANGLE_OFFSET;
  
  return (
    <>
      {/* Secondary Arc */}
      <path
        d={d3.arc<d3.DefaultArcObject>()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(secondaryStartAngle)
          .cornerRadius(config.secondaryArc.arcConfig.cornerRadius)
          .endAngle(Math.min(
            d3.scaleLinear().domain([0, 1]).range([ANGLE_RANGE.START, ANGLE_RANGE.END])(primaryNormalized + secondaryNormalized), 
            ANGLE_RANGE.END
          ))({} as any)}
        fill={config.secondaryArc.color}
        stroke={'#000'}
        strokeWidth={ARC_CONSTANTS.STROKE_WIDTH_THIN}
        opacity={getOpacity(false, false, true, hoverStates, enableOpacityEffect)}
        onMouseEnter={onSecondaryMouseEnter}
        onMouseLeave={onSecondaryMouseLeave}
        onMouseMove={onSecondaryMouseMove}
      />

      {/* Primary Arc */}
      <path
        d={d3.arc<d3.DefaultArcObject>()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(ANGLE_RANGE.START + ARC_CONSTANTS.ANGLE_OFFSET)
          .cornerRadius(config.primaryArc.arcConfig.cornerRadius)
          .endAngle(Math.min(
            d3.scaleLinear().domain([0, 1]).range([ANGLE_RANGE.START, ANGLE_RANGE.END])(primaryNormalized), 
            ANGLE_RANGE.END
          ))({} as any)}
        fill={config.primaryArc.color}
        stroke={'#000'}
        strokeWidth={ARC_CONSTANTS.STROKE_WIDTH_THIN}
        onMouseEnter={onPrimaryMouseEnter}
        onMouseLeave={onPrimaryMouseLeave}
        onMouseMove={onPrimaryMouseMove}
        opacity={getOpacity(false, true, false, hoverStates, enableOpacityEffect)}
      />

      {/* Hover effect for secondary arc */}
      {hoverStates.secondaryBar && enableOpacityEffect && (
        <path
          d={d3.arc<d3.DefaultArcObject>()
            .innerRadius(innerRadius * RADIUS_SCALES.HOVER_INNER_SCALE) // Slightly smaller inner radius for hover effect
            .outerRadius(outerRadius * RADIUS_SCALES.HOVER_OUTER_SCALE) // Slightly larger outer radius for hover effect
            .startAngle(d3.scaleLinear().domain([0, 1]).range([ANGLE_RANGE.START, ANGLE_RANGE.END])(primaryNormalized))
            .cornerRadius(config.secondaryArc.arcConfig.cornerRadius)
            .endAngle(Math.min(
              d3.scaleLinear().domain([0, 1]).range([ANGLE_RANGE.START, ANGLE_RANGE.END])(primaryNormalized + secondaryNormalized), 
              ANGLE_RANGE.END
            ))({} as any)}
          fill={config.secondaryArc.color}
          stroke="#000"
          strokeWidth={ARC_CONSTANTS.STROKE_WIDTH_THIN}
          opacity={1}
          onMouseEnter={onSecondaryMouseEnter}
          onMouseLeave={onSecondaryMouseLeave}
          onMouseMove={onSecondaryMouseMove}
          style={{pointerEvents: 'none'}} // Prevents re-triggering hover
        />
      )}

      {/* Hover effect for primary arc */}
      {hoverStates.primaryBar && enableOpacityEffect && (
        <path
          d={d3.arc<d3.DefaultArcObject>()
            .innerRadius(innerRadius * RADIUS_SCALES.HOVER_INNER_SCALE) // Slightly smaller inner radius for hover effect
            .outerRadius(outerRadius * RADIUS_SCALES.HOVER_OUTER_SCALE) // Slightly larger outer radius for hover effect
            .startAngle(ANGLE_RANGE.START + ARC_CONSTANTS.ANGLE_OFFSET)
            .cornerRadius(config.primaryArc.arcConfig.cornerRadius)
            .endAngle(Math.min(
              d3.scaleLinear().domain([0, 1]).range([ANGLE_RANGE.START, ANGLE_RANGE.END])(primaryNormalized), 
              ANGLE_RANGE.END
            ))({} as any)}
          fill={config.primaryArc.color}
          stroke="#000"
          strokeWidth={ARC_CONSTANTS.STROKE_WIDTH_THIN}
          opacity={1}
          onMouseEnter={onPrimaryMouseEnter}
          onMouseLeave={onPrimaryMouseLeave}
          onMouseMove={onPrimaryMouseMove}
          style={{pointerEvents: 'none'}} // Prevents re-triggering hover
        />
      )}
    </>
  );
};

export default GaugeArcs;