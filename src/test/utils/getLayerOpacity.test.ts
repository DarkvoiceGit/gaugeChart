import {describe, expect, it} from "vitest";
import {getLayerOpacity} from "../../utils/getLayerOpacity";
import {DEFAULT_THEME} from "../../theme/defaultTheme";

describe('getLayerOpacity', () => {
    it('returns active opacity when dimming is disabled', () => {
        expect(getLayerOpacity('tiles', 'primary', false)).toBe(DEFAULT_THEME.interaction.activeOpacity)
    })

    it('returns active opacity for hovered layer', () => {
        expect(getLayerOpacity('primary', 'primary', true)).toBe(DEFAULT_THEME.interaction.activeOpacity)
    })

    it('returns dimmed opacity for non-hovered layers', () => {
        expect(getLayerOpacity('tiles', 'primary', true)).toBe(DEFAULT_THEME.interaction.dimedOpacity)
    })

    it('returns active opacity when nothing is hovered', () => {
        expect(getLayerOpacity('tiles', null, false)).toBe(DEFAULT_THEME.interaction.activeOpacity)
    })
});