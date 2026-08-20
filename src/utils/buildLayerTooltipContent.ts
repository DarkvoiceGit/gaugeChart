import type {MouseEvent as ReactMouseEvent} from 'react';
import type {ResolvedInteractiveLayer} from '../core/resolvedLayerBase';
import type {GaugeFormatters, TooltipItem, TooltipState} from '../types';
import {formatValue} from './gaugeUtils';

function formatTooltipLabel(label: string | undefined, fallback: string): string {
    return label ? `${label}:` : fallback;
}

function getClientPointerPosition(event: ReactMouseEvent): { x: number, y: number } {
    return {x: event.clientX, y: event.clientY};
}

export function buildLayerTooltipContent(options: {
    layers: ResolvedInteractiveLayer[];
    hoveredLayerId: string;
    tooltipMode: 'layer' | 'all';
    formatters?: GaugeFormatters;
    interaction?: {
        tooltips?: boolean;
    }
}): TooltipItem[] {
    const hoveredLayer = options.layers.find(l => l.id === options.hoveredLayerId);
    if (!hoveredLayer || options.interaction?.tooltips === false) return [];

    const mode = hoveredLayer.tooltip?.mode ?? (options.tooltipMode === 'all' ? 'all' : 'self');

    let visibleLayers: ResolvedInteractiveLayer[] = [];

    switch (mode) {
        case 'none':
            visibleLayers = [];
            break;
        case 'self':
            visibleLayers = [hoveredLayer];
            break;
        case 'all':
            visibleLayers = options.layers.filter(
                (layer) => layer.tooltip?.enabled !== false && layer.tooltip?.mode !== 'none'
            );
            break;
    }

    return visibleLayers.map((layer) => ({
        label: formatTooltipLabel(layer.tooltip?.label, `${layer.id}:`),
        value: formatValue(layer.rawValue, undefined, options.formatters?.value),
        color: layer.tooltip?.color ?? layer.color,
    }));
}

export function createTooltipState(
    event: ReactMouseEvent,
    text: TooltipItem[],
): TooltipState {
    const position = getClientPointerPosition(event);
    return {
        text,
        x: position.x,
        y: position.y,
    };
}

export function updateTooltipPositionState(
    event: ReactMouseEvent,
): { x: number; y: number } {
    return getClientPointerPosition(event);
}