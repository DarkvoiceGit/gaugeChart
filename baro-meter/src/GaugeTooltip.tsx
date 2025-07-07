const GaugeTooltip = ({
                          text,
                          x,
                          y,
                          fontColor = '#fff',
                          bgColor = {
                              r: 0, g: 0, b: 0, a: 0.8
                          }
                      }: {
    text: Array<{ label: string, value: string, color: string }>;
    x: number;
    y: number;
    fontColor?: string;
    bgColor?: {
        r: number,
        g: number,
        b: number,
        a: number
    }
}) => {

    return (<div
        style={{
            position: 'absolute',
            left: x + 10, // Versatz vom Mauszeiger
            top: y + 10,
            backgroundColor: `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})`,
            color: `${fontColor}`,
            padding: '.5rem 0.8rem',
            minWidth: '8rem',
            borderRadius: '.5rem',
            fontSize: '1rem',
            pointerEvents: 'none', // Verhindert, dass der Tooltip die Mausinteraktion blockiert
        }}
    >
        {/* Rendere jede Zeile als separates <div> */}
        {text.map((item, index) => (
            <div
                key={index}
                style={{
                    borderBottom: text.length > 1 ? '1px solid grey' :'',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
                role="listitem" // Gibt an, dass dies ein Listenelement ist
            >
                {/* Label auf der linken Seite */}
                <span style={{textAlign: 'start', paddingRight: 15, display:  'block', flex: 'auto'}} aria-hidden={true}>{item.label}</span>
                {/* Container für Farbe und Wert auf der rechten Seite */}
                <span style={{display: 'flex', alignItems: 'center', gap: 15}}>
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
                    <span style={{textAlign: 'end', minWidth: 25}} aria-label={`${item.label}: ${item.value}`}>
                        {item.value}
                    </span>
              </span>
            </div>
        ))}
    </div>)
}

export default GaugeTooltip;
