import type { MouseEvent as ReactMouseEvent} from 'react'
import {TooltipItem} from "../types.ts";
import {colorSelector, formatValue} from "./gaugeUtils.ts";

export interface TooltipFormatters {
    unitTickFormatter ?: (value: number) => string
    unit?: (value: number) => string
}
export interface ThresholdColors {
    thresholdRed: number,
    thresholdYellow: number,
    colorMax: string
    colorMid: string
    colorDefault: string
}

function formatTooltipLabel (label: string | undefined, fallback: string): string{
    return `${label} (${fallback})`
}

function buildColoredToolTipItem(label: string | undefined, fallbackLabel: string, value: number, colors: ThresholdColors, formatters: TooltipFormatters): TooltipItem {
    return {
        label: formatTooltipLabel(label, fallbackLabel),
        value: formatValue(value, formatters.unitTickFormatter, formatters.unit),
        color: colorSelector(
            colors.thresholdRed,
            colors.thresholdYellow,
            colors.colorMax,
            colors.colorMid,
            colors.colorDefault,
            value
        )
    }
}

export function buildPrimaryTooltipContent(primaryValue: number, label: string | undefined, color: string, formatters: TooltipFormatters):TooltipItem[]{
    return [{
        label: formatTooltipLabel(label, 'Primary:'),
        value: formatValue(primaryValue, formatters.unitTickFormatter, formatters.unit),
        color
    }]
}

export function buildSecondaryTooltipContent(primaryValue: number, label: string | undefined, color: string, formatters: TooltipFormatters):TooltipItem[]{
    return [{
        label: formatTooltipLabel(label, 'Secondary:'),
        value: formatValue(primaryValue, formatters.unitTickFormatter, formatters.unit),
        color
    }]
}

export function buildTileTooltipContent(options: {
    sumValue: number,
    primaryValue: number,
    secondaryValue: number,
    enableInnerArc: boolean,
    sumLabel: string| undefined,
    primaryLabel: string| undefined,
    secondaryLabel: string | undefined,
    colors: ThresholdColors,
    formatters: TooltipFormatters
}): TooltipItem[]{
    const items: TooltipItem[] = [buildColoredToolTipItem(options.sumLabel, 'Sum:', options.sumValue, options.colors, options.formatters)];

    if(options.primaryValue !== 0 && options.enableInnerArc){
        items.push(buildColoredToolTipItem(
            options.primaryLabel,
            'Primary:',
            options.primaryValue,
            options.colors,
            options.formatters
        ))
    }

    if(options.secondaryValue !== 0 && options.enableInnerArc){
        items.push(buildColoredToolTipItem(
            options.secondaryLabel,
            'Secondary:',
            options.secondaryValue,
            options.colors,
            options.formatters
        ))
    }

    return items;
}

function getRelativePointerPosition(
    evt: ReactMouseEvent,
    svgElement: SVGSVGElement | null
):{x: number, y: number}{
    const bbox = svgElement?.getBoundingClientRect() ?? {left: 0, top: 0}
    return {
        x: evt.clientX - bbox.left,
        y: evt.clientY - bbox.top,
    }
}

export function createTooltipState(
    evt: ReactMouseEvent,
    svgElement: SVGSVGElement | null,
    text: TooltipItem[]
):{text: TooltipItem[], x: number, y: number}{
    const position = getRelativePointerPosition(evt, svgElement)
    return{
        text, x: position.x, y: position.y,
    }
}

export function updateTooltipPositionState(
    evt: ReactMouseEvent,
    svgElement: SVGSVGElement | null
):{x: number, y: number}{
    return  getRelativePointerPosition(evt, svgElement)
}