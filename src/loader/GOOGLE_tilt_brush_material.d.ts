import { Clock, Object3D } from 'three';
import { GLTF, GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader';

export declare class GLTFGoogleTiltBrushMaterialExtension {
    constructor(parser: GLTFParser, brushPath: string, clock: Clock);
    beforeRoot(GLTF: GLTF);
    afterRoot(GLTF: GLTF);
    replaceMaterial(mesh: Object3D, guid: string);
}