import './App.css'
import GaugeChart from "./GaugeChart";


function App() {

    const planned = 10;
    const booked = 5;

    return (
        <div className="gauge-chart">
            <GaugeChart
                booked = {booked}
                planned = {planned}
                height={1080}
                width={960}
                thresholdYellow={60}
                thresholdRed={80}
                withOpacitySwitch={true}
                colorTileThresholdRed={'#ff0c4d'}
                colorTileThresholdYellow={'#ffff00'}
                colorTileThresholdDefault={'#00ff00'}
                colorTileBg={'#ddd'}
                colorBookedBar={'#000000'}
                colorPlannedBar={'#aaaaaa'}
                enableToolTip={true}
                enableUnitTicks={true}
                tiles={10}
                // bigArrowConfig={}
                // smallArrowwConfig={}
            />
        </div>
    );

}

export default App
