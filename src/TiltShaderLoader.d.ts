export class TiltShaderLoader extends THREE.Loader<any, string> {
    constructor(manager: any);
    loadedMaterials: {};
    load(brushName: any, onLoad: any, onProgress: any, onError: any): Promise<void>;
    parse(rawMaterial: any): any;
    lookupMaterial(nameOrGuid: any): any;
    lookupMaterialName(nameOrGuid: any): string | undefined;
}
import * as THREE from 'three';
