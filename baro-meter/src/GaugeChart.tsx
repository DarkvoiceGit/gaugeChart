import React, {useRef, useState} from 'react';
import * as d3 from 'd3';


interface PointerConfig {
    scale: number
    strokeScale: number
    color: string
}

interface ArcConfig {
    padAngle: number
    padRadius: number
    cornerRadius: number
}

interface GaugeProps {
    width?: number; // Breite der SVG (Standard: 200)
    height?: number; // Höhe der SVG (Standard: 200)
    booked: number;
    planned: number;
    thresholdYellow?: number;
    thresholdRed?: number;
    withOpacitySwitch?: boolean;
    colorTileThresholdRed?: string
    colorTileThresholdYellow?: string
    colorTileThresholdDefault?: string
    colorTileBg?: string
    colorBookedBar?: string
    colorPlannedBar?: string
    enableToolTip?: boolean
    enableUnitTicks?: boolean
    tiles?: number
    isTileColorGradient?: boolean
    pointerBookedConfig?: PointerConfig
    pointerSumConfig?: PointerConfig
    circleScale?: number
    unitTickFormatter?: (value: number) => string; // Neue Prop für den Formatter
    unit?: (value: number) => string
    gradientType?: 'full' | 'tile'
    tickEveryNThStep?: number
    outerArcConfig?: ArcConfig
    primaryArcConfig?: ArcConfig
    secondaryArcConfig?: ArcConfig
    enableInnerArc?: boolean

}


const Pointer = ({x, y, color, markerId, pointerScale, strokeScale}: {
    x: number;
    y: number;
    color: string;
    markerId: string,
    pointerScale: number,
    strokeScale: number
}) => {
    const baseMarkerSize = 10; // Basisgröße für die Pfeilspitze
    const markerWidth = baseMarkerSize * pointerScale; // Skaliere die Breite der Pfeilspitze
    const markerHeight = baseMarkerSize * pointerScale; // Skaliere die Höhe der Pfeilspitze

    return (

        <>
            <line
                x1={0}
                y1={0}
                x2={x}
                y2={y}
                stroke={color}
                strokeWidth={3 * strokeScale}
                markerEnd={`url(#arrowhead-${markerId})`}

            />
            {/* Marker-Definition für planned */}
            <defs>
                <marker
                    id={`arrowhead-${markerId}`}
                    markerWidth={markerWidth}
                    markerHeight={markerHeight}
                    refX={markerWidth * 0.9} // Anpassung der Position der Pfeilspitze
                    refY={markerHeight / 2}
                    orient={'auto'}
                >
                    <polygon points={`0 0, ${markerWidth} ${markerHeight / 2}, 0 ${markerHeight}`} fill={color}/>
                </marker>
            </defs>
        </>

    );
}


