const GaugePointer = ({x, y, color, markerId, pointerScale, strokeScale}: {
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

export default GaugePointer;
