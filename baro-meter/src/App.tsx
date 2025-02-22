import './App.css'
import GaugeChart from "./GaugeChart";


function App() {

    const planned = 30;
    const booked = 20;

    return (
        <div className="gauge-chart">
            <GaugeChart
                booked = {booked}
                planned = {planned}
                height={800}
                width={600}
                thresholdYellow={60}
                thresholdRed={80}
                withOpacitySwitch={true}
                colorTileThresholdRed={'#ff0000'}
                colorTileThresholdYellow={'#ffff00'}
                colorTileThresholdDefault={'#00ff00'}
                colorTileBg={'#ddd'}
                colorBookedBar={'#000'}
                colorPlannedBar={'#ccc'}
                enableToolTip={true}
                enableUnitTicks={true}
                // bigArrowConfig={}
                // smallArrowwConfig={}
            />
        </div>
    );

}

export default App
