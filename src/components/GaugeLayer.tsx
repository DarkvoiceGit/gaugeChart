import React, {useMemo} from 'react';
import type * as d3 from 'd3';
import type {ResolvedLayer} from '../core/resolveLayers';
import {getLayerOpacity} from '../utils/getLayerOpacity';
import {computeTileSegments} from '../utils/computeTileSegment';
import {buildArcPath} from '../utils/gaugeCalculations';
import {useGaugeTheme} from '../theme/useGaugeTheme';

interface LayerHandlers {
    onMouseEnter: (event: React.MouseEvent) => void;
    onMouseMove: (event: React.MouseEvent) => void;
    onMouseLeave: () => void;
}

interface GaugeLayerProps {
    layer: ResolvedLayer;
    radius: number;
    scaleMax: number;
    scaleFactor: number;
    colorScale: d3.ScaleLinear<string, string>;
    hoveredLayerId: string | null;
    enableOpacityEffect: boolean;
    handlers: LayerHandlers;
}

const SolidGaugeLayer: React.FC<GaugeLayerProps> = ({
                                                        layer,
                                                        hoveredLayerId,
                                                        enableOpacityEffect,
                                                        handlers,
                                                    }) => {
    const theme = useGaugeTheme();
    const isHovered = hoveredLayerId === layer.id;
    const opacity = getLayerOpacity(layer.id, hoveredLayerId, enableOpacityEffect, theme.interaction);
    const sharedStroke = {
        stroke: theme.stroke.color,
        strokeWidth: theme.stroke.thin,
    };

    return (
        <>
            <path
                d={layer.solidPath ?? undefined}
                fill={layer.color}
                opacity={opacity}
                {...sharedStroke}
                onMouseEnter={layer.hoverable ? handlers.onMouseEnter : undefined}
                onMouseLeave={layer.hoverable ? handlers.onMouseLeave : undefined}
                onMouseMove={layer.hoverable ? handlers.onMouseMove : undefined}
            />
            {isHovered && enableOpacityEffect && (
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
                                                            radius,
                                                            scaleMax,
                                                            scaleFactor,
                                                            colorScale,
                                                            hoveredLayerId,
                                                            enableOpacityEffect,
                                                            handlers,
                                                        }) => {
    const theme = useGaugeTheme();
    const isHovered = hoveredLayerId === layer.id;

    const segments = useMemo(
        () => computeTileSegments({
            layerId: layer.id,
            tileAngles: layer.tileAngles,
            numberOfTiles: layer.segmentCount,
            sumNormalized: layer.normalizedValue,
            thresholdRed: scaleMax,
            radius,
            scaleFactor,
            isTileHovered: isHovered,
            enableOpacityEffect,
            colorScale,
            config: {
                ...layer.segmentedStyle,
                arcConfig: layer.arcConfig,
            },
            theme,
        }),
        [colorScale, enableOpacityEffect, isHovered, layer, radius, scaleFactor, scaleMax, theme],
    );

    const hoverOverlayPath = buildArcPath({
        innerRadius: radius * theme.interaction.hoverHitAreaInnerRatio,
        outerRadius: radius,
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
                        opacity={getLayerOpacity(`${layer.id}-bg`, hoveredLayerId, enableOpacityEffect, theme.interaction)}
                    />
                    {segment.foregroundPath && (
                        <path
                            d={segment.foregroundPath}
                            fill={segment.fillColor}
                            strokeWidth={theme.stroke.normal}
                            opacity={getLayerOpacity(layer.id, hoveredLayerId, enableOpacityEffect, theme.interaction)}
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