const FLOAT_EPSILON = 1e-9

function nearlyEqual(a: number, b: number, epsilon = FLOAT_EPSILON) {
    return Math.abs(a - b) <= epsilon
}

export function computeTickLabelValues(min: number, max: number, step: number): Array<number> {
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return []
    }

    if (nearlyEqual(min, max) || max < min) {
        return [min]
    }

    if (!Number.isFinite(step) || step <= 0) {
        return [min, max]
    }

    const ticks: number[] = []
    const maxSteps = Math.ceil((max - min) / step) + 2;

    for (let i = 0; i < maxSteps; i += 1) {
        const value = min + i * step
        if (value > max || nearlyEqual(value, max)) {
            break
        }
        ticks.push(value)
    }

    if (ticks.length === 0 || !nearlyEqual(ticks[ticks.length - 1], max)) {
        ticks.push(max)
    }

    return ticks
}