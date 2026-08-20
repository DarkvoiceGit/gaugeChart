import {describe, it, expect} from 'vitest';
import {assertValidBarLayers} from '../../utils/barGuards';
import {BarLayer} from '../../types';

describe('barGuards', () => {
    it('should throw on empty layers', () => {
        expect(() => assertValidBarLayers([])).toThrow();
    });

    it('should throw on duplicate ids', () => {
        const layers: BarLayer[] = [
            {id: '1', value: 10, track: 0.5, thickness: 0.1, render: 'solid', color: 'red'},
            {id: '1', value: 20, track: 0.6, thickness: 0.1, render: 'solid', color: 'blue'}
        ] as BarLayer[];
        expect(() => assertValidBarLayers(layers)).toThrow();
    });

    it('should validate valid layers', () => {
        const layers: BarLayer[] = [
            {id: '1', value: 10, track: 0.5, thickness: 0.1, render: 'solid', color: 'red'},
            {id: '2', value: 20, track: 0.6, thickness: 0.1, render: 'solid', color: 'blue'}
        ] as BarLayer[];
        expect(() => assertValidBarLayers(layers)).not.toThrow();
    });
});
