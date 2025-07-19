const GaugeTooltip = ({
                          text,
                          x,
                          y,
                          fontColor = '#fff',
                          bgColor = { r: 0, g: 0, b: 0, a: 0.8 },
                      }: {
    text: Array<{ label: string; value: string; color: string }>;
    x: number;
    y: number;
    fontColor?: string;
    bgColor?: { r: number; g: number; b: number; a: number };
}) => {
    return (
        <div
            style={{
                position: 'absolute',
                left: x + 10,
                top: y + 10,
                backgroundColor: `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})`,
                color: fontColor,
                padding: '.5rem 0.8rem',
                minWidth: '8rem',
                borderRadius: '.5rem',
                fontSize: '1rem',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
            }}
        >
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                {text.map((item, index) => (
                    <tr key={index}>
                        <td style={{ paddingRight: 10, textAlign: 'left' }}>
                            {item.label}
                        </td>
                        <td style={{ width: 16, paddingRight: 10 }}>
                            <div
                                style={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: item.color,
                                    borderRadius: '50%',
                                    border: '0.1em solid white',
                                    margin: 'auto',
                                }}
                                aria-hidden="true"
                            />
                        </td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            {item.value}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default GaugeTooltip;
