import {RefObject, useLayoutEffect, useRef} from "react";
import {interpolateString, select} from "d3";

export function useAnimatedSvgAttribute(ref: RefObject<SVGElement | null>, attribute: string, value: string | number | null | undefined,
                                        enabled: boolean, durationMs: number) {
    const previousValueRef = useRef<string | null>(null)

    useLayoutEffect(() => {
        const element = ref.current

        if (!element || value == null) {
            return;
        }

        const nextValue = String(value)
        const previousValue = previousValueRef.current ?? nextValue
        previousValueRef.current = nextValue

        if (!enabled || previousValue === nextValue) {
            element.setAttribute(attribute, nextValue)
            return;
        }

        const transition = select(element)
            .transition()
            .duration(durationMs)

        if (attribute === 'd') {
            transition.attrTween('d', () => interpolateString(previousValue, nextValue))
            return
        }

        transition.attr(attribute, nextValue)

    }, [attribute, durationMs, enabled, ref, value])
}