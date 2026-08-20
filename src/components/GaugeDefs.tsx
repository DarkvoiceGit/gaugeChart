import GaugePointerMarkers, {PointerMarkerSpec} from "./GaugePointerMarkers";
import {ResolvedLayer} from "../core/resolveLayers";
import GaugeGradients from "./GaugeGradients";
import {GradientType} from "../utils/constants";

interface GaugeDefsProps {
    pointerMarkers: PointerMarkerSpec[];
    gradientLayers: ResolvedLayer[];
    scaleMax: number;
    colorScale: d3.ScaleLinear<string, string>
}

const GaugeDefs: React.FC<GaugeDefsProps> = ({
                                                 pointerMarkers, gradientLayers, scaleMax, colorScale
                                             }) => (
    <>
        <GaugePointerMarkers markers={pointerMarkers}/>

        {gradientLayers.map((gradientLayer) => (
                gradientLayer.segmentedStyle.isTileColorGradient && gradientLayer.segmentedStyle.gradientType !== GradientType.FULL && (
                    <GaugeGradients
                        key={gradientLayer.id}
                        layerId={gradientLayer.id}
                        tileAngles={gradientLayer.tileAngles}
                        numberOfTiles={gradientLayer.segmentCount}
                        thresholdRed={scaleMax}
                        colorScale={colorScale}
                    />
                )
            )
        )}
    </>
)

export default GaugeDefs;