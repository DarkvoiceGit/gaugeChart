interface GaugeHubProps {
    radius: number;
    hubScale: number;
    hubColor: string;
    scaleDivisor: number;
}

const GaugeHub: React.FC<GaugeHubProps> = ({hubScale, hubColor, scaleDivisor, radius})=>(
    <circle
        cx={0}
        cy={0}
        r={radius * (hubScale / scaleDivisor)}
        fill={hubColor}
        />
)

export default GaugeHub;