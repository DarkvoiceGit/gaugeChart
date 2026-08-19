import {useGaugeTheme} from "./theme/useGaugeTheme";

interface GaugePointerProps {
    x: number;
    y: number;
    color: string;
    markerId: string;
    strokeScale: number;
}
const GaugePointer = ({x, y, color, markerId, strokeScale}:GaugePointerProps) => {

    const theme = useGaugeTheme()

    return (

        <>
            <line
                x1={0}
                y1={0}
                x2={x}
                y2={y}
                stroke={color}
                strokeWidth={theme.pointer.baseStrokeWidth * strokeScale}
                markerEnd={`url(#arrowhead-${markerId})`}

            />
        </>

    );
}

export default GaugePointer;
