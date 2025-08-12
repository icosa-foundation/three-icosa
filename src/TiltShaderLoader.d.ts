export class TiltShaderLoader extends THREE.Loader<any, string> {
    constructor(manager: any);
    loadedMaterials: {};
    load(brushName: any, onLoad: any, onProgress: any, onError: any): Promise<void>;
    parse(rawMaterial: any): any;
    lookupMaterial(nameOrGuid: any): any;
    lookupMaterialName(nameOrGuid: any): "Light" | "BlocksBasic" | "BlocksGem" | "BlocksGlass" | "Bubbles" | "CelVinyl" | "ChromaticWave" | "CoarseBristles" | "Comet" | "DiamondHull" | "Disco" | "DotMarker" | "Dots" | "DoubleTaperedFlat" | "DoubleTaperedMarker" | "DuctTape" | "Electricity" | "Embers" | "EnvironmentDiffuse" | "EnvironmentDiffuseLightMap" | "Fire" | "Flat" | "Highlighter" | "Hypercolor" | "HyperGrid" | "Icing" | "Ink" | "Leaves" | "LightWire" | "Lofted" | "Marker" | "MatteHull" | "NeonPulse" | "OilPaint" | "Paper" | "PbrTemplate" | "PbrTransparentTemplate" | "Petal" | "Plasma" | "Rainbow" | "ShinyHull" | "Smoke" | "Snow" | "SoftHighlighter" | "Spikes" | "Splatter" | "Stars" | "Streamers" | "Taffy" | "TaperedFlat" | "TaperedMarker_Flat" | "ThickPaint" | "Toon" | "UnlitHull" | "VelvetInk" | "Waveform" | "WetPaint" | "WigglyGraphite" | "Wire" | undefined;
}
import * as THREE from 'three';
