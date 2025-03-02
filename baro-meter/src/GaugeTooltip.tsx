const GaugeTooltip = ({text, x, y}: { text: Array<{ label: string, value: string, color: string }>; x: number; y: number }) => {

    return (<div
        style={{
            position: 'absolute',
            left: x + 10, // Versatz vom Mauszeiger
            top: y + 10,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: '.5rem .5rem',
            minWidth: '7rem',
            borderRadius: '.5rem',
            fontSize: '1rem',
            pointerEvents: 'none', // Verhindert, dass der Tooltip die Mausinteraktion blockiert
        }}
    >
        {/* Rendere jede Zeile als separates <div> */}
        {text.map((item, index) => (
            <div key={index} style={{
                borderBottom: text.length > 1 ? '1px dashed ' + '#fff' : '',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <span style={{textAlign: 'start', paddingRight: 10}}>{item.label} ___ {item.color}</span>
                <span style={{textAlign: 'end'}}>{item.value}</span>
            </div>
        ))}
    </div>)
}

export default GaugeTooltip;
