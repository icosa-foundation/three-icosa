import * as THREE from 'three';

export type TiltMaterialFactory = (
    materialParams: THREE.ShaderMaterialParameters,
    brushName: string,
) => THREE.Material;

export interface TiltShaderLoaderOptions {
    materialFactory?: TiltMaterialFactory;
}

export class TiltShaderLoader extends THREE.Loader<any, string> {
    constructor(manager?: THREE.LoadingManager, options?: TiltShaderLoaderOptions);
    materialFactory: TiltMaterialFactory;
    loadedMaterials: Record<string, THREE.Material>;
    createMaterial(
        materialParams: THREE.ShaderMaterialParameters,
        brushName: string,
    ): THREE.Material;
    load(brushName: any, onLoad: any, onProgress: any, onError: any): Promise<void>;
    parse(rawMaterial: any): any;
    lookupMaterialName(nameOrGuid: any): string | undefined;
}
