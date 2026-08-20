import {BarLayout} from '../utils/computeBarLayout';
import {BarOrientation, GaugeFormatters, GaugeScale} from '../types';
import {createValueScale} from '../core/barGeometry';
import {useGaugeTheme} from "../theme/useGaugeTheme.ts";

interface BarTickLabelsProps {
    tickLabels: number[];
    scale: GaugeScale;
    layout: BarLayout;
    orientation: BarOrientation;
    scaleFactor: number;
    fontSize?: string;
    tickColor?: string;
    tickLabelColor?: string;
    formatters?: GaugeFormatters;
}

export function BarTickLabels({
                                  tickLabels,
                                  scale,
                                  layout,
                                  orientation,
                                  scaleFactor,
                                  fontSize,
                                  tickColor,
                                  tickLabelColor,
                                  formatters
                              }: BarTickLabelsProps) {
    const theme = useGaugeTheme()
    const scaleMin = scale.min ?? 0

    const valueScale = createValueScale({
        min: scaleMin,
        max: scale.max,
        trackLength: layout.trackLength,
        orientation: orientation,
        padding: 0
    });

    const effectiveFontSize = fontSize ?? theme.ticks.defaultFontSize
    const effectiveTickColor = tickColor ?? theme.colors.tick
    const effectiveLabelColor = tickLabelColor ?? theme.colors.tickLabel
    const tickStrokeWidth = Math.max(theme.ticks.minsStrokeWidth, scaleFactor)
    const tickLength = 6 * scaleFactor
    const labelOffset = layout.tickLabelSpace * 0.45

    return (
        <g>
            {tickLabels.map((value) => {
                const position = valueScale(value)

                if (orientation === 'horizontal') {
                    const tickY = layout.crossAxisLength
                    return (
                        <g key={value}>
                            <line
                                x1={position}
                                y1={tickY}
                                x2={position}
                                y2={tickY + tickLength}
                                stroke={effectiveTickColor}
                                strokeWidth={tickStrokeWidth}
                            />
                            <text
                                x={position}
                                y={tickY + labelOffset}
                                fontSize={effectiveFontSize}
                                fill={effectiveLabelColor}
                                textAnchor="middle"
                                dominantBaseline={'hanging'}
                            >
                                {formatters?.tick ? formatters.tick(value) : value}
                            </text>
                        </g>
                    )
                }

                const tickX = 0
                return (
                    <g key={value}>
                        <line
                            x1={tickX - tickLength}
                            y1={position}
                            x2={tickX}
                            y2={position}
                            stroke={effectiveTickColor}
                            strokeWidth={tickStrokeWidth}
                        />
                        <text
                            x={tickX - labelOffset}
                            y={position}
                            fontSize={effectiveFontSize}
                            fill={effectiveLabelColor}
                            textAnchor="end"
                            dominantBaseline={'middle'}
                        >
                            {formatters?.tick ? formatters.tick(value) : value}
                        </text>
                    </g>
                )
            })}
        </g>
    )
}
