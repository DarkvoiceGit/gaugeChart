import type {GaugeThemeLayout, GaugeThemeRadius} from '../types/theme.types';
import {DEFAULT_THEME} from '../theme/defaultTheme';
import {GAUGE_SIZE_PRESETS} from './constants';
import {assertPositiveDimensions} from './gaugeGuards';
import type {GaugeSize} from '../types';

export interface GaugeLayout {
    logicalWidth: number;
    logicalHeight: number;
    radius: number;
    scaleFactor: number;
    centerX: number;
    centerY: number;
    viewBoxHeight: number;
    viewBoxMinX: number;
    viewBoxWidth: number;
    viewBox: string;
}

export function resolveSizePreset(size: GaugeSize = 'default') {
    const presetKey = size === 'default' ? 'm' : size;
    return GAUGE_SIZE_PRESETS[presetKey as keyof typeof GAUGE_SIZE_PRESETS] ?? GAUGE_SIZE_PRESETS.m;
}

export function computeGaugeLayout(
    width: number,
    height: number,
    layout: GaugeThemeLayout = DEFAULT_THEME.layout,
    radiusScales: Pick<GaugeThemeRadius, 'tickLabel'> = DEFAULT_THEME.radius,
): GaugeLayout {
    assertPositiveDimensions(width, height);

    const logicalWidth = width;
    const logicalHeight = height;

    const radius = Math.min(logicalWidth, logicalHeight) / layout.radiusDivisor;
    const scaleFactor = logicalWidth / layout.referenceWidth;

    const centerX = logicalWidth / 2;
    const centerY = logicalHeight / 2;
    const viewBoxHeight = centerY + Math.max(
        layout.viewBoxMinBottomPadding,
        logicalHeight * layout.viewBoxBottomPaddingRatio
    );

    const tickLabelRadius = radius * radiusScales.tickLabel;
    const sideMargin = Math.max(layout.mindSideMargin, radius * layout.sideMarginRadiusRatio);
    const viewBoxMinX = centerX - tickLabelRadius - sideMargin;
    const viewBoxWidth = 2 * tickLabelRadius + 2 * sideMargin;

    return {
        logicalWidth,
        logicalHeight,
        radius,
        scaleFactor,
        centerX,
        centerY,
        viewBoxHeight,
        viewBoxMinX,
        viewBoxWidth,
        viewBox: `${viewBoxMinX} 0 ${viewBoxWidth} ${viewBoxHeight}`,
};
}

export function computeGaugeLayoutFromSize(
    size: GaugeSize = 'default',
    layout: GaugeThemeLayout = DEFAULT_THEME.layout,
    radiusScales: Pick<GaugeThemeRadius, 'tickLabel'> = DEFAULT_THEME.radius,
): GaugeLayout {
    const preset = resolveSizePreset(size);
    return computeGaugeLayout(preset.width, preset.height, layout, radiusScales);
}