import './App.css';
import Gauge from './GaugeChart';
import {Checkbox, FilledInput, FormControl, InputLabel, MenuItem, Select, Stack} from '@mui/material';
import {useState} from 'react';

// import Gauge from "gauge-package";

function App() {
    // Zustände für die Einstellungen
    const [bookedValue, setBookedVal] = useState<number>(10);
    const [plannedValue, setPlannedVal] = useState<number>(5);
    const [heightValue, setHeightVal] = useState<number>(800);
    const [widthValue, setWidthVal] = useState<number>(600);
    const [thresholdYellowValue, setThresholdYellowVal] = useState<number>(60);
    const [thresholdRedValue, setThresholdRedVal] = useState<number>(80);
    const [withOpacitySwitchValue, setWithOpacitySwitchVal] = useState<boolean>(true);
    const [colorTileThresholdRedValue, setColorTileThresholdRedVal] = useState<string>('#ff0c4d');
    const [colorTileThresholdYellowValue, setColorTileThresholdYellowVal] = useState<string>('#ffff00');
    const [colorTileThresholdDefaultValue, setColorTileThresholdDefaultVal] = useState<string>('#00ff00');
    const [colorTileBgValue, setColorTileBgVal] = useState<string>('#ddd');
    const [colorBookedBarValue, setColorBookedBarVal] = useState<string>('#000000');
    const [colorPlannedBarValue, setColorPlannedBarVal] = useState<string>('#aaaaaa');
    const [enableToolTipValue, setEnableTooltipVal] = useState<boolean>(true);
    const [enableUnitTicksValue, setEnableUnitTicksVal] = useState<boolean>(true);
    const [tilesValue, setTilesVal] = useState<number>(10);
    const [tilesIsGradient, setTilesIsGradient] = useState<boolean>(false);
    const [pointerBookedScale, setPointerBookedScale] = useState<number>(1);
    const [pointerBookedStrokeScale, setPointerBookedStrokeScale] = useState<number>(1);
    const [pointerBookedColor, setPointerBookedColor] = useState<string>('#0ed30e');
    const [pointerPlannedScale, setPointerPlannedScale] = useState<number>(1);
    const [pointerPlannedStrokeScale, setPointerPlannedStrokeScale] = useState<number>(1);
    const [pointerPlannedColor, setPointerPlannedColor] = useState<string>('#025bff');
    const [circleScale, setCircleScale] = useState<number>(0.5);
    const [selectedUnit, setSelectedUnit] = useState<string>('undefined');
    const [selectedFormatter, setSelectedFormatter] = useState<string>('undefined');
    const [selectedGradientType, setSelectedGradientType] = useState<"full" | "tile" | undefined>('full');

    const formatterDayHourMinute = (value: number) => {
        const days = Math.floor(value);
        const hours = Math.floor((value - days) * 8);
        const minutes = Math.floor(((value - days) * 8 - hours) * 60);

        return `${days} T, ${hours} S, ${minutes} M`;
    };
    const formatterDayHour = (value: number) => {
        const days = Math.floor(value);
        const hours = Math.floor((value - days) * 8);

        return `${days} T, ${hours} S`;
    };
    const formatterCelsiusToFahrenheit = (value: number) => {
        const fahrenheit = (value * 9/5) + 32;
        return `${fahrenheit.toFixed(1)}°F`;
    };
    const formatterFahrenheitToCelsius = (value: number) => {
        const celsius = (value - 32) * 5/9;
        return `${celsius.toFixed(1)}°C`;
    };
    const formatterKmToMile = (value: number) => {
        const miles = value * 0.621371;
        return `${miles.toFixed(2)} Meilen`;
    };
    const formatterMileToKm = (value: number) => {
        const kilometers = value * 1.60934;
        return `${kilometers.toFixed(2)} Km`;
    };

    const unitOptions = [
        { value: 'undefined', label: 'Keine Einheit' },
{ value: 'km', label: 'Kilometer' },
{ value: 'mile', label: 'Meilen' },
        { value: 'celsius', label: 'Celsius' },
        { value: 'fahrenheit', label: 'Fahrenheit' },
        { value: 'day', label: 'Tage' },
    ];

    const formatterOptions = {
        km: [
            { value: 'undefined', label: 'Kein Formatter' },
            { value: 'kmToMile', label: 'Km zu Meilen' },
        ],
        mile: [
            { value: 'undefined', label: 'Kein Formatter' },
            { value: 'mileToKm', label: 'Meilen zu Km' },
        ],
        celsius: [
            { value: 'undefined', label: 'Kein Formatter' },
            { value: 'celsiusToFahrenheit', label: 'Celsius zu Fahrenheit' },
        ],
        fahrenheit: [
            { value: 'undefined', label: 'Kein Formatter' },
            { value: 'fahrenheitToCelsius', label: 'Fahrenheit zu Celsius' },
        ],
        day: [
            { value: 'undefined', label: 'Kein Formatter' },
            { value: 'dayHourMinute', label: 'Tage, Stunden, Minuten' },
            { value: 'dayHour', label: 'Tage, Stunden' },
        ],
        undefined: [
            { value: 'undefined', label: 'Kein Formatter' },
        ],
    };

    const gradientType = [
    { value: 'full', label: 'Full' },
    { value: 'tile', label: 'Tile' },
    ]

    const handleUnitChange = (event: any) => {
        const unit = event.target.value as string;
        setSelectedUnit(unit);
        setSelectedFormatter('undefined'); // Formatter zurücksetzen
    };

    const handleFormatterChange = (event: any) => {
        const formatter = event.target.value as string;
        setSelectedFormatter(formatter);
    };
    const handleGradientTypeChange = (event: any) => {
        const gradientTypeSel = event.target.value as "full" | "tile";
        setSelectedGradientType(gradientTypeSel);
    };

    const formatValue = (value: number) => {
        // Kein Formatter, einfach die Einheit anhängen
        switch (selectedUnit) {
            case 'km':
                return `${value} km`;
            case 'mile':
                return `${value} mi`;
            case 'celsius':
                return `${value}°C`;
            case 'fahrenheit':
                return `${value}°F`;
            case 'day':
                return `${value} T`;
            default:
                return `${value}`;
        }
    };

    const formatToolTipValue = (selectedFormatter: string, value: number) => {
        // Formatter anwenden
        switch (selectedFormatter) {
            case 'kmToMile':
                return formatterKmToMile(value);
            case 'mileToKm':
                return formatterMileToKm(value);
            case 'celsiusToFahrenheit':
                return formatterCelsiusToFahrenheit(value);
            case 'fahrenheitToCelsius':
                return formatterFahrenheitToCelsius(value);
            case 'dayHourMinute':
                return formatterDayHourMinute(value);
            case 'dayHour':
                return formatterDayHour(value);
            default:
                return `unit`;
        }
    };


    // Einstellungen für Zahlen
    const numberSettings = [
        {label: 'Booked:', value: bookedValue, onChange: setBookedVal, type: 'number'},
        {label: 'Planned:', value: plannedValue, onChange: setPlannedVal, type: 'number'},
        {label: 'Height:', value: heightValue, onChange: setHeightVal, type: 'number'},
        {label: 'Width:', value: widthValue, onChange: setWidthVal, type: 'number'},
        {label: 'ThresholdMid:', value: thresholdYellowValue, onChange: setThresholdYellowVal, type: 'number'},
        {label: 'ThresholdMax:', value: thresholdRedValue, onChange: setThresholdRedVal, type: 'number'},
        {label: 'AmountOfTiles:', value: tilesValue, onChange: setTilesVal, type: 'number'},
        {label: 'PointerBookedScale:', value: pointerBookedScale, onChange: setPointerBookedScale, type: 'number'},
        {
            label: 'PointerBookedStrokeScale:',
            value: pointerBookedStrokeScale,
            onChange: setPointerBookedStrokeScale,
            type: 'number'
        },
        {label: 'PointerPlannedScale:', value: pointerPlannedScale, onChange: setPointerPlannedScale, type: 'number'},
        {
            label: 'PointerPlannedStrokeScale:',
            value: pointerPlannedStrokeScale,
            onChange: setPointerPlannedStrokeScale,
            type: 'number'
        },
        {label: 'CircleScale:', value: circleScale, onChange: setCircleScale, type: 'number'},
    ];

    // Einstellungen für Booleans
    const booleanSettings = [
        {label: 'EnableOpacitySwitch:', checked: withOpacitySwitchValue, onChange: setWithOpacitySwitchVal},
        {label: 'EnableTooltip:', checked: enableToolTipValue, onChange: setEnableTooltipVal},
        {label: 'EnableTicks:', checked: enableUnitTicksValue, onChange: setEnableUnitTicksVal},
        {label: 'IsTileColorGradient:', checked: tilesIsGradient, onChange: setTilesIsGradient},
    ];

    // Einstellungen für Strings/Farben
    const colorSettings = [
        {
            label: 'TileColorThresholdMid:',
            value: colorTileThresholdYellowValue,
            onChange: setColorTileThresholdYellowVal
        },
        {label: 'TileColorThresholdMax:', value: colorTileThresholdRedValue, onChange: setColorTileThresholdRedVal},
        {
            label: 'TileColorThresholdDefault:',
            value: colorTileThresholdDefaultValue,
            onChange: setColorTileThresholdDefaultVal
        },
        {label: 'TileColor:', value: colorTileBgValue, onChange: setColorTileBgVal},
        {label: 'BookedBarColor:', value: colorBookedBarValue, onChange: setColorBookedBarVal},
        {label: 'PlannedBarColor:', value: colorPlannedBarValue, onChange: setColorPlannedBarVal},
        {label: 'PointerBookedColor:', value: pointerBookedColor, onChange: setPointerBookedColor},
        {label: 'PointerPlannedColor:', value: pointerPlannedColor, onChange: setPointerPlannedColor},
    ];

    return (
        <div className="gauge-chart">
            <Stack direction="row" spacing={4} m={5} p={5}>
                {/* Spalte 1: Zahlen-Einstellungen */}
                <Stack spacing={2} direction="column" flex={1}>
                    {numberSettings.map(({label, value, onChange, type}, index) => (
                        <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
                            <InputLabel style={{color: '#fff'}}>{label}</InputLabel>
                            <FilledInput
                                color="primary"
                                value={value}
                                type={type}
                                style={{textAlign: 'right', width: '100px', color: 'white'}}
                                onChange={(e) => (Number(e.target.value) < 0 ? onChange(0) : onChange(Number(e.target.value)))}
                            />
                        </Stack>
                    ))}
                </Stack>

                {/* Spalte 2: Boolean-Einstellungen */}
                <Stack spacing={2} direction="column" flex={1}>
                    {booleanSettings.map(({label, checked, onChange}, index) => (
                        <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
                            <InputLabel style={{color: '#fff'}}>{label}</InputLabel>
                            <Checkbox checked={checked} onChange={(_, v) => onChange(v)} disableRipple/>
                        </Stack>
                    ))}
                    <Stack spacing={2} direction="column" flex={1}>
                        {/* Selectbox für gradient type */}
                        <FormControl fullWidth>
                            <InputLabel style={{ color: '#fff' }}>GradientType:</InputLabel>
                            <Select
                                value={selectedGradientType}
                                onChange={handleGradientTypeChange}
                                label="GradientType"
                                style={{ color: '#fff' }}
                            >
                                {
                                    //@ts-ignore
                                    gradientType.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        {/* SelectBox für Einheiten */}
                        <FormControl fullWidth>
                            <InputLabel style={{ color: '#fff' }}>Einheit</InputLabel>
                            <Select
                                value={selectedUnit}
                                onChange={handleUnitChange}
                                label="Einheit"
                                style={{ color: '#fff' }}
                            >
                                {unitOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* SelectBox für Formatter */}
                        <FormControl fullWidth>
                            <InputLabel style={{ color: '#fff' }}>Formatter</InputLabel>
                            <Select
                                value={selectedFormatter}
                                onChange={handleFormatterChange}
                                label="Formatter"
                                style={{ color: '#fff' }}
                            >
                                {
                                    //@ts-ignore
                                    formatterOptions[selectedUnit].map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>

                {/* Spalte 3: Farb-Einstellungen */}
                <Stack spacing={2} direction="column" flex={1} borderRight={'1px dashed #fff'} mr={5} pr={5}>
                    {colorSettings.map(({label, value, onChange}, index) => (
                        <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
                            <InputLabel style={{color: '#fff'}}>{label}</InputLabel>
                            <input value={value} type="color" onChange={(e) => onChange(e.target.value)}/>
                        </Stack>
                    ))}
                </Stack>


                {/* Gauge-Chart */}
                <Gauge
                    booked={bookedValue}
                    planned={plannedValue}
                    height={heightValue}
                    width={widthValue}
                    thresholdYellow={thresholdYellowValue}
                    thresholdRed={thresholdRedValue}
                    withOpacitySwitch={withOpacitySwitchValue}
                    colorTileThresholdRed={colorTileThresholdRedValue}
                    colorTileThresholdYellow={colorTileThresholdYellowValue}
                    colorTileThresholdDefault={colorTileThresholdDefaultValue}
                    colorTileBg={colorTileBgValue}
                    colorBookedBar={colorBookedBarValue}
                    colorPlannedBar={colorPlannedBarValue}
                    enableToolTip={enableToolTipValue}
                    enableUnitTicks={enableUnitTicksValue}
                    tiles={tilesValue}
                    isTileColorGradient={tilesIsGradient}
                    pointerSumConfig={{
                        color: pointerBookedColor,
                        scale: pointerBookedScale,
                        strokeScale: pointerBookedStrokeScale
                    }}
                    pointerBookedConfig={{
                        color: pointerPlannedColor,
                        scale: pointerPlannedScale,
                        strokeScale: pointerPlannedStrokeScale
                    }}
                    circleScale={circleScale}
                    unitTickFormatter={(value: number) => formatToolTipValue(selectedFormatter, value)} // Formatter für Tooltips
                    unit={formatValue}
                    gradientType={selectedGradientType}
                />
            </Stack>

        </div>
    );
}

export default App;