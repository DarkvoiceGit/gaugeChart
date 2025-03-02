import React, {useCallback, useRef, useState} from 'react';
import * as d3 from 'd3';
import GaugeTooltip from "./GaugeTooltip.tsx";
import GaugePointer from "./GaugePointer.tsx";
import {GaugeProps} from "./types.ts";


// Skala für den Winkel (von min zu max)
const angleScale = d3.scaleLinear()
    .domain([0, 1])
    .range([-Math.PI / 2, Math.PI / 2]);

const calculatePointer = (
    normalizedValue: number,
    radius: number,
    length: number
) => {

    const angle = angleScale(normalizedValue) - Math.PI / 2; // Winkel basierend auf dem normalisierten Wert
    const pointerX = (Math.cos(angle) * radius) * length; // x-Position
    const pointerY = (Math.sin(angle) * radius) * length; // y-Position
    return {x: pointerX, y: pointerY, angle};
};

const optionsDefaults = {
    withOpacitySwitch: true,
    enableInnerArc: false,
    circleScale: (.5),
    thresholdRed: 80,
    thresholdYellow: 60,
    enableToolTip: true,
    enableUnitTicks: true
}

const tileArcDefaults = {
    tiles: 10,
    colorTileThresholdYellow: '#ffff00',
    colorTileThresholdRed: '#ff0c4d',
    colorTileThresholdDefault: '#00ff00',
    isTileColorGradient: false,
    gradientType: 'tile',
    colorTileBg: '#ddd',
    tickEveryNThStep: 0,
    arcConfig: {
        cornerRadius: 5,
        padAngle: 2,
        padRadius: 2
    },
    toolTipLabel: 'Gesamt',
}

const secondaryArcDefaults = {
    arcConfig: {
        cornerRadius: 5,
        padAngle: 0,
        padRadius: 0
    },
    pointerSumConfig: {
        scale: 1,
        strokeScale: 1,
        color: '#0ed30e'
    },
    colorSecondaryBar: '#aaa',
    toolTipLabel: 'Secondary',
}

const primaryArcDefaults = {
    arcConfig: {
        cornerRadius: 5,
        padAngle: 0,
        padRadius: 0
    },
    pointerPrimaryConfig: {
        scale: 1,
        strokeScale: 1,
        color: '#025bff'
    },
    colorPrimaryBar: '#000',
    toolTipLabel: 'Primary'
}

const colorSelector = (thresholdMax: number, thresholdMid: number, colorMax: string, colorMid: string, colorDefault: string, value: number) => {
    if (value < thresholdMid) {
        return colorDefault;
    } else if (value >= thresholdMid && value < thresholdMax) {
        return colorMid;
    } else {
        return colorMax
    }
}

