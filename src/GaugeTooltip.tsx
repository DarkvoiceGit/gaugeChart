import {TooltipItem} from "./types";
import {GaugeThemeTooltip, RgbaColor} from "./types/theme.types";
import {DEFAULT_THEME} from "./theme/defaultTheme";
import {useLayoutEffect, useRef, useState} from "react";
import {clampTooltipPosition} from "./utils/clampTooltipPosition";

interface GaugeTooltipProps {
    text: TooltipItem[];
    x: number;
    y: number;
    scaleFactor?: number;
    fontColor?: string;
    bgColor?: RgbaColor;
    theme?: GaugeThemeTooltip
}

const GaugeTooltip = ({
                          text,
                          x,
                          y,
                          scaleFactor = 1,
                          fontColor,
                          bgColor,
                          theme = DEFAULT_THEME.tooltip
                      }: GaugeTooltipProps) => {

    const tooltipRef = useRef<HTMLDivElement>(null);
    const cursorOffset  = theme.cursorOffset * scaleFactor;
    const [position, setPosition] = useState(()=>({
        left: x + cursorOffset,
        top: y + cursorOffset,
    }))

    useLayoutEffect(() => {
        const tooltipElement = tooltipRef.current
        if(!tooltipElement){
            return
        }

        const {width, height} = tooltipElement.getBoundingClientRect()
        setPosition(clampTooltipPosition(x,y, width, height, cursorOffset))
    }, [ cursorOffset, text, x, y]);


    const effectiveFontColor = fontColor ?? theme.fontColor;
    const effectiveBgColor = bgColor ?? theme.background

    return (
        <div
            ref={tooltipRef}
            style={{
                position: 'fixed',
                left: position.left,
                top: position.top,
                backgroundColor: `rgba(${effectiveBgColor.r}, ${effectiveBgColor.g}, ${effectiveBgColor.b}, ${effectiveBgColor.a})`,
                color: effectiveFontColor,
                padding: theme.padding,
                minWidth: theme.minWidth,
                borderRadius: theme.borderRadius,
                fontSize: theme.fontSize,
                transform: `scale(${scaleFactor})`,
                transformOrigin: 'top left',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                zIndex: 9999
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
