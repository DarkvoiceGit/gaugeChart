import React from "react";
import {ResolvedPointer} from "../core/resolveLayers";
import GaugePointer from "../GaugePointer";
import {resolvePointerStrokeScale} from "../utils/pointerScale";

interface GaugePointersProps {
    pointers: ResolvedPointer[];
    scaleFactor: number;
    referenceScaleFactor: number;
    animate: boolean,
    animationDurationMs: number,
}

const GaugePointers: React.FC<GaugePointersProps> = ({
                                                         pointers,
                                                         referenceScaleFactor,
                                                         scaleFactor,
                                                         animate,
                                                         animationDurationMs
                                                     }) => (
    <>
        {pointers.map((pointer) => (
            <GaugePointer
                key={pointer.layerId}
                x={pointer.x}
                y={pointer.y}
                color={pointer.color}
                markerId={pointer.layerId}
                strokeScale={resolvePointerStrokeScale(scaleFactor, pointer.strokeScale, referenceScaleFactor)}
                style={pointer.style}
                animate={animate}
                animationDurationMs={animationDurationMs}
            />
        ))}
    </>
)

export default GaugePointers;