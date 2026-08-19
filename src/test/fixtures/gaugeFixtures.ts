import type {GaugeLayer, GaugeScale} from '../../types';

export const testScale: GaugeScale = {
    max: 80,
    zones: [
        {upTo: 60, color: '#00ff00'},
        {upTo: 70, color: '#ffff00'},
    ],
};

export const tileLayer: GaugeLayer = {
    id: 'tiles',
    value: 40,
    innerRadius: 0.7,
    outerRadius: 1,
    render: 'segmented',
    segments: 10,
    color: '#00ff00',
    hoverable: true,
    tooltip: {label: 'Total'},
    zIndex: 0,
};

export const primaryLayer: GaugeLayer = {
    id: 'primary',
    value: 40,
    innerRadius: 0.6,
    outerRadius: 0.7,
    render: 'solid',
    color: '#000000',
    pointer: {enabled: true, color: '#025bff'},
    hoverable: true,
    tooltip: {label: 'Primary'},
    zIndex: 1,
};

export const secondaryLayer: GaugeLayer = {
    id: 'secondary',
    value: 20,
    innerRadius: 0.6,
    outerRadius: 0.7,
    render: 'solid',
    valueMode: 'cumulative',
    baseLayerId: 'primary',
    color: '#aaaaaa',
    pointer: {enabled: true, color: '#0ed30e'},
    hoverable: true,
    tooltip: {label: 'Secondary'},
    zIndex: 2,
};

export const classicThreeLayerGauge: GaugeLayer[] = [
    tileLayer,
    primaryLayer,
    secondaryLayer,
];

export const offsetLayer: GaugeLayer = {
    id: 'offset',
    value: 20,
    innerRadius: 0.55,
    outerRadius: 0.65,
    render: 'solid',
    valueMode: 'offset',
    offsetValue: 20,
    color: '#444444',
    zIndex: 3,
};