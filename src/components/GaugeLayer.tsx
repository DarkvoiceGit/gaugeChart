import React, {useMemo} from 'react';
import type * as d3 from 'd3';
import type {ResolvedLayer} from '../core/resolveLayers';
import type {LayerHandlers} from '../hooks/useGaugeInteraction';
import {computeTileSegments} from '../utils/computeTileSegment';
import {buildArcPath} from '../utils/gaugeCalculations';
import {useGaugeTheme} from '../theme/useGaugeTheme';

interface GaugeLayerProps {
    layer: ResolvedLayer;
    radius: number;
    scaleMax: number;
    scaleFactor: number;
    colorScale: d3.ScaleLinear<string, string>;
    hoveredLayerId: string | null;
    hoverDimming: boolean;
    getLayerOpacity: (layerId: string) => number;
    handlers: LayerHandlers;
}

const SolidGaugeLayer: React.FC<GaugeLayerProps> = ({
                                                        layer,
                                                        hoveredLayerId,
                                                        hoverDimming,
                                                        getLayerOpacity,
                                                        handlers,
                                                    }) => {
    const theme = useGaugeTheme();
    const isHovered = hoveredLayerId === layer.id;
    const sharedStroke = {
        stroke: theme.stroke.color,
        strokeWidth: theme.stroke.thin,
    };

    return (
        <>
            <path
                d={layer.solidPath ?? undefined}
                fill={layer.color}
                opacity={getLayerOpacity(layer.id)}
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
                                                            radius,
                                                            scaleMax,
                                                            scaleFactor,
                                                            colorScale,
                                                            hoveredLayerId,
                                                            hoverDimming,
                                                            getLayerOpacity,
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
            enableOpacityEffect: hoverDimming,
            colorScale,
            config: {
                ...layer.segmentedStyle,
                arcConfig: layer.arcConfig,
            },
            theme,
        }),
        [colorScale, hoverDimming, isHovered, layer, radius, scaleFactor, scaleMax, theme],
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
                        opacity={getLayerOpacity(`${layer.id}-bg`)}
                    />
                    {segment.foregroundPath && (
                        <path
                            d={segment.foregroundPath}
                            fill={segment.fillColor}
                            strokeWidth={theme.stroke.normal}
                            opacity={getLayerOpacity(layer.id)}
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