const Tooltip = ({text, x, y}: { text: Array<{ label: string, value: string }>; x: number; y: number }) => {

    return (<div
        style={{
            position: 'absolute',
            left: x + 10, // Versatz vom Mauszeiger
            top: y + 10,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: '.5rem .5rem',
            minWidth: '7rem',
            borderRadius: '.5rem',
            fontSize: '1rem',
            pointerEvents: 'none', // Verhindert, dass der Tooltip die Mausinteraktion blockiert
        }}
    >
        {/* Rendere jede Zeile als separates <div> */}
        {text.map((item, index) => (
            <div key={index} style={{
                borderBottom: text.length > 1 ? '1px dashed ' + '#fff' : '',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <span style={{textAlign: 'start', paddingRight: 10}}>{item.label}</span>
                <span style={{textAlign: 'end'}}>{item.value}</span>
            </div>
        ))}
    </div>)
}
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

const Gauge: React.FC<GaugeProps> = ({
                                         enableToolTip,
                                         width = 800,
                                         height = 600,
                                         thresholdRed = 80,
                                         thresholdYellow = 60,
                                         booked,
                                         planned,
                                         withOpacitySwitch = true,
                                         colorTileThresholdYellow = '#ffff00',
                                         colorTileThresholdDefault = '#00ff00',
                                         colorTileThresholdRed = '#ff0c4d',
                                         colorTileBg = '#ddd',
                                         colorBookedBar = '#000',
                                         colorPlannedBar = '#aaa',
                                         enableUnitTicks = true,
                                         tiles = 10,
                                         isTileColorGradient = false,
                                         pointerBookedConfig = {
                                             scale: 1,
                                             strokeScale: 1,
                                             color: '#025bff'
                                         },
                                         pointerSumConfig = {
                                             scale: 1,
                                             strokeScale: 1,
                                             color: '#0ed30e'
                                         },
                                         circleScale = (.5),
                                         unitTickFormatter,
                                         unit,
                                         gradientType = 'tile',
                                         tickEveryNThStep = 0,
                                         outerArcConfig = {
                                             cornerRadius: 5,
                                             padAngle: 2,
                                             padRadius: 2
                                         },
                                         primaryArcConfig = {
                                             cornerRadius: 5,
                                             padAngle: 0,
                                             padRadius: 0
                                         },
                                         secondaryArcConfig = {
                                             cornerRadius: 5,
                                             padAngle: 0,
                                             padRadius: 0
                                         },
                                         enableInnerArc = false
                                     }) => {
    const numTiles = tiles <= 0 ? 1 : tiles
    const ref = useRef<SVGSVGElement>(null);
    const [isTileHovered, setIsTileHovered] = useState<boolean>(false);
    const [isBarBookedHovered, setIsBarBookedHovered] = useState<boolean>(false);
    const [isBarPlannedHovered, setIsBarPlannedHovered] = useState<boolean>(false);
    const [tooltip, setTooltip] = useState<{
        text: Array<{ label: string, value: string }>;
        x: number;
        y: number
    } | null>(null);


    let value = booked + planned

    const normalize = (value: number) => {
        return Math.min(1, value / thresholdRed); // Begrenze den Wert auf maximal 1
    };

    // Normalisierte Werte
    const bookedNormalized = normalize(booked);
    const plannedNormalized = normalize(planned);

    const sumNormalized = normalize(value);
    const thresholdYellowNormalized = normalize(thresholdYellow)
    const thresholdRedNormalized = 1


    const handleBarBookedMouseEnter = (event: React.MouseEvent) => {
        const bbox = ref.current?.getBoundingClientRect() ?? {left: 0, right: 0, bottom: 0, top: 0}; // Position des SVG innerhalb des Viewports
        const formattedBookedValue = unitTickFormatter && unitTickFormatter(booked) !== 'unit' ? unitTickFormatter(booked) : unit ? unit(booked) : booked.toString()

        setTooltip({
            text: [
                {label: 'Primary:', value: formattedBookedValue},
            ],
            x: event.clientX - bbox.left,
            y: event.clientY - bbox.top,
        });

        console.log(tooltip?.text)
        setIsBarBookedHovered(true);
    };

    const handleBarBookedMouseLeave = () => {
        setTooltip(null);
        setIsBarBookedHovered(false);
    };

    const handleBarPlannedMouseLeave = () => {
        setTooltip(null);
        setIsBarPlannedHovered(false);
    };

    const handleBarPlannedMouseEnter = (event: React.MouseEvent) => {
        const bbox = ref.current?.getBoundingClientRect() ?? {left: 0, right: 0, bottom: 0, top: 0}; // Position des SVG innerhalb des Viewports
        const formattedPlannedValue = unitTickFormatter && unitTickFormatter(planned) !== 'unit' ? unitTickFormatter(planned) : unit ? unit(planned) : planned.toString()
        setTooltip({
            text: [
                {label: 'Secondary:', value: formattedPlannedValue},
            ],
            x: event.clientX - bbox.left,
            y: event.clientY - bbox.top,
        });
        console.log(tooltip?.text)
        setIsBarPlannedHovered(true);
    };

    const handleTileMouseEnter = (event: React.MouseEvent) => {
        const bbox = ref.current?.getBoundingClientRect() ?? {left: 0, right: 0, bottom: 0, top: 0}; // Position des SVG innerhalb des Viewports
        const formattedValue = unitTickFormatter && unitTickFormatter(value) !== 'unit' ? unitTickFormatter(value) : unit ? unit(value) : value.toString()
        const formattedBookedValue = unitTickFormatter && unitTickFormatter(booked) !== 'unit' ? unitTickFormatter(booked) : unit ? unit(booked) : booked.toString()
        const formattedPlannedValue = unitTickFormatter && unitTickFormatter(planned) !== 'unit' ? unitTickFormatter(planned) : unit ? unit(planned) : planned.toString()
        setTooltip({
            text: [
                {label: 'Sum:', value: formattedValue},
                {label: 'Primary:', value: formattedBookedValue},
                {label: 'Secondary:', value: formattedPlannedValue},
            ],
            x: event.clientX - bbox.left,
            y: event.clientY - bbox.top,
        });
        console.log(tooltip?.text)
        setIsTileHovered(true);
    };

    const handleTileMouseLeave = () => {
        setTooltip(null);
        setIsTileHovered(false);
    };


    const getOpacity = (isFilled: boolean, isBarBooked: boolean, isBarPlanned: boolean) => {
        if (!withOpacitySwitch) return 1
        if (isBarBookedHovered && isBarBooked) return 1;
        if (isBarPlannedHovered && isBarPlanned) return 1;
        if (isTileHovered && isFilled) {
            return 1
        }
        if (isTileHovered || isBarBookedHovered || isBarPlannedHovered) {
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

    const bookedPointer = calculatePointer(bookedNormalized, radius, 0.7 * pointerBookedConfig.scale);
    const plannedPointer = calculatePointer(sumNormalized, radius, 0.85 * pointerSumConfig.scale);

    // Tiles zeichnen
    const tileAngles = d3.range(-Math.PI / 2, Math.PI / 2, (Math.PI) / numTiles);


    const dayLabels = d3.range(0, thresholdRed + 1, tickEveryNThStep === 0 ? thresholdRed / numTiles : tickEveryNThStep); //tickEveryNThStep === 0 ? tiles  : tickEveryNThStep
    const labelRadius = radius * 1.05

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
                                    .startAngle(isBarPlannedHovered || isTileHovered && withOpacitySwitch ? angleScale(bookedNormalized) : (-Math.PI / 2) + .01)
                                    .cornerRadius(secondaryArcConfig.cornerRadius)
                                    // @ts-ignore
                                    .endAngle(Math.min(angleScale(bookedNormalized + plannedNormalized), Math.PI / 2))(null)!} // Begrenzung auf Math.PI / 2
                                fill={colorPlannedBar}
                                stroke={'#000'}
                                strokeWidth={0.5}
                                opacity={getOpacity(false, false, true)}
                                onMouseEnter={handleBarPlannedMouseEnter}
                                onMouseLeave={handleBarPlannedMouseLeave}
                            />


                            {/*Hauptfarbe (schwarz) - basierend auf valueBooked*/}
                            <path
                                d={d3.arc<d3.DefaultArcObject>()
                                    .innerRadius(radius * 0.6)
                                    .outerRadius(radius * 0.7)
                                    .startAngle((-Math.PI / 2) + .01)
                                    .cornerRadius(primaryArcConfig.cornerRadius)
                                    // @ts-ignore
                                    .endAngle(Math.min(angleScale(bookedNormalized), Math.PI / 2))(null)!} // Begrenzung auf Math.PI / 2
                                fill={colorBookedBar}
                                stroke={'#000'}
                                strokeWidth={0.5}
                                onMouseEnter={handleBarBookedMouseEnter}
                                onMouseLeave={handleBarBookedMouseLeave}
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
                            .endAngle(tileEndAngle).padRadius(outerArcConfig.padRadius).padAngle(outerArcConfig.padAngle).cornerRadius(outerArcConfig.cornerRadius);

                        // Tile-Vordergrund (gefüllter Teil)
                        const tileForegroundArc = d3.arc<d3.DefaultArcObject>()
                            .innerRadius(isTileHovered && withOpacitySwitch ? radius * 0.7 - 15 : radius * 0.7)
                            .outerRadius(isTileHovered && withOpacitySwitch ? radius + 10 : radius)
                            .startAngle(tileStartAngle)
                            .endAngle(tileFillEndAngle).padRadius(outerArcConfig.padRadius).padAngle(outerArcConfig.padAngle).cornerRadius(outerArcConfig.cornerRadius);

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
                        {plannedNormalized !== 0 && bookedNormalized !== sumNormalized && enableInnerArc && (
                            <Pointer x={bookedPointer.x} y={bookedPointer.y} color={pointerBookedConfig.color}
                                     markerId={'booked'}
                                     pointerScale={pointerBookedConfig.scale}
                                     strokeScale={pointerBookedConfig.strokeScale}
                                     key={1}/>
                        )}
                        <Pointer x={plannedPointer.x} y={plannedPointer.y} color={pointerSumConfig.color}
                                 markerId={'planned'}
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
                    {isBarPlannedHovered && withOpacitySwitch && enableInnerArc && (
                        <path
                            d={

                                d3.arc<d3.DefaultArcObject>()
                                    .innerRadius(radius * 0.55) // Vergrößerung beim Hovern
                                    .outerRadius(radius * 0.75)
                                    .startAngle(angleScale(bookedNormalized))
                                    .cornerRadius(secondaryArcConfig.cornerRadius)
                                    // @ts-ignore
                                    .endAngle(Math.min(angleScale(bookedNormalized + plannedNormalized), Math.PI / 2))(null)! // Begrenzung auf Math.PI / 2
                            }
                            fill={colorPlannedBar}
                            stroke="#000"
                            strokeWidth={0.5}
                            opacity={1}
                            onMouseEnter={handleBarPlannedMouseEnter}
                            onMouseLeave={handleBarPlannedMouseLeave}
                            style={{pointerEvents: 'none'}} // Verhindert erneutes Hover
                        />
                    )}
                    {isBarBookedHovered && withOpacitySwitch && enableInnerArc && (
                        <path
                            d={d3.arc<d3.DefaultArcObject>()
                                .innerRadius(radius * 0.55) // Vergrößerung beim Hovern
                                .outerRadius(radius * 0.75)
                                .startAngle((-Math.PI / 2) + 0.01)
                                .cornerRadius(primaryArcConfig.cornerRadius)
                                // @ts-ignore
                                .endAngle(Math.min(angleScale(bookedNormalized), Math.PI / 2))(null)!} // Begrenzung auf Math.PI / 2
                            fill={colorBookedBar}
                            stroke="#000"
                            strokeWidth={0.5}
                            opacity={1}
                            onMouseEnter={handleBarBookedMouseEnter}
                            onMouseLeave={handleBarBookedMouseLeave}
                            style={{pointerEvents: 'none'}} // Verhindert erneutes Hover
                        />
                    )}

                    {enableUnitTicks && dayLabels.map((day, index) => {
                        const normalizedDay = day / thresholdRed; // Skaliere auf den Bereich [0, 1]
                        const angle = angleScale(normalizedDay) - Math.PI / 2;


                        const labelX = Math.cos(angle) * labelRadius;
                        const labelY = Math.sin(angle) * labelRadius;

                        // Tick-Position
                        const tickStartX = Math.cos(angle) * radius;
                        const tickStartY = Math.sin(angle) * radius;
                        const tickEndX = Math.cos(angle) * (labelRadius);
                        const tickEndY = Math.sin(angle) * (labelRadius);

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
                <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y}/>
            )}
        </div>
    );
};

export default Gauge;
