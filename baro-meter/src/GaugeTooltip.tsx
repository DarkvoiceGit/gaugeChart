const GaugeTooltip = ({text, x, y}: {
    text: Array<{ label: string, value: string, color: string }>;
    x: number;
    y: number
}) => {

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
            fontSize: '1.1rem',
            pointerEvents: 'none', // Verhindert, dass der Tooltip die Mausinteraktion blockiert
        }}
    >
        {/* Rendere jede Zeile als separates <div> */}
        {text.map((item, index) => (
            <div
                key={index}
                style={{
                    borderBottom: text.length > 1 ? '1px dashed ' + '#fff' : '',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
                role="listitem" // Gibt an, dass dies ein Listenelement ist
            >
                {/* Label auf der linken Seite */}
                <span style={{textAlign: 'start', paddingRight: 10}} aria-hidden={true}>{item.label}</span>

                {/* Container für Farbe und Wert auf der rechten Seite */}
                <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
    {/* Farbkreis */}
                    <div
                        style={{
                            width: 15,
                            height: 15,
                            backgroundColor: item.color,
                            borderRadius: '50%',
                            border: '0.1em solid white',
                            flexShrink: 0,
                        }}
                        aria-hidden="true" // Versteckt den Kreis für Screenreader
                    />
                    {/* Wert mit fester Breite */}
                    <span style={{textAlign: 'end', width: 25}} aria-label={`${item.label}: ${item.value}`}>
                        {item.value}
                    </span>
              </span>
            </div>
        ))}
    </div>)
}

export default GaugeTooltip;
