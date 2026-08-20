# GaugeChart

Highly customizable **gauge and bar chart components** for React applications, built with D3.js. Both charts share the same scale, layer, interaction, formatter, animation, and theme concepts.


## Demo & Package


| Desc                                                             | Url                                                                                                          |
|------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| You can see a live demo of the GaugeChart component at           | [https://DarkvoiceGit.github.io/gaugeChart](https://DarkvoiceGit.github.io/gaugeChart)                       |
| <img src="NPM.svg" alt="NPM" style="width:60px; height:60px;" /> | [https://www.npmjs.com/package/@darkvoice/gauge-chart](https://www.npmjs.com/package/@darkvoice/gauge-chart) |


## Features

- Generic layer-based GaugeChart and BarChart APIs
- Solid and segmented layers
- Absolute, cumulative, and offset value modes
- Optional pointers per layer
- Independent gauge radii and bar tracks per layer
- Layer ordering with `zIndex`
- Hover interaction and tooltips
- Configurable scale and optional color zones
- Configurable ticks and value formatters
- Configurable gauge center hub
- Animation support
- Theme overrides
- React 16.8 through React 19 support

## Installation

```bash
npm install @darkvoice/gauge-chart
```

If you are testing a local `.tgz` build:

```bash
npm install ./your-package-file.tgz
```

Then import the component by its package name:

```tsx
import { GaugeChart, BarChart } from '@darkvoice/gauge-chart';
```

## Requirements

Peer dependencies:

- React `^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`
- React DOM `^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`

Runtime dependency:

- D3 `^7.9.0`

## Basic Usage

```tsx
import { GaugeChart } from '@darkvoice/gauge-chart';

export function ExampleGauge() {
  return (
    <GaugeChart
      scale={{
        min: 0,
        max: 80,
      }}
      layers={[
        {
          id: 'tiles',
          value: 75,
          radius: 0.72,
          thickness: 0.28,
          grow: 'inward',
          render: 'segmented',
          segments: 8,
          color: '#35ff00',
          backgroundColor: '#dddddd',
          hoverable: true,
          zIndex: 3,
        },
        {
          id: 'base',
          value: 40,
          valueMode: 'absolute',
          radius: 0.7,
          thickness: 0.12, 
          grow: 'inward',
          render: 'solid',
          color: '#000000',
          pointer: {
            enabled: true,
            color: '#0ed30e',
            scale: 1,
            strokeScale: 1,
          },
          tooltip: {
            label: 'Base',
          },
          hoverable: true,
          zIndex: 2,
        },
        {
          id: 'additional',
          value: 35,
          valueMode: 'cumulative',
          baseLayerId: 'base',
          radius: 0.7,
          thickness: 0.12,
          grow: 'inward',
          render: 'solid',
          color: '#aaaaaa',
          pointer: {
            enabled: true,
            color: '#025bff',
            scale: 1,
            strokeScale: 1,
          },
          tooltip: {
            label: 'Additional',
          },
          hoverable: true,
          zIndex: 1,
        },
      ]}
      ticks={{
        enabled: true,
        step: 10,
        labelColor: '#ffffff',
        tickColor: '#777777',
        radiusScale: 1.12,
      }}
      hub={{
        color: '#000000',
        scale: 0.5,
      }}
      interaction={{
        tooltips: true,
        tooltipMode: 'all',
        hoverDimming: true,
      }}
      animation={{
        enabled: true,
        durationMs: 400,
      }}
      size="xl"
    />
  );
}
```

## Core Model

The component is configured with two required props:

```ts
scale: GaugeScale;
layers: GaugeLayer[];
```

The scale defines the numeric range. Each layer defines how a value is rendered inside that range.

```tsx
<GaugeChart
  scale={{ min: 0, max: 100 }}
  layers={[...]}
/>
```

## `GaugeChart` Props

```ts
interface GaugeChartProps {
  size?: GaugeSize;
  scale: GaugeScale;
  layers: GaugeLayer[];
  geometry?: GaugeGeometryConfig;
  ticks?: GaugeTicksConfig;
  interaction?: GaugeInteractionConfig;
  hub?: GaugeHubConfig;
  formatters?: GaugeFormatters;
  animation?: GaugeAnimationConfig;
  theme?: DeepPartial<GaugeTheme>;
  debugMode?: boolean;
}
```

| Prop | Type | Description |
|---|---|---|
| `size` | `GaugeSize` | Optional preset size. |
| `scale` | `GaugeScale` | Numeric range used by all layers. |
| `layers` | `GaugeLayer[]` | Gauge layers to render. |
| `geometry` | `GaugeGeometryConfig` | Optional gauge geometry overrides. |
| `ticks` | `GaugeTicksConfig` | Tick visibility and styling. |
| `interaction` | `GaugeInteractionConfig` | Hover and tooltip behavior. |
| `hub` | `GaugeHubConfig` | Center hub configuration. |
| `formatters` | `GaugeFormatters` | Value and tick formatting functions. |
| `animation` | `GaugeAnimationConfig` | Animation configuration. |
| `theme` | `DeepPartial<GaugeTheme>` | Partial theme override. |
| `debugMode` | `boolean` | Enables debug output / behavior where supported. |

## Size Presets

```ts
type GaugeSize =
  | 'default'
  | 'xxs'
  | 'xs'
  | 's'
  | 'sm'
  | 'm'
  | 'l'
  | 'xl'
  | 'xxl'
  | 'xxxl';
```

Example:

```tsx
<GaugeChart
  size="xl"
  scale={{ max: 80 }}
  layers={layers}
/>
```

## Scale

```ts
interface GaugeScale {
  min?: number;
  max: number;
  zones?: GaugeZone[];
}
```

`max` is required. `min` is optional.

```tsx
scale={{
  min: 0,
  max: 80,
}}
```

### Zones

Zones are optional.

```ts
interface GaugeZone {
  upTo: number;
  color: string;
}
```

Example:

```tsx
scale={{
  min: 0,
  max: 80,
  zones: [
    { upTo: 40, color: '#00ff00' },
    { upTo: 60, color: '#ffff00' },
    { upTo: 80, color: '#ff0c4d' },
  ],
}}
```

You do not need zones if you set layer colors directly.

## Layers

```ts
interface GaugeLayer {
  id: string;
  value: number;
  radius: number;
  thickness: number;
  grow?:  'inward' | 'outward' | 'center'
  render: 'solid' | 'segmented';

  segments?: number;

  valueMode?: 'absolute' | 'cumulative' | 'offset';
  baseLayerId?: string;
  offsetValue?: number;

  color: string;
  fillStyle?: TileFillStyle;
  backgroundColor?: string;
  borderColor?: string;
  borderThickness?: number;

  gradient?: LayerGradientConfig;
  arc?: Partial<ArcConfig>;
  pointer?: LayerPointerConfig;
  tooltip?: LayerTooltipConfig;

  hoverable?: boolean;
  zIndex?: number;
}
```

### Required Layer Properties

Every layer requires:

```ts
id
value
radius
thickness
render
color
```

Example:

```tsx
{
  id: 'capacity',
  value: 65,
  radius: 0.7,
  thickness: 0.15,
  grow: 'inward',      
  render: 'solid',
  color: '#222222',
}
```

## Render Modes

### Solid

Use `render: 'solid'` for a continuous arc.

```tsx
{
  id: 'base',
  value: 40,
  radius: 0.7,
  thickness: 0.12,
  grow: 'inward',      
  render: 'solid',
  color: '#000000',
}
```

### Segmented

Use `render: 'segmented'` for tiles / discrete segments.

```tsx
{
  id: 'tiles',
  value: 75,
  radius: 1,
  thickness: 0.28,
  grow: 'inward',      
  render: 'segmented',
  segments: 8,
  color: '#35ff00',
  backgroundColor: '#dddddd',
}
```

## Value Modes

```ts
type LayerValueMode = 'absolute' | 'cumulative' | 'offset';
```

### Absolute

The layer starts at the beginning of the gauge and ends at its own value.

```tsx
{
  id: 'base',
  value: 40,
  valueMode: 'absolute',
  ...
}
```

For a `0..80` scale this represents:

```text
0 ---------- 40
```

### Cumulative

A cumulative layer starts at the end of another layer.

```tsx
{
  id: 'additional',
  value: 35,
  valueMode: 'cumulative',
  baseLayerId: 'base',
  ...
}
```

With:

```text
base  = 40
additional = 35
```

this conceptually represents:

```text
0 ---------- 40 ---------- 75
   base          additional
```

`value` remains the layer's own value (`35`). `baseLayerId` identifies the layer after which it should be placed.

### Offset

An offset layer starts at `offsetValue` and spans its own `value`.

```tsx
{
  id: 'window',
  value: 20,
  valueMode: 'offset',
  offsetValue: 30,
  ...
}
```

Conceptually:

```text
30 ---------- 50
```

## Layer Radius

Each layer defines its radial position using `radius`, `thickness´, and optional `grow`:

```ts
radius: number; // reference point (0..1 relative to gauge radius)
thickness: number; // band width (0..1)
grow?: 'inward' | 'outward' | 'center' // default: 'inward'
```
Resolution:
```text
grow: 'inward'  -> outer = radius,           inner = radius - thickness
grow: 'outward' -> inner = radius,           outer = radius + thickness
grow: 'center'  -> inner = radius -t/2,      outer = radius + t/2

```

Example outer ring (inward from max radius:

```tsx
radius: 1,
thickness: 0.28,
grow: 'inward'
```

Example inner ring:

```tsx
radius: 0.54,
thickness: 0.12,
grow: 'inward'
```

Resolved radii must stay within `0..1`

## Layer Ordering

Use `zIndex` to control the normal rendering order.

```tsx
{
  id: 'tiles',
  zIndex: 3,
  ...
}
```

Higher values are intended to render above lower values.

## Pointer Configuration

Pointers are optional and configured per layer.

```ts
interface LayerPointerConfig {
  enabled?: boolean;
  scale?: number;
  strokeScale?: number;
  color?: string;
  lengthRatio?: number;
}
```

Example:

```tsx
pointer={{
  enabled: true,
  color: '#025bff',
  scale: 1,
  strokeScale: 1,
}}
```

## Arc Configuration

Each layer can override arc styling:

```ts
interface ArcConfig {
  padAngle: number;
  padRadius: number;
  cornerRadius: number;
}
```

Example:

```tsx
arc={{
  padAngle: 2,
  padRadius: 2,
  cornerRadius: 5,
}}
```

All fields are optional when passed through a layer because `arc` is `Partial<ArcConfig>`.

## Gradient Configuration

```ts
interface LayerGradientConfig {
  enabled?: boolean;
  type?: GradientType | string;
}
```

Example:

```tsx
gradient={{
  enabled: true,
  type: 'tile',
}}
```

## Fill Styles

The package exports `TileFillStyle`.

```tsx
import {
  GaugeChart,
  TileFillStyle,
} from '@darkvoice/gauge-chart';
```

Available values:

```ts
TileFillStyle.FILLED
TileFillStyle.DOTTED
TileFillStyle.DASHED
TileFillStyle.OUTLINED
```

Example:

```tsx
{
  id: 'tiles',
  render: 'segmented',
  fillStyle: TileFillStyle.OUTLINED,
  borderColor: '#000000',
  borderThickness: 1,
  ...
}
```

## Tooltips

Tooltips are controlled globally through `interaction` and labeled per layer.

```ts
interface GaugeInteractionConfig {
  hoverDimming?: boolean;
  tooltips?: boolean;
  tooltipMode?: 'layer' | 'all';
}
```

Enable them with:

```tsx
interaction={{
  tooltips: true,
  tooltipMode: 'all',
  hoverDimming: true,
}}
```

### Tooltip Modes

`'layer'` shows the hovered layer's tooltip information.

```tsx
interaction={{
  tooltips: true,
  tooltipMode: 'layer',
}}
```

`'all'` shows tooltip information for all relevant layers.

```tsx
interaction={{
  tooltips: true,
  tooltipMode: 'all',
}}
```

### Tooltip Labels

Labels are configured per layer:

```tsx
{
  id: 'base',
  tooltip: {
    label: 'Base',
  },
  hoverable: true,
  ...
}
```

The current public type is:

```ts
interface LayerTooltipConfig {
  enabled?: boolean;
  label?: string;
  mode?: 'self' | 'all' | 'none';
  color?: string;
}
```

## Hover Interaction

Set `hoverable: true` on layers that should react to hover.

```tsx
{
  id: 'base',
  hoverable: true,
  ...
}
```

Global hover dimming is configured with:

```tsx
interaction={{
  hoverDimming: true,
}}
```

## Ticks

```ts
interface GaugeTicksConfig {
  enabled?: boolean;
  step?: number;
  hideCrowdedEndTick?: boolean | number;
  fontSize?: string;
  labelColor?: string;
  tickColor?: string;
  radiusScale?: number;
}
```

Example:

```tsx
ticks={{
  enabled: true,
  step: 10,
  fontSize: '1rem',
  labelColor: '#ffffff',
  tickColor: '#777777',
  radiusScale: 1.12,
}}
```

## `BarChart`

The package also exports `BarChart`. It uses the same `scale`, layer value modes, render modes, ticks, interactions, formatters, animation, theme overrides, and size presets as `GaugeChart`, but lays layers out on linear tracks.

```ts
interface BarChartProps {
  orientation?: 'horizontal' | 'vertical';
  size?: GaugeSize;
  scale: GaugeScale;
  layers: BarLayer[];
  ticks?: GaugeTicksConfig;
  interaction?: GaugeInteractionConfig;
  formatters?: GaugeFormatters;
  animation?: GaugeAnimationConfig;
  theme?: DeepPartial<GaugeTheme>;
  debugMode?: boolean;
}

interface BarLayer extends BaseLayer {
  track: number;
  bar?: {
    cornerRadius?: number;
    gap?: number;
    pad?: number;
  };
}
```

`track` is a ratio on the chart's cross axis. Together with `thickness` and `grow`, it determines the layer's occupied band. As with gauge layers, each bar layer needs a unique `id`, a positive `thickness`, a `render` mode, a `color`, and a value.

### Basic Bar Example

```tsx
import { BarChart } from '@darkvoice/gauge-chart';

export function CapacityBar() {
  return (
    <BarChart
      orientation="horizontal"
      size="m"
      scale={{ min: 0, max: 100 }}
      layers={[
        {
          id: 'capacity',
          value: 72,
          track: 0.7,
          thickness: 0.18,
          grow: 'inward',
          render: 'solid',
          color: '#35ff00',
          backgroundColor: '#dddddd',
          hoverable: true,
          tooltip: { label: 'Capacity' },
        },
      ]}
      ticks={{ enabled: true, step: 20 }}
      interaction={{ tooltips: true, hoverDimming: true }}
      animation={{ enabled: true, durationMs: 300 }}
    />
  );
}
```

For segmented bars, set `render: 'segmented'` and provide `segments`. The optional `bar.gap`, `bar.pad`, and `bar.cornerRadius` settings customize tile spacing, track padding, and corner rounding.

## Formatters

Use `formatters.value` for tooltip / value text and `formatters.tick` for ticks.

```ts
interface GaugeFormatters {
  value?: (value: number) => string;
  tick?: (value: number) => string;
}
```

Example with a unit:

```tsx
<GaugeChart
  scale={{ max: 80 }}
  layers={layers}
  formatters={{
    value: (value) => `${value} km`,
    tick: (value) => `${value} km`,
  }}
/>
```

If you want units only in tooltips but not on every tick:

```tsx
formatters={{
  value: (value) => `${value} km`,
  tick: (value) => `${value}`,
}}
```

## Hub

The center hub can be customized using:

```ts
interface GaugeHubConfig {
  scale?: number;
  color?: string;
}
```

Example:

```tsx
hub={{
  color: '#000000',
  scale: 0.5,
}}
```

## Animation

```ts
interface GaugeAnimationConfig {
  enabled?: boolean;
  durationMs?: number;
}
```

Example:

```tsx
animation={{
  enabled: true,
  durationMs: 400,
}}
```

## Geometry

The optional `geometry` prop is a partial `GaugeThemeGeometry` configuration.

```tsx
<GaugeChart
  geometry={{
    // override supported geometry fields
  }}
  scale={{ max: 80 }}
  layers={layers}
/>
```

Because `GaugeGeometryConfig` is defined from the theme geometry type, see the exported TypeScript declarations for the exact geometry fields available in the installed version.

## Theme Overrides

The `theme` prop accepts a deep partial `GaugeTheme`.

```tsx
<GaugeChart
  theme={{
    // partial theme overrides
  }}
  scale={{ max: 80 }}
  layers={layers}
/>
```

## Complete Example: Base + Additional + Tiles

```tsx
import { GaugeChart } from '@darkvoice/gauge-chart';

export function CapacityGauge() {
  const base = 40;
  const additional = 35;
  const max = 80;

  return (
    <GaugeChart
      size="xl"
      scale={{
        min: 0,
        max,
      }}
      layers={[
        {
          id: 'tiles',
          value: base + additional,
          radius: 1,
          thickness: 0.28,
          grow: 'inward',  
          render: 'segmented',
          segments: 8,
          color: '#35ff00',
          backgroundColor: '#dddddd',
          gradient: {
            enabled: true,
            type: 'tile',
          },
          tooltip: {
            label: 'Total',
          },
          hoverable: true,
          zIndex: 3,
        },
        {
          id: 'base',
          value: base,
          valueMode: 'absolute',
          radius: 0.7,
          thickness: 0.12,
          grow: 'inward',
          render: 'solid',
          color: '#000000',
          backgroundColor: 'transparent',
          pointer: {
            enabled: true,
            color: '#0ed30e',
            scale: 1,
            strokeScale: 1,
          },
          tooltip: {
            label: 'Base',
          },
          hoverable: true,
          zIndex: 2,
        },
        {
          id: 'additional',
          value: additional,
          valueMode: 'cumulative',
          baseLayerId: 'base',
          radius: 0.7,
          thickness: 0.12,
          grow: 'inward',
          render: 'solid',
          color: '#aaaaaa',
          backgroundColor: 'transparent',
          pointer: {
            enabled: true,
            color: '#025bff',
            scale: 1,
            strokeScale: 1,
          },
          tooltip: {
            label: 'Additional',
          },
          hoverable: true,
          zIndex: 1,
        },
      ]}
      ticks={{
        enabled: true,
        step: 10,
        fontSize: '1rem',
        labelColor: '#ffffff',
        tickColor: '#777777',
        radiusScale: 1.12,
      }}
      interaction={{
        tooltips: true,
        tooltipMode: 'all',
        hoverDimming: true,
      }}
      hub={{
        color: '#000000',
        scale: 0.5,
      }}
      animation={{
        enabled: true,
        durationMs: 400,
      }}
      formatters={{
        value: (value) => `${value} m`,
        tick: (value) => `${value}`,
      }}
    />
  );
}
```

## Migration from the Legacy API

Older versions of the README documented a fixed API using props such as:

```tsx
<GaugeChart
  primary={40}
  secondary={35}
  options={...}
  tileArc={...}
  primaryArcConfig={...}
  secondaryArcConfig={...}
/>
```

That is no longer the current public API of this package build.

The current model uses:

```tsx
<GaugeChart
  scale={{ min: 0, max: 80 }}
  layers={[...]}
/>
```

A former primary value typically becomes an absolute solid layer:

```tsx
{
  id: 'primary',
  value: 40,
  valueMode: 'absolute',
  render: 'solid',
  ...
}
```

A former secondary value that should continue after the primary layer can be expressed as a cumulative layer:

```tsx
{
  id: 'secondary',
  value: 35,
  valueMode: 'cumulative',
  baseLayerId: 'primary',
  render: 'solid',
  ...
}
```

A former tile arc becomes a segmented layer:

```tsx
{
  id: 'tiles',
  value: 75,
  render: 'segmented',
  segments: 8,
  ...
}
```

## TypeScript

The package ships TypeScript declarations. The package ships declarations for both chart components. Primary exports include `GaugeChartProps`, `GaugeLayer`, `BarChartProps`, `BarLayer`, `BarOrientation`, `BarConfig`, and the shared scale, interaction, tick, formatter, animation, geometry, and theme types.

Example:

```tsx
import {
  GaugeChart,
  type GaugeLayer,
} from '@darkvoice/gauge-chart';

const layers: GaugeLayer[] = [
  {
    id: 'value',
    value: 50,
    radius: 0.7,
    thickness: 0.15,
    grow: 'inward',  
    render: 'solid',
    color: '#000000',
  },
];
```

## Debug Mode

Enable debug mode with:

```tsx
<GaugeChart
  debugMode
  scale={{ max: 80 }}
  layers={layers}
/>
```

Use this during development only when you need the package's debug behavior.

## Notes

- `scale.max` is required.
- Every layer needs a unique `id`.
- Gauge layers use `radius`; bar layers use `track`.
- Every layer requires `value`, `radius`, `thickness`, `render`, and `color`.
- Use `hoverable: true` when a layer should participate in hover interaction.
- `segments` is relevant for segmented layers.
- `baseLayerId` is used by cumulative layers.
- `offsetValue` is used by offset layers.
- Tooltip labels are configured per layer, while the current tooltip display mode is configured globally through `interaction.tooltipMode`.

## Technologies

This project is built with:

- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [D3.js](https://d3js.org/) - Data visualization library
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Vitest](https://vitest.dev/) - Testing framework

## License

MIT
