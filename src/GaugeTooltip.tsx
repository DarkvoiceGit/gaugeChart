import {TooltipItem} from "./types";
import {GaugeThemeTooltip, RgbaColor} from "./types/theme.types";
import {DEFAULT_THEME} from "./theme/defaultTheme";

interface GaugeTooltipProps {
    text: TooltipItem[];
    x: number;
    y: number;
    fontColor?: string;
    bgColor?: RgbaColor;
    theme?: GaugeThemeTooltip
}

const GaugeTooltip = ({
                          text,
                          x,
                          y,
                          fontColor,
                          bgColor,
                          theme = DEFAULT_THEME.tooltip
                      }: GaugeTooltipProps) => {

    const effectiveFontColor = fontColor ?? theme.fontColor;
    const effectiveBgColor = bgColor ?? theme.background

    return (
        <div
            style={{
                position: 'absolute',
                left: x + theme.cursorOffset,
                top: y + theme.cursorOffset,
                backgroundColor: `rgba(${effectiveBgColor.r}, ${effectiveBgColor.g}, ${effectiveBgColor.b}, ${effectiveBgColor.a})`,
                color: effectiveFontColor,
                padding: theme.padding,
                minWidth: theme.minWidth,
                borderRadius: theme.borderRadius,
                fontSize: theme.fontSize,
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
            }}
        >
            <table style={{borderCollapse: 'collapse', width: '100%'}}>
                <tbody>
                {text.map((item, index) => (
                    <tr key={index}>
                        <td style={{paddingRight: theme.cellPaddingRight, textAlign: 'left'}}>
                            {item.label}
                        </td>
                        <td style={{width: theme.swatchColumnWidth, paddingRight: theme.cellPaddingRight}}>
                            <div
                                style={{
                                    width: theme.swatchSize,
                                    height: theme.swatchSize,
                                    backgroundColor: item.color,
                                    borderRadius: '50%',
                                    border: theme.swatchBorder,
                                    margin: 'auto',
                                }}
                                aria-hidden="true"
                            />
                        </td>
                        <td style={{textAlign: 'right', whiteSpace: 'nowrap'}}>
                            {item.value}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default GaugeTooltip;
