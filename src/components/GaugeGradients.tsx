import React from 'react';
import * as d3 from 'd3';

interface GaugeGradientsProps {
    tileAngles: number[];
    numberOfTiles: number;
    thresholdRed: number;
    colorScale: d3.ScaleLinear<string, string>;
}

/**
 * Component for rendering the gradient definitions used by the tiles
 */
const GaugeGradients: React.FC<GaugeGradientsProps> = ({
                                                           tileAngles,
                                                           numberOfTiles,
                                                           thresholdRed,
                                                           colorScale
                                                       }) => {
    // Helper function to normalize values
    const normalize = (value: number) => {
        return Math.min(1, value / thresholdRed);
    };

    return (
        <>
            {tileAngles.map((_, index) => {
                // Calculate the value range for this tile
                const tileValueRange = thresholdRed / numberOfTiles;
                const tileMinValue = index * tileValueRange;
                const tileMinValueNormalized = normalize(tileMinValue);
                const tileValueRangeNormalized = normalize(tileValueRange);

                // Calculate the normalized value for this tile
                const tileValue = tileMinValueNormalized + tileValueRangeNormalized;

                // Determine the colors for the gradient
                const startColor = colorScale(tileValue);
                const endColor = colorScale(tileValue + tileValueRangeNormalized);

                return (
                    <linearGradient
                        key={index}
                        id={`gradient-${index}`}
                        transform={'rotate(-90)'}
                        cx="50%"
                        cy="50%"
                        r="50%"
                        fx="50%"
                        fy="50%"
                    >
                        <stop offset="0%" stopColor={startColor}/>
                        <stop offset="100%" stopColor={endColor}/>
                    </linearGradient>
                );
            })}
        </>
    );
};

export default GaugeGradients;