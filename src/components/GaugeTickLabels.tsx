import React from 'react';
import * as d3 from 'd3';
import {ANGLE_RANGE, RADIUS_SCALES} from '../utils/constants';

interface GaugeTickLabelsProps {
    radius: number;
    tickLabels: number[];
    thresholdRed: number;
    unit?: (value: number) => string;
    scaleFactor: number;
    fontSize?: string;
    fontColor?: string;
    tickLabelColor?: string;
    tickColor?: string;
    radiusScale?: number;
}

/**
 * Component for rendering the tick labels around the gauge
 */
const GaugeTickLabels: React.FC<GaugeTickLabelsProps> = ({
                                                             radius,
                                                             tickLabels,
                                                             thresholdRed,
                                                             unit,
                                                             scaleFactor,
                                                             fontSize = '1rem',
                                                             fontColor = '#fff',
                                                             tickLabelColor,
                                                             tickColor = '#000',
                                                             radiusScale = RADIUS_SCALES.TICK_LABEL
                                                         }) => {
    // For backward compatibility, use tickLabelColor if provided, otherwise fall back to fontColor
    const labelColor = tickLabelColor || fontColor;
    // Calculate the radius for the tick labels
    const tickLabelRadius = radius * radiusScale;

    // Create a scale for mapping values to angles
    const angleScale = d3.scaleLinear()
        .domain([0, 1])
        .range([ANGLE_RANGE.START, ANGLE_RANGE.END]);

    return (
        <>
            {tickLabels.map((value, index) => {
                // Normalize the value to the range [0, 1]
                const normalizedValue = value / thresholdRed;

                // Calculate the angle for this tick
                const angle = angleScale(normalizedValue) - Math.PI / 2;

                // Calculate the position for the label
                const labelX = Math.cos(angle) * tickLabelRadius;
                const labelY = Math.sin(angle) * tickLabelRadius;

                // Calculate the position for the tick line
                const tickStartX = Math.cos(angle) * radius;
                const tickStartY = Math.sin(angle) * radius;
                const tickEndX = Math.cos(angle) * tickLabelRadius;
                const tickEndY = Math.sin(angle) * tickLabelRadius;

                return (
                    <g key={index}>
                        {/* Tick line */}
                        <line
                            x1={tickStartX}
                            y1={tickStartY}
                            x2={tickEndX}
                            y2={tickEndY}
                            stroke={tickColor}
                            strokeWidth={1}
                        />

                        {/* Label text */}
                        <text
                            x={labelX}
                            y={labelY}
                            textAnchor="middle"
                            dy="0.35em"
                            fill={labelColor}
                            fontSize={fontSize ? fontSize : `${scaleFactor}rem`}
                        >
                            {unit ? unit(Math.round(value)) : Math.round(value)}
                        </text>
                    </g>
                );
            })}
        </>
    );
};

export default GaugeTickLabels;