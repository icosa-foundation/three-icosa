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
    BufferAttribute,
    Clock,
    Vector4
} from 'three';

import { TiltShaderLoader } from '../TiltShaderLoader.js';

export class GLTFGoogleTiltBrushMaterialExtension {

    constructor(parser, brushPath) {
        this.name = "GOOGLE_tilt_brush_material";
        this.altName = "GOOGLE_tilt_brush_techniques"
        this.parser = parser;
        this.brushPath = brushPath;

        // Quick repair of path if required
        if (this.brushPath.slice(this.brushPath.length - 1) !== "/") {
            this.brushPath += "/";
        }

        this.tiltShaderLoader = new TiltShaderLoader(parser.options.manager);
        this.tiltShaderLoader.setPath(this.brushPath);
        this.clock = new Clock();
    }

    beforeRoot() {
        const parser = this.parser;
        const json = parser.json;
        let isTilt = this.isTiltGltf(json);
        if (!isTilt) {
            console.warn("Not Tilt Brush Extensions found", json);
            // return null;
        }

        json.materials.forEach(material => {

            const extensionsDef = material.extensions;

            let nameOrGuid;
            // Try a guid first
            if (extensionsDef?.[this.name]) {
                nameOrGuid = extensionsDef[this.name].guid;
            }
            else if (material.name.startsWith("material_")) {
                nameOrGuid = material.name.replace('material_', '');
            } else if (material.name.startsWith('ob-')) {
                nameOrGuid = material.name.replace('ob-', '');
            }
            else
            {
                let newName = this.tryReplaceBlocksName(material.name);
                if (newName !== undefined) {
                    nameOrGuid = newName;
                }
            }

            const materialName = this.tiltShaderLoader.lookupMaterialName(nameOrGuid);
            const materialParams = this.tiltShaderLoader.lookupMaterialParams(materialName);

            if (!materialParams) {
                console.warn(`No material params found: ${nameOrGuid} (${materialName})`);
                return;
            }

            // MainTex
            if(material?.pbrMetallicRoughness?.baseColorTexture && materialParams.uniforms?.u_MainTex) {
                const mainTex = json.images[material.pbrMetallicRoughness.baseColorTexture.index];
                mainTex.uri = this.brushPath + materialParams.uniforms?.u_MainTex.value;
            }

            // BumpMap
            if(material?.normalTexture && materialParams.uniforms?.u_BumpMap) {
                const bumpMap = json.images[material.normalTexture.index];
                bumpMap.uri = this.brushPath + materialParams.uniforms.u_BumpMap.value;
            }
        });
    }

    afterRoot(glTF) {
        const parser = this.parser;
        const json = parser.json;
        // if (!this.isTiltGltf(json)) {
        //     return null;
        // }

        const shaderResolves = [];

        for(const scene of glTF.scenes) {
            scene.traverse(async object => {
                const association = parser.associations.get(object);

                if (association === undefined || association.meshes === undefined) {
                    return;
                }

                const mesh = json.meshes[association.meshes];
                mesh.primitives.forEach((prim) => {
                    if(prim.material === null || prim.material === undefined) {
                        return;
                    }

                    const material = json.materials[prim.material];

                    const extensionsDef = material.extensions;

                    let brushName;
                    if (material.name.startsWith('ob-')) {
                        // New glb naming convention
                        brushName = material.name.replace('ob-', '');
                    }
                    else if (material.name.startsWith('material_')) {
                        // Some legacy poly files
                        // TODO - risk of name collision with non-tilt materials
                        // Maybe we should pass in a flag when a tilt gltf is detected?
                        // Do names in this format use guids or english names?
                        brushName = material.name.replace('material_', '');
                    } else if (extensionsDef) {
                        let exDef = extensionsDef[this.name];
                        if (exDef !== undefined) {
                            brushName = exDef.guid;
                        }
                    }

                    let newName = this.tryReplaceBlocksName(material.name);
                    if (newName !== undefined) {
                        brushName = newName;
                    }

                    if (brushName !== undefined) {
                        shaderResolves.push(this.replaceMaterial(object, brushName));
                    } else {
                        console.warn("No brush name found for material", material.name, brushName);
                    }
                });
            });
        }

        return Promise.all(shaderResolves);
    }

    tryReplaceBlocksName(originalName) {
        // Handle naming embedded models exported from newer Open Brush versions
        let newName;
        if (originalName.includes('_BlocksPaper ')) {
            newName = ('BlocksPaper');
        } else if (originalName.includes('_BlocksGlass ')) {
            newName = ('BlocksGlass');
        } else if (originalName.includes('_BlocksGem ')) {
            newName = ('BlocksGem');
        }
        return newName;
    }

