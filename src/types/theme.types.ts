export interface RgbaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface GaugeThemeStroke {
    color: string;
    thin: number;
    normal: number;
}

export interface GaugeThemeHub {
    color: string;
    /** Divies options.circleScale to derive hub radius: radius * (circle / scaleDivisor) */
    scaleDivisor: number;
}

export interface GaugeThemeColors {
    font: string;
    tick: string;
    tickLabel: string;
    primaryBar: string;
    secondaryBar: string;
    tileDefault: string;
    tileYellow: string;
    tileRed: string;
    tileBg: string;
    tileBorder: string;
    pointerPrimary: string;
    pointerSecondary: string;
}

export interface GaugeThemePointer{
    primaryLengthRatio: number;
    secondaryLengthRatio: number;
    baseStrokeWidth: number;
    markerBaseSize: number;
    markerRefXRatio: number;
    defaultScale: number;
    defaultStrokeScale: number;
}

export interface GaugeThemeHoverHighlight {
    innerScale: number;
    outerScale: number;
    tileInnerOffset: number;
    tileOuterOffset: number;
}

export interface GaugeThemeInteraction {
    dimedOpacity: number;
    activeOpacity: number;
    hoverHighlight: GaugeThemeHoverHighlight;
    hoverHitAreaInnerRatio: number;
}

export interface GaugeThemeLayout {
    radiusDivisor: number;
    referenceWidth: number;
    viewBoxMinBottomPadding: number;
    viewBoxBottomPaddingRatio: number;
    mindSideMargin: number;
    sideMarginRadiusRatio: number;
}

export interface GaugeThemeGeometry {
    startAngle: number;
    endAngle: number;
    angleOffset: number;

    /** Subtracted from angleScale output when computing pointer x/y */
    pointerAngleOffset: number;
}

export interface GaugeThemeRadius {
    innerArc: number;
    outerArc: number;
    tileArc: number;
    tickLabel: number;
}

export interface GaugeThemeTicks {
    baseFontViewBoxUnits: number;
    minsStrokeWidth: number;
    textDy: string;
    rangeUpperBoundOffset: number;
    defaultFontSize: string;
}

export interface GaugeThemeTooltip {
    cursorOffset: number;
    fontColor: string;
    background: RgbaColor;
    padding: string;
    minWidth: string;
    borderRadius: string;
    fontSize: string;
    swatchSize: number;
    swatchColumnWidth: number;
    cellPaddingRight: number;
    swatchBorder: string;
}

export interface GaugeThemeGradient{
    rotationDegrees: number
    stopStart: string
    stopEnd: string
}

export interface GaugeThemeArc {
    dottedStrokePattern: string;
    dashedStrokePattern: string;
    defaultCornerRadius: number;
    tilePadAngle: number;
    tilePadRadius: number;
    solidPadAngle: number;
    solidPadRadius: number;
}

export interface GaugeThemeScale {
    normalizedMax: number;
    referenceScaleFactor: number;
}

export interface GaugeThemeTiles {
    minCount: number;
    defaultCount: number;
    defaultBorderThickness: number;
}

export interface GaugeThemeThreshold{
    defaultRed: number;
    defaultYellow: number;
}

export interface GaugeThemeOptions{
    defaultCircleScale: number;
}

export interface GaugeSizePreset{
    width: number;
    height: number;
}

export interface GaugeThemeSizePresets {
    xxs:GaugeSizePreset
    xs:GaugeSizePreset
    s:GaugeSizePreset
    sm:GaugeSizePreset
    m:GaugeSizePreset
    l:GaugeSizePreset
    xl:GaugeSizePreset
    xxl:GaugeSizePreset
    xxxl:GaugeSizePreset

}

export interface GaugeTheme {
    stroke: GaugeThemeStroke
    hub: GaugeThemeHub
    colors: GaugeThemeColors
    pointer: GaugeThemePointer
    interaction: GaugeThemeInteraction
    layout: GaugeThemeLayout
    geometry : GaugeThemeGeometry
    radius: GaugeThemeRadius
    ticks: GaugeThemeTicks
    tooltip: GaugeThemeTooltip
    gradient: GaugeThemeGradient
    arc: GaugeThemeArc
    scale: GaugeThemeScale
    tiles: GaugeThemeTiles
    threshold: GaugeThemeThreshold
    options: GaugeThemeOptions
    sizesPresets: GaugeThemeSizePresets
}

export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}