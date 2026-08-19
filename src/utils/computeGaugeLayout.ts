import type {GaugeThemeGeometry, GaugeThemeLayout, GaugeThemeRadius} from '../types/theme.types';
import {DEFAULT_THEME} from '../theme/defaultTheme';
import {GAUGE_SIZE_PRESETS} from './constants';
import {assertPositiveDimensions} from './gaugeGuards';
import type {GaugeSize} from '../types';
import {computeGaugeContentBounds} from "../core/gaugeGeometry";

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
    geometry: GaugeThemeGeometry = DEFAULT_THEME.geometry,
): GaugeLayout {
    assertPositiveDimensions(width, height);

    const logicalWidth = width;
    const logicalHeight = height;

    const radius = Math.min(logicalWidth, logicalHeight) / layout.radiusDivisor;
    const scaleFactor = logicalWidth / layout.referenceWidth;

    const centerX = logicalWidth / 2;
    const centerY = logicalHeight / 2;

    const tickLabelRadius = radius * radiusScales.tickLabel;
    const sideMargin = Math.max(layout.mindSideMargin, radius * layout.sideMarginRadiusRatio);
    const bounds = computeGaugeContentBounds(geometry, radius, tickLabelRadius);

    const viewBoxMinX = centerX + bounds.minX - sideMargin;
    const viewBoxMaxX = centerX + bounds.maxX + sideMargin;
    const viewBoxMinY = Math.max(0, centerY + bounds.minY - sideMargin);
    const viewBoxMaxY = centerY + bounds.maxY + Math.max(layout.viewBoxMinBottomPadding, logicalHeight * layout.viewBoxBottomPaddingRatio)

    const viewBoxWidth = viewBoxMaxX - viewBoxMinX
    const viewBoxHeight = viewBoxMaxY - viewBoxMinY

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
        viewBox: `${viewBoxMinX} ${viewBoxMinY} ${viewBoxWidth} ${viewBoxHeight}`,
    };
}

export function computeGaugeLayoutFromSize(
    size: GaugeSize = 'default',
    layout: GaugeThemeLayout = DEFAULT_THEME.layout,
    radiusScales: Pick<GaugeThemeRadius, 'tickLabel'> = DEFAULT_THEME.radius,
    geometry: GaugeThemeGeometry = DEFAULT_THEME.geometry,
): GaugeLayout {
    const preset = resolveSizePreset(size);
    return computeGaugeLayout(preset.width, preset.height, layout, radiusScales, geometry);
}