    isTiltGltf(json) {
        let isTiltGltf = false;
        isTiltGltf ||= (json.extensionsUsed && json.extensionsUsed.includes(this.name));
        isTiltGltf ||= (json.extensionsUsed && json.extensionsUsed.includes(this.altName));
        isTiltGltf ||= ('extensions' in json && this.name in json['extensions']);
        isTiltGltf ||= ('extensions' in json && this.altName in json['extensions']);
        return isTiltGltf;
    }

    async replaceMaterial(mesh, guidOrName) {

        let renameAttribute = (mesh, oldName, newName) => {
            if (mesh.geometry.getAttribute(oldName)) {
                mesh.geometry.setAttribute(newName, mesh.geometry.getAttribute(oldName));
                mesh.geometry.deleteAttribute(oldName);
            }
        };

        let copyFixColorAttribute = (mesh) => {

            function linearToSRGB(x) {
                return x <= 0.0031308
                    ? x * 12.92
                    : 1.055 * Math.pow(x, 1.0 / 2.4) - 0.055;
            }

            let colorAttribute = mesh.geometry.getAttribute("color");
            if (colorAttribute && colorAttribute.array instanceof Float32Array) {
                const src = colorAttribute.array;
                const itemSize = colorAttribute.itemSize;
                const count = src.length / itemSize;
                const normalizedColors = new Uint8Array(src.length);

                for (let i = 0; i < count; ++i) {
                    normalizedColors[i * itemSize + 0] = Math.round(linearToSRGB(src[i * itemSize + 0]) * 255); // R
                    normalizedColors[i * itemSize + 1] = Math.round(linearToSRGB(src[i * itemSize + 1]) * 255); // G
                    normalizedColors[i * itemSize + 2] = Math.round(linearToSRGB(src[i * itemSize + 2]) * 255); // B
                    if (itemSize > 3) {
                        normalizedColors[i * itemSize + 3] = Math.round(src[i * itemSize + 3] * 255); // A (linear)
                    }
                }
                colorAttribute = new BufferAttribute(normalizedColors, itemSize, true);
                mesh.geometry.setAttribute("a_color", colorAttribute);
            }
            else
            {
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
            }
        }

        let shader;

        switch(guidOrName) {
            case "0e87b49c-6546-3a34-3a44-8a556d7d6c3e":
            case "BlocksBasic":
            case "BlocksPaper":
                mesh.geometry.name = "geometry_BlocksBasic";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                //mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("BlocksBasic");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_BlocksBasic";
                break;
            case "232998f8-d357-47a2-993a-53415df9be10":
            case "BlocksGem":
                mesh.geometry.name = "geometry_BlocksGem";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                //mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("BlocksGem");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_BlocksGem";
                break;
            case "3d813d82-5839-4450-8ddc-8e889ecd96c7":
            case "BlocksGlass":
                mesh.geometry.name = "geometry_BlocksGlass";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                //mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("BlocksGlass");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_BlocksGlass";
                break;

            case "89d104cd-d012-426b-b5b3-bbaee63ac43c":
            case "Bubbles":
                mesh.geometry.name = "geometry_Bubbles";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                renameAttribute(mesh, "_tb_unity_normal", "a_normal");
                renameAttribute(mesh, "normal", "a_normal");
                copyFixColorAttribute(mesh);

                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                renameAttribute(mesh, "_tb_unity_texcoord_1", "a_texcoord1");
                renameAttribute(mesh, "texcoord_1", "a_texcoord1");
                shader = await this.tiltShaderLoader.loadAsync("Bubbles");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Bubbles";
                break;

            case "700f3aa8-9a7c-2384-8b8a-ea028905dd8c":
            case "CelVinyl":
                mesh.geometry.name = "geometry_CelVinyl";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("CelVinyl");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_CelVinyl";
                break;

            case "0f0ff7b2-a677-45eb-a7d6-0cd7206f4816":
            case "ChromaticWave":
                mesh.geometry.name = "geometry_ChromaticWave";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("ChromaticWave");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_ChromaticWave";
                break;

            case "1161af82-50cf-47db-9706-0c3576d43c43":
            case "79168f10-6961-464a-8be1-57ed364c5600":
            case "CoarseBristles":
                mesh.geometry.name = "geometry_CoarseBristles";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("CoarseBristles");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_CoarseBristles";
                break;

            case "1caa6d7d-f015-3f54-3a4b-8b5354d39f81":
            case "Comet":
                mesh.geometry.name = "geometry_Comet";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Comet");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Comet";
                break;

            case "c8313697-2563-47fc-832e-290f4c04b901":
            case "DiamondHull":
                mesh.geometry.name = "geometry_DiamondHull";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("DiamondHull");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_DiamondHull";
                break;

            case "4391aaaa-df73-4396-9e33-31e4e4930b27":
            case "Disco":
                mesh.geometry.name = "geometry_Disco";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Disco");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Disco";
                break;

            case "d1d991f2-e7a0-4cf1-b328-f57e915e6260":
            case "DotMarker":
                mesh.geometry.name = "geometry_DotMarker";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("DotMarker");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_DotMarker";
                break;

            case "6a1cf9f9-032c-45ec-9b1d-a6680bee30f7":
            case "Dots":
                mesh.geometry.name = "geometry_Dots";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                renameAttribute(mesh, "_tb_unity_normal", "a_normal");
                renameAttribute(mesh, "normal", "a_normal");
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                renameAttribute(mesh, "_tb_unity_texcoord_1", "a_texcoord1");
                renameAttribute(mesh, "texcoord_1", "a_texcoord1");
                shader = await this.tiltShaderLoader.loadAsync("Dots");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Dots";
                break;

            case "0d3889f3-3ede-470c-8af4-f44813306126":
            case "DoubleTaperedFlat":
                mesh.geometry.name = "geometry_DoubleTaperedFlat";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("DoubleTaperedFlat");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_DoubleTaperedFlat";
                break;

            case "0d3889f3-3ede-470c-8af4-de4813306126":
            case "DoubleTaperedMarker":
                mesh.geometry.name = "geometry_DoubleTaperedMarker";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("DoubleTaperedMarker");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_DoubleTaperedMarker";
                break;

            case "d0262945-853c-4481-9cbd-88586bed93cb":
            case "3ca16e2f-bdcd-4da2-8631-dcef342f40f1":
            case "DuctTape":
                mesh.geometry.name = "geometry_DuctTape";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("DuctTape");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_DuctTape";
                break;

            case "f6e85de3-6dcc-4e7f-87fd-cee8c3d25d51":
            case "Electricity":
                mesh.geometry.name = "geometry_Electricity";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                renameAttribute(mesh, "_tb_unity_texcoord_1", "a_texcoord1");
                renameAttribute(mesh, "texcoord_1", "a_texcoord1");
                shader = await this.tiltShaderLoader.loadAsync("Electricity");
                mesh.material = shader;
                mesh.material.name = "material_Electricity";
                break;

            case "02ffb866-7fb2-4d15-b761-1012cefb1360":
            case "Embers":
                mesh.geometry.name = "geometry_Embers";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                renameAttribute(mesh, "_tb_unity_normal", "a_normal");
                renameAttribute(mesh, "normal", "a_normal");
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                renameAttribute(mesh, "_tb_unity_texcoord_1", "a_texcoord1");
                renameAttribute(mesh, "texcoord_1", "a_texcoord1");
                shader = await this.tiltShaderLoader.loadAsync("Embers");
                mesh.material = shader;
                mesh.material.name = "material_Embers";
                break;

            case "0ad58bbd-42bc-484e-ad9a-b61036ff4ce7":
            case "EnvironmentDiffuse":
                mesh.geometry.name = "geometry_EnvironmentDiffuse";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("EnvironmentDiffuse");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_EnvironmentDiffuse";
                break;

            case "d01d9d6c-9a61-4aba-8146-5891fafb013b":
            case "EnvironmentDiffuseLightMap":
                mesh.geometry.name = "geometry_EnvironmentDiffuseLightMap";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("EnvironmentDiffuseLightMap");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_EnvironmentDiffuseLightMap";
                break;

            case "cb92b597-94ca-4255-b017-0e3f42f12f9e":
            case "Fire":
                mesh.geometry.name = "geometry_Fire";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Fire");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Fire";
                break;

            case "2d35bcf0-e4d8-452c-97b1-3311be063130":
            case "280c0a7a-aad8-416c-a7d2-df63d129ca70":
            case "55303bc4-c749-4a72-98d9-d23e68e76e18":
            case "Flat":
                mesh.geometry.name = "geometry_Flat";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Flat");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Flat";
                break;

            case "cf019139-d41c-4eb0-a1d0-5cf54b0a42f3":
            case "Highlighter":
                mesh.geometry.name = "geometry_Highlighter";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Highlighter");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Highlighter";
                break;

            case "dce872c2-7b49-4684-b59b-c45387949c5c":
            case "e8ef32b1-baa8-460a-9c2c-9cf8506794f5":
            case "Hypercolor":
                mesh.geometry.name = "geometry_Hypercolor";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Hypercolor");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Hypercolor";
                break;

            case "6a1cf9f9-032c-45ec-9b6e-a6680bee32e9":
            case "HyperGrid":
                mesh.geometry.name = "geometry_HyperGrid";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                renameAttribute(mesh, "_tb_unity_texcoord_1", "a_texcoord1");
                renameAttribute(mesh, "texcoord_1", "a_texcoord1");
                shader = await this.tiltShaderLoader.loadAsync("HyperGrid");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_HyperGrid";
                break;

            case "2f212815-f4d3-c1a4-681a-feeaf9c6dc37":
            case "Icing":
                mesh.geometry.name = "geometry_Icing";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));

