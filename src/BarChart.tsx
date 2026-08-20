import {useMemo, useRef} from 'react';
import type {BarChartProps} from './types';
import {computeBarLayoutFromSize} from './utils/computeBarLayout';
import {resolveBarLayers} from './core/resolveBarLayers';
import {resolveChartSettings} from './core/resolveChartSettings';
import {useGaugeInteraction} from './hooks/useGaugeInteraction';
import {BarLayer} from './components/BarLayer';
import {BarTickLabels} from './components/BarTickLabels';
import BarDefs from './components/BarDefs';
import {buildBarGradientLayers} from './core/resolveBarLayers';
import {mergeTheme} from './theme/mergeTheme';
import {GaugeThemeProvider} from './theme/GaugeThemeContext';
import GaugeTooltip from './GaugeTooltip';
import {assertValidBarLayers} from './utils/barGuards';

export function BarChart(props: BarChartProps) {
    assertValidBarLayers(props.layers);

    const mergedTheme = useMemo(() => mergeTheme(props.theme), [props.theme]);
    const settings = useMemo(() => resolveChartSettings(props, mergedTheme), [props, mergedTheme]);
    const orientation = props.orientation ?? 'horizontal';

    const layout = useMemo(
        () => computeBarLayoutFromSize(props.size, orientation, mergedTheme),
        [props.size, orientation, mergedTheme],
    );

    const resolved = useMemo(
        () => resolveBarLayers(
            props.layers,
            props.scale,
            layout,
            mergedTheme,
            orientation,
            settings.tickStep,
            settings.hideCrowdedEndTick,
            layout.scaleFactor,
        ),
        [
            props.layers,
            props.scale,
            layout,
            mergedTheme,
            orientation,
            settings.tickStep,
            settings.hideCrowdedEndTick,
        ],
    );

    const gradientLayers = useMemo(
        () => buildBarGradientLayers(resolved.layers, resolved.gradientLayerIds),
        [resolved.gradientLayerIds, resolved.layers],
    );

    const {hoveredLayerId, tooltip, getLayerHandlers, getLayerOpacity} = useGaugeInteraction({
        layers: resolved.layers,
        formatters: props.formatters,
        tooltipMode: settings.tooltipMode,
        tooltipsEnabled: settings.tooltips,
        hoverDimming: settings.hoverDimming,
        interaction: mergedTheme.interaction,
    });

    const orderedLayers = useMemo(() => {
        if (!hoveredLayerId) {
            return resolved.layers;
        }

        const hoveredLayer = resolved.layers.find((layer) => layer.id === hoveredLayerId);
        if (!hoveredLayer) {
            return resolved.layers;
        }

        return [
            ...resolved.layers.filter((layer) => layer.id !== hoveredLayerId),
            hoveredLayer,
        ];
    }, [resolved.layers, hoveredLayerId]);

    const svgRef = useRef<SVGSVGElement>(null);

    return (
        <GaugeThemeProvider theme={mergedTheme}>
            <div style={{position: 'relative'}}>
                <svg
                    ref={svgRef}
                    width={layout.logicalWidth}
                    height={layout.logicalHeight}
                    viewBox={layout.viewBox}
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <BarDefs
                            gradientLayers={gradientLayers}
                            scaleMax={settings.scaleMax}
                            colorScale={resolved.colorScale}
                        />
                    </defs>

                    <g transform={`translate(${layout.originX}, ${layout.originY})`}>
                        {orderedLayers.map((layer) => (
                            <BarLayer
                                key={layer.id}
                                layer={layer}
                                trackLength={layout.trackLength}
                                scaleMax={settings.scaleMax}
                                scaleFactor={layout.scaleFactor}
                                colorScale={resolved.colorScale}
                                hoveredLayerId={hoveredLayerId}
                                hoverDimming={settings.hoverDimming}
                                animate={settings.animationEnabled}
                                animationDurationMs={settings.animationDurationMs}
                                getLayerOpacity={getLayerOpacity}
                                handlers={getLayerHandlers(layer.id)}
                            />
                        ))}

                        {settings.ticksEnabled && (
                            <BarTickLabels
                                tickLabels={resolved.tickLabels}
                                scale={props.scale}
                                layout={layout}
                                orientation={orientation}
                                scaleFactor={layout.scaleFactor}
                                fontSize={settings.tickFontSize}
                                tickColor={settings.tickColor}
                                tickLabelColor={settings.tickLabelColor}
                                formatters={props.formatters}
                            />
                        )}
                    </g>
                </svg>

                {tooltip && settings.tooltips && (
                    <GaugeTooltip
                        text={tooltip.text}
                        x={tooltip.x}
                        y={tooltip.y}
                        scaleFactor={layout.scaleFactor}
                        theme={mergedTheme.tooltip}
                    />
                )}
            </div>
        </GaugeThemeProvider>
    );
}

export default BarChart;