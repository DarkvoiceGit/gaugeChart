const MAX_TILE_COUNT = 500;

/**
 * Returns value when it is a finite number; otherwise 0.
 */
export function toFiniteNumber(value: number | undefined, fallback = 0): number {
    if (value === undefined || !Number.isFinite(value)) {
        return fallback;
    }
    return value;
}

/**
 * Guard for gauge maximum threshold — must be a positive finite number.
 */
export function assertPositiveThreshold(thresholdRed: number): number {
    if (!Number.isFinite(thresholdRed) || thresholdRed <= 0) {
        throw new RangeError('thresholdRed must be a positive finite number');
    }
    return thresholdRed;
}

/**
 * Guard for yellow threshold — must be less than red when both are used for zones.
 */
export function assertValidThresholdPair(thresholdRed: number, thresholdYellow: number): void {
    assertPositiveThreshold(thresholdRed);
    if (!Number.isFinite(thresholdYellow)) {
        throw new RangeError('thresholdYellow must be a finite number');
    }
    if (thresholdYellow >= thresholdRed) {
        throw new RangeError('thresholdYellow must be less than thresholdRed');
    }
}

/**
 * Resolves tile count with a deterministic upper bound.
 */
export function resolveTileCount(tiles: number | undefined, minCount: number): number {
    if (tiles === undefined || tiles <= 0) {
        return minCount;
    }
    if (!Number.isFinite(tiles)) {
        return minCount;
    }
    return Math.min(Math.floor(tiles), MAX_TILE_COUNT);
}

/**
 * Guard for layout dimensions used in viewBox computation.
 */
export function assertPositiveDimensions(width: number, height: number): void {
    if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
        throw new RangeError('Gauge layout requires positive finite width and height');
    }
}

export function assertValidGeometry(geometry: {
    startAngle: number;
    endAngle: number;
}): void {
    if(!Number.isFinite(geometry.startAngle) || !Number.isFinite(geometry.endAngle)) {
        throw new RangeError('geometry startAngle and endAngle must be finite numbers');
    }

    if(geometry.endAngle <= geometry.startAngle){
        throw new RangeError('geometry endAngle must be greater than startAngle');
    }
    if(geometry.endAngle - geometry.startAngle > 2 * Math.PI){
        throw new RangeError('geometry sweep cannot exceed a full circle')
    }
}