import React from "react";
import {ResolvedPointer} from "../core/resolveLayers.ts";
import GaugePointer from "../GaugePointer.tsx";
import {resolvePointerStrokeScale} from "../utils/pointerScale.ts";

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
            <GaugePointer x={pointer.x} y={pointer.y} color={pointer.color} markerId={pointer.layerId}
                          strokeScale={resolvePointerStrokeScale(scaleFactor, pointer.strokeScale, referenceScaleFactor)}
                          animate={animate} animationDurationMs={animationDurationMs}
            />
        ))}
    </>
)

export default GaugePointers;