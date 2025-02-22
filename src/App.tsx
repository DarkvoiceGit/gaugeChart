import './App.css';
import Gauge from './GaugeChart';
import {
    Checkbox, FilledInput, FormControl, InputLabel, MenuItem, Select, Stack, Tooltip,
    Tabs, Tab, Box, Paper, Typography, Divider, useMediaQuery, useTheme
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {useState} from 'react';
import {TileFillStyle} from './utils/constants';


function App() {
    const [bookedValue, setBookedVal] = useState<number>(40);
    const [plannedValue, setPlannedVal] = useState<number>(35);
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
    const [tilesIsGradient, setTilesIsGradient] = useState<boolean>(true);
    const [pointerBookedScale, setPointerBookedScale] = useState<number>(1);
    const [pointerBookedStrokeScale, setPointerBookedStrokeScale] = useState<number>(1);
    const [pointerBookedColor, setPointerBookedColor] = useState<string>('#0ed30e');
    const [pointerPlannedScale, setPointerPlannedScale] = useState<number>(1);
    const [pointerPlannedStrokeScale, setPointerPlannedStrokeScale] = useState<number>(1);
    const [tickLabelColor, setTickLabelColor] = useState<string>('#ffffff');
    const [tickColor, setTickColor] = useState<string>('#777777');
    const [pointerPlannedColor, setPointerPlannedColor] = useState<string>('#025bff');
    const [circleScale, setCircleScale] = useState<number>(0.5);
    const [selectedUnit, setSelectedUnit] = useState<string>('undefined');
    const [selectedFormatter, setSelectedFormatter] = useState<string>('undefined');
    const [selectedGradientType, setSelectedGradientType] = useState<"full" | "tile" | undefined>('tile');
    const [tickEveryNthStep, setTickEveryNthStep] = useState<number>(10);
    const [outerArcPadAngle, setOuterArcPadAngle] = useState<number>(2);
    const [tickFontSize, setTickFontSize] = useState<number>(1);
    const [outerArcPadRadius, setOuterArcPadRadius] = useState<number>(2);
    const [outerArcCornerRadius, setOuterArcCornerRadius] = useState<number>(5);
    const [tickRadiusScale, setTickRadiusScale] = useState<number>(1.12);

    const [tileFillStyle, setTileFillStyle] = useState<TileFillStyle>(TileFillStyle.FILLED);
    const [tileBorderColor, setTileBorderColor] = useState<string>('#000000');
    const [tileBorderThickness, setTileBorderThickness] = useState<number>(1);

    const [primaryArcPadAngle, _setPrimaryArcPadAngle] = useState<number>(0);
    const [primaryArcPadRadius, _setPrimaryArcPadRadius] = useState<number>(0);
    const [primaryArcCornerRadius, setPrimaryArcCornerRadius] = useState<number>(5);

    const [secondaryArcPadAngle, _setSecondaryArcPadAngle] = useState<number>(0);
    const [secondaryArcPadRadius, _setSecondaryArcPadRadius] = useState<number>(0);
    const [secondaryArcCornerRadius, setSecondaryArcCornerRadius] = useState<number>(5);

    const [tileTooltipLabel, setTileToolTipLabel] = useState<string>('Sum')
    const [primaryTooltipLabel, setPrimaryToolTipLabel] = useState<string>('Primary')
    const [secondaryTooltipLabel, setSecondaryToolTipLabel] = useState<string>('Secondary')

    const [activeTab, setActiveTab] = useState(0);
    const [activeAdvancedSubtab, setActiveAdvancedSubtab] = useState(0);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const formatterDayHourMinute = (value: number) => {
        const days = Math.floor(value);
        const hours = Math.floor((value - days) * 8);
        const minutes = Math.floor(((value - days) * 8 - hours) * 60);

        return `${days} d, ${hours} h, ${minutes} m`;
    };
    const formatterDayHour = (value: number) => {
        const days = Math.floor(value);
        const hours = Math.floor((value - days) * 8);

        return `${days} m, ${hours} m`;
    };
    const formatterCelsiusToFahrenheit = (value: number) => {
        const fahrenheit = (value * 9 / 5) + 32;
        return `${fahrenheit.toFixed(1)}°F`;
    };
    const formatterFahrenheitToCelsius = (value: number) => {
        const celsius = (value - 32) * 5 / 9;
        return `${celsius.toFixed(1)}°C`;
    };
    const formatterKmToMile = (value: number) => {
        const miles = value * 0.621371;
        return `${miles.toFixed(2)} Miles`;
    };
    const formatterMileToKm = (value: number) => {
        const kilometers = value * 1.60934;
        return `${kilometers.toFixed(2)} km`;
    };

    const unitOptions = [
        {value: 'undefined', label: 'No Unit'},
        {value: 'km', label: 'Kilometers'},
        {value: 'mile', label: 'Miles'},
        {value: 'celsius', label: 'Celsius'},
        {value: 'fahrenheit', label: 'Fahrenheit'},
        {value: 'day', label: 'Days'},
    ];

    const formatterOptions = {
        km: [
            {value: 'undefined', label: 'No Formatter'},
            {value: 'kmToMile', label: 'Km to Miles'},
        ],
        mile: [
            {value: 'undefined', label: 'No Formatter'},
            {value: 'mileToKm', label: 'Miles to Km'},
        ],
        celsius: [
            {value: 'undefined', label: 'No Formatter'},
            {value: 'celsiusToFahrenheit', label: 'Celsius to Fahrenheit'},
        ],
        fahrenheit: [
            {value: 'undefined', label: 'No Formatter'},
            {value: 'fahrenheitToCelsius', label: 'Fahrenheit to Celsius'},
        ],
        day: [
            {value: 'undefined', label: 'No Formatter'},
            {value: 'dayHourMinute', label: 'Days, Hours, Minutes'},
            {value: 'dayHour', label: 'Days, Hours'},
        ],
        undefined: [
            {value: 'undefined', label: 'No Formatter'},
        ],
    };

    const gradientType = [
        {value: 'full', label: 'Full'},
        {value: 'tile', label: 'Tile'},
    ]

    const fillStyleOptions = [
        {value: TileFillStyle.FILLED, label: 'Filled'},
        {value: TileFillStyle.DOTTED, label: 'Dotted'},
        {value: TileFillStyle.DASHED, label: 'Dashed'},
        {value: TileFillStyle.OUTLINED, label: 'Outlined'},
    ]

    const handleUnitChange = (event: any) => {
        const unit = event.target.value as string;
        setSelectedUnit(unit);
        setSelectedFormatter('undefined'); // Reset formatter
    };

    const handleFormatterChange = (event: any) => {
        const formatter = event.target.value as string;
        setSelectedFormatter(formatter);
    };
    const handleGradientTypeChange = (event: any) => {
        const gradientTypeSel = event.target.value as "full" | "tile";
        setSelectedGradientType(gradientTypeSel);
    };

    const handleFillStyleChange = (event: any) => {
        const fillStyle = event.target.value as TileFillStyle;
        setTileFillStyle(fillStyle);
    };

    const formatValue = (value: number) => {
        // No formatter, simply append the unit
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
                return `${value} d`;
            default:
                return `${value}`;
        }
    };

    const formatToolTipValue = (selectedFormatter: string, value: number) => {
        // Apply formatter
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


    const numberSettings = [
        {label: 'Primary:', value: bookedValue, onChange: setBookedVal, type: 'number'},
        {label: 'Secondary:', value: plannedValue, onChange: setPlannedVal, type: 'number'},
        {label: 'ThresholdMid:', value: thresholdYellowValue, onChange: setThresholdYellowVal, type: 'number'},
        {label: 'ThresholdMax:', value: thresholdRedValue, onChange: setThresholdRedVal, type: 'number'},
        {label: 'AmountOfTiles:', value: tilesValue, onChange: setTilesVal, type: 'number'},
        {label: 'TickFontSize (rem):', value: tickFontSize, onChange: setTickFontSize, type: 'number'},
        {label: 'PointerPrimaryScale:', value: pointerBookedScale, onChange: setPointerBookedScale, type: 'number'},
        {
            label: 'PointerPrimaryStrokeScale:',
            value: pointerBookedStrokeScale,
            onChange: setPointerBookedStrokeScale,
            type: 'number'
        },
        {label: 'PointerSecondaryScale:', value: pointerPlannedScale, onChange: setPointerPlannedScale, type: 'number'},
        {
            label: 'PointerSecondaryStrokeScale:',
            value: pointerPlannedStrokeScale,
            onChange: setPointerPlannedStrokeScale,
            type: 'number'
        },
        {label: 'CircleScale:', value: circleScale, onChange: setCircleScale, type: 'number'},
    ];

    const booleanSettings = [
        {label: 'EnableOpacitySwitch:', checked: withOpacitySwitchValue, onChange: setWithOpacitySwitchVal},
        {label: 'EnableTooltip:', checked: enableToolTipValue, onChange: setEnableTooltipVal},
        {label: 'EnableTicks:', checked: enableUnitTicksValue, onChange: setEnableUnitTicksVal},
        {label: 'IsTileColorGradient:', checked: tilesIsGradient, onChange: setTilesIsGradient},
    ];

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
        {label: 'TileBorderColor:', value: tileBorderColor, onChange: setTileBorderColor},
        {label: 'PrimaryBarColor:', value: colorBookedBarValue, onChange: setColorBookedBarVal},
        {label: 'SecondaryBarColor:', value: colorPlannedBarValue, onChange: setColorPlannedBarVal},
        {label: 'PointerPrimaryColor:', value: pointerBookedColor, onChange: setPointerBookedColor},
        {label: 'PointerSecondaryColor:', value: pointerPlannedColor, onChange: setPointerPlannedColor},
        {label: 'TickLabelColor:', value: tickLabelColor, onChange: setTickLabelColor},
        {label: 'TickColor:', value: tickColor, onChange: setTickColor},
    ];


    const otherSettings = [
        {
            label: 'TickEveryNthStep:',
            value: tickEveryNthStep,
            onChange: setTickEveryNthStep,
        },
        {
            label: 'TileBorderThickness:',
            value: tileBorderThickness,
            onChange: setTileBorderThickness,
        },
        {
            label: 'OuterArcPadAngle:',
            value: outerArcPadAngle,
            onChange: setOuterArcPadAngle,
        },
        {
            label: 'OuterArcPadRadius:',
            value: outerArcPadRadius,
            onChange: setOuterArcPadRadius,
        },
        {
            label: 'OuterArcCornerRadius:',
            value: outerArcCornerRadius,
            onChange: setOuterArcCornerRadius,
        },
        {
            label: 'PrimaryArcCornerRadius:',
            value: primaryArcCornerRadius,
            onChange: setPrimaryArcCornerRadius,
        },
        {
            label: 'SecondaryArcCornerRadius:',
            value: secondaryArcCornerRadius,
            onChange: setSecondaryArcCornerRadius,
        },
        {
            label: 'TickRadiusScale:',
            value: tickRadiusScale,
            onChange: setTickRadiusScale,
        },

    ];

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleAdvancedSubtabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveAdvancedSubtab(newValue);
    };
    const renderSettings = () => {
        switch (activeTab) {
            case 0: // Basic Settings
                return (
                    <Stack spacing={4} direction="column" width="100%" className="basic-stack">
                        <Typography variant="h6" color="white">Basic Settings</Typography>
                        <Divider sx={{backgroundColor: 'rgba(255,255,255,0.2)'}}/>

                        <Stack spacing={3} direction={isMobile ? "column" : "row"} flexWrap="wrap">
                            {numberSettings.slice(0, 6).map(({label, value, onChange, type}, index) => (
                                <Stack key={index} direction="row" justifyContent="space-between" alignItems="center"
                                       sx={{minWidth: '200px', flex: '1 0 auto', margin: '8px'}}>
                                    <InputLabel style={{color: '#fff'}}>{label}</InputLabel>
                                    <FilledInput
                                        color="primary"
                                        value={value}
                                        type={type}
                                        style={{textAlign: 'right', width: '100px', color: 'white'}}
                                        sx={{
                                            borderColor: '#1976d2',
                                            '&.Mui-focused': {
                                                borderColor: '#1976d2'
                                            }
                                        }}
                                        onChange={(e) => (Number(e.target.value) < 0 ? onChange(0) : onChange(Number(e.target.value)))}
                                    />
                                </Stack>
                            ))}
                        </Stack>

                        <Stack spacing={3} direction={isMobile ? "column" : "row"} flexWrap="wrap">
                            {booleanSettings.map(({label, checked, onChange}, index) => (
                                <Stack key={index} direction="row" justifyContent="space-between" alignItems="center"
                                       sx={{minWidth: '200px', flex: '1 0 auto', margin: '8px'}}>
                                    <InputLabel style={{color: '#fff'}}>{label}</InputLabel>
                                    <Checkbox checked={checked} onChange={(_, v) => onChange(v)} disableRipple/>
                                </Stack>
                            ))}
                        </Stack>

                        <Stack spacing={3} direction={isMobile ? "column" : "row"}>
                            <FormControl sx={{minWidth: '200px', flex: 1}}>
                                <InputLabel style={{color: '#fff'}}>Unit</InputLabel>
                                <Select
                                    value={selectedUnit}
                                    onChange={handleUnitChange}
                                    label="Unit"
                                    style={{color: '#fff'}}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1976d2'
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1976d2'
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1976d2'
                                        }
                                    }}
                                >
                                    {unitOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl sx={{minWidth: '200px', flex: 1}}>
                                <InputLabel style={{color: '#fff'}}>Formatter</InputLabel>
                                <Select
                                    value={selectedFormatter}
                                    onChange={handleFormatterChange}
                                    label="Formatter"
                                    style={{color: '#fff'}}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1976d2'
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1976d2'
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1976d2'
                                        }
                                    }}
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
                );
            case 1: // Appearance
                return (
                    <Stack spacing={4} direction="column" width="100%" className="appearance-stack">
                        <Typography variant="h6" color="white">Appearance Settings</Typography>
                        <Divider sx={{backgroundColor: 'rgba(255,255,255,0.2)'}}/>

                        <Typography variant="subtitle1" color="white">Colors</Typography>
                        <Stack spacing={3} direction={isMobile ? "column" : "row"} flexWrap="wrap">
                            {colorSettings.map(({label, value, onChange}, index) => (
                                <Stack key={index} direction="row" justifyContent="space-between" alignItems="center"
                                       sx={{minWidth: '200px', flex: '1 0 auto', margin: '8px'}}>
                                    <InputLabel style={{color: '#fff'}}>{label}</InputLabel>
                                    <input value={value} type="color" onChange={(e) => onChange(e.target.value)}/>
                                </Stack>
                            ))}
                        </Stack>

                        <Typography variant="subtitle1" color="white">Style</Typography>
                        <Stack spacing={3} direction={isMobile ? "column" : "row"}>
                            <FormControl sx={{minWidth: '200px', flex: 1}}>
                                <InputLabel style={{color: '#fff'}}>GradientType:</InputLabel>
                                <Select
                                    value={selectedGradientType}
                                    onChange={handleGradientTypeChange}
                                    label="GradientType"
                                    style={{color: '#fff'}}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1976d2'
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1976d2'
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1976d2'
                                        }
                                    }}
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

                            <FormControl sx={{minWidth: '200px', flex: 1}}>
                                <InputLabel style={{color: '#fff'}}>TileFillStyle:</InputLabel>
                                <Select
                                    value={tileFillStyle}
                                    onChange={handleFillStyleChange}
                                    label="TileFillStyle"
                                    style={{color: '#fff'}}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1976d2'
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1976d2'
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1976d2'
                                        }
                                    }}
                                >
                                    {
                                        fillStyleOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </Stack>
                );
            case 2: // Advanced
                return (
                    <Stack spacing={4} direction="column" width="100%" className="advanced-stack">
                        <Typography variant="h6" color="white">Advanced Settings</Typography>
                        <Divider sx={{backgroundColor: 'rgba(255,255,255,0.2)'}}/>

                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <Tabs
                                value={activeAdvancedSubtab}
                                onChange={handleAdvancedSubtabChange}
                                variant="fullWidth"
                                textColor="primary"
                                indicatorColor="primary"
                                sx={{
                                    '& .MuiTab-root': {
                                        color: 'white',  // Unselected tab text color
                                    },
                                    '& .Mui-selected': {
                                        color: 'primary.main',  // Selected tab text color
                                    }
                                }}
                            >
                                <Tab label="Tooltips"/>
                                <Tab label="Arc Settings"/>
                                <Tab label="Pointers"/>
                            </Tabs>
                        </Box>

                        <Box>
                            {activeAdvancedSubtab === 0 && (
                                <>
                                    <Typography variant="subtitle1" color="white">Tooltip Labels</Typography>
                                    <Stack spacing={3} direction="column">
                                        <Stack direction={'row'} justifyContent="space-between" alignItems="center"
                                               sx={{width: '100%', margin: '8px'}}>
                                            <InputLabel style={{color: '#fff'}}>Tile-tooltip</InputLabel>
                                            <FilledInput
                                                aria-label={'Tile-tooltip'}
                                                color="primary"
                                                value={tileTooltipLabel}
                                                type={'string'}
                                                style={{textAlign: 'right', width: '300px', color: 'white'}}
                                                sx={{
                                                    borderColor: '#1976d2',
                                                    '&.Mui-focused': {
                                                        borderColor: '#1976d2'
                                                    }
                                                }}
                                                onChange={(e) => setTileToolTipLabel(e.target.value)}
                                            />
                                        </Stack>

                                        <Stack direction={'row'} justifyContent="space-between" alignItems="center"
                                               sx={{width: '100%', margin: '8px'}}>
                                            <InputLabel style={{color: '#fff'}}>Primary-tooltip</InputLabel>
                                            <FilledInput
                                                color="primary"
                                                value={primaryTooltipLabel}
                                                type={'string'}
                                                style={{textAlign: 'right', width: '300px', color: 'white'}}
                                                sx={{
                                                    borderColor: '#1976d2',
                                                    '&.Mui-focused': {
                                                        borderColor: '#1976d2'
                                                    }
                                                }}
                                                onChange={(e) => setPrimaryToolTipLabel(e.target.value)}
                                            />
                                        </Stack>

                                        <Stack direction={'row'} justifyContent="space-between" alignItems="center"
                                               sx={{width: '100%', margin: '8px'}}>
                                            <InputLabel style={{color: '#fff'}}>Secondary-tooltip</InputLabel>
                                            <FilledInput
                                                color="primary"
                                                value={secondaryTooltipLabel}
                                                type={'string'}
                                                style={{textAlign: 'right', width: '300px', color: 'white'}}
                                                sx={{
                                                    borderColor: '#1976d2',
                                                    '&.Mui-focused': {
                                                        borderColor: '#1976d2'
                                                    }
                                                }}
                                                onChange={(e) => setSecondaryToolTipLabel(e.target.value)}
                                            />
                                        </Stack>
                                    </Stack>
                                </>
                            )}

                            {activeAdvancedSubtab === 1 && (
                                <Stack spacing={3} direction="column">
                                    {otherSettings.map(({label, value, onChange}, index) => {
                                        let render = <></>
                                        if (label === 'TickEveryNthStep:') {
                                            render =
                                                <Stack key={index} direction="row" justifyContent="space-between"
                                                       alignItems="center" sx={{margin: '8px'}}>
                                                    <InputLabel style={{color: '#fff'}}>{label}</InputLabel>
                                                    <FilledInput
                                                        color="primary"
                                                        value={value}
                                                        type={'number'}
                                                        style={{textAlign: 'right', width: '100px', color: 'white'}}
                                                        sx={{
                                                            borderColor: '#1976d2',
                                                            '&.Mui-focused': {
                                                                borderColor: '#1976d2'
                                                            }
                                                        }}
                                                        onChange={(e) => (Number(e.target.value) < 0 ? onChange(0) : onChange(Number(e.target.value)))}
                                                    />
                                                    <Tooltip
                                                        title={'If 0 it calculates the ticks along the tile amount'}>
                                                        <InfoOutlinedIcon color="primary"/>
                                                    </Tooltip>
                                                </Stack>
                                        } else {
                                            render =
                                                <Stack key={index} direction="row" justifyContent="space-between"
                                                       alignItems="center" sx={{margin: '8px'}}>
                                                    <InputLabel style={{color: '#fff'}}>{label}</InputLabel>
                                                    <FilledInput
                                                        color="primary"
                                                        value={value}
                                                        type={'number'}
                                                        style={{textAlign: 'right', width: '100px', color: 'white'}}
                                                        sx={{
                                                            borderColor: '#1976d2',
                                                            '&.Mui-focused': {
                                                                borderColor: '#1976d2'
                                                            }
                                                        }}
                                                        onChange={(e) => (Number(e.target.value) < 0 ? onChange(0) : onChange(Number(e.target.value)))}
                                                    />
                                                </Stack>
                                        }
                                        return render
                                    })}
                                </Stack>
                            )}

                            {activeAdvancedSubtab === 2 && (
                                <Stack spacing={3} direction={isMobile ? "column" : "row"} flexWrap="wrap">
                                    {numberSettings.slice(5).map(({label, value, onChange, type}, index) => (
                                        <Stack key={index} direction="row" justifyContent="space-between"
                                               alignItems="center"
                                               sx={{minWidth: '200px', flex: '1 0 auto', margin: '8px'}}>
                                            <InputLabel style={{color: '#fff'}}>{label}</InputLabel>
                                            <FilledInput
                                                color="primary"
                                                value={value}
                                                type={type}
                                                style={{textAlign: 'right', width: '100px', color: 'white'}}
                                                sx={{
                                                    borderColor: '#1976d2',
                                                    '&.Mui-focused': {
                                                        borderColor: '#1976d2'
                                                    }
                                                }}
                                                onChange={(e) => (Number(e.target.value) < 0 ? onChange(0) : onChange(Number(e.target.value)))}
                                            />
                                        </Stack>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    </Stack>
                );
            default:
                return null;
        }
    };

    return (
        <div className="app-container">
            <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 4,
                width: '100%',
                maxWidth: '1280px',
                margin: '0 auto'
            }}>
                <Box sx={{
                    flex: isMobile ? 'none' : '1 0 50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 2,
                    order: isMobile ? 1 : 0
                }}>
                    <Gauge
                        width={isMobile ? Math.min(600, window.innerWidth - 40) : 800}
                        primary={bookedValue}
                        secondary={plannedValue}
                        unit={formatValue}
                        unitTickFormatter={(value: number) => formatToolTipValue(selectedFormatter, value)}
                        options={{
                            thresholdYellow: thresholdYellowValue,
                            thresholdRed: thresholdRedValue,
                            withOpacitySwitch: withOpacitySwitchValue,
                            enableToolTip: enableToolTipValue,
                            enableUnitTicks: enableUnitTicksValue,
                            circleScale,
                            enableInnerArc: true,
                            tickColor: tickColor,
                            tickLabelColor: tickLabelColor,
                            tickFontsize: tickFontSize + 'rem',
                            tickRadiusScale: tickRadiusScale,
                        }}
                        tileArc={{
                            arcConfig: {
                                cornerRadius: outerArcCornerRadius,
                                padRadius: outerArcPadRadius,
                                padAngle: outerArcPadAngle
                            },
                            gradientType: selectedGradientType,
                            tiles: tilesValue,
                            tickEveryNThStep: tickEveryNthStep,
                            isTileColorGradient: tilesIsGradient,
                            colorTileBg: colorTileBgValue,
                            colorTileThresholdDefault: colorTileThresholdDefaultValue,
                            colorTileThresholdYellow: colorTileThresholdYellowValue,
                            colorTileThresholdRed: colorTileThresholdRedValue,
                            fillStyle: tileFillStyle,
                            borderColor: tileBorderColor,
                            borderThickness: tileBorderThickness,
                            toolTipLabel: tileTooltipLabel,
                        }}
                        primaryArcConfig={{
                            arcConfig: {
                                cornerRadius: primaryArcCornerRadius,
                                padRadius: primaryArcPadRadius,
                                padAngle: primaryArcPadAngle
                            },
                            pointerPrimaryConfig: {
                                color: pointerPlannedColor,
                                scale: pointerPlannedScale,
                                strokeScale: pointerPlannedStrokeScale
                            },
                            colorPrimaryBar: colorBookedBarValue,
                            toolTipLabel: primaryTooltipLabel
                        }}
                        secondaryArcConfig={{
                            arcConfig: {
                                cornerRadius: secondaryArcCornerRadius,
                                padRadius: secondaryArcPadRadius,
                                padAngle: secondaryArcPadAngle
                            },
                            pointerSumConfig: {
                                color: pointerBookedColor,
                                strokeScale: pointerBookedStrokeScale,
                                scale: pointerBookedScale
                            },
                            colorSecondaryBar: colorPlannedBarValue,
                            toolTipLabel: secondaryTooltipLabel
                        }}
                    />
                </Box>

                <Paper
                    elevation={1}
                    sx={{
                        flex: isMobile ? 'none' : '1 0 50%',
                        backgroundColor: 'rgba(30, 30, 30, 0.9)',
                        borderRadius: 2,
                        order: isMobile ? 0 : 1
                    }}
                >
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            textColor="primary"
                            indicatorColor="primary"
                            sx={{
                                '& .MuiTab-root': {
                                    color: 'white',  // Unselected tab text color
                                },
                                '& .Mui-selected': {
                                    color: 'primary.main',  // Selected tab text color
                                }
                            }}
                        >
                            <Tab label="Basic"/>
                            <Tab label="Appearance"/>
                            <Tab label="Advanced"/>
                        </Tabs>
                    </Box>
                    <Box sx={{p: 3}}>
                        {renderSettings()}
                    </Box>
                </Paper>
            </Box>
        </div>
    );
}

export default App;