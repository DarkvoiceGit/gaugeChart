import {describe, expect, it} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import {GaugeChart} from "../index";
import {classicThreeLayerGauge, primaryLayer, testScale, tileLayer} from "./fixtures/gaugeFixtures";

describe('GaugeChart.integration', () => {
    it('renders segmented and solid layers together', () => {
        const {container} = render(<GaugeChart scale={testScale} layers={classicThreeLayerGauge}/>)

        const paths = container.querySelectorAll('path');
        expect(paths.length).toBeGreaterThan(10)

        const pointers = container.querySelectorAll('line[marker-end]')
        expect(pointers.length).toBe(2)

        expect(container.querySelector('circle')).not.toBeNull()
    })

    it('shows a layer tooltip on hover', () => {
        const {container} = render(<GaugeChart
            scale={testScale}
            layers={[tileLayer, primaryLayer]}
            interaction={{tooltips: true, tooltipMode: 'layer'}}
            ticks={{enabled: false}}
        />)

        const primaryPath = container.querySelector('path[fill="#000000"]');
        expect(primaryPath).not.toBeNull()

        if (!primaryPath) return

        fireEvent.mouseEnter(primaryPath, {clientX: 120, clientY: 80})
        const tooltipLabel = screen.getByText('Primary:')
        expect(tooltipLabel).toBeInTheDocument()
        expect(tooltipLabel.closest('div')).toHaveTextContent(('40'))
    })

    it('shows all hoverable layers when tooltipMode is all', () => {
        const {container} = render(
            <GaugeChart scale={testScale} layers={classicThreeLayerGauge}
                        interaction={{tooltips: true, tooltipMode: 'all'}}/>
        )

        const tileHoverTarget = container.querySelector('path[fill="transparent"]');
        expect(tileHoverTarget).not.toBeNull()

        if (!tileHoverTarget) return

        fireEvent.mouseEnter(tileHoverTarget, {clientX: 200, clientY: 120})
        expect(screen.getByText('Total:')).toBeInTheDocument()
        expect(screen.getByText('Primary:')).toBeInTheDocument()
        expect(screen.getByText('Secondary:')).toBeInTheDocument()
    })

    it('renders tick labels when ticks are enabled', () => {
        const {container} = render(<GaugeChart scale={testScale} layers={[tileLayer]} ticks={{enabled: true}}/>)

        const labels = container.querySelectorAll('text')
        expect(labels.length).toBeGreaterThan(0)
    })
})