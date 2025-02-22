import {describe, it, expect, vi, beforeEach} from 'vitest';
import * as d3 from 'd3';
import {angleScale, normalize, calculatePointer, createArc} from '../../utils/gaugeCalculations';
import {ANGLE_RANGE} from '../../utils/constants';

// Mock d3.arc function
vi.mock('d3', async () => {
    const actual = await vi.importActual('d3');
    return {
        ...actual as object,
        arc: vi.fn().mockReturnValue({
            innerRadius: vi.fn().mockReturnThis(),
            outerRadius: vi.fn().mockReturnThis(),
            startAngle: vi.fn().mockReturnThis(),
            endAngle: vi.fn().mockReturnThis(),
            cornerRadius: vi.fn().mockReturnThis(),
            padAngle: vi.fn().mockReturnThis(),
            padRadius: vi.fn().mockReturnThis()
        })
    };
});

describe('angleScale', () => {
    it('maps 0 to START angle', () => {
        expect(angleScale(0)).toBe(ANGLE_RANGE.START);
    });

    it('maps 1 to END angle', () => {
        expect(angleScale(1)).toBe(ANGLE_RANGE.END);
    });

    it('maps values between 0 and 1 proportionally', () => {
        const midValue = angleScale(0.5);
        expect(midValue).toBeGreaterThan(ANGLE_RANGE.START);
        expect(midValue).toBeLessThan(ANGLE_RANGE.END);

        // Should be halfway between START and END
        const expectedMidValue = ANGLE_RANGE.START + (ANGLE_RANGE.END - ANGLE_RANGE.START) / 2;
        expect(midValue).toBeCloseTo(expectedMidValue);
    });
});

describe('normalize', () => {
    it('normalizes values correctly', () => {
        expect(normalize(0, 100)).toBe(0);
        expect(normalize(50, 100)).toBe(0.5);
        expect(normalize(100, 100)).toBe(1);
    });

    it('caps values at 1 when they exceed the threshold', () => {
        expect(normalize(150, 100)).toBe(1);
        expect(normalize(200, 100)).toBe(1);
    });

    it('handles edge cases', () => {
        // Zero threshold should be handled gracefully (avoid division by zero)
        // This is an edge case that might not be explicitly handled in the implementation
        // but we should test for expected behavior
        expect(() => normalize(50, 0)).not.toThrow();

        // Negative values
        expect(normalize(-50, 100)).toBe(-0.5);
    });
});

describe('calculatePointer', () => {
    it('returns an object with x, y, and angle properties', () => {
        const result = calculatePointer(0.5, 100, 1);
        expect(result).toHaveProperty('x');
        expect(result).toHaveProperty('y');
        expect(result).toHaveProperty('angle');
    });

    it('calculates angle based on normalized value', () => {
        // For normalized value 0, angle should be ANGLE_RANGE.START - Math.PI/2
        const result0 = calculatePointer(0, 100, 1);
        expect(result0.angle).toBeCloseTo(ANGLE_RANGE.START - Math.PI / 2);

        // For normalized value 1, angle should be ANGLE_RANGE.END - Math.PI/2
        const result1 = calculatePointer(1, 100, 1);
        expect(result1.angle).toBeCloseTo(ANGLE_RANGE.END - Math.PI / 2);
    });

    it('scales pointer length based on radius and length factor', () => {
        // With length factor 1, pointer should extend to radius
        const result1 = calculatePointer(0.5, 100, 1);
        const expectedLength = 100;
        const actualLength = Math.sqrt(result1.x * result1.x + result1.y * result1.y);
        expect(actualLength).toBeCloseTo(expectedLength);

        // With length factor 0.5, pointer should extend to half radius
        const result2 = calculatePointer(0.5, 100, 0.5);
        const expectedLength2 = 50;
        const actualLength2 = Math.sqrt(result2.x * result2.x + result2.y * result2.y);
        expect(actualLength2).toBeCloseTo(expectedLength2);
    });
});

describe('createArc', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls d3.arc with the correct parameters', () => {
        const innerRadius = 50;
        const outerRadius = 100;
        const startAngle = 0;
        const endAngle = Math.PI;
        const arcConfig = {
            cornerRadius: 5,
            padAngle: 0.1,
            padRadius: 10
        };

        createArc(innerRadius, outerRadius, startAngle, endAngle, arcConfig);

        // Check that d3.arc was called
        expect(d3.arc).toHaveBeenCalled();

        // Check that each method was called with the correct parameters
        const arcInstance = d3.arc();
        expect(arcInstance.innerRadius).toHaveBeenCalledWith(innerRadius);
        expect(arcInstance.outerRadius).toHaveBeenCalledWith(outerRadius);
        expect(arcInstance.startAngle).toHaveBeenCalledWith(startAngle);
        expect(arcInstance.endAngle).toHaveBeenCalledWith(endAngle);
        expect(arcInstance.cornerRadius).toHaveBeenCalledWith(arcConfig.cornerRadius);
        expect(arcInstance.padAngle).toHaveBeenCalledWith(arcConfig.padAngle);
        expect(arcInstance.padRadius).toHaveBeenCalledWith(arcConfig.padRadius);
    });
});