                shader = await this.tiltShaderLoader.loadAsync("Icing");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Icing";
                break;

            case "f5c336cf-5108-4b40-ade9-c687504385ab":
            case "c0012095-3ffd-4040-8ee1-fc180d346eaa":
            case "Ink":
                mesh.geometry.name = "geometry_Ink";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Ink");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Ink";
                break;

            case "4a76a27a-44d8-4bfe-9a8c-713749a499b0":
            case "ea19de07-d0c0-4484-9198-18489a3c1487":
            case "Leaves":
                mesh.geometry.name = "geometry_Leaves";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Leaves");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Leaves";
                break;

            case "2241cd32-8ba2-48a5-9ee7-2caef7e9ed62":
            case "Light":
                mesh.geometry.name = "geometry_Light";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Light");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                console.log(`Setting ${mesh.material.name}`);
                mesh.material.name = "material_Light";
                console.log(`Set material for mesh ${mesh.name} to ${mesh.material.name}`);
                break;

            case "4391aaaa-df81-4396-9e33-31e4e4930b27":
            case "LightWire":
                mesh.geometry.name = "geometry_LightWire";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("LightWire");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_LightWire";
                break;

            case "d381e0f5-3def-4a0d-8853-31e9200bcbda":
            case "Lofted":
                mesh.geometry.name = "geometry_Lofted";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Lofted");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Lofted";
                break;

