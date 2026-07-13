import * as THREE from 'three';

export type TiltMaterialFactory = (
    materialParams: THREE.ShaderMaterialParameters,
    brushName: string,
) => THREE.Material;

export interface TiltTextureContext {
    brushName: string;
    uniformName: string;
    isFallback: boolean;
}

export type TiltTextureConfigurator = (
    texture: THREE.Texture,
    context: TiltTextureContext,
) => void;

export interface TiltShaderLoaderOptions {
    materialFactory?: TiltMaterialFactory;
    textureConfigurator?: TiltTextureConfigurator;
}

export class TiltShaderLoader extends THREE.Loader<any, string> {
    constructor(manager?: THREE.LoadingManager, options?: TiltShaderLoaderOptions);
    materialFactory: TiltMaterialFactory;
    textureConfigurator?: TiltTextureConfigurator;
    loadedMaterials: Record<string, THREE.Material>;
    createMaterial(
        materialParams: THREE.ShaderMaterialParameters,
        brushName: string,
    ): THREE.Material;
    configureTexture(
        texture: THREE.Texture,
        brushName: string,
        uniformName: string,
        isFallback?: boolean,
    ): THREE.Texture;
    load(brushName: any, onLoad: any, onProgress: any, onError: any): Promise<void>;
    parse(rawMaterial: any): any;
    lookupMaterialParams(materialName: string): THREE.ShaderMaterialParameters | null;
    lookupMaterialName(nameOrGuid: any): string | undefined;
}
