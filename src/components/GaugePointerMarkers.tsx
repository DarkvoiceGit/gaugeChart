import {useGaugeTheme} from "../theme/useGaugeTheme";

export interface PointerMarkerSpec {
    id: string;
    color: string;
    scale: number;
}

interface GaugePointerMarkersProps {
    markers: PointerMarkerSpec[];
}

const GaugePointerMarkers: React.FC<GaugePointerMarkersProps> = ({markers}) => {
    const theme = useGaugeTheme()

    return (
        <>
            {markers.map(({id, color, scale}) => {
                const markerWidth = theme.pointer.markerBaseSize * scale
                const markerHeight = theme.pointer.markerBaseSize * scale

                return(
                    <marker key={id} id={`arrowhead-${id}`} markerWidth={markerWidth} markerHeight={markerHeight}
                    refX={markerWidth * theme.pointer.markerRefXRatio}
                    refY={markerHeight / 2}
                    orient={'auto'}>
                        <polygon
                        points={`0 0 ${markerWidth} ${markerHeight /2}, 0 ${markerHeight}`}
                        fill={color}/>
                    </marker>
                )
            })}
        </>
    )
}

export default GaugePointerMarkers