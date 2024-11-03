export class GLTFGoogleTiltBrushTechniquesExtension {
    constructor(parser: any, brushPath: any);
    name: string;
    parser: any;
    brushPath: any;
    tiltShaderLoader: TiltShaderLoader;
    clock: Clock;
    beforeRoot(): null | undefined;
    afterRoot(glTF: any): Promise<any[]> | null;
    replaceMaterial(mesh: any, guid: any): Promise<void>;
}
import { TiltShaderLoader } from '../TiltShaderLoader.js';
import { Clock } from 'three';
