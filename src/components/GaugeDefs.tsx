import GaugePointerMarkers, {PointerMarkerSpec} from "./GaugePointerMarkers.tsx";
import {ResolvedLayer} from "../core/resolveLayers.ts";
import GaugeGradients from "./GaugeGradients.tsx";

interface GaugeDefsProps {
    pointerMarkers: PointerMarkerSpec[];
    gradientLayer?: ResolvedLayer;
    scaleMax: number;
    colorScale: d3.ScaleLinear<string, string>
}

const GaugeDefs: React.FC<GaugeDefsProps> = ({
    pointerMarkers, gradientLayer, scaleMax, colorScale
})=>(
    <>
    <GaugePointerMarkers markers={pointerMarkers} />
        {gradientLayer && (
            <GaugeGradients
                layerId={gradientLayer.id}
                tileAngles={gradientLayer.tileAngles}
                numberOfTiles={gradientLayer.segmentCount}
                thresholdRed={scaleMax}
                colorScale={colorScale}
                />
        )}
    </>
)

export default GaugeDefs;