import React from 'react';
import {useGaugeTheme} from "../theme/useGaugeTheme";
import {labelAngleFromNormalized} from "../core/gaugeGeometry";

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
                                                             fontSize,
                                                             fontColor,
                                                             tickLabelColor,
                                                             tickColor,
                                                             radiusScale
                                                         }) => {

    const theme = useGaugeTheme()
    // For backward compatibility, use tickLabelColor if provided, otherwise fall back to fontColor
    const labelColor = tickLabelColor || fontColor || theme.colors.tickLabel;
    const effectiveTickColor = tickColor ?? theme.colors.tick
    const effectiveRadiusScale = radiusScale ?? theme.radius.tickLabel;
    const effectiveFontSize = fontSize ?? theme.ticks.baseFontViewBoxUnits * scaleFactor;
    const tickStrokeWidth = Math.max(theme.ticks.minsStrokeWidth, scaleFactor);
    // Calculate the radius for the tick labels
    const tickLabelRadius = radius * effectiveRadiusScale;

    return (
        <>
            {tickLabels.map((value, index) => {
                // Normalize the value to the range [0, 1]
                const normalizedValue = value / thresholdRed;

                // Calculate the angle for this tick
                const angle = labelAngleFromNormalized(normalizedValue, theme.geometry);

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
                            stroke={effectiveTickColor}
                            strokeWidth={tickStrokeWidth}
                        />

                        {/* Label text */}
                        <text
                            x={labelX}
                            y={labelY}
                            textAnchor="middle"
                            dy={theme.ticks.textDy}
                            fill={labelColor}
                            fontSize={effectiveFontSize}
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