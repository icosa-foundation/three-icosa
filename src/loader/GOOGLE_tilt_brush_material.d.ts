import { Object3D } from 'three';
import { GLTFLoaderPlugin, GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader';

export declare class GLTFGoogleTiltBrushMaterialExtension implements GLTFLoaderPlugin {
    constructor(parser: GLTFParser, brushPath: string);
    beforeRoot(): Promise<void> | null;
    afterRoot(glTF: Object): Promise<void> | null;
    replaceMaterial(mesh: Object3D, guid: string): void;
}
