import React, {useMemo, useRef} from 'react';
import {getBarLayerHitArea, ResolvedBarLayer} from '../core/resolveBarLayers';
import {LayerHandlers} from '../hooks/useGaugeInteraction';
import {useGaugeTheme} from "../theme/useGaugeTheme.ts";
import {useAnimatedSvgAttribute} from "../hooks/useAnimatedSvgAttribute.ts";
import {computeBarTileSegments} from "../utils/computeBarTileSegments.ts";

interface BarLayerProps {
    layer: ResolvedBarLayer;
    trackLength: number;
    scaleMax: number;
    scaleFactor: number;
    colorScale: d3.ScaleLinear<string, string>;
    hoveredLayerId: string | null;
    hoverDimming: boolean;
    animate: boolean;
    animationDurationMs: number;
    getLayerOpacity: (layerId: string) => number;
    handlers: LayerHandlers;
}

const SolidBarLayer : React.FC<BarLayerProps> = ({
    layer,
    hoveredLayerId,
    hoverDimming,
    animate,
    animationDurationMs,
    getLayerOpacity,
    handlers
}) =>{
    const theme = useGaugeTheme()
    const rectRef = useRef<SVGRectElement>(null);
    const isHovered = hoveredLayerId === hoveredLayerId;
    const solidRect = layer.solidRect
    const animatedAttribute = layer.orientation === 'horizontal' ? 'width' : 'height';
    const animatedValue = layer.orientation === 'horizontal' ? solidRect?.width : solidRect?.height;

    useAnimatedSvgAttribute(rectRef, animatedAttribute, animatedValue ?? null, animate, animationDurationMs)

    if(!solidRect) {
        return null
    }

    const sharedStroke = {
        stroke : theme.stroke.color,
        strokeWidth : theme.stroke.thin
    }

    return (
        <>
        <rect
            ref={rectRef}
            x={solidRect.x}
            y={solidRect.y}
            width={solidRect.width}
            height={solidRect.height}
            rx={solidRect.rx}
            fill={layer.color}
            opacity={getLayerOpacity(layer.id)}
            style={animate ? {transition: `opacity ${animatedValue}ms ease`} : undefined}
            {...sharedStroke}
            onMouseEnter={layer.hoverable ? handlers.onMouseEnter : undefined}
            onMouseLeave={layer.hoverable ? handlers.onMouseLeave : undefined}
            onMouseMove={layer.hoverable ? handlers.onMouseMove : undefined}
            />
            {isHovered && hoverDimming && layer.hoverSolidRect &&(
                <rect
                    x = {layer.hoverSolidRect.x}
                    y = {layer.hoverSolidRect.y}
                    width = {layer.hoverSolidRect.width}
                    height = {layer.hoverSolidRect.height}
                    rx = {layer.hoverSolidRect.rx}
                    fill={layer.color}
                    opacity={theme.interaction.activeOpacity}
                    style={{pointerEvents: 'none'}}
                    {...sharedStroke}
                    />
            )}
        </>
    )
}

const SegmentedBarLayer: React.FC<BarLayerProps> =({
    layer,
    trackLength,
    scaleMax,
    scaleFactor,
    colorScale,
    hoveredLayerId,
    hoverDimming,
    animate,
    animationDurationMs,
    getLayerOpacity,
    handlers
                                                   })=>{
    const theme = useGaugeTheme()
    const isHovered = hoveredLayerId === hoveredLayerId;
    const hitArea = getBarLayerHitArea(layer, trackLength)

    const segments = useMemo(()=>{
        if(!isHovered || !hoverDimming){
            return layer.segments
        }

        return computeBarTileSegments({
            layerId: layer.id,
            tilePositions: layer.tilePositions,
            numberOfTiles: layer.segmentCount,
            sumNormalized: layer.normalizedValue,
            thresholdRed: scaleMax,
            orientation: layer.orientation,
            trackInner: layer.trackInner,
            trackOuter: layer.trackOuter,
            scaleFactor,
            isTileHovered: true,
            enableOpacityEffect: true,
            colorScale,
            config: {
                ...layer.segmentedStyle,
                cornerRadius: layer.barConfig.cornerRadius
            }
            , theme
        })
    }, [colorScale, hoverDimming, isHovered, layer, scaleFactor, scaleMax, theme])

    return (
        <>
            {segments.map((segment)=>(
                <g key={segment.index}>
                    {segment.backgroundRect && (
                        <rect
                            x={segment.backgroundRect.x}
                            y={segment.backgroundRect.y}
                            width={segment.backgroundRect.width}
                            height={segment.backgroundRect.height}
                            rx={segment.backgroundRect.rx}
                            fill={segment.backgroundFill}
                            stroke={segment.stroke}
                            strokeWidth={segment.strokeWidth}
                            strokeDasharray={segment.strokeDasharray}
                            opacity={getLayerOpacity(`${layer.id}-bg`)}
                            style={animate ? {transition: `opacity ${animationDurationMs}ms ease`} : undefined}
                        />
                    )}
                    {segment.foregroundRect && (
                        <rect
                            x={segment.foregroundRect.x}
                            y={segment.foregroundRect.y}
                            width={segment.foregroundRect.width}
                            height={segment.foregroundRect.height}
                            rx={segment.foregroundRect.rx}
                            fill={segment.fillColor}
                            stroke={theme.stroke.color}
                            strokeWidth={theme.stroke.normal}
                            opacity={getLayerOpacity(layer.id)}
                            style={animate ? {transition: `opacity ${animationDurationMs}ms ease`} : undefined}
                        />
                    )}
                </g>
            ))}
            {layer.hoverable && (
                <rect
                x={hitArea.x}
                y={hitArea.y}
                width={hitArea.width}
                height={hitArea.height}
                fill={'transparent'}
                onMouseEnter={handlers.onMouseEnter}
                onMouseLeave={handlers.onMouseLeave}
                onMouseMove={handlers.onMouseMove}
                />
            )}
        </>
    )
}

export function BarLayer(props:BarLayerProps) {
    if(props.layer.render === 'segmented'){
        return <SegmentedBarLayer {...props} />
    }
    return <SolidBarLayer {...props} />
}
