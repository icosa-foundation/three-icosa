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

import * as THREE from 'three';

// Cached default textures to prevent creating multiple instances
let defaultWhiteTexture = null;
let defaultNormalTexture = null;

function getDefaultWhiteTexture() {
    if (!defaultWhiteTexture) {
        defaultWhiteTexture = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, THREE.RGBAFormat);
        defaultWhiteTexture.name = 'DefaultWhiteTexture';
        defaultWhiteTexture.needsUpdate = true;
    }
    return defaultWhiteTexture;
}

function getDefaultNormalTexture() {
    if (!defaultNormalTexture) {
        defaultNormalTexture = new THREE.DataTexture(new Uint8Array([128, 128, 255, 255]), 1, 1, THREE.RGBAFormat);
        defaultNormalTexture.name = 'DefaultNormalTexture';
        defaultNormalTexture.needsUpdate = true;
    }
    return defaultNormalTexture;
}

export class TiltShaderLoader extends THREE.Loader {
    constructor( manager ) {
        super( manager );
        
        this.loadedMaterials = {};
    }
    
    async loadShaderIncludes(relativePath) {
        const loader = new THREE.FileLoader(this.manager);
        loader.setPath(this.path);
        try {
            return await loader.loadAsync(relativePath);
        } catch (error) {
            console.warn('Failed to load surface shader includes:', relativePath, error);
            return '// Failed to load surface shader includes ' + relativePath + '\n';
        }
    }
    
    async load(brushName, onLoad, onProgress, onError ) {
        const scope = this;

        const isAlreadyLoaded = this.loadedMaterials[brushName];
        
        if (isAlreadyLoaded !== undefined) {
            onLoad( scope.parse( isAlreadyLoaded ) );
            return;
        }
        
		const loader = new THREE.FileLoader( this.manager );
		loader.setPath( this.path );
		loader.setResponseType( 'text' );
		loader.setWithCredentials( this.withCredentials );

        const textureLoader = new THREE.TextureLoader(this.manager);
        textureLoader.setPath(this.path);
        textureLoader.setWithCredentials( this.withCredentials );

        const materialParams = tiltBrushMaterialParams[brushName];

        materialParams.glslVersion = THREE.GLSL3;
        
        // Load shaders
        const vertexShaderText = await loader.loadAsync(materialParams.vertexShader);

        let fragmentShaderText = await loader.loadAsync(materialParams.fragmentShader);
        if (!this.fogShaderCode) {
            this.fogShaderCode = await this.loadShaderIncludes('includes/FogShaderIncludes.glsl');
        }
        fragmentShaderText = this.fogShaderCode + '\n' + fragmentShaderText;

        // Prepend surface shader code if needed
        if (materialParams.isSurfaceShader) {
            if (!this.surfaceShaderCode) {
                this.surfaceShaderCode = await this.loadShaderIncludes('includes/SurfaceShaderIncludes.glsl');
            }
            fragmentShaderText = this.surfaceShaderCode + '\n' + fragmentShaderText;
        }
                
        // Remove custom flag before passing to Three.js
        delete materialParams.isSurfaceShader;
        
        materialParams.vertexShader = vertexShaderText;
        materialParams.fragmentShader = fragmentShaderText;

        if (materialParams.uniforms.u_MainTex) {
            if (materialParams.uniforms.u_MainTex.value === null) {
                materialParams.uniforms.u_MainTex.value = getDefaultWhiteTexture();
            } else {
                const mainTex = await textureLoader.loadAsync(materialParams.uniforms.u_MainTex.value);
                mainTex.name = `${brushName}_MainTex`;
                mainTex.wrapS = THREE.RepeatWrapping;
                mainTex.wrapT = THREE.RepeatWrapping;
                mainTex.flipY = false;
                materialParams.uniforms.u_MainTex.value = mainTex;
            }
        }

        if (materialParams.uniforms.u_BumpMap) {
            if (materialParams.uniforms.u_BumpMap.value === null) {
                materialParams.uniforms.u_BumpMap.value = getDefaultNormalTexture();
            } else {
                const bumpMap = await textureLoader.loadAsync(materialParams.uniforms.u_BumpMap.value);
                bumpMap.name = `${brushName}_BumpMap`;
                bumpMap.wrapS = THREE.RepeatWrapping;
                bumpMap.wrapT = THREE.RepeatWrapping;
                bumpMap.flipY = false;
                materialParams.uniforms.u_BumpMap.value = bumpMap;
            }
        }

        if (materialParams.uniforms.u_AlphaMask) {
            const alphaMask = await textureLoader.loadAsync(materialParams.uniforms.u_AlphaMask.value);
            alphaMask.name = `${brushName}_AlphaMask`;
            alphaMask.wrapS = THREE.RepeatWrapping;
            alphaMask.wrapT = THREE.RepeatWrapping;
            alphaMask.flipY = false;
            materialParams.uniforms.u_AlphaMask.value = alphaMask;
        }

        if (materialParams.uniforms.u_DisplaceTex) {
            const displaceTex = await textureLoader.loadAsync(materialParams.uniforms.u_DisplaceTex.value);
            displaceTex.name = `${brushName}_DisplaceTex`;
            displaceTex.wrapS = THREE.RepeatWrapping;
            displaceTex.wrapT = THREE.RepeatWrapping;
            displaceTex.flipY = false;
            materialParams.uniforms.u_DisplaceTex.value = displaceTex;
        }

        if (materialParams.uniforms.u_SecondaryTex) {
            const secondaryTex = await textureLoader.loadAsync(materialParams.uniforms.u_SecondaryTex.value);
            secondaryTex.name = `${brushName}_SecondaryTex`;
            secondaryTex.wrapS = THREE.RepeatWrapping;
            secondaryTex.wrapT = THREE.RepeatWrapping;
            secondaryTex.flipY = false;
            materialParams.uniforms.u_SecondaryTex.value = secondaryTex;
        }

        if (materialParams.uniforms.u_SpecTex) {
            const specTex = await textureLoader.loadAsync(materialParams.uniforms.u_SpecTex.value);
            specTex.name = `${brushName}_SpecTex`;
            specTex.wrapS = THREE.RepeatWrapping;
            specTex.wrapT = THREE.RepeatWrapping;
            specTex.flipY = false;
            materialParams.uniforms.u_SpecTex.value = specTex;
        }

        // inject three.js lighting and fog uniforms
        for (var lightType in THREE.UniformsLib.lights)
        {
            materialParams.uniforms[lightType] = THREE.UniformsLib.lights[lightType];
        }
        for (var fogType in THREE.UniformsLib.fog)
        {
            materialParams.uniforms[fogType] = THREE.UniformsLib.fog[fogType];
        }

        let rawMaterial = new THREE.RawShaderMaterial(materialParams);
        this.loadedMaterials[brushName] = rawMaterial;
        onLoad( scope.parse( rawMaterial ) );
    }

    parse( rawMaterial ) {
        return rawMaterial;
    }

    lookupMaterialParams(materialName) {
        return tiltBrushMaterialParams[materialName] || null;
    }

