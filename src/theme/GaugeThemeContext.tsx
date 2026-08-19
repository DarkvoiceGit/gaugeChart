import {GaugeTheme} from "../types/theme.types";
import React from "react";
import {GaugeThemeContext} from "./useGaugeTheme";

export const GaugeThemeProvider: React.FC<{
    theme: GaugeTheme;
    children: React.ReactNode;
}> = ({theme, children}) => (
    <GaugeThemeContext.Provider value={theme}>{children}</GaugeThemeContext.Provider>
)