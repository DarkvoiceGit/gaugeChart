import './App.css';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Chip,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Slider,
    Stack,
    Switch,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {useMemo, useState} from 'react';
import {GaugeChart} from '@darkvoice/gauge-chart';

type GradientType = 'full' | 'tile';
type TooltipMode = 'all' | 'self';
type Unit = 'none' | 'km' | 'mile' | 'celsius' | 'fahrenheit' | 'day';
type Formatter =
    | 'none'
    | 'kmToMile'
    | 'mileToKm'
    | 'celsiusToFahrenheit'
    | 'fahrenheitToCelsius'
    | 'dayHourMinute'
    | 'dayHour';

type PlaygroundConfig = {
    primaryValue: number;
    secondaryValue: number;
    maxValue: number;
    tiles: number;
    tileInnerRadius: number;
    tileOuterRadius: number;
    barInnerRadius: number;
    barOuterRadius: number;
    tileColor: string;
    tileBackground: string;
    primaryColor: string;
    secondaryColor: string;
    primaryPointerColor: string;
    secondaryPointerColor: string;
    hubColor: string;
    gradientEnabled: boolean;
    gradientType: GradientType;
    primaryPointerEnabled: boolean;
    secondaryPointerEnabled: boolean;
    primaryPointerScale: number;
    secondaryPointerScale: number;
    primaryPointerStrokeScale: number;
    secondaryPointerStrokeScale: number;
    hubScale: number;
    ticksEnabled: boolean;
    tooltipsEnabled: boolean;
    hoverDimming: boolean;
    animationEnabled: boolean;
    animationDuration: number;
    debugMode: boolean;
    tileTooltipLabel: string;
    primaryTooltipLabel: string;
    secondaryTooltipLabel: string;
    tileTooltipMode: TooltipMode;
    primaryTooltipMode: TooltipMode;
    secondaryTooltipMode: TooltipMode;
    unit: Unit;
    formatter: Formatter;
};

const DEFAULT_CONFIG: PlaygroundConfig = {
    primaryValue: 40,
    secondaryValue: 35,
    maxValue: 100,
    tiles: 20,
    tileInnerRadius: 0.72,
    tileOuterRadius: 1,
    barInnerRadius: 0.58,
    barOuterRadius: 0.70,
    tileColor: '#22c55e',
    tileBackground: '#20283a',
    primaryColor: '#38bdf8',
    secondaryColor: '#8b5cf6',
    primaryPointerColor: '#38bdf8',
    secondaryPointerColor: '#a78bfa',
    hubColor: '#0b1020',
    gradientEnabled: true,
    gradientType: 'tile',
    primaryPointerEnabled: true,
    secondaryPointerEnabled: true,
    primaryPointerScale: 1,
    secondaryPointerScale: 1,
    primaryPointerStrokeScale: 1,
    secondaryPointerStrokeScale: 1,
    hubScale: 0.5,
    ticksEnabled: true,
    tooltipsEnabled: true,
    hoverDimming: true,
    animationEnabled: true,
    animationDuration: 450,
    debugMode: false,
    tileTooltipLabel: 'Total',
    primaryTooltipLabel: 'Primary',
    secondaryTooltipLabel: 'Secondary',
    tileTooltipMode: 'all',
    primaryTooltipMode: 'self',
    secondaryTooltipMode: 'self',
    unit: 'none',
    formatter: 'none',
};

const PRESETS: Array<{name: string; config: Partial<PlaygroundConfig>}> = [
    {
        name: 'Aurora',
        config: {
            tileColor: '#22c55e',
            primaryColor: '#38bdf8',
            secondaryColor: '#8b5cf6',
            primaryPointerColor: '#38bdf8',
            secondaryPointerColor: '#a78bfa',
            tileBackground: '#20283a',
            gradientEnabled: true,
            gradientType: 'tile',
        },
    },
    {
        name: 'Sunset',
        config: {
            tileColor: '#fb7185',
            primaryColor: '#f59e0b',
            secondaryColor: '#f43f5e',
            primaryPointerColor: '#fbbf24',
            secondaryPointerColor: '#fb7185',
            tileBackground: '#331b25',
            gradientEnabled: true,
            gradientType: 'full',
        },
    },
    {
        name: 'Mono',
        config: {
            tileColor: '#e5e7eb',
            primaryColor: '#ffffff',
            secondaryColor: '#94a3b8',
            primaryPointerColor: '#ffffff',
            secondaryPointerColor: '#94a3b8',
            tileBackground: '#283040',
            gradientEnabled: false,
        },
    },
];

