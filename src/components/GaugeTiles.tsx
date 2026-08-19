import React, {useMemo} from 'react';
import * as d3 from 'd3';
import {ElementType, getOpacity,} from '../utils/gaugeUtils';
import {TileFillStyle} from '../utils/constants';
import {computeTileSegments} from "../utils/computeTileSegment.ts";
import {useGaugeTheme} from "../theme/useGaugeTheme.ts";
import {buildArcPath} from "../utils/gaugeCalculations.ts";

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


interface TileSegmentProps {
    segment: ReturnType<typeof computeTileSegments>[number];
    hoverStates: GaugeTilesProps['hoverStates'];
    enableOpacityEffect: boolean;
    themeStrokeNormal: number;
    interaction: ReturnType<typeof useGaugeTheme>['interaction'];

}

const TileSegment: React.FC<TileSegmentProps> = ({
    segment, hoverStates, enableOpacityEffect, themeStrokeNormal, interaction
})=>(
    <g>
        <path
        d={segment.backgroundPath ?? undefined}
        stroke={segment.stroke}
        strokeWidth={segment.strokeWidth}
        strokeDasharray={segment.strokeDasharray}
        opacity={getOpacity(ElementType.NONE, hoverStates, enableOpacityEffect, interaction)}
        fill={segment.backgroundFill}
        />
        {segment.foregroundPath &&(
            <path
            d={segment.foregroundPath}
            fill={segment.fillColor}
            strokeWidth={themeStrokeNormal}
            opacity={getOpacity(ElementType.FILLED_TILE, hoverStates, enableOpacityEffect, interaction)}
            />
        )}

    </g>
)

/**
 * Component for rendering the tile arcs of the gauge
 */
const GaugeTiles: React.FC<GaugeTilesProps> = (props) => {
    const theme  = useGaugeTheme();

    const segments = useMemo(() =>computeTileSegments({
        tileAngles: props.tileAngles,
        numberOfTiles: props.numberOfTiles,
        sumNormalized: props.sumNormalized,
        thresholdRed: props.thresholdRed,
        radius: props.radius,
        scaleFactor: props.scaleFactor,
        isTileHovered: props.hoverStates.tile,
        enableOpacityEffect: props.enableOpacityEffect,
        colorScale: props.colorScale,
        config: props.config,
        theme
    }),[props, theme])

    const hoverOverlayPath = buildArcPath({
        innerRadius: props.radius * theme.interaction.hoverHitAreaInnerRatio,
        outerRadius: props.radius,
        startAngle: theme.geometry.startAngle,
        endAngle: theme.geometry.endAngle,
    })

    return(<>
        {segments.map((segment) => (
            <TileSegment
                key={segment.index}
                segment={segment}
                hoverStates={props.hoverStates}
                enableOpacityEffect={props.enableOpacityEffect}
                themeStrokeNormal={theme.stroke.normal}
                interaction={theme.interaction}
            />
        ))}
        <path
            d={hoverOverlayPath ?? undefined}
            fill={'transparent'}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            onMouseMove={props.onMouseMove}
            />
    </>)

};

export default GaugeTiles;