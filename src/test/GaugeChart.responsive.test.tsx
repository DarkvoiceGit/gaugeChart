import React from 'react';
import {render} from '@testing-library/react';
import {GaugeChart, GAUGE_SIZE_PRESETS, RADIUS_SCALES} from '../index';

describe('GaugeChart responsive sizing and viewBox', () => {
    const commonProps = {
        primary: 40,
        tileArc: {
            tiles: 10,
        },
    };

    function expectedViewBox(logicalWidth: number, logicalHeight: number) {
        const radius = Math.min(logicalWidth, logicalHeight) / 2.5;
        const centerX = logicalWidth / 2;
        const centerY = logicalHeight / 2;
        const viewBoxHeight = centerY + Math.max(20, logicalHeight * 0.04);
        const tickLabelRadius = radius * RADIUS_SCALES.TICK_LABEL;
        const sideMargin = Math.max(8, radius * 0.03);
        const viewBoxMinX = centerX - tickLabelRadius - sideMargin;
        const viewBoxWidth = 2 * tickLabelRadius + 2 * sideMargin;
        return { viewBox: `${viewBoxMinX} 0 ${viewBoxWidth} ${viewBoxHeight}`, viewBoxWidth, viewBoxHeight };
    }

    it('uses default preset (m), tight viewBox (semicircle + minimal side margin), SVG dimensions content-based', () => {
        const {container} = render(<GaugeChart {...commonProps} />);
        const svg = container.querySelector('svg');
        expect(svg).not.toBeNull();
        if (!svg) return;

        const { viewBox, viewBoxWidth, viewBoxHeight } = expectedViewBox(800, 600);
        expect(svg.getAttribute('viewBox')).toBe(viewBox);
        expect(svg.getAttribute('width')).toBe(String(viewBoxWidth));
        expect(svg.getAttribute('height')).toBe(String(viewBoxHeight));
        expect(svg.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet');
    });

    it('applies size presets: SVG width/height from content so gauge and font scale with minimal side padding', () => {
        const {width, height} = GAUGE_SIZE_PRESETS.xxs;
        const {container} = render(<GaugeChart {...commonProps} size="xxs" />);
        const svg = container.querySelector('svg');
        expect(svg).not.toBeNull();
        if (!svg) return;

        const { viewBox, viewBoxWidth, viewBoxHeight } = expectedViewBox(width, height);
        expect(svg.getAttribute('viewBox')).toBe(viewBox);
        expect(svg.getAttribute('width')).toBe(String(viewBoxWidth));
        expect(svg.getAttribute('height')).toBe(String(viewBoxHeight));
    });
});

