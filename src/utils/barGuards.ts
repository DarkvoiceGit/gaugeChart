import {BarLayer} from "../types";
import {LayerRadiusGrow} from "../types";

export interface ResolvedBarTrackBounds {
    innerRatio: number;
    outerRatio: number;
}

export function resolveBarTrackBounds(layer: Pick<BarLayer, 'track' | 'thickness' | 'grow'>): ResolvedBarTrackBounds {
    const grow: LayerRadiusGrow = layer.grow ?? 'inward';
    const {track, thickness} = layer;

    switch (grow) {
        case 'inward':
            return {innerRatio: track - thickness, outerRatio: track};
        case 'outward':
            return {innerRatio: track, outerRatio: track + thickness};
        case 'center':
            return {innerRatio: track - thickness / 2, outerRatio: track + thickness / 2};
    }
}

export function assertValidBarLayerTrack(layer: { id: string; track: number; thickness: number; grow?: LayerRadiusGrow }) {
    if (!Number.isFinite(layer.track) || layer.track < 0) {
        throw new RangeError(`layer ${layer.id}: track must be a finite positive number`);
    }

    if (!Number.isFinite(layer.thickness) || layer.thickness <= 0) {
        throw new RangeError(`layer ${layer.id}: thickness must be a positive finite number`);
    }

    const {innerRatio, outerRatio} = resolveBarTrackBounds(layer);

    if (innerRatio < 0) {
        throw new RangeError(`layer ${layer.id}: resolved inner track is below 0 (inner=${innerRatio.toFixed(3)})`);
    }

    if (innerRatio >= outerRatio) {
        throw new RangeError(`layer ${layer.id}: resolved inner track must be less than outer track`);
    }
}

export function assertValidBarLayers(layers: BarLayer[]): void {
    if (layers.length === 0) {
        throw new RangeError('At least one bar layer is required');
    }

    const ids = new Set<string>();
    for (const layer of layers) {
        if (!layer.id.trim()) {
            throw new RangeError('Each bar layer must have a non-empty id');
        }
        if (ids.has(layer.id)) {
            throw new RangeError(`Duplicate bar layer id: ${layer.id}`);
        }
        ids.add(layer.id);
        assertValidBarLayerTrack(layer);
    }
}
