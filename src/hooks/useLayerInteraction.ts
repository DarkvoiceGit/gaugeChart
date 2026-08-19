import type {MouseEvent as ReactMouseEvent} from 'react';
import {useCallback, useState, type RefObject} from 'react';
import type {ResolvedLayer} from '../core/resolveLayers';
import type {GaugeFormatters, TooltipItem, TooltipState} from '../types';
import {
    buildLayerTooltipContent,
    createTooltipState,
    updateTooltipPositionState,
} from '../utils/buildLayerTooltipContent';

export function useLayerInteraction(
    svgRef: RefObject<SVGSVGElement | null>,
    layers: ResolvedLayer[],
    formatters: GaugeFormatters | undefined,
    tooltipMode: 'layer' | 'all',
) {
    const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);

    const showTooltip = useCallback((event: ReactMouseEvent, text: TooltipItem[]) => {
        setTooltip(createTooltipState(event, svgRef.current, text));
    }, [svgRef]);

    const moveTooltip = useCallback((event: ReactMouseEvent) => {
        const position = updateTooltipPositionState(event, svgRef.current);
        setTooltip((previous) => previous ? {...previous, ...position} : null);
    }, [svgRef]);

    const hideTooltip = useCallback(() => {
        setTooltip(null);
        setHoveredLayerId(null);
    }, []);

    const getLayerHandlers = useCallback((layerId: string) => ({
        onMouseEnter: (event: ReactMouseEvent) => {
            const items = buildLayerTooltipContent({
                layers,
                hoveredLayerId: layerId,
                tooltipMode,
                formatters,
            });
            showTooltip(event, items);
            setHoveredLayerId(layerId);
        },
        onMouseMove: moveTooltip,
        onMouseLeave: hideTooltip,
    }), [formatters, hideTooltip, layers, moveTooltip, showTooltip, tooltipMode]);

    return {
        tooltip,
        hoveredLayerId,
        getLayerHandlers,
    };
}