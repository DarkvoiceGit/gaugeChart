import {useGaugeTheme} from "./theme/useGaugeTheme";
import {useRef} from "react";
import {useAnimatedSvgAttribute} from "./hooks/useAnimatedSvgAttribute.ts";

interface GaugePointerProps {
    x: number;
    y: number;
    color: string;
    markerId: string;
    strokeScale: number;
    animate?: boolean;
    animationDurationMs?: number;
}

const GaugePointer = ({
                          x,
                          y,
                          color,
                          markerId,
                          strokeScale,
                          animate = false,
                          animationDurationMs = 300
                      }: GaugePointerProps) => {

    const theme = useGaugeTheme()

    const lineRef = useRef<SVGLineElement>(null);

    useAnimatedSvgAttribute(lineRef, 'x2', x, animate, animationDurationMs)
    useAnimatedSvgAttribute(lineRef, 'y2', y, animate, animationDurationMs)

    return (

        <>
            <line
                ref={lineRef}
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
