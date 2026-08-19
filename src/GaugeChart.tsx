import React, {useMemo, useRef} from 'react';
import type {GaugeChartProps} from './types';
import {computeGaugeLayoutFromSize} from './utils/computeGaugeLayout';
import {resolvePointerStrokeScale} from './utils/pointerScale';
import {mergeTheme} from './theme/mergeTheme';
import {GaugeThemeProvider} from './theme/GaugeThemeContext';
import {resolveLayers} from './core/resolveLayers';
import {assertValidLayers, resolveChartSettings} from './core/resolveChartSettings';
import {useLayerInteraction} from './hooks/useLayerInteraction';
import GaugeTooltip from './GaugeTooltip';
import GaugePointer from './GaugePointer';
import GaugePointerMarkers from './components/GaugePointerMarkers';
import GaugeLayer from './components/GaugeLayer';
import GaugeTickLabels from './components/GaugeTickLabels';
import GaugeGradients from './components/GaugeGradients';

function logGaugeDebug(debugMode: boolean | undefined, payload: Record<string, unknown>): void {
    if (!debugMode) {
        return;
    }
    const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;
    if (nodeEnv === 'production') {
        return;
    }
    console.log('[Gauge] Debug mode:', payload);
}

const Gauge: React.FC<GaugeChartProps> = (props) => {
    const mergedTheme = useMemo(() => mergeTheme(props.theme), [props.theme]);
    const settings = useMemo(() => resolveChartSettings(props, mergedTheme), [props, mergedTheme]);

    assertValidLayers(props.layers);

    logGaugeDebug(props.debugMode, {
        scale: props.scale,
        layers: props.layers,
        interaction: props.interaction,
        ticks: props.ticks,
        theme: mergedTheme,
    });

    const svgRef = useRef<SVGSVGElement>(null);
    const layout = useMemo(
        () => computeGaugeLayoutFromSize(props.size, mergedTheme.layout, mergedTheme.radius),
        [props.size, mergedTheme.layout, mergedTheme.radius],
    );

    const resolved = useMemo(
        () => resolveLayers(props.layers, props.scale, layout.radius, mergedTheme, settings.tickStep),
        [props.layers, props.scale, layout.radius, mergedTheme, settings.tickStep],
    );

    const {tooltip, hoveredLayerId, getLayerHandlers} = useLayerInteraction(
        svgRef,
        resolved.layers,
        props.formatters,
        settings.tooltipMode,
    );

    const tickLabels = resolved.tickLabels;

    const gradientLayer = resolved.layers.find(
        (layer) => layer.render === 'segmented' && layer.segmentedStyle.isTileColorGradient,
    );

    return (
        <GaugeThemeProvider theme={mergedTheme}>
            <div style={{position: 'relative'}}>
                <svg
                    ref={svgRef}
                    width={layout.viewBoxWidth}
                    height={layout.viewBoxHeight}
                    viewBox={layout.viewBox}
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <GaugePointerMarkers markers={resolved.pointerMarkers}/>
                        {gradientLayer && (
                            <GaugeGradients
                                layerId={gradientLayer.id}
                                tileAngles={gradientLayer.tileAngles}
                                numberOfTiles={gradientLayer.segmentCount}
                                thresholdRed={settings.scaleMax}
                                colorScale={resolved.colorScale}
                            />
                        )}
                    </defs>

                    <g transform={`translate(${layout.logicalWidth / 2}, ${layout.logicalHeight / 2})`}>
                        {resolved.layers.map((layer) => (
                            <GaugeLayer
                                key={layer.id}
                                layer={layer}
                                radius={layout.radius}
                                scaleMax={settings.scaleMax}
                                scaleFactor={layout.scaleFactor}
                                colorScale={resolved.colorScale}
                                hoveredLayerId={hoveredLayerId}
                                enableOpacityEffect={settings.hoverDimming}
                                handlers={getLayerHandlers(layer.id)}
                            />
                        ))}

                        <g>
                            {resolved.pointers.map((pointer) => (
                                <GaugePointer
                                    key={pointer.layerId}
                                    x={pointer.x}
                                    y={pointer.y}
                                    color={pointer.color}
                                    markerId={pointer.layerId}
                                    strokeScale={resolvePointerStrokeScale(
                                        layout.scaleFactor,
                                        pointer.strokeScale,
                                        mergedTheme.scale.referenceScaleFactor,
                                    )}
                                />
                            ))}

                            <circle
                                cx={0}
                                cy={0}
                                r={layout.radius * (settings.hubScale / mergedTheme.hub.scaleDivisor)}
                                fill={settings.hubColor}
                            />
                        </g>

                        {settings.ticksEnabled && (
                            <GaugeTickLabels
                                radius={layout.radius}
                                tickLabels={tickLabels}
                                thresholdRed={settings.scaleMax}
                                unit={props.formatters?.tick}
                                scaleFactor={layout.scaleFactor}
                                fontSize={settings.tickFontSize}
                                tickColor={settings.tickColor}
                                tickLabelColor={settings.tickLabelColor}
                                fontColor={settings.fontColor}
                                radiusScale={settings.tickRadiusScale}
                            />
                        )}
                    </g>
                </svg>

                {tooltip && settings.tooltips && (
                    <GaugeTooltip
                        text={tooltip.text}
                        x={tooltip.x}
                        y={tooltip.y}
                        fontColor={settings.fontColor}
                        bgColor={settings.tooltipBackground}
                        theme={mergedTheme.tooltip}
                    />
                )}
            </div>
        </GaugeThemeProvider>
    );
};

export default Gauge;