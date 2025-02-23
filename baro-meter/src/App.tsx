import './App.css';
import GaugeChart from './GaugeChart';
import {Checkbox, FilledInput, InputLabel, Stack} from '@mui/material';
import {useState} from 'react';

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

    // Einstellungen für Zahlen
    const numberSettings = [
        { label: 'Booked:', value: bookedValue, onChange: setBookedVal, type: 'number' },
        { label: 'Planned:', value: plannedValue, onChange: setPlannedVal, type: 'number' },
        { label: 'Height:', value: heightValue, onChange: setHeightVal, type: 'number' },
        { label: 'Width:', value: widthValue, onChange: setWidthVal, type: 'number' },
        { label: 'ThresholdMid:', value: thresholdYellowValue, onChange: setThresholdYellowVal, type: 'number' },
        { label: 'ThresholdMax:', value: thresholdRedValue, onChange: setThresholdRedVal, type: 'number' },
        { label: 'AmountOfTiles:', value: tilesValue, onChange: setTilesVal, type: 'number' },
        { label: 'PointerBookedScale:', value: pointerBookedScale, onChange: setPointerBookedScale, type: 'number' },
        { label: 'PointerBookedStrokeScale:', value: pointerBookedStrokeScale, onChange: setPointerBookedStrokeScale, type: 'number' },
        { label: 'PointerPlannedScale:', value: pointerPlannedScale, onChange: setPointerPlannedScale, type: 'number' },
        { label: 'PointerPlannedStrokeScale:', value: pointerPlannedStrokeScale, onChange: setPointerPlannedStrokeScale, type: 'number' },
        { label: 'CircleScale:', value: circleScale, onChange: setCircleScale, type: 'number' },
    ];

    // Einstellungen für Booleans
    const booleanSettings = [
        { label: 'EnableOpacitySwitch:', checked: withOpacitySwitchValue, onChange: setWithOpacitySwitchVal },
        { label: 'EnableTooltip:', checked: enableToolTipValue, onChange: setEnableTooltipVal },
        { label: 'EnableTicks:', checked: enableUnitTicksValue, onChange: setEnableUnitTicksVal },
        { label: 'IsTileColorGradient:', checked: tilesIsGradient, onChange: setTilesIsGradient },
    ];

    // Einstellungen für Strings/Farben
    const colorSettings = [
        { label: 'TileColorThresholdMid:', value: colorTileThresholdYellowValue, onChange: setColorTileThresholdYellowVal },
        { label: 'TileColorThresholdMax:', value: colorTileThresholdRedValue, onChange: setColorTileThresholdRedVal },
        { label: 'TileColorThresholdDefault:', value: colorTileThresholdDefaultValue, onChange: setColorTileThresholdDefaultVal },
        { label: 'TileColor:', value: colorTileBgValue, onChange: setColorTileBgVal },
        { label: 'BookedBarColor:', value: colorBookedBarValue, onChange: setColorBookedBarVal },
        { label: 'PlannedBarColor:', value: colorPlannedBarValue, onChange: setColorPlannedBarVal },
        { label: 'PointerBookedColor:', value: pointerBookedColor, onChange: setPointerBookedColor },
        { label: 'PointerPlannedColor:', value: pointerPlannedColor, onChange: setPointerPlannedColor },
    ];

    return (
        <div className="gauge-chart">
            <Stack direction="row" spacing={4} m={5} p={5}>
                {/* Spalte 1: Zahlen-Einstellungen */}
                <Stack spacing={2} direction="column" flex={1}>
                    {numberSettings.map(({ label, value, onChange, type }, index) => (
                        <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
                            <InputLabel style={{ color: '#fff' }}>{label}</InputLabel>
                            <FilledInput
                                color="primary"
                                value={value}
                                type={type}
                                style={{ textAlign: 'right', width: '100px', color: 'white' }}
                                onChange={(e) => (Number(e.target.value) < 0 ? onChange(0) : onChange(Number(e.target.value)))}
                            />
                        </Stack>
                    ))}
                </Stack>

                {/* Spalte 2: Boolean-Einstellungen */}
                <Stack spacing={2} direction="column" flex={1}>
                    {booleanSettings.map(({ label, checked, onChange }, index) => (
                        <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
                            <InputLabel style={{ color: '#fff' }}>{label}</InputLabel>
                            <Checkbox checked={checked} onChange={(_, v) => onChange(v)} disableRipple />
                        </Stack>
                    ))}
                </Stack>

                {/* Spalte 3: Farb-Einstellungen */}
                <Stack spacing={2} direction="column" flex={1} borderRight={'1px dashed #fff'} mr={5} pr={5}>
                    {colorSettings.map(({ label, value, onChange }, index) => (
                        <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
                            <InputLabel style={{ color: '#fff' }}>{label}</InputLabel>
                            <input value={value} type="color" onChange={(e) => onChange(e.target.value)} />
                        </Stack>
                    ))}
                </Stack>


                {/* Gauge-Chart */}
                <GaugeChart
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
                    pointerSumConfig={{ color: pointerBookedColor, scale: pointerBookedScale, strokeScale: pointerBookedStrokeScale }}
                    pointerBookedConfig={{ color: pointerPlannedColor, scale: pointerPlannedScale, strokeScale: pointerPlannedStrokeScale }}
                    circleScale={circleScale}
                />
            </Stack>

        </div>
    );
}

export default App;