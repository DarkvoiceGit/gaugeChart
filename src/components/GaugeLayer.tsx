import React, {useMemo, useRef} from 'react';
import type * as d3 from 'd3';
import type {ResolvedLayer} from '../core/resolveLayers';
import type {LayerHandlers} from '../hooks/useGaugeInteraction';
import {computeTileSegments} from '../utils/computeTileSegment';
import {buildArcPath} from '../utils/gaugeCalculations';
import {useGaugeTheme} from '../theme/useGaugeTheme';
import {useAnimatedSvgAttribute} from "../hooks/useAnimatedSvgAttribute";

interface GaugeLayerProps {
    layer: ResolvedLayer;
    radius: number;
    scaleMax: number;
    scaleFactor: number;
    colorScale: d3.ScaleLinear<string, string>;
    hoveredLayerId: string | null;
    hoverDimming: boolean;
    animate: boolean,
    animationDurationMs: number;
    getLayerOpacity: (layerId: string) => number;
    handlers: LayerHandlers;
}

const SolidGaugeLayer: React.FC<GaugeLayerProps> = ({
                                                        layer,
                                                        hoveredLayerId,
                                                        hoverDimming,
                                                        animate,
                                                        animationDurationMs,
                                                        getLayerOpacity,
                                                        handlers,
                                                    }) => {
    const theme = useGaugeTheme();
    const pathRef = useRef<SVGPathElement>(null)
    const isHovered = hoveredLayerId === layer.id;
    const sharedStroke = {
        stroke: theme.stroke.color,
        strokeWidth: theme.stroke.thin,
    };

    useAnimatedSvgAttribute(pathRef, 'd', layer.solidPath, animate, animationDurationMs)

    return (
        <>
            <path
                ref={pathRef}
                d={layer.solidPath ?? undefined}
                fill={layer.color}
                opacity={getLayerOpacity(layer.id)}
                style={animate ? {transition: `opacity ${animationDurationMs}ms ease`} : undefined}
                {...sharedStroke}
                onMouseEnter={layer.hoverable ? handlers.onMouseEnter : undefined}
                onMouseLeave={layer.hoverable ? handlers.onMouseLeave : undefined}
                onMouseMove={layer.hoverable ? handlers.onMouseMove : undefined}
            />
            {isHovered && hoverDimming && (
                <path
                    d={layer.hoverSolidPath ?? undefined}
                    fill={layer.color}
                    opacity={theme.interaction.activeOpacity}
                    style={{pointerEvents: 'none'}}
                    {...sharedStroke}
                />
            )}
        </>
    );
};

const SegmentedGaugeLayer: React.FC<GaugeLayerProps> = ({
                                                            layer,
                                                            scaleMax,
                                                            scaleFactor,
                                                            colorScale,
                                                            hoveredLayerId,
                                                            hoverDimming,
                                                            animate, animationDurationMs,
                                                            getLayerOpacity,
                                                            handlers,
                                                        }) => {
    const theme = useGaugeTheme();
    const isHovered = hoveredLayerId === layer.id;

    const segments = useMemo(
        () => {
            if (!isHovered || !hoverDimming) {
                return layer.segments
            }

            return computeTileSegments({
                layerId: layer.id,
                tileAngles: layer.tileAngles,
                numberOfTiles: layer.segmentCount,
                sumNormalized: layer.normalizedValue,
                thresholdRed: scaleMax,
                innerRadius: layer.innerRadius,
                outerRadius: layer.outerRadius,
                scaleFactor,
                isTileHovered: true,
                enableOpacityEffect: true,
                colorScale,
                config: {
                    ...layer.segmentedStyle,
                    arcConfig: layer.arcConfig,
                },
                theme,
            })
        },
        [colorScale, hoverDimming, isHovered, layer, scaleFactor, scaleMax, theme],
    );

    const hoverOverlayPath = buildArcPath({
        innerRadius: layer.innerRadius,
        outerRadius: layer.outerRadius,
        startAngle: theme.geometry.startAngle,
        endAngle: theme.geometry.endAngle,
    });

    return (
        <>
            {segments.map((segment) => (
                <g key={segment.index}>
                    <path
                        d={segment.backgroundPath ?? undefined}
                        stroke={segment.stroke}
                        strokeWidth={segment.strokeWidth}
                        strokeDasharray={segment.strokeDasharray}
                        fill={segment.backgroundFill}
                        opacity={getLayerOpacity(`${layer.id}-bg`)}
                        style={animate ? {transition: `opacity ${animationDurationMs}ms ease`} : undefined}
                    />
                    {segment.foregroundPath && (
                        <path
                            d={segment.foregroundPath}
                            fill={segment.fillColor}
                            strokeWidth={theme.stroke.normal}
                            opacity={getLayerOpacity(layer.id)}
                            style={animate ? {transition: `opacity ${animationDurationMs}ms ease`} : undefined}
                        />
                    )}
                </g>
            ))}

            {layer.hoverable && (
                <path
                    d={hoverOverlayPath ?? undefined}
                    fill="transparent"
                    onMouseEnter={handlers.onMouseEnter}
                    onMouseLeave={handlers.onMouseLeave}
                    onMouseMove={handlers.onMouseMove}
                />
            )}
        </>
    );
};

const GaugeLayer: React.FC<GaugeLayerProps> = (props) => {
    if (props.layer.render === 'segmented') {
        return <SegmentedGaugeLayer {...props} />;
    }
    return <SolidGaugeLayer {...props} />;
};

export default GaugeLayer;