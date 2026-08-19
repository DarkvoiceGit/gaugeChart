import {DeepPartial, GaugeTheme} from "../types/theme.types";
import {DEFAULT_THEME} from "./defaultTheme";

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeDeep<T extends object>(base: T, override: DeepPartial<T>) {
    const result = {...base}

    for (const key of Object.keys(override) as Array<keyof T>) {
        const overrideValue = override[key]

        if (overrideValue === undefined) {
            continue
        }
        const baseValue = base[key]
        if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
            result[key] = mergeDeep(baseValue as object, overrideValue as DeepPartial<object>) as T[keyof T]
        } else {
            result[key] = overrideValue as T[keyof T]
        }
    }

    return result
}

export function mergeTheme(override?: DeepPartial<GaugeTheme>): GaugeTheme {
    if (!override) {
        return mergeDeep({...DEFAULT_THEME}, {})
    }
    return mergeDeep({...DEFAULT_THEME}, override)
}