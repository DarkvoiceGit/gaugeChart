import type {GaugeTheme} from '../types/theme.types';
import type {BarOrientation, GaugeSize} from '../types';
import {GAUGE_SIZE_PRESETS} from './constants';

export interface BarLayout {
    logicalWidth: number;
    logicalHeight: number;
    trackLength: number;
    crossAxisLength: number;
    crossAxisOffset: number;
    scaleFactor: number;
    originX: number;
    originY: number;
    viewBoxWidth: number;
    viewBoxHeight: number;
    viewBoxMinX: number;
    viewBoxMinY: number;
    viewBox: string;
    tickLabelSpace: number;
}

export function computeBarLayout(
    width: number,
    height: number,
    orientation: BarOrientation,
    theme: GaugeTheme,
): BarLayout {
    const scaleFactor = width / theme.layout.referenceWidth;
    const tickLabelSpace = Math.max(32, 40 * scaleFactor);
    const trackPadding = theme.bar.trackPadding;

    let trackLength: number;
    let crossAxisLength: number;
    let crossAxisOffset = 0;
    // eslint-disable-next-line no-useless-assignment
    let originX = 0;
    // eslint-disable-next-line no-useless-assignment
    let originY = 0;

    if (orientation === 'horizontal') {
        trackLength = width - trackPadding * 2;
        crossAxisLength = height - tickLabelSpace;
        originX = trackPadding;
        originY = 0;
    } else {
        trackLength = height - trackPadding * 2;
        crossAxisLength = width - tickLabelSpace - trackPadding;
        crossAxisOffset = tickLabelSpace;
        originX = trackPadding;
        originY = trackPadding;
    }

    return {
        logicalWidth: width,
        logicalHeight: height,
        trackLength,
        crossAxisLength,
        crossAxisOffset,
        scaleFactor,
        originX,
        originY,
        viewBoxWidth: width,
        viewBoxHeight: height,
        viewBoxMinX: 0,
        viewBoxMinY: 0,
        viewBox: `0 0 ${width} ${height}`,
        tickLabelSpace,
    };
}

export function computeBarLayoutFromSize(
    size: GaugeSize = 'default',
    orientation: BarOrientation,
    theme: GaugeTheme,
): BarLayout {
    const preset = size === 'default'
        ? GAUGE_SIZE_PRESETS.m
        : (GAUGE_SIZE_PRESETS[size as keyof typeof GAUGE_SIZE_PRESETS] ?? GAUGE_SIZE_PRESETS.m);
    return computeBarLayout(preset.width, preset.height, orientation, theme);
}
