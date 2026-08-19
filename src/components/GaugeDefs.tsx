import GaugePointerMarkers, {PointerMarkerSpec} from "./GaugePointerMarkers";
import {ResolvedLayer} from "../core/resolveLayers";
import GaugeGradients from "./GaugeGradients";
import {GradientType} from "../utils/constants";

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