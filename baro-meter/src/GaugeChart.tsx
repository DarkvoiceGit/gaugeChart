import React, {useRef, useState} from 'react';
import * as d3 from 'd3';

interface GaugeProps {
    width?: number; // Breite der SVG (Standard: 200)
    height?: number; // Höhe der SVG (Standard: 200)
    booked: number;
    planned: number;
    thresholdYellow?: number;
    thresholdRed?: number;
    withOpacitySwitch: boolean;
    colorTileThresholdRed: string
    colorTileThresholdYellow: string
    colorTileThresholdDefault: string
    colorTileBg: string
    colorBookedBar: string
    colorPlannedBar: string
    enableToolTip: boolean
}

const MAX = 100
const MIN = 0
const Pointer = ({x, y, color, markerId}: { x: number; y: number; color: string; markerId: string }) => (
    <>
        <line
            x1={0}
            y1={0}
            x2={x}
            y2={y}
            stroke={color}
            strokeWidth={3}
            markerEnd={`url(#arrowhead-${markerId})`}

        />
        {/* Marker-Definition für planned */}
        <defs>
            <marker
                id={`arrowhead-${markerId}`}
                markerWidth={10}
                markerHeight={7}
                refX={9}
                refY={3.5}
                orient={'auto'}
            >
                <polygon points='0 0, 10 3.5, 0 7' fill={color}/>
            </marker>
        </defs>
    </>

);


