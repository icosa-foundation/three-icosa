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
    lookupMaterialParams(materialName) {
        return $cf098bb13503440d$var$tiltBrushMaterialParams[materialName] || null;
    }
    lookupMaterialName(nameOrGuid) {
        // Open Brush "new glb" exports prefix the material names
        if (nameOrGuid?.startsWith("ob-")) nameOrGuid = nameOrGuid.substring(3);
        switch(nameOrGuid){
            // Standard brushes
            case "BlocksBasic:":
            case "BlocksPaper":
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
            case "Highlighter":
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
            case "Wire":
            case "4391385a-cf83-4396-9e33-31e4e4930b27":
                return "Wire";
            // Experimental brushes
            case "cf3401b3-4ada-4877-995a-1aa64e7b604a":
            case "SvgTemplate":
                return "SvgTemplate";
            case "1b897b7e-9b76-425a-b031-a867c48df409":
            case "4465b5ef-3605-bec4-2b3e-6b04508ddb6b":
            case "Gouache":
                return "Gouache";
            case "8e58ceea-7830-49b4-aba9-6215104ab52a":
            case "MylarTube":
                return "MylarTube";
            case "03a529e1-f519-3dd4-582d-2d5cd92c3f4f":
            case "Rain":
                return "Rain";
            case "725f4c6a-6427-6524-29ab-da371924adab":
            case "DryBrush":
                return "DryBrush";
            case "ddda8745-4bb5-ac54-88b6-d1480370583e":
            case "LeakyPen":
                return "LeakyPen";
            case "50e99447-3861-05f4-697d-a1b96e771b98":
            case "Sparks":
                return "Sparks";
            case "7136a729-1aab-bd24-f8b2-ca88b6adfb67":
            case "Wind":
                return "Wind";
            case "a8147ce1-005e-abe4-88e8-09a1eaadcc89":
            case "Rising Bubbles":
                return "Rising Bubbles";
            case "9568870f-8594-60f4-1b20-dfbc8a5eac0e":
            case "TaperedWire":
                return "TaperedWire";
            case "2e03b1bf-3ebd-4609-9d7e-f4cafadc4dfa":
            case "SquarePaper":
                return "SquarePaper";
            case "39ee7377-7a9e-47a7-a0f8-0c77712f75d3":
            case "ThickGeometry":
                return "ThickGeometry";
            case "2c1a6a63-6552-4d23-86d7-58f6fba8581b":
            case "Wireframe":
                return "Wireframe";
            case "61d2ef63-ed60-49b3-85fb-7267b7d234f2":
            case "CandyCane":
                return "CandyCane";
            case "20a0bf1a-a96e-44e5-84ac-9823d2d65023":
            case "HolidayTree":
                return "HolidayTree";
            case "2b65cd94-9259-4f10-99d2-d54b6664ac33":
            case "Snowflake":
                return "Snowflake";
            case "22d4f434-23e4-49d9-a9bd-05798aa21e58":
            case "Braid3":
                return "Braid3";
            case "f28c395c-a57d-464b-8f0b-558c59478fa3":
            case "Muscle":
                return "Muscle";
            case "99aafe96-1645-44cd-99bd-979bc6ef37c5":
            case "Guts":
                return "Guts";
            case "53d753ef-083c-45e1-98e7-4459b4471219":
            case "Fire2":
                return "Fire2";
            case "9871385a-df73-4396-9e33-31e4e4930b27":
            case "TubeToonInverted":
                return "TubeToonInverted";
            case "4391ffaa-df73-4396-9e33-31e4e4930b27":
            case "FacetedTube":
                return "FacetedTube";
            case "6a1cf9f9-032c-45ec-9b6e-a6680bee30f7":
            case "WaveformParticles":
                return "WaveformParticles";
            case "eba3f993-f9a1-4d35-b84e-bb08f48981a4":
            case "BubbleWand":
                return "BubbleWand";
            case "6a1cf9f9-032c-45ec-311e-a6680bee32e9":
            case "DanceFloor":
                return "DanceFloor";
            case "0f5820df-cb6b-4a6c-960e-56e4c8000eda":
            case "WaveformTube":
                return "WaveformTube";
            case "492b36ff-b337-436a-ba5f-1e87ee86747e":
            case "Drafting":
                return "Drafting";
            case "f0a2298a-be80-432c-9fee-a86dcc06f4f9":
            case "SingleSided":
                return "SingleSided";
            case "f4a0550c-332a-4e1a-9793-b71508f4a454":
            case "DoubleFlat":
                return "DoubleFlat";
            case "c1c9b26d-673a-4dc6-b373-51715654ab96":
            case "TubeAdditive":
                return "TubeAdditive";
            case "a555b809-2017-46cb-ac26-e63173d8f45e":
            case "Feather":
                return "Feather";
            case "84d5bbb2-6634-8434-f8a7-681b576b4664":
            case "DuctTapeGeometry":
                return "DuctTapeGeometry";
            case "3d9755da-56c7-7294-9b1d-5ec349975f52":
            case "TaperedHueShift":
                return "TaperedHueShift";
            case "1cf94f63-f57a-4a1a-ad14-295af4f5ab5c":
            case "Lacewing":
                return "Lacewing";
            case "c86c058d-1bda-2e94-08db-f3d6a96ac4a1":
            case "Marbled Rainbow":
                return "Marbled Rainbow";
            case "fde6e778-0f7a-e584-38d6-89d44cee59f6":
            case "Charcoal":
                return "Charcoal";
            case "f8ba3d18-01fc-4d7b-b2d9-b99d10b8e7cf":
            case "KeijiroTube":
                return "KeijiroTube";
            case "c5da2e70-a6e4-63a4-898c-5cfedef09c97":
            case "Lofted (Hue Shift)":
                return "Lofted (Hue Shift)";
            case "62fef968-e842-3224-4a0e-1fdb7cfb745c":
            case "Wire (Lit)":
                return "Wire (Lit)";
            case "d120944d-772f-4062-99c6-46a6f219eeaf":
            case "WaveformFFT":
                return "WaveformFFT";
            case "d9cc5e99-ace1-4d12-96e0-4a7c18c99cfc":
            case "Fairy":
                return "Fairy";
            case "bdf65db2-1fb7-4202-b5e0-c6b5e3ea851e":
            case "Space":
                return "Space";
            case "30cb9af6-be41-4872-8f3e-cbff63fe3db8":
            case "Digital":
                return "Digital";
            case "abfbb2aa-70b4-4a5c-8126-8eedda2b3628":
            case "Race":
                return "Race";
            case "355b3579-bf1d-4ff5-a200-704437fe684b":
            case "SmoothHull":
                return "SmoothHull";
            case "7259cce5-41c1-ec74-c885-78af28a31d95":
            case "Leaves2":
                return "Leaves2";
            case "7c972c27-d3c2-8af4-7bf8-5d9db8f0b7bb":
            case "InkGeometry":
                return "InkGeometry";
            case "7ae1f880-a517-44a0-99f9-1cab654498c6":
            case "ConcaveHull":
                return "ConcaveHull";
            case "d3f3b18a-da03-f694-b838-28ba8e749a98":
            case "3D Printing Brush":
                return "3D Printing Brush";
            case "cc131ff8-0d17-4677-93e0-d7cd19fea9ac":
            case "PassthroughHull":
                return "PassthroughHull";
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
    },
    "SvgTemplate": {
        // TODO Uniforms: SvgTemplate
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
        vertexShader: "SvgTemplate-cf3401b3-4ada-4877-995a-1aa64e7b604a/SvgTemplate-cf3401b3-4ada-4877-995a-1aa64e7b604a-v10.0-vertex.glsl",
        fragmentShader: "SvgTemplate-cf3401b3-4ada-4877-995a-1aa64e7b604a/SvgTemplate-cf3401b3-4ada-4877-995a-1aa64e7b604a-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Gouache": {
        // TODO Uniforms: Gouache
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
        vertexShader: "Gouache-4465b5ef-3605-bec4-2b3e-6b04508ddb6b/Gouache-4465b5ef-3605-bec4-2b3e-6b04508ddb6b-v10.0-vertex.glsl",
        fragmentShader: "Gouache-4465b5ef-3605-bec4-2b3e-6b04508ddb6b/Gouache-4465b5ef-3605-bec4-2b3e-6b04508ddb6b-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "MylarTube": {
        // TODO Uniforms: MylarTube
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
        vertexShader: "MylarTube-8e58ceea-7830-49b4-aba9-6215104ab52a/MylarTube-8e58ceea-7830-49b4-aba9-6215104ab52a-v10.0-vertex.glsl",
        fragmentShader: "MylarTube-8e58ceea-7830-49b4-aba9-6215104ab52a/MylarTube-8e58ceea-7830-49b4-aba9-6215104ab52a-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Rain": {
        // TODO Uniforms: Rain
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
        vertexShader: "Rain-03a529e1-f519-3dd4-582d-2d5cd92c3f4f/Rain-03a529e1-f519-3dd4-582d-2d5cd92c3f4f-v10.0-vertex.glsl",
        fragmentShader: "Rain-03a529e1-f519-3dd4-582d-2d5cd92c3f4f/Rain-03a529e1-f519-3dd4-582d-2d5cd92c3f4f-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "DryBrush": {
        // TODO Uniforms: DryBrush
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
        vertexShader: "DryBrush-725f4c6a-6427-6524-29ab-da371924adab/DryBrush-725f4c6a-6427-6524-29ab-da371924adab-v10.0-vertex.glsl",
        fragmentShader: "DryBrush-725f4c6a-6427-6524-29ab-da371924adab/DryBrush-725f4c6a-6427-6524-29ab-da371924adab-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "LeakyPen": {
        // TODO Uniforms: LeakyPen
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
        vertexShader: "LeakyPen-ddda8745-4bb5-ac54-88b6-d1480370583e/LeakyPen-ddda8745-4bb5-ac54-88b6-d1480370583e-v10.0-vertex.glsl",
        fragmentShader: "LeakyPen-ddda8745-4bb5-ac54-88b6-d1480370583e/LeakyPen-ddda8745-4bb5-ac54-88b6-d1480370583e-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Sparks": {
        // TODO Uniforms: Sparks
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
        vertexShader: "Sparks-50e99447-3861-05f4-697d-a1b96e771b98/Sparks-50e99447-3861-05f4-697d-a1b96e771b98-v10.0-vertex.glsl",
        fragmentShader: "Sparks-50e99447-3861-05f4-697d-a1b96e771b98/Sparks-50e99447-3861-05f4-697d-a1b96e771b98-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Wind": {
        // TODO Uniforms: Wind
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
        vertexShader: "Wind-7136a729-1aab-bd24-f8b2-ca88b6adfb67/Wind-7136a729-1aab-bd24-f8b2-ca88b6adfb67-v10.0-vertex.glsl",
        fragmentShader: "Wind-7136a729-1aab-bd24-f8b2-ca88b6adfb67/Wind-7136a729-1aab-bd24-f8b2-ca88b6adfb67-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Rising Bubbles": {
        // TODO Uniforms and name fix: RisingTODO Uniforms: Bubbles
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
        vertexShader: "Rising%20Bubbles-a8147ce1-005e-abe4-88e8-09a1eaadcc89/Rising%20Bubbles-a8147ce1-005e-abe4-88e8-09a1eaadcc89-v10.0-vertex.glsl",
        fragmentShader: "Rising%20Bubbles-a8147ce1-005e-abe4-88e8-09a1eaadcc89/Rising%20Bubbles-a8147ce1-005e-abe4-88e8-09a1eaadcc89-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "TaperedWire": {
        // TODO Uniforms: TaperedWire
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
        vertexShader: "TaperedWire-9568870f-8594-60f4-1b20-dfbc8a5eac0e/TaperedWire-9568870f-8594-60f4-1b20-dfbc8a5eac0e-v10.0-vertex.glsl",
        fragmentShader: "TaperedWire-9568870f-8594-60f4-1b20-dfbc8a5eac0e/TaperedWire-9568870f-8594-60f4-1b20-dfbc8a5eac0e-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "SquarePaper": {
        // TODO Uniforms: SquarePaper
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
        vertexShader: "SquarePaper-2e03b1bf-3ebd-4609-9d7e-f4cafadc4dfa/SquarePaper-2e03b1bf-3ebd-4609-9d7e-f4cafadc4dfa-v10.0-vertex.glsl",
        fragmentShader: "SquarePaper-2e03b1bf-3ebd-4609-9d7e-f4cafadc4dfa/SquarePaper-2e03b1bf-3ebd-4609-9d7e-f4cafadc4dfa-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "ThickGeometry": {
        // TODO Uniforms: ThickGeometry
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
        vertexShader: "ThickGeometry-39ee7377-7a9e-47a7-a0f8-0c77712f75d3/ThickGeometry-39ee7377-7a9e-47a7-a0f8-0c77712f75d3-v10.0-vertex.glsl",
        fragmentShader: "ThickGeometry-39ee7377-7a9e-47a7-a0f8-0c77712f75d3/ThickGeometry-39ee7377-7a9e-47a7-a0f8-0c77712f75d3-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Wireframe": {
        // TODO Uniforms: Wireframe
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
        vertexShader: "Wireframe-2c1a6a63-6552-4d23-86d7-58f6fba8581b/Wireframe-2c1a6a63-6552-4d23-86d7-58f6fba8581b-v10.0-vertex.glsl",
        fragmentShader: "Wireframe-2c1a6a63-6552-4d23-86d7-58f6fba8581b/Wireframe-2c1a6a63-6552-4d23-86d7-58f6fba8581b-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "CandyCane": {
        // TODO Uniforms: CandyCane
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
        vertexShader: "CandyCane-61d2ef63-ed60-49b3-85fb-7267b7d234f2/CandyCane-61d2ef63-ed60-49b3-85fb-7267b7d234f2-v10.0-vertex.glsl",
        fragmentShader: "CandyCane-61d2ef63-ed60-49b3-85fb-7267b7d234f2/CandyCane-61d2ef63-ed60-49b3-85fb-7267b7d234f2-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "HolidayTree": {
        // TODO Uniforms: HolidayTree
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
        vertexShader: "HolidayTree-20a0bf1a-a96e-44e5-84ac-9823d2d65023/HolidayTree-20a0bf1a-a96e-44e5-84ac-9823d2d65023-v10.0-vertex.glsl",
        fragmentShader: "HolidayTree-20a0bf1a-a96e-44e5-84ac-9823d2d65023/HolidayTree-20a0bf1a-a96e-44e5-84ac-9823d2d65023-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Snowflake": {
        // TODO Uniforms: Snowflake
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
        vertexShader: "Snowflake-2b65cd94-9259-4f10-99d2-d54b6664ac33/Snowflake-2b65cd94-9259-4f10-99d2-d54b6664ac33-v10.0-vertex.glsl",
        fragmentShader: "Snowflake-2b65cd94-9259-4f10-99d2-d54b6664ac33/Snowflake-2b65cd94-9259-4f10-99d2-d54b6664ac33-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Braid3": {
        // TODO Uniforms: Braid3
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
        vertexShader: "Braid3-22d4f434-23e4-49d9-a9bd-05798aa21e58/Braid3-22d4f434-23e4-49d9-a9bd-05798aa21e58-v10.0-vertex.glsl",
        fragmentShader: "Braid3-22d4f434-23e4-49d9-a9bd-05798aa21e58/Braid3-22d4f434-23e4-49d9-a9bd-05798aa21e58-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Muscle": {
        // TODO Uniforms: Muscle
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
        vertexShader: "Muscle-f28c395c-a57d-464b-8f0b-558c59478fa3/Muscle-f28c395c-a57d-464b-8f0b-558c59478fa3-v10.0-vertex.glsl",
        fragmentShader: "Muscle-f28c395c-a57d-464b-8f0b-558c59478fa3/Muscle-f28c395c-a57d-464b-8f0b-558c59478fa3-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Guts": {
        // TODO Uniforms: Guts
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
        vertexShader: "Guts-99aafe96-1645-44cd-99bd-979bc6ef37c5/Guts-99aafe96-1645-44cd-99bd-979bc6ef37c5-v10.0-vertex.glsl",
        fragmentShader: "Guts-99aafe96-1645-44cd-99bd-979bc6ef37c5/Guts-99aafe96-1645-44cd-99bd-979bc6ef37c5-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Fire2": {
        // TODO Uniforms: Fire2
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
        vertexShader: "Fire2-53d753ef-083c-45e1-98e7-4459b4471219/Fire2-53d753ef-083c-45e1-98e7-4459b4471219-v10.0-vertex.glsl",
        fragmentShader: "Fire2-53d753ef-083c-45e1-98e7-4459b4471219/Fire2-53d753ef-083c-45e1-98e7-4459b4471219-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "TubeToonInverted": {
        // TODO Uniforms: TubeToonInverted
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
        vertexShader: "TubeToonInverted-9871385a-df73-4396-9e33-31e4e4930b27/TubeToonInverted-9871385a-df73-4396-9e33-31e4e4930b27-v10.0-vertex.glsl",
        fragmentShader: "TubeToonInverted-9871385a-df73-4396-9e33-31e4e4930b27/TubeToonInverted-9871385a-df73-4396-9e33-31e4e4930b27-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "FacetedTube": {
        // TODO Uniforms: FacetedTube
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
        vertexShader: "FacetedTube-4391ffaa-df73-4396-9e33-31e4e4930b27/FacetedTube-4391ffaa-df73-4396-9e33-31e4e4930b27-v10.0-vertex.glsl",
        fragmentShader: "FacetedTube-4391ffaa-df73-4396-9e33-31e4e4930b27/FacetedTube-4391ffaa-df73-4396-9e33-31e4e4930b27-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "WaveformParticles": {
        // TODO Uniforms: WaveformParticles
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
        vertexShader: "WaveformParticles-6a1cf9f9-032c-45ec-9b6e-a6680bee30f7/WaveformParticles-6a1cf9f9-032c-45ec-9b6e-a6680bee30f7-v10.0-vertex.glsl",
        fragmentShader: "WaveformParticles-6a1cf9f9-032c-45ec-9b6e-a6680bee30f7/WaveformParticles-6a1cf9f9-032c-45ec-9b6e-a6680bee30f7-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "BubbleWand": {
        // TODO Uniforms: BubbleWand
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
        vertexShader: "BubbleWand-eba3f993-f9a1-4d35-b84e-bb08f48981a4/BubbleWand-eba3f993-f9a1-4d35-b84e-bb08f48981a4-v10.0-vertex.glsl",
        fragmentShader: "BubbleWand-eba3f993-f9a1-4d35-b84e-bb08f48981a4/BubbleWand-eba3f993-f9a1-4d35-b84e-bb08f48981a4-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "DanceFloor": {
        // TODO Uniforms: DanceFloor
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
        vertexShader: "DanceFloor-6a1cf9f9-032c-45ec-311e-a6680bee32e9/DanceFloor-6a1cf9f9-032c-45ec-311e-a6680bee32e9-v10.0-vertex.glsl",
        fragmentShader: "DanceFloor-6a1cf9f9-032c-45ec-311e-a6680bee32e9/DanceFloor-6a1cf9f9-032c-45ec-311e-a6680bee32e9-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "WaveformTube": {
        // TODO Uniforms: WaveformTube
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
        vertexShader: "WaveformTube-0f5820df-cb6b-4a6c-960e-56e4c8000eda/WaveformTube-0f5820df-cb6b-4a6c-960e-56e4c8000eda-v10.0-vertex.glsl",
        fragmentShader: "WaveformTube-0f5820df-cb6b-4a6c-960e-56e4c8000eda/WaveformTube-0f5820df-cb6b-4a6c-960e-56e4c8000eda-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Drafting": {
        // TODO Uniforms: Drafting
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
        vertexShader: "Drafting-492b36ff-b337-436a-ba5f-1e87ee86747e/Drafting-492b36ff-b337-436a-ba5f-1e87ee86747e-v10.0-vertex.glsl",
        fragmentShader: "Drafting-492b36ff-b337-436a-ba5f-1e87ee86747e/Drafting-492b36ff-b337-436a-ba5f-1e87ee86747e-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "SingleSided": {
        // TODO Uniforms: SingleSided
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
        vertexShader: "SingleSided-f0a2298a-be80-432c-9fee-a86dcc06f4f9/SingleSided-f0a2298a-be80-432c-9fee-a86dcc06f4f9-v10.0-vertex.glsl",
        fragmentShader: "SingleSided-f0a2298a-be80-432c-9fee-a86dcc06f4f9/SingleSided-f0a2298a-be80-432c-9fee-a86dcc06f4f9-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "DoubleFlat": {
        // TODO Uniforms: DoubleFlat
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
        vertexShader: "DoubleFlat-f4a0550c-332a-4e1a-9793-b71508f4a454/DoubleFlat-f4a0550c-332a-4e1a-9793-b71508f4a454-v10.0-vertex.glsl",
        fragmentShader: "DoubleFlat-f4a0550c-332a-4e1a-9793-b71508f4a454/DoubleFlat-f4a0550c-332a-4e1a-9793-b71508f4a454-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "TubeAdditive": {
        // TODO Uniforms: TubeAdditive
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
        vertexShader: "TubeAdditive-c1c9b26d-673a-4dc6-b373-51715654ab96/TubeAdditive-c1c9b26d-673a-4dc6-b373-51715654ab96-v10.0-vertex.glsl",
        fragmentShader: "TubeAdditive-c1c9b26d-673a-4dc6-b373-51715654ab96/TubeAdditive-c1c9b26d-673a-4dc6-b373-51715654ab96-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Feather": {
        // TODO Uniforms: Feather
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
        vertexShader: "Feather-a555b809-2017-46cb-ac26-e63173d8f45e/Feather-a555b809-2017-46cb-ac26-e63173d8f45e-v10.0-vertex.glsl",
        fragmentShader: "Feather-a555b809-2017-46cb-ac26-e63173d8f45e/Feather-a555b809-2017-46cb-ac26-e63173d8f45e-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "DuctTapeGeometry": {
        // TODO Uniforms: DuctTapeGeometry
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
        vertexShader: "DuctTapeGeometry-84d5bbb2-6634-8434-f8a7-681b576b4664/DuctTapeGeometry-84d5bbb2-6634-8434-f8a7-681b576b4664-v10.0-vertex.glsl",
        fragmentShader: "DuctTapeGeometry-84d5bbb2-6634-8434-f8a7-681b576b4664/DuctTapeGeometry-84d5bbb2-6634-8434-f8a7-681b576b4664-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "TaperedHueShift": {
        // TODO Uniforms: TaperedHueShift
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
        vertexShader: "TaperedHueShift-3d9755da-56c7-7294-9b1d-5ec349975f52/TaperedHueShift-3d9755da-56c7-7294-9b1d-5ec349975f52-v10.0-vertex.glsl",
        fragmentShader: "TaperedHueShift-3d9755da-56c7-7294-9b1d-5ec349975f52/TaperedHueShift-3d9755da-56c7-7294-9b1d-5ec349975f52-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Lacewing": {
        // TODO Uniforms: Lacewing
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
        vertexShader: "Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c/Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c-v10.0-vertex.glsl",
        fragmentShader: "Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c/Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Marbled Rainbow": {
        // TODO Uniforms and name fix: Marbled Rainbow
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
        vertexShader: "Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1/Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1-v10.0-vertex.glsl",
        fragmentShader: "Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1/Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Charcoal": {
        // TODO Uniforms: Charcoal
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
        vertexShader: "Charcoal-fde6e778-0f7a-e584-38d6-89d44cee59f6/Charcoal-fde6e778-0f7a-e584-38d6-89d44cee59f6-v10.0-vertex.glsl",
        fragmentShader: "Charcoal-fde6e778-0f7a-e584-38d6-89d44cee59f6/Charcoal-fde6e778-0f7a-e584-38d6-89d44cee59f6-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "KeijiroTube": {
        // TODO Uniforms: KeijiroTube
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
        vertexShader: "KeijiroTube-f8ba3d18-01fc-4d7b-b2d9-b99d10b8e7cf/KeijiroTube-f8ba3d18-01fc-4d7b-b2d9-b99d10b8e7cf-v10.0-vertex.glsl",
        fragmentShader: "KeijiroTube-f8ba3d18-01fc-4d7b-b2d9-b99d10b8e7cf/KeijiroTube-f8ba3d18-01fc-4d7b-b2d9-b99d10b8e7cf-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Lofted (Hue Shift)": {
        // TODO Uniforms and name fix: Lofted (Hue Shift)
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
        vertexShader: "Lofted (Hue Shift)-c5da2e70-a6e4-63a4-898c-5cfedef09c97/Lofted (Hue Shift)-c5da2e70-a6e4-63a4-898c-5cfedef09c97-v10.0-vertex.glsl",
        fragmentShader: "Lofted (Hue Shift)-c5da2e70-a6e4-63a4-898c-5cfedef09c97/Lofted (Hue Shift)-c5da2e70-a6e4-63a4-898c-5cfedef09c97-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Wire (Lit)": {
        // TODO Uniforms and name fix: Wire (Lit)
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
        vertexShader: "Wire (Lit)-62fef968-e842-3224-4a0e-1fdb7cfb745c/Wire (Lit)-62fef968-e842-3224-4a0e-1fdb7cfb745c-v10.0-vertex.glsl",
        fragmentShader: "Wire (Lit)-62fef968-e842-3224-4a0e-1fdb7cfb745c/Wire (Lit)-62fef968-e842-3224-4a0e-1fdb7cfb745c-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "WaveformFFT": {
        // TODO Uniforms: WaveformFFT
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
        vertexShader: "WaveformFFT-d120944d-772f-4062-99c6-46a6f219eeaf/WaveformFFT-d120944d-772f-4062-99c6-46a6f219eeaf-v10.0-vertex.glsl",
        fragmentShader: "WaveformFFT-d120944d-772f-4062-99c6-46a6f219eeaf/WaveformFFT-d120944d-772f-4062-99c6-46a6f219eeaf-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Fairy": {
        // TODO Uniforms: Fairy
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
        vertexShader: "Fairy-d9cc5e99-ace1-4d12-96e0-4a7c18c99cfc/Fairy-d9cc5e99-ace1-4d12-96e0-4a7c18c99cfc-v10.0-vertex.glsl",
        fragmentShader: "Fairy-d9cc5e99-ace1-4d12-96e0-4a7c18c99cfc/Fairy-d9cc5e99-ace1-4d12-96e0-4a7c18c99cfc-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Space": {
        // TODO Uniforms: Space
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
        vertexShader: "Space-bdf65db2-1fb7-4202-b5e0-c6b5e3ea851e/Space-bdf65db2-1fb7-4202-b5e0-c6b5e3ea851e-v10.0-vertex.glsl",
        fragmentShader: "Space-bdf65db2-1fb7-4202-b5e0-c6b5e3ea851e/Space-bdf65db2-1fb7-4202-b5e0-c6b5e3ea851e-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Digital": {
        // TODO Uniforms: Digital
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
        vertexShader: "Digital-30cb9af6-be41-4872-8f3e-cbff63fe3db8/Digital-30cb9af6-be41-4872-8f3e-cbff63fe3db8-v10.0-vertex.glsl",
        fragmentShader: "Digital-30cb9af6-be41-4872-8f3e-cbff63fe3db8/Digital-30cb9af6-be41-4872-8f3e-cbff63fe3db8-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Race": {
        // TODO Uniforms: Race
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
        vertexShader: "Race-abfbb2aa-70b4-4a5c-8126-8eedda2b3628/Race-abfbb2aa-70b4-4a5c-8126-8eedda2b3628-v10.0-vertex.glsl",
        fragmentShader: "Race-abfbb2aa-70b4-4a5c-8126-8eedda2b3628/Race-abfbb2aa-70b4-4a5c-8126-8eedda2b3628-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "SmoothHull": {
        // TODO Uniforms: SmoothHull
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
        vertexShader: "SmoothHull-355b3579-bf1d-4ff5-a200-704437fe684b/SmoothHull-355b3579-bf1d-4ff5-a200-704437fe684b-v10.0-vertex.glsl",
        fragmentShader: "SmoothHull-355b3579-bf1d-4ff5-a200-704437fe684b/SmoothHull-355b3579-bf1d-4ff5-a200-704437fe684b-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "Leaves2": {
        // TODO Uniforms: Leaves2
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
        vertexShader: "Leaves2-7259cce5-41c1-ec74-c885-78af28a31d95/Leaves2-7259cce5-41c1-ec74-c885-78af28a31d95-v10.0-vertex.glsl",
        fragmentShader: "Leaves2-7259cce5-41c1-ec74-c885-78af28a31d95/Leaves2-7259cce5-41c1-ec74-c885-78af28a31d95-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "InkGeometry": {
        // TODO Uniforms: InkGeometry
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
        vertexShader: "InkGeometry-7c972c27-d3c2-8af4-7bf8-5d9db8f0b7bb/InkGeometry-7c972c27-d3c2-8af4-7bf8-5d9db8f0b7bb-v10.0-vertex.glsl",
        fragmentShader: "InkGeometry-7c972c27-d3c2-8af4-7bf8-5d9db8f0b7bb/InkGeometry-7c972c27-d3c2-8af4-7bf8-5d9db8f0b7bb-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "ConcaveHull": {
        // TODO Uniforms: ConcaveHull
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
        vertexShader: "ConcaveHull-7ae1f880-a517-44a0-99f9-1cab654498c6/ConcaveHull-7ae1f880-a517-44a0-99f9-1cab654498c6-v10.0-vertex.glsl",
        fragmentShader: "ConcaveHull-7ae1f880-a517-44a0-99f9-1cab654498c6/ConcaveHull-7ae1f880-a517-44a0-99f9-1cab654498c6-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "3D Printing Brush": {
        // TODO Uniforms and name fix: 3D Printing Brush
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
        vertexShader: "3D Printing Brush-d3f3b18a-da03-f694-b838-28ba8e749a98/3D Printing Brush-d3f3b18a-da03-f694-b838-28ba8e749a98-v10.0-vertex.glsl",
        fragmentShader: "3D Printing Brush-d3f3b18a-da03-f694-b838-28ba8e749a98/3D Printing Brush-d3f3b18a-da03-f694-b838-28ba8e749a98-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
    },
    "PassthroughHull": {
        // TODO Uniforms: PassthroughHull
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
        vertexShader: "PassthroughHull-cc131ff8-0d17-4677-93e0-d7cd19fea9ac/PassthroughHull-cc131ff8-0d17-4677-93e0-d7cd19fea9ac-v10.0-vertex.glsl",
        fragmentShader: "PassthroughHull-cc131ff8-0d17-4677-93e0-d7cd19fea9ac/PassthroughHull-cc131ff8-0d17-4677-93e0-d7cd19fea9ac-v10.0-fragment.glsl",
        side: 1,
        transparent: null,
        depthFunc: 1,
        depthWrite: null,
        depthTest: null,
        blending: 1
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
        let isTilt = this.isTiltGltf(json);
        if (!isTilt) {
            console.error("Not TiltGltf Error", json);
            return null;
        }
        json.materials.forEach((material)=>{
            const extensionsDef = material.extensions;
            let nameOrGuid;
            // Try a guid first
            if (extensionsDef?.[this.name]) nameOrGuid = extensionsDef[this.name].guid;
            else if (material.name.startsWith("material_")) nameOrGuid = material.name.replace("material_", "");
            else if (material.name.startsWith("ob-")) nameOrGuid = material.name.replace("ob-", "");
            else {
                let newName = this.tryReplaceBlocksName(material.name);
                if (newName !== undefined) nameOrGuid = newName;
            }
            const materialName = this.tiltShaderLoader.lookupMaterialName(nameOrGuid);
            const materialParams = this.tiltShaderLoader.lookupMaterialParams(materialName);
            if (materialParams === undefined) {
                console.log(`No material params found: ${nameOrGuid} (${materialName})`);
                return;
            }
            // MainTex
            if (material?.pbrMetallicRoughness?.baseColorTexture && materialParams.uniforms?.u_MainTex) {
                const mainTex = json.images[material.pbrMetallicRoughness.baseColorTexture.index];
                mainTex.uri = this.brushPath + materialParams.uniforms?.u_MainTex.value;
            }
            // BumpMap
            if (material?.normalTexture && materialParams.uniforms?.u_BumpMap) {
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
                if (prim.material === null || prim.material === undefined) return;
                const material = json.materials[prim.material];
                const extensionsDef = material.extensions;
                let brushName;
                if (material.name.startsWith("ob-")) // New glb naming convention
                brushName = material.name.replace("ob-", "");
                else if (material.name.startsWith("material_")) // Some legacy poly files
                // TODO - risk of name collision with non-tilt materials
                // Maybe we should pass in a flag when a tilt gltf is detected?
                // Do names in this format use guids or english names?
                brushName = material.name.replace("material_", "");
                else if (extensionsDef) {
                    let exDef = extensionsDef[this.name];
                    if (exDef !== undefined) brushName = exDef.guid;
                }
                let newName = this.tryReplaceBlocksName(material.name);
                if (newName !== undefined) brushName = newName;
                console.log(`newName: ${newName} brushName: ${brushName} material.name: ${material.name}`);
                if (brushName !== undefined) shaderResolves.push(this.replaceMaterial(object, brushName));
                else console.warn("No brush name found for material", material.name, brushName);
            });
        });
        return Promise.all(shaderResolves);
    }
    tryReplaceBlocksName(originalName) {
        // Handle naming embedded models exported from newer Open Brush versions
        let newName;
        if (originalName.includes("_BlocksPaper ")) newName = "BlocksPaper";
        else if (originalName.includes("_BlocksGlass ")) newName = "BlocksGlass";
        else if (originalName.includes("_BlocksGem ")) newName = "BlocksGem";
        return newName;
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
            case "BlocksBasic":
            case "BlocksPaper":
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
            case "BlocksGem":
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
            case "BlocksGlass":
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
            case "Bubbles":
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
            case "CelVinyl":
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
            case "ChromaticWave":
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
            case "CoarseBristles":
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
            case "Comet":
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
            case "DiamondHull":
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
            case "Disco":
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
            case "DotMarker":
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
            case "Dots":
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
            case "DoubleTaperedFlat":
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
            case "DoubleTaperedMarker":
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
            case "DuctTape":
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
            case "Electricity":
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
            case "Embers":
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
            case "EnvironmentDiffuse":
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
            case "EnvironmentDiffuseLightMap":
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
            case "Fire":
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
            case "Flat":
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
            case "Highlighter":
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
            case "Hypercolor":
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
            case "HyperGrid":
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
            case "Icing":
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
            case "Ink":
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
            case "Leaves":
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
            case "Light":
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
            case "LightWire":
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
            case "Lofted":
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
            case "Marker":
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
            case "MatteHull":
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
            case "NeonPulse":
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
            case "OilPaint":
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
            case "Paper":
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
            case "PbrTemplate":
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
            case "PbrTransparentTemplate":
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
            case "Petal":
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
            case "Plasma":
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
            case "Rainbow":
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
            case "ShinyHull":
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
            case "Smoke":
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
            case "Snow":
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
            case "SoftHighlighter":
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
            case "Spikes":
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
            case "Splatter":
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
            case "Stars":
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
            case "Streamers":
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
            case "Taffy":
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
            case "TaperedFlat":
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
            case "TaperedMarker":
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
            case "ThickPaint":
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
            case "Toon":
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
            case "UnlitHull":
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
            case "VelvetInk":
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
            case "Waveform":
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
            case "WetPaint":
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
            case "WigglyGraphite":
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
            case "Wire":
                mesh.geometry.name = "geometry_Wire";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_normal", mesh.geometry.getAttribute("normal"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                shader = await this.tiltShaderLoader.loadAsync("ConcaveHull");
                mesh.material = shader;
                mesh.material.name = "material_ConcaveHull";
                break;
            case "d3f3b18a-da03-f694-b838-28ba8e749a98":
            case "3D Printing Brush":
                // TODO Set uniforms
                mesh.geometry.name = "geometry_3D Printing Brush";
                mesh.geometry.setAttribute("a_position", mesh.geometry.getAttribute("position"));
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
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
                mesh.geometry.setAttribute("a_color", mesh.geometry.getAttribute("color"));
                shader = await this.tiltShaderLoader.loadAsync("PassthroughHull");
                mesh.material = shader;
                mesh.material.name = "material_PassthroughHull";
                break;
            default:
                console.warn(`Could not find brush with guid ${guid}!`);
        }
        mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group)=>{
            if (material?.uniforms?.u_time) {
                const elapsedTime = this.clock.getElapsedTime();
                // _Time from https://docs.unity3d.com/Manual/SL-UnityShaderVariables.html
                const time = new (0, $a0PbU$Vector4)(elapsedTime / 20, elapsedTime, elapsedTime * 2, elapsedTime * 3);
                material.uniforms["u_time"].value = time;
            }
            if (material?.uniforms?.cameraPosition) material.uniforms["cameraPosition"].value = camera.position;
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