const Gauge: React.FC<GaugeProps> = ({
                                         options,
                                         tileArc,
                                         width = 800,
                                         height = 600,
                                         primary,
                                         secondary,
                                         unitTickFormatter,
                                         unit,
                                         primaryArcConfig,
                                         secondaryArcConfig
                                     }) => {
    const {
        tiles,
        colorTileThresholdYellow,
        colorTileThresholdRed,
        colorTileThresholdDefault,
        isTileColorGradient,
        gradientType,
        colorTileBg,
        tickEveryNThStep,
        arcConfig: tileArcCfg,
        toolTipLabel: TileTooltipLabel
    } = {...tileArcDefaults, ...tileArc}

    const {
        withOpacitySwitch,
        enableInnerArc,
        circleScale,
        thresholdRed,
        thresholdYellow,
        enableToolTip,
        enableUnitTicks,
    } = {...optionsDefaults, ...options}

    const {
        arcConfig: primaryArcCfg,
        pointerSumConfig,
        colorSecondaryBar,
        toolTipLabel: secondaryToolTipLabel
    } = {...secondaryArcDefaults, ...secondaryArcConfig}

    const {
        arcConfig: secondaryArcCfg,
        pointerPrimaryConfig,
        colorPrimaryBar,
        toolTipLabel: primaryToolTipLabel
    } = {...primaryArcDefaults, ...primaryArcConfig}

    const numTiles = tiles === undefined || tiles <= 0 ? 1 : tiles
    const ref = useRef<SVGSVGElement>(null);
    const [isTileHovered, setIsTileHovered] = useState<boolean>(false);
    const [isBarPrimaryHovered, setIsBarPrimaryHovered] = useState<boolean>(false);
    const [isBarSecondaryHovered, setIsBarSecondaryHovered] = useState<boolean>(false);
    const [tooltip, setTooltip] = useState<{
        text: Array<{ label: string, value: string, color: string }>;
        x: number;
        y: number
    } | null>(null);


    let value = primary + (secondary ? secondary : 0)

    const normalize = (value: number) => {
        return Math.min(1, value / thresholdRed); // Begrenze den Wert auf maximal 1
    };

    // Normalisierte Werte
    const primaryNormalized = normalize(primary);
    const secondaryNormalized = normalize(secondary ? secondary : 0);

    const sumNormalized = normalize(value);
    const thresholdYellowNormalized = normalize(thresholdYellow)
    const thresholdRedNormalized = 1


    const handleBarPrimaryMouseEnter = useCallback((event: React.MouseEvent) => {
        const bbox = ref.current?.getBoundingClientRect() ?? {left: 0, right: 0, bottom: 0, top: 0};
        const formattedPrimaryValue = unitTickFormatter && unitTickFormatter(primary) !== 'unit' ? unitTickFormatter(primary) : unit ? unit(primary) : primary.toString();

        setTooltip(prevTooltip => {
            const newTooltip = {
                text: [
                    {
                        label: primaryToolTipLabel ? primaryToolTipLabel + ':' : 'Primary:',
                        value: formattedPrimaryValue,
                        color: colorPrimaryBar
                    },
                ],
                x: event.clientX - bbox.left,
                y: event.clientY - bbox.top,
            };
            return JSON.stringify(prevTooltip) === JSON.stringify(newTooltip) ? prevTooltip : newTooltip;
        });

        setIsBarPrimaryHovered(true);
    }, [primary, unitTickFormatter, unit, colorPrimaryBar, primaryToolTipLabel]);

    const handleBarPrimaryMouseLeave = () => {
        setTooltip(null);
        setIsBarPrimaryHovered(false);
    };

    const handleBarSecondaryMouseEnter = useCallback((event: React.MouseEvent) => {
        const bbox = ref.current?.getBoundingClientRect() ?? {left: 0, right: 0, bottom: 0, top: 0}; // Position des SVG innerhalb des Viewports
        const formattedSecondaryValue = secondary ? unitTickFormatter && unitTickFormatter(secondary) !== 'unit' ? unitTickFormatter(secondary) : unit ? unit(secondary) : secondary.toString() : ''
        setTooltip({
            text: [
                {
                    label: secondaryToolTipLabel ? secondaryToolTipLabel + '' : 'Secondary:',
                    value: formattedSecondaryValue,
                    color: colorSecondaryBar,
                },
            ],
            x: event.clientX - bbox.left,
            y: event.clientY - bbox.top,
        });
        console.log(tooltip?.text)
        setIsBarSecondaryHovered(true);
    }, [secondary, unitTickFormatter, unit, colorSecondaryBar, secondaryToolTipLabel]);

    const handleBarSecondaryMouseLeave = () => {
        setTooltip(null);
        setIsBarSecondaryHovered(false);
    };

    const handleTileMouseEnter = useCallback((event: React.MouseEvent) => {
        const bbox = ref.current?.getBoundingClientRect() ?? {left: 0, right: 0, bottom: 0, top: 0}; // Position des SVG innerhalb des Viewports
        const formattedValue = unitTickFormatter && unitTickFormatter(value) !== 'unit' ? unitTickFormatter(value) : unit ? unit(value) : value.toString()
        const formattedPrimaryValue = unitTickFormatter && unitTickFormatter(primary) !== 'unit' ? unitTickFormatter(primary) : unit ? unit(primary) : primary.toString()
        const formattedSecondaryValue = secondary ? unitTickFormatter && unitTickFormatter(secondary) !== 'unit' ? unitTickFormatter(secondary) : unit ? unit(secondary) : secondary.toString() : ''
        setTooltip({
            text: [
                {
                    label: TileTooltipLabel ? TileTooltipLabel + ':' : 'Sum:',
                    value: formattedValue,
                    color: colorSelector(
                        thresholdRed,
                        thresholdYellow,
                        colorTileThresholdRed,
                        colorTileThresholdYellow,
                        colorTileThresholdDefault,
                        value)
                },
                {
                    label: primaryToolTipLabel ? primaryToolTipLabel + ':' : 'Primary:',
                    value: formattedPrimaryValue,
                    color: colorSelector(
                        thresholdRed,
                        thresholdYellow,
                        colorTileThresholdRed,
                        colorTileThresholdYellow,
                        colorTileThresholdDefault,
                        primary)
                },
                ...(secondary ? [{
                    label: secondaryToolTipLabel ? secondaryToolTipLabel + ':' : 'Secondary:',
                    value: formattedSecondaryValue,
                    color: colorSelector(
                        thresholdRed,
                        thresholdYellow,
                        colorTileThresholdRed,
                        colorTileThresholdYellow,
                        colorTileThresholdDefault,
                        secondary)
                }] : []),
            ],
            x: event.clientX - bbox.left,
            y: event.clientY - bbox.top,
        });
        console.log(tooltip?.text)
        setIsTileHovered(true);
    }, [secondary, unitTickFormatter, unit, colorSecondaryBar, secondaryToolTipLabel, primary, colorPrimaryBar, primaryToolTipLabel])

    const handleTileMouseLeave = () => {
        setTooltip(null);
        setIsTileHovered(false);
    };


    const getOpacity = (isFilled: boolean, isBarPrimary: boolean, isBarSecondary: boolean) => {
        if (!withOpacitySwitch) return 1
        if (isBarPrimaryHovered && isBarPrimary) return 1;
        if (isBarSecondaryHovered && isBarSecondary) return 1;
        if (isTileHovered && isFilled) {
            return 1
        }
        if (isTileHovered || isBarPrimaryHovered || isBarSecondaryHovered) {
            return 0.5
        }
        return 1
    }


    const getTileColor = (value: number, idx: number) => {
        if (!isTileColorGradient) {
            return value >= thresholdRedNormalized
                ? colorTileThresholdRed
                : value >= thresholdYellowNormalized
                    ? colorTileThresholdYellow
                    : colorTileThresholdDefault;
        } else {
            if (gradientType === "full") {
                // Linearer Farbverlauf (wie im ursprünglichen Code)
                const colorScale = d3.scaleLinear<string>()
                    .domain([0, thresholdYellowNormalized, thresholdRedNormalized])
                    .range([colorTileThresholdDefault, colorTileThresholdYellow, colorTileThresholdRed]);
                return colorScale(value);
            } else {
                // Radialer Farbverlauf
                return `url(#gradient-${idx})`;
            }
        }
    };


    // Radius des Halbkreises
    const radius = Math.min(width, height) / 2.2;

    const primaryPointer = calculatePointer(primaryNormalized, radius, 0.7 * pointerPrimaryConfig.scale);
    const secondaryPointer = calculatePointer(sumNormalized, radius, 0.85 * pointerSumConfig.scale);

    // Tiles zeichnen
    const tileAngles = d3.range(-Math.PI / 2, Math.PI / 2, (Math.PI) / numTiles);

    const tickLabels = d3.range(0, thresholdRed + 1, tickEveryNThStep === 0 ? thresholdRed / numTiles : tickEveryNThStep); //tickEveryNThStep === 0 ? tiles  : tickEveryNThStep
    const tickLabelRadius = radius * 1.05


    const colorScale = d3.scaleLinear<string>()
        .domain([0, thresholdYellowNormalized, thresholdRedNormalized])
        .range([colorTileThresholdDefault, colorTileThresholdYellow, colorTileThresholdRed]);

    return (
        <div style={{position: 'relative'}}>
            <svg ref={ref} width={width} height={height}>
                typescript
                Copy
                <defs>
                    {tileAngles.map((_, index) => {
                        const tileValueRange = thresholdRed / numTiles;
                        const tileMinValue = index * tileValueRange;
                        const tileMinValueNormalized = normalize(tileMinValue);
                        const tileValueRangeNormalized = normalize(tileValueRange);
                        const tileValue = tileMinValueNormalized + tileValueRangeNormalized;

                        // Bestimme die Farbe basierend auf dem Wert des Tiles
                        const startColor = colorScale(tileValue);
                        const endColor = colorScale(tileValue + tileValueRangeNormalized);

                        return (
                            <linearGradient
                                key={index}
                                id={`gradient-${index}`}
                                transform={'rotate(-90)'}
                                cx="50%"
                                cy="50%"
                                r="50%"
                                fx="50%"
                                fy="50%"
                            >
                                <stop offset="0%" stopColor={startColor}/>
                                <stop offset="100%" stopColor={endColor}/>
                            </linearGradient>
                        );
                    })}
                </defs>
                <g transform={`translate(${width / 2}, ${height / 2})`}>
                    {enableInnerArc && (<g>
                            <path
                                d={d3.arc<d3.DefaultArcObject>()
                                    .innerRadius(radius * 0.6)
                                    .outerRadius(radius * 0.7)
                                    .startAngle(isBarSecondaryHovered || isTileHovered && withOpacitySwitch ? angleScale(primaryNormalized) : (-Math.PI / 2) + .01)
                                    .cornerRadius(secondaryArcCfg.cornerRadius)
                                    // @ts-ignore
                                    .endAngle(Math.min(angleScale(primaryNormalized + secondaryNormalized), Math.PI / 2))(null)!} // Begrenzung auf Math.PI / 2
                                fill={colorSecondaryBar}
                                stroke={'#000'}
                                strokeWidth={0.5}
                                opacity={getOpacity(false, false, true)}
                                onMouseEnter={handleBarSecondaryMouseEnter}
                                onMouseLeave={handleBarSecondaryMouseLeave}
                            />


                            {/*Hauptfarbe (schwarz) - basierend auf valueBooked*/}
                            <path
                                d={d3.arc<d3.DefaultArcObject>()
                                    .innerRadius(radius * 0.6)
                                    .outerRadius(radius * 0.7)
                                    .startAngle((-Math.PI / 2) + .01)
                                    .cornerRadius(primaryArcCfg.cornerRadius)
                                    // @ts-ignore
                                    .endAngle(Math.min(angleScale(primaryNormalized), Math.PI / 2))(null)!} // Begrenzung auf Math.PI / 2
                                fill={colorPrimaryBar}
                                stroke={'#000'}
                                strokeWidth={0.5}
                                onMouseEnter={handleBarPrimaryMouseEnter}
                                onMouseLeave={handleBarPrimaryMouseLeave}
                                opacity={getOpacity(false, true, false)}
                            />

                        </g>
                    )}


                    {tileAngles.map((angle, index) => {
                        const tileStartAngle = angle;
                        const tileEndAngle = angle + (Math.PI / numTiles);
                        const tileValueRange = thresholdRed / numTiles; // Wertbereich pro Tile basierend auf thresholdRed
                        const tileMinValue = index * tileValueRange;
                        const tileMinValueNormalized = normalize(tileMinValue);
                        const tileValueRangeNormalized = normalize(tileValueRange);
                        // Bestimme, wie viel vom Tile gefüllt werden soll
                        const fillRatio = Math.min(1, Math.max(0, (sumNormalized - tileMinValueNormalized) / tileValueRangeNormalized));
                        const tileFillEndAngle = tileStartAngle + fillRatio * (tileEndAngle - tileStartAngle);

                        // Tile-Hintergrund (nicht gefüllter Teil)
                        const tileBackgroundArc = d3.arc<d3.DefaultArcObject>()
                            .innerRadius(radius * 0.7)
                            .outerRadius(radius)
                            .startAngle(tileStartAngle)
                            .endAngle(tileEndAngle).padRadius(tileArcCfg.padRadius).padAngle(tileArcCfg.padAngle).cornerRadius(tileArcCfg.cornerRadius);

                        // Tile-Vordergrund (gefüllter Teil)
                        const tileForegroundArc = d3.arc<d3.DefaultArcObject>()
                            .innerRadius(isTileHovered && withOpacitySwitch ? radius * 0.7 - 15 : radius * 0.7)
                            .outerRadius(isTileHovered && withOpacitySwitch ? radius + 10 : radius)
                            .startAngle(tileStartAngle)
                            .endAngle(tileFillEndAngle).padRadius(tileArcCfg.padRadius).padAngle(tileArcCfg.padAngle).cornerRadius(tileArcCfg.cornerRadius);

                        const fillColor = getTileColor(sumNormalized, index)

                        return (
                            <g key={index}>
                                {/* Nicht gefüllter Teil des Tiles */}
                                <path
                                    d={
                                        // @ts-ignore
                                        tileBackgroundArc(null)!
                                    }
                                    stroke="#000"
                                    opacity={getOpacity(false, false, false)}
                                    fill={colorTileBg}
                                />
                                {/* Gefüllter Teil des Tiles */}
                                {fillRatio > 0 && (
                                    <path
                                        d={
                                            // @ts-ignore
                                            tileForegroundArc(null)!
                                        }
                                        fill={fillColor}
                                        strokeWidth={1}
                                        opacity={getOpacity(true, false, false)} // Gefüllte Bereiche: Opacity 1
                                    />
                                )}
                            </g>
                        );
                    })}
                    <g>
                        {secondaryNormalized !== 0 && primaryNormalized !== sumNormalized && enableInnerArc && (
                            <GaugePointer x={primaryPointer.x} y={primaryPointer.y} color={pointerPrimaryConfig.color}
                                          markerId={'primary'}
                                          pointerScale={pointerPrimaryConfig.scale}
                                          strokeScale={pointerPrimaryConfig.strokeScale}
                                          key={1}/>
                        )}
                        <GaugePointer x={secondaryPointer.x} y={secondaryPointer.y} color={pointerSumConfig.color}
                                      markerId={'secondary'}
                                      pointerScale={pointerSumConfig.scale}
                                      strokeScale={pointerSumConfig.strokeScale}
                                      key={2}/>
                        <circle
                            cx={0}
                            cy={0}
                            r={radius * (circleScale / 10)}
                            fill={'black'}
                        />
                    </g>
                    {/* Hovered Element (wird als letztes gerendert) */}
                    {isBarSecondaryHovered && withOpacitySwitch && enableInnerArc && (
                        <path
                            d={

                                d3.arc<d3.DefaultArcObject>()
                                    .innerRadius(radius * 0.55) // Vergrößerung beim Hovern
                                    .outerRadius(radius * 0.75)
                                    .startAngle(angleScale(primaryNormalized))
                                    .cornerRadius(secondaryArcCfg.cornerRadius)
                                    // @ts-ignore
                                    .endAngle(Math.min(angleScale(primaryNormalized + secondaryNormalized), Math.PI / 2))(null)! // Begrenzung auf Math.PI / 2
                            }
                            fill={colorSecondaryBar}
                            stroke="#000"
                            strokeWidth={0.5}
                            opacity={1}
                            onMouseEnter={handleBarSecondaryMouseEnter}
                            onMouseLeave={handleBarSecondaryMouseLeave}
                            style={{pointerEvents: 'none'}} // Verhindert erneutes Hover
                        />
                    )}
                    {isBarPrimaryHovered && withOpacitySwitch && enableInnerArc && (
                        <path
                            d={d3.arc<d3.DefaultArcObject>()
                                .innerRadius(radius * 0.55) // Vergrößerung beim Hovern
                                .outerRadius(radius * 0.75)
                                .startAngle((-Math.PI / 2) + 0.01)
                                .cornerRadius(primaryArcCfg.cornerRadius)
                                // @ts-ignore
                                .endAngle(Math.min(angleScale(primaryNormalized), Math.PI / 2))(null)!} // Begrenzung auf Math.PI / 2
                            fill={colorPrimaryBar}
                            stroke="#000"
                            strokeWidth={0.5}
                            opacity={1}
                            onMouseEnter={handleBarPrimaryMouseEnter}
                            onMouseLeave={handleBarPrimaryMouseLeave}
                            style={{pointerEvents: 'none'}} // Verhindert erneutes Hover
                        />
                    )}

                    {enableUnitTicks && tickLabels.map((day, index) => {
                        const normalizedDay = day / thresholdRed; // Skaliere auf den Bereich [0, 1]
                        const angle = angleScale(normalizedDay) - Math.PI / 2;


                        const labelX = Math.cos(angle) * tickLabelRadius;
                        const labelY = Math.sin(angle) * tickLabelRadius;

                        // Tick-Position
                        const tickStartX = Math.cos(angle) * radius;
                        const tickStartY = Math.sin(angle) * radius;
                        const tickEndX = Math.cos(angle) * (tickLabelRadius);
                        const tickEndY = Math.sin(angle) * (tickLabelRadius);

                        return (
                            <g key={index}>
                                {/* Tick-Linie */}
                                <line
                                    x1={tickStartX}
                                    y1={tickStartY}
                                    x2={tickEndX}
                                    y2={tickEndY}
                                    stroke="#000"
                                    strokeWidth={1}
                                />
                                {/* Beschriftung */}
                                <text
                                    x={labelX}
                                    y={labelY}
                                    textAnchor="middle"
                                    dy="0.35em"
                                    fill="#fff"
                                    fontSize="12"
                                >
                                    {unit ? unit(Math.round(day)) : Math.round(day)}

                                </text>
                            </g>
                        );
                    })}
                    <path
                        d={d3.arc<d3.DefaultArcObject>()
                            .innerRadius(radius * 0.72)
                            .outerRadius(radius)
                            .startAngle(-Math.PI / 2)
                            // @ts-ignore
                            .endAngle(Math.PI / 2)(null)!}
                        fill="transparent"
                        onMouseEnter={handleTileMouseEnter}
                        onMouseLeave={handleTileMouseLeave}
                    />

                </g>

            </svg>
            {tooltip && enableToolTip && (
                <GaugeTooltip text={tooltip.text} x={tooltip.x} y={tooltip.y}/>
            )}
        </div>
    );
};

export default Gauge;
