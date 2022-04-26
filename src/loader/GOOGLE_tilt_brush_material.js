// Copyright 2021-2022 Icosa Gallery
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
    Vector4,
    Clock
} from 'three';

import { TiltShaderLoader } from '../TiltShaderLoader.js';

export class GLTFGoogleTiltBrushMaterialExtension {

    constructor(parser, brushPath) {
        this.name = "GOOGLE_tilt_brush_material";
        this.parser = parser;
        this.brushPath = brushPath;

        // Quick repair of path if required
        if (this.brushPath.slice(this.brushPath.length - 1) !== "/") {
            this.brushPath += "/";
        }

        this.tiltShaderLoader = new TiltShaderLoader(parser.options.manager);
        this.tiltShaderLoader.setPath(brushPath);
        this.clock = new Clock();
    }

    beforeRoot() {
        const parser = this.parser;
        const json = parser.json;
        if (!json.extensionsUsed || !json.extensionsUsed.includes(this.name)) {
            return null;
        }

        json.materials.forEach(material => {
            const extensionsDef = material.extensions;

            if (!extensionsDef || !extensionsDef[this.name]) {
                return;
            }

            const guid = material.extensions.GOOGLE_tilt_brush_material.guid;
            const materialParams = this.tiltShaderLoader.lookupMaterial(guid);

            //MainTex
            if(material?.pbrMetallicRoughness?.baseColorTexture) {
                const mainTex = json.images[material.pbrMetallicRoughness.baseColorTexture.index];
                mainTex.uri = this.brushPath + materialParams.uniforms.u_MainTex.value;
            }

            //BumpMap
            if(material?.normalTexture) {
                const bumpMap = json.images[material.normalTexture.index];
                bumpMap.uri = this.brushPath + materialParams.uniforms.u_BumpMap.value;
            }
        });
    }

    afterRoot(glTF) {
        const parser = this.parser;
        const json = parser.json;

        if (!json.extensionsUsed || !json.extensionsUsed.includes(this.name)) {
            return null;
        }

        const shaderResolves = [];

        //const extensionDef = json.exensions[this.name];
        for(const scene of glTF.scenes) {
            scene.traverse(async object => {
                const association = parser.associations.get(object);

                if (association === undefined || association.meshes === undefined) {
                    return;
                }

                const mesh = json.meshes[association.meshes];
                mesh.primitives.forEach((prim) => {
                    if(!prim.material) {
                        return;
                    }

                    const mat = json.materials[prim.material];
                    if (!mat.extensions || !mat.extensions[this.name]) {
                        return;
                    }
                    
                    const guid = mat.extensions.GOOGLE_tilt_brush_material.guid;
                    
                    shaderResolves.push(this.replaceMaterial(object, guid));
                });
            });
        }

        return Promise.all(shaderResolves);
    }

