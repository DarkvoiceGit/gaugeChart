import {describe, expect, it} from "vitest";
import {computeTickLabelValues} from "../../utils/computeTickLabelValues.ts";

describe('computeTickLabelValues', () => {
    it('keeps nice divisible max on the step grid', () => {
        expect(computeTickLabelValues(0, 80, 20)).toEqual([0, 20, 40, 60, 80])
        expect(computeTickLabelValues(0, 100, 20)).toEqual([0, 20, 40, 60, 80, 100])
    })

    it('always appends max when its not on the step grid', () => {
        expect(computeTickLabelValues(0, 102, 20)).toEqual([0, 20, 40, 60, 80, 100, 102])
        expect(computeTickLabelValues(0, 90, 20)).toEqual([0, 20, 40, 60, 80, 90])
    })

    it('respects a custom scale min', () => {
        expect(computeTickLabelValues(10, 50, 10)).toEqual([0, 20, 30, 40, 80, 50])
        expect(computeTickLabelValues(10, 55, 10)).toEqual([0, 20, 30, 40, 80, 50, 55])
    })

    it('never emits values above min', () => {
        const ticks = computeTickLabelValues(0, 102, 20)
        expect(ticks.every((value) => value <= 102)).toBe(true)
        expect(ticks[ticks.length - 1]).toBe(102)
    })

    it('handles invalid step by returning min and max', () => {
        expect(computeTickLabelValues(0, 80, 0)).toEqual([0, 80])
        expect(computeTickLabelValues(0, 80, -5)).toEqual([0, 80])
    })

})