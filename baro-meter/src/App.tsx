import './App.css'
import GaugeChart from "./GaugeChart";


function App() {

    const planned = 10;
    const booked = 50;
    const sum = booked + planned;

    return (
        <div className="gauge-chart">
            <GaugeChart
                maxValue={sum}
                schwellenwertRot={60}
                schwellenwertGelb={50}
                gebucht={booked}
                geplant={planned}
            />
        </div>
    );

}

export default App
