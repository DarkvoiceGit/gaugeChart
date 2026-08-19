import {GaugeTheme} from "../types/theme.types";

export const DEFAULT_THEME : GaugeTheme ={
   stroke:{
       color: '#000',
       thin: 0.5,
       normal: 1
   },
    hub:{
       color: '#000',
        scaleDivisor: 10
    },
    colors:{
       font: '#fff',
         tick: '#000',
        tickLabel: '#fff',
        primaryBar: '#000',
        secondaryBar: '#aaa',
        tileDefault: '#00ff00',
        tileYellow: '#ffff00',
        tileRed: '#ff0000',
        tileBg: '#ddd',
        tileBorder:'#000',
        pointerPrimary: '#025bff',
        pointerSecondary: '#0ed30e'
    },
    pointer:{
       primaryLengthRatio: 0.7,
        secondaryLengthRatio: 0.85,
        markerBaseSize: 10,
        baseStrokeWidth:3,
        markerRefXRatio: 0.9,
        defaultScale: 1,
        defaultStrokeScale: 1
    },
    interaction:{
       dimedOpacity: 0.5,
        activeOpacity: 1,
        hoverHighlight:{
           innerScale: 0.92,
            outerScale: 1.07,
            tileInnerOffset: 15,
            tileOuterOffset: 10
        },
        hoverHitAreaInnerRatio: 0.72
    },
    layout:{
       radiusDivisor: 2.5,
        referenceWidth: 600,
        viewBoxMinBottomPadding: 20,
        viewBoxBottomPaddingRatio: 0.04,
        mindSideMargin: 8,
        sideMarginRadiusRatio: 0.03
    },
    geometry:{
       startAngle: -Math.PI / 2,
        endAngle: Math.PI / 2,
        angleOffset: 0.01,
        pointerAngleOffset: Math.PI / 2
    },
    radius: {
       innerArc: 0.6,
        outerArc: 0.7,
        tileArc: 1.0,
        tickLabel: 1.15
    },
    ticks:{
       baseFontViewBoxUnits: 24,
        minsStrokeWidth: 0.25,
        textDy: '0.35em',
        rangeUpperBoundOffset: 1,
        defaultFontSize: '1rem'
    },
    tooltip: {
       cursorOffset: 10,
        fontColor: '#fff',
        background: {r: 0, g: 0, b: 0, a: 0.8},
        padding: '0.5rem 0.8rem',
        minWidth: '8rem',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        swatchSize: 12,
        swatchColumnWidth: 16,
        cellPaddingRight: 10,
        swatchBorder: '0.1em solid white'
    },
    gradient: {
       rotationDegrees: -90,
        stopStart: '0%',
        stopEnd: '100%',
    },
    arc:{
       dottedStrokePattern: '1,3',
        dashedStrokePattern: '5,5',
        defaultCornerRadius: 5,
        tilePadAngle: 2,
        tilePadRadius: 2,
        solidPadAngle: 0,
        solidPadRadius: 0
    },
    scale: {
       normalizedMax: 1,
        referenceScaleFactor: 1,
    },
    tiles:{
       minCount: 1,
        defaultCount: 10,
        defaultBorderThickness: 1
    },
    threshold:{
       defaultRed: 90,
        defaultYellow: 60
    },
    options:{
       defaultCircleScale:  0.5
    },
    sizesPresets:{
       xxs: {width: 160, height: 120},
        xs: {width: 480, height: 360},
        s: {width: 640, height: 480},
        sm: {width: 720, height: 540},
        m: {width: 800, height: 600},
        l: {width: 960, height: 720},
        xl: {width: 1120, height: 840},
        xxl: {width: 1280, height: 960},
        xxxl: {width: 1440, height: 1080},
    }
}