            case "429ed64a-4e97-4466-84d3-145a861ef684":
            case "Marker":
                mesh.geometry.name = "geometry_Marker";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Marker");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Marker";
                break;

            case "79348357-432d-4746-8e29-0e25c112e3aa":
            case "MatteHull":
                mesh.geometry.name = "geometry_MatteHull";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("MatteHull");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_MatteHull";
                break;

            case "b2ffef01-eaaa-4ab5-aa64-95a2c4f5dbc6":
            case "NeonPulse":
                mesh.geometry.name = "geometry_NeonPulse";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("NeonPulse");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_NeonPulse";
                break;

            case "f72ec0e7-a844-4e38-82e3-140c44772699":
            case "c515dad7-4393-4681-81ad-162ef052241b":
            case "OilPaint":
                mesh.geometry.name = "geometry_OilPaint";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("OilPaint");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_OilPaint";
                break;

            case "f1114e2e-eb8d-4fde-915a-6e653b54e9f5":
            case "759f1ebd-20cd-4720-8d41-234e0da63716":
            case "Paper":
                mesh.geometry.name = "geometry_Paper";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Paper");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Paper";
                break;

            case "f86a096c-2f4f-4f9d-ae19-81b99f2944e0":
            case "PbrTemplate":
                mesh.geometry.name = "geometry_PbrTemplate";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("PbrTemplate");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_PbrTemplate";
                break;

            case "19826f62-42ac-4a9e-8b77-4231fbd0cfbf":
            case "PbrTransparentTemplate":
                mesh.geometry.name = "geometry_PbrTransparentTemplate";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("PbrTransparentTemplate");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_PbrTransparentTemplate";
                break;

            case "e0abbc80-0f80-e854-4970-8924a0863dcc":
            case "Petal":
                mesh.geometry.name = "geometry_Petal";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Petal");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Petal";
                break;

            case "c33714d1-b2f9-412e-bd50-1884c9d46336":
            case "Plasma":
                mesh.geometry.name = "geometry_Plasma";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Plasma");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Plasma";
                break;

            case "ad1ad437-76e2-450d-a23a-e17f8310b960":
            case "Rainbow":
                mesh.geometry.name = "geometry_Rainbow";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Rainbow");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Rainbow";
                break;

            case "faaa4d44-fcfb-4177-96be-753ac0421ba3":
            case "ShinyHull":
                mesh.geometry.name = "geometry_ShinyHull";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("ShinyHull");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_ShinyHull";
                break;

