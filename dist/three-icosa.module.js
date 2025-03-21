import {FileLoader as $a0PbU$FileLoader, TextureLoader as $a0PbU$TextureLoader, GLSL3 as $a0PbU$GLSL3, RepeatWrapping as $a0PbU$RepeatWrapping, UniformsLib as $a0PbU$UniformsLib, RawShaderMaterial as $a0PbU$RawShaderMaterial, Loader as $a0PbU$Loader, Vector4 as $a0PbU$Vector4, Vector3 as $a0PbU$Vector3, Clock as $a0PbU$Clock} from "three";

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

class $cf098bb13503440d$export$bcc22bf437a07d8f extends $a0PbU$Loader {
    constructor(manager){
        super(manager);
        this.loadedMaterials = {};
    }
    async load(brushName, onLoad, onProgress, onError) {
        const scope = this;
        const isAlreadyLoaded = this.loadedMaterials[brushName];
        if (isAlreadyLoaded !== undefined) {
            onLoad(scope.parse(isAlreadyLoaded));
            return;
        }
        const loader = new (0, $a0PbU$FileLoader)(this.manager);
        loader.setPath(this.path);
        loader.setResponseType("text");
        loader.setWithCredentials(this.withCredentials);
        const textureLoader = new (0, $a0PbU$TextureLoader)(this.manager);
        textureLoader.setPath(this.path);
        textureLoader.setWithCredentials(this.withCredentials);
        const materialParams = $cf098bb13503440d$var$tiltBrushMaterialParams[brushName];
        materialParams.glslVersion = (0, $a0PbU$GLSL3);
        materialParams.vertexShader = await loader.loadAsync(materialParams.vertexShader);
        materialParams.fragmentShader = await loader.loadAsync(materialParams.fragmentShader);
        if (materialParams.uniforms.u_MainTex) {
            const mainTex = await textureLoader.loadAsync(materialParams.uniforms.u_MainTex.value);
            mainTex.name = `${brushName}_MainTex`;
            mainTex.wrapS = (0, $a0PbU$RepeatWrapping);
            mainTex.wrapT = (0, $a0PbU$RepeatWrapping);
            mainTex.flipY = false;
            materialParams.uniforms.u_MainTex.value = mainTex;
        }
        if (materialParams.uniforms.u_BumpMap) {
            const bumpMap = await textureLoader.loadAsync(materialParams.uniforms.u_BumpMap.value);
            bumpMap.name = `${brushName}_BumpMap`;
            bumpMap.wrapS = (0, $a0PbU$RepeatWrapping);
            bumpMap.wrapT = (0, $a0PbU$RepeatWrapping);
            bumpMap.flipY = false;
            materialParams.uniforms.u_BumpMap.value = bumpMap;
        }
        if (materialParams.uniforms.u_AlphaMask) {
            const alphaMask = await textureLoader.loadAsync(materialParams.uniforms.u_AlphaMask.value);
            alphaMask.name = `${brushName}_AlphaMask`;
            alphaMask.wrapS = (0, $a0PbU$RepeatWrapping);
            alphaMask.wrapT = (0, $a0PbU$RepeatWrapping);
            alphaMask.flipY = false;
            materialParams.uniforms.u_AlphaMask.value = alphaMask;
        }
        // inject three.js lighting and fog uniforms
        for(var lightType in (0, $a0PbU$UniformsLib).lights)materialParams.uniforms[lightType] = (0, $a0PbU$UniformsLib).lights[lightType];
        for(var fogType in (0, $a0PbU$UniformsLib).fog)materialParams.uniforms[fogType] = (0, $a0PbU$UniformsLib).fog[fogType];
        let rawMaterial = new (0, $a0PbU$RawShaderMaterial)(materialParams);
        this.loadedMaterials[brushName] = rawMaterial;
        onLoad(scope.parse(rawMaterial));
    }
    parse(rawMaterial) {
        return rawMaterial;
    }
    lookupMaterial(nameOrGuid) {
        const name = this.lookupMaterialName(nameOrGuid);
        return $cf098bb13503440d$var$tiltBrushMaterialParams[name];
    }
    lookupMaterialName(nameOrGuid) {
        switch(nameOrGuid){
            case "BlocksBasic:":
            case "0e87b49c-6546-3a34-3a44-8a556d7d6c3e":
                return "BlocksBasic";
            case "BlocksGem":
            case "232998f8-d357-47a2-993a-53415df9be10":
                return "BlocksGem";
            case "BlocksGlass":
            case "3d813d82-5839-4450-8ddc-8e889ecd96c7":
                return "BlocksGlass";
            case "Bubbles":
            case "89d104cd-d012-426b-b5b3-bbaee63ac43c":
                return "Bubbles";
            case "CelVinyl":
            case "700f3aa8-9a7c-2384-8b8a-ea028905dd8c":
                return "CelVinyl";
            case "ChromaticWave":
            case "0f0ff7b2-a677-45eb-a7d6-0cd7206f4816":
                return "ChromaticWave";
            case "CoarseBristles":
            case "1161af82-50cf-47db-9706-0c3576d43c43":
            case "79168f10-6961-464a-8be1-57ed364c5600":
                return "CoarseBristles";
            case "Comet":
            case "1caa6d7d-f015-3f54-3a4b-8b5354d39f81":
                return "Comet";
            case "DiamondHull":
            case "c8313697-2563-47fc-832e-290f4c04b901":
                return "DiamondHull";
            case "Disco":
            case "4391aaaa-df73-4396-9e33-31e4e4930b27":
                return "Disco";
            case "DotMarker":
            case "d1d991f2-e7a0-4cf1-b328-f57e915e6260":
                return "DotMarker";
            case "Dots":
            case "6a1cf9f9-032c-45ec-9b1d-a6680bee30f7":
                return "Dots";
            case "DoubleTaperedFlat":
            case "0d3889f3-3ede-470c-8af4-f44813306126":
                return "DoubleTaperedFlat";
            case "DoubleTaperedMarker":
            case "0d3889f3-3ede-470c-8af4-de4813306126":
                return "DoubleTaperedMarker";
            case "DuctTape":
            case "d0262945-853c-4481-9cbd-88586bed93cb":
            case "3ca16e2f-bdcd-4da2-8631-dcef342f40f1":
                return "DuctTape";
            case "Electricity":
            case "f6e85de3-6dcc-4e7f-87fd-cee8c3d25d51":
                return "Electricity";
            case "Embers":
            case "02ffb866-7fb2-4d15-b761-1012cefb1360":
                return "Embers";
            case "EnvironmentDiffuse":
            case "0ad58bbd-42bc-484e-ad9a-b61036ff4ce7":
                return "EnvironmentDiffuse";
            case "EnvironmentDiffuseLightMap":
            case "d01d9d6c-9a61-4aba-8146-5891fafb013b":
                return "EnvironmentDiffuseLightMap";
            case "Fire":
            case "cb92b597-94ca-4255-b017-0e3f42f12f9e":
                return "Fire";
            case "2d35bcf0-e4d8-452c-97b1-3311be063130":
            case "280c0a7a-aad8-416c-a7d2-df63d129ca70":
            case "55303bc4-c749-4a72-98d9-d23e68e76e18":
            case "Flat":
                return "Flat";
            case "cf019139-d41c-4eb0-a1d0-5cf54b0a42f3":
            case "geometry_Highlighter":
                return "Highlighter";
            case "Hypercolor":
            case "dce872c2-7b49-4684-b59b-c45387949c5c":
            case "e8ef32b1-baa8-460a-9c2c-9cf8506794f5":
                return "Hypercolor";
            case "HyperGrid":
            case "6a1cf9f9-032c-45ec-9b6e-a6680bee32e9":
                return "HyperGrid";
            case "Icing":
            case "2f212815-f4d3-c1a4-681a-feeaf9c6dc37":
                return "Icing";
            case "Ink":
            case "f5c336cf-5108-4b40-ade9-c687504385ab":
            case "c0012095-3ffd-4040-8ee1-fc180d346eaa":
                return "Ink";
            case "Leaves":
            case "4a76a27a-44d8-4bfe-9a8c-713749a499b0":
            case "ea19de07-d0c0-4484-9198-18489a3c1487":
                return "Leaves";
            case "Light":
            case "2241cd32-8ba2-48a5-9ee7-2caef7e9ed62":
                return "Light";
            case "LightWire":
            case "4391aaaa-df81-4396-9e33-31e4e4930b27":
                return "LightWire";
            case "Lofted":
            case "d381e0f5-3def-4a0d-8853-31e9200bcbda":
                return "Lofted";
            case "Marker":
            case "429ed64a-4e97-4466-84d3-145a861ef684":
                return "Marker";
            case "MatteHull":
            case "79348357-432d-4746-8e29-0e25c112e3aa":
                return "MatteHull";
            case "NeonPulse":
            case "b2ffef01-eaaa-4ab5-aa64-95a2c4f5dbc6":
                return "NeonPulse";
            case "OilPaint":
            case "f72ec0e7-a844-4e38-82e3-140c44772699":
            case "c515dad7-4393-4681-81ad-162ef052241b":
                return "OilPaint";
            case "Paper":
            case "f1114e2e-eb8d-4fde-915a-6e653b54e9f5":
            case "759f1ebd-20cd-4720-8d41-234e0da63716":
                return "Paper";
            case "PbrTemplate":
            case "f86a096c-2f4f-4f9d-ae19-81b99f2944e0":
                return "PbrTemplate";
            case "PbrTransparentTemplate":
            case "19826f62-42ac-4a9e-8b77-4231fbd0cfbf":
                return "PbrTransparentTemplate";
            case "Petal":
            case "e0abbc80-0f80-e854-4970-8924a0863dcc":
                return "Petal";
            case "Plasma":
            case "c33714d1-b2f9-412e-bd50-1884c9d46336":
                return "Plasma";
            case "Rainbow":
            case "ad1ad437-76e2-450d-a23a-e17f8310b960":
                return "Rainbow";
            case "ShinyHull":
            case "faaa4d44-fcfb-4177-96be-753ac0421ba3":
                return "ShinyHull";
            case "Smoke":
            case "70d79cca-b159-4f35-990c-f02193947fe8":
                return "Smoke";
            case "Snow":
            case "d902ed8b-d0d1-476c-a8de-878a79e3a34c":
                return "Snow";
            case "SoftHighlighter":
            case "accb32f5-4509-454f-93f8-1df3fd31df1b":
                return "SoftHighlighter";
            case "Spikes":
            case "cf7f0059-7aeb-53a4-2b67-c83d863a9ffa":
                return "Spikes";
            case "Splatter":
            case "8dc4a70c-d558-4efd-a5ed-d4e860f40dc3":
            case "7a1c8107-50c5-4b70-9a39-421576d6617e":
                return "Splatter";
            case "Stars":
            case "0eb4db27-3f82-408d-b5a1-19ebd7d5b711":
                return "Stars";
            case "Streamers":
            case "44bb800a-fbc3-4592-8426-94ecb05ddec3":
                return "Streamers";
            case "Taffy":
            case "0077f88c-d93a-42f3-b59b-b31c50cdb414":
                return "Taffy";
            case "TaperedFlat":
            case "b468c1fb-f254-41ed-8ec9-57030bc5660c":
            case "c8ccb53d-ae13-45ef-8afb-b730d81394eb":
                return "TaperedFlat";
            case "TaperedMarker":
            case "d90c6ad8-af0f-4b54-b422-e0f92abe1b3c":
            case "1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0":
                return "TaperedMarker";
            case "ThickPaint":
            case "75b32cf0-fdd6-4d89-a64b-e2a00b247b0f":
            case "fdf0326a-c0d1-4fed-b101-9db0ff6d071f":
                return "ThickPaint";
            case "Toon":
            case "4391385a-df73-4396-9e33-31e4e4930b27":
                return "Toon";
            case "UnlitHull":
            case "a8fea537-da7c-4d4b-817f-24f074725d6d":
                return "UnlitHull";
            case "VelvetInk":
            case "d229d335-c334-495a-a801-660ac8a87360":
                return "VelvetInk";
            case "Waveform":
            case "10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab":
                return "Waveform";
            case "WetPaint":
            case "b67c0e81-ce6d-40a8-aeb0-ef036b081aa3":
            case "dea67637-cd1a-27e4-c9b1-52f4bbcb84e5":
                return "WetPaint";
            case "WigglyGraphite":
            case "5347acf0-a8e2-47b6-8346-30c70719d763":
            case "e814fef1-97fd-7194-4a2f-50c2bb918be2":
                return "WigglyGraphite";
            case "wire":
            case "4391385a-cf83-4396-9e33-31e4e4930b27":
                return "Wire";
        }
    }
}
const $cf098bb13503440d$var$tiltBrushMaterialParams = {
    "BlocksBasic": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_Shininess: {
                value: 0.2
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0.1960784, 0.1960784, 0.1960784)
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "BlocksBasic-0e87b49c-6546-3a34-3a44-8a556d7d6c3e/BlocksBasic-0e87b49c-6546-3a34-3a44-8a556d7d6c3e-v10.0-vertex.glsl",
        fragmentShader: "BlocksBasic-0e87b49c-6546-3a34-3a44-8a556d7d6c3e/BlocksBasic-0e87b49c-6546-3a34-3a44-8a556d7d6c3e-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "BlocksGem": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_Color: {
                value: new (0, $a0PbU$Vector4)(1, 1, 1, 1)
            },
            u_Shininess: {
                value: 0.9
            },
            u_RimIntensity: {
                value: 0.5
            },
            u_RimPower: {
                value: 2
            },
            u_Frequency: {
                value: 2
            },
            u_Jitter: {
                value: 1
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "BlocksGem-232998f8-d357-47a2-993a-53415df9be10/BlocksGem-232998f8-d357-47a2-993a-53415df9be10-v10.0-vertex.glsl",
        fragmentShader: "BlocksGem-232998f8-d357-47a2-993a-53415df9be10/BlocksGem-232998f8-d357-47a2-993a-53415df9be10-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "BlocksGlass": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_Color: {
                value: new (0, $a0PbU$Vector4)(1, 1, 1, 1)
            },
            u_Shininess: {
                value: 0.8
            },
            u_RimIntensity: {
                value: 0.7
            },
            u_RimPower: {
                value: 4
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "BlocksGlass-3d813d82-5839-4450-8ddc-8e889ecd96c7/BlocksGlass-3d813d82-5839-4450-8ddc-8e889ecd96c7-v10.0-vertex.glsl",
        fragmentShader: "BlocksGlass-3d813d82-5839-4450-8ddc-8e889ecd96c7/BlocksGlass-3d813d82-5839-4450-8ddc-8e889ecd96c7-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Bubbles": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_MainTex: {
                value: "Bubbles-89d104cd-d012-426b-b5b3-bbaee63ac43c/Bubbles-89d104cd-d012-426b-b5b3-bbaee63ac43c-v10.0-MainTex.png"
            }
        },
        vertexShader: "Bubbles-89d104cd-d012-426b-b5b3-bbaee63ac43c/Bubbles-89d104cd-d012-426b-b5b3-bbaee63ac43c-v10.0-vertex.glsl",
        fragmentShader: "Bubbles-89d104cd-d012-426b-b5b3-bbaee63ac43c/Bubbles-89d104cd-d012-426b-b5b3-bbaee63ac43c-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "CelVinyl": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_Cutoff: {
                value: 0.554
            },
            u_MainTex: {
                value: "CelVinyl-700f3aa8-9a7c-2384-8b8a-ea028905dd8c/CelVinyl-700f3aa8-9a7c-2384-8b8a-ea028905dd8c-v10.0-MainTex.png"
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "CelVinyl-700f3aa8-9a7c-2384-8b8a-ea028905dd8c/CelVinyl-700f3aa8-9a7c-2384-8b8a-ea028905dd8c-v10.0-vertex.glsl",
        fragmentShader: "CelVinyl-700f3aa8-9a7c-2384-8b8a-ea028905dd8c/CelVinyl-700f3aa8-9a7c-2384-8b8a-ea028905dd8c-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "ChromaticWave": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            u_EmissionGain: {
                value: 0.45
            }
        },
        vertexShader: "ChromaticWave-0f0ff7b2-a677-45eb-a7d6-0cd7206f4816/ChromaticWave-0f0ff7b2-a677-45eb-a7d6-0cd7206f4816-v10.0-vertex.glsl",
        fragmentShader: "ChromaticWave-0f0ff7b2-a677-45eb-a7d6-0cd7206f4816/ChromaticWave-0f0ff7b2-a677-45eb-a7d6-0cd7206f4816-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 5,
        blendDstAlpha: 201,
        blendDst: 201,
        blendEquationAlpha: 100,
        blendEquation: 100,
        blendSrcAlpha: 201,
        blendSrc: 201
    },
    "CoarseBristles": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_MainTex: {
                value: "CoarseBristles-1161af82-50cf-47db-9706-0c3576d43c43/CoarseBristles-1161af82-50cf-47db-9706-0c3576d43c43-v10.0-MainTex.png"
            },
            u_Cutoff: {
                value: 0.25
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "CoarseBristles-1161af82-50cf-47db-9706-0c3576d43c43/CoarseBristles-1161af82-50cf-47db-9706-0c3576d43c43-v10.0-vertex.glsl",
        fragmentShader: "CoarseBristles-1161af82-50cf-47db-9706-0c3576d43c43/CoarseBristles-1161af82-50cf-47db-9706-0c3576d43c43-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Comet": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_MainTex: {
                value: "Comet-1caa6d7d-f015-3f54-3a4b-8b5354d39f81/Comet-1caa6d7d-f015-3f54-3a4b-8b5354d39f81-v10.0-MainTex.png"
            },
            u_AlphaMask: {
                value: "Comet-1caa6d7d-f015-3f54-3a4b-8b5354d39f81/Comet-1caa6d7d-f015-3f54-3a4b-8b5354d39f81-v10.0-AlphaMask.png"
            },
            u_AlphaMask_TexelSize: {
                value: new (0, $a0PbU$Vector4)(0.0156, 1, 64, 1)
            },
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            u_Speed: {
                value: 1
            },
            u_EmissionGain: {
                value: 0.5
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "Comet-1caa6d7d-f015-3f54-3a4b-8b5354d39f81/Comet-1caa6d7d-f015-3f54-3a4b-8b5354d39f81-v10.0-vertex.glsl",
        fragmentShader: "Comet-1caa6d7d-f015-3f54-3a4b-8b5354d39f81/Comet-1caa6d7d-f015-3f54-3a4b-8b5354d39f81-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "DiamondHull": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_MainTex: {
                value: "DiamondHull-c8313697-2563-47fc-832e-290f4c04b901/DiamondHull-c8313697-2563-47fc-832e-290f4c04b901-v10.0-MainTex.png"
            },
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            cameraPosition: {
                value: new (0, $a0PbU$Vector3)()
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "DiamondHull-c8313697-2563-47fc-832e-290f4c04b901/DiamondHull-c8313697-2563-47fc-832e-290f4c04b901-v10.0-vertex.glsl",
        fragmentShader: "DiamondHull-c8313697-2563-47fc-832e-290f4c04b901/DiamondHull-c8313697-2563-47fc-832e-290f4c04b901-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 5,
        blendDstAlpha: 201,
        blendDst: 201,
        blendEquationAlpha: 100,
        blendEquation: 100,
        blendSrcAlpha: 201,
        blendSrc: 201
    },
    "Disco": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_Shininess: {
                value: 0.65
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0.5147059, 0.5147059, 0.5147059)
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "Disco-4391aaaa-df73-4396-9e33-31e4e4930b27/Disco-4391aaaa-df73-4396-9e33-31e4e4930b27-v10.0-vertex.glsl",
        fragmentShader: "Disco-4391aaaa-df73-4396-9e33-31e4e4930b27/Disco-4391aaaa-df73-4396-9e33-31e4e4930b27-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "DotMarker": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_MainTex: {
                value: "DotMarker-d1d991f2-e7a0-4cf1-b328-f57e915e6260/DotMarker-d1d991f2-e7a0-4cf1-b328-f57e915e6260-v10.0-MainTex.png"
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "DotMarker-d1d991f2-e7a0-4cf1-b328-f57e915e6260/DotMarker-d1d991f2-e7a0-4cf1-b328-f57e915e6260-v10.0-vertex.glsl",
        fragmentShader: "DotMarker-d1d991f2-e7a0-4cf1-b328-f57e915e6260/DotMarker-d1d991f2-e7a0-4cf1-b328-f57e915e6260-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Dots": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_MainTex: {
                value: "Dots-6a1cf9f9-032c-45ec-9b1d-a6680bee30f7/Dots-6a1cf9f9-032c-45ec-9b1d-a6680bee30f7-v10.0-MainTex.png"
            },
            u_TintColor: {
                value: new (0, $a0PbU$Vector4)(1, 1, 1, 1)
            },
            u_EmissionGain: {
                value: 300
            },
            u_BaseGain: {
                value: 0.4
            }
        },
        vertexShader: "Dots-6a1cf9f9-032c-45ec-9b1d-a6680bee30f7/Dots-6a1cf9f9-032c-45ec-9b1d-a6680bee30f7-v10.0-vertex.glsl",
        fragmentShader: "Dots-6a1cf9f9-032c-45ec-9b1d-a6680bee30f7/Dots-6a1cf9f9-032c-45ec-9b1d-a6680bee30f7-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "DoubleTaperedFlat": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_Shininess: {
                value: 0.1500
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0, 0, 0)
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "DoubleTaperedFlat-0d3889f3-3ede-470c-8af4-f44813306126/DoubleTaperedFlat-0d3889f3-3ede-470c-8af4-f44813306126-v10.0-vertex.glsl",
        fragmentShader: "DoubleTaperedFlat-0d3889f3-3ede-470c-8af4-f44813306126/DoubleTaperedFlat-0d3889f3-3ede-470c-8af4-f44813306126-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "DoubleTaperedMarker": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "DoubleTaperedMarker-0d3889f3-3ede-470c-8af4-de4813306126/DoubleTaperedMarker-0d3889f3-3ede-470c-8af4-de4813306126-v10.0-vertex.glsl",
        fragmentShader: "DoubleTaperedMarker-0d3889f3-3ede-470c-8af4-de4813306126/DoubleTaperedMarker-0d3889f3-3ede-470c-8af4-de4813306126-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "DuctTape": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0.5372549, 0.5372549, 0.5372549)
            },
            u_Shininess: {
                value: 0.414
            },
            u_MainTex: {
                value: "DuctTape-3ca16e2f-bdcd-4da2-8631-dcef342f40f1/DuctTape-3ca16e2f-bdcd-4da2-8631-dcef342f40f1-v10.0-MainTex.png"
            },
            u_Cutoff: {
                value: 0.2
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_BumpMap: {
                value: "DuctTape-3ca16e2f-bdcd-4da2-8631-dcef342f40f1/DuctTape-3ca16e2f-bdcd-4da2-8631-dcef342f40f1-v10.0-BumpMap.png"
            },
            u_BumpMap_TexelSize: {
                value: new (0, $a0PbU$Vector4)(0.0010, 0.0078, 1024, 128)
            }
        },
        vertexShader: "DuctTape-d0262945-853c-4481-9cbd-88586bed93cb/DuctTape-d0262945-853c-4481-9cbd-88586bed93cb-v10.0-vertex.glsl",
        fragmentShader: "DuctTape-d0262945-853c-4481-9cbd-88586bed93cb/DuctTape-d0262945-853c-4481-9cbd-88586bed93cb-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Electricity": {
        uniforms: {
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            u_DisplacementIntensity: {
                value: 2.0
            },
            u_EmissionGain: {
                value: 0.2
            }
        },
        vertexShader: "Electricity-f6e85de3-6dcc-4e7f-87fd-cee8c3d25d51/Electricity-f6e85de3-6dcc-4e7f-87fd-cee8c3d25d51-v10.0-vertex.glsl",
        fragmentShader: "Electricity-f6e85de3-6dcc-4e7f-87fd-cee8c3d25d51/Electricity-f6e85de3-6dcc-4e7f-87fd-cee8c3d25d51-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Embers": {
        uniforms: {
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            u_ScrollRate: {
                value: 0.6
            },
            u_ScrollDistance: {
                value: new (0, $a0PbU$Vector3)(-0.2, 0.6, 0)
            },
            u_ScrollJitterIntensity: {
                value: 0.03
            },
            u_ScrollJitterFrequency: {
                value: 5
            },
            u_TintColor: {
                value: new (0, $a0PbU$Vector4)(1, 1, 1, 1)
            },
            u_MainTex: {
                value: "Embers-02ffb866-7fb2-4d15-b761-1012cefb1360/Embers-02ffb866-7fb2-4d15-b761-1012cefb1360-v10.0-MainTex.png"
            },
            u_Cutoff: {
                value: 0.2
            }
        },
        vertexShader: "Embers-02ffb866-7fb2-4d15-b761-1012cefb1360/Embers-02ffb866-7fb2-4d15-b761-1012cefb1360-v10.0-vertex.glsl",
        fragmentShader: "Embers-02ffb866-7fb2-4d15-b761-1012cefb1360/Embers-02ffb866-7fb2-4d15-b761-1012cefb1360-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "EnvironmentDiffuse": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0, 0, 0)
            },
            u_Shininess: {
                value: 0.1500
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_Cutoff: {
                value: 0.2
            }
        },
        vertexShader: "EnvironmentDiffuse-0ad58bbd-42bc-484e-ad9a-b61036ff4ce7/EnvironmentDiffuse-0ad58bbd-42bc-484e-ad9a-b61036ff4ce7-v1.0-vertex.glsl",
        fragmentShader: "EnvironmentDiffuse-0ad58bbd-42bc-484e-ad9a-b61036ff4ce7/EnvironmentDiffuse-0ad58bbd-42bc-484e-ad9a-b61036ff4ce7-v1.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "EnvironmentDiffuseLightMap": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0, 0, 0)
            },
            u_Shininess: {
                value: 0.1500
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_Cutoff: {
                value: 0.2
            }
        },
        vertexShader: "EnvironmentDiffuseLightMap-d01d9d6c-9a61-4aba-8146-5891fafb013b/EnvironmentDiffuseLightMap-d01d9d6c-9a61-4aba-8146-5891fafb013b-v1.0-vertex.glsl",
        fragmentShader: "EnvironmentDiffuseLightMap-d01d9d6c-9a61-4aba-8146-5891fafb013b/EnvironmentDiffuseLightMap-d01d9d6c-9a61-4aba-8146-5891fafb013b-v1.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Fire": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_MainTex: {
                value: "Fire-cb92b597-94ca-4255-b017-0e3f42f12f9e/Fire-cb92b597-94ca-4255-b017-0e3f42f12f9e-v10.0-MainTex.png"
            },
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            u_EmissionGain: {
                value: 0.5
            }
        },
        vertexShader: "Fire-cb92b597-94ca-4255-b017-0e3f42f12f9e/Fire-cb92b597-94ca-4255-b017-0e3f42f12f9e-v10.0-vertex.glsl",
        fragmentShader: "Fire-cb92b597-94ca-4255-b017-0e3f42f12f9e/Fire-cb92b597-94ca-4255-b017-0e3f42f12f9e-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 5,
        blendDstAlpha: 201,
        blendDst: 201,
        blendEquationAlpha: 100,
        blendEquation: 100,
        blendSrcAlpha: 201,
        blendSrc: 201
    },
    "Flat": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_Cutoff: {
                value: 0.2
            }
        },
        vertexShader: "Flat-2d35bcf0-e4d8-452c-97b1-3311be063130/Flat-2d35bcf0-e4d8-452c-97b1-3311be063130-v10.0-vertex.glsl",
        fragmentShader: "Flat-2d35bcf0-e4d8-452c-97b1-3311be063130/Flat-2d35bcf0-e4d8-452c-97b1-3311be063130-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 5,
        blendDstAlpha: 201,
        blendDst: 201,
        blendEquationAlpha: 100,
        blendEquation: 100,
        blendSrcAlpha: 201,
        blendSrc: 201
    },
    "Highlighter": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_MainTex: {
                value: "Highlighter-cf019139-d41c-4eb0-a1d0-5cf54b0a42f3/Highlighter-cf019139-d41c-4eb0-a1d0-5cf54b0a42f3-v10.0-MainTex.png"
            },
            u_Cutoff: {
                value: 0.12
            }
        },
        vertexShader: "Highlighter-cf019139-d41c-4eb0-a1d0-5cf54b0a42f3/Highlighter-cf019139-d41c-4eb0-a1d0-5cf54b0a42f3-v10.0-vertex.glsl",
        fragmentShader: "Highlighter-cf019139-d41c-4eb0-a1d0-5cf54b0a42f3/Highlighter-cf019139-d41c-4eb0-a1d0-5cf54b0a42f3-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Hypercolor": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_Shininess: {
                value: 0.5
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0.2745098, 0.2745098, 0.2745098)
            },
            u_MainTex: {
                value: "Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c/Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c-v10.0-MainTex.png"
            },
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            u_Cutoff: {
                value: 0.5
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_BumpMap: {
                value: "Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c/Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c-v10.0-BumpMap.png"
            },
            u_BumpMap_TexelSize: {
                value: new (0, $a0PbU$Vector4)(0.0010, 0.0078, 1024, 128)
            }
        },
        vertexShader: "Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c/Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c-v10.0-vertex.glsl",
        fragmentShader: "Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c/Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "HyperGrid": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_TintColor: {
                value: new (0, $a0PbU$Vector4)(1, 1, 1, 1)
            },
            u_MainTex: {
                value: "HyperGrid-6a1cf9f9-032c-45ec-9b6e-a6680bee32e9/HyperGrid-6a1cf9f9-032c-45ec-9b6e-a6680bee32e9-v10.0-MainTex.png"
            }
        },
        vertexShader: "HyperGrid-6a1cf9f9-032c-45ec-9b6e-a6680bee32e9/HyperGrid-6a1cf9f9-032c-45ec-9b6e-a6680bee32e9-v10.0-vertex.glsl",
        fragmentShader: "HyperGrid-6a1cf9f9-032c-45ec-9b6e-a6680bee32e9/HyperGrid-6a1cf9f9-032c-45ec-9b6e-a6680bee32e9-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Icing": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0.2352941, 0.2352941, 0.2352941)
            },
            u_Shininess: {
                value: 0.1500
            },
            u_Cutoff: {
                value: 0.5
            },
            u_MainTex: {
                value: "Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37/Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37-v10.0-BumpMap.png"
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_BumpMap: {
                value: "Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37/Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37-v10.0-BumpMap.png"
            },
            u_BumpMap_TexelSize: {
                value: new (0, $a0PbU$Vector4)(0.0010, 0.0078, 1024, 128)
            }
        },
        vertexShader: "Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37/Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37-v10.0-vertex.glsl",
        fragmentShader: "Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37/Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Ink": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0.2352941, 0.2352941, 0.2352941)
            },
            u_Shininess: {
                value: 0.4
            },
            u_Cutoff: {
                value: 0.5
            },
            u_MainTex: {
                value: "Ink-c0012095-3ffd-4040-8ee1-fc180d346eaa/Ink-c0012095-3ffd-4040-8ee1-fc180d346eaa-v10.0-MainTex.png"
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_BumpMap: {
                value: "Ink-c0012095-3ffd-4040-8ee1-fc180d346eaa/Ink-c0012095-3ffd-4040-8ee1-fc180d346eaa-v10.0-BumpMap.png"
            },
            u_BumpMap_TexelSize: {
                value: new (0, $a0PbU$Vector4)(0.0010, 0.0078, 1024, 128)
            }
        },
        vertexShader: "Ink-f5c336cf-5108-4b40-ade9-c687504385ab/Ink-f5c336cf-5108-4b40-ade9-c687504385ab-v10.0-vertex.glsl",
        fragmentShader: "Ink-f5c336cf-5108-4b40-ade9-c687504385ab/Ink-f5c336cf-5108-4b40-ade9-c687504385ab-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Leaves": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0, 0, 0)
            },
            u_Shininess: {
                value: 0.395
            },
            u_Cutoff: {
                value: 0.5
            },
            u_MainTex: {
                value: "Leaves-ea19de07-d0c0-4484-9198-18489a3c1487/Leaves-ea19de07-d0c0-4484-9198-18489a3c1487-v10.0-MainTex.png"
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_BumpMap: {
                value: "Leaves-ea19de07-d0c0-4484-9198-18489a3c1487/Leaves-ea19de07-d0c0-4484-9198-18489a3c1487-v10.0-BumpMap.png"
            },
            u_BumpMap_TexelSize: {
                value: new (0, $a0PbU$Vector4)(0.0010, 0.0078, 1024, 128)
            }
        },
        vertexShader: "Leaves-ea19de07-d0c0-4484-9198-18489a3c1487/Leaves-ea19de07-d0c0-4484-9198-18489a3c1487-v10.0-vertex.glsl",
        fragmentShader: "Leaves-ea19de07-d0c0-4484-9198-18489a3c1487/Leaves-ea19de07-d0c0-4484-9198-18489a3c1487-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Light": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_MainTex: {
                value: "Light-2241cd32-8ba2-48a5-9ee7-2caef7e9ed62/Light-2241cd32-8ba2-48a5-9ee7-2caef7e9ed62-v10.0-MainTex.png"
            },
            u_EmissionGain: {
                value: 0.45
            }
        },
        vertexShader: "Light-2241cd32-8ba2-48a5-9ee7-2caef7e9ed62/Light-2241cd32-8ba2-48a5-9ee7-2caef7e9ed62-v10.0-vertex.glsl",
        fragmentShader: "Light-2241cd32-8ba2-48a5-9ee7-2caef7e9ed62/Light-2241cd32-8ba2-48a5-9ee7-2caef7e9ed62-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 5,
        blendDstAlpha: 201,
        blendDst: 201,
        blendEquationAlpha: 100,
        blendEquation: 100,
        blendSrcAlpha: 201,
        blendSrc: 201
    },
    "LightWire": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_Shininess: {
                value: 0.81
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0.3455882, 0.3455882, 0.3455882)
            },
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_MainTex: {
                value: "LightWire-4391aaaa-df81-4396-9e33-31e4e4930b27/LightWire-4391aaaa-df81-4396-9e33-31e4e4930b27-v10.0-MainTex.png"
            }
        },
        vertexShader: "LightWire-4391aaaa-df81-4396-9e33-31e4e4930b27/LightWire-4391aaaa-df81-4396-9e33-31e4e4930b27-v10.0-vertex.glsl",
        fragmentShader: "LightWire-4391aaaa-df81-4396-9e33-31e4e4930b27/LightWire-4391aaaa-df81-4396-9e33-31e4e4930b27-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Lofted": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "Lofted-d381e0f5-3def-4a0d-8853-31e9200bcbda/Lofted-d381e0f5-3def-4a0d-8853-31e9200bcbda-v10.0-vertex.glsl",
        fragmentShader: "Lofted-d381e0f5-3def-4a0d-8853-31e9200bcbda/Lofted-d381e0f5-3def-4a0d-8853-31e9200bcbda-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Marker": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_MainTex: {
                value: "Marker-429ed64a-4e97-4466-84d3-145a861ef684/Marker-429ed64a-4e97-4466-84d3-145a861ef684-v10.0-MainTex.png"
            },
            u_Cutoff: {
                value: 0.067
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "Marker-429ed64a-4e97-4466-84d3-145a861ef684/Marker-429ed64a-4e97-4466-84d3-145a861ef684-v10.0-vertex.glsl",
        fragmentShader: "Marker-429ed64a-4e97-4466-84d3-145a861ef684/Marker-429ed64a-4e97-4466-84d3-145a861ef684-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "MatteHull": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "MatteHull-79348357-432d-4746-8e29-0e25c112e3aa/MatteHull-79348357-432d-4746-8e29-0e25c112e3aa-v10.0-vertex.glsl",
        fragmentShader: "MatteHull-79348357-432d-4746-8e29-0e25c112e3aa/MatteHull-79348357-432d-4746-8e29-0e25c112e3aa-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "NeonPulse": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            u_EmissionGain: {
                value: 0.5
            }
        },
        vertexShader: "NeonPulse-b2ffef01-eaaa-4ab5-aa64-95a2c4f5dbc6/NeonPulse-b2ffef01-eaaa-4ab5-aa64-95a2c4f5dbc6-v10.0-vertex.glsl",
        fragmentShader: "NeonPulse-b2ffef01-eaaa-4ab5-aa64-95a2c4f5dbc6/NeonPulse-b2ffef01-eaaa-4ab5-aa64-95a2c4f5dbc6-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 5,
        blendDstAlpha: 201,
        blendDst: 201,
        blendEquationAlpha: 100,
        blendEquation: 100,
        blendSrcAlpha: 201,
        blendSrc: 201
    },
    "OilPaint": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0.2352941, 0.2352941, 0.2352941)
            },
            u_Shininess: {
                value: 0.4
            },
            u_Cutoff: {
                value: 0.5
            },
            u_MainTex: {
                value: "OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699/OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699-v10.0-MainTex.png"
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_BumpMap: {
                value: "OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699/OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699-v10.0-BumpMap.png"
            },
            u_BumpMap_TexelSize: {
                value: new (0, $a0PbU$Vector4)(0.0020, 0.0020, 512, 512)
            }
        },
        vertexShader: "OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699/OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699-v10.0-vertex.glsl",
        fragmentShader: "OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699/OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Paper": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0, 0, 0)
            },
            u_Shininess: {
                value: 0.145
            },
            u_Cutoff: {
                value: 0.16
            },
            u_MainTex: {
                value: "Paper-759f1ebd-20cd-4720-8d41-234e0da63716/Paper-759f1ebd-20cd-4720-8d41-234e0da63716-v10.0-MainTex.png"
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_BumpMap: {
                value: "Paper-759f1ebd-20cd-4720-8d41-234e0da63716/Paper-759f1ebd-20cd-4720-8d41-234e0da63716-v10.0-BumpMap.png"
            },
            u_BumpMap_TexelSize: {
                value: new (0, $a0PbU$Vector4)(0.0010, 0.0078, 1024, 128)
            }
        },
        vertexShader: "Paper-f1114e2e-eb8d-4fde-915a-6e653b54e9f5/Paper-f1114e2e-eb8d-4fde-915a-6e653b54e9f5-v10.0-vertex.glsl",
        fragmentShader: "Paper-f1114e2e-eb8d-4fde-915a-6e653b54e9f5/Paper-f1114e2e-eb8d-4fde-915a-6e653b54e9f5-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "PbrTemplate": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0, 0, 0)
            },
            u_Shininess: {
                value: 0.1500
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_Cutoff: {
                value: 0.2
            }
        },
        vertexShader: "PbrTemplate-f86a096c-2f4f-4f9d-ae19-81b99f2944e0/PbrTemplate-f86a096c-2f4f-4f9d-ae19-81b99f2944e0-v1.0-vertex.glsl",
        fragmentShader: "PbrTemplate-f86a096c-2f4f-4f9d-ae19-81b99f2944e0/PbrTemplate-f86a096c-2f4f-4f9d-ae19-81b99f2944e0-v1.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "PbrTransparentTemplate": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0, 0, 0)
            },
            u_Shininess: {
                value: 0.1500
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_Cutoff: {
                value: 0.2
            }
        },
        vertexShader: "PbrTransparentTemplate-19826f62-42ac-4a9e-8b77-4231fbd0cfbf/PbrTransparentTemplate-19826f62-42ac-4a9e-8b77-4231fbd0cfbf-v1.0-vertex.glsl",
        fragmentShader: "PbrTransparentTemplate-19826f62-42ac-4a9e-8b77-4231fbd0cfbf/PbrTransparentTemplate-19826f62-42ac-4a9e-8b77-4231fbd0cfbf-v1.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Petal": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0, 0, 0)
            },
            u_Shininess: {
                value: 0.01
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "Petal-e0abbc80-0f80-e854-4970-8924a0863dcc/Petal-e0abbc80-0f80-e854-4970-8924a0863dcc-v10.0-vertex.glsl",
        fragmentShader: "Petal-e0abbc80-0f80-e854-4970-8924a0863dcc/Petal-e0abbc80-0f80-e854-4970-8924a0863dcc-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    // How did an experimental brush end up here?
    "Plasma": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_MainTex: {
                value: "Plasma-c33714d1-b2f9-412e-bd50-1884c9d46336/Plasma-c33714d1-b2f9-412e-bd50-1884c9d46336-v10.0-MainTex.png"
            },
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            }
        },
        vertexShader: "Plasma-c33714d1-b2f9-412e-bd50-1884c9d46336/Plasma-c33714d1-b2f9-412e-bd50-1884c9d46336-v10.0-vertex.glsl",
        fragmentShader: "Plasma-c33714d1-b2f9-412e-bd50-1884c9d46336/Plasma-c33714d1-b2f9-412e-bd50-1884c9d46336-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Rainbow": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            u_EmissionGain: {
                value: 0.65
            }
        },
        vertexShader: "Rainbow-ad1ad437-76e2-450d-a23a-e17f8310b960/Rainbow-ad1ad437-76e2-450d-a23a-e17f8310b960-v10.0-vertex.glsl",
        fragmentShader: "Rainbow-ad1ad437-76e2-450d-a23a-e17f8310b960/Rainbow-ad1ad437-76e2-450d-a23a-e17f8310b960-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 5,
        blendDstAlpha: 201,
        blendDst: 201,
        blendEquationAlpha: 100,
        blendEquation: 100,
        blendSrcAlpha: 201,
        blendSrc: 201
    },
    "ShinyHull": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0.1985294, 0.1985294, 0.1985294)
            },
            u_Shininess: {
                value: 0.7430
            },
            u_Cutoff: {
                value: 0.5
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "ShinyHull-faaa4d44-fcfb-4177-96be-753ac0421ba3/ShinyHull-faaa4d44-fcfb-4177-96be-753ac0421ba3-v10.0-vertex.glsl",
        fragmentShader: "ShinyHull-faaa4d44-fcfb-4177-96be-753ac0421ba3/ShinyHull-faaa4d44-fcfb-4177-96be-753ac0421ba3-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Smoke": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_TintColor: {
                value: new (0, $a0PbU$Vector4)(1, 1, 1, 1)
            },
            u_MainTex: {
                value: "Smoke-70d79cca-b159-4f35-990c-f02193947fe8/Smoke-70d79cca-b159-4f35-990c-f02193947fe8-v10.0-MainTex.png"
            }
        },
        vertexShader: "Smoke-70d79cca-b159-4f35-990c-f02193947fe8/Smoke-70d79cca-b159-4f35-990c-f02193947fe8-v10.0-vertex.glsl",
        fragmentShader: "Smoke-70d79cca-b159-4f35-990c-f02193947fe8/Smoke-70d79cca-b159-4f35-990c-f02193947fe8-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Snow": {
        uniforms: {
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            u_ScrollRate: {
                value: 0.2
            },
            u_ScrollDistance: {
                value: new (0, $a0PbU$Vector3)(0, -0.3, 0)
            },
            u_ScrollJitterIntensity: {
                value: 0.01
            },
            u_ScrollJitterFrequency: {
                value: 12
            },
            u_TintColor: {
                value: new (0, $a0PbU$Vector4)(1, 1, 1, 1)
            },
            u_MainTex: {
                value: "Snow-d902ed8b-d0d1-476c-a8de-878a79e3a34c/Snow-d902ed8b-d0d1-476c-a8de-878a79e3a34c-v10.0-MainTex.png"
            }
        },
        vertexShader: "Snow-d902ed8b-d0d1-476c-a8de-878a79e3a34c/Snow-d902ed8b-d0d1-476c-a8de-878a79e3a34c-v10.0-vertex.glsl",
        fragmentShader: "Snow-d902ed8b-d0d1-476c-a8de-878a79e3a34c/Snow-d902ed8b-d0d1-476c-a8de-878a79e3a34c-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "SoftHighlighter": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_MainTex: {
                value: "SoftHighlighter-accb32f5-4509-454f-93f8-1df3fd31df1b/SoftHighlighter-accb32f5-4509-454f-93f8-1df3fd31df1b-v10.0-MainTex.png"
            }
        },
        vertexShader: "SoftHighlighter-accb32f5-4509-454f-93f8-1df3fd31df1b/SoftHighlighter-accb32f5-4509-454f-93f8-1df3fd31df1b-v10.0-vertex.glsl",
        fragmentShader: "SoftHighlighter-accb32f5-4509-454f-93f8-1df3fd31df1b/SoftHighlighter-accb32f5-4509-454f-93f8-1df3fd31df1b-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 5,
        blendDstAlpha: 201,
        blendDst: 201,
        blendEquationAlpha: 100,
        blendEquation: 100,
        blendSrcAlpha: 201,
        blendSrc: 201
    },
    "Spikes": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "Spikes-cf7f0059-7aeb-53a4-2b67-c83d863a9ffa/Spikes-cf7f0059-7aeb-53a4-2b67-c83d863a9ffa-v10.0-vertex.glsl",
        fragmentShader: "Spikes-cf7f0059-7aeb-53a4-2b67-c83d863a9ffa/Spikes-cf7f0059-7aeb-53a4-2b67-c83d863a9ffa-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Splatter": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_MainTex: {
                value: "Splatter-7a1c8107-50c5-4b70-9a39-421576d6617e/Splatter-7a1c8107-50c5-4b70-9a39-421576d6617e-v10.0-MainTex.png"
            },
            u_Cutoff: {
                value: 0.2
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "Splatter-7a1c8107-50c5-4b70-9a39-421576d6617e/Splatter-7a1c8107-50c5-4b70-9a39-421576d6617e-v10.0-vertex.glsl",
        fragmentShader: "Splatter-7a1c8107-50c5-4b70-9a39-421576d6617e/Splatter-7a1c8107-50c5-4b70-9a39-421576d6617e-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Stars": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            u_SparkleRate: {
                value: 5.3
            },
            u_MainTex: {
                value: "Stars-0eb4db27-3f82-408d-b5a1-19ebd7d5b711/Stars-0eb4db27-3f82-408d-b5a1-19ebd7d5b711-v10.0-MainTex.png"
            }
        },
        vertexShader: "Stars-0eb4db27-3f82-408d-b5a1-19ebd7d5b711/Stars-0eb4db27-3f82-408d-b5a1-19ebd7d5b711-v10.0-vertex.glsl",
        fragmentShader: "Stars-0eb4db27-3f82-408d-b5a1-19ebd7d5b711/Stars-0eb4db27-3f82-408d-b5a1-19ebd7d5b711-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Streamers": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_MainTex: {
                value: "Streamers-44bb800a-fbc3-4592-8426-94ecb05ddec3/Streamers-44bb800a-fbc3-4592-8426-94ecb05ddec3-v10.0-MainTex.png"
            },
            u_EmissionGain: {
                value: 0.4
            },
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            }
        },
        vertexShader: "Streamers-44bb800a-fbc3-4592-8426-94ecb05ddec3/Streamers-44bb800a-fbc3-4592-8426-94ecb05ddec3-v10.0-vertex.glsl",
        fragmentShader: "Streamers-44bb800a-fbc3-4592-8426-94ecb05ddec3/Streamers-44bb800a-fbc3-4592-8426-94ecb05ddec3-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Taffy": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_MainTex: {
                value: "Taffy-0077f88c-d93a-42f3-b59b-b31c50cdb414/Taffy-0077f88c-d93a-42f3-b59b-b31c50cdb414-v10.0-MainTex.png"
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "Taffy-0077f88c-d93a-42f3-b59b-b31c50cdb414/Taffy-0077f88c-d93a-42f3-b59b-b31c50cdb414-v10.0-vertex.glsl",
        fragmentShader: "Taffy-0077f88c-d93a-42f3-b59b-b31c50cdb414/Taffy-0077f88c-d93a-42f3-b59b-b31c50cdb414-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "TaperedFlat": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_MainTex: {
                value: "TaperedFlat-b468c1fb-f254-41ed-8ec9-57030bc5660c/TaperedFlat-b468c1fb-f254-41ed-8ec9-57030bc5660c-v10.0-MainTex.png"
            },
            u_Cutoff: {
                value: 0.067
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "TaperedFlat-b468c1fb-f254-41ed-8ec9-57030bc5660c/TaperedFlat-b468c1fb-f254-41ed-8ec9-57030bc5660c-v10.0-vertex.glsl",
        fragmentShader: "TaperedFlat-b468c1fb-f254-41ed-8ec9-57030bc5660c/TaperedFlat-b468c1fb-f254-41ed-8ec9-57030bc5660c-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "TaperedMarker": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_MainTex: {
                value: "TaperedMarker-d90c6ad8-af0f-4b54-b422-e0f92abe1b3c/TaperedMarker-d90c6ad8-af0f-4b54-b422-e0f92abe1b3c-v10.0-MainTex.png"
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "TaperedMarker-d90c6ad8-af0f-4b54-b422-e0f92abe1b3c/TaperedMarker-d90c6ad8-af0f-4b54-b422-e0f92abe1b3c-v10.0-vertex.glsl",
        fragmentShader: "TaperedMarker-d90c6ad8-af0f-4b54-b422-e0f92abe1b3c/TaperedMarker-d90c6ad8-af0f-4b54-b422-e0f92abe1b3c-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "TaperedMarker_Flat": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0, 0, 0)
            },
            u_Shininess: {
                value: 0.1500
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_MainTex: {
                value: "TaperedMarker_Flat-1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0/TaperedMarker_Flat-1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0-v10.0-MainTex.png"
            },
            u_Cutoff: {
                value: 0.2
            }
        },
        vertexShader: "TaperedMarker_Flat-1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0/TaperedMarker_Flat-1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0-v10.0-vertex.glsl",
        fragmentShader: "TaperedMarker_Flat-1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0/TaperedMarker_Flat-1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "ThickPaint": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0.2352941, 0.2352941, 0.2352941)
            },
            u_Shininess: {
                value: 0.4
            },
            u_Cutoff: {
                value: 0.5
            },
            u_MainTex: {
                value: "ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f/ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f-v10.0-MainTex.png"
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_BumpMap: {
                value: "ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f/ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f-v10.0-BumpMap.png"
            },
            u_BumpMap_TexelSize: {
                value: new (0, $a0PbU$Vector4)(0.0010, 0.0078, 1024, 128)
            }
        },
        vertexShader: "ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f/ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f-v10.0-vertex.glsl",
        fragmentShader: "ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f/ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Toon": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "Toon-4391385a-df73-4396-9e33-31e4e4930b27/Toon-4391385a-df73-4396-9e33-31e4e4930b27-v10.0-vertex.glsl",
        fragmentShader: "Toon-4391385a-df73-4396-9e33-31e4e4930b27/Toon-4391385a-df73-4396-9e33-31e4e4930b27-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "UnlitHull": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "UnlitHull-a8fea537-da7c-4d4b-817f-24f074725d6d/UnlitHull-a8fea537-da7c-4d4b-817f-24f074725d6d-v10.0-vertex.glsl",
        fragmentShader: "UnlitHull-a8fea537-da7c-4d4b-817f-24f074725d6d/UnlitHull-a8fea537-da7c-4d4b-817f-24f074725d6d-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "VelvetInk": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_MainTex: {
                value: "VelvetInk-d229d335-c334-495a-a801-660ac8a87360/VelvetInk-d229d335-c334-495a-a801-660ac8a87360-v10.0-MainTex.png"
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "VelvetInk-d229d335-c334-495a-a801-660ac8a87360/VelvetInk-d229d335-c334-495a-a801-660ac8a87360-v10.0-vertex.glsl",
        fragmentShader: "VelvetInk-d229d335-c334-495a-a801-660ac8a87360/VelvetInk-d229d335-c334-495a-a801-660ac8a87360-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Waveform": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_EmissionGain: {
                value: 0.5178571
            },
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            u_MainTex: {
                value: "Waveform-10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab/Waveform-10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab-v10.0-MainTex.png"
            }
        },
        vertexShader: "Waveform-10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab/Waveform-10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab-v10.0-vertex.glsl",
        fragmentShader: "Waveform-10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab/Waveform-10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "WetPaint": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_SpecColor: {
                value: new (0, $a0PbU$Vector3)(0.1397059, 0.1397059, 0.1397059)
            },
            u_Shininess: {
                value: 0.85
            },
            u_Cutoff: {
                value: 0.3
            },
            u_MainTex: {
                value: "WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3/WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3-v10.0-MainTex.png"
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            },
            u_BumpMap: {
                value: "WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3/WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3-v10.0-BumpMap.png"
            },
            u_BumpMap_TexelSize: {
                value: new (0, $a0PbU$Vector4)(0.0010, 0.0078, 1024, 128)
            }
        },
        vertexShader: "WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3/WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3-v10.0-vertex.glsl",
        fragmentShader: "WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3/WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "WigglyGraphite": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_time: {
                value: new (0, $a0PbU$Vector4)()
            },
            u_ambient_light_color: {
                value: new (0, $a0PbU$Vector4)(0.3922, 0.3922, 0.3922, 1)
            },
            u_SceneLight_0_color: {
                value: new (0, $a0PbU$Vector4)(0.7780, 0.8157, 0.9914, 1)
            },
            u_SceneLight_1_color: {
                value: new (0, $a0PbU$Vector4)(0.4282, 0.4212, 0.3459, 1)
            },
            u_Cutoff: {
                value: 0.5
            },
            u_MainTex: {
                value: "WigglyGraphite-5347acf0-a8e2-47b6-8346-30c70719d763/WigglyGraphite-5347acf0-a8e2-47b6-8346-30c70719d763-v10.0-MainTex.png"
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "WigglyGraphite-5347acf0-a8e2-47b6-8346-30c70719d763/WigglyGraphite-5347acf0-a8e2-47b6-8346-30c70719d763-v10.0-vertex.glsl",
        fragmentShader: "WigglyGraphite-5347acf0-a8e2-47b6-8346-30c70719d763/WigglyGraphite-5347acf0-a8e2-47b6-8346-30c70719d763-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Wire": {
        uniforms: {
            u_SceneLight_0_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_SceneLight_1_matrix: {
                value: [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            u_fogColor: {
                value: new (0, $a0PbU$Vector3)(0.0196, 0.0196, 0.0196)
            },
            u_fogDensity: {
                value: 0
            }
        },
        vertexShader: "Wire-4391385a-cf83-4396-9e33-31e4e4930b27/Wire-4391385a-cf83-4396-9e33-31e4e4930b27-v10.0-vertex.glsl",
        fragmentShader: "Wire-4391385a-cf83-4396-9e33-31e4e4930b27/Wire-4391385a-cf83-4396-9e33-31e4e4930b27-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    }
};


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


class $ca086492148dd3fa$export$2b011a5b12963d65 {
    constructor(parser, brushPath){
        this.name = "GOOGLE_tilt_brush_material";
        this.altName = "GOOGLE_tilt_brush_techniques";
        this.parser = parser;
        this.brushPath = brushPath;
        // Quick repair of path if required
        if (this.brushPath.slice(this.brushPath.length - 1) !== "/") this.brushPath += "/";
        this.tiltShaderLoader = new (0, $cf098bb13503440d$export$bcc22bf437a07d8f)(parser.options.manager);
        this.tiltShaderLoader.setPath(brushPath);
        this.clock = new (0, $a0PbU$Clock)();
    }
    beforeRoot() {
        const parser = this.parser;
        const json = parser.json;
        if (!this.isTiltGltf(json)) return null;
        json.materials.forEach((material)=>{
            const extensionsDef = material.extensions;
            if (!extensionsDef || !(extensionsDef[this.name] || extensionsDef[this.altName])) {
                console.log("No extension found", this.name);
                return;
            }
            let guid;
            if (extensionsDef[this.name]) guid = extensionsDef[this.name].guid;
            else guid = material.name.replace("material_", "");
            const materialParams = this.tiltShaderLoader.lookupMaterial(guid);
            //MainTex
            if (material?.pbrMetallicRoughness?.baseColorTexture) {
                const mainTex = json.images[material.pbrMetallicRoughness.baseColorTexture.index];
                mainTex.uri = this.brushPath + materialParams.uniforms.u_MainTex.value;
            }
            //BumpMap
            if (material?.normalTexture) {
                const bumpMap = json.images[material.normalTexture.index];
                bumpMap.uri = this.brushPath + materialParams.uniforms.u_BumpMap.value;
            }
        });
    }
    afterRoot(glTF) {
        const parser = this.parser;
        const json = parser.json;
        if (!this.isTiltGltf(json)) return null;
        const shaderResolves = [];
        for (const scene of glTF.scenes)scene.traverse(async (object)=>{
            const association = parser.associations.get(object);
            if (association === undefined || association.meshes === undefined) return;
            const mesh = json.meshes[association.meshes];
            mesh.primitives.forEach((prim)=>{
                if (!prim.material) return;
                const material = json.materials[prim.material];
                const extensionsDef = material.extensions;
                if (!extensionsDef || !(extensionsDef[this.name] || extensionsDef[this.altName])) {
                    console.log("No extension found", this.name);
                    return;
                }
                let guid;
                if (extensionsDef[this.name]) guid = extensionsDef[this.name].guid;
                else guid = material.name.replace("material_", "");
                shaderResolves.push(this.replaceMaterial(object, guid));
            });
        });
        return Promise.all(shaderResolves);
    }
    isTiltGltf(json) {
        let isTiltGltf = false;
        isTiltGltf ||= json.extensionsUsed && json.extensionsUsed.includes(this.name);
        isTiltGltf ||= json.extensionsUsed && json.extensionsUsed.includes(this.altName);
        isTiltGltf ||= "extensions" in json && this.name in json["extensions"];
        isTiltGltf ||= "extensions" in json && this.altName in json["extensions"];
        return isTiltGltf;
    }
    async replaceMaterial(mesh, guid) {
        let shader;
        switch(guid){
            case "0e87b49c-6546-3a34-3a44-8a556d7d6c3e":
                mesh.geometry.name = "geometry_BlocksBasic";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                //mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("BlocksBasic");
                shader.lights = true;
                shader.fog = true;
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
                shader.fog = true;
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
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_BlocksGlass";
                break;
            case "89d104cd-d012-426b-b5b3-bbaee63ac43c":
                mesh.geometry.name = "geometry_Bubbles";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                if (mesh.geometry.getAttribute("_tb_unity_normal")) mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("_tb_unity_normal"));
                if (mesh.geometry.getAttribute("normal")) mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                if (mesh.geometry.getAttribute("texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("Bubbles");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Bubbles";
                break;
            case "700f3aa8-9a7c-2384-8b8a-ea028905dd8c":
                mesh.geometry.name = "geometry_CelVinyl";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("CelVinyl");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_CelVinyl";
                break;
            case "0f0ff7b2-a677-45eb-a7d6-0cd7206f4816":
                mesh.geometry.name = "geometry_ChromaticWave";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("ChromaticWave");
                shader.lights = true;
                shader.fog = true;
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
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("CoarseBristles");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_CoarseBristles";
                break;
            case "1caa6d7d-f015-3f54-3a4b-8b5354d39f81":
                mesh.geometry.name = "geometry_Comet";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Comet");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Comet";
                break;
            case "c8313697-2563-47fc-832e-290f4c04b901":
                mesh.geometry.name = "geometry_DiamondHull";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("DiamondHull");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_DiamondHull";
                break;
            case "4391aaaa-df73-4396-9e33-31e4e4930b27":
                mesh.geometry.name = "geometry_Disco";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Disco");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Disco";
                break;
            case "d1d991f2-e7a0-4cf1-b328-f57e915e6260":
                mesh.geometry.name = "geometry_DotMarker";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("DotMarker");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_DotMarker";
                break;
            case "6a1cf9f9-032c-45ec-9b1d-a6680bee30f7":
                mesh.geometry.name = "geometry_Dots";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                if (mesh.geometry.getAttribute("_tb_unity_normal")) mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("_tb_unity_normal"));
                if (mesh.geometry.getAttribute("normal")) mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                if (mesh.geometry.getAttribute("texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("Dots");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Dots";
                break;
            case "0d3889f3-3ede-470c-8af4-f44813306126":
                mesh.geometry.name = "geometry_DoubleTaperedFlat";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("DoubleTaperedFlat");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_DoubleTaperedFlat";
                break;
            case "0d3889f3-3ede-470c-8af4-de4813306126":
                mesh.geometry.name = "geometry_DoubleTaperedMarker";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("DoubleTaperedMarker");
                shader.lights = true;
                shader.fog = true;
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
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("DuctTape");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_DuctTape";
                break;
            case "f6e85de3-6dcc-4e7f-87fd-cee8c3d25d51":
                mesh.geometry.name = "geometry_Electricity";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                if (mesh.geometry.getAttribute("texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("Electricity");
                mesh.material = shader;
                mesh.material.name = "material_Electricity";
                break;
            case "02ffb866-7fb2-4d15-b761-1012cefb1360":
                mesh.geometry.name = "geometry_Embers";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                if (mesh.geometry.getAttribute("_tb_unity_normal")) mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("_tb_unity_normal"));
                if (mesh.geometry.getAttribute("normal")) mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                if (mesh.geometry.getAttribute("texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("Embers");
                mesh.material = shader;
                mesh.material.name = "material_Embers";
                break;
            case "0ad58bbd-42bc-484e-ad9a-b61036ff4ce7":
                mesh.geometry.name = "geometry_EnvironmentDiffuse";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("EnvironmentDiffuse");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_EnvironmentDiffuse";
                break;
            case "d01d9d6c-9a61-4aba-8146-5891fafb013b":
                mesh.geometry.name = "geometry_EnvironmentDiffuseLightMap";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("EnvironmentDiffuseLightMap");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_EnvironmentDiffuseLightMap";
                break;
            case "cb92b597-94ca-4255-b017-0e3f42f12f9e":
                mesh.geometry.name = "geometry_Fire";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
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
                mesh.geometry.name = "geometry_Flat";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Flat");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Flat";
                break;
            case "cf019139-d41c-4eb0-a1d0-5cf54b0a42f3":
                mesh.geometry.name = "geometry_Highlighter";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Highlighter");
                shader.lights = true;
                shader.fog = true;
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
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Hypercolor");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Hypercolor";
                break;
            case "6a1cf9f9-032c-45ec-9b6e-a6680bee32e9":
                mesh.geometry.name = "geometry_HyperGrid";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                if (mesh.geometry.getAttribute("texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("HyperGrid");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_HyperGrid";
                break;
            case "2f212815-f4d3-c1a4-681a-feeaf9c6dc37":
                mesh.geometry.name = "geometry_Icing";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Icing");
                shader.lights = true;
                shader.fog = true;
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
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Ink");
                shader.lights = true;
                shader.fog = true;
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
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Leaves");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Leaves";
                break;
            case "2241cd32-8ba2-48a5-9ee7-2caef7e9ed62":
                mesh.geometry.name = "geometry_Light";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Light");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Light";
                break;
            case "4391aaaa-df81-4396-9e33-31e4e4930b27":
                mesh.geometry.name = "geometry_LightWire";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("LightWire");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_LightWire";
                break;
            case "d381e0f5-3def-4a0d-8853-31e9200bcbda":
                mesh.geometry.name = "geometry_Lofted";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Lofted");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Lofted";
                break;
            case "429ed64a-4e97-4466-84d3-145a861ef684":
                mesh.geometry.name = "geometry_Marker";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Marker");
                shader.lights = true;
                shader.fog = true;
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
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_MatteHull";
                break;
            case "b2ffef01-eaaa-4ab5-aa64-95a2c4f5dbc6":
                mesh.geometry.name = "geometry_NeonPulse";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("NeonPulse");
                shader.lights = true;
                shader.fog = true;
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
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("OilPaint");
                shader.lights = true;
                shader.fog = true;
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
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Paper");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Paper";
                break;
            case "f86a096c-2f4f-4f9d-ae19-81b99f2944e0":
                mesh.geometry.name = "geometry_PbrTemplate";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("PbrTemplate");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_PbrTemplate";
                break;
            case "19826f62-42ac-4a9e-8b77-4231fbd0cfbf":
                mesh.geometry.name = "geometry_PbrTransparentTemplate";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("PbrTransparentTemplate");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_PbrTransparentTemplate";
                break;
            case "e0abbc80-0f80-e854-4970-8924a0863dcc":
                mesh.geometry.name = "geometry_Petal";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Petal");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Petal";
                break;
            case "c33714d1-b2f9-412e-bd50-1884c9d46336":
                mesh.geometry.name = "geometry_Plasma";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Plasma");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Plasma";
                break;
            case "ad1ad437-76e2-450d-a23a-e17f8310b960":
                mesh.geometry.name = "geometry_Rainbow";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Rainbow");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Rainbow";
                break;
            case "faaa4d44-fcfb-4177-96be-753ac0421ba3":
                mesh.geometry.name = "geometry_ShinyHull";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("ShinyHull");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_ShinyHull";
                break;
            case "70d79cca-b159-4f35-990c-f02193947fe8":
                mesh.geometry.name = "geometry_Smoke";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                if (mesh.geometry.getAttribute("_tb_unity_normal")) mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("_tb_unity_normal"));
                if (mesh.geometry.getAttribute("normal")) mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                if (mesh.geometry.getAttribute("texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("Smoke");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Smoke";
                break;
            case "d902ed8b-d0d1-476c-a8de-878a79e3a34c":
                mesh.geometry.name = "geometry_Snow";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                if (mesh.geometry.getAttribute("_tb_unity_normal")) mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("_tb_unity_normal"));
                if (mesh.geometry.getAttribute("normal")) mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                if (mesh.geometry.getAttribute("texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("Snow");
                mesh.material = shader;
                mesh.material.name = "material_Snow";
                break;
            case "accb32f5-4509-454f-93f8-1df3fd31df1b":
                mesh.geometry.name = "geometry_SoftHighlighter";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("SoftHighlighter");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_SoftHighlighter";
                break;
            case "cf7f0059-7aeb-53a4-2b67-c83d863a9ffa":
                mesh.geometry.name = "geometry_Spikes";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Spikes");
                shader.lights = true;
                shader.fog = true;
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
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Splatter");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Splatter";
                break;
            case "0eb4db27-3f82-408d-b5a1-19ebd7d5b711":
                mesh.geometry.name = "geometry_Stars";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                if (mesh.geometry.getAttribute("_tb_unity_normal")) mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("_tb_unity_normal"));
                if (mesh.geometry.getAttribute("normal")) mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("_tb_unity_texcoord_1"));
                if (mesh.geometry.getAttribute("texcoord_1")) mesh.geometry.setAttribute("a_texcoord1", mesh.geometry.getAttribute("texcoord_1"));
                shader = await this.tiltShaderLoader.loadAsync("Stars");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Stars";
                break;
            case "44bb800a-fbc3-4592-8426-94ecb05ddec3":
                mesh.geometry.name = "geometry_Streamers";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Streamers");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_Streamers";
                break;
            case "0077f88c-d93a-42f3-b59b-b31c50cdb414":
                mesh.geometry.name = "geometry_Taffy";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Taffy");
                shader.lights = true;
                shader.fog = true;
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
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("TaperedFlat");
                shader.lights = true;
                shader.fog = true;
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
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("TaperedMarker");
                shader.lights = true;
                shader.fog = true;
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
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("ThickPaint");
                shader.lights = true;
                shader.fog = true;
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
                shader.fog = true;
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
                shader.fog = true;
                mesh.material = shader;
                mesh.material.name = "material_UnlitHull";
                break;
            case "d229d335-c334-495a-a801-660ac8a87360":
                mesh.geometry.name = "geometry_VelvetInk";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("VelvetInk");
                shader.lights = true;
                shader.fog = true;
                shader.uniformsNeedUpdate = true;
                mesh.material = shader;
                mesh.material.name = "material_VelvetInk";
                break;
            case "10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab":
                mesh.geometry.name = "geometry_Waveform";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("Waveform");
                shader.lights = true;
                shader.fog = true;
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
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("WetPaint");
                shader.lights = true;
                shader.fog = true;
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
                if (mesh.geometry.getAttribute("_tb_unity_texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("_tb_unity_texcoord_0"));
                if (mesh.geometry.getAttribute("texcoord_0")) mesh.geometry.setAttribute("a_texcoord0", mesh.geometry.getAttribute("texcoord_0"));
                shader = await this.tiltShaderLoader.loadAsync("WigglyGraphite");
                shader.lights = true;
                shader.fog = true;
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
        mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group)=>{
            if (material.uniforms["u_time"]) {
                const elapsedTime = this.clock.getElapsedTime();
                // _Time from https://docs.unity3d.com/Manual/SL-UnityShaderVariables.html
                const time = new (0, $a0PbU$Vector4)(elapsedTime / 20, elapsedTime, elapsedTime * 2, elapsedTime * 3);
                material.uniforms["u_time"].value = time;
            }
            if (material.uniforms["cameraPosition"]) material.uniforms["cameraPosition"].value = camera.position;
            if (material?.uniforms?.directionalLights?.value) {
                // Main Light
                if (material.uniforms.directionalLights.value[0]) // Color
                {
                    if (material.uniforms.u_SceneLight_0_color) {
                        const color = material.uniforms.directionalLights.value[0].color;
                        material.uniforms.u_SceneLight_0_color.value = new (0, $a0PbU$Vector4)(color.r, color.g, color.b, 1);
                    }
                }
                // Shadow Light
                if (material.uniforms.directionalLights.value[1]) // Color
                {
                    if (material.uniforms.u_SceneLight_1_color) {
                        const color = material.uniforms.directionalLights.value[1].color;
                        material.uniforms.u_SceneLight_1_color.value = new (0, $a0PbU$Vector4)(color.r, color.g, color.b, 1);
                    }
                }
            }
            // Ambient Light
            if (material?.uniforms?.ambientLightColor?.value) {
                if (material.uniforms.u_ambient_light_color) {
                    const colorArray = material.uniforms.ambientLightColor.value;
                    material.uniforms.u_ambient_light_color.value = new (0, $a0PbU$Vector4)(colorArray[0], colorArray[1], colorArray[2], 1);
                }
            }
            // Fog
            if (material?.uniforms?.fogColor?.value) {
                if (material.uniforms.u_fogColor) {
                    const colorArray = material.uniforms.fogColor.value;
                    material.uniforms.u_fogColor.value = colorArray;
                }
            }
            if (material?.uniforms?.fogDensity?.value) {
                if (material.uniforms.u_fogDensity) material.uniforms.u_fogDensity.value = material.uniforms.fogDensity.value;
            }
        };
    }
}


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


class $d838b23e95c97ee8$export$24723e25468f5bb7 {
    constructor(parser, brushPath){
        this.name = "GOOGLE_tilt_brush_techniques";
        this.parser = parser;
        this.brushPath = brushPath;
        this.materialDefs = {
            "f72ec0e7-a844-4e38-82e3-140c44772699": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.600000024
                },
                "normalTexture": {
                    "texCoord": 0
                },
                "name": "brush_OilPaint",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "f72ec0e7-a844-4e38-82e3-140c44772699"
                    }
                }
            },
            "f5c336cf-5108-4b40-ade9-c687504385ab": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.600000024
                },
                "normalTexture": {
                    "texCoord": 0
                },
                "name": "brush_Ink",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "f5c336cf-5108-4b40-ade9-c687504385ab"
                    }
                }
            },
            "75b32cf0-fdd6-4d89-a64b-e2a00b247b0f": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.600000024
                },
                "normalTexture": {
                    "texCoord": 0
                },
                "name": "brush_ThickPaint",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "75b32cf0-fdd6-4d89-a64b-e2a00b247b0f"
                    }
                }
            },
            "b67c0e81-ce6d-40a8-aeb0-ef036b081aa3": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.300000012,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.149999976
                },
                "normalTexture": {
                    "texCoord": 0
                },
                "name": "brush_WetPaint",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "b67c0e81-ce6d-40a8-aeb0-ef036b081aa3"
                    }
                }
            },
            "429ed64a-4e97-4466-84d3-145a861ef684": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.0670000017,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Marker",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "429ed64a-4e97-4466-84d3-145a861ef684"
                    }
                }
            },
            "d90c6ad8-af0f-4b54-b422-e0f92abe1b3c": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.0670000017,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_TaperedMarker",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "d90c6ad8-af0f-4b54-b422-e0f92abe1b3c"
                    }
                }
            },
            "0d3889f3-3ede-470c-8af4-de4813306126": {
                "alphaMode": "OPAQUE",
                "doubleSided": true,
                "name": "brush_DoubleTaperedMarker",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "0d3889f3-3ede-470c-8af4-de4813306126"
                    }
                }
            },
            "cf019139-d41c-4eb0-a1d0-5cf54b0a42f3": {
                "alphaMode": "BLEND",
                "alphaCutoff": 0.119999997,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Highlighter",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "cf019139-d41c-4eb0-a1d0-5cf54b0a42f3"
                    }
                }
            },
            "2d35bcf0-e4d8-452c-97b1-3311be063130": {
                "alphaMode": "OPAQUE",
                "doubleSided": true,
                "name": "brush_Flat",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "2d35bcf0-e4d8-452c-97b1-3311be063130"
                    }
                }
            },
            "b468c1fb-f254-41ed-8ec9-57030bc5660c": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.0670000017,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_TaperedFlat",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "b468c1fb-f254-41ed-8ec9-57030bc5660c"
                    }
                }
            },
            "0d3889f3-3ede-470c-8af4-f44813306126": {
                "alphaMode": "OPAQUE",
                "doubleSided": true,
                "name": "brush_DoubleTaperedFlat",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "0d3889f3-3ede-470c-8af4-f44813306126"
                    }
                }
            },
            "accb32f5-4509-454f-93f8-1df3fd31df1b": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_SoftHighlighter",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "accb32f5-4509-454f-93f8-1df3fd31df1b"
                    }
                }
            },
            "2241cd32-8ba2-48a5-9ee7-2caef7e9ed62": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Light",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "2241cd32-8ba2-48a5-9ee7-2caef7e9ed62"
                    }
                }
            },
            "cb92b597-94ca-4255-b017-0e3f42f12f9e": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Fire",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "cb92b597-94ca-4255-b017-0e3f42f12f9e"
                    }
                }
            },
            "02ffb866-7fb2-4d15-b761-1012cefb1360": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Embers",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "02ffb866-7fb2-4d15-b761-1012cefb1360"
                    }
                }
            },
            "70d79cca-b159-4f35-990c-f02193947fe8": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Smoke",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "70d79cca-b159-4f35-990c-f02193947fe8"
                    }
                }
            },
            "ad1ad437-76e2-450d-a23a-e17f8310b960": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "name": "brush_Rainbow",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "ad1ad437-76e2-450d-a23a-e17f8310b960"
                    }
                }
            },
            "0eb4db27-3f82-408d-b5a1-19ebd7d5b711": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Stars",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "0eb4db27-3f82-408d-b5a1-19ebd7d5b711"
                    }
                }
            },
            "d229d335-c334-495a-a801-660ac8a87360": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_VelvetInk",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "d229d335-c334-495a-a801-660ac8a87360"
                    }
                }
            },
            "10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Waveform",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab"
                    }
                }
            },
            "8dc4a70c-d558-4efd-a5ed-d4e860f40dc3": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.200000003,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Splatter",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "8dc4a70c-d558-4efd-a5ed-d4e860f40dc3"
                    }
                }
            },
            "d0262945-853c-4481-9cbd-88586bed93cb": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.200000003,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.585999966
                },
                "normalTexture": {
                    "texCoord": 0
                },
                "name": "brush_DuctTape",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "d0262945-853c-4481-9cbd-88586bed93cb"
                    }
                }
            },
            "f1114e2e-eb8d-4fde-915a-6e653b54e9f5": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.159999996,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.855000019
                },
                "normalTexture": {
                    "texCoord": 0
                },
                "name": "brush_Paper",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "f1114e2e-eb8d-4fde-915a-6e653b54e9f5"
                    }
                }
            },
            "d902ed8b-d0d1-476c-a8de-878a79e3a34c": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Snow",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "d902ed8b-d0d1-476c-a8de-878a79e3a34c"
                    }
                }
            },
            "1161af82-50cf-47db-9706-0c3576d43c43": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.25,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_CoarseBristles",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "1161af82-50cf-47db-9706-0c3576d43c43"
                    }
                }
            },
            "5347acf0-a8e2-47b6-8346-30c70719d763": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_WigglyGraphite",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "5347acf0-a8e2-47b6-8346-30c70719d763"
                    }
                }
            },
            "f6e85de3-6dcc-4e7f-87fd-cee8c3d25d51": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "name": "brush_Electricity",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "f6e85de3-6dcc-4e7f-87fd-cee8c3d25d51"
                    }
                }
            },
            "44bb800a-fbc3-4592-8426-94ecb05ddec3": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Streamers",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "44bb800a-fbc3-4592-8426-94ecb05ddec3"
                    }
                }
            },
            "dce872c2-7b49-4684-b59b-c45387949c5c": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.5
                },
                "normalTexture": {
                    "texCoord": 0
                },
                "name": "brush_Hypercolor",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "dce872c2-7b49-4684-b59b-c45387949c5c"
                    }
                }
            },
            "89d104cd-d012-426b-b5b3-bbaee63ac43c": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Bubbles",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "89d104cd-d012-426b-b5b3-bbaee63ac43c"
                    }
                }
            },
            "b2ffef01-eaaa-4ab5-aa64-95a2c4f5dbc6": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "name": "brush_NeonPulse",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "b2ffef01-eaaa-4ab5-aa64-95a2c4f5dbc6"
                    }
                }
            },
            "700f3aa8-9a7c-2384-8b8a-ea028905dd8c": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.55400002,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_CelVinyl",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "700f3aa8-9a7c-2384-8b8a-ea028905dd8c"
                    }
                }
            },
            "6a1cf9f9-032c-45ec-9b6e-a6680bee32e9": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_HyperGrid",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "6a1cf9f9-032c-45ec-9b6e-a6680bee32e9"
                    }
                }
            },
            "4391aaaa-df81-4396-9e33-31e4e4930b27": {
                "alphaMode": "OPAQUE",
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.189999998
                },
                "name": "brush_LightWire",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "4391aaaa-df81-4396-9e33-31e4e4930b27"
                    }
                }
            },
            "0f0ff7b2-a677-45eb-a7d6-0cd7206f4816": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "name": "brush_ChromaticWave",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "0f0ff7b2-a677-45eb-a7d6-0cd7206f4816"
                    }
                }
            },
            "6a1cf9f9-032c-45ec-9b1d-a6680bee30f7": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Dots",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "6a1cf9f9-032c-45ec-9b1d-a6680bee30f7"
                    }
                }
            },
            "e0abbc80-0f80-e854-4970-8924a0863dcc": {
                "alphaMode": "OPAQUE",
                "doubleSided": true,
                "name": "brush_Petal",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "e0abbc80-0f80-e854-4970-8924a0863dcc"
                    }
                }
            },
            "2f212815-f4d3-c1a4-681a-feeaf9c6dc37": {
                "alphaMode": "OPAQUE",
                "alphaCutoff": 0.5,
                "pbrMetallicRoughness": {
                    "metallicFactor": 0,
                    "roughnessFactor": 0.850000024
                },
                "normalTexture": {
                    "texCoord": 0
                },
                "name": "brush_Icing",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "2f212815-f4d3-c1a4-681a-feeaf9c6dc37"
                    }
                }
            },
            "4391385a-df73-4396-9e33-31e4e4930b27": {
                "alphaMode": "OPAQUE",
                "name": "brush_Toon",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "4391385a-df73-4396-9e33-31e4e4930b27"
                    }
                }
            },
            "4391385a-cf83-4396-9e33-31e4e4930b27": {
                "alphaMode": "OPAQUE",
                "alphaCutoff": 0.0670000017,
                "doubleSided": true,
                "name": "brush_Wire",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "4391385a-cf83-4396-9e33-31e4e4930b27"
                    }
                }
            },
            "cf7f0059-7aeb-53a4-2b67-c83d863a9ffa": {
                "alphaMode": "OPAQUE",
                "name": "brush_Spikes",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "cf7f0059-7aeb-53a4-2b67-c83d863a9ffa"
                    }
                }
            },
            "d381e0f5-3def-4a0d-8853-31e9200bcbda": {
                "alphaMode": "OPAQUE",
                "name": "brush_Lofted",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "d381e0f5-3def-4a0d-8853-31e9200bcbda"
                    }
                }
            },
            "4391aaaa-df73-4396-9e33-31e4e4930b27": {
                "alphaMode": "OPAQUE",
                "name": "brush_Disco",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "4391aaaa-df73-4396-9e33-31e4e4930b27"
                    }
                }
            },
            "1caa6d7d-f015-3f54-3a4b-8b5354d39f81": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Comet",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "1caa6d7d-f015-3f54-3a4b-8b5354d39f81"
                    }
                }
            },
            "faaa4d44-fcfb-4177-96be-753ac0421ba3": {
                "alphaMode": "OPAQUE",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "name": "brush_ShinyHull",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "faaa4d44-fcfb-4177-96be-753ac0421ba3"
                    }
                }
            },
            "79348357-432d-4746-8e29-0e25c112e3aa": {
                "alphaMode": "OPAQUE",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "name": "brush_MatteHull",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "79348357-432d-4746-8e29-0e25c112e3aa"
                    }
                }
            },
            "a8fea537-da7c-4d4b-817f-24f074725d6d": {
                "alphaMode": "OPAQUE",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "name": "brush_UnlitHull",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "a8fea537-da7c-4d4b-817f-24f074725d6d"
                    }
                }
            },
            "c8313697-2563-47fc-832e-290f4c04b901": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_DiamondHull",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "c8313697-2563-47fc-832e-290f4c04b901"
                    }
                }
            }
        };
        // Quick repair of path if required
        if (this.brushPath.slice(this.brushPath.length - 1) !== "/") this.brushPath += "/";
        this.tiltShaderLoader = new (0, $cf098bb13503440d$export$bcc22bf437a07d8f)(parser.options.manager);
        this.tiltShaderLoader.setPath(brushPath);
        this.clock = new (0, $a0PbU$Clock)();
    }
    beforeRoot() {
        const parser = this.parser;
        const json = parser.json;
        if (!json.extensionsUsed || !json.extensionsUsed.includes(this.name)) return null;
        if (!json.extensionsUsed.includes("GOOGLE_tilt_brush_material")) json.extensionsUsed.push("GOOGLE_tilt_brush_material");
        json.materials.map((material, index)=>{
            const extensionsDef = material.extensions;
            if (!extensionsDef || !extensionsDef[this.name]) return;
            const guid = material.name.replace("material_", "");
            json.materials[index] = this.materialDefs[guid];
            //MainTex
            let mainTexIndex = extensionsDef.GOOGLE_tilt_brush_techniques.values.MainTex;
            if (mainTexIndex !== undefined) json.materials[index].pbrMetallicRoughness.baseColorTexture.index = mainTexIndex;
            //BumpMap
            let bumpMapIndex = extensionsDef.GOOGLE_tilt_brush_techniques.values.BumpMap;
            if (bumpMapIndex !== undefined) json.materials[index].normalTexture.index = bumpMapIndex;
        });
    }
}




export {$cf098bb13503440d$export$bcc22bf437a07d8f as TiltShaderLoader, $ca086492148dd3fa$export$2b011a5b12963d65 as GLTFGoogleTiltBrushMaterialExtension, $d838b23e95c97ee8$export$24723e25468f5bb7 as GLTFGoogleTiltBrushTechniquesExtension};
//# sourceMappingURL=three-icosa.module.js.map