    lookupMaterialName(nameOrGuid) {

        // Open Brush "new glb" exports prefix the material names
        if (nameOrGuid?.startsWith("ob-")) {
            nameOrGuid = nameOrGuid.substring(3);
        }

        switch(nameOrGuid) {

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

            case "TaperedMarker_Flat":
            case "d90c6ad8-af0f-4b54-b422-e0f92abe1b3c":
            case "1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0":
                return "TaperedMarker_Flat";

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

const tiltBrushMaterialParams = {
    "BlocksBasic" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_Shininess: { value: 0.2 },
            u_SpecColor: { value: new THREE.Vector3(0.1960784, 0.1960784, 0.1960784) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
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
    "BlocksGem" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: {value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1)},
            u_SceneLight_0_color: {value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1)},
            u_SceneLight_1_color: {value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1)},
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Shininess: { value: 0.9 },
            u_RimIntensity: { value: 0.5 },
            u_RimPower: { value: 2 },
            u_Frequency: { value: 2 },
            u_Jitter: { value: 1 },
            u_fogColor: {value: new THREE.Vector3(0.0196, 0.0196, 0.0196)},
            u_fogDensity: {value: 0 }
        },
        isSurfaceShader: true,
        vertexShader: "BlocksGem-232998f8-d357-47a2-993a-53415df9be10/BlocksGem-232998f8-d357-47a2-993a-53415df9be10-v10.0-vertex.glsl",
        fragmentShader: "BlocksGem-232998f8-d357-47a2-993a-53415df9be10/BlocksGem-232998f8-d357-47a2-993a-53415df9be10-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "BlocksGlass" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Shininess: { value: 0.8 },
            u_RimIntensity: { value: 0.7 },
            u_RimPower: { value: 4 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
        },
        isSurfaceShader: true,
        vertexShader: "BlocksGlass-3d813d82-5839-4450-8ddc-8e889ecd96c7/BlocksGlass-3d813d82-5839-4450-8ddc-8e889ecd96c7-v10.0-vertex.glsl",
        fragmentShader: "BlocksGlass-3d813d82-5839-4450-8ddc-8e889ecd96c7/BlocksGlass-3d813d82-5839-4450-8ddc-8e889ecd96c7-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Bubbles" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_MainTex: { value: "Bubbles-89d104cd-d012-426b-b5b3-bbaee63ac43c/Bubbles-89d104cd-d012-426b-b5b3-bbaee63ac43c-v10.0-MainTex.png" },
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
    "CelVinyl" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_Cutoff: { value: 0.554 },
            u_MainTex: { value: "CelVinyl-700f3aa8-9a7c-2384-8b8a-ea028905dd8c/CelVinyl-700f3aa8-9a7c-2384-8b8a-ea028905dd8c-v10.0-MainTex.png" },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
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
    "ChromaticWave" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_time: { value: new THREE.Vector4() },
            u_EmissionGain: { value: 0.45 },
            u_MainTex: { value: null },
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
    "CoarseBristles" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_MainTex: { value: "CoarseBristles-1161af82-50cf-47db-9706-0c3576d43c43/CoarseBristles-1161af82-50cf-47db-9706-0c3576d43c43-v10.0-MainTex.png" },
            u_Cutoff: { value: 0.25 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
        },
        isSurfaceShader: true,
        vertexShader: "CoarseBristles-1161af82-50cf-47db-9706-0c3576d43c43/CoarseBristles-1161af82-50cf-47db-9706-0c3576d43c43-v10.0-vertex.glsl",
        fragmentShader: "CoarseBristles-1161af82-50cf-47db-9706-0c3576d43c43/CoarseBristles-1161af82-50cf-47db-9706-0c3576d43c43-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Comet" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_MainTex: { value: "Comet-1caa6d7d-f015-3f54-3a4b-8b5354d39f81/Comet-1caa6d7d-f015-3f54-3a4b-8b5354d39f81-v10.0-MainTex.png" },
            u_AlphaMask: { value: "Comet-1caa6d7d-f015-3f54-3a4b-8b5354d39f81/Comet-1caa6d7d-f015-3f54-3a4b-8b5354d39f81-v10.0-AlphaMask.png" },
            u_AlphaMask_TexelSize: { value: new THREE.Vector4(0.0156, 1, 64, 1)},
            u_time: { value: new THREE.Vector4() },
            u_Speed: { value: 1 },
            u_EmissionGain: { value: 0.5 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
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
    "DiamondHull" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_MainTex: { value: "DiamondHull-c8313697-2563-47fc-832e-290f4c04b901/DiamondHull-c8313697-2563-47fc-832e-290f4c04b901-v10.0-MainTex.png" },
            u_time: { value: new THREE.Vector4() },
            cameraPosition: { value: new THREE.Vector3() },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
        },
        isSurfaceShader: true,
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
    "Disco" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_time: { value: new THREE.Vector4() },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_Shininess: { value: 0.65 },
            u_SpecColor: { value: new THREE.Vector3(0.5147059, 0.5147059, 0.5147059) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
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
    "DotMarker" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_MainTex: { value: "DotMarker-d1d991f2-e7a0-4cf1-b328-f57e915e6260/DotMarker-d1d991f2-e7a0-4cf1-b328-f57e915e6260-v10.0-MainTex.png" },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
        },
        isSurfaceShader: true,
        vertexShader: "DotMarker-d1d991f2-e7a0-4cf1-b328-f57e915e6260/DotMarker-d1d991f2-e7a0-4cf1-b328-f57e915e6260-v10.0-vertex.glsl",
        fragmentShader: "DotMarker-d1d991f2-e7a0-4cf1-b328-f57e915e6260/DotMarker-d1d991f2-e7a0-4cf1-b328-f57e915e6260-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
        
    },
    "Dots" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_MainTex: { value: "Dots-6a1cf9f9-032c-45ec-9b1d-a6680bee30f7/Dots-6a1cf9f9-032c-45ec-9b1d-a6680bee30f7-v10.0-MainTex.png" },
            u_TintColor: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_EmissionGain: { value: 300 },
            u_BaseGain: { value: 0.4 }
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
    "DoubleTaperedFlat" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_Shininess: { value: 0.1500 },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
        },
        isSurfaceShader: true,
        vertexShader: "DoubleTaperedFlat-0d3889f3-3ede-470c-8af4-f44813306126/DoubleTaperedFlat-0d3889f3-3ede-470c-8af4-f44813306126-v10.0-vertex.glsl",
        fragmentShader: "DoubleTaperedFlat-0d3889f3-3ede-470c-8af4-f44813306126/DoubleTaperedFlat-0d3889f3-3ede-470c-8af4-f44813306126-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "DoubleTaperedMarker" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
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
    "DuctTape" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0.5372549, 0.5372549, 0.5372549) },
            u_Shininess: { value: 0.414 },
            u_MainTex: { value: "DuctTape-3ca16e2f-bdcd-4da2-8631-dcef342f40f1/DuctTape-3ca16e2f-bdcd-4da2-8631-dcef342f40f1-v10.0-MainTex.png" },
            u_Cutoff: { value: 0.2 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "DuctTape-3ca16e2f-bdcd-4da2-8631-dcef342f40f1/DuctTape-3ca16e2f-bdcd-4da2-8631-dcef342f40f1-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
        },
        isSurfaceShader: true,
        vertexShader: "DuctTape-3ca16e2f-bdcd-4da2-8631-dcef342f40f1/DuctTape-3ca16e2f-bdcd-4da2-8631-dcef342f40f1-v10.0-vertex.glsl",
        fragmentShader: "DuctTape-3ca16e2f-bdcd-4da2-8631-dcef342f40f1/DuctTape-3ca16e2f-bdcd-4da2-8631-dcef342f40f1-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Electricity" : {
        uniforms: {
            u_time: { value: new THREE.Vector4() },
            u_DisplacementIntensity: { value: 2.0 },
            u_EmissionGain: { value: 0.2 }
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
    "Embers" : {
        uniforms: {
            u_time: { value: new THREE.Vector4() },
            u_ScrollRate: { value: 0.6 },
            u_ScrollDistance: { value: new THREE.Vector3(-0.2, 0.6, 0) },
            u_ScrollJitterIntensity: { value: 0.03 },
            u_ScrollJitterFrequency: { value: 5 },
            u_TintColor: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_MainTex: { value: "Embers-02ffb866-7fb2-4d15-b761-1012cefb1360/Embers-02ffb866-7fb2-4d15-b761-1012cefb1360-v10.0-MainTex.png" },
            u_Cutoff: { value: 0.2 }
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
    "EnvironmentDiffuse" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_Shininess: { value: 0.1500 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_Cutoff: { value: 0.2 }
        },
        isSurfaceShader: true,
        vertexShader: "EnvironmentDiffuse-0ad58bbd-42bc-484e-ad9a-b61036ff4ce7/EnvironmentDiffuse-0ad58bbd-42bc-484e-ad9a-b61036ff4ce7-v1.0-vertex.glsl",
        fragmentShader: "EnvironmentDiffuse-0ad58bbd-42bc-484e-ad9a-b61036ff4ce7/EnvironmentDiffuse-0ad58bbd-42bc-484e-ad9a-b61036ff4ce7-v1.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "EnvironmentDiffuseLightMap" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_Shininess: { value: 0.1500 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_Cutoff: { value: 0.2 }
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
    "Fire" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_MainTex: { value: "Fire-cb92b597-94ca-4255-b017-0e3f42f12f9e/Fire-cb92b597-94ca-4255-b017-0e3f42f12f9e-v10.0-MainTex.png" },
            u_time: { value: new THREE.Vector4() },
            u_EmissionGain: { value: 0.5 }
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
    "Flat" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_Cutoff: { value: 0.2 }
        },
        isSurfaceShader: true,
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
    "Highlighter" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_MainTex: { value: "Highlighter-cf019139-d41c-4eb0-a1d0-5cf54b0a42f3/Highlighter-cf019139-d41c-4eb0-a1d0-5cf54b0a42f3-v10.0-MainTex.png" },
            u_Cutoff: { value: 0.12 }
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
    "Hypercolor" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_Shininess: { value: 0.5 },
            u_SpecColor: { value: new THREE.Vector3(0.2745098, 0.2745098, 0.2745098) },
            u_MainTex: { value: "Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c/Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c-v10.0-MainTex.png" },
            u_time: { value: new THREE.Vector4() },
            u_Cutoff: { value: 0.5 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c/Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
        },
        isSurfaceShader: true,
        vertexShader: "Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c/Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c-v10.0-vertex.glsl",
        fragmentShader: "Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c/Hypercolor-dce872c2-7b49-4684-b59b-c45387949c5c-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "HyperGrid" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_TintColor: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_MainTex: { value: "HyperGrid-6a1cf9f9-032c-45ec-9b6e-a6680bee32e9/HyperGrid-6a1cf9f9-032c-45ec-9b6e-a6680bee32e9-v10.0-MainTex.png" }
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
    "Icing" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0.2352941, 0.2352941, 0.2352941) },
            u_Shininess: { value: 0.1500 },
            u_Cutoff: { value: 0.5 },
            u_MainTex: { value: "Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37/Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37-v10.0-BumpMap.png" },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37/Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
        },
        isSurfaceShader: true,
        vertexShader: "Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37/Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37-v10.0-vertex.glsl",
        fragmentShader: "Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37/Icing-2f212815-f4d3-c1a4-681a-feeaf9c6dc37-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Ink" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0.2352941, 0.2352941, 0.2352941) },
            u_Shininess: { value: 0.4 },
            u_Cutoff: { value: 0.5 },
            u_MainTex: { value: "Ink-c0012095-3ffd-4040-8ee1-fc180d346eaa/Ink-c0012095-3ffd-4040-8ee1-fc180d346eaa-v10.0-MainTex.png" },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "Ink-c0012095-3ffd-4040-8ee1-fc180d346eaa/Ink-c0012095-3ffd-4040-8ee1-fc180d346eaa-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
        },
        isSurfaceShader: true,
        vertexShader: "Ink-c0012095-3ffd-4040-8ee1-fc180d346eaa-v10.0-fragment/Ink-c0012095-3ffd-4040-8ee1-fc180d346eaa-v10.0-fragment-v10.0-vertex.glsl",
        fragmentShader: "Ink-c0012095-3ffd-4040-8ee1-fc180d346eaa-v10.0-fragment/Ink-c0012095-3ffd-4040-8ee1-fc180d346eaa-v10.0-fragment-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Leaves" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_Shininess: { value: 0.395 },
            u_Cutoff: { value: 0.5 },
            u_MainTex: { value: "Leaves-ea19de07-d0c0-4484-9198-18489a3c1487/Leaves-ea19de07-d0c0-4484-9198-18489a3c1487-v10.0-MainTex.png" },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "Leaves-ea19de07-d0c0-4484-9198-18489a3c1487/Leaves-ea19de07-d0c0-4484-9198-18489a3c1487-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
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
    "Light" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_MainTex: { value: "Light-2241cd32-8ba2-48a5-9ee7-2caef7e9ed62/Light-2241cd32-8ba2-48a5-9ee7-2caef7e9ed62-v10.0-MainTex.png" },
            u_EmissionGain: { value: 0.45 },
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
        blendSrc: 201,
    },
    "LightWire" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_Shininess: { value: 0.81 },
            u_SpecColor: { value: new THREE.Vector3(0.3455882, 0.3455882, 0.3455882) },
            u_time: { value: new THREE.Vector4() },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_MainTex: { value: "LightWire-4391aaaa-df81-4396-9e33-31e4e4930b27/LightWire-4391aaaa-df81-4396-9e33-31e4e4930b27-v10.0-MainTex.png"}
        },
        isSurfaceShader: true,
        vertexShader: "LightWire-4391aaaa-df81-4396-9e33-31e4e4930b27/LightWire-4391aaaa-df81-4396-9e33-31e4e4930b27-v10.0-vertex.glsl",
        fragmentShader: "LightWire-4391aaaa-df81-4396-9e33-31e4e4930b27/LightWire-4391aaaa-df81-4396-9e33-31e4e4930b27-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Lofted" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
        },
        isSurfaceShader: true,
        vertexShader: "Lofted-d381e0f5-3def-4a0d-8853-31e9200bcbda/Lofted-d381e0f5-3def-4a0d-8853-31e9200bcbda-v10.0-vertex.glsl",
        fragmentShader: "Lofted-d381e0f5-3def-4a0d-8853-31e9200bcbda/Lofted-d381e0f5-3def-4a0d-8853-31e9200bcbda-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Marker" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_MainTex: { value: "Marker-429ed64a-4e97-4466-84d3-145a861ef684/Marker-429ed64a-4e97-4466-84d3-145a861ef684-v10.0-MainTex.png" },
            u_Cutoff: { value: 0.067 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
        },
        isSurfaceShader: true,
        vertexShader: "Marker-429ed64a-4e97-4466-84d3-145a861ef684/Marker-429ed64a-4e97-4466-84d3-145a861ef684-v10.0-vertex.glsl",
        fragmentShader: "Marker-429ed64a-4e97-4466-84d3-145a861ef684/Marker-429ed64a-4e97-4466-84d3-145a861ef684-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
        
    },
    "MatteHull" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_MainTex: { value: null },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
        },
        isSurfaceShader: true,
        vertexShader: "MatteHull-79348357-432d-4746-8e29-0e25c112e3aa/MatteHull-79348357-432d-4746-8e29-0e25c112e3aa-v10.0-vertex.glsl",
        fragmentShader: "MatteHull-79348357-432d-4746-8e29-0e25c112e3aa/MatteHull-79348357-432d-4746-8e29-0e25c112e3aa-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "NeonPulse" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_time: { value: new THREE.Vector4() },
            u_EmissionGain: { value: 0.5 },
        },
        isSurfaceShader: true,
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
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0.2352941, 0.2352941, 0.2352941) },
            u_Shininess: { value: 0.4 },
            u_Cutoff: { value: 0.5 },
            u_MainTex: { value: "OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699/OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699-v10.0-MainTex.png" },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699/OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0020, 0.0020, 512, 512) },
        },
        isSurfaceShader: true,
        vertexShader: "OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699/OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699-v10.0-vertex.glsl",
        fragmentShader: "OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699/OilPaint-f72ec0e7-a844-4e38-82e3-140c44772699-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Paper" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_Shininess: { value: 0.145 },
            u_Cutoff: { value: 0.16 },
            u_MainTex: { value: "Paper-759f1ebd-20cd-4720-8d41-234e0da63716/Paper-759f1ebd-20cd-4720-8d41-234e0da63716-v10.0-MainTex.png" },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "Paper-759f1ebd-20cd-4720-8d41-234e0da63716/Paper-759f1ebd-20cd-4720-8d41-234e0da63716-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
        },
        isSurfaceShader: true,
        vertexShader: "Paper-759f1ebd-20cd-4720-8d41-234e0da63716/Paper-759f1ebd-20cd-4720-8d41-234e0da63716-v10.0-vertex.glsl",
        fragmentShader: "Paper-759f1ebd-20cd-4720-8d41-234e0da63716/Paper-759f1ebd-20cd-4720-8d41-234e0da63716-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "PbrTemplate" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_Shininess: { value: 0.1500 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_Cutoff: { value: 0.2 }
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
    "PbrTransparentTemplate" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_Shininess: { value: 0.1500 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_Cutoff: { value: 0.2 }
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
    "Petal" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_Shininess: { value: 0.01 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
        },
        isSurfaceShader: true,
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
    "Plasma" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_MainTex: { value: "Plasma-c33714d1-b2f9-412e-bd50-1884c9d46336/Plasma-c33714d1-b2f9-412e-bd50-1884c9d46336-v10.0-MainTex.png" },
            u_MainTex_ST: { value: new THREE.Vector4(0.5, 1.0, 0.0, 0.0) },
            u_time: { value: new THREE.Vector4() }
        },
        vertexShader: "Plasma-c33714d1-b2f9-412e-bd50-1884c9d46336/Plasma-c33714d1-b2f9-412e-bd50-1884c9d46336-v10.0-vertex.glsl",
        fragmentShader: "Plasma-c33714d1-b2f9-412e-bd50-1884c9d46336/Plasma-c33714d1-b2f9-412e-bd50-1884c9d46336-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Rainbow" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_time: { value: new THREE.Vector4() },
            u_EmissionGain: { value: 0.65 }
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
        blendSrc: 201,
    },
    "ShinyHull" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0.1985294, 0.1985294, 0.1985294) },
            u_Shininess: { value: 0.7430 },
            u_MainTex: { value: null },
            u_BumpMap: { value: null },
            u_Cutoff: { value: 0.5 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
        },
        isSurfaceShader: true,
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
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_TintColor: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_MainTex: { value: "Smoke-70d79cca-b159-4f35-990c-f02193947fe8/Smoke-70d79cca-b159-4f35-990c-f02193947fe8-v10.0-MainTex.png" }
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
    "Snow" : {
        uniforms: {
            u_time: { value: new THREE.Vector4() },
            u_ScrollRate: { value: 0.2 },
            u_ScrollDistance: { value: new THREE.Vector3(0, -0.3, 0) },
            u_ScrollJitterIntensity: { value: 0.01 },
            u_ScrollJitterFrequency: { value: 12 },
            u_TintColor: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_MainTex: { value: "Snow-d902ed8b-d0d1-476c-a8de-878a79e3a34c/Snow-d902ed8b-d0d1-476c-a8de-878a79e3a34c-v10.0-MainTex.png" },
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
    "SoftHighlighter" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_MainTex: { value: "SoftHighlighter-accb32f5-4509-454f-93f8-1df3fd31df1b/SoftHighlighter-accb32f5-4509-454f-93f8-1df3fd31df1b-v10.0-MainTex.png" },
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
        blendSrc: 201,
    },
    "Spikes" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
        },
        isSurfaceShader: true,
        vertexShader: "Spikes-cf7f0059-7aeb-53a4-2b67-c83d863a9ffa/Spikes-cf7f0059-7aeb-53a4-2b67-c83d863a9ffa-v10.0-vertex.glsl",
        fragmentShader: "Spikes-cf7f0059-7aeb-53a4-2b67-c83d863a9ffa/Spikes-cf7f0059-7aeb-53a4-2b67-c83d863a9ffa-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Splatter" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_MainTex: { value: "Splatter-7a1c8107-50c5-4b70-9a39-421576d6617e/Splatter-7a1c8107-50c5-4b70-9a39-421576d6617e-v10.0-MainTex.png" },
            u_Cutoff: { value: 0.2 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
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
    "Stars" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_time: { value: new THREE.Vector4() },
            u_SparkleRate: { value: 5.3 },
            u_MainTex: { value: "Stars-0eb4db27-3f82-408d-b5a1-19ebd7d5b711/Stars-0eb4db27-3f82-408d-b5a1-19ebd7d5b711-v10.0-MainTex.png" },
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
    "Streamers" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_MainTex: { value: "Streamers-44bb800a-fbc3-4592-8426-94ecb05ddec3/Streamers-44bb800a-fbc3-4592-8426-94ecb05ddec3-v10.0-MainTex.png" },
            u_EmissionGain: { value: 0.4 },
            u_time: { value: new THREE.Vector4() },
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
    "Taffy" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_MainTex: { value: "Taffy-0077f88c-d93a-42f3-b59b-b31c50cdb414/Taffy-0077f88c-d93a-42f3-b59b-b31c50cdb414-v10.0-MainTex.png" },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
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
    "TaperedFlat" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_MainTex: { value: "TaperedFlat-b468c1fb-f254-41ed-8ec9-57030bc5660c/TaperedFlat-b468c1fb-f254-41ed-8ec9-57030bc5660c-v10.0-MainTex.png" },
            u_Cutoff: { value: 0.067 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
        },
        isSurfaceShader: true,
        vertexShader: "TaperedFlat-b468c1fb-f254-41ed-8ec9-57030bc5660c/TaperedFlat-b468c1fb-f254-41ed-8ec9-57030bc5660c-v10.0-vertex.glsl",
        fragmentShader: "TaperedFlat-b468c1fb-f254-41ed-8ec9-57030bc5660c/TaperedFlat-b468c1fb-f254-41ed-8ec9-57030bc5660c-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "TaperedMarker_Flat" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_Shininess: { value: 0.1500 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_MainTex: { value: "TaperedMarker_Flat-1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0/TaperedMarker_Flat-1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0-v10.0-MainTex.png" },
            u_Cutoff: { value: 0.2 }
        },
        isSurfaceShader: true,
        vertexShader: "TaperedMarker_Flat-1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0/TaperedMarker_Flat-1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0-v10.0-vertex.glsl",
        fragmentShader: "TaperedMarker_Flat-1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0/TaperedMarker_Flat-1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "ThickPaint" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0.2352941, 0.2352941, 0.2352941) },
            u_Shininess: { value: 0.4 },
            u_Cutoff: { value: 0.5 },
            u_MainTex: { value: "ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f/ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f-v10.0-MainTex.png" },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f/ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
        },
        isSurfaceShader: true,
        vertexShader: "ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f/ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f-v10.0-vertex.glsl",
        fragmentShader: "ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f/ThickPaint-75b32cf0-fdd6-4d89-a64b-e2a00b247b0f-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Toon" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
        },
        vertexShader: "Toon-4391385a-df73-4396-9e33-31e4e4930b27/Toon-4391385a-df73-4396-9e33-31e4e4930b27-v10.0-vertex.glsl",
        fragmentShader: "Toon-4391385a-df73-4396-9e33-31e4e4930b27/Toon-4391385a-df73-4396-9e33-31e4e4930b27-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0,
    },
    "UnlitHull" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
        },
        vertexShader: "UnlitHull-a8fea537-da7c-4d4b-817f-24f074725d6d/UnlitHull-a8fea537-da7c-4d4b-817f-24f074725d6d-v10.0-vertex.glsl",
        fragmentShader: "UnlitHull-a8fea537-da7c-4d4b-817f-24f074725d6d/UnlitHull-a8fea537-da7c-4d4b-817f-24f074725d6d-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0,
    },
    "VelvetInk" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_MainTex: { value: "VelvetInk-d229d335-c334-495a-a801-660ac8a87360/VelvetInk-d229d335-c334-495a-a801-660ac8a87360-v10.0-MainTex.png" },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
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
    "Waveform" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_EmissionGain: { value: 0.5178571 },
            u_time: { value: new THREE.Vector4() },
            u_MainTex: { value: "Waveform-10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab/Waveform-10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab-v10.0-MainTex.png" },
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
    "WetPaint" : {
        uniforms: {
            u_BumpMap: { value: "WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3/WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3-v10.0-BumpMap.png" },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.3 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3/WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Shininess: { value: 0.85 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0.139706, 0.139706, 0.139706) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3/WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3-v10.0-vertex.glsl",
        fragmentShader: "WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3/WetPaint-b67c0e81-ce6d-40a8-aeb0-ef036b081aa3-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "WigglyGraphite" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_time: { value: new THREE.Vector4() },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_Cutoff: { value: 0.5 },
            u_MainTex: { value: "WigglyGraphite-5347acf0-a8e2-47b6-8346-30c70719d763/WigglyGraphite-5347acf0-a8e2-47b6-8346-30c70719d763-v10.0-MainTex.png" },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
        },
        isSurfaceShader: true,
        vertexShader: "WigglyGraphite-5347acf0-a8e2-47b6-8346-30c70719d763/WigglyGraphite-5347acf0-a8e2-47b6-8346-30c70719d763-v10.0-vertex.glsl",
        fragmentShader: "WigglyGraphite-5347acf0-a8e2-47b6-8346-30c70719d763/WigglyGraphite-5347acf0-a8e2-47b6-8346-30c70719d763-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Wire" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
        },
        isSurfaceShader: true,
        vertexShader: "Wire-4391385a-cf83-4396-9e33-31e4e4930b27/Wire-4391385a-cf83-4396-9e33-31e4e4930b27-v10.0-vertex.glsl",
        fragmentShader: "Wire-4391385a-cf83-4396-9e33-31e4e4930b27/Wire-4391385a-cf83-4396-9e33-31e4e4930b27-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },



    "SvgTemplate" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
        },
        isSurfaceShader: true,
        vertexShader: "SvgTemplate-cf3401b3-4ada-4877-995a-1aa64e7b604a/SvgTemplate-cf3401b3-4ada-4877-995a-1aa64e7b604a-v10.0-vertex.glsl",
        fragmentShader: "SvgTemplate-cf3401b3-4ada-4877-995a-1aa64e7b604a/SvgTemplate-cf3401b3-4ada-4877-995a-1aa64e7b604a-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0
    },
    "Gouache" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "Gouache-4465b5ef-3605-bec4-2b3e-6b04508ddb6b/Gouache-4465b5ef-3605-bec4-2b3e-6b04508ddb6b-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "Gouache-4465b5ef-3605-bec4-2b3e-6b04508ddb6b/Gouache-4465b5ef-3605-bec4-2b3e-6b04508ddb6b-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            // u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            // u_Parallax: { value: 0.02 },
            u_Shininess: { value: 0.01 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 }
            // u_UVSec: { value: 0.0 },
            // u_ZWrite: { value: 1.0 },
        },
        isSurfaceShader: true,
        vertexShader: "Gouache-4465b5ef-3605-bec4-2b3e-6b04508ddb6b/Gouache-4465b5ef-3605-bec4-2b3e-6b04508ddb6b-v10.0-vertex.glsl",
        fragmentShader: "Gouache-4465b5ef-3605-bec4-2b3e-6b04508ddb6b/Gouache-4465b5ef-3605-bec4-2b3e-6b04508ddb6b-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0,
    },
    "MylarTube" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_Color: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_Cutoff: { value: 0.5 },
            u_DisplacementIntensity: { value: 0.1 },
            u_EmissionGain: { value: 0.25 },
            u_InvFade: { value: 1.0 },
            u_MainTex: { value: "MylarTube-8e58ceea-7830-49b4-aba9-6215104ab52a/MylarTube-8e58ceea-7830-49b4-aba9-6215104ab52a-v10.0-MainTex.png" },
            u_Opacity: { value: 1.0 },
            u_OverrideTime: { value: 0.0 },
            u_Scroll1: { value: 2.0 },
            u_Scroll2: { value: -2.0 },
            u_ScrollJitterFrequency: { value: 1.0 },
            u_ScrollJitterIntensity: { value: 3.0 },
            u_ScrollRate: { value: -0.54 },
            u_Shininess: { value: 0.68 },
            u_Smoothness: { value: 0.078125 },
            u_SpecColor: { value: new THREE.Vector3(0.75, 0.75, 0.75) },
            u_SqueezeAmount: { value: 0.473 },
            u_Strength: { value: 0.5 },
            u_TintColor: { value: new THREE.Vector4(0.617647, 0.617647, 0.617647, 1) }
        },
        isSurfaceShader: true,
        vertexShader: "MylarTube-8e58ceea-7830-49b4-aba9-6215104ab52a/MylarTube-8e58ceea-7830-49b4-aba9-6215104ab52a-v10.0-vertex.glsl",
        fragmentShader: "MylarTube-8e58ceea-7830-49b4-aba9-6215104ab52a/MylarTube-8e58ceea-7830-49b4-aba9-6215104ab52a-v10.0-fragment.glsl",
        side: 0,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0,
    },
    "Rain" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_AlphaMask: { value: "Rain-03a529e1-f519-3dd4-582d-2d5cd92c3f4f/Rain-03a529e1-f519-3dd4-582d-2d5cd92c3f4f-v10.0-MainTex.png" },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DisplacementIntensity: { value: 0.1 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_EmissionGain: { value: 1.0 },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "Rain-03a529e1-f519-3dd4-582d-2d5cd92c3f4f/Rain-03a529e1-f519-3dd4-582d-2d5cd92c3f4f-v10.0-MainTex.png" },
            u_MainTex_ST: { value: new THREE.Vector4(4.0, 1.0, 0.0, 0.0) }, // Unity tiling (4,1) and offset (0,0)
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_NumSides: { value: 6.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Scroll1: { value: 2.0 },
            u_Scroll2: { value: 3.0 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecularHighlights: { value: 1.0 },
            u_Speed: { value: 4.0 },
            u_SrcBlend: { value: 1.0 },
            u_StretchDistortionExponent: { value: 3.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 },
            u_time: { value: new THREE.Vector4() },
            u_Bulge: { value: 2.25 }
        },
        vertexShader: "Rain-03a529e1-f519-3dd4-582d-2d5cd92c3f4f/Rain-03a529e1-f519-3dd4-582d-2d5cd92c3f4f-v10.0-vertex.glsl",
        fragmentShader: "Rain-03a529e1-f519-3dd4-582d-2d5cd92c3f4f/Rain-03a529e1-f519-3dd4-582d-2d5cd92c3f4f-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "DryBrush" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "DryBrush-725f4c6a-6427-6524-29ab-da371924adab/DryBrush-725f4c6a-6427-6524-29ab-da371924adab-v10.0-BumpMap.jpg" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.2 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "DryBrush-725f4c6a-6427-6524-29ab-da371924adab/DryBrush-725f4c6a-6427-6524-29ab-da371924adab-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Shininess: { value: 0.05 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "DryBrush-725f4c6a-6427-6524-29ab-da371924adab/DryBrush-725f4c6a-6427-6524-29ab-da371924adab-v10.0-vertex.glsl",
        fragmentShader: "DryBrush-725f4c6a-6427-6524-29ab-da371924adab/DryBrush-725f4c6a-6427-6524-29ab-da371924adab-v10.0-fragment.glsl",
        side: 0,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0,
    },
    "LeakyPen" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(0.441176, 0.441176, 0.441176, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_LineColor: { value: new THREE.Vector4(0.151581, 0.62766, 0.941176, 1) },
            u_MainTex: { value: "LeakyPen-ddda8745-4bb5-ac54-88b6-d1480370583e/LeakyPen-ddda8745-4bb5-ac54-88b6-d1480370583e-v10.0-MainTex.png" },
            u_MainTex_ST: { value: new THREE.Vector4(1, 1, 0.0, 0.0) },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Ratio: { value: 0.57 },
            u_SecondaryTex: { value: "LeakyPen-ddda8745-4bb5-ac54-88b6-d1480370583e/LeakyPen-ddda8745-4bb5-ac54-88b6-d1480370583e-v10.0-SecondaryTex.png" },
            u_SecondaryTex_ST: { value: new THREE.Vector4(0.3, 0.5, 0.0, 0.0) },
            u_Shininess: { value: 0.01 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_SpecularHighlights: { value: 1.0 },
            u_SqueezeAmount: { value: 0.9 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "LeakyPen-ddda8745-4bb5-ac54-88b6-d1480370583e/LeakyPen-ddda8745-4bb5-ac54-88b6-d1480370583e-v10.0-vertex.glsl",
        fragmentShader: "LeakyPen-ddda8745-4bb5-ac54-88b6-d1480370583e/LeakyPen-ddda8745-4bb5-ac54-88b6-d1480370583e-v10.0-fragment.glsl",
        side: 0,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0,
    },
    "Sparks" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DisplacementAmount: { value: 1.45 },
            u_DisplacementExponent: { value: 2.84 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_EmissionGain: { value: 0.723 },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "Sparks-50e99447-3861-05f4-697d-a1b96e771b98/Sparks-50e99447-3861-05f4-697d-a1b96e771b98-v10.0-MainTex.png" },
            u_MainTex_ST: { value: new THREE.Vector4(1.0, 1.0, 0.0, 0.0) },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_NumSides: { value: 4.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecularHighlights: { value: 1.0 },
            u_Speed: { value: 11.78 },
            u_SrcBlend: { value: 1.0 },
            u_StretchDistortionExponent: { value: 1.73 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 },
            u_time: { value: new THREE.Vector4() }
        },
        vertexShader: "Sparks-50e99447-3861-05f4-697d-a1b96e771b98/Sparks-50e99447-3861-05f4-697d-a1b96e771b98-v10.0-vertex.glsl",
        fragmentShader: "Sparks-50e99447-3861-05f4-697d-a1b96e771b98/Sparks-50e99447-3861-05f4-697d-a1b96e771b98-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Wind" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "Wind-7136a729-1aab-bd24-f8b2-ca88b6adfb67/Wind-7136a729-1aab-bd24-f8b2-ca88b6adfb67-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecularHighlights: { value: 1.0 },
            u_Speed: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 },
            u_time: { value: new THREE.Vector4() }
        },
        vertexShader: "Wind-7136a729-1aab-bd24-f8b2-ca88b6adfb67/Wind-7136a729-1aab-bd24-f8b2-ca88b6adfb67-v10.0-vertex.glsl",
        fragmentShader: "Wind-7136a729-1aab-bd24-f8b2-ca88b6adfb67/Wind-7136a729-1aab-bd24-f8b2-ca88b6adfb67-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Rising Bubbles" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BaseGain: { value: 0.4 },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_EmissionGain: { value: 300.0 },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "Rising Bubbles-a8147ce1-005e-abe4-88e8-09a1eaadcc89/Rising Bubbles-a8147ce1-005e-abe4-88e8-09a1eaadcc89-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Opacity: { value: 1.0 },
            u_OverrideTime: { value: 0.0 },
            u_Parallax: { value: 0.02 },
            u_ScrollDistance: { value: new THREE.Vector4(0.5, 5, 0, 0.5) },
            u_ScrollJitterFrequency: { value: 5.0 },
            u_ScrollJitterIntensity: { value: 0.2 },
            u_ScrollRate: { value: 0.1 },
            u_Shininess: { value: 0.078125 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SparkleRate: { value: 2.5 },
            u_SpecColor: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
            u_SpecularHighlights: { value: 1.0 },
            u_SpreadRate: { value: 1.25 },
            u_SpreadSize: { value: 1.25 },
            u_SrcBlend: { value: 1.0 },
            u_TintColor: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_UVSec: { value: 0.0 },
            u_WaveformFreq: { value: 0.1 },
            u_WaveformIntensity: { value: new THREE.Vector4(0, 15, 0, 0) },
            u_ZWrite: { value: 1.0 },
            u_time: { value: new THREE.Vector4() }
        },
        vertexShader: "Rising%20Bubbles-a8147ce1-005e-abe4-88e8-09a1eaadcc89/Rising%20Bubbles-a8147ce1-005e-abe4-88e8-09a1eaadcc89-v10.0-vertex.glsl",
        fragmentShader: "Rising%20Bubbles-a8147ce1-005e-abe4-88e8-09a1eaadcc89/Rising%20Bubbles-a8147ce1-005e-abe4-88e8-09a1eaadcc89-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "TaperedWire" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "TaperedWire-9568870f-8594-60f4-1b20-dfbc8a5eac0e/TaperedWire-9568870f-8594-60f4-1b20-dfbc8a5eac0e-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Shininess: { value: 0.1 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0.0955882, 0.0955882, 0.0955882) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "TaperedWire-9568870f-8594-60f4-1b20-dfbc8a5eac0e/TaperedWire-9568870f-8594-60f4-1b20-dfbc8a5eac0e-v10.0-vertex.glsl",
        fragmentShader: "TaperedWire-9568870f-8594-60f4-1b20-dfbc8a5eac0e/TaperedWire-9568870f-8594-60f4-1b20-dfbc8a5eac0e-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "SquarePaper" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "SquarePaper-2e03b1bf-3ebd-4609-9d7e-f4cafadc4dfa/SquarePaper-2e03b1bf-3ebd-4609-9d7e-f4cafadc4dfa-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.16 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "SquarePaper-2e03b1bf-3ebd-4609-9d7e-f4cafadc4dfa/SquarePaper-2e03b1bf-3ebd-4609-9d7e-f4cafadc4dfa-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Shininess: { value: 0.145 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "SquarePaper-2e03b1bf-3ebd-4609-9d7e-f4cafadc4dfa/SquarePaper-2e03b1bf-3ebd-4609-9d7e-f4cafadc4dfa-v10.0-vertex.glsl",
        fragmentShader: "SquarePaper-2e03b1bf-3ebd-4609-9d7e-f4cafadc4dfa/SquarePaper-2e03b1bf-3ebd-4609-9d7e-f4cafadc4dfa-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "ThickGeometry" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "ThickGeometry-39ee7377-7a9e-47a7-a0f8-0c77712f75d3/ThickGeometry-39ee7377-7a9e-47a7-a0f8-0c77712f75d3-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(0.705882, 0.705882, 0.705882, 1) },
            u_Cutoff: { value: 0.2 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "ThickGeometry-39ee7377-7a9e-47a7-a0f8-0c77712f75d3/ThickGeometry-39ee7377-7a9e-47a7-a0f8-0c77712f75d3-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_SelectionEdging: { value: 1.0 },
            u_Shininess: { value: 0.414 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0.537255, 0.537255, 0.537255) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "ThickGeometry-39ee7377-7a9e-47a7-a0f8-0c77712f75d3/ThickGeometry-39ee7377-7a9e-47a7-a0f8-0c77712f75d3-v10.0-vertex.glsl",
        fragmentShader: "ThickGeometry-39ee7377-7a9e-47a7-a0f8-0c77712f75d3/ThickGeometry-39ee7377-7a9e-47a7-a0f8-0c77712f75d3-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "Wireframe" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
        },
        vertexShader: "Wireframe-2c1a6a63-6552-4d23-86d7-58f6fba8581b/Wireframe-2c1a6a63-6552-4d23-86d7-58f6fba8581b-v10.0-vertex.glsl",
        fragmentShader: "Wireframe-2c1a6a63-6552-4d23-86d7-58f6fba8581b/Wireframe-2c1a6a63-6552-4d23-86d7-58f6fba8581b-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Muscle" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "Muscle-f28c395c-a57d-464b-8f0b-558c59478fa3/Muscle-f28c395c-a57d-464b-8f0b-558c59478fa3-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.3 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.305 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "Muscle-f28c395c-a57d-464b-8f0b-558c59478fa3/Muscle-f28c395c-a57d-464b-8f0b-558c59478fa3-v10.0-MainTex.png" },
            u_MainTex_ST: { value: new THREE.Vector4(0.25, 1.0, 0.0, 0.0) },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Shininess: { value: 0.57 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0.0808824, 0.0808824, 0.0808824) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "Muscle-f28c395c-a57d-464b-8f0b-558c59478fa3/Muscle-f28c395c-a57d-464b-8f0b-558c59478fa3-v10.0-vertex.glsl",
        fragmentShader: "Muscle-f28c395c-a57d-464b-8f0b-558c59478fa3/Muscle-f28c395c-a57d-464b-8f0b-558c59478fa3-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "Guts" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "Guts-99aafe96-1645-44cd-99bd-979bc6ef37c5/Guts-99aafe96-1645-44cd-99bd-979bc6ef37c5-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.3 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.305 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "Guts-99aafe96-1645-44cd-99bd-979bc6ef37c5/Guts-99aafe96-1645-44cd-99bd-979bc6ef37c5-v10.0-MainTex.png" },
            u_MainTex_ST: { value: new THREE.Vector4(0.15, 1.0, 0.0, 0.0) },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Shininess: { value: 0.743 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0.237457, 0.257941, 0.264706) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "Guts-99aafe96-1645-44cd-99bd-979bc6ef37c5/Guts-99aafe96-1645-44cd-99bd-979bc6ef37c5-v10.0-vertex.glsl",
        fragmentShader: "Guts-99aafe96-1645-44cd-99bd-979bc6ef37c5/Guts-99aafe96-1645-44cd-99bd-979bc6ef37c5-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "Fire2" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_DisplaceTex: { value: "Fire2-53d753ef-083c-45e1-98e7-4459b4471219/Fire2-53d753ef-083c-45e1-98e7-4459b4471219-v10.0-DisplaceTex.png" },
            u_DisplacementIntensity: { value: 0.04 },
            u_EmissionGain: { value: 0.405 },
            u_FlameFadeMax: { value: 30.0 },
            u_FlameFadeMin: { value: 8.53 },
            u_InvFade: { value: 1.0 },
            u_MainTex: { value: "Fire2-53d753ef-083c-45e1-98e7-4459b4471219/Fire2-53d753ef-083c-45e1-98e7-4459b4471219-v10.0-MainTex.png" },
            u_MainTex_ST: { value: new THREE.Vector4(1, 1.0, 0.0, 0.0) },
            u_Scroll1: { value: 15.0 },
            u_Scroll2: { value: 8.0 },
            u_TintColor: { value: new THREE.Vector4(0.617647, 0.617647, 0.617647, 1) },
            u_time: { value: new THREE.Vector4() }
        },
        vertexShader: "Fire2-53d753ef-083c-45e1-98e7-4459b4471219/Fire2-53d753ef-083c-45e1-98e7-4459b4471219-v10.0-vertex.glsl",
        fragmentShader: "Fire2-53d753ef-083c-45e1-98e7-4459b4471219/Fire2-53d753ef-083c-45e1-98e7-4459b4471219-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "TubeToonInverted" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
        },
        vertexShader: "TubeToonInverted-9871385a-df73-4396-9e33-31e4e4930b27/TubeToonInverted-9871385a-df73-4396-9e33-31e4e4930b27-v10.0-vertex.glsl",
        fragmentShader: "TubeToonInverted-9871385a-df73-4396-9e33-31e4e4930b27/TubeToonInverted-9871385a-df73-4396-9e33-31e4e4930b27-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "FacetedTube" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_ColorX: { value: new THREE.Vector4(1, 0, 0, 1) },
            u_ColorY: { value: new THREE.Vector4(0, 1, 0, 1) },
            u_ColorZ: { value: new THREE.Vector4(0, 0, 1, 1) }
        },
        vertexShader: "FacetedTube-4391ffaa-df73-4396-9e33-31e4e4930b27/FacetedTube-4391ffaa-df73-4396-9e33-31e4e4930b27-v10.0-vertex.glsl",
        fragmentShader: "FacetedTube-4391ffaa-df73-4396-9e33-31e4e4930b27/FacetedTube-4391ffaa-df73-4396-9e33-31e4e4930b27-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "WaveformParticles" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_time: { value: new THREE.Vector4() }
        },
        vertexShader: "WaveformParticles-6a1cf9f9-032c-45ec-9b6e-a6680bee30f7/WaveformParticles-6a1cf9f9-032c-45ec-9b6e-a6680bee30f7-v10.0-vertex.glsl",
        fragmentShader: "WaveformParticles-6a1cf9f9-032c-45ec-9b6e-a6680bee30f7/WaveformParticles-6a1cf9f9-032c-45ec-9b6e-a6680bee30f7-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "BubbleWand" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DisplacementIntensity: { value: 0.1 },
            u_EmissionGain: { value: 0.25 },
            u_InvFade: { value: 1.0 },
            u_MainTex: { value: "BubbleWand-eba3f993-f9a1-4d35-b84e-bb08f48981a4/BubbleWand-eba3f993-f9a1-4d35-b84e-bb08f48981a4-v10.0-MainTex.png" },
            u_Scroll1: { value: 2.0 },
            u_Scroll2: { value: -2.0 },
            u_ScrollJitterFrequency: { value: 1.0 },
            u_ScrollJitterIntensity: { value: 3.0 },
            u_ScrollRate: { value: -0.54 },
            u_Smoothness: { value: 0.078125 },
            u_Strength: { value: 0.5 },
            u_TintColor: { value: new THREE.Vector4(0.617647, 0.617647, 0.617647, 1) },
            u_time: { value: new THREE.Vector4() }
        },
        isSurfaceShader: true,
        vertexShader: "BubbleWand-eba3f993-f9a1-4d35-b84e-bb08f48981a4/BubbleWand-eba3f993-f9a1-4d35-b84e-bb08f48981a4-v10.0-vertex.glsl",
        fragmentShader: "BubbleWand-eba3f993-f9a1-4d35-b84e-bb08f48981a4/BubbleWand-eba3f993-f9a1-4d35-b84e-bb08f48981a4-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "DanceFloor" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_time: { value: new THREE.Vector4() },
            u_MainTex: { value: "DanceFloor-6a1cf9f9-032c-45ec-311e-a6680bee32e9/DanceFloor-6a1cf9f9-032c-45ec-311e-a6680bee32e9-v10.0-MainTex.png" },
            u_TintColor: { value: new THREE.Vector4(0.5, 0.5, 0.5, 0.5) }
        },
        vertexShader: "DanceFloor-6a1cf9f9-032c-45ec-311e-a6680bee32e9/DanceFloor-6a1cf9f9-032c-45ec-311e-a6680bee32e9-v10.0-vertex.glsl",
        fragmentShader: "DanceFloor-6a1cf9f9-032c-45ec-311e-a6680bee32e9/DanceFloor-6a1cf9f9-032c-45ec-311e-a6680bee32e9-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthWrite: true,
        depthTest: true
    },
    "WaveformTube" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_time: { value: new THREE.Vector4() }
        },
        vertexShader: "WaveformTube-0f5820df-cb6b-4a6c-960e-56e4c8000eda/WaveformTube-0f5820df-cb6b-4a6c-960e-56e4c8000eda-v10.0-vertex.glsl",
        fragmentShader: "WaveformTube-0f5820df-cb6b-4a6c-960e-56e4c8000eda/WaveformTube-0f5820df-cb6b-4a6c-960e-56e4c8000eda-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Drafting" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_Opacity: { value: 1.0 },
            u_DraftingVisibility01: { value: 1.0 }
        },
        vertexShader: "Drafting-492b36ff-b337-436a-ba5f-1e87ee86747e/Drafting-492b36ff-b337-436a-ba5f-1e87ee86747e-v10.0-vertex.glsl",
        fragmentShader: "Drafting-492b36ff-b337-436a-ba5f-1e87ee86747e/Drafting-492b36ff-b337-436a-ba5f-1e87ee86747e-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "SingleSided" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "SingleSided-f0a2298a-be80-432c-9fee-a86dcc06f4f9/SingleSided-f0a2298a-be80-432c-9fee-a86dcc06f4f9-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "SingleSided-f0a2298a-be80-432c-9fee-a86dcc06f4f9/SingleSided-f0a2298a-be80-432c-9fee-a86dcc06f4f9-v10.0-vertex.glsl",
        fragmentShader: "SingleSided-f0a2298a-be80-432c-9fee-a86dcc06f4f9/SingleSided-f0a2298a-be80-432c-9fee-a86dcc06f4f9-v10.0-fragment.glsl",
        side: 0,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0,
    },
    "DoubleFlat" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "DoubleFlat-f4a0550c-332a-4e1a-9793-b71508f4a454/DoubleFlat-f4a0550c-332a-4e1a-9793-b71508f4a454-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "DoubleFlat-f4a0550c-332a-4e1a-9793-b71508f4a454/DoubleFlat-f4a0550c-332a-4e1a-9793-b71508f4a454-v10.0-vertex.glsl",
        fragmentShader: "DoubleFlat-f4a0550c-332a-4e1a-9793-b71508f4a454/DoubleFlat-f4a0550c-332a-4e1a-9793-b71508f4a454-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "TubeAdditive" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_MainTex: { value: null },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
        },
        vertexShader: "TubeAdditive-c1c9b26d-673a-4dc6-b373-51715654ab96/TubeAdditive-c1c9b26d-673a-4dc6-b373-51715654ab96-v10.0-vertex.glsl",
        fragmentShader: "TubeAdditive-c1c9b26d-673a-4dc6-b373-51715654ab96/TubeAdditive-c1c9b26d-673a-4dc6-b373-51715654ab96-v10.0-fragment.glsl",
        side: 0,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Feather" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_EmissionGain: { value: 0.5 },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "Feather-a555b809-2017-46cb-ac26-e63173d8f45e/Feather-a555b809-2017-46cb-ac26-e63173d8f45e-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        vertexShader: "Feather-a555b809-2017-46cb-ac26-e63173d8f45e/Feather-a555b809-2017-46cb-ac26-e63173d8f45e-v10.0-vertex.glsl",
        fragmentShader: "Feather-a555b809-2017-46cb-ac26-e63173d8f45e/Feather-a555b809-2017-46cb-ac26-e63173d8f45e-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "DuctTapeGeometry" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0.5372549, 0.5372549, 0.5372549) },
            u_Shininess: { value: 0.414 },
            u_MainTex: { value: "DuctTapeGeometry-84d5bbb2-6634-8434-f8a7-681b576b4664/DuctTapeGeometry-84d5bbb2-6634-8434-f8a7-681b576b4664-v10.0-MainTex.png" },
            u_Cutoff: { value: 0.2 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "DuctTapeGeometry-84d5bbb2-6634-8434-f8a7-681b576b4664/DuctTapeGeometry-84d5bbb2-6634-8434-f8a7-681b576b4664-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) }
        },
        isSurfaceShader: true,
        vertexShader: "DuctTapeGeometry-84d5bbb2-6634-8434-f8a7-681b576b4664/DuctTapeGeometry-84d5bbb2-6634-8434-f8a7-681b576b4664-v10.0-vertex.glsl",
        fragmentShader: "DuctTapeGeometry-84d5bbb2-6634-8434-f8a7-681b576b4664/DuctTapeGeometry-84d5bbb2-6634-8434-f8a7-681b576b4664-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "TaperedHueShift" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_EmissionGain: { value: 0.5 },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "TaperedHueShift-3d9755da-56c7-7294-9b1d-5ec349975f52/TaperedHueShift-3d9755da-56c7-7294-9b1d-5ec349975f52-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        vertexShader: "TaperedHueShift-3d9755da-56c7-7294-9b1d-5ec349975f52/TaperedHueShift-3d9755da-56c7-7294-9b1d-5ec349975f52-v10.0-vertex.glsl",
        fragmentShader: "TaperedHueShift-3d9755da-56c7-7294-9b1d-5ec349975f52/TaperedHueShift-3d9755da-56c7-7294-9b1d-5ec349975f52-v10.0-fragment.glsl",
        side: 2,
        transparent: false,
        depthFunc: 2,
        depthWrite: true,
        depthTest: true,
        blending: 0,
    },
    "Lacewing" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c/Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_Cutoff: { value: 0.9 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 0.741 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c/Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 1.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Shininess: { value: 0.8 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0.147059, 0.147059, 0.147059) },
            u_SpecGlossMap: { value: "Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c/Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c-v10.0-SpecGlossMap.png" },
            u_SpecTex: { value: "Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c/Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c-v10.0-SpecTex.png" },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c/Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c-v10.0-vertex.glsl",
        fragmentShader: "Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c/Lacewing-1cf94f63-f57a-4a1a-ad14-295af4f5ab5c-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "Marbled Rainbow" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1/Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 0.741 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1/Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 1.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Shininess: { value: 0.8 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0.220588, 0.220588, 0.220588) },
            u_SpecGlossMap: { value: "Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1/Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1-v10.0-SpecGlossMap.png" },
            u_SpecTex: { value: "Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1/Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1-v10.0-SpecTex.png" },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1/Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1-v10.0-vertex.glsl",
        fragmentShader: "Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1/Marbled Rainbow-c86c058d-1bda-2e94-08db-f3d6a96ac4a1-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "Charcoal" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "Charcoal-fde6e778-0f7a-e584-38d6-89d44cee59f6/Charcoal-fde6e778-0f7a-e584-38d6-89d44cee59f6-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "Charcoal-fde6e778-0f7a-e584-38d6-89d44cee59f6/Charcoal-fde6e778-0f7a-e584-38d6-89d44cee59f6-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Shininess: { value: 0.01 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "Charcoal-fde6e778-0f7a-e584-38d6-89d44cee59f6/Charcoal-fde6e778-0f7a-e584-38d6-89d44cee59f6-v10.0-vertex.glsl",
        fragmentShader: "Charcoal-fde6e778-0f7a-e584-38d6-89d44cee59f6/Charcoal-fde6e778-0f7a-e584-38d6-89d44cee59f6-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0
    },
    "KeijiroTube" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Shininess: { value: 0.432 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0.757353, 0.757353, 0.757353) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 },
            u_time: { value: new THREE.Vector4() }
        },
        isSurfaceShader: true,
        vertexShader: "KeijiroTube-f8ba3d18-01fc-4d7b-b2d9-b99d10b8e7cf/KeijiroTube-f8ba3d18-01fc-4d7b-b2d9-b99d10b8e7cf-v10.0-vertex.glsl",
        fragmentShader: "KeijiroTube-f8ba3d18-01fc-4d7b-b2d9-b99d10b8e7cf/KeijiroTube-f8ba3d18-01fc-4d7b-b2d9-b99d10b8e7cf-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "Lofted (Hue Shift)" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
        },
        vertexShader: "Lofted (Hue Shift)-c5da2e70-a6e4-63a4-898c-5cfedef09c97/Lofted (Hue Shift)-c5da2e70-a6e4-63a4-898c-5cfedef09c97-v10.0-vertex.glsl",
        fragmentShader: "Lofted (Hue Shift)-c5da2e70-a6e4-63a4-898c-5cfedef09c97/Lofted (Hue Shift)-c5da2e70-a6e4-63a4-898c-5cfedef09c97-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "Wire (Lit)" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Shininess: { value: 0.078125 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "Wire (Lit)-62fef968-e842-3224-4a0e-1fdb7cfb745c/Wire (Lit)-62fef968-e842-3224-4a0e-1fdb7cfb745c-v10.0-vertex.glsl",
        fragmentShader: "Wire (Lit)-62fef968-e842-3224-4a0e-1fdb7cfb745c/Wire (Lit)-62fef968-e842-3224-4a0e-1fdb7cfb745c-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "WaveformFFT" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_time: { value: new THREE.Vector4() }
        },
        vertexShader: "WaveformFFT-d120944d-772f-4062-99c6-46a6f219eeaf/WaveformFFT-d120944d-772f-4062-99c6-46a6f219eeaf-v10.0-vertex.glsl",
        fragmentShader: "WaveformFFT-d120944d-772f-4062-99c6-46a6f219eeaf/WaveformFFT-d120944d-772f-4062-99c6-46a6f219eeaf-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Fairy" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_EmissionGain: { value: 0.5 },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 },
            u_time: { value: new THREE.Vector4() }
        },
        vertexShader: "Fairy-d9cc5e99-ace1-4d12-96e0-4a7c18c99cfc/Fairy-d9cc5e99-ace1-4d12-96e0-4a7c18c99cfc-v10.0-vertex.glsl",
        fragmentShader: "Fairy-d9cc5e99-ace1-4d12-96e0-4a7c18c99cfc/Fairy-d9cc5e99-ace1-4d12-96e0-4a7c18c99cfc-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "Space" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_time: { value: new THREE.Vector4() }
        },
        vertexShader: "Space-bdf65db2-1fb7-4202-b5e0-c6b5e3ea851e/Space-bdf65db2-1fb7-4202-b5e0-c6b5e3ea851e-v10.0-vertex.glsl",
        fragmentShader: "Space-bdf65db2-1fb7-4202-b5e0-c6b5e3ea851e/Space-bdf65db2-1fb7-4202-b5e0-c6b5e3ea851e-v10.0-fragment.glsl",
        side: 2,
        transparent: true,
        depthFunc: 2,
        depthWrite: false,
        depthTest: true,
        blending: 2
    },
    "SmoothHull" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_Bottom: { value: "SmoothHull-355b3579-bf1d-4ff5-a200-704437fe684b/SmoothHull-355b3579-bf1d-4ff5-a200-704437fe684b-v10.0-Bottom.png" },
            u_BottomScale: { value: 0.3 },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Shininess: { value: 0.574 },
            u_Side: { value: "SmoothHull-355b3579-bf1d-4ff5-a200-704437fe684b/SmoothHull-355b3579-bf1d-4ff5-a200-704437fe684b-v10.0-Side.png" },
            u_SideScale: { value: 5.21 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0.294118, 0.294118, 0.294118) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_Top: { value: "SmoothHull-355b3579-bf1d-4ff5-a200-704437fe684b/SmoothHull-355b3579-bf1d-4ff5-a200-704437fe684b-v10.0-Top.png" },
            u_TopScale: { value: 0.3 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "SmoothHull-355b3579-bf1d-4ff5-a200-704437fe684b/SmoothHull-355b3579-bf1d-4ff5-a200-704437fe684b-v10.0-vertex.glsl",
        fragmentShader: "SmoothHull-355b3579-bf1d-4ff5-a200-704437fe684b/SmoothHull-355b3579-bf1d-4ff5-a200-704437fe684b-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "Leaves2" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "Leaves2-7259cce5-41c1-ec74-c885-78af28a31d95/Leaves2-7259cce5-41c1-ec74-c885-78af28a31d95-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "Leaves2-7259cce5-41c1-ec74-c885-78af28a31d95/Leaves2-7259cce5-41c1-ec74-c885-78af28a31d95-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_SelectionEdging: { value: 1.0 },
            u_Shininess: { value: 0.395 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0, 0, 0) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "Leaves2-7259cce5-41c1-ec74-c885-78af28a31d95/Leaves2-7259cce5-41c1-ec74-c885-78af28a31d95-v10.0-vertex.glsl",
        fragmentShader: "Leaves2-7259cce5-41c1-ec74-c885-78af28a31d95/Leaves2-7259cce5-41c1-ec74-c885-78af28a31d95-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0
    },
    "InkGeometry" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "InkGeometry-7c972c27-d3c2-8af4-7bf8-5d9db8f0b7bb/InkGeometry-7c972c27-d3c2-8af4-7bf8-5d9db8f0b7bb-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_MainTex: { value: "InkGeometry-7c972c27-d3c2-8af4-7bf8-5d9db8f0b7bb/InkGeometry-7c972c27-d3c2-8af4-7bf8-5d9db8f0b7bb-v10.0-MainTex.png" },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_SelectionEdging: { value: 1.0 },
            u_Shininess: { value: 0.4 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0.235294, 0.235294, 0.235294) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "InkGeometry-7c972c27-d3c2-8af4-7bf8-5d9db8f0b7bb/InkGeometry-7c972c27-d3c2-8af4-7bf8-5d9db8f0b7bb-v10.0-vertex.glsl",
        fragmentShader: "InkGeometry-7c972c27-d3c2-8af4-7bf8-5d9db8f0b7bb/InkGeometry-7c972c27-d3c2-8af4-7bf8-5d9db8f0b7bb-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "ConcaveHull" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_SpecColor: { value: new THREE.Vector3(0.5372549, 0.5372549, 0.5372549) },
            u_Shininess: { value: 0.414 },
            u_MainTex: { value: "Bubbles-89d104cd-d012-426b-b5b3-bbaee63ac43c/Bubbles-89d104cd-d012-426b-b5b3-bbaee63ac43c-v10.0-MainTex.png" },
            u_Cutoff: { value: 0.2 },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_BumpMap: { value: "Charcoal-fde6e778-0f7a-e584-38d6-89d44cee59f6/Charcoal-fde6e778-0f7a-e584-38d6-89d44cee59f6-v10.0-BumpMap.png" },
            u_BumpMap_TexelSize: { value: new THREE.Vector4(0.0010, 0.0078, 1024, 128) }
        },
        isSurfaceShader: true,
        vertexShader: "ConcaveHull-7ae1f880-a517-44a0-99f9-1cab654498c6/ConcaveHull-7ae1f880-a517-44a0-99f9-1cab654498c6-v10.0-vertex.glsl",
        fragmentShader: "ConcaveHull-7ae1f880-a517-44a0-99f9-1cab654498c6/ConcaveHull-7ae1f880-a517-44a0-99f9-1cab654498c6-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0
    },
    "3D Printing Brush" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 }
        },
        isSurfaceShader: true,
        vertexShader: "3D Printing Brush-d3f3b18a-da03-f694-b838-28ba8e749a98/3D Printing Brush-d3f3b18a-da03-f694-b838-28ba8e749a98-v10.0-vertex.glsl",
        fragmentShader: "3D Printing Brush-d3f3b18a-da03-f694-b838-28ba8e749a98/3D Printing Brush-d3f3b18a-da03-f694-b838-28ba8e749a98-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0,
    },
    "PassthroughHull" : {
        uniforms: {
            u_SceneLight_0_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_SceneLight_1_matrix: { value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
            u_ambient_light_color: { value: new THREE.Vector4(0.3922, 0.3922, 0.3922, 1) },
            u_SceneLight_0_color: { value: new THREE.Vector4(0.7780, 0.8157, 0.9914, 1) },
            u_SceneLight_1_color: { value: new THREE.Vector4(0.4282, 0.4212, 0.3459, 1) },
            u_fogColor: { value: new THREE.Vector3(0.0196, 0.0196, 0.0196) },
            u_fogDensity: { value: 0 },
            u_Bottom: { value: "PassthroughHull-cc131ff8-0d17-4677-93e0-d7cd19fea9ac/PassthroughHull-cc131ff8-0d17-4677-93e0-d7cd19fea9ac-v10.0-Bottom.png" },
            u_BottomScale: { value: 0.3 },
            u_BumpScale: { value: 1.0 },
            u_Color: { value: new THREE.Vector4(1, 1, 1, 1) },
            u_Cutoff: { value: 0.5 },
            u_DetailNormalMapScale: { value: 1.0 },
            u_DstBlend: { value: 0.0 },
            u_EmissionColor: { value: new THREE.Vector4(0, 0, 0, 1) },
            u_GlossMapScale: { value: 1.0 },
            u_Glossiness: { value: 0.5 },
            u_GlossyReflections: { value: 1.0 },
            u_Metallic: { value: 0.0 },
            u_Mode: { value: 0.0 },
            u_OcclusionStrength: { value: 1.0 },
            u_Parallax: { value: 0.02 },
            u_Shininess: { value: 0.574 },
            u_Side: { value: "PassthroughHull-cc131ff8-0d17-4677-93e0-d7cd19fea9ac/PassthroughHull-cc131ff8-0d17-4677-93e0-d7cd19fea9ac-v10.0-Side.png" },
            u_SideScale: { value: 5.21 },
            u_SmoothnessTextureChannel: { value: 0.0 },
            u_SpecColor: { value: new THREE.Vector3(0.294118, 0.294118, 0.294118) },
            u_SpecularHighlights: { value: 1.0 },
            u_SrcBlend: { value: 1.0 },
            u_Top: { value: "PassthroughHull-cc131ff8-0d17-4677-93e0-d7cd19fea9ac/PassthroughHull-cc131ff8-0d17-4677-93e0-d7cd19fea9ac-v10.0-Top.png" },
            u_TopScale: { value: 0.3 },
            u_UVSec: { value: 0.0 },
            u_ZWrite: { value: 1.0 }
        },
        isSurfaceShader: true,
        vertexShader: "PassthroughHull-cc131ff8-0d17-4677-93e0-d7cd19fea9ac/PassthroughHull-cc131ff8-0d17-4677-93e0-d7cd19fea9ac-v10.0-vertex.glsl",
        fragmentShader: "PassthroughHull-cc131ff8-0d17-4677-93e0-d7cd19fea9ac/PassthroughHull-cc131ff8-0d17-4677-93e0-d7cd19fea9ac-v10.0-fragment.glsl",
        side: 0, // TODO
        transparent: false, // TODO
        depthFunc: 2,
        depthWrite: true, // TODO
        depthTest: true,
        blending: 0
    },
}
