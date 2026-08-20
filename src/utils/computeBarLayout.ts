import {GaugeTheme} from '../types/theme.types';
import {BarOrientation, GaugeSize} from '../types';
import {GAUGE_SIZE_PRESETS} from './constants';

export interface BarLayout {
    logicalWidth: number;
    logicalHeight: number;
    trackLength: number;
    crossAxisLength: number;
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
    theme: GaugeTheme
): BarLayout {
    const scaleFactor = width / theme.layout.referenceWidth;
    const tickLabelSpace = 40 * scaleFactor; // Placeholder value for tickLabelSpace

    let trackLength: number;
    let crossAxisLength: number;
    let originX = 0;
    let originY = 0;

    if (orientation === 'horizontal') {
        trackLength = width - theme.bar.trackPadding * 2;
        crossAxisLength = height;
        originX = theme.bar.trackPadding;
        originY = 0;
    } else {
        trackLength = height - theme.bar.trackPadding * 2;
        crossAxisLength = width;
        originX = 0;
        originY = theme.bar.trackPadding;
    }

    return {
        logicalWidth: width,
        logicalHeight: height,
        trackLength,
        crossAxisLength,
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
    theme: GaugeTheme
): BarLayout {
    const presets = GAUGE_SIZE_PRESETS;
    const preset = size === 'default' ? presets.m : (presets[size as keyof typeof presets] ?? presets.m);
    return computeBarLayout(preset.width, preset.height, orientation, theme);
}
