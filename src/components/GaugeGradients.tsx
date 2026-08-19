import React from 'react';
import {useGaugeTheme} from "../theme/useGaugeTheme";
import {normalize} from "../utils/gaugeCalculations";

interface GaugeGradientsProps {
    layerId: string;
    tileAngles: number[];
    numberOfTiles: number;
    thresholdRed: number;
    colorScale: d3.ScaleLinear<string, string>;
}

const GaugeGradients: React.FC<GaugeGradientsProps> = ({
                                                           layerId,
                                                           tileAngles,
                                                           numberOfTiles,
                                                           thresholdRed,
                                                           colorScale
                                                       }) => {
    const theme = useGaugeTheme()

    return (
        <>
            {tileAngles.map((_, index) => {
                // Calculate the value range for this tile
                const tileValueRange = thresholdRed / numberOfTiles;
                const tileMinValue = index * tileValueRange;
                const tileMinValueNormalized = normalize(tileMinValue, thresholdRed);
                const tileValueRangeNormalized = normalize(tileValueRange, thresholdRed);

                // Calculate the normalized value for this tile
                const tileValue = tileMinValueNormalized + tileValueRangeNormalized;

                // Determine the colors for the gradient
                const startColor = colorScale(tileValue);
                const endColor = colorScale(tileValue + tileValueRangeNormalized);

                return (
                    <linearGradient
                        key={`${layerId}-${index}`}
                        id={`gradient-${layerId}-${index}`}
                        gradientTransform={`rotate(${theme.gradient.rotationDegrees})`}
                    >
                        <stop offset={theme.gradient.stopStart} stopColor={startColor}/>
                        <stop offset={theme.gradient.stopEnd} stopColor={endColor}/>
                    </linearGradient>
                );
            })}
        </>
    );
};

export default GaugeGradients;