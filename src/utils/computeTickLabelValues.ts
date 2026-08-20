const FLOAT_EPSILON = 1e-9
const DEFAULT_CROWDED_END_RATIO = 0.5


export interface ComputeTickLabelValueOptions {
    /**
     * Drop the penultimate tick when its gap to max is smaller than this fraction of step (default 0.5) set true to use the default
     * */
    hideCrowdedEndTick?: boolean | number;
}

function nearlyEqual(a: number, b: number, epsilon = FLOAT_EPSILON) {
    return Math.abs(a - b) <= epsilon
}

function resolveCrowdedEndRatio(option: boolean | number | undefined): number | undefined {
    if (option === true) {
        return DEFAULT_CROWDED_END_RATIO
    }

    if (typeof option === 'number' && Number.isFinite(option) && option > 0) {
        return option
    }

    return undefined
}

export function computeTickLabelValues(min: number, max: number, step: number, options: ComputeTickLabelValueOptions = {}): Array<number> {
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


    const lastStepTick = ticks.length > 0 ? ticks[ticks.length - 1] : undefined
    const maxOnGrid = lastStepTick !== undefined ? nearlyEqual(lastStepTick + step, max) : nearlyEqual(min, max)

    if (ticks.length === 0 || !nearlyEqual(ticks[ticks.length - 1], max)) {
        ticks.push(max)
    }

    const crowdedEndRatio = resolveCrowdedEndRatio(options.hideCrowdedEndTick)
    if (crowdedEndRatio !== undefined && ticks.length >= 3 && !maxOnGrid) {
        const previous = ticks[ticks.length - 2]
        const gap = max - previous
        if (gap < step * crowdedEndRatio) {
            ticks.splice(ticks.length - 2, 1)
        }
    }

    return ticks
}