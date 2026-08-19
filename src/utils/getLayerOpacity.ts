import {GaugeThemeInteraction} from "../types/theme.types";
import {DEFAULT_THEME} from "../theme/defaultTheme";

export function getLayerOpacity(
    layerId: string,
    hoveredLayerId: string | null,
    enableOpacityEffect: boolean,
    interaction: GaugeThemeInteraction = DEFAULT_THEME.interaction
): number {
    if(!enableOpacityEffect){
        return interaction.activeOpacity
    }
    if(hoveredLayerId === layerId){
        return interaction.activeOpacity
    }
    if(hoveredLayerId !== null) {
        return interaction.dimedOpacity
    }

    return interaction.activeOpacity
}