export class TiltShaderLoader extends THREE.Loader<any, string> {
    constructor(manager: any, options?: {});
    materialFactory: any;
    loadedMaterials: {};
    createMaterial(materialParams: any, brushName: any): any;
    loadShaderIncludes(relativePath: any): Promise<string | ArrayBuffer>;
    load(brushName: any, onLoad: any, onProgress: any, onError: any): Promise<void>;
    fogShaderCode: string | ArrayBuffer;
    surfaceShaderCode: string | ArrayBuffer;
    parse(rawMaterial: any): any;
    lookupMaterialParams(materialName: any): any;
    lookupMaterialName(nameOrGuid: any): "BlocksBasic" | "BlocksGem" | "BlocksGlass" | "Bubbles" | "CelVinyl" | "ChromaticWave" | "CoarseBristles" | "Comet" | "DiamondHull" | "Disco" | "DotMarker" | "Dots" | "DoubleTaperedFlat" | "DoubleTaperedMarker" | "DuctTape" | "Electricity" | "Embers" | "EnvironmentDiffuse" | "EnvironmentDiffuseLightMap" | "Fire" | "Flat" | "Highlighter" | "Hypercolor" | "HyperGrid" | "Icing" | "Ink" | "Leaves" | "Light" | "LightWire" | "Lofted" | "Marker" | "MatteHull" | "NeonPulse" | "OilPaint" | "Paper" | "PbrTemplate" | "PbrTransparentTemplate" | "Petal" | "Plasma" | "Rainbow" | "ShinyHull" | "Smoke" | "Snow" | "SoftHighlighter" | "Spikes" | "Splatter" | "Stars" | "Streamers" | "Taffy" | "TaperedFlat" | "TaperedMarker_Flat" | "TaperedMarker" | "ThickPaint" | "Toon" | "UnlitHull" | "VelvetInk" | "Waveform" | "WetPaint" | "WigglyGraphite" | "Wire" | "SvgTemplate" | "Gouache" | "MylarTube" | "Rain" | "DryBrush" | "LeakyPen" | "Sparks" | "Wind" | "Rising Bubbles" | "TaperedWire" | "SquarePaper" | "ThickGeometry" | "Wireframe" | "CandyCane" | "HolidayTree" | "Snowflake" | "Braid3" | "Muscle" | "Guts" | "Fire2" | "TubeToonInverted" | "FacetedTube" | "WaveformParticles" | "BubbleWand" | "DanceFloor" | "WaveformTube" | "Drafting" | "SingleSided" | "DoubleFlat" | "TubeAdditive" | "Feather" | "DuctTapeGeometry" | "TaperedHueShift" | "Lacewing" | "Marbled Rainbow" | "Charcoal" | "KeijiroTube" | "Lofted (Hue Shift)" | "Wire (Lit)" | "WaveformFFT" | "Fairy" | "Space" | "SmoothHull" | "Leaves2" | "InkGeometry" | "ConcaveHull" | "3D Printing Brush" | "PassthroughHull" | "QuillCube" | "QuillCylinder" | "QuillEllipse" | "QuillRibbon";
}
import * as THREE from 'three';
