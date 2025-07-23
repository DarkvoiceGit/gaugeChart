import React, {useCallback, useRef, useState} from 'react';
import * as d3 from 'd3';
import {GaugeProps, TooltipState} from './types';
import {
  ANGLE_RANGE,
  ARC_CONSTANTS,
  OPTIONS_DEFAULTS,
  PRIMARY_ARC_DEFAULTS, RADIUS_SCALES,
  REFERENCE_WIDTH,
  SECONDARY_ARC_DEFAULTS,
  TILE_ARC_DEFAULTS
} from './utils/constants';
import {calculatePointer, normalize} from './utils/gaugeCalculations';
import {colorSelector, formatValue} from './utils/gaugeUtils';
import GaugeTooltip from './GaugeTooltip';
import GaugePointer from './GaugePointer';
import GaugeArcs from './components/GaugeArcs';
import GaugeTickLabels from './components/GaugeTickLabels';
import GaugeGradients from './components/GaugeGradients';
import GaugeTiles from './components/GaugeTiles';

/**
 * Gauge Chart Component
 * Renders a semi-circular gauge chart with customizable appearance and behavior
 */
const Gauge: React.FC<GaugeProps> = ({
  width = 800,
  height = 600,
  primary,
  secondary,
  options,
  tileArc,
  primaryArcConfig,
  secondaryArcConfig,
  unitTickFormatter,
  unit
}) => {
  // Merge default options with provided options
  const {
    withOpacitySwitch,
    enableInnerArc,
    circleScale,
    thresholdRed,
    thresholdYellow,
    enableToolTip,
    enableUnitTicks,
  } = { ...OPTIONS_DEFAULTS, ...options };

  // Merge default tile arc config with provided config
  const {
    tiles,
    colorTileThresholdYellow,
    colorTileThresholdRed,
    colorTileThresholdDefault,
    isTileColorGradient,
    gradientType,
    colorTileBg,
    fillStyle,
    borderColor,
    borderThickness,
    tickEveryNThStep,
    arcConfig: tileArcCfg,
    toolTipLabel: TileTooltipLabel
  } = { ...TILE_ARC_DEFAULTS, ...tileArc };

  // Merge default secondary arc config with provided config
  const {
    arcConfig: secondaryArcCfg,
    pointerSumConfig,
    colorSecondaryBar,
    toolTipLabel: secondaryToolTipLabel
  } = { ...SECONDARY_ARC_DEFAULTS, ...secondaryArcConfig };

  // Merge default primary arc config with provided config
  const {
    arcConfig: primaryArcCfg,
    pointerPrimaryConfig,
    colorPrimaryBar,
    toolTipLabel: primaryToolTipLabel
  } = { ...PRIMARY_ARC_DEFAULTS, ...primaryArcConfig };

  // Calculate the number of tiles
  const numTiles = tiles === undefined || tiles <= 0 ? 1 : tiles;
  
  // Create refs and state
  const ref = useRef<SVGSVGElement>(null);
  const [isTileHovered, setIsTileHovered] = useState<boolean>(false);
  const [isBarPrimaryHovered, setIsBarPrimaryHovered] = useState<boolean>(false);
  const [isBarSecondaryHovered, setIsBarSecondaryHovered] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Calculate values
  const value = primary + (secondary ? secondary : 0);

  // Normalize values
  const primaryNormalized = normalize(primary, thresholdRed);
  const secondaryNormalized = normalize(secondary ? secondary : 0, thresholdRed);
  const sumNormalized = normalize(value, thresholdRed);
  const thresholdYellowNormalized = normalize(thresholdYellow, thresholdRed);
  const thresholdRedNormalized = 1;

  // Calculate radius and scaling
  const radius = Math.min(width, height) / 2.2;
  const scaleFactor = width / REFERENCE_WIDTH;

  // Create color scale for gradients
  const colorScale = d3.scaleLinear<string>()
    .domain([0, thresholdYellowNormalized, thresholdRedNormalized])
    .range([colorTileThresholdDefault, colorTileThresholdYellow, colorTileThresholdRed]);

  // Calculate angles for tiles
  const tileAngles = d3.range(-Math.PI / 2, Math.PI / 2, (Math.PI) / numTiles);

  // Calculate tick labels
  const tickLabels = d3.range(
    0, 
    thresholdRed + 1, 
    tickEveryNThStep === 0 ? thresholdRed / numTiles : tickEveryNThStep
  );

  // Calculate pointers
  const primaryPointer = calculatePointer(primaryNormalized, radius, 0.7 * pointerPrimaryConfig.scale);
  const secondaryPointer = calculatePointer(sumNormalized, radius, 0.85 * pointerSumConfig.scale);

  // Event handlers for hover effects
  const updateTooltipPosition = useCallback((event: React.MouseEvent) => {
    if (tooltip) {
      const bbox = ref.current?.getBoundingClientRect() ?? { left: 0, top: 0 };
      setTooltip({
        ...tooltip,
        x: event.clientX - bbox.left,
        y: event.clientY - bbox.top,
      });
    }
  }, [tooltip]);

  const handleBarPrimaryMouseEnter = useCallback((event: React.MouseEvent) => {
    const bbox = ref.current?.getBoundingClientRect() ?? { left: 0, top: 0 };
    const formattedPrimaryValue = formatValue(primary, unitTickFormatter, unit);

    setTooltip({
      text: [
        {
          label: primaryToolTipLabel ? primaryToolTipLabel + ':' : 'Primary:',
          value: formattedPrimaryValue,
          color: colorPrimaryBar
        },
      ],
      x: event.clientX - bbox.left,
      y: event.clientY - bbox.top,
    });

    setIsBarPrimaryHovered(true);
  }, [primary, unitTickFormatter, unit, colorPrimaryBar, primaryToolTipLabel]);

  const handleBarPrimaryMouseMove = useCallback((event: React.MouseEvent) => {
    updateTooltipPosition(event);
  }, [updateTooltipPosition]);

  const handleBarPrimaryMouseLeave = () => {
    setTooltip(null);
    setIsBarPrimaryHovered(false);
  };

  const handleBarSecondaryMouseEnter = useCallback((event: React.MouseEvent) => {
    const bbox = ref.current?.getBoundingClientRect() ?? { left: 0, top: 0 };
    const formattedSecondaryValue = secondary ? formatValue(secondary, unitTickFormatter, unit) : '';
    
    setTooltip({
      text: [
        {
          label: secondaryToolTipLabel ? secondaryToolTipLabel + ':' : 'Secondary:',
          value: formattedSecondaryValue,
          color: colorSecondaryBar,
        },
      ],
      x: event.clientX - bbox.left,
      y: event.clientY - bbox.top,
    });
    
    setIsBarSecondaryHovered(true);
  }, [secondary, unitTickFormatter, unit, colorSecondaryBar, secondaryToolTipLabel]);

  const handleBarSecondaryMouseMove = useCallback((event: React.MouseEvent) => {
    updateTooltipPosition(event);
  }, [updateTooltipPosition]);

  const handleBarSecondaryMouseLeave = () => {
    setTooltip(null);
    setIsBarSecondaryHovered(false);
  };

  const handleTileMouseEnter = useCallback((event: React.MouseEvent) => {
    const bbox = ref.current?.getBoundingClientRect() ?? { left: 0, top: 0 };
    const formattedValue = formatValue(value, unitTickFormatter, unit);
    const formattedPrimaryValue = formatValue(primary, unitTickFormatter, unit);
    const formattedSecondaryValue = secondary ? formatValue(secondary, unitTickFormatter, unit) : '';
    
    setTooltip({
      text: [
        {
          label: TileTooltipLabel ? TileTooltipLabel + ':' : 'Sum:',
          value: formattedValue,
          color: colorSelector(
            thresholdRed,
            thresholdYellow,
            colorTileThresholdRed,
            colorTileThresholdYellow,
            colorTileThresholdDefault,
            value
          )
        },
        ...(primary && enableInnerArc ? [{
          label: primaryToolTipLabel ? primaryToolTipLabel + ':' : 'Primary:',
          value: formattedPrimaryValue,
          color: colorSelector(
            thresholdRed,
            thresholdYellow,
            colorTileThresholdRed,
            colorTileThresholdYellow,
            colorTileThresholdDefault,
            primary
          )
        }] : []),
        ...(secondary && enableInnerArc ? [{
          label: secondaryToolTipLabel ? secondaryToolTipLabel + ':' : 'Secondary:',
          value: formattedSecondaryValue,
          color: colorSelector(
            thresholdRed,
            thresholdYellow,
            colorTileThresholdRed,
            colorTileThresholdYellow,
            colorTileThresholdDefault,
            secondary
          )
        }] : []),
      ],
      x: event.clientX - bbox.left,
      y: event.clientY - bbox.top,
    });
    
    setIsTileHovered(true);
  }, [
    secondary, 
    unitTickFormatter, 
    unit, 
    primary, 
    value, 
    thresholdRed, 
    thresholdYellow, 
    colorTileThresholdRed, 
    colorTileThresholdYellow, 
    colorTileThresholdDefault, 
    TileTooltipLabel, 
    primaryToolTipLabel, 
    secondaryToolTipLabel, 
    enableInnerArc
  ]);

  const handleTileMouseMove = useCallback((event: React.MouseEvent) => {
    updateTooltipPosition(event);
  }, [updateTooltipPosition]);

  const handleTileMouseLeave = () => {
    setTooltip(null);
    setIsTileHovered(false);
  };

  // Hover states for opacity calculations
  const hoverStates = {
    tile: isTileHovered,
    primaryBar: isBarPrimaryHovered,
    secondaryBar: isBarSecondaryHovered
  };

  // Configuration for tile colors
  const tileColorConfig = {
    isTileColorGradient,
    gradientType,
    thresholdYellowNormalized,
    thresholdRedNormalized,
    colorTileThresholdDefault,
    colorTileThresholdYellow,
    colorTileThresholdRed,
    colorTileBg,
    fillStyle,
    borderColor,
    borderThickness,
    arcConfig: tileArcCfg
  };

  // Configuration for arcs
  const arcsConfig = {
    primaryArc: {
      color: colorPrimaryBar,
      arcConfig: primaryArcCfg
    },
    secondaryArc: {
      color: colorSecondaryBar,
      arcConfig: secondaryArcCfg
    }
  };

  console.log('isBarPrimaryHovered: ' + isBarPrimaryHovered)
  console.log('isBarSecondaryHovered: ' + isBarSecondaryHovered)
  console.log('isTileHovered: ' + isTileHovered)
  return (
    <div style={{ position: 'relative' }}>
      <svg ref={ref} width={width} height={height}>
        <defs>
          {/* Gradient definitions for tiles */}
          <GaugeGradients
            tileAngles={tileAngles}
            numberOfTiles={numTiles}
            thresholdRed={thresholdRed}
            colorScale={colorScale}
          />
        </defs>
        
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {/* Inner arcs for primary and secondary values */}
          {enableInnerArc && (
            <GaugeArcs
              radius={radius}
              normalizedValues={{
                primary: primaryNormalized,
                secondary: secondaryNormalized,
                sum: sumNormalized
              }}
              config={arcsConfig}
              hoverStates={hoverStates}
              enableOpacityEffect={withOpacitySwitch}
              onPrimaryMouseEnter={handleBarPrimaryMouseEnter}
              onPrimaryMouseLeave={handleBarPrimaryMouseLeave}
              onPrimaryMouseMove={handleBarPrimaryMouseMove}
              onSecondaryMouseEnter={handleBarSecondaryMouseEnter}
              onSecondaryMouseLeave={handleBarSecondaryMouseLeave}
              onSecondaryMouseMove={handleBarSecondaryMouseMove}
            />
          )}

          {/* Tiles for the gauge */}
          <GaugeTiles
            radius={radius}
            tileAngles={tileAngles}
            numberOfTiles={numTiles}
            sumNormalized={sumNormalized}
            thresholdRed={thresholdRed}
            colorScale={colorScale}
            config={tileColorConfig}
            hoverStates={hoverStates}
            enableOpacityEffect={withOpacitySwitch}
            scaleFactor={scaleFactor}
            onMouseEnter={handleTileMouseEnter}
            onMouseLeave={handleTileMouseLeave}
            onMouseMove={handleTileMouseMove}
          />

          {/* Pointers */}
          <g>
            {secondaryNormalized !== 0 && primaryNormalized !== sumNormalized && enableInnerArc && (
              <GaugePointer 
                x={primaryPointer.x} 
                y={primaryPointer.y} 
                color={pointerPrimaryConfig.color}
                markerId={'primary'}
                pointerScale={pointerPrimaryConfig.scale}
                strokeScale={
                  scaleFactor === 1 || pointerPrimaryConfig.strokeScale !== 1 
                    ? pointerPrimaryConfig.strokeScale 
                    : pointerPrimaryConfig.strokeScale * scaleFactor
                }
              />
            )}
            
            <GaugePointer 
              x={secondaryPointer.x} 
              y={secondaryPointer.y} 
              color={pointerSumConfig.color}
              markerId={'secondary'}
              pointerScale={pointerSumConfig.scale}
              strokeScale={
                scaleFactor === 1 || pointerSumConfig.strokeScale !== 1 
                  ? pointerSumConfig.strokeScale 
                  : pointerSumConfig.strokeScale * scaleFactor
              }
            />
            
            {/* Center circle */}
            <circle
              cx={0}
              cy={0}
              r={radius * (circleScale / 10)}
              fill={'black'}
            />
          </g>


          {/* Hovered Elements (rendered last to appear on highest layer) */}
          {isBarSecondaryHovered && withOpacitySwitch && enableInnerArc && (
            <path
              d={d3.arc<d3.DefaultArcObject>()
                .innerRadius(radius * RADIUS_SCALES.INNER_ARC * RADIUS_SCALES.HOVER_INNER_SCALE)
                .outerRadius(radius * RADIUS_SCALES.OUTER_ARC * RADIUS_SCALES.HOVER_OUTER_SCALE)
                .startAngle(d3.scaleLinear().domain([0, 1]).range([ANGLE_RANGE.START, ANGLE_RANGE.END])(primaryNormalized))
                .cornerRadius(secondaryArcCfg.cornerRadius)
                .endAngle(Math.min(
                  d3.scaleLinear().domain([0, 1]).range([ANGLE_RANGE.START, ANGLE_RANGE.END])(primaryNormalized + secondaryNormalized), 
                  ANGLE_RANGE.END
                ))({} as any)}
              fill={colorSecondaryBar}
              stroke="#000"
              strokeWidth={ARC_CONSTANTS.STROKE_WIDTH_THIN}
              opacity={1}
              onMouseEnter={handleBarSecondaryMouseEnter}
              onMouseLeave={handleBarSecondaryMouseLeave}
              onMouseMove={handleBarSecondaryMouseMove}
              style={{pointerEvents: 'none'}} // Prevents re-triggering hover
            />
          )}
          {isBarPrimaryHovered && withOpacitySwitch && enableInnerArc && (
            <path
              d={d3.arc<d3.DefaultArcObject>()
                .innerRadius(radius * RADIUS_SCALES.INNER_ARC * RADIUS_SCALES.HOVER_INNER_SCALE)
                .outerRadius(radius * RADIUS_SCALES.OUTER_ARC * RADIUS_SCALES.HOVER_OUTER_SCALE)
                .startAngle(ANGLE_RANGE.START + ARC_CONSTANTS.ANGLE_OFFSET)
                .cornerRadius(primaryArcCfg.cornerRadius)
                .endAngle(Math.min(
                  d3.scaleLinear().domain([0, 1]).range([ANGLE_RANGE.START, ANGLE_RANGE.END])(primaryNormalized), 
                  ANGLE_RANGE.END
                ))({} as any)}
              fill={colorPrimaryBar}
              stroke="#000"
              strokeWidth={ARC_CONSTANTS.STROKE_WIDTH_THIN}
              opacity={1}
              onMouseEnter={handleBarPrimaryMouseEnter}
              onMouseLeave={handleBarPrimaryMouseLeave}
              onMouseMove={handleBarPrimaryMouseMove}
              style={{pointerEvents: 'none'}} // Prevents re-triggering hover
            />
          )}

          {/* Tick labels */}
          {enableUnitTicks && (
            <GaugeTickLabels
              radius={radius}
              tickLabels={tickLabels}
              thresholdRed={thresholdRed}
              unit={unit}
              scaleFactor={scaleFactor}
              fontSize={`${scaleFactor}rem`}
            />
          )}
        </g>
      </svg>
      
      {/* Tooltip */}
      {tooltip && enableToolTip && (
        <GaugeTooltip 
          text={tooltip.text} 
          x={tooltip.x} 
          y={tooltip.y}
        />
      )}
    </div>
  );
};

export default Gauge;