const Tooltip = ({text, x, y}: { text: Array<{ label: string, value: number }>; x: number; y: number }) => {

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


const calculatePointerPosition = (
    normalizedValue: number,
    radius: number,
    angleOffset: number = 0,
    length: number
) => {
    const angleScale = d3.scaleLinear()
        .domain([0, 1])
        .range([-Math.PI / 2, Math.PI / 2]);

    const angle = angleScale(normalizedValue + angleOffset);
    const pointerX = Math.cos(angle) * radius * length;
    const pointerY = Math.sin(angle) * radius * length;

    return {x: pointerX, y: pointerY};
};

const Gauge: React.FC<GaugeProps> = ({
                                         enableToolTip,
                                         width = 200,
                                         height = 200,
                                         thresholdRed = 90,
                                         thresholdYellow = 70,
                                         booked,
                                         planned,
                                         withOpacitySwitch,
                                         colorTileThresholdYellow,
                                         colorTileThresholdDefault,
                                         colorTileThresholdRed,
                                         colorTileBg,
                                         colorBookedBar,
                                         colorPlannedBar

                                     }) => {
    const numTiles = 8
    const ref = useRef<SVGSVGElement>(null);
    const [isTileHovered, setIsTileHovered] = useState<boolean>(false);
    const [isBarBookedHovered, setIsBarBookedHovered] = useState<boolean>(false);
    const [isBarPlannedHovered, setIsBarPlannedHovered] = useState<boolean>(false);
    const [tooltip, setTooltip] = useState<{
        text: Array<{ label: string, value: number }>;
        x: number;
        y: number
    } | null>(null);


    let value = booked + planned
    // Normalisierungsfunktion
    const normalize = (value: number) => {
        return (value - MIN) / (MAX - MIN);
    };

    // Normalisierte Werte
    const bookedNormalized = normalize(booked);
    const plannedNormalized = normalize(planned);

    // if (value > max) {
    //     value = max
    // }
    // if (value < min) {
    //     value = min
    // }

    const handleBarBookedMouseEnter = (event: React.MouseEvent) => {
        const bbox = ref.current?.getBoundingClientRect() ?? {left: 0, right: 0, bottom: 0, top: 0}; // Position des SVG innerhalb des Viewports

        setTooltip({
            text: [
                {label: 'Gebucht:', value: booked},
            ],
            x: event.clientX - bbox.left,
            y: event.clientY - bbox.top,
        });
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

        setTooltip({
            text: [
                {label: 'Geplant:', value: planned}
            ],
            x: event.clientX - bbox.left,
            y: event.clientY - bbox.top,
        });
        setIsBarPlannedHovered(true);
    };

    const handleTileMouseEnter = (event: React.MouseEvent) => {
        const bbox = ref.current?.getBoundingClientRect() ?? {left: 0, right: 0, bottom: 0, top: 0}; // Position des SVG innerhalb des Viewports

        setTooltip({
            text: [
                {label: 'Gesamt:', value: value},
                {label: 'Gebucht:', value: booked},
                {label: 'Geplant:', value: planned}
            ],
            x: event.clientX - bbox.left,
            y: event.clientY - bbox.top,
        });
        setIsTileHovered(true);
    };

    const handleTileMouseLeave = () => {
        setTooltip(null);
        setIsTileHovered(false);
    };

    const sumNormalized = normalize(value);
    // Skala für den Winkel (von min zu max)
    const angleScale = d3.scaleLinear()
        .domain([0, 1])
        .range([-Math.PI / 2, Math.PI / 2]);


    const getOpacity = (isFilled: boolean, isBarBooked: boolean, isBarPlanned: boolean) => {
        if (!withOpacitySwitch) return 1
        if (isBarBookedHovered && isBarBooked) return 1;
        if (isBarPlannedHovered && isBarPlanned) return 1;
        if (isTileHovered && isFilled) {
            return 1
        }
        if (isTileHovered || isBarBookedHovered || isBarPlannedHovered) {
            return 0.6
        }
        return 1
    }

    // Radius des Halbkreises
    const radius = Math.min(width, height) / 2;

    const angleOffset = 1.5; // Korrekturwert
    const bookedPointer = calculatePointerPosition(bookedNormalized, radius, angleOffset, 0.7);
    const plannedPointer = calculatePointerPosition(sumNormalized, radius, angleOffset, .85);

    // Tiles zeichnen
    const tileAngles = d3.range(-Math.PI / 2, Math.PI / 2, (Math.PI) / numTiles);

    return (
        <div style={{position: 'relative'}}>
            <svg ref={ref} width={width} height={height}>
                <g transform={`translate(${width / 2}, ${height / 2})`}>
                    <g>

                        <path
                            d={d3.arc<d3.DefaultArcObject>()
                                .innerRadius(radius * 0.6)
                                .outerRadius(radius * 0.7)
                                .startAngle((-Math.PI / 2) + .01)
                                .cornerRadius(5)
                                // @ts-ignore
                                .endAngle(angleScale(bookedNormalized + plannedNormalized))(null)!}
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
                                .cornerRadius(5)
                                // @ts-ignore
                                .endAngle(angleScale(bookedNormalized))(null)!}
                            fill={colorBookedBar}
                            stroke={'#000'}
                            strokeWidth={0.5}
                            onMouseEnter={handleBarBookedMouseEnter}
                            onMouseLeave={handleBarBookedMouseLeave}
                            opacity={getOpacity(false, true, false)}
                        />


                    </g>


                    {tileAngles.map((angle, index) => {
                        const tileStartAngle = angle;
                        const tileEndAngle = angle + (Math.PI / numTiles);

                        // Berechne den Füllgrad des Tiles basierend auf dem Wert
                        const tileValueRange = (MAX - MIN) / numTiles; // Wertbereich pro Tile
                        const tileMinValue = MIN + index * tileValueRange; // Untergrenze des Tiles
                        // const tileMaxValue = tileMinValue + tileValueRange; // Obergrenze des Tiles

                        // Bestimme, wie viel vom Tile gefüllt werden soll
                        const fillRatio = Math.min(1, Math.max(0, (value - tileMinValue) / tileValueRange));
                        const tileFillEndAngle = tileStartAngle + fillRatio * (tileEndAngle - tileStartAngle);

                        // Tile-Hintergrund (nicht gefüllter Teil)
                        const tileBackgroundArc = d3.arc<d3.DefaultArcObject>()
                            .innerRadius(radius * 0.7)
                            .outerRadius(radius)
                            .startAngle(tileStartAngle)
                            .endAngle(tileEndAngle).padRadius(2).padAngle(2).cornerRadius(5);

                        // Tile-Vordergrund (gefüllter Teil)
                        const tileForegroundArc = d3.arc<d3.DefaultArcObject>()
                            .innerRadius(isTileHovered ? radius * 0.7 - 5 : radius * 0.7)
                            .outerRadius(isTileHovered ? radius + 1 : radius)
                            .startAngle(tileStartAngle)
                            .endAngle(tileFillEndAngle).padRadius(2).padAngle(2).cornerRadius(5);

                        const fillColor = value >= thresholdRed ? colorTileThresholdRed : value >= thresholdYellow && value < thresholdRed ? colorTileThresholdYellow : colorTileThresholdDefault;

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
                    {plannedNormalized !== 0 && (
                        <Pointer x={bookedPointer.x} y={bookedPointer.y} color={'#025bff'} markerId={'booked'}
                                 key={1}/>)}

                    <Pointer x={plannedPointer.x} y={plannedPointer.y} color={'#0ed30e'} markerId={'planned'} key={2}/>
                    <circle
                        cx={0}
                        cy={0}
                        r={15}
                        fill={'black'}
                    />
                    {/* Hovered Element (wird als letztes gerendert) */}
                    {isBarPlannedHovered && (
                        <path
                            d={

                                d3.arc<d3.DefaultArcObject>()
                                    .innerRadius(radius * 0.55) // Vergrößerung beim Hovern
                                    .outerRadius(radius * 0.75)
                                    .startAngle(angleScale(bookedNormalized))
                                    .cornerRadius(5)
                                    // @ts-ignore
                                    .endAngle(angleScale(bookedNormalized + plannedNormalized))(null)!
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
                    {isBarBookedHovered && (
                        <path
                            d={d3.arc<d3.DefaultArcObject>()
                                .innerRadius(radius * 0.55) // Vergrößerung beim Hovern
                                .outerRadius(radius * 0.75)
                                .startAngle((-Math.PI / 2) + 0.01)
                                .cornerRadius(5)
                                // @ts-ignore
                                .endAngle(angleScale(bookedNormalized))(null)!}
                            fill={colorBookedBar}
                            stroke="#000"
                            strokeWidth={0.5}
                            opacity={1}
                            onMouseEnter={handleBarBookedMouseEnter}
                            onMouseLeave={handleBarBookedMouseLeave}
                            style={{pointerEvents: 'none'}} // Verhindert erneutes Hover
                        />
                    )}
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
                    {/* Text (aktueller Wert) */}
                    {/*<text*/}
                    {/*    textAnchor="middle"*/}
                    {/*    dy="0.35em"*/}
                    {/*    fill='#00ffff'*/}
                    {/*    fontSize="24"*/}
                    {/*>*/}
                    {/*    {value}*/}
                    {/*</text>*/}

                </g>

            </svg>
            {tooltip && enableToolTip && (
                <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y}/>
            )}
        </div>
    );
};

export default Gauge;
