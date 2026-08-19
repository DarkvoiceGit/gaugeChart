import {render} from '@testing-library/react';
import {computeGaugeLayoutFromSize, GaugeChart,} from '../index';
import {describe, expect, it} from "vitest";
import {testScale, tileLayer} from "./fixtures/gaugeFixtures.ts";

describe('GaugeChart responsive sizing and viewBox', () => {

    it('uses default preset (m), tight viewBox (semicircle + minimal side margin), SVG dimensions content-based', () => {
        const {container} = render(<GaugeChart scale={testScale} layers={[tileLayer]}/>);
        const svg = container.querySelector('svg');
        expect(svg).not.toBeNull();
        if (!svg) return;

        const expected = computeGaugeLayoutFromSize('default')

        expect(svg.getAttribute('viewBox')).toBe(expected.viewBox);
        expect(svg.getAttribute('width')).toBe(String(expected.viewBoxWidth));
        expect(svg.getAttribute('height')).toBe(String(expected.viewBoxHeight));
        expect(svg.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet');
    });

    it('applies size presets: SVG width/height from content so gauge and font scale with minimal side padding', () => {
        const {container} = render(<GaugeChart scale={testScale} layers={[tileLayer]} size={'xxs'}/>);
        const svg = container.querySelector('svg');
        expect(svg).not.toBeNull();
        if (!svg) return;


        const expected = computeGaugeLayoutFromSize('default')

        expect(svg.getAttribute('viewBox')).toBe(expected.viewBox);
        expect(svg.getAttribute('width')).toBe(String(expected.viewBoxWidth));
        expect(svg.getAttribute('height')).toBe(String(expected.viewBoxHeight));
    });
});

