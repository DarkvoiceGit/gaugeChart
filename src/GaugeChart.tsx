import React, {useMemo, useRef} from 'react';
import type {GaugeChartProps} from './types';
import {computeGaugeLayoutFromSize} from './utils/computeGaugeLayout';
import {mergeTheme} from './theme/mergeTheme';
import {GaugeThemeProvider} from './theme/GaugeThemeContext';
import {resolveLayers} from './core/resolveLayers';
import {assertValidLayers, resolveChartSettings} from './core/resolveChartSettings';
import GaugeTooltip from './GaugeTooltip';
import GaugeLayer from './components/GaugeLayer';
import GaugeTickLabels from './components/GaugeTickLabels';
import {useGaugeInteraction} from "./hooks/useGaugeInteraction.ts";
import GaugeDefs from "./components/GaugeDefs.tsx";
import GaugeHub from "./components/GaugeHub.tsx";
import GaugePointers from "./components/GaugePointers.tsx";
import {resolveGeometry} from "./core/gaugeGeometry.ts";
import {assertValidGeometry} from "./utils/gaugeGuards.ts";

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
    const mergedTheme = useMemo(() => {
        const base = mergeTheme(props.theme)
        return {
            ...base,
            geometry: resolveGeometry(base.geometry, props.geometry)
        }

    }, [props.theme, props.geometry]);

    assertValidGeometry(mergedTheme.geometry)
    const settings = useMemo(() => resolveChartSettings(props, mergedTheme), [props, mergedTheme]);

    assertValidLayers(props.layers);

    logGaugeDebug(props.debugMode, {
        scale: props.scale,
        layers: props.layers,
        geometry: mergedTheme.geometry,
        interaction: props.interaction,
        animation: props.animation,
        ticks: props.ticks,
        theme: mergedTheme,
    });

    const svgRef = useRef<SVGSVGElement>(null);
    const layout = useMemo(
        () => computeGaugeLayoutFromSize(props.size, mergedTheme.layout, mergedTheme.radius, mergedTheme.geometry),
        [props.size, mergedTheme.layout, mergedTheme.radius, mergedTheme.geometry],
    );

    const resolved = useMemo(
        () => resolveLayers(props.layers, props.scale, layout.radius, mergedTheme, settings.tickStep),
        [props.layers, props.scale, layout.radius, mergedTheme, settings.tickStep],
    );

    const {tooltip, hoveredLayerId, getLayerHandlers, getLayerOpacity} = useGaugeInteraction({
        svgRef,
        layers: resolved.layers,
        formatters: props.formatters,
        tooltipMode: settings.tooltipMode,
        tooltipsEnabled: settings.tooltips,
        hoverDimming: settings.hoverDimming,
        interaction: mergedTheme.interaction,
    });

    const gradientLayer = useMemo(() => resolved.layers.find(
        (layer) => layer.render === 'segmented' && layer.segmentedStyle.isTileColorGradient,
    ), [resolved.layers]);

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
                        <GaugeDefs
                            pointerMarkers={resolved.pointerMarkers}
                            gradientLayer={gradientLayer}
                            scaleMax={settings.scaleMax}
                            colorScale={resolved.colorScale}
                        />
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
                                hoverDimming={settings.hoverDimming}
                                getLayerOpacity={getLayerOpacity}
                                handlers={getLayerHandlers(layer.id)}
                                animate={settings.animationEnabled}
                                animationDurationMs={settings.animationDurationMs}
                            />
                        ))}

                        <g>
                            <GaugePointers
                                pointers={resolved.pointers}
                                scaleFactor={layout.scaleFactor}
                                referenceScaleFactor={mergedTheme.scale.referenceScaleFactor}
                                animate={settings.animationEnabled}
                                animationDurationMs={settings.animationDurationMs}
                            />
                            <GaugeHub radius={layout.radius} hubScale={settings.hubScale} hubColor={settings.hubColor}
                                      scaleDivisor={mergedTheme.hub.scaleDivisor}/>
                        </g>

                        {settings.ticksEnabled && (
                            <GaugeTickLabels
                                radius={layout.radius}
                                tickLabels={resolved.tickLabels}
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
                        theme={mergedTheme.tooltip}
                    />
                )}
            </div>
        </GaugeThemeProvider>
    );
};

export default Gauge;