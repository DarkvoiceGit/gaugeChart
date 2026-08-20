import * as d3 from 'd3';
import type {BarOrientation, BarRect} from '../types';

export {resolveBarTrackBounds} from '../utils/barGuards';

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
    const [domainMin, domainMax] = scale.domain();
    return scale(domainMin + normalized * (domainMax - domainMin));
}

export function buildTilePositions(
    segmentCount: number,
    trackLength: number,
    gap: number,
    pad: number,
    orientation: BarOrientation = 'horizontal',
): { start: number; end: number }[] {
    if (segmentCount <= 0) {
        return [];
    }

    const totalGap = (segmentCount - 1) * gap;
    const usableLength = trackLength - 2 * pad - totalGap;
    const tileSize = usableLength / segmentCount;

    return d3.range(segmentCount).map((index) => {
        if (orientation === 'horizontal') {
            const start = pad + index * (tileSize + gap);
            return {start, end: start + tileSize};
        }

        const start = trackLength - pad - tileSize - index * (tileSize + gap);
        return {start, end: start + tileSize};
    });
}

export function mapBarFillRect(
    fillStart: number,
    fillEnd: number,
    trackInner: number,
    trackOuter: number,
    orientation: BarOrientation,
    cornerRadius = 0,
): BarRect {
    const fillMin = Math.min(fillStart, fillEnd);
    const fillSize = Math.abs(fillEnd - fillStart);
    const trackSize = trackOuter - trackInner;

    if (orientation === 'horizontal') {
        return {
            x: fillMin,
            y: trackInner,
            width: fillSize,
            height: trackSize,
            rx: cornerRadius,
        };
    }

    return {
        x: trackInner,
        y: fillMin,
        width: trackSize,
        height: fillSize,
        rx: cornerRadius,
    };
}
