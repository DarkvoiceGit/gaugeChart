import GaugePointerMarkers, {PointerMarkerSpec} from "./GaugePointerMarkers.tsx";
import {ResolvedLayer} from "../core/resolveLayers.ts";
import GaugeGradients from "./GaugeGradients.tsx";
import {GradientType} from "../utils/constants.ts";

interface GaugeDefsProps {
    pointerMarkers: PointerMarkerSpec[];
    gradientLayer?: ResolvedLayer;
    scaleMax: number;
    colorScale: d3.ScaleLinear<string, string>
}

const GaugeDefs: React.FC<GaugeDefsProps> = ({
                                                 pointerMarkers, gradientLayer, scaleMax, colorScale
                                             }) => (
    <>
        <GaugePointerMarkers markers={pointerMarkers}/>
        {gradientLayer && gradientLayer.segmentedStyle.isTileColorGradient && gradientLayer.segmentedStyle.gradientType !== GradientType.FULL && (
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