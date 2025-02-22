# GaugeChart

A highly customizable gauge chart component for React applications, built with D3.js.


## Demo

You can see a live demo of the GaugeChart component at [https://DarkvoiceGit.github.io/gaugeChart](https://DarkvoiceGit.github.io/gaugeChart)

## Features

- Customizable gauge with primary and secondary values
- Configurable thresholds with color indicators
- Interactive tooltips with customizable labels
- Multiple gradient and fill style options
- Extensive styling options for pointers, arcs, and tiles
- Unit formatting and custom formatters

## Installation

This is a React component that can be used in your React projects. To use it in your project:

### Option 1: Clone the Repository

```bash
git clone https://github.com/DarkvoiceGit/gaugeChart.git
cd gaugeChart
npm install
```

### Option 2: Copy the Component

You can also copy the GaugeChart component files directly into your React project and install the required dependencies:

```bash
npm install d3@^7.9.0
```

The component requires React 18+ and is built with TypeScript.

## Basic Usage

```jsx
import Gauge from 'gauge-chart';

function MyComponent() {
  return (
    <Gauge
      primary={40}
      secondary={30}
      options={{
        thresholdYellow: 60,
        thresholdRed: 80,
        enableToolTip: true
      }}
      tileArc={{
        tiles: 10,
        colorTileThresholdDefault: '#00ff00',
        colorTileThresholdYellow: '#ffff00',
        colorTileThresholdRed: '#ff0c4d'
      }}
    />
  );
}
```

## Props

The GaugeChart component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | number | 800 | Width of the SVG |
| `height` | number | 600 | Height of the SVG |
| `primary` | number | - | Primary value to display (required) |
| `secondary` | number | - | Secondary value to display (optional) |
| `unitTickFormatter` | function | - | Formatter function for unit tick labels |
| `unit` | function | - | Formatter function for unit display |
| `options` | object | - | General gauge configuration |
| `options.thresholdYellow` | number | - | Threshold value for yellow warning level |
| `options.thresholdRed` | number | - | Threshold value for red warning level |
| `options.withOpacitySwitch` | boolean | true | Whether to enable opacity changes on hover |
| `options.enableToolTip` | boolean | true | Whether to show tooltips |
| `options.enableUnitTicks` | boolean | true | Whether to show unit ticks |
| `options.tickFontsize` | string | '1rem' | Font size for tick labels |
| `options.tickLabelColor` | string | '#ffffff' | Color for tick labels |
| `options.tickRadiusScale` | number | 1.12 | Scale factor for tick radius |
| `options.tickColor` | string | '#777777' | Color for ticks |
| `options.circleScale` | number | 0.5 | Scale factor for center circle |
| `options.enableInnerArc` | boolean | true | Whether to show inner arcs |
| `options.fontColor` | string | '#ffffff' | Font color for labels and tooltips |
| `options.tooltipBgColor` | object | - | Background color for tooltips |
| `options.tooltipBgColor.r` | number | - | Red component (0-255) |
| `options.tooltipBgColor.g` | number | - | Green component (0-255) |
| `options.tooltipBgColor.b` | number | - | Blue component (0-255) |
| `options.tooltipBgColor.a` | number | - | Alpha component (0-1) |
| `tileArc` | object | - | Configuration for tile arcs (required) |
| `tileArc.colorTileThresholdRed` | string | '#ff0c4d' | Color for values above red threshold |
| `tileArc.colorTileThresholdYellow` | string | '#ffff00' | Color for values above yellow threshold but below red |
| `tileArc.colorTileThresholdDefault` | string | '#00ff00' | Default color for values below yellow threshold |
| `tileArc.colorTileBg` | string | '#ddd' | Background color for unfilled tiles |
| `tileArc.fillStyle` | enum | 'filled' | Fill style for tiles (filled, dotted, dashed, outlined) |
| `tileArc.borderColor` | string | '#000000' | Border color for outlined tiles |
| `tileArc.borderThickness` | number | 1 | Border thickness for outlined tiles |
| `tileArc.tiles` | number | 10 | Number of tiles to display |
| `tileArc.isTileColorGradient` | boolean | true | Whether to use gradient coloring for tiles |
| `tileArc.gradientType` | string | 'tile' | Type of gradient to use ('full' or 'tile') |
| `tileArc.tickEveryNThStep` | number | 0 | Step size for tick labels (0 means auto) |
| `tileArc.toolTipLabel` | string | 'Sum' | Label for tile tooltip |
| `tileArc.arcConfig` | object | - | Arc configuration for tiles |
| `tileArc.arcConfig.padAngle` | number | 2 | Padding angle between arcs |
| `tileArc.arcConfig.padRadius` | number | 2 | Padding radius for arcs |
| `tileArc.arcConfig.cornerRadius` | number | 5 | Corner radius for arcs |
| `primaryArcConfig` | object | - | Configuration for primary arc |
| `primaryArcConfig.colorPrimaryBar` | string | '#000000' | Color for primary bar |
| `primaryArcConfig.toolTipLabel` | string | 'Primary' | Label for primary tooltip |
| `primaryArcConfig.arcConfig` | object | - | Arc configuration for primary arc |
| `primaryArcConfig.arcConfig.padAngle` | number | 0 | Padding angle between arcs |
| `primaryArcConfig.arcConfig.padRadius` | number | 0 | Padding radius for arcs |
| `primaryArcConfig.arcConfig.cornerRadius` | number | 5 | Corner radius for arcs |
| `primaryArcConfig.pointerPrimaryConfig` | object | - | Pointer configuration for primary value |
| `primaryArcConfig.pointerPrimaryConfig.scale` | number | 1 | Scale factor for pointer size |
| `primaryArcConfig.pointerPrimaryConfig.strokeScale` | number | 1 | Scale factor for pointer stroke width |
| `primaryArcConfig.pointerPrimaryConfig.color` | string | '#025bff' | Color of the pointer |
| `secondaryArcConfig` | object | - | Configuration for secondary arc |
| `secondaryArcConfig.colorSecondaryBar` | string | '#aaaaaa' | Color for secondary bar |
| `secondaryArcConfig.toolTipLabel` | string | 'Secondary' | Label for secondary tooltip |
| `secondaryArcConfig.arcConfig` | object | - | Arc configuration for secondary arc |
| `secondaryArcConfig.arcConfig.padAngle` | number | 0 | Padding angle between arcs |
| `secondaryArcConfig.arcConfig.padRadius` | number | 0 | Padding radius for arcs |
| `secondaryArcConfig.arcConfig.cornerRadius` | number | 5 | Corner radius for arcs |
| `secondaryArcConfig.pointerSumConfig` | object | - | Pointer configuration for sum value |
| `secondaryArcConfig.pointerSumConfig.scale` | number | 1 | Scale factor for pointer size |
| `secondaryArcConfig.pointerSumConfig.strokeScale` | number | 1 | Scale factor for pointer stroke width |
| `secondaryArcConfig.pointerSumConfig.color` | string | '#0ed30e' | Color of the pointer |

## Fill Style Options

The component supports different fill styles for tiles:

```typescript
enum TileFillStyle {
  FILLED = "filled",
  DOTTED = "dotted",
  DASHED = "dashed",
  OUTLINED = "outlined"
}
```

## Advanced Usage Examples

### With Custom Formatters

```jsx
import Gauge from 'gauge-chart';

function MyComponent() {
  // Format days with hours and minutes
  const formatDayHourMinute = (value) => {
    const days = Math.floor(value);
    const hours = Math.floor((value - days) * 8); // Assuming 8-hour workdays
    const minutes = Math.floor(((value - days) * 8 - hours) * 60);
    
    return `${days} d, ${hours} h, ${minutes} m`;
  };

  // Format value with day unit
  const formatDay = (value) => `${value} d`;

  return (
    <Gauge
      width={800}
      height={600}
      primary={5.75}
      secondary={2.25}
      unit={formatDay}
      unitTickFormatter={formatDayHourMinute}
      options={{
        thresholdYellow: 7,
        thresholdRed: 10,
        enableToolTip: true,
        enableUnitTicks: true
      }}
      tileArc={{
        tiles: 10,
        colorTileThresholdDefault: '#00ff00',
        colorTileThresholdYellow: '#ffff00',
        colorTileThresholdRed: '#ff0c4d'
      }}
    />
  );
}
```

### With Custom Styling

```jsx
import Gauge from 'gauge-chart';
import { TileFillStyle } from 'gauge-chart';

function MyComponent() {
  return (
    <Gauge
      width={800}
      height={600}
      primary={40}
      secondary={35}
      options={{
        thresholdYellow: 60,
        thresholdRed: 80,
        enableToolTip: true,
        tickLabelColor: '#ffffff',
        tickColor: '#777777',
        circleScale: 0.5,
        tickFontsize: '1rem',
        tickRadiusScale: 1.12
      }}
      tileArc={{
        tiles: 10,
        colorTileThresholdDefault: '#00ff00',
        colorTileThresholdYellow: '#ffff00',
        colorTileThresholdRed: '#ff0c4d',
        colorTileBg: '#ddd',
        fillStyle: TileFillStyle.DASHED,
        borderColor: '#000000',
        borderThickness: 1,
        isTileColorGradient: true,
        gradientType: 'tile',
        arcConfig: {
          cornerRadius: 5,
          padRadius: 2,
          padAngle: 2
        },
        toolTipLabel: 'Total'
      }}
      primaryArcConfig={{
        colorPrimaryBar: '#000000',
        pointerPrimaryConfig: {
          color: '#025bff',
          scale: 1,
          strokeScale: 1
        },
        arcConfig: {
          cornerRadius: 5,
          padRadius: 0,
          padAngle: 0
        },
        toolTipLabel: 'Primary'
      }}
      secondaryArcConfig={{
        colorSecondaryBar: '#aaaaaa',
        pointerSumConfig: {
          color: '#0ed30e',
          scale: 1,
          strokeScale: 1
        },
        arcConfig: {
          cornerRadius: 5,
          padRadius: 0,
          padAngle: 0
        },
        toolTipLabel: 'Secondary'
      }}
    />
  );
}
```

## Customization Examples

### Changing Thresholds and Colors

```jsx
<Gauge
  primary={40}
  secondary={35}
  options={{
    thresholdYellow: 60,  // Yellow warning starts at 60%
    thresholdRed: 80,     // Red warning starts at 80%
  }}
  tileArc={{
    colorTileThresholdDefault: '#00ff00',  // Green for normal values
    colorTileThresholdYellow: '#ffff00',   // Yellow for warning values
    colorTileThresholdRed: '#ff0c4d',      // Red for critical values
  }}
/>
```

### Customizing Tooltips

```jsx
<Gauge
  primary={40}
  secondary={35}
  options={{
    enableToolTip: true,  // Enable tooltips
  }}
  tileArc={{
    toolTipLabel: 'Total',  // Label for tile tooltip
  }}
  primaryArcConfig={{
    toolTipLabel: 'Booked',  // Label for primary tooltip
  }}
  secondaryArcConfig={{
    toolTipLabel: 'Planned',  // Label for secondary tooltip
  }}
/>
```

### Customizing Tile Appearance

```jsx
<Gauge
  primary={40}
  secondary={35}
  tileArc={{
    tiles: 15,  // Number of tiles
    fillStyle: TileFillStyle.DOTTED,  // Dotted fill style
    borderColor: '#000000',  // Border color
    borderThickness: 2,  // Border thickness
    isTileColorGradient: true,  // Use gradient coloring
    gradientType: 'full',  // Full gradient type
  }}
/>
```

### Customizing Pointers

```jsx
<Gauge
  primary={40}
  secondary={35}
  primaryArcConfig={{
    pointerPrimaryConfig: {
      color: '#025bff',  // Blue pointer for primary
      scale: 1.2,  // Larger pointer
      strokeScale: 1.5  // Thicker stroke
    }
  }}
  secondaryArcConfig={{
    pointerSumConfig: {
      color: '#0ed30e',  // Green pointer for secondary
      scale: 1,  // Normal size
      strokeScale: 1  // Normal stroke width
    }
  }}
/>
```

## Development

### Running Locally

To run the demo application locally:

```bash
git clone https://github.com/DarkvoiceGit/gaugeChart.git
cd gaugeChart
npm install
npm run dev
```

This will start the development server, and you can access the demo at http://localhost:5173 (or the port shown in your terminal).

### Running Tests

```bash
npm test           # Run tests once
npm run test:watch # Run tests in watch mode
```

## Technologies

This project is built with:

- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [D3.js](https://d3js.org/) - Data visualization library
- [Material-UI](https://mui.com/) - UI component library (for the demo)
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Vitest](https://vitest.dev/) - Testing framework

## License

MIT