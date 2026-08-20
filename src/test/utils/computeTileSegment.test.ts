import {describe, it, expect} from 'vitest';
import {computeTileSegments} from '../../utils/computeTileSegment';
import {buildTileAngles} from '../../core/gaugeGeometry';
import {DEFAULT_THEME} from '../../theme/defaultTheme';
import {TileFillStyle} from '../../utils/constants';

function createSegmentOptions(sumNormalized: number, numberOfTiles = 10) {
    const tileAngles = buildTileAngles(DEFAULT_THEME.geometry, numberOfTiles);
    const baseRadius = 240

    return {
        layerId: 'tiles',
        tileAngles,
        numberOfTiles,
        sumNormalized,
        thresholdRed: 80,
        innerRadius: baseRadius * 0.7,
        outerRadius: baseRadius,
        radius: 240,
        scaleFactor: 1,
        isTileHovered: false,
        enableOpacityEffect: true,
        colorScale: null,
        config: {
            isTileColorGradient: false,
            gradientType: 'tile',
            thresholdYellowNormalized: 0.75,
            thresholdRedNormalized: 1,
            colorTileThresholdDefault: '#00ff00',
            colorTileThresholdYellow: '#ffff00',
            colorTileThresholdRed: '#ff0000',
            colorTileBg: '#dddddd',
            fillStyle: TileFillStyle.FILLED,
            borderColor: '#000000',
            borderThickness: 1,
            arcConfig: {
                cornerRadius: DEFAULT_THEME.arc.defaultCornerRadius,
                padAngle: DEFAULT_THEME.arc.tilePadAngle,
                padRadius: DEFAULT_THEME.arc.tilePadRadius,
            },
        },
        theme: DEFAULT_THEME,
    };
}

describe('computeTileSegments', () => {
    it('creates one segment per tile angle', () => {
        const segments = computeTileSegments(createSegmentOptions(0.5));
        expect(segments).toHaveLength(10);
        segments.forEach((segment, index) => {
            expect(segment.index).toBe(index);
            expect(segment.backgroundPath).toBeTruthy();
        });
    });

    it('leaves later tiles empty when sum is below their range', () => {
        const segments = computeTileSegments(createSegmentOptions(0.05));
        expect(segments[0].fillRatio).toBeGreaterThan(0);
        expect(segments[1].fillRatio).toBe(0);
        expect(segments[1].foregroundPath).toBeNull();
    });

    it('partially fills the boundary tile', () => {
        const segments = computeTileSegments(createSegmentOptions(0.45));
        expect(segments[4].fillRatio).toBeCloseTo(0.5);
        expect(segments[4].foregroundPath).toBeTruthy();
    });

    it('fully fills all tiles when value is at max', () => {
        const segments = computeTileSegments(createSegmentOptions(1));
        segments.forEach((segment) => {
            expect(segment.fillRatio).toBeCloseTo(1);
            expect(segment.foregroundPath).toBeTruthy();
        });
    });

    it('uses geometry sweep for tile width instead of hardcoded pi', () => {
        const geometry = {
            ...DEFAULT_THEME.geometry,
            startAngle: 0,
            endAngle: Math.PI,
        };
        const options = createSegmentOptions(0.25, 4);
        const segments = computeTileSegments({
            ...options,
            theme: {...DEFAULT_THEME, geometry},
            tileAngles: buildTileAngles(geometry, 4),
            numberOfTiles: 4,
        });

        expect(segments).toHaveLength(4);
        expect(segments.every((segment) => segment.backgroundPath)).toBe(true);
    });
});