export function resolveTooltipScaleFactor(
    tooltipScale: number | undefined,
    themeTooltipScale: number | undefined,
    layoutScaleFactor: number
): number {
    if (tooltipScale !== undefined) {
        return tooltipScale;
    }
    if (themeTooltipScale !== undefined) {
        return themeTooltipScale;
    }
    return layoutScaleFactor;
}