import * as d3 from 'd3';
import {DEFAULT_THEME} from "../theme/defaultTheme";
import {createAngleScale, valueToAngle as mapValueToAngle} from "../core/gaugeGeometry";

const EMPTY_ARC: d3.DefaultArcObject = {
    innerRadius: 0,
    outerRadius: 0,
    startAngle: 0,
    endAngle: 0,
}

export const angleScale = createAngleScale(DEFAULT_THEME.geometry)

export interface ArcPathSpec {
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    cornerRadius?: number;
    padAngle?: number;
    padRadius?: number;
}

/**
 * Maps a normalized value (0-1) to an arc angle, capped at ANGLE_RANGE.END
 * */
export function valueToAngle(normalizedValue: number, geometry = DEFAULT_THEME.geometry): number {
    return mapValueToAngle(normalizedValue, geometry);
}

/**
 * Normalizes a value based on a threshold
 * @param value The value to normalize
 * @param thresholdRed The maximum threshold value
 * @returns The normalized value between 0 and 1
 */
export function normalize(value: number, thresholdRed: number): number {
    if (thresholdRed <= 0) {
        return 0;
    }
    return Math.min(DEFAULT_THEME.scale.normalizedMax, value / thresholdRed);
};

export function calculatePointer(
    normalizedValue: number,
    radius: number,
    length: number,
    geometry = DEFAULT_THEME.geometry,
): { x: number; y: number; angle: number } {
    // Calculate angle based on the normalized value
    const angle = createAngleScale(geometry)(normalizedValue) - geometry.pointerAngleOffset;

    // Calculate x and y coordinates
    const pointerX = (Math.cos(angle) * radius) * length;
    const pointerY = (Math.sin(angle) * radius) * length;

    return {x: pointerX, y: pointerY, angle};
};

export function buildArcPath(spec: ArcPathSpec): string | null {

    const generator = d3.arc<d3.DefaultArcObject>()
        .innerRadius(spec.innerRadius)
        .outerRadius(spec.outerRadius)
        .startAngle(spec.startAngle)
        .endAngle(spec.endAngle);

    if (spec.cornerRadius != null) {
        generator.cornerRadius(spec.cornerRadius);
    }
    if (spec.padAngle != null) {
        generator.padAngle(spec.padAngle);
    }
    if (spec.padRadius != null) {
        generator.padRadius(spec.padRadius);
    }

    return generator(EMPTY_ARC)
}

/**
 * Creates a D3 arc with the specified parameters
 * @param innerRadius The inner radius of the arc
 * @param outerRadius The outer radius of the arc
 * @param startAngle The start angle of the arc
 * @param endAngle The end angle of the arc
 * @param arcConfig Configuration for the arc (cornerRadius, padAngle, padRadius)
 * @returns A D3 arc function
 */
export function createArc(
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number,
    arcConfig: { cornerRadius: number; padAngle: number; padRadius: number }
) {
    return d3.arc<d3.DefaultArcObject>()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle)
        .cornerRadius(arcConfig.cornerRadius)
        .padAngle(arcConfig.padAngle)
        .padRadius(arcConfig.padRadius);
};