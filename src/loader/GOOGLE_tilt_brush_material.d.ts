import * as THREE from 'three';
import { TiltShaderLoader } from '../TiltShaderLoader.js';

export class GLTFGoogleTiltBrushMaterialExtension {
    constructor(
        parser: any,
        brushPath: string,
        isLegacy?: boolean
    );
    name: string;
    parser: any;
    brushPath: any;
    isLegacy: boolean;
    tiltShaderLoader: TiltShaderLoader;
    clock: THREE.Clock;
    beforeRoot(): null | undefined;
    afterRoot(glTF: any): Promise<any[]> | null;
    replaceMaterial(mesh: any, guid: any): Promise<void>;
}
