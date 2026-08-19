import React from 'react';
import {ElementType, getOpacity} from '../utils/gaugeUtils';
import {useGaugeTheme} from "../theme/useGaugeTheme.ts";
import {buildArcPath, valueToAngle} from "../utils/gaugeCalculations.ts";

interface ArcLayerPathProps{
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    cornerRadius: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;
    onMouseEnter?: (evt: React.MouseEvent) => void;
    onMouseLeave?: () => void;
    onMouseMove?: (evt: React.MouseEvent) => void;
    pointerEvents?: React.CSSProperties['pointerEvents'];
}

const ArcLayerPath: React.FC<ArcLayerPathProps>= ({
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    cornerRadius,
    fill,
    stroke,
    strokeWidth,
    opacity,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    pointerEvents
})=>(
    <path
        d={buildArcPath({innerRadius, outerRadius, startAngle, endAngle, cornerRadius}) ?? undefined}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        style={pointerEvents ? { pointerEvents } : undefined}
        />
)

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
   const theme = useGaugeTheme()
    const {primary: primaryNormalized, secondary: secondaryNormalized} = normalizedValues;
   const innerRadius = radius * theme.radius.innerArc;
   const outerRadius = radius * theme.radius.outerArc;
   const hoverInnerRadius = innerRadius * theme.interaction.hoverHighlight.innerScale
    const hoverOutRadius = outerRadius * theme.interaction.hoverHighlight.outerScale

    const secondaryEndAngle = valueToAngle(primaryNormalized + secondaryNormalized)
    const primaryEndAngle = valueToAngle(primaryNormalized)
    const primaryStartAngle = theme.geometry.startAngle + theme.geometry.angleOffset

    const secondaryStarkAngle = (hoverStates.secondaryBar || hoverStates.tile) && enableOpacityEffect ? valueToAngle(primaryNormalized): theme.geometry.startAngle + theme.geometry.angleOffset

    const sharedStroke = {
       stroke: theme.stroke.color,
        strokeWidth: theme.stroke.thin
    }
    return (
        <>
           <ArcLayerPath innerRadius={innerRadius} outerRadius={outerRadius} startAngle={secondaryStarkAngle} endAngle={secondaryEndAngle}
                         cornerRadius={config.secondaryArc.arcConfig.cornerRadius} fill={config.secondaryArc.color} opacity={getOpacity(ElementType.SECONDARY_BAR, hoverStates, enableOpacityEffect, theme.interaction)}
           onMouseEnter={onSecondaryMouseEnter}
                         onMouseLeave={onSecondaryMouseLeave}
                         onMouseMove={onSecondaryMouseMove}
                         {...sharedStroke}
           />

            <ArcLayerPath innerRadius={innerRadius} outerRadius={outerRadius} startAngle={primaryStartAngle} endAngle={primaryEndAngle}
                          cornerRadius={config.primaryArc.arcConfig.cornerRadius} fill={config.primaryArc.color} opacity={getOpacity(ElementType.PRIMARY_BAR, hoverStates, enableOpacityEffect, theme.interaction)}
                          onMouseEnter={onPrimaryMouseEnter}
                          onMouseLeave={onPrimaryMouseLeave}
                          onMouseMove={onPrimaryMouseMove}
                          {...sharedStroke}
            />

            {hoverStates.secondaryBar && enableOpacityEffect &&(
                <ArcLayerPath innerRadius={hoverInnerRadius} outerRadius={hoverOutRadius} startAngle={valueToAngle(primaryNormalized)} endAngle={secondaryEndAngle}
                              cornerRadius={config.secondaryArc.arcConfig.cornerRadius} fill={config.secondaryArc.color} opacity={theme.interaction.activeOpacity}
                              onMouseEnter={onSecondaryMouseEnter}
                              onMouseLeave={onSecondaryMouseLeave}
                              onMouseMove={onSecondaryMouseMove}
                              pointerEvents={"none"}
                              {...sharedStroke}
                />
            )}


            {hoverStates.primaryBar && enableOpacityEffect &&(
                <ArcLayerPath innerRadius={hoverInnerRadius} outerRadius={hoverOutRadius} startAngle={primaryNormalized} endAngle={primaryEndAngle}
                              cornerRadius={config.primaryArc.arcConfig.cornerRadius} fill={config.primaryArc.color} opacity={theme.interaction.activeOpacity}
                              onMouseEnter={onPrimaryMouseEnter}
                              onMouseLeave={onPrimaryMouseLeave}
                              onMouseMove={onPrimaryMouseMove}
                              pointerEvents={"none"}
                              {...sharedStroke}
                />
            )}
        </>
    );
};

export default GaugeArcs;