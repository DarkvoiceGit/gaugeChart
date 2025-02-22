import React, {useRef, useState} from 'react';
import * as d3 from 'd3';

interface GaugeProps {
    value: number; // Aktueller Wert der Gauge
    min?: number; // Minimaler Wert (Standard: 0)
    max?: number; // Maximaler Wert (Standard: 100)
    width?: number; // Breite der SVG (Standard: 200)
    height?: number; // Höhe der SVG (Standard: 200)
    booked: number;
    planned: number;
    thresholdYellow?: number;
    thresholdRed?: number;
}

const Gauge: React.FC<GaugeProps> = ({
                                         value,
                                         min = 0,
                                         max = 100,
                                         width = 200,
                                         height = 200,
                                         thresholdRed = 90,
                                         thresholdYellow = 70,
                                        booked,
                                        planned
                                     }) => {
    const numTiles = 8
    const ref = useRef<SVGSVGElement>(null);
    const [hoveredTile, setHoveredTile] = useState<string | null>(null);

    if (value > max) {
        value = max
    }
    if (value < min) {
        value = min
    }
    // Skala für den Winkel (von min zu max)
    const angleScale = d3.scaleLinear()
        .domain([min, max])
        .range([-Math.PI / 2, Math.PI / 2]);



    const getOpacity = (elementId: string, isGreen: boolean) =>{
        if (hoveredTile === null) return 1;
        if(hoveredTile === elementId) { return 1}
        if(hoveredTile.startsWith('tile') && isGreen) return 1
        return 0.2
    }

    // Skala für die Farbe (grün bis rot)
    // const colorScale = d3.scaleLinear<string>()
    //     .domain([min, max])
    //     .range(['green', 'red']);

    // Radius des Halbkreises
    const radius = Math.min(width, height) / 2;



    // Tiles zeichnen
    const tileAngles = d3.range(-Math.PI / 2, Math.PI / 2, (Math.PI) / numTiles);

    return (
        <svg ref={ref} width={width} height={height}>
            <g transform={`translate(${width / 2}, ${height / 2})`}>
                <g>
                    {/* Hintergrund (weiß) */}
                    {/*<path*/}
                    {/*    d={d3.arc<d3.DefaultArcObject>()*/}
                    {/*        .innerRadius(radius * 0.6)*/}
                    {/*        .outerRadius(radius * 0.7)*/}
                    {/*        .startAngle(-Math.PI / 2)*/}
                    {/*        .endAngle(Math.PI / 2)(null)!}*/}
                    {/*    fill="#fff"*/}
                    {/*/>*/}
                    {/* Sekundärfarbe (grau) - basierend auf plannedValue */}
                    <path
                        d={d3.arc<d3.DefaultArcObject>()
                            .innerRadius(radius * 0.6)
                            .outerRadius(radius * 0.7)
                            .startAngle((-Math.PI / 2)+.01)
                            .cornerRadius(5)
                            .endAngle(angleScale(booked + planned ))(null)!}
                        fill="#ccc"
                        stroke={'#000'}
                        strokeWidth={0.5}
                        opacity={getOpacity('planned', false)}
                        onMouseEnter={() => setHoveredTile('planned')}
                        onMouseLeave={() => setHoveredTile(null)}
                    />
                     {/*Hauptfarbe (schwarz) - basierend auf valueBooked*/}
                    <path
                        d={d3.arc<d3.DefaultArcObject>()
                            .innerRadius(radius * 0.6)
                            .outerRadius(radius * 0.7)
                            .startAngle((-Math.PI / 2)+.01)
                            .cornerRadius(5)
                            .endAngle(angleScale(booked))(null)!}
                        fill="#000"
                        stroke={'#000'}
                        strokeWidth={0.5}
                        opacity={getOpacity('booked', false)}
                        onMouseEnter={() => setHoveredTile('booked')}
                        onMouseLeave={() => setHoveredTile(null)}

                    />



                </g>
                {tileAngles.map((angle, index) => {
                    const tileStartAngle = angle;
                    const tileEndAngle = angle + (Math.PI / numTiles);

                    // Berechne den Füllgrad des Tiles basierend auf dem Wert
                    const tileValueRange = (max - min) / numTiles; // Wertbereich pro Tile
                    const tileMinValue = min + index * tileValueRange; // Untergrenze des Tiles
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
                        .innerRadius(radius * 0.7)
                        .outerRadius(radius)
                        .startAngle(tileStartAngle)
                        .endAngle(tileFillEndAngle).padRadius(2).padAngle(2).cornerRadius(5);

                    // Hover-Effekt
                    const tileId = `tile-${index}`;

                    return (
                        <g key={index} onMouseEnter={() => setHoveredTile(tileId)}
                           onMouseLeave={() => setHoveredTile(null)}>
                            {/* Nicht gefüllter Teil des Tiles */}
                            <path
                                d={tileBackgroundArc(null)!}
                                stroke="#000"
                                opacity={getOpacity(tileId)}
                                fill="#ddd"
                            />
                            {/* Gefüllter Teil des Tiles */}
                            {fillRatio > 0 && (
                                <path
                                    d={tileForegroundArc(null)!}
                                    fill={value >= thresholdRed ? '#ff0000' : value >= thresholdYellow && value < thresholdRed ? '#ffff00' : '#00ff00'}
                                    strokeWidth={1}
                                    opacity={getOpacity(tileId, true)}
                                />
                            )}
                        </g>
                    );
                })}
                {/* Text (aktueller Wert) */}
                <text
                    textAnchor="middle"
                    dy="0.35em"
                    fill='#00ffff'
                    fontSize="24"
                >
                    {value}
                </text>
            </g>
        </svg>
    );
};

export default Gauge;
