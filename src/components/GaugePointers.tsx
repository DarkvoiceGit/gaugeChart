import React from "react";
import {ResolvedPointer} from "../core/resolveLayers.ts";
import GaugePointer from "../GaugePointer.tsx";
import {resolvePointerStrokeScale} from "../utils/pointerScale.ts";

interface GaugePointersProps {
    pointers: ResolvedPointer[];
    scaleFactor: number;
    referenceScaleFactor: number;
}

const GaugePointers: React.FC<GaugePointersProps> =  ({pointers, referenceScaleFactor, scaleFactor})=>(
    <>
        {pointers.map((pointer) => (
            <GaugePointer x={pointer.x} y={pointer.y} color={pointer.color} markerId={pointer.layerId} strokeScale={resolvePointerStrokeScale(scaleFactor, pointer.strokeScale, referenceScaleFactor)} />
         ))}
    </>
)

export default GaugePointers;