import './App.css'
import GaugeChart from "./GaugeChart";


function App() {

    const planned = 5;
    const booked = 40;
    const sum = booked + planned;

    return (
        <div className="gauge-chart">
            <GaugeChart
                booked = {booked}
                planned = {planned}
                value={sum}
                height={800}
                width={600}
                max={100}
                min={0}
            />
        </div>
    );

}

export default App
