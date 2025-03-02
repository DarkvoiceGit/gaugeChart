interface PointerConfig {
    scale: number
    strokeScale: number
    color: string
}

interface ArcConfig {
    padAngle: number
    padRadius: number
    cornerRadius: number
}

interface TileArcConfig {
    colorTileThresholdRed?: string
    colorTileThresholdYellow?: string
    colorTileThresholdDefault?: string
    colorTileBg?: string
    tiles?: number
    isTileColorGradient?: boolean
    gradientType?: 'full' | 'tile'
    tickEveryNThStep?: number
    arcConfig?: ArcConfig
    toolTipLabel?: string
}

interface PrimaryArcConfig {
    colorPrimaryBar?: string
    pointerPrimaryConfig?: PointerConfig
    arcConfig?: ArcConfig
    toolTipLabel?: string
}

interface SecondaryArcConfig {
    colorSecondaryBar?: string
    pointerSumConfig?: PointerConfig
    arcConfig?: ArcConfig
    toolTipLabel?: string
}

interface GaugeConfig {
    thresholdYellow?: number;
    thresholdRed?: number;
    withOpacitySwitch?: boolean;
    enableToolTip?: boolean
    enableUnitTicks?: boolean
    circleScale?: number
    enableInnerArc?: boolean
}

export interface GaugeProps {
    width?: number; // Breite der SVG (Standard: 200)
    height?: number; // Höhe der SVG (Standard: 200)
    primary: number;
    secondary?: number;
    options?: GaugeConfig;
    tileArc: TileArcConfig;
    primaryArcConfig?: PrimaryArcConfig;
    secondaryArcConfig?: SecondaryArcConfig;
    unitTickFormatter?: (value: number) => string; // Neue Prop für den Formatter
    unit?: (value: number) => string
}