const unitOptions: Array<{value: Unit; label: string}> = [
    {value: 'none', label: 'No unit'},
    {value: 'km', label: 'Kilometers'},
    {value: 'mile', label: 'Miles'},
    {value: 'celsius', label: 'Celsius'},
    {value: 'fahrenheit', label: 'Fahrenheit'},
    {value: 'day', label: 'Days'},
];

const formatterOptions: Record<Unit, Array<{value: Formatter; label: string}>> = {
    none: [{value: 'none', label: 'No formatter'}],
    km: [
        {value: 'none', label: 'No formatter'},
        {value: 'kmToMile', label: 'km → miles'},
    ],
    mile: [
        {value: 'none', label: 'No formatter'},
        {value: 'mileToKm', label: 'miles → km'},
    ],
    celsius: [
        {value: 'none', label: 'No formatter'},
        {value: 'celsiusToFahrenheit', label: '°C → °F'},
    ],
    fahrenheit: [
        {value: 'none', label: 'No formatter'},
        {value: 'fahrenheitToCelsius', label: '°F → °C'},
    ],
    day: [
        {value: 'none', label: 'No formatter'},
        {value: 'dayHourMinute', label: 'days, hours, minutes'},
        {value: 'dayHour', label: 'days, hours'},
    ],
};

function formatValue(value: number, unit: Unit, formatter: Formatter): string {
    switch (formatter) {
        case 'kmToMile':
            return `${(value * 0.621371).toFixed(2)} mi`;
        case 'mileToKm':
            return `${(value * 1.60934).toFixed(2)} km`;
        case 'celsiusToFahrenheit':
            return `${((value * 9) / 5 + 32).toFixed(1)}°F`;
        case 'fahrenheitToCelsius':
            return `${(((value - 32) * 5) / 9).toFixed(1)}°C`;
        case 'dayHourMinute': {
            const days = Math.floor(value);
            const hours = Math.floor((value - days) * 8);
            const minutes = Math.floor(((value - days) * 8 - hours) * 60);
            return `${days} d, ${hours} h, ${minutes} m`;
        }
        case 'dayHour': {
            const days = Math.floor(value);
            const hours = Math.floor((value - days) * 8);
            return `${days} d, ${hours} h`;
        }
        default:
            switch (unit) {
                case 'km': return `${value} km`;
                case 'mile': return `${value} mi`;
                case 'celsius': return `${value}°C`;
                case 'fahrenheit': return `${value}°F`;
                case 'day': return `${value} d`;
                default: return `${value}`;
            }
    }
}

