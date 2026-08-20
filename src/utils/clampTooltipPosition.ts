export function clampTooltipPosition(
    clientX: number,
    clientY: number,
    tooltipWidth: number,
    tooltipHeight: number,
    cursorOffset: number,
    viewportPadding = 0,
): { left: number, top: number } {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = clientX + cursorOffset
    let top = clientY + cursorOffset

    if (left + tooltipWidth > viewportWidth - viewportPadding) {
        left = clientX - tooltipWidth - cursorOffset
    }

    if (top + tooltipHeight > viewportHeight - viewportPadding) {
        top = clientY - tooltipHeight - cursorOffset
    }

    left = Math.max(viewportPadding, Math.min(left, viewportWidth - tooltipWidth - viewportPadding))
    top = Math.max(viewportPadding, Math.min(top, viewportHeight - viewportPadding))

    return {left, top}
}