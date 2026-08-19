import React, {useMemo, useRef} from 'react';
import {GaugeProps} from './types';
import {computeGaugeLayoutFromSize} from './utils/computeGaugeLayout';
import {computeGaugeDerivedData, resolvePointerStrokeScale} from './utils/computeGaugeDerivedData';
import {resolveGaugeConfig} from './utils/resolveGaugeConfig';
import {mergeTheme} from './theme/mergeTheme';
import {GaugeThemeProvider} from './theme/GaugeThemeContext';
import {useGaugeTooltip} from './hooks/useGaugeTooltip';
import GaugeTooltip from './GaugeTooltip';
import GaugePointer from './GaugePointer';
import GaugePointerMarkers from './components/GaugePointerMarkers';
import GaugeArcs from './components/GaugeArcs';
import GaugeTickLabels from './components/GaugeTickLabels';
import GaugeGradients from './components/GaugeGradients';
import GaugeTiles from './components/GaugeTiles';

function logGaugeDebug(
    debugMode: boolean | undefined,
    payload: Record<string, unknown>,
): void {
    if (!debugMode) {
        return;
    }
    const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;
    if (nodeEnv === 'production') {
        return;
    }
    console.log('[Gauge] Debug mode:', payload);
}

const Gauge: React.FC<GaugeProps> = (props) => {
    const mergedTheme = useMemo(() => mergeTheme(props.theme), [props.theme]);
    const config = useMemo(
        () => resolveGaugeConfig(props, mergedTheme),
        [props, mergedTheme],
    );

    logGaugeDebug(props.debugMode, {
        primary: props.primary,
        secondary: props.secondary,
        options: props.options,
        tileArc: props.tileArc,
        primaryArcConfig: props.primaryArcConfig,
        secondaryArcConfig: props.secondaryArcConfig,
        unitTickFormatter: props.unitTickFormatter,
        unit: props.unit,
        theme: mergedTheme,
    });

    const svgRef = useRef<SVGSVGElement>(null);
    const layout = useMemo(
        () => computeGaugeLayoutFromSize(props.size, mergedTheme.layout, mergedTheme.radius),
        [props.size, mergedTheme.layout, mergedTheme.radius],
    );
    const derived = useMemo(
        () => computeGaugeDerivedData(config, layout, mergedTheme),
        [config, layout, mergedTheme],
    );

    const {tooltip, hoverStates, handlers} = useGaugeTooltip(svgRef, {
        formatters: {
            unitTickFormatter: props.unitTickFormatter,
            unit: props.unit,
        },
        thresholdColors: {
            thresholdRed: config.thresholdRed,
            thresholdYellow: config.thresholdYellow,
            colorMax: config.tile.colorTileThresholdRed,
            colorMid: config.tile.colorTileThresholdYellow,
            colorDefault: config.tile.colorTileThresholdDefault,
        },
        enableInnerArc: config.enableInnerArc,
        labels: {
            tile: config.tile.toolTipLabel,
            primary: config.primary.toolTipLabel,
            secondary: config.secondary.toolTipLabel,
        },
        colors: {
            primaryBar: config.primary.colorPrimaryBar,
            secondaryBar: config.secondary.colorSecondaryBar,
        },
        values: {
            primary: config.primaryValue,
            secondary: config.secondaryValue,
            sum: config.sumValue,
        },
    });

    const tileColorConfig = {
        isTileColorGradient: config.tile.isTileColorGradient,
        gradientType: config.tile.gradientType,
        thresholdYellowNormalized: derived.normalized.thresholdYellow,
        thresholdRedNormalized: derived.normalized.thresholdRed,
        colorTileThresholdDefault: config.tile.colorTileThresholdDefault,
        colorTileThresholdYellow: config.tile.colorTileThresholdYellow,
        colorTileThresholdRed: config.tile.colorTileThresholdRed,
        colorTileBg: config.tile.colorTileBg,
        fillStyle: config.tile.fillStyle,
        borderColor: config.tile.borderColor,
        borderThickness: config.tile.borderThickness,
        arcConfig: config.tile.arcConfig,
    };

    const resolveStrokeScale = (strokeScale: number) => resolvePointerStrokeScale(
        layout.scaleFactor,
        strokeScale,
        mergedTheme.scale.referenceScaleFactor,
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
                        <GaugePointerMarkers markers={derived.pointerMarkers}/>
                        <GaugeGradients
                            tileAngles={derived.tileAngles}
                            numberOfTiles={config.numTiles}
                            thresholdRed={config.thresholdRed}
                            colorScale={derived.colorScale}
                        />
                    </defs>

                    <g transform={`translate(${layout.logicalWidth / 2}, ${layout.logicalHeight / 2})`}>
                        {config.enableInnerArc && (
                            <GaugeArcs
                                radius={layout.radius}
                                normalizedValues={{
                                    primary: derived.normalized.primary,
                                    secondary: derived.normalized.secondary,
                                    sum: derived.normalized.sum,
                                }}
                                config={{
                                    primaryArc: {
                                        color: config.primary.colorPrimaryBar,
                                        arcConfig: config.primary.arcConfig,
                                    },
                                    secondaryArc: {
                                        color: config.secondary.colorSecondaryBar,
                                        arcConfig: config.secondary.arcConfig,
                                    },
                                }}
                                hoverStates={hoverStates}
                                enableOpacityEffect={config.withOpacitySwitch}
                                onPrimaryMouseEnter={handlers.onPrimaryMouseEnter}
                                onPrimaryMouseLeave={handlers.onPrimaryMouseLeave}
                                onPrimaryMouseMove={handlers.onPrimaryMouseMove}
                                onSecondaryMouseEnter={handlers.onSecondaryMouseEnter}
                                onSecondaryMouseLeave={handlers.onSecondaryMouseLeave}
                                onSecondaryMouseMove={handlers.onSecondaryMouseMove}
                            />
                        )}

                        <GaugeTiles
                            radius={layout.radius}
                            tileAngles={derived.tileAngles}
                            numberOfTiles={config.numTiles}
                            sumNormalized={derived.normalized.sum}
                            thresholdRed={config.thresholdRed}
                            colorScale={derived.colorScale}
                            config={tileColorConfig}
                            hoverStates={hoverStates}
                            enableOpacityEffect={config.withOpacitySwitch}
                            scaleFactor={layout.scaleFactor}
                            onMouseEnter={handlers.onTileMouseEnter}
                            onMouseLeave={handlers.onTileMouseLeave}
                            onMouseMove={handlers.onTileMouseMove}
                        />

                        <g>
                            {derived.showPrimaryPointer && (
                                <GaugePointer
                                    x={derived.pointers.primary.x}
                                    y={derived.pointers.primary.y}
                                    color={config.primary.pointerPrimaryConfig.color}
                                    markerId="primary"
                                    strokeScale={resolveStrokeScale(config.primary.pointerPrimaryConfig.strokeScale)}
                                />
                            )}

                            <GaugePointer
                                x={derived.pointers.secondary.x}
                                y={derived.pointers.secondary.y}
                                color={config.secondary.pointerSumConfig.color}
                                markerId="secondary"
                                strokeScale={resolveStrokeScale(config.secondary.pointerSumConfig.strokeScale)}
                            />

                            <circle
                                cx={0}
                                cy={0}
                                r={layout.radius * (config.circleScale / mergedTheme.hub.scaleDivisor)}
                                fill={mergedTheme.hub.color}
                            />
                        </g>

                        {config.enableUnitTicks && (
                            <GaugeTickLabels
                                radius={layout.radius}
                                tickLabels={derived.tickLabels}
                                thresholdRed={config.thresholdRed}
                                unit={props.unit}
                                scaleFactor={layout.scaleFactor}
                                fontSize={config.tickFontSize}
                                tickColor={config.tickColor}
                                tickLabelColor={config.tickLabelColor}
                                fontColor={config.fontColor}
                                radiusScale={config.tickRadiusScale}
                            />
                        )}
                    </g>
                </svg>

                {tooltip && config.enableToolTip && (
                    <GaugeTooltip
                        text={tooltip.text}
                        x={tooltip.x}
                        y={tooltip.y}
                        fontColor={config.fontColor}
                        bgColor={config.tooltipBgColor}
                        theme={mergedTheme.tooltip}
                    />
                )}
            </div>
        </GaugeThemeProvider>
    );
};

export default Gauge;