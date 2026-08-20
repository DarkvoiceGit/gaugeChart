import type {MouseEvent as ReactMouseEvent} from 'react';
import {useCallback, useState} from 'react';
import type {ResolvedInteractiveLayer} from '../core/resolvedLayerBase';
import type {GaugeFormatters, TooltipItem, TooltipState} from '../types';
import type {GaugeThemeInteraction} from '../types/theme.types';
import {
    buildLayerTooltipContent,
    createTooltipState,
    updateTooltipPositionState,
} from '../utils/buildLayerTooltipContent';
import {getLayerOpacity as resolveLayerOpacity} from '../utils/getLayerOpacity';

export interface LayerHandlers {
    onMouseEnter: (event: ReactMouseEvent) => void;
    onMouseMove: (event: ReactMouseEvent) => void;
    onMouseLeave: () => void;
}

export interface GaugeInteractionState {
    hoveredLayerId: string | null;
    tooltip: TooltipState | null;
}

export interface UseGaugeInteractionOptions {
    layers: ResolvedInteractiveLayer[];
    formatters?: GaugeFormatters;
    tooltipMode: 'layer' | 'all';
    tooltipsEnabled: boolean;
    hoverDimming: boolean;
    interaction: GaugeThemeInteraction;
}

export function useGaugeInteraction(options: UseGaugeInteractionOptions): GaugeInteractionState & {
    getLayerHandlers: (layerId: string) => LayerHandlers;
    getLayerOpacity: (layerId: string) => number;
} {
    const {
        layers,
        formatters,
        tooltipMode,
        tooltipsEnabled,
        hoverDimming,
        interaction,
    } = options;

    const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);

    const showTooltip = useCallback((event: ReactMouseEvent, text: TooltipItem[]) => {
        setTooltip(createTooltipState(event,  text));
    }, []);

    const moveTooltip = useCallback((event: ReactMouseEvent) => {
        const position = updateTooltipPositionState(event);
        setTooltip((previous) => previous ? {...previous, ...position} : null);
    }, []);

    const hideTooltip = useCallback(() => {
        setTooltip(null);
        setHoveredLayerId(null);
    }, []);

    const getLayerOpacity = useCallback(
        (layerId: string) => resolveLayerOpacity(layerId, hoveredLayerId, hoverDimming, interaction),
        [hoverDimming, hoveredLayerId, interaction],
    );

    const getLayerHandlers = useCallback((layerId: string): LayerHandlers => ({
        onMouseEnter: (event: ReactMouseEvent) => {
            setHoveredLayerId(layerId);
            if (!tooltipsEnabled) {
                return;
            }
            const items = buildLayerTooltipContent({
                layers,
                hoveredLayerId: layerId,
                tooltipMode,
                formatters,
                interaction: { tooltips: tooltipsEnabled }
            });
            showTooltip(event, items);
        },
        onMouseMove: tooltipsEnabled ? moveTooltip : () => undefined,
        onMouseLeave: hideTooltip,
    }), [
        formatters,
        hideTooltip,
        layers,
        moveTooltip,
        showTooltip,
        tooltipMode,
        tooltipsEnabled,
    ]);

    return {
        hoveredLayerId,
        tooltip,
        getLayerHandlers,
        getLayerOpacity,
    };
}