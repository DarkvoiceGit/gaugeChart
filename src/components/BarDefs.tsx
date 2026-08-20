import React from 'react';
import type * as d3 from 'd3';
import type {BarOrientation} from '../types';
import {normalize} from '../utils/gaugeCalculations';

export interface BarGradientLayer {
    id: string;
    segmentCount: number;
    tilePositions: { start: number; end: number }[];
    orientation: BarOrientation;
}

interface BarDefsProps {
    gradientLayers: BarGradientLayer[];
    scaleMax: number;
    colorScale: d3.ScaleLinear<string, string>;
}

const BarDefs = ({
                     gradientLayers,
                     scaleMax,
                     colorScale,
                 }: BarDefsProps) => {
    return (
        <>
            {gradientLayers.flatMap((layer) => (
                layer.tilePositions.map((_, index) => {
                    const tileValueRange = scaleMax / layer.segmentCount;
                    const tileMinValue = index * tileValueRange;
                    const tileMinValueNormalized = normalize(tileMinValue, scaleMax);
                    const tileValueRangeNormalized = normalize(tileValueRange, scaleMax);
                    const tileValue = tileMinValueNormalized + tileValueRangeNormalized;
                    const startColor = colorScale(tileValue);
                    const endColor = colorScale(tileValue + tileValueRangeNormalized);
                    const isHorizontal = layer.orientation === 'horizontal';

                    return (
                        <linearGradient
                            key={`${layer.id}-${index}`}
                            id={`gradient-${layer.id}-${index}`}
                            x1={isHorizontal ? '0%' : '0%'}
                            y1={isHorizontal ? '0%' : '100%'}
                            x2={isHorizontal ? '100%' : '0%'}
                            y2={isHorizontal ? '0%' : '0%'}
                        >
                            <stop offset="0%" stopColor={startColor}/>
                            <stop offset="100%" stopColor={endColor}/>
                        </linearGradient>
                    );
                })
            ))}
        </>
    );
};

export default BarDefs;