            case "70d79cca-b159-4f35-990c-f02193947fe8":
            case "Smoke":
                mesh.geometry.name = "geometry_Smoke";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                renameAttribute(mesh, "_tb_unity_normal", "a_normal");
                renameAttribute(mesh, "normal", "a_normal");
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                renameAttribute(mesh, "_tb_unity_texcoord_1", "a_texcoord1");
                renameAttribute(mesh, "texcoord_1", "a_texcoord1");
                shader = await this.tiltShaderLoader.loadAsync("Smoke");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Smoke";
                break;

            case "d902ed8b-d0d1-476c-a8de-878a79e3a34c":
            case "Snow":
                mesh.geometry.name = "geometry_Snow";
                
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                renameAttribute(mesh, "_tb_unity_normal", "a_normal");
                renameAttribute(mesh, "normal", "a_normal");
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                renameAttribute(mesh, "_tb_unity_texcoord_1", "a_texcoord1");
                renameAttribute(mesh, "texcoord_1", "a_texcoord1");
                shader = await this.tiltShaderLoader.loadAsync("Snow");
                mesh.material = shader;
                mesh.material.name = "material_Snow";
                break;

            case "accb32f5-4509-454f-93f8-1df3fd31df1b":
            case "SoftHighlighter":
                mesh.geometry.name = "geometry_SoftHighlighter";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("SoftHighlighter");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_SoftHighlighter";
                break;

            case "cf7f0059-7aeb-53a4-2b67-c83d863a9ffa":
            case "Spikes":
                mesh.geometry.name = "geometry_Spikes";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Spikes");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Spikes";
                break;

            case "8dc4a70c-d558-4efd-a5ed-d4e860f40dc3":
            case "7a1c8107-50c5-4b70-9a39-421576d6617e":
            case "Splatter":
                mesh.geometry.name = "geometry_Splatter";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Splatter");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Splatter";
                break;

            case "0eb4db27-3f82-408d-b5a1-19ebd7d5b711":
            case "Stars":
                mesh.geometry.name = "geometry_Stars";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                renameAttribute(mesh, "_tb_unity_normal", "a_normal");
                renameAttribute(mesh, "normal", "a_normal");
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                renameAttribute(mesh, "_tb_unity_texcoord_1", "a_texcoord1");
                renameAttribute(mesh, "texcoord_1", "a_texcoord1");
                shader = await this.tiltShaderLoader.loadAsync("Stars");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Stars";
                break;

            case "44bb800a-fbc3-4592-8426-94ecb05ddec3":
            case "Streamers":
                mesh.geometry.name = "geometry_Streamers";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Streamers");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Streamers";
                break;

            case "0077f88c-d93a-42f3-b59b-b31c50cdb414":
            case "Taffy":
                mesh.geometry.name = "geometry_Taffy";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Taffy");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Taffy";
                break;

            case "b468c1fb-f254-41ed-8ec9-57030bc5660c":
            case "c8ccb53d-ae13-45ef-8afb-b730d81394eb":
            case "TaperedFlat":
                mesh.geometry.name = "geometry_TaperedFlat";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("TaperedFlat");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_TaperedFlat";
                break;

            case "d90c6ad8-af0f-4b54-b422-e0f92abe1b3c":
            case "1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0":
            case "TaperedMarker_Flat":
                mesh.geometry.name = "geometry_TaperedMarker_Flat";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("TaperedMarker_Flat");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_TaperedMarker_Flat";
                break;

            case "75b32cf0-fdd6-4d89-a64b-e2a00b247b0f":
            case "fdf0326a-c0d1-4fed-b101-9db0ff6d071f":
            case "ThickPaint":
                mesh.geometry.name = "geometry_ThickPaint";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("ThickPaint");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_ThickPaint";
                break;

            case "4391385a-df73-4396-9e33-31e4e4930b27":
            case "Toon":
                mesh.geometry.name = "geometry_Toon";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Toon");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Toon";
                break;

            case "a8fea537-da7c-4d4b-817f-24f074725d6d":
            case "UnlitHull":
                mesh.geometry.name = "geometry_UnlitHull";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("UnlitHull");
                shader.fog = true;
                mesh.material = shader;
                mesh.material.name = "material_UnlitHull";
                break;

            case "d229d335-c334-495a-a801-660ac8a87360":
            case "VelvetInk":
                mesh.geometry.name = "geometry_VelvetInk";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("VelvetInk");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_VelvetInk";
                break;

            case "10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab":
            case "Waveform":
                mesh.geometry.name = "geometry_Waveform";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("Waveform");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Waveform";
                break;

            case "b67c0e81-ce6d-40a8-aeb0-ef036b081aa3":
            case "dea67637-cd1a-27e4-c9b1-52f4bbcb84e5":
            case "WetPaint":
                mesh.geometry.name = "geometry_WetPaint";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("WetPaint");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_WetPaint";
                break;

