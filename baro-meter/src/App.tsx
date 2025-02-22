import './App.css'
import GaugeChart from "./GaugeChart";


function App() {

    const planned = 15;
    const booked = 65;

    return (
        <div className="gauge-chart">
            <GaugeChart
                booked = {booked}
                planned = {planned}
                height={800}
                width={600}
                thresholdYellow={75}
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
                // bigArrowConfig={}
                // smallArrowwConfig={}
            />
        </div>
    );

}

export default App
