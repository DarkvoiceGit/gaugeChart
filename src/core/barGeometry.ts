import * as d3 from 'd3';
import {BarOrientation} from "../types";

export interface CreateValueScaleOptions {
    min: number;
    max: number;
    trackLength: number;
    orientation: BarOrientation;
    padding?: number;
}

export function createValueScale(options: CreateValueScaleOptions) {
    const {min, max, trackLength, orientation, padding = 0} = options;
    const range = orientation === 'horizontal'
        ? [padding, trackLength - padding]
        : [trackLength - padding, padding];

    return d3.scaleLinear<number, number>()
        .domain([min, max])
        .range(range);
}

export function normalizedToPosition(normalized: number, scale: d3.ScaleLinear<number, number>): number {
    return scale(scale.domain()[0] + normalized * (scale.domain()[1] - scale.domain()[0]));
}

export function buildTilePositions(
    segmentCount: number,
    trackLength: number,
    gap: number,
    pad: number
): { start: number; end: number }[] {
    if (segmentCount <= 0) return [];

    const totalGap = (segmentCount - 1) * gap;
    const usableLength = trackLength - 2 * pad - totalGap;
    const tileSize = usableLength / segmentCount;

    return d3.range(segmentCount).map(i => {
        const start = pad + i * (tileSize + gap);
        return {
            start,
            end: start + tileSize
        };
    });
}
