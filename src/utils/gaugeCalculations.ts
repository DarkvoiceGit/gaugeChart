import * as d3 from 'd3';
import {ANGLE_RANGE} from './constants';
import {DEFAULT_THEME} from "../theme/defaultTheme";

/**
 * Scale for the angle (from min to max)
 * Maps values from 0-1 to the angle range defined in constants
 */
export const angleScale = d3.scaleLinear()
    .domain([0, 1])
    .range([ANGLE_RANGE.START, ANGLE_RANGE.END]);

const EMPTY_ARRC: d3.DefaultArcObject = {
    innerRadius: 0,
    outerRadius: 0,
    startAngle: 0,
    endAngle: 0,
}

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
export const valueToAngle = (normalizedValue: number): number => Math.min(angleScale(normalizedValue), ANGLE_RANGE.END);

/**
 * Normalizes a value based on a threshold
 * @param value The value to normalize
 * @param thresholdRed The maximum threshold value
 * @returns The normalized value between 0 and 1
 */
export const normalize = (value: number, thresholdRed: number): number => {
    if (thresholdRed <= 0) {
        return 0;
    }
    return Math.min(DEFAULT_THEME.scale.normalizedMax, value / thresholdRed);
};

/**
 * Calculates the pointer position based on a normalized value
 * @param normalizedValue The normalized value (0-1)
 * @param radius The radius of the gauge
 * @param length The length factor for the pointer
 * @param pointerAngleOffset Angle subtracted from the scale output for x/y coordinates
 * @returns Object with x, y coordinates and angle
 */
export const calculatePointer = (
    normalizedValue: number,
    radius: number,
    length: number,
    pointerAngleOffset: number = DEFAULT_THEME.geometry.pointerAngleOffset
): { x: number; y: number; angle: number } => {
    // Calculate angle based on the normalized value
    const angle = angleScale(normalizedValue) - pointerAngleOffset;

    // Calculate x and y coordinates
    const pointerX = (Math.cos(angle) * radius) * length;
    const pointerY = (Math.sin(angle) * radius) * length;

    return {x: pointerX, y: pointerY, angle};
};

export const buildArcPath = (spec: ArcPathSpec): string | null => {

    const generator = d3.arc<d3.DefaultArcObject>().innerRadius(spec.innerRadius).outerRadius(spec.outerRadius)
        .startAngle(spec.startAngle).endAngle(spec.endAngle);
    if (spec.cornerRadius != null) {
        generator.cornerRadius(spec.cornerRadius);
    }
    if (spec.padAngle != null) {
        generator.padAngle(spec.padAngle);
    }
    if (spec.padRadius != null) {
        generator.padRadius(spec.padRadius);
    }

    return generator(EMPTY_ARRC)
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
export const createArc = (
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number,
    arcConfig: { cornerRadius: number; padAngle: number; padRadius: number }
) => {
    return d3.arc<d3.DefaultArcObject>()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle)
        .cornerRadius(arcConfig.cornerRadius)
        .padAngle(arcConfig.padAngle)
        .padRadius(arcConfig.padRadius);
};