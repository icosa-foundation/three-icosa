export class GLTFGoogleTiltBrushMaterialExtension {
    constructor(parser: any, brushPath: any);
    name: string;
    altName: string;
    parser: any;
    brushPath: any;
    tiltShaderLoader: TiltShaderLoader;
    clock: THREE.Clock;
    beforeRoot(): void;
    afterRoot(glTF: any): Promise<any[]>;
    tryReplaceBlocksName(originalName: any): string;
    isTiltGltf(json: any): boolean;
    replaceMaterial(mesh: any, guidOrName: any): Promise<void>;
}
import { TiltShaderLoader } from '../TiltShaderLoader.js';
import * as THREE from 'three';