            case "5347acf0-a8e2-47b6-8346-30c70719d763":
            case "e814fef1-97fd-7194-4a2f-50c2bb918be2":
            case "WigglyGraphite":
                mesh.geometry.name = "geometry_WigglyGraphite";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                renameAttribute(mesh, "_tb_unity_texcoord_0", "a_texcoord0");
                renameAttribute(mesh, "texcoord_0", "a_texcoord0");
                mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("uv"));
                shader = await this.tiltShaderLoader.loadAsync("WigglyGraphite");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_WigglyGraphite";
                break;

            case "4391385a-cf83-4396-9e33-31e4e4930b27":
            case "Wire":
                mesh.geometry.name = "geometry_Wire";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Wire");
                mesh.material = shader;
                mesh.material.name = "material_Wire";
                break;

            // Experimental brushes


            case "cf3401b3-4ada-4877-995a-1aa64e7b604a":
            case "SvgTemplate":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_SvgTemplate";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("SvgTemplate");
                mesh.material = shader;
                mesh.material.name = "material_SvgTemplate";
                break;

            case "4465b5ef-3605-bec4-2b3e-6b04508ddb6b":
            case "Gouache":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Gouache";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Gouache");
                mesh.material = shader;
                mesh.material.name = "material_Gouache";
                break;

            case "8e58ceea-7830-49b4-aba9-6215104ab52a":
            case "MylarTube":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_MylarTube";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("MylarTube");
                mesh.material = shader;
                mesh.material.name = "material_MylarTube";
                break;

            case "03a529e1-f519-3dd4-582d-2d5cd92c3f4f":
            case "Rain":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Rain";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Rain");
                mesh.material = shader;
                mesh.material.name = "material_Rain";
                break;

            case "725f4c6a-6427-6524-29ab-da371924adab":
            case "DryBrush":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_DryBrush";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("DryBrush");
                mesh.material = shader;
                mesh.material.name = "material_DryBrush";
                break;

            case "ddda8745-4bb5-ac54-88b6-d1480370583e":
            case "LeakyPen":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_LeakyPen";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("LeakyPen");
                mesh.material = shader;
                mesh.material.name = "material_LeakyPen";
                break;

            case "50e99447-3861-05f4-697d-a1b96e771b98":
            case "Sparks":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Sparks";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Sparks");
                mesh.material = shader;
                mesh.material.name = "material_Sparks";
                break;

            case "7136a729-1aab-bd24-f8b2-ca88b6adfb67":
            case "Wind":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Wind";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Wind");
                mesh.material = shader;
                mesh.material.name = "material_Wind";
                break;

            case "a8147ce1-005e-abe4-88e8-09a1eaadcc89":
            case "Rising Bubbles":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Rising Bubbles";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Rising Bubbles");
                mesh.material = shader;
                mesh.material.name = "material_Rising Bubbles";
                break;

            case "9568870f-8594-60f4-1b20-dfbc8a5eac0e":
            case "TaperedWire":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_TaperedWire";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("TaperedWire");
                mesh.material = shader;
                mesh.material.name = "material_TaperedWire";
                break;

            case "2e03b1bf-3ebd-4609-9d7e-f4cafadc4dfa":
            case "SquarePaper":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_SquarePaper";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("SquarePaper");
                mesh.material = shader;
                mesh.material.name = "material_SquarePaper";
                break;

            case "39ee7377-7a9e-47a7-a0f8-0c77712f75d3":
            case "ThickGeometry":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_ThickGeometry";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("ThickGeometry");
                mesh.material = shader;
                mesh.material.name = "material_ThickGeometry";
                break;

            case "2c1a6a63-6552-4d23-86d7-58f6fba8581b":
            case "Wireframe":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Wireframe";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Wireframe");
                mesh.material = shader;
                mesh.material.name = "material_Wireframe";
                break;

            case "61d2ef63-ed60-49b3-85fb-7267b7d234f2":
            case "CandyCane":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_CandyCane";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("CandyCane");
                mesh.material = shader;
                mesh.material.name = "material_CandyCane";
                break;

            case "20a0bf1a-a96e-44e5-84ac-9823d2d65023":
            case "HolidayTree":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_HolidayTree";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("HolidayTree");
                mesh.material = shader;
                mesh.material.name = "material_HolidayTree";
                break;

            case "2b65cd94-9259-4f10-99d2-d54b6664ac33":
            case "Snowflake":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Snowflake";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Snowflake");
                mesh.material = shader;
                mesh.material.name = "material_Snowflake";
                break;

            case "22d4f434-23e4-49d9-a9bd-05798aa21e58":
            case "Braid3":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Braid3";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Braid3");
                mesh.material = shader;
                mesh.material.name = "material_Braid3";
                break;

            case "f28c395c-a57d-464b-8f0b-558c59478fa3":
            case "Muscle":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Muscle";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Muscle");
                mesh.material = shader;
                mesh.material.name = "material_Muscle";
                break;

            case "99aafe96-1645-44cd-99bd-979bc6ef37c5":
            case "Guts":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Guts";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Guts");
                mesh.material = shader;
                mesh.material.name = "material_Guts";
                break;

            case "53d753ef-083c-45e1-98e7-4459b4471219":
            case "Fire2":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Fire2";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Fire2");
                mesh.material = shader;
                mesh.material.name = "material_Fire2";
                break;

            case "9871385a-df73-4396-9e33-31e4e4930b27":
            case "TubeToonInverted":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_TubeToonInverted";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("TubeToonInverted");
                mesh.material = shader;
                mesh.material.name = "material_TubeToonInverted";
                break;

            case "4391ffaa-df73-4396-9e33-31e4e4930b27":
            case "FacetedTube":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_FacetedTube";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("FacetedTube");
                mesh.material = shader;
                mesh.material.name = "material_FacetedTube";
                break;

            case "6a1cf9f9-032c-45ec-9b6e-a6680bee30f7":
            case "WaveformParticles":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_WaveformParticles";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("WaveformParticles");
                mesh.material = shader;
                mesh.material.name = "material_WaveformParticles";
                break;

            case "eba3f993-f9a1-4d35-b84e-bb08f48981a4":
            case "BubbleWand":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_BubbleWand";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("BubbleWand");
                mesh.material = shader;
                mesh.material.name = "material_BubbleWand";
                break;

            case "6a1cf9f9-032c-45ec-311e-a6680bee32e9":
            case "DanceFloor":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_DanceFloor";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("DanceFloor");
                mesh.material = shader;
                mesh.material.name = "material_DanceFloor";
                break;

            case "0f5820df-cb6b-4a6c-960e-56e4c8000eda":
            case "WaveformTube":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_WaveformTube";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("WaveformTube");
                mesh.material = shader;
                mesh.material.name = "material_WaveformTube";
                break;

            case "492b36ff-b337-436a-ba5f-1e87ee86747e":
            case "Drafting":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Drafting";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Drafting");
                mesh.material = shader;
                mesh.material.name = "material_Drafting";
                break;

            case "f0a2298a-be80-432c-9fee-a86dcc06f4f9":
            case "SingleSided":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_SingleSided";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("SingleSided");
                mesh.material = shader;
                mesh.material.name = "material_SingleSided";
                break;

            case "f4a0550c-332a-4e1a-9793-b71508f4a454":
            case "DoubleFlat":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_DoubleFlat";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("DoubleFlat");
                mesh.material = shader;
                mesh.material.name = "material_DoubleFlat";
                break;

            case "c1c9b26d-673a-4dc6-b373-51715654ab96":
            case "TubeAdditive":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_TubeAdditive";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("TubeAdditive");
                mesh.material = shader;
                mesh.material.name = "material_TubeAdditive";
                break;

            case "a555b809-2017-46cb-ac26-e63173d8f45e":
            case "Feather":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Feather";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Feather");
                mesh.material = shader;
                mesh.material.name = "material_Feather";
                break;

            case "84d5bbb2-6634-8434-f8a7-681b576b4664":
            case "DuctTapeGeometry":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_DuctTapeGeometry";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("DuctTapeGeometry");
                mesh.material = shader;
                mesh.material.name = "material_DuctTapeGeometry";
                break;

            case "3d9755da-56c7-7294-9b1d-5ec349975f52":
            case "TaperedHueShift":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_TaperedHueShift";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("TaperedHueShift");
                mesh.material = shader;
                mesh.material.name = "material_TaperedHueShift";
                break;

            case "1cf94f63-f57a-4a1a-ad14-295af4f5ab5c":
            case "Lacewing":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Lacewing";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Lacewing");
                mesh.material = shader;
                mesh.material.name = "material_Lacewing";
                break;

            case "c86c058d-1bda-2e94-08db-f3d6a96ac4a1":
            case "Marbled Rainbow":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Marbled Rainbow";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Marbled Rainbow");
                mesh.material = shader;
                mesh.material.name = "material_Marbled Rainbow";
                break;

            case "fde6e778-0f7a-e584-38d6-89d44cee59f6":
            case "Charcoal":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Charcoal";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Charcoal");
                mesh.material = shader;
                mesh.material.name = "material_Charcoal";
                break;

            case "f8ba3d18-01fc-4d7b-b2d9-b99d10b8e7cf":
            case "KeijiroTube":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_KeijiroTube";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("KeijiroTube");
                mesh.material = shader;
                mesh.material.name = "material_KeijiroTube";
                break;

            case "c5da2e70-a6e4-63a4-898c-5cfedef09c97":
            case "Lofted (Hue Shift)":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Lofted (Hue Shift)";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Lofted (Hue Shift)");
                mesh.material = shader;
                mesh.material.name = "material_Lofted (Hue Shift)";
                break;

            case "62fef968-e842-3224-4a0e-1fdb7cfb745c":
            case "Wire (Lit)":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Wire (Lit)";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Wire (Lit)");
                mesh.material = shader;
                mesh.material.name = "material_Wire (Lit)";
                break;

            case "d120944d-772f-4062-99c6-46a6f219eeaf":
            case "WaveformFFT":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_WaveformFFT";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("WaveformFFT");
                mesh.material = shader;
                mesh.material.name = "material_WaveformFFT";
                break;

            case "d9cc5e99-ace1-4d12-96e0-4a7c18c99cfc":
            case "Fairy":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Fairy";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Fairy");
                mesh.material = shader;
                mesh.material.name = "material_Fairy";
                break;

            case "bdf65db2-1fb7-4202-b5e0-c6b5e3ea851e":
            case "Space":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Space";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Space");
                mesh.material = shader;
                mesh.material.name = "material_Space";
                break;

            case "30cb9af6-be41-4872-8f3e-cbff63fe3db8":
            case "Digital":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Digital";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Digital");
                mesh.material = shader;
                mesh.material.name = "material_Digital";
                break;

            case "abfbb2aa-70b4-4a5c-8126-8eedda2b3628":
            case "Race":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Race";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Race");
                mesh.material = shader;
                mesh.material.name = "material_Race";
                break;

            case "355b3579-bf1d-4ff5-a200-704437fe684b":
            case "SmoothHull":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_SmoothHull";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("SmoothHull");
                mesh.material = shader;
                mesh.material.name = "material_SmoothHull";
                break;

            case "7259cce5-41c1-ec74-c885-78af28a31d95":
            case "Leaves2":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_Leaves2";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("Leaves2");
                mesh.material = shader;
                mesh.material.name = "material_Leaves2";
                break;

            case "7c972c27-d3c2-8af4-7bf8-5d9db8f0b7bb":
            case "InkGeometry":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_InkGeometry";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("InkGeometry");
                mesh.material = shader;
                mesh.material.name = "material_InkGeometry";
                break;

            case "7ae1f880-a517-44a0-99f9-1cab654498c6":
            case "ConcaveHull":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_ConcaveHull";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("ConcaveHull");
                mesh.material = shader;
                mesh.material.name = "material_ConcaveHull";
                break;

            case "d3f3b18a-da03-f694-b838-28ba8e749a98":
            case "3D Printing Brush":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_3D Printing Brush";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("3D Printing Brush");
                mesh.material = shader;
                mesh.material.name = "material_3D Printing Brush";
                break;

            case "cc131ff8-0d17-4677-93e0-d7cd19fea9ac":
            case "PassthroughHull":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_PassthroughHull";

                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                copyFixColorAttribute(mesh);
                shader = await this.tiltShaderLoader.loadAsync("PassthroughHull");
                mesh.material = shader;
                mesh.material.name = "material_PassthroughHull";
                break;


            default:
                console.warn(`Could not find brush with guid ${guidOrName}!`);
        }
        
        mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
            if (material?.uniforms?.u_time) {
                const elapsedTime = this.clock.getElapsedTime();
                // _Time from https://docs.unity3d.com/Manual/SL-UnityShaderVariables.html
                const time = new Vector4(elapsedTime/20, elapsedTime, elapsedTime*2, elapsedTime*3);

                material.uniforms["u_time"].value = time;
            }

            if (material?.uniforms?.cameraPosition) {
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
            if(material?.uniforms?.ambientLightColor?.value) {
                if(material.uniforms.u_ambient_light_color) {
                    const colorArray = material.uniforms.ambientLightColor.value;
                    material.uniforms.u_ambient_light_color.value = new Vector4(colorArray[0], colorArray[1], colorArray[2], 1);
                }
            }

            // Fog
            if(material?.uniforms?.fogColor?.value) {
                if(material.uniforms.u_fogColor) {
                    const colorArray = material.uniforms.fogColor.value;
                    material.uniforms.u_fogColor.value = colorArray;
                }
            }
            if(material?.uniforms?.fogDensity?.value) {
                if(material.uniforms.u_fogDensity) {
                    material.uniforms.u_fogDensity.value = material.uniforms.fogDensity.value;
                }
            }
        };
    }
}
