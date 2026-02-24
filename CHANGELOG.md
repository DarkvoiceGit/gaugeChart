# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-02-24

### Breaking changes

- **Removed `width` and `height` props.** Sizing is now controlled only by the `size` preset. Use the `size` prop (e.g. `size="xxs"`, `size="xl"`) to choose the gauge dimensions.
- **Removed `responsive` prop.** The SVG always uses dimensions derived from the selected `size` preset (pixel width/height). To make the gauge scale down on small screens, wrap it in a container with e.g. `maxWidth: '100%'` and `height: 'auto'`.

### Added

- **`size` prop (GaugeSize).** Named presets: `'default'` | `'xxs'` | `'xs'` | `'s'` | `'sm'` | `'m'` | `'l'` | `'xl'` | `'xxl'` | `'xxxl'`. The SVG width and height are set in pixels from the preset so the gauge and tick labels scale together.
- **Exported `GaugeSize` type** and **`GAUGE_SIZE_PRESETS`** constant for use in consumer code (e.g. dropdowns or design tokens).
- **Tight viewBox for semicircle.** ViewBox height only covers the semicircle region (no empty space below the arc).
- **Tight viewBox width.** ViewBox and SVG width are content-based (arc + tick labels + minimal side margin), so there is no large empty frame left or right of the gauge.
- **Tick label scaling.** When `options.tickFontsize` is not set, font size and tick stroke scale with the gauge size (via `scaleFactor`) so labels stay readable at all presets.

### Changed

- **`xxs` preset** size reduced to 160×120 (was 320×240) for a smaller “extra small” option.
- **Default `size`** is `'default'` (alias for `'m'`), preserving a similar default look to v1 (800×600 logical base; effective viewBox height/width are content-tight).
- **Package metadata:** added `description` and `keywords` in `package.json` for better discoverability on npm.

### Fixed

- Gauge no longer depends on CSS scaling to look correct: SVG dimensions and viewBox match the chosen preset, so circle and labels scale together without mismatch.
- Eliminated large empty space below the semicircle and excessive side padding around the arc.

---

## [1.0.1]

- Initial stable release with `width`/`height` props and fixed 800×600 default.
