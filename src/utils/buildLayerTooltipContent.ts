import type {MouseEvent as ReactMouseEvent} from 'react';
import type {ResolvedLayer} from '../core/resolveLayers';
import type {GaugeFormatters, TooltipItem, TooltipState} from '../types';
import {formatValue} from './gaugeUtils';

function formatTooltipLabel(label: string | undefined, fallback: string): string {
    return label ? `${label}:` : fallback;
}

function getRelativePointerPosition(
    event: ReactMouseEvent,
    svgElement: SVGSVGElement | null,
): { x: number; y: number } {
    const bbox = svgElement?.getBoundingClientRect() ?? {left: 0, top: 0};
    return {
        x: event.clientX - bbox.left,
        y: event.clientY - bbox.top,
    };
}

export function buildLayerTooltipContent(options: {
    layers: ResolvedLayer[];
    hoveredLayerId: string;
    tooltipMode: 'layer' | 'all';
    formatters?: GaugeFormatters;
}): TooltipItem[] {
    const visibleLayers = options.tooltipMode === 'all'
        ? options.layers.filter((layer) => layer.hoverable)
        : options.layers.filter((layer) => layer.id === options.hoveredLayerId);

    return visibleLayers.map((layer) => ({
        label: formatTooltipLabel(layer.tooltipLabel, `${layer.id}:`),
    value: formatValue(layer.rawValue, options.formatters?.tick, options.formatters?.value),
        color: layer.color,
}));
}

export function createTooltipState(
    event: ReactMouseEvent,
    svgElement: SVGSVGElement | null,
    text: TooltipItem[],
): TooltipState {
    const position = getRelativePointerPosition(event, svgElement);
    return {
        text,
        x: position.x,
        y: position.y,
    };
}

export function updateTooltipPositionState(
    event: ReactMouseEvent,
    svgElement: SVGSVGElement | null,
): { x: number; y: number } {
    return getRelativePointerPosition(event, svgElement);
}