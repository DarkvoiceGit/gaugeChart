import {describe, it, expect} from 'vitest';
import {buildTilePositions, createValueScale} from '../../core/barGeometry';
import {resolveBarTrackBounds} from '../../utils/barGuards';

describe('barGeometry', () => {
    describe('resolveBarTrackBounds', () => {
        it('should resolve inward grow correctly', () => {
            const result = resolveBarTrackBounds({track: 0.8, thickness: 0.1, grow: 'inward'});
            expect(result.innerRatio).toBeCloseTo(0.7);
            expect(result.outerRatio).toBeCloseTo(0.8);
        });
        it('should resolve outward grow correctly', () => {
            const result = resolveBarTrackBounds({track: 0.8, thickness: 0.1, grow: 'outward'});
            expect(result.innerRatio).toBeCloseTo(0.8);
            expect(result.outerRatio).toBeCloseTo(0.9);
        });
        it('should resolve center grow correctly', () => {
            const result = resolveBarTrackBounds({track: 0.8, thickness: 0.1, grow: 'center'});
            expect(result.innerRatio).toBeCloseTo(0.75);
            expect(result.outerRatio).toBeCloseTo(0.85);
        });
    });

    describe('buildTilePositions', () => {
        it('should calculate positions correctly', () => {
            const positions = buildTilePositions(2, 100, 10, 5);
            // pad 5. usable = 100 - 2*5 - 10 = 80. tileSize = 80 / 2 = 40.
            // i=0: start = 5 + 0 = 5. end = 45.
            // i=1: start = 5 + 40 + 10 = 55. end = 95.
            expect(positions).toEqual([{start: 5, end: 45}, {start: 55, end: 95}]);
        });
    });

    describe('createValueScale', () => {
        it('should create horizontal scale', () => {
            const scale = createValueScale({min: 0, max: 100, trackLength: 100, orientation: 'horizontal', padding: 10});
            expect(scale(0)).toBe(10);
            expect(scale(100)).toBe(90);
        });
        it('should create vertical scale', () => {
            const scale = createValueScale({min: 0, max: 100, trackLength: 100, orientation: 'vertical', padding: 10});
            expect(scale(0)).toBe(90);
            expect(scale(100)).toBe(10);
        });
    });
});
