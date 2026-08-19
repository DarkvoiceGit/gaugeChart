import {GaugeTheme} from "../types/theme.types.ts";
import React from "react";
import { GaugeThemeContext } from "./useGaugeTheme.ts";

export const GaugeThemeProvider : React.FC<{
    theme: GaugeTheme;
    children: React.ReactNode;
}> = ({theme, children}) => (
    <GaugeThemeContext.Provider value={theme}>{children}</GaugeThemeContext.Provider>
)