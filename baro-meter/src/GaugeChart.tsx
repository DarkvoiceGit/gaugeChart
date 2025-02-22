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
    const [isTileHovered, setIsTileHovered] = useState<boolean>(false);
    const [isBarBookedHovered, setIsBarBookedHovered] = useState<boolean>(false);
    const [isBarPlannedHovered, setIsBarPlannedHovered] = useState<boolean>(false);

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



    const getOpacity = (isFilled: boolean, isBarBooked: boolean, isBarPlanned: boolean) =>{
        if (isBarBookedHovered && isBarBooked) return 1;
        if (isBarPlannedHovered && isBarPlanned) return 1;
        if(isTileHovered && isFilled) { return 1}
        if(isTileHovered || isBarBookedHovered || isBarPlannedHovered) { return 0.2}
        return 1
    }

    // Radius des Halbkreises
    const radius = Math.min(width, height) / 2;



    // Tiles zeichnen
    const tileAngles = d3.range(-Math.PI / 2, Math.PI / 2, (Math.PI) / numTiles);

    return (
        <svg ref={ref} width={width} height={height}>
            <g transform={`translate(${width / 2}, ${height / 2})`}>
                <g>

                    <path
                        d={d3.arc<d3.DefaultArcObject>()
                            .innerRadius(radius * 0.6)
                            .outerRadius(radius * 0.7)
                            .startAngle((-Math.PI / 2) + .01)
                            .cornerRadius(5)
                            .endAngle(angleScale(booked + planned))(null)!}
                        fill="#ccc"
                        stroke={'#000'}
                        strokeWidth={0.5}
                        opacity={getOpacity(false, false, true)}
                        onMouseEnter={() => setIsBarPlannedHovered(true)}
                        onMouseLeave={() => setIsBarPlannedHovered(false)}
                    />
                    {/*Hauptfarbe (schwarz) - basierend auf valueBooked*/}
                    <path
                        d={d3.arc<d3.DefaultArcObject>()
                            .innerRadius(radius * 0.6)
                            .outerRadius(radius * 0.7)
                            .startAngle((-Math.PI / 2) + .01)
                            .cornerRadius(5)
                            .endAngle(angleScale(booked))(null)!}
                        fill="#000"
                        stroke={'#000'}
                        strokeWidth={0.5}
                        onMouseEnter={() => setIsBarBookedHovered(true)}
                        onMouseLeave={() => setIsBarBookedHovered(false)}
                        opacity={getOpacity(false, true, false)}

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
                    const fillColor = value >= thresholdRed ? '#ff0000' : value >= thresholdYellow && value < thresholdRed ? '#ffff00' : '#00ff00';

                    return (
                        <g key={index}>
                            {/* Nicht gefüllter Teil des Tiles */}
                            <path
                                d={tileBackgroundArc(null)!}
                                stroke="#000"
                                opacity={getOpacity(false, false, false)}
                                fill="#ddd"
                            />
                            {/* Gefüllter Teil des Tiles */}
                            {fillRatio > 0 && (
                                <path
                                    d={tileForegroundArc(null)!}
                                    fill={value >= thresholdRed ? '#ff0000' : value >= thresholdYellow && value < thresholdRed ? '#ffff00' : '#00ff00'}
                                    strokeWidth={1}
                                    opacity={getOpacity(true, false, false)} // Gefüllte Bereiche: Opacity 1
                                />
                            )}
                        </g>
                    );
                })}

                <path
                    d={d3.arc<d3.DefaultArcObject>()
                        .innerRadius(radius * 0.72)
                        .outerRadius(radius)
                        .startAngle(-Math.PI / 2)
                        .endAngle(Math.PI / 2)(null)!}
                    fill="transparent"
                    onMouseEnter={() => setIsTileHovered(true)}
                    onMouseLeave={() => setIsTileHovered(false)}
                />
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
