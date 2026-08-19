import {createContext, useContext} from "react";
import {GaugeTheme} from "../types/theme.types";
import {DEFAULT_THEME} from "./defaultTheme";

export const GaugeThemeContext = createContext<GaugeTheme>(DEFAULT_THEME)

export function useGaugeTheme() :GaugeTheme{
    return useContext(GaugeThemeContext)
}