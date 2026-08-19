import React, {useCallback, useState} from "react";
import {TooltipItem, TooltipState} from "../types.ts";
import {
    buildPrimaryTooltipContent,
    buildSecondaryTooltipContent, buildTileTooltipContent,
    createTooltipState, ThresholdColors, TooltipFormatters,
    updateTooltipPositionState
} from "../utils/buildTooltipContent.ts";

export interface HoverStates {
    tile: boolean,
    primaryBar: boolean,
    secondaryBar: boolean,
}

export interface GaugeToolTipInteractionConfig{
    formatters: TooltipFormatters,
    thresholdColors: ThresholdColors,
    enableInnerArc: boolean,
    labels: {
        tile: string,
        primary: string,
        secondary: string,
    },
    colors: {
        primaryBar: string,
        secondaryBar: string,
    },
    values: {
        primary: number,
        secondary: number,
        sum: number,
    }
}

export interface GaugeToolTipHandlers{
    onPrimaryMouseEnter: (evt: React.MouseEvent) => void,
    onPrimaryMouseMove: (evt: React.MouseEvent) => void,
    onPrimaryMouseLeave: ()=> void,
    onSecondaryMouseEnter: (evt: React.MouseEvent) => void,
    onSecondaryMouseMove: (evt: React.MouseEvent) => void,
    onSecondaryMouseLeave: () => void,
    onTileMouseEnter: (evt: React.MouseEvent) => void,
    onTileMouseMove: (evt: React.MouseEvent) => void,
    onTileMouseLeave: () => void,
}

const INITIAL_HOVER_STATES: HoverStates = {
    tile: false,
    primaryBar: false,
    secondaryBar: false,
}

export function useGaugeTooltip(svgRef: React.RefObject<SVGSVGElement | null> ,
                                interaction: GaugeToolTipInteractionConfig){
    const [tooltip, setTooltip] = useState<TooltipState| null>(null)
    const [hoverStates, setHoverStates] = useState<HoverStates>(INITIAL_HOVER_STATES)

    const showTooltip = useCallback((evt: React.MouseEvent, text: TooltipItem[])=>{
        setTooltip(createTooltipState(evt, svgRef.current, text))
    }, [svgRef])

    const moveTooltip = useCallback((evt: React.MouseEvent) => {
        const position = updateTooltipPositionState(evt, svgRef.current);
        setTooltip(prev=> prev ? {...prev, ...position}: null)
    }, [svgRef])

    const hideTooltip = useCallback(()=>{
        setTooltip(null)
    }, [])

    const setHoverLayer = useCallback((layer: keyof HoverStates)=>{
        setHoverStates({
            tile: layer === 'tile',
            primaryBar: layer === 'primaryBar',
            secondaryBar: layer === 'secondaryBar',
        })
    }, [])

    const clearHover = useCallback(()=>{
        setHoverStates(INITIAL_HOVER_STATES)
    }, [])

    const onPrimaryMouseEnter = useCallback((evt: React.MouseEvent)=>{
        showTooltip(evt, buildPrimaryTooltipContent(
            interaction.values.primary,
            interaction.labels.primary,
            interaction.colors.primaryBar,
            interaction.formatters
        ));
        setHoverLayer('primaryBar')
    }, [interaction, setHoverLayer, showTooltip])

    const onPrimaryMouseLeave = useCallback(()=>{
        hideTooltip()
        clearHover()
    }, [clearHover, hideTooltip])

    const onSecondaryMouseEnter = useCallback((evt: React.MouseEvent)=>{
        showTooltip(evt, buildSecondaryTooltipContent(
            interaction.values.secondary,
            interaction.labels.secondary,
            interaction.colors.secondaryBar,
            interaction.formatters
        ));
        setHoverLayer('secondaryBar')
    }, [interaction, setHoverLayer, showTooltip])

    const onSecondaryMouseLeave = useCallback(()=>{
        hideTooltip()
        clearHover()
    }, [clearHover, hideTooltip])


    const onTileMouseEnter = useCallback((evt: React.MouseEvent)=>{
        showTooltip(evt, buildTileTooltipContent(
            {
                sumValue: interaction.values.sum,
                primaryValue: interaction.values.primary,
                secondaryValue: interaction.values.secondary,
                enableInnerArc: interaction.enableInnerArc,
                sumLabel: interaction.labels.tile,
                primaryLabel: interaction.labels.primary,
                secondaryLabel: interaction.labels.secondary,
                colors: interaction.thresholdColors,
                formatters: interaction.formatters,
            }
        ));
        setHoverLayer('tile')
    }, [interaction, setHoverLayer, showTooltip])

    const onTileMouseLeave = useCallback(()=>{
        hideTooltip()
        clearHover()
    }, [clearHover, hideTooltip])

    const handlers: GaugeToolTipHandlers = {
        onPrimaryMouseEnter,
        onPrimaryMouseMove: moveTooltip,
        onPrimaryMouseLeave,
        onSecondaryMouseEnter,
        onSecondaryMouseMove: moveTooltip,
        onSecondaryMouseLeave,
        onTileMouseEnter,
        onTileMouseMove:moveTooltip,
        onTileMouseLeave,
    }

    return { tooltip, hoverStates, handlers }
}