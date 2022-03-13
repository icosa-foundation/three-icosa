import { 
    Clock,
    Loader,
    LoadingManager,
    RawShaderMaterial,
    ShaderMaterialParameters
} from "three";
import { GLTFParser } from "three/examples/jsm/loaders/GLTFLoader";

export declare class TiltShaderLoader extends Loader {
    constructor(manager: LoadingManager);
    load(brushName: string, onLoad: (response: RawShaderMaterial) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): Promise<void>;
    parse(materialParams: ShaderMaterialParameters): RawShaderMaterial;
}

export declare class GLTFGoogleTiltBrushMaterialExtension {
    constructor(parser: GLTFParser, brushPath: string, clock: Clock);
    
}