function App() {
    const [config, setConfig] = useState<PlaygroundConfig>(DEFAULT_CONFIG);
    const [tab, setTab] = useState(0);
    const [copied, setCopied] = useState(false);

    const update = <K extends keyof PlaygroundConfig>(key: K, value: PlaygroundConfig[K]) => {
        setConfig((current) => ({...current, [key]: value}));
    };

    const totalValue = config.primaryValue + config.secondaryValue;

    const codeSnippet = useMemo(() => `\n<GaugeChart\n  scale={{ min: 0, max: ${config.maxValue} }}\n  layers={[\n    {\n      id: 'tiles',\n      value: ${totalValue},\n      innerRadius: ${config.tileInnerRadius},\n      outerRadius: ${config.tileOuterRadius},\n      render: 'segmented',\n      segments: ${config.tiles},\n      color: '${config.tileColor}',\n      backgroundColor: '${config.tileBackground}',\n      gradient: { enabled: ${config.gradientEnabled}, type: '${config.gradientType}' },\n      hoverable: true,\n      tooltip: { label: '${config.tileTooltipLabel}', mode: '${config.tileTooltipMode}' },\n      zIndex: 3,\n    },\n    {\n      id: 'primary',\n      value: ${config.primaryValue},\n      valueMode: 'absolute',\n      innerRadius: ${config.barInnerRadius},\n      outerRadius: ${config.barOuterRadius},\n      render: 'solid',\n      color: '${config.primaryColor}',\n      backgroundColor: 'transparent',\n      pointer: { enabled: ${config.primaryPointerEnabled}, color: '${config.primaryPointerColor}', scale: ${config.primaryPointerScale}, strokeScale: ${config.primaryPointerStrokeScale} },\n      tooltip: { label: '${config.primaryTooltipLabel}', mode: '${config.primaryTooltipMode}' },\n      hoverable: true,\n      zIndex: 2,\n    },\n    {\n      id: 'secondary',\n      value: ${config.secondaryValue},\n      valueMode: 'cumulative',\n      baseLayerId: 'primary',\n      innerRadius: ${config.barInnerRadius},\n      outerRadius: ${config.barOuterRadius},\n      render: 'solid',\n      color: '${config.secondaryColor}',\n      backgroundColor: 'transparent',\n      pointer: { enabled: ${config.secondaryPointerEnabled}, color: '${config.secondaryPointerColor}', scale: ${config.secondaryPointerScale}, strokeScale: ${config.secondaryPointerStrokeScale} },\n      tooltip: { label: '${config.secondaryTooltipLabel}', mode: '${config.secondaryTooltipMode}' },\n      hoverable: true,\n      zIndex: 1,\n    },\n  ]}\n  ticks={{ enabled: ${config.ticksEnabled} }}\n  hub={{ color: '${config.hubColor}', scale: ${config.hubScale} }}\n  animation={{ enabled: ${config.animationEnabled}, durationMs: ${config.animationDuration} }}\n  interaction={{ tooltips: ${config.tooltipsEnabled}, tooltipMode: 'all', hoverDimming: ${config.hoverDimming} }}\n  size="xl"\n  debugMode={${config.debugMode}}\n/>`.trim(), [config, totalValue]);

    const copyCode = async () => {
        await navigator.clipboard.writeText(codeSnippet);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
    };

    const numberField = (
        label: string,
        key: keyof PlaygroundConfig,
        options?: {min?: number; max?: number; step?: number},
    ) => (
        <TextField
            fullWidth
            size="small"
            type="number"
            label={label}
            value={config[key] as number}
            slotProps={{htmlInput: {min: options?.min, max: options?.max, step: options?.step}}}
            onChange={(event) => update(key, Number(event.target.value) as never)}
        />
    );

    const sliderField = (
        label: string,
        key: keyof PlaygroundConfig,
        min: number,
        max: number,
        step: number,
    ) => (
        <Box className="control-block">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Chip size="small" label={String(config[key])}/>
            </Stack>
            <Slider
                min={min}
                max={max}
                step={step}
                value={config[key] as number}
                onChange={(_, value) => update(key, value as never)}
            />
        </Box>
    );

    const colorField = (label: string, key: keyof PlaygroundConfig) => (
        <Box className="color-control">
            <Box
                component="input"
                type="color"
                value={config[key] as string}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => update(key, event.target.value as never)}
                className="color-swatch"
                aria-label={label}
            />
            <TextField
                fullWidth
                size="small"
                label={label}
                value={config[key] as string}
                onChange={(event) => update(key, event.target.value as never)}
            />
        </Box>
    );

    const switchField = (label: string, key: keyof PlaygroundConfig) => (
        <FormControlLabel
            className="switch-row"
            control={
                <Switch
                    checked={config[key] as boolean}
                    onChange={(_, checked) => update(key, checked as never)}
                />
            }
            label={label}
        />
    );

    return (
        <Box className="playground-shell">
            <Box className="ambient ambient-one"/>
            <Box className="ambient ambient-two"/>

            <Box component="header" className="topbar">
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box className="brand-mark"><AutoAwesomeRoundedIcon fontSize="small"/></Box>
                    <Box>
                        <Typography className="brand-title">Gauge Chart Playground</Typography>
                        <Typography variant="caption" color="text.secondary">@darkvoice/gauge-chart · live configurator</Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Restore defaults">
                        <Button
                            variant="outlined"
                            startIcon={<RestartAltRoundedIcon/>}
                            onClick={() => setConfig(DEFAULT_CONFIG)}
                        >
                            Reset
                        </Button>
                    </Tooltip>
                    <Button variant="contained" startIcon={<ContentCopyRoundedIcon/>} onClick={copyCode}>
                        {copied ? 'Copied' : 'Copy code'}
                    </Button>
                </Stack>
            </Box>

            <Box className="workspace">
                <Paper className="preview-panel" elevation={0}>
                    <Box className="panel-heading">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <VisibilityRoundedIcon fontSize="small"/>
                            <Typography fontWeight={700}>Live preview</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip size="small" label={`${config.primaryValue} primary`}/>
                            <Chip size="small" label={`${config.secondaryValue} secondary`}/>
                            <Chip size="small" color={totalValue > config.maxValue ? 'warning' : 'success'} label={`${totalValue} / ${config.maxValue}`}/>
                        </Stack>
                    </Box>

                    <Box className="gauge-stage">
                        <Box className="gauge-glow"/>
                        <GaugeChart
                            scale={{min: 0, max: config.maxValue}}
                            layers={[
                                {
                                    id: 'tiles',
                                    value: totalValue,
                                    // Radius ist der äußere Bereich:
                                    radius: config.tileOuterRadius,
                                    // Thickness ist die Differenz zwischen Außen- und Innenradius:
                                    thickness: Math.max(0.01, config.tileOuterRadius - config.tileInnerRadius),
                                    render: 'segmented',
                                    segments: config.tiles,
                                    color: config.tileColor,
                                    backgroundColor: config.tileBackground,
                                    gradient: { enabled: config.gradientEnabled, type: config.gradientType },
                                    hoverable: true,
                                    tooltip: { label: config.tileTooltipLabel, mode: config.tileTooltipMode},
                                    zIndex: 3,
                                },
                                {
                                    id: 'primary',
                                    value: config.primaryValue,
                                    valueMode: 'absolute',
                                    radius: config.barOuterRadius,
                                    thickness: Math.max(0.01, config.barOuterRadius - config.barInnerRadius),
                                    render: 'solid',
                                    color: config.primaryColor,
                                    backgroundColor: 'transparent',
                                    pointer: {
                                        enabled: config.primaryPointerEnabled,
                                        color: config.primaryPointerColor,
                                        scale: config.primaryPointerScale,
                                        strokeScale: config.primaryPointerStrokeScale,
                                    },
                                    tooltip: { label: config.primaryTooltipLabel, mode: config.primaryTooltipMode },
                                    hoverable: true,
                                    zIndex: 2,
                                },
                                {
                                    id: 'secondary',
                                    value: config.secondaryValue,
                                    valueMode: 'cumulative',
                                    baseLayerId: 'primary',
                                    radius: config.barOuterRadius,
                                    thickness: Math.max(0.01, config.barOuterRadius - config.barInnerRadius),
                                    render: 'solid',
                                    color: config.secondaryColor,
                                    backgroundColor: 'transparent',
                                    pointer: {
                                        enabled: config.secondaryPointerEnabled,
                                        color: config.secondaryPointerColor,
                                        scale: config.secondaryPointerScale,
                                        strokeScale: config.secondaryPointerStrokeScale,
                                    },
                                    tooltip: { label: config.secondaryTooltipLabel, mode: config.secondaryTooltipMode },
                                    hoverable: true,
                                    zIndex: 1,
                                },
                            ]}
                            ticks={{enabled: config.ticksEnabled}}
                            hub={{color: config.hubColor, scale: config.hubScale}}
                            animation={{enabled: config.animationEnabled, durationMs: config.animationDuration}}
                            interaction={{
                                tooltips: config.tooltipsEnabled,
                                tooltipMode: 'all',
                                hoverDimming: config.hoverDimming,
                            }}
                            size="xl"
                            debugMode={config.debugMode}
                            tooltipScale={1}
                            theme={{
                                tooltip: {
                                    fontSize: '12px',    // 👈 Oder hier direkt im Theme anpassen
                                    padding: '6px 10px',
                                    minWidth: '100px',
                                }
                            }}
                            formatters={{
                                value: (value: number) => formatValue(value, config.unit, config.formatter),
                                tick: (value: number) => formatValue(value, config.unit, config.formatter),
                            }}
                        />
                    </Box>

                    <Box className="preset-strip">
                        <Typography variant="caption" color="text.secondary" sx={{mr: 0.5}}>Presets</Typography>
                        {PRESETS.map((preset) => (
                            <Button
                                key={preset.name}
                                size="small"
                                variant="outlined"
                                onClick={() => setConfig((current) => ({...current, ...preset.config}))}
                            >
                                {preset.name}
                            </Button>
                        ))}
                    </Box>

                    <Box className="code-card">
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="subtitle2">Generated JSX</Typography>
                            <Button size="small" startIcon={<ContentCopyRoundedIcon/>} onClick={copyCode}>
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        </Stack>
                        <Box component="pre">{codeSnippet}</Box>
                    </Box>
                </Paper>

                <Paper className="controls-panel" elevation={0}>
                    <Box className="controls-header">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <TuneRoundedIcon fontSize="small"/>
                            <Box>
                                <Typography fontWeight={700}>Configurator</Typography>
                                <Typography variant="caption" color="text.secondary">Tune the chart in real time</Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="fullWidth" className="config-tabs">
                        <Tab icon={<SettingsRoundedIcon/>} iconPosition="start" label="General"/>
                        <Tab icon={<AutoAwesomeRoundedIcon/>} iconPosition="start" label="Style"/>
                        <Tab icon={<TuneRoundedIcon/>} iconPosition="start" label="Advanced"/>
                    </Tabs>

                    <Box className="controls-scroll">
                        {tab === 0 && (
                            <Stack spacing={2.5}>
                                <Section title="Values" subtitle="Primary, secondary and scale">
                                    <Box className="control-grid">
                                        {numberField('Primary value', 'primaryValue', {min: 0})}
                                        {numberField('Secondary value', 'secondaryValue', {min: 0})}
                                        {numberField('Scale max', 'maxValue', {min: 1})}
                                        {numberField('Segments', 'tiles', {min: 1, max: 200})}
                                    </Box>
                                </Section>

                                <Section title="Formatting" subtitle="Units and value formatting">
                                    <Box className="control-grid">
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Unit</InputLabel>
                                            <Select
                                                value={config.unit}
                                                label="Unit"
                                                onChange={(event) => {
                                                    update('unit', event.target.value as Unit);
                                                    update('formatter', 'none');
                                                }}
                                            >
                                                {unitOptions.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Formatter</InputLabel>
                                            <Select
                                                value={config.formatter}
                                                label="Formatter"
                                                onChange={(event) => update('formatter', event.target.value as Formatter)}
                                            >
                                                {formatterOptions[config.unit].map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Section>

                                <Section title="Interaction" subtitle="Tooltips, ticks and hover behavior">
                                    <Box className="switch-grid">
                                        {switchField('Tooltips', 'tooltipsEnabled')}
                                        {switchField('Ticks', 'ticksEnabled')}
                                        {switchField('Hover dimming', 'hoverDimming')}
                                        {switchField('Debug mode', 'debugMode')}
                                    </Box>
                                </Section>

                                <Section title="Animation" subtitle="Motion settings">
                                    <Box className="switch-grid">{switchField('Animation enabled', 'animationEnabled')}</Box>
                                    {sliderField('Duration (ms)', 'animationDuration', 0, 2000, 50)}
                                </Section>
                            </Stack>
                        )}

                        {tab === 1 && (
                            <Stack spacing={2.5}>
                                <Section title="Colors" subtitle="Every visible chart color">
                                    <Stack spacing={1.5}>
                                        {colorField('Tile color', 'tileColor')}
                                        {colorField('Tile background', 'tileBackground')}
                                        {colorField('Primary bar', 'primaryColor')}
                                        {colorField('Secondary bar', 'secondaryColor')}
                                        {colorField('Primary pointer', 'primaryPointerColor')}
                                        {colorField('Secondary pointer', 'secondaryPointerColor')}
                                        {colorField('Hub', 'hubColor')}
                                    </Stack>
                                </Section>

                                <Section title="Gradient" subtitle="Segment gradient behavior">
                                    <Box className="switch-grid">{switchField('Gradient enabled', 'gradientEnabled')}</Box>
                                    <FormControl size="small" fullWidth disabled={!config.gradientEnabled}>
                                        <InputLabel>Gradient type</InputLabel>
                                        <Select value={config.gradientType} label="Gradient type" onChange={(event) => update('gradientType', event.target.value as GradientType)}>
                                            <MenuItem value="tile">Tile</MenuItem>
                                            <MenuItem value="full">Full</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Section>

                                <Section title="Geometry" subtitle="Radii and chart proportions">
                                    {sliderField('Tile inner radius', 'tileInnerRadius', 0.1, 0.95, 0.01)}
                                    {sliderField('Tile outer radius', 'tileOuterRadius', 0.2, 1, 0.01)}
                                    {sliderField('Bar inner radius', 'barInnerRadius', 0.1, 0.9, 0.01)}
                                    {sliderField('Bar outer radius', 'barOuterRadius', 0.2, 1, 0.01)}
                                    {sliderField('Hub scale', 'hubScale', 0.1, 1.5, 0.05)}
                                </Section>
                            </Stack>
                        )}

                        {tab === 2 && (
                            <Stack spacing={2}>
                                <Accordion defaultExpanded disableGutters>
                                    <AccordionSummary expandIcon={<ExpandMoreRoundedIcon/>}>
                                        <Box>
                                            <Typography fontWeight={700}>Pointers</Typography>
                                            <Typography variant="caption" color="text.secondary">Visibility, size and stroke</Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={2}>
                                            <Box className="switch-grid">
                                                {switchField('Primary pointer', 'primaryPointerEnabled')}
                                                {switchField('Secondary pointer', 'secondaryPointerEnabled')}
                                            </Box>
                                            {sliderField('Primary pointer scale', 'primaryPointerScale', 0.1, 2, 0.05)}
                                            {sliderField('Primary stroke scale', 'primaryPointerStrokeScale', 0.1, 3, 0.05)}
                                            {sliderField('Secondary pointer scale', 'secondaryPointerScale', 0.1, 2, 0.05)}
                                            {sliderField('Secondary stroke scale', 'secondaryPointerStrokeScale', 0.1, 3, 0.05)}
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion defaultExpanded disableGutters>
                                    <AccordionSummary expandIcon={<ExpandMoreRoundedIcon/>}>
                                        <Box>
                                            <Typography fontWeight={700}>Tooltip layers</Typography>
                                            <Typography variant="caption" color="text.secondary">Labels and layer-specific modes</Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={2}>
                                            <TooltipConfigRow label="Tiles" value={config.tileTooltipLabel} mode={config.tileTooltipMode} onLabel={(value) => update('tileTooltipLabel', value)} onMode={(value) => update('tileTooltipMode', value)}/>
                                            <TooltipConfigRow label="Primary" value={config.primaryTooltipLabel} mode={config.primaryTooltipMode} onLabel={(value) => update('primaryTooltipLabel', value)} onMode={(value) => update('primaryTooltipMode', value)}/>
                                            <TooltipConfigRow label="Secondary" value={config.secondaryTooltipLabel} mode={config.secondaryTooltipMode} onLabel={(value) => update('secondaryTooltipLabel', value)} onMode={(value) => update('secondaryTooltipMode', value)}/>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion disableGutters>
                                    <AccordionSummary expandIcon={<ExpandMoreRoundedIcon/>}>
                                        <Box>
                                            <Typography fontWeight={700}>Raw values</Typography>
                                            <Typography variant="caption" color="text.secondary">Quick numeric access for exact tuning</Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box className="control-grid">
                                            {numberField('Tile inner radius', 'tileInnerRadius', {min: 0, max: 1, step: 0.01})}
                                            {numberField('Tile outer radius', 'tileOuterRadius', {min: 0, max: 1, step: 0.01})}
                                            {numberField('Bar inner radius', 'barInnerRadius', {min: 0, max: 1, step: 0.01})}
                                            {numberField('Bar outer radius', 'barOuterRadius', {min: 0, max: 1, step: 0.01})}
                                            {numberField('Hub scale', 'hubScale', {min: 0, step: 0.05})}
                                            {numberField('Animation duration', 'animationDuration', {min: 0, step: 50})}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Stack>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

function Section({title, subtitle, children}: {title: string; subtitle?: string; children: React.ReactNode}) {
    return (
        <Box className="section-card">
            <Box mb={2}>
                <Typography fontWeight={700}>{title}</Typography>
                {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
            </Box>
            {children}
        </Box>
    );
}

function TooltipConfigRow({
                              label,
                              value,
                              mode,
                              onLabel,
                              onMode,
                          }: {
    label: string;
    value: string;
    mode: TooltipMode;
    onLabel: (value: string) => void;
    onMode: (value: TooltipMode) => void;
}) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{display: 'block', mb: 0.75}}>{label}</Typography>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={1}>
                <TextField fullWidth size="small" label="Label" value={value} onChange={(event) => onLabel(event.target.value)}/>
                <FormControl size="small" sx={{minWidth: 120}}>
                    <InputLabel>Mode</InputLabel>
                    <Select value={mode} label="Mode" onChange={(event) => onMode(event.target.value as TooltipMode)}>
                        <MenuItem value="self">Self</MenuItem>
                        <MenuItem value="all">All</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
        </Box>
    );
}

export default App;