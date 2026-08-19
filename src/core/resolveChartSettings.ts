import type {GaugeChartProps} from '../types';
import type {GaugeTheme} from '../types/theme.types';
import {assertPositiveThreshold, assertValidThresholdPair} from '../utils/gaugeGuards';

export interface ResolvedChartSettings {
    hoverDimming: boolean;
    tooltips: boolean;
    tooltipMode: 'layer' | 'all';
    ticksEnabled: boolean;
    tickStep: number | undefined;
    tickFontSize: string;
    tickLabelColor: string;
    tickColor: string;
    tickRadiusScale: number | undefined;
    fontColor: string;
    tooltipBackground: { r: number; g: number; b: number; a: number };
    hubScale: number;
    hubColor: string;
    scaleMax: number;
    scaleYellow: number;
    animationEnabled: boolean;
    animationDurationMs: number;
}

export function resolveChartSettings(
    props: GaugeChartProps,
    theme: GaugeTheme,
): ResolvedChartSettings {
    const scaleMax = assertPositiveThreshold(props.scale.max);
    const scaleYellow = props.scale.zones?.[1]?.upTo ?? theme.threshold.defaultYellow;
    assertValidThresholdPair(scaleMax, scaleYellow);

    return {
        hoverDimming: props.interaction?.hoverDimming ?? true,
        tooltips: props.interaction?.tooltips ?? true,
        tooltipMode: props.interaction?.tooltipMode ?? 'layer',
        ticksEnabled: props.ticks?.enabled ?? true,
        tickStep: props.ticks?.step,
        tickFontSize: props.ticks?.fontSize ?? theme.ticks.defaultFontSize,
        tickLabelColor: props.ticks?.labelColor ?? theme.colors.tickLabel,
        tickColor: props.ticks?.tickColor ?? theme.colors.tick,
        tickRadiusScale: props.ticks?.radiusScale,
        fontColor: theme.colors.font,
        tooltipBackground: theme.tooltip.background,
        hubScale: props.hub?.scale ?? theme.options.defaultCircleScale,
        hubColor: props.hub?.color ?? theme.hub.color,
        scaleMax,
        scaleYellow,
        animationEnabled: props.animation?.enabled ?? false,
        animationDurationMs: props.animation?.durationMs ?? theme.animation.durationMs
    };
}

export function assertValidLayers(layers: GaugeChartProps['layers']): void {
    if (layers.length === 0) {
        throw new RangeError('At least one gauge layer is required');
    }

    const ids = new Set<string>();
    for (const layer of layers) {
        if (!layer.id.trim()) {
            throw new RangeError('Each gauge layer must have a non-empty id');
        }
        if (ids.has(layer.id)) {
            throw new RangeError(`Duplicate gauge layer id: ${layer.id}`);
        }
        ids.add(layer.id);
    }
}