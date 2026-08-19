export function resolvePointerStrokeScale(scaleFactor: number, strokeScale: number, referenceScaleFactor: number) {
    if (scaleFactor === referenceScaleFactor || strokeScale !== referenceScaleFactor) {
        return strokeScale
    }

    return strokeScale * scaleFactor
}