    async replaceMaterial(mesh, guid) {
        let shader;

        switch(guid) {
            case "0e87b49c-6546-3a34-3a44-8a556d7d6c3e":
                mesh.geometry.name = "geometry_BlocksBasic";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                //mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("BlocksBasic");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_BlocksBasic";
                break;
            case "232998f8-d357-47a2-993a-53415df9be10":
                mesh.geometry.name = "geometry_BlocksGem";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                //mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("BlocksGem");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_BlocksGem";
                break;
            case "3d813d82-5839-4450-8ddc-8e889ecd96c7":
                mesh.geometry.name = "geometry_BlocksGlass";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                //mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("BlocksGlass");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_BlocksGlass";
                break;

            case "89d104cd-d012-426b-b5b3-bbaee63ac43c":
                mesh.geometry.name = "geometry_Bubbles";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("_tb_unity_normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("Bubbles");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Bubbles";
                break;

            case "700f3aa8-9a7c-2384-8b8a-ea028905dd8c":
                mesh.geometry.name = "geometry_CelVinyl";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("CelVinyl");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_CelVinyl";
                break;

            case "0f0ff7b2-a677-45eb-a7d6-0cd7206f4816":
                mesh.geometry.name = "geometry_ChromaticWave";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("ChromaticWave");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_ChromaticWave";
                break;

            case "1161af82-50cf-47db-9706-0c3576d43c43":
            case "79168f10-6961-464a-8be1-57ed364c5600":
                mesh.geometry.name = "geometry_CoarseBristles";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("CoarseBristles");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_CoarseBristles";
                break;

            case "1caa6d7d-f015-3f54-3a4b-8b5354d39f81":
                mesh.geometry.name = "geometry_Comet";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Comet");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Comet";
                break;

            case "c8313697-2563-47fc-832e-290f4c04b901":
                mesh.geometry.name = "geometry_DiamondHull";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("DiamondHull");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_DiamondHull";
                break;

            case "4391aaaa-df73-4396-9e33-31e4e4930b27":
                mesh.geometry.name = "geometry_Disco";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Disco");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Disco";
                break;

            case "d1d991f2-e7a0-4cf1-b328-f57e915e6260":
                mesh.geometry.name = "geometry_DotMarker";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("DotMarker");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_DotMarker";
                break;

            case "6a1cf9f9-032c-45ec-9b1d-a6680bee30f7":
                mesh.geometry.name = "geometry_Dots";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("_tb_unity_normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("Dots");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Dots";
                break;

            case "0d3889f3-3ede-470c-8af4-f44813306126":
                mesh.geometry.name = "geometry_DoubleTaperedFlat";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("DoubleTaperedFlat");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_DoubleTaperedFlat";
                break;

            case "0d3889f3-3ede-470c-8af4-de4813306126":
                mesh.geometry.name = "geometry_DoubleTaperedMarker";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("DoubleTaperedMarker");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_DoubleTaperedMarker";
                break;

            case "d0262945-853c-4481-9cbd-88586bed93cb":
            case "3ca16e2f-bdcd-4da2-8631-dcef342f40f1":
                mesh.geometry.name = "geometry_DuctTape";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("DuctTape");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_DuctTape";
                break;

            case "f6e85de3-6dcc-4e7f-87fd-cee8c3d25d51":
                mesh.geometry.name = "geometry_Electricity";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("Electricity");
                mesh.material = shader;
                mesh.material.name = "material_Electricity";
                break;

            case "02ffb866-7fb2-4d15-b761-1012cefb1360":
                mesh.geometry.name = "geometry_Embers";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("_tb_unity_normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("Embers");
                mesh.material = shader;
                mesh.material.name = "material_Embers";
                break;

            case "0ad58bbd-42bc-484e-ad9a-b61036ff4ce7":
                mesh.geometry.name = "geometry_EnvironmentDiffuse";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("EnvironmentDiffuse");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_EnvironmentDiffuse";
                break;

            case "d01d9d6c-9a61-4aba-8146-5891fafb013b":
                mesh.geometry.name = "geometry_EnvironmentDiffuseLightMap";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("EnvironmentDiffuseLightMap");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_EnvironmentDiffuseLightMap";
                break;

            case "cb92b597-94ca-4255-b017-0e3f42f12f9e":
                mesh.geometry.name = "geometry_Fire";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Fire");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Fire";
                break;

            case "2d35bcf0-e4d8-452c-97b1-3311be063130":
            case "280c0a7a-aad8-416c-a7d2-df63d129ca70":
            case "55303bc4-c749-4a72-98d9-d23e68e76e18":
                mesh.geometry.name = "geometry_Flat";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Flat");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Flat";
                break;

            case "cf019139-d41c-4eb0-a1d0-5cf54b0a42f3":
                mesh.geometry.name = "geometry_Highlighter";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Highlighter");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Highlighter";
                break;

            case "dce872c2-7b49-4684-b59b-c45387949c5c":
            case "e8ef32b1-baa8-460a-9c2c-9cf8506794f5":
                mesh.geometry.name = "geometry_Hypercolor";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Hypercolor");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Hypercolor";
                break;

            case "6a1cf9f9-032c-45ec-9b6e-a6680bee32e9":
                mesh.geometry.name = "geometry_HyperGrid";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("HyperGrid");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_HyperGrid";
                break;

            case "2f212815-f4d3-c1a4-681a-feeaf9c6dc37":
                mesh.geometry.name = "geometry_Icing";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));

                shader = await this.tiltShaderLoader.loadAsync("Icing");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Icing";
                break;

            case "f5c336cf-5108-4b40-ade9-c687504385ab":
            case "c0012095-3ffd-4040-8ee1-fc180d346eaa":
                mesh.geometry.name = "geometry_Ink";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Ink");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Ink";
                break;

            case "4a76a27a-44d8-4bfe-9a8c-713749a499b0":
            case "ea19de07-d0c0-4484-9198-18489a3c1487":
                mesh.geometry.name = "geometry_Leaves";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Leaves");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Leaves";
                break;

            case "2241cd32-8ba2-48a5-9ee7-2caef7e9ed62":
                mesh.geometry.name = "geometry_Light";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Light");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Light";
                break;

            case "4391aaaa-df81-4396-9e33-31e4e4930b27":
                mesh.geometry.name = "geometry_LightWire";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("LightWire");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_LightWire";
                break;

            case "d381e0f5-3def-4a0d-8853-31e9200bcbda":
                mesh.geometry.name = "geometry_Lofted";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Lofted");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Lofted";
                break;

            case "429ed64a-4e97-4466-84d3-145a861ef684":
                mesh.geometry.name = "geometry_Marker";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Marker");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Marker";
                break;

            case "79348357-432d-4746-8e29-0e25c112e3aa":
                mesh.geometry.name = "geometry_MatteHull";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                shader = await this.tiltShaderLoader.loadAsync("MatteHull");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_MatteHull";
                break;

            case "b2ffef01-eaaa-4ab5-aa64-95a2c4f5dbc6":
                mesh.geometry.name = "geometry_NeonPulse";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("NeonPulse");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_NeonPulse";
                break;

            case "f72ec0e7-a844-4e38-82e3-140c44772699":
            case "c515dad7-4393-4681-81ad-162ef052241b":
                mesh.geometry.name = "geometry_OilPaint";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("OilPaint");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_OilPaint";
                break;

            case "f1114e2e-eb8d-4fde-915a-6e653b54e9f5":
            case "759f1ebd-20cd-4720-8d41-234e0da63716":
                mesh.geometry.name = "geometry_Paper";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Paper");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Paper";
                break;

            case "f86a096c-2f4f-4f9d-ae19-81b99f2944e0":
                mesh.geometry.name = "geometry_PbrTemplate";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("PbrTemplate");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_PbrTemplate";
                break;

            case "19826f62-42ac-4a9e-8b77-4231fbd0cfbf":
                mesh.geometry.name = "geometry_PbrTransparentTemplate";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("PbrTransparentTemplate");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_PbrTransparentTemplate";
                break;

            case "e0abbc80-0f80-e854-4970-8924a0863dcc":
                mesh.geometry.name = "geometry_Petal";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Petal");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Petal";
                break;

            case "c33714d1-b2f9-412e-bd50-1884c9d46336":
                mesh.geometry.name = "geometry_Plasma";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Plasma");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Plasma";
                break;

            case "ad1ad437-76e2-450d-a23a-e17f8310b960":
                mesh.geometry.name = "geometry_Rainbow";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Rainbow");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Rainbow";
                break;

            case "faaa4d44-fcfb-4177-96be-753ac0421ba3":
                mesh.geometry.name = "geometry_ShinyHull";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("ShinyHull");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_ShinyHull";
                break;

            case "70d79cca-b159-4f35-990c-f02193947fe8":
                mesh.geometry.name = "geometry_Smoke";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("_tb_unity_normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("Smoke");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Smoke";
                break;

            case "d902ed8b-d0d1-476c-a8de-878a79e3a34c":
                mesh.geometry.name = "geometry_Snow";
                
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("_tb_unity_normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("Snow");
                mesh.material = shader;
                mesh.material.name = "material_Snow";
                break;

            case "accb32f5-4509-454f-93f8-1df3fd31df1b":
                mesh.geometry.name = "geometry_SoftHighlighter";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("SoftHighlighter");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_SoftHighlighter";
                break;

            case "cf7f0059-7aeb-53a4-2b67-c83d863a9ffa":
                mesh.geometry.name = "geometry_Spikes";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Spikes");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Spikes";
                break;

            case "8dc4a70c-d558-4efd-a5ed-d4e860f40dc3":
            case "7a1c8107-50c5-4b70-9a39-421576d6617e":
                mesh.geometry.name = "geometry_Splatter";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Splatter");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Splatter";
                break;

            case "0eb4db27-3f82-408d-b5a1-19ebd7d5b711":
                mesh.geometry.name = "geometry_Stars";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("_tb_unity_normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("Stars");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Stars";
                break;

            case "44bb800a-fbc3-4592-8426-94ecb05ddec3":
                mesh.geometry.name = "geometry_Streamers";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Streamers");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Streamers";
                break;

            case "0077f88c-d93a-42f3-b59b-b31c50cdb414":
                mesh.geometry.name = "geometry_Taffy";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Taffy");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Taffy";
                break;

            case "b468c1fb-f254-41ed-8ec9-57030bc5660c":
            case "c8ccb53d-ae13-45ef-8afb-b730d81394eb":
                mesh.geometry.name = "geometry_TaperedFlat";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("TaperedFlat");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_TaperedFlat";
                break;

            case "d90c6ad8-af0f-4b54-b422-e0f92abe1b3c":
            case "1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0":
                mesh.geometry.name = "geometry_TaperedMarker";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("TaperedMarker");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_TaperedMarker";
                break;

            case "75b32cf0-fdd6-4d89-a64b-e2a00b247b0f":
            case "fdf0326a-c0d1-4fed-b101-9db0ff6d071f":
                mesh.geometry.name = "geometry_ThickPaint";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("ThickPaint");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_ThickPaint";
                break;

            case "4391385a-df73-4396-9e33-31e4e4930b27":
                mesh.geometry.name = "geometry_Toon";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                shader = await this.tiltShaderLoader.loadAsync("Toon");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Toon";
                break;

            case "a8fea537-da7c-4d4b-817f-24f074725d6d":
                mesh.geometry.name = "geometry_UnlitHull";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                shader = await this.tiltShaderLoader.loadAsync("UnlitHull");
                mesh.material = shader;
                mesh.material.name = "material_UnlitHull";
                break;

            case "d229d335-c334-495a-a801-660ac8a87360":
                mesh.geometry.name = "geometry_VelvetInk";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("VelvetInk");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_VelvetInk";
                break;

            case "10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab":
                mesh.geometry.name = "geometry_Waveform";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Waveform");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Waveform";
                break;

            case "b67c0e81-ce6d-40a8-aeb0-ef036b081aa3":
            case "dea67637-cd1a-27e4-c9b1-52f4bbcb84e5":
                mesh.geometry.name = "geometry_WetPaint";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("WetPaint");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_WetPaint";
                break;

            case "5347acf0-a8e2-47b6-8346-30c70719d763":
            case "e814fef1-97fd-7194-4a2f-50c2bb918be2":
                mesh.geometry.name = "geometry_WigglyGraphite";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("WigglyGraphite");
                shader.lights = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_WigglyGraphite";
                break;

            case "4391385a-cf83-4396-9e33-31e4e4930b27":
                mesh.geometry.name = "geometry_Wire";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                shader = await this.tiltShaderLoader.loadAsync("Wire");
                mesh.material = shader;
                mesh.material.name = "material_Wire";
                break;
            default:
                console.warn(`Could not find brush with guid ${guid}!`);
        }
        
        mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
            if (material.uniforms["u_time"]) {
                const elapsedTime = this.clock.getElapsedTime();
                // _Time from https://docs.unity3d.com/Manual/SL-UnityShaderVariables.html
                const time = new Vector4(elapsedTime/20, elapsedTime, elapsedTime*2, elapsedTime*3);

                material.uniforms["u_time"].value = time;
            }

            if (material.uniforms["cameraPosition"]) {
                material.uniforms["cameraPosition"].value = camera.position;
            }

            if(material?.uniforms?.directionalLights?.value) {
                // Main Light
                if(material.uniforms.directionalLights.value[0]) {
                    
                    // Color
                    if(material.uniforms.u_SceneLight_0_color) {
                        const color = material.uniforms.directionalLights.value[0].color;
                        material.uniforms.u_SceneLight_0_color.value = new Vector4(color.r, color.g, color.b, 1);
                    }
                }

                // Shadow Light
                if(material.uniforms.directionalLights.value[1]) {
    
                    // Color
                    if(material.uniforms.u_SceneLight_1_color) {
                        const color = material.uniforms.directionalLights.value[1].color;
                        material.uniforms.u_SceneLight_1_color.value = new Vector4(color.r, color.g, color.b, 1);
                    }
                }
            }

            // Ambient Light
            // if(material?.uniforms?.ambientLightColor?.value) {
            //     if(material.uniforms.u_ambient_light_color) {
            //         const colorArray = material.uniforms.ambientLightColor.value;
            //         material.uniforms.u_ambient_light_color.value = new Vector4(colorArray[0], colorArray[1], colorArray[2], 1);
            //     }
            // }
        };
    }
}
