import {useGaugeTheme} from "./theme/useGaugeTheme";
import {useRef} from "react";
import {useAnimatedSvgAttribute} from "./hooks/useAnimatedSvgAttribute";
import {PointerStyle} from "./types";

interface GaugePointerProps {
    x: number;
    y: number;
    color: string;
    markerId: string;
    strokeScale: number;
    style?: PointerStyle;
    animate?: boolean;
    animationDurationMs?: number;
}

function buildNeedlePath(length: number, hubRadius: number, baseHalfWidth: number): string {
    const joinX = Math.min(hubRadius * 0.35, length * 0.15)
    return [
        `M ${length} 0`,
        `L ${joinX} ${baseHalfWidth}`,
        `L ${joinX} ${-baseHalfWidth}`,
        `Z`,
    ].join(' ');
}

const GaugePointer = ({
                          x,
                          y,
                          color,
                          markerId,
                          strokeScale,
                          style = 'arrow',
                          animate = false,
                          animationDurationMs = 300
                      }: GaugePointerProps) => {

    const theme = useGaugeTheme()

    const lineRef = useRef<SVGLineElement>(null);
    const needleRef = useRef<SVGGElement>(null)

    const length = Math.hypot(x, y)
    const angleDeg = length > 0 ? (Math.atan2(y, x) * 180) / Math.PI : 0

    useAnimatedSvgAttribute(lineRef, 'x2', x, animate && style === 'arrow', animationDurationMs)
    useAnimatedSvgAttribute(lineRef, 'y2', y, animate && style === 'arrow', animationDurationMs)
    useAnimatedSvgAttribute(needleRef, 'transform', `rotate(${angleDeg})`, animate && style === 'needle', animationDurationMs)

    if (style === 'needle') {
        const hubRadius = length * (theme.pointer.needleHubLengthRatio / 2)
        const baseHalfWidth = hubRadius * theme.pointer.needleBaseWidthRatio
        const needlePath = buildNeedlePath(length, hubRadius, baseHalfWidth)

        return (<g ref={needleRef} transform={`rotate(${angleDeg})`}>
            <circle cx={0} cy={0} r={hubRadius} fill={color}/>
            <path d={needlePath} fill={color}/>
        </g>)
    }

    return (
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
    );
}

export default GaugePointer;
