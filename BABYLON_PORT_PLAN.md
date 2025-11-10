# Babylon.js Port - Architecture Plan

## Overview

The **three-icosa** library loads VR paintings from Open Brush/Tilt Brush by implementing a custom glTF extension that replaces standard materials with 106 brush-specific shaders. This document outlines a comprehensive plan for porting the library to Babylon.js.

### Current Architecture

- **Framework**: three.js (peer dependency >= 0.139.0)
- **Shader System**: GLSL 3.0 with `RawShaderMaterial`
- **Extension**: `GOOGLE_tilt_brush_material` glTF loader extension
- **Brushes**: 106 unique brush implementations with custom vertex/fragment shaders
- **Features**: Custom lighting (2 directional + 1 ambient), PBR-like BRDF, fog, time-based animation

---

## 1. Core Architecture Mapping

| Component | three.js | Babylon.js Equivalent |
|-----------|----------|----------------------|
| **Custom Material** | `THREE.RawShaderMaterial` | `BABYLON.ShaderMaterial` |
| **Shader Loading** | `THREE.FileLoader` | `BABYLON.Tools.LoadFile()` or custom loader |
| **Texture Loading** | `THREE.TextureLoader` | `BABYLON.Texture` constructor |
| **glTF Extension** | `GLTFLoader.register()` | `BABYLON.GLTFLoader.RegisterExtension()` |
| **Uniforms** | Manual uniform object | `material.setFloat()`, `material.setTexture()`, etc. |
| **Attributes** | Manual remapping via `BufferGeometry` | Automatic via Babylon's vertex buffer system |
| **Lighting** | Custom uniform injection | `scene.lights` auto-bound or manual binding |

---

## 2. Key Components to Port

### A. TiltShaderLoader → BabylonTiltShaderLoader

**Location**: `src/TiltShaderLoader.js` → `src/BabylonTiltShaderLoader.js`

**Responsibilities**:
- Load vertex/fragment shader files
- Load and configure textures
- Create `BABYLON.ShaderMaterial` instances
- Bind uniforms and samplers
- Configure render states (transparency, culling, depth)

**Implementation Sketch**:

```javascript
export class BabylonTiltShaderLoader {
  constructor(scene) {
    this.scene = scene;
    this.loadedMaterials = {};
    this.brushPath = '';
  }

  async load(brushName, onLoad) {
    // Check cache
    if (this.loadedMaterials[brushName]) {
      onLoad(this.loadedMaterials[brushName]);
      return;
    }

    const params = this.lookupMaterialParams(brushName);
    if (!params) {
      console.warn(`No material params found for ${brushName}`);
      return;
    }

    // 1. Load shaders (convert GLSL 3.0 → Babylon format)
    const vertexShader = await this.loadShader(params.vertexShader);
    const fragmentShader = await this.loadShader(params.fragmentShader);

    // 2. Load shader includes
    if (!this.surfaceShaderCode && params.isSurfaceShader) {
      this.surfaceShaderCode = await this.loadShaderIncludes('includes/SurfaceShaderIncludes.glsl');
    }
    if (!this.fogShaderCode) {
      this.fogShaderCode = await this.loadShaderIncludes('includes/FogShaderIncludes.glsl');
    }

    // 3. Prepend includes to fragment shader
    let finalFragmentShader = this.fogShaderCode + '\n' + fragmentShader;
    if (params.isSurfaceShader) {
      finalFragmentShader = this.surfaceShaderCode + '\n' + finalFragmentShader;
    }

    // 4. Convert GLSL 3.0 to GLSL 1.0 (Babylon format)
    const convertedVertex = this.convertGLSL3ToBabylon(vertexShader);
    const convertedFragment = this.convertGLSL3ToBabylon(finalFragmentShader);

    // 5. Register shader with Babylon's effect system
    BABYLON.Effect.ShadersStore[`${brushName}VertexShader`] = convertedVertex;
    BABYLON.Effect.ShadersStore[`${brushName}FragmentShader`] = convertedFragment;

    // 6. Create ShaderMaterial
    const material = new BABYLON.ShaderMaterial(
      brushName,
      this.scene,
      {
        vertex: brushName,
        fragment: brushName
      },
      {
        attributes: ["position", "normal", "color", "uv", "tangent", "texcoord0"],
        uniforms: this.getUniformNames(params),
        samplers: this.getSamplerNames(params),
        needAlphaBlending: params.transparent,
        needAlphaTesting: params.alphaTest
      }
    );

    // 7. Load and bind textures
    await this.loadTextures(material, params);

    // 8. Bind static uniforms
    this.bindUniforms(material, params);

    // 9. Set render states
    material.backFaceCulling = params.side !== 2; // DoubleSide = 2
    material.transparencyMode = this.mapBlendMode(params.blending);
    material.alphaMode = params.transparent ?
      BABYLON.Engine.ALPHA_COMBINE :
      BABYLON.Engine.ALPHA_DISABLE;
    material.depthWrite = params.depthWrite !== false;

    // 10. Register animation callback for time uniform
    this.scene.registerBeforeRender(() => {
      const time = this.scene.getEngine().getDeltaTime() / 1000.0;
      material.setFloat("u_time", time);
    });

    // Cache and return
    this.loadedMaterials[brushName] = material;
    onLoad(material);
  }

  bindUniforms(material, params) {
    for (const [name, uniform] of Object.entries(params.uniforms)) {
      const value = uniform.value;

      if (typeof value === 'number') {
        material.setFloat(name, value);
      } else if (value.isVector2) {
        material.setVector2(name, new BABYLON.Vector2(value.x, value.y));
      } else if (value.isVector3) {
        material.setVector3(name, new BABYLON.Vector3(value.x, value.y, value.z));
      } else if (value.isVector4 || value.isColor) {
        material.setColor4(name, new BABYLON.Color4(value.x, value.y, value.z, value.w || 1));
      } else if (value.isMatrix4) {
        material.setMatrix(name, BABYLON.Matrix.FromArray(value.elements));
      }
      // Textures handled separately
    }
  }

  async loadTextures(material, params) {
    // u_MainTex
    if (params.uniforms.u_MainTex) {
      const texture = await this.loadTexture(
        params.uniforms.u_MainTex.value,
        true // sRGB
      );
      material.setTexture("u_MainTex", texture);
    }

    // u_BumpMap
    if (params.uniforms.u_BumpMap) {
      const texture = await this.loadTexture(
        params.uniforms.u_BumpMap.value,
        false // linear
      );
      material.setTexture("u_BumpMap", texture);
    }

    // Additional textures: u_AlphaMask, u_DisplaceTex, etc.
    // ... similar pattern
  }

  async loadTexture(pathOrNull, sRGB) {
    if (!pathOrNull) {
      return sRGB ? this.getDefaultWhiteTexture() : this.getDefaultNormalTexture();
    }

    const texture = new BABYLON.Texture(
      this.brushPath + pathOrNull,
      this.scene,
      false, // noMipmap
      true,  // invertY
      BABYLON.Texture.TRILINEAR_SAMPLINGMODE
    );

    texture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
    texture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
    texture.gammaSpace = sRGB;

    return texture;
  }

  getDefaultWhiteTexture() {
    if (!this._defaultWhite) {
      this._defaultWhite = new BABYLON.Texture.CreateFromBase64String(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
        "DefaultWhiteTexture",
        this.scene
      );
    }
    return this._defaultWhite;
  }

  getDefaultNormalTexture() {
    if (!this._defaultNormal) {
      // RGB: (128, 128, 255) = neutral normal
      const normalData = new Uint8Array([128, 128, 255, 255]);
      this._defaultNormal = BABYLON.RawTexture.CreateRGBATexture(
        normalData,
        1,
        1,
        this.scene,
        false,
        false,
        BABYLON.Texture.NEAREST_SAMPLINGMODE
      );
    }
    return this._defaultNormal;
  }

  mapBlendMode(threeBlending) {
    // Map three.js blending modes to Babylon
    switch (threeBlending) {
      case 0: // NoBlending
        return BABYLON.Material.MATERIAL_OPAQUE;
      case 1: // NormalBlending
        return BABYLON.Material.MATERIAL_ALPHABLEND;
      case 2: // AdditiveBlending
        return BABYLON.Material.MATERIAL_ALPHABLEND; // May need custom
      case 3: // SubtractiveBlending
        return BABYLON.Material.MATERIAL_ALPHABLEND;
      case 4: // MultiplyBlending
        return BABYLON.Material.MATERIAL_ALPHABLEND;
      default:
        return BABYLON.Material.MATERIAL_OPAQUE;
    }
  }
}
```

---

### B. Shader Conversion (GLSL 3.0 → Babylon GLSL)

**Key Differences**:

| three.js GLSL 3.0 | Babylon.js GLSL 1.0 |
|-------------------|---------------------|
| `#version 300 es` | Remove (implicit GLSL 1.0) |
| `in vec4 a_position;` | `attribute vec3 position;` |
| `in vec3 a_normal;` | `attribute vec3 normal;` |
| `in vec4 a_color;` | `attribute vec4 color;` |
| `in vec3 a_texcoord0;` | `attribute vec3 texcoord0;` (custom) |
| `in vec4 a_tangent;` | `attribute vec4 tangent;` |
| `out vec4 v_color;` | `varying vec4 v_color;` |
| `uniform mat4 modelMatrix;` | `uniform mat4 world;` |
| `uniform mat4 viewMatrix;` | `uniform mat4 view;` |
| `uniform mat4 projectionMatrix;` | `uniform mat4 projection;` |
| `uniform mat4 modelViewMatrix;` | `uniform mat4 worldView;` |
| `uniform mat3 normalMatrix;` | Compute from `world` matrix |
| `texture(sampler, uv)` | `texture2D(sampler, uv)` |
| `out vec4 fragColor;` | Remove (use `gl_FragColor`) |
| `fragColor = ...` | `gl_FragColor = ...` |

**Automated Conversion Function**:

```javascript
convertGLSL3ToBabylon(glslCode) {
  let converted = glslCode;

  // Remove version directive
  converted = converted.replace(/#version 300 es\n/g, '');

  // Convert vertex shader attributes
  converted = converted.replace(/\bin vec4 a_position\b/g, 'attribute vec3 position');
  converted = converted.replace(/\bin vec3 a_normal\b/g, 'attribute vec3 normal');
  converted = converted.replace(/\bin vec4 a_color\b/g, 'attribute vec4 color');
  converted = converted.replace(/\bin vec3 a_texcoord0\b/g, 'attribute vec3 texcoord0');
  converted = converted.replace(/\bin vec4 a_tangent\b/g, 'attribute vec4 tangent');
  converted = converted.replace(/\bin vec2 a_texcoord0\b/g, 'attribute vec2 uv');

  // Convert varyings (out → varying in vertex, in → varying in fragment)
  converted = converted.replace(/\bout (vec[234]|float|mat[234])\s+(\w+);/g, 'varying $1 $2;');
  converted = converted.replace(/\bin (vec[234]|float|mat[234])\s+(v_\w+);/g, 'varying $1 $2;');

  // Convert uniforms (three.js → Babylon naming)
  converted = converted.replace(/\buniform mat4 modelMatrix\b/g, 'uniform mat4 world');
  converted = converted.replace(/\buniform mat4 viewMatrix\b/g, 'uniform mat4 view');
  converted = converted.replace(/\buniform mat4 projectionMatrix\b/g, 'uniform mat4 projection');
  converted = converted.replace(/\buniform mat4 modelViewMatrix\b/g, 'uniform mat4 worldView');
  converted = converted.replace(/\bprojectionMatrix \* modelViewMatrix\b/g, 'worldViewProjection');

  // Convert texture sampling
  converted = converted.replace(/\btexture\(/g, 'texture2D(');

  // Remove fragment shader output declaration
  converted = converted.replace(/\bout vec4 fragColor;\n/g, '');

  // Convert fragment output
  converted = converted.replace(/\bfragColor\b/g, 'gl_FragColor');

  // Convert normal matrix usage (needs manual computation)
  if (converted.includes('normalMatrix')) {
    // Add helper to compute normal matrix
    const normalMatrixHelper = `
mat3 getNormalMatrix(mat4 worldMat) {
  return mat3(worldMat);
}
`;
    converted = normalMatrixHelper + converted;
    converted = converted.replace(/\buniform mat3 normalMatrix\b/g, '// uniform mat3 normalMatrix (computed from world)');
    converted = converted.replace(/\bnormalMatrix\b/g, 'getNormalMatrix(world)');
  }

  return converted;
}
```

**Example Conversion**:

**Before (three.js GLSL 3.0)**:
```glsl
#version 300 es
in vec4 a_position;
in vec3 a_normal;
in vec4 a_color;
in vec3 a_texcoord0;

out vec4 v_color;
out vec3 v_normal;
out vec2 v_texcoord0;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * a_position;
  v_normal = normalize(normalMatrix * a_normal);
  v_color = a_color;
  v_texcoord0 = a_texcoord0.xy;
}
```

**After (Babylon GLSL 1.0)**:
```glsl
precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec3 texcoord0;

varying vec4 v_color;
varying vec3 v_normal;
varying vec2 v_texcoord0;

uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;
uniform mat4 worldViewProjection;

void main() {
  gl_Position = worldViewProjection * vec4(position, 1.0);

  // Compute normal matrix from world matrix
  mat3 normalMatrix = mat3(world);
  v_normal = normalize(normalMatrix * normal);

  v_color = color;
  v_texcoord0 = texcoord0.xy;
}
```

---

### C. glTF Extension Implementation

**Location**: `src/loader/GOOGLE_tilt_brush_material.js` → `src/loader/BabylonGLTFTiltBrushExtension.ts`

**Implementation**:

```typescript
import { GLTFLoader, IGLTFLoaderExtension } from "@babylonjs/loaders";
import { Material } from "@babylonjs/core/Materials/material";
import { Nullable } from "@babylonjs/core/types";

export class GLTFGoogleTiltBrushMaterialExtension implements IGLTFLoaderExtension {
  public name = "GOOGLE_tilt_brush_material";
  public enabled = true;

  private _loader: GLTFLoader;
  private brushPath: string;
  private tiltShaderLoader: BabylonTiltShaderLoader;
  private pendingMaterialReplacements = new Map<any, Material>();

  constructor(loader: GLTFLoader, brushPath: string) {
    this._loader = loader;
    this.brushPath = brushPath;

    // Ensure trailing slash
    if (this.brushPath.slice(-1) !== "/") {
      this.brushPath += "/";
    }

    this.tiltShaderLoader = new BabylonTiltShaderLoader(loader._babylonScene);
    this.tiltShaderLoader.setPath(this.brushPath);
  }

  // Called when loading material properties
  public loadMaterialPropertiesAsync(
    context: string,
    material: any,
    babylonMaterial: Material
  ): Nullable<Promise<void>> {
    // Check if this material has the Tilt Brush extension
    const extensionDef = material.extensions?.[this.name];

    let guidOrName: string | undefined;

    if (extensionDef?.guid) {
      guidOrName = extensionDef.guid;
    } else if (material.name?.startsWith("material_")) {
      guidOrName = material.name.replace('material_', '');
    } else if (material.name?.startsWith('ob-')) {
      guidOrName = material.name.replace('ob-', '');
    } else if (material.name) {
      guidOrName = this.tryReplaceBlocksName(material.name);
    }

    if (!guidOrName) {
      return null; // Not a Tilt Brush material
    }

    return this._loadTiltBrushMaterialAsync(
      context,
      material,
      guidOrName,
      babylonMaterial
    );
  }

  private async _loadTiltBrushMaterialAsync(
    context: string,
    material: any,
    guidOrName: string,
    babylonMaterial: Material
  ): Promise<void> {
    const brushName = this.tiltShaderLoader.lookupMaterialName(guidOrName);

    if (!brushName) {
      console.warn(`No brush found for GUID/name: ${guidOrName}`);
      return;
    }

    // Load the custom Tilt Brush shader material
    const tiltMaterial = await new Promise<Material>((resolve) => {
      this.tiltShaderLoader.load(brushName, resolve);
    });

    // Store for later replacement (can't replace immediately)
    this.pendingMaterialReplacements.set(material, tiltMaterial);
  }

  // Called after entire glTF is loaded
  public onComplete(): void {
    // Traverse scene and replace materials
    const scene = this._loader._babylonScene;

    scene.meshes.forEach(mesh => {
      if (mesh.material) {
        // Try to find if this material should be replaced
        // Note: This requires tracking the glTF material → Babylon material mapping
        const replacement = this._findReplacementMaterial(mesh.material);
        if (replacement) {
          mesh.material = replacement;
        }
      }
    });
  }

  private _findReplacementMaterial(babylonMat: Material): Material | null {
    // This requires maintaining a mapping between glTF materials and Babylon materials
    // Implementation depends on how Babylon's loader exposes this info
    for (const [gltfMat, tiltMat] of this.pendingMaterialReplacements) {
      // Match by name or other identifier
      if (babylonMat.name === gltfMat.name) {
        return tiltMat;
      }
    }
    return null;
  }

  private tryReplaceBlocksName(name: string): string | undefined {
    // Handle legacy "Blocks" naming conventions
    const blocksMap: Record<string, string> = {
      "BlocksBasic": "7a1c8107-50c5-4b70-9a39-421576d6617e",
      "BlocksGem": "232998f8-d357-47a2-993a-53415df9be10",
      "BlocksGlass": "3d813d82-5839-4450-8ddc-8e889ecd96c7",
      // ... add all blocks mappings
    };
    return blocksMap[name];
  }
}

// Registration
export function registerTiltBrushExtension(brushPath: string): void {
  BABYLON.GLTFLoader.RegisterExtension(
    "GOOGLE_tilt_brush_material",
    (loader: GLTFLoader) => new GLTFGoogleTiltBrushMaterialExtension(loader, brushPath)
  );
}
```

---

## 3. Lighting System Adaptation

**Challenge**: Tilt Brush shaders expect 2 directional lights + 1 ambient light with specific uniform names.

**Solution: Manual Light Binding**

```javascript
// In BabylonTiltShaderLoader.load()
bindLightUniforms(material) {
  const scene = this.scene;

  // Find first two directional lights
  const dirLights = scene.lights.filter(l => l instanceof BABYLON.DirectionalLight).slice(0, 2);
  const ambientLight = scene.lights.find(l => l instanceof BABYLON.HemisphericLight);

  // Register per-frame update
  scene.registerBeforeRender(() => {
    if (dirLights[0]) {
      material.setVector3("u_SceneLight_0_direction", dirLights[0].direction);
      material.setColor3("u_SceneLight_0_color", dirLights[0].diffuse);

      // Light matrix (for TBN space conversion)
      const lightMatrix = BABYLON.Matrix.Identity();
      BABYLON.Matrix.LookAtLHToRef(
        BABYLON.Vector3.Zero(),
        dirLights[0].direction,
        BABYLON.Vector3.Up(),
        lightMatrix
      );
      material.setMatrix("u_SceneLight_0_matrix", lightMatrix);
    }

    if (dirLights[1]) {
      material.setVector3("u_SceneLight_1_direction", dirLights[1].direction);
      material.setColor3("u_SceneLight_1_color", dirLights[1].diffuse);
      material.setMatrix("u_SceneLight_1_matrix", /* similar */);
    }

    if (ambientLight) {
      material.setColor3("u_ambient_light_color", ambientLight.diffuse);
    }
  });
}
```

---

## 4. Attribute Remapping

**Challenge**: Tilt Brush uses `a_texcoord0` with 3 components (UV + radius), but glTF only provides 2-component UVs.

**Solution**:

```javascript
// In extension's onComplete() or post-processing step
expandTexcoord0Attribute(mesh) {
  const uvBuffer = mesh.getVertexBuffer(BABYLON.VertexBuffer.UVKind);

  if (uvBuffer) {
    const uvData = uvBuffer.getData();
    const vertexCount = uvData.length / 2;

    // Create 3-component texcoord0 (UV + radius)
    const texcoord0Data = new Float32Array(vertexCount * 3);

    for (let i = 0; i < vertexCount; i++) {
      texcoord0Data[i * 3] = uvData[i * 2];       // U
      texcoord0Data[i * 3 + 1] = uvData[i * 2 + 1]; // V
      texcoord0Data[i * 3 + 2] = 0.0;              // Radius (default)
    }

    // Set custom attribute
    mesh.setVerticesData("texcoord0", texcoord0Data, false, 3);
  }
}
```

**Shader Attribute Declaration**:

```javascript
const material = new BABYLON.ShaderMaterial(name, scene, {...}, {
  attributes: [
    "position",    // vec3
    "normal",      // vec3
    "color",       // vec4
    "uv",          // vec2 (standard)
    "tangent",     // vec4
    "texcoord0"    // vec3 (custom)
  ],
  // ...
});
```

---

## 5. Texture Management

### Default Textures

```javascript
// White texture (1x1 RGBA)
getDefaultWhiteTexture() {
  if (!this._defaultWhite) {
    const whiteData = new Uint8Array([255, 255, 255, 255]);
    this._defaultWhite = BABYLON.RawTexture.CreateRGBATexture(
      whiteData,
      1, 1,
      this.scene,
      false, // generateMipMaps
      false, // invertY
      BABYLON.Texture.NEAREST_SAMPLINGMODE
    );
    this._defaultWhite.name = "DefaultWhiteTexture";
  }
  return this._defaultWhite;
}

// Normal texture (1x1, RGB: 128,128,255)
getDefaultNormalTexture() {
  if (!this._defaultNormal) {
    const normalData = new Uint8Array([128, 128, 255, 255]);
    this._defaultNormal = BABYLON.RawTexture.CreateRGBATexture(
      normalData,
      1, 1,
      this.scene,
      false,
      false,
      BABYLON.Texture.NEAREST_SAMPLINGMODE
    );
    this._defaultNormal.name = "DefaultNormalTexture";
  }
  return this._defaultNormal;
}
```

### Texture Loading

```javascript
async loadTexture(relativePath, sRGB) {
  const texture = new BABYLON.Texture(
    this.brushPath + relativePath,
    this.scene,
    false, // noMipmap
    true,  // invertY (note: three.js uses flipY=false, Babylon default is true)
    BABYLON.Texture.TRILINEAR_SAMPLINGMODE
  );

  texture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
  texture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
  texture.gammaSpace = sRGB; // sRGB color space

  // Wait for texture to load
  await texture.whenLoadedAsync();

  return texture;
}
```

---

## 6. Fog Support

**Option 1: Manual Fog (Recommended)**

Keep the existing fog shader includes and bind fog uniforms manually:

```javascript
// In shader loader
bindFogUniforms(material) {
  this.scene.registerBeforeRender(() => {
    if (this.scene.fogEnabled) {
      material.setFloat("u_fogDensity", this.scene.fogDensity);
      material.setColor3("u_fogColor", this.scene.fogColor);
      material.setFloat("u_fogStart", this.scene.fogStart);
      material.setFloat("u_fogEnd", this.scene.fogEnd);
    }
  });
}
```

**Option 2: Babylon Built-in Fog**

Babylon can inject fog automatically, but this may conflict with custom shaders. Test compatibility.

```javascript
scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
scene.fogDensity = 0.01;
scene.fogColor = new BABYLON.Color3(0.5, 0.5, 0.5);
```

---

## 7. Animation (Time Uniform)

Many brushes use `u_time` for animated effects:

```javascript
// In shader loader
setupTimeUniform(material) {
  const startTime = Date.now();

  this.scene.registerBeforeRender(() => {
    const elapsed = (Date.now() - startTime) / 1000.0;
    material.setFloat("u_time", elapsed);

    // Some shaders use vec4 u_time
    material.setVector4("u_time", new BABYLON.Vector4(
      elapsed * 0.1,
      elapsed * 0.2,
      elapsed,
      elapsed * 1.5
    ));
  });
}
```

---

## 8. Porting Strategy - Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Deliverables**:
- [ ] Create `babylon-icosa` NPM package structure
- [ ] Port `TiltShaderLoader` → `BabylonTiltShaderLoader`
- [ ] Implement GLSL 3.0 → Babylon GLSL converter
- [ ] Convert shader includes (`SurfaceShaderIncludes.glsl`, `FogShaderIncludes.glsl`)
- [ ] Create default texture utilities

**Files to Create**:
- `package.json`
- `src/BabylonTiltShaderLoader.js`
- `src/utils/ShaderConverter.js`
- `src/utils/TextureUtils.js`

### Phase 2: Shader Conversion (Week 3-4)

**Deliverables**:
- [ ] Manually convert 10 representative brushes
- [ ] Test rendering with `BABYLON.ShaderMaterial`
- [ ] Debug attribute/uniform binding issues
- [ ] Create automated conversion script
- [ ] Convert remaining 96 brushes

**Priority Brushes** (for manual testing):
1. **BlocksBasic** - Simple, good for debugging
2. **Disco** - Animated (tests time uniform)
3. **OilPaint** - Textured (tests texture loading)
4. **Fire** - Transparent (tests blending)
5. **ChromaticWave** - Complex (tests PBR BRDF)

**Testing Strategy**:
```javascript
// Test individual brushes
const loader = new BabylonTiltShaderLoader(scene);
loader.setPath("./brushes/");
loader.load("BlocksBasic", (material) => {
  const sphere = BABYLON.MeshBuilder.CreateSphere("test", {}, scene);
  sphere.material = material;
});
```

### Phase 3: glTF Integration (Week 5-6)

**Deliverables**:
- [ ] Implement `GLTFGoogleTiltBrushMaterialExtension`
- [ ] Test with sample Tilt Brush `.glb` files
- [ ] Handle edge cases (legacy formats, missing textures)
- [ ] Implement material caching
- [ ] Support all naming conventions (GUID, `ob-`, `material_`)

**Test Models**:
- Use existing test models from `three-icosa` repo
- Test with various Open Brush exports

### Phase 4: Polish & Optimization (Week 7-8)

**Deliverables**:
- [ ] Performance optimization
  - Shader compilation caching
  - Texture atlas for small textures
  - Lazy loading of brushes
- [ ] Create demo page with Babylon.js viewer
- [ ] Write API documentation
- [ ] Write migration guide from three-icosa
- [ ] Publish to NPM

---

## 9. Key Challenges & Solutions

| Challenge | Solution | Priority |
|-----------|----------|----------|
| **106 shaders to convert** | Create automated GLSL 3.0 → GLSL 1.0 converter with regex patterns | HIGH |
| **Custom attributes (texcoord0 with Z)** | Create custom vertex buffers and declare in `ShaderMaterial` | HIGH |
| **Light uniform injection** | Use `scene.registerBeforeRender()` to update light uniforms per frame | MEDIUM |
| **Blend modes** | Map three.js blending constants to Babylon `transparencyMode` | MEDIUM |
| **Material replacement in glTF** | Store pending replacements and apply in extension's `onComplete()` | HIGH |
| **Shader compilation errors** | Add validation step, test each brush individually | HIGH |
| **Performance (106 materials)** | Cache compiled shaders, reuse materials, lazy-load brushes | MEDIUM |
| **Normal matrix computation** | Compute from world matrix in vertex shader or bind as uniform | LOW |
| **Texture coordinate flipping** | Handle `flipY`/`invertY` differences between frameworks | LOW |
| **Fog compatibility** | Keep custom fog implementation from original shaders | LOW |

---

## 10. Example Usage (After Port)

```javascript
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { registerTiltBrushExtension } from 'babylon-icosa';

// Setup
const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Camera
const camera = new BABYLON.ArcRotateCamera(
  "camera",
  Math.PI / 2,
  Math.PI / 2,
  5,
  BABYLON.Vector3.Zero(),
  scene
);
camera.attachControl(canvas, true);

// Lights (required for Tilt Brush shaders)
const light1 = new BABYLON.DirectionalLight(
  "light1",
  new BABYLON.Vector3(-1, -2, -1),
  scene
);
light1.intensity = 0.7;

const light2 = new BABYLON.DirectionalLight(
  "light2",
  new BABYLON.Vector3(1, 1, 0),
  scene
);
light2.intensity = 0.5;

const ambient = new BABYLON.HemisphericLight(
  "ambient",
  new BABYLON.Vector3(0, 1, 0),
  scene
);
ambient.intensity = 0.3;

// Register Tilt Brush extension
registerTiltBrushExtension('https://cdn.example.com/brushes/');

// Load Tilt Brush model
BABYLON.SceneLoader.Append(
  '',
  'tilt_brush_painting.glb',
  scene,
  (scene) => {
    console.log('Model loaded!');
  }
);

// Render loop
engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener('resize', () => {
  engine.resize();
});
```

---

## 11. Testing Strategy

### Unit Tests

```javascript
describe('BabylonTiltShaderLoader', () => {
  it('should load BlocksBasic material', async () => {
    const loader = new BabylonTiltShaderLoader(scene);
    const material = await loader.loadAsync('BlocksBasic');
    expect(material).toBeInstanceOf(BABYLON.ShaderMaterial);
  });

  it('should convert GLSL 3.0 to Babylon format', () => {
    const converter = new ShaderConverter();
    const input = 'in vec4 a_position;';
    const output = converter.convert(input);
    expect(output).toContain('attribute vec3 position;');
  });

  it('should handle missing textures gracefully', async () => {
    const loader = new BabylonTiltShaderLoader(scene);
    loader.setPath('./nonexistent/');
    const material = await loader.loadAsync('BlocksBasic');
    // Should use default white texture
    expect(material.getTexture('u_MainTex')).toBeDefined();
  });
});
```

### Integration Tests

```javascript
describe('glTF Integration', () => {
  it('should load Tilt Brush glTF file', async () => {
    registerTiltBrushExtension('./brushes/');
    const container = await BABYLON.SceneLoader.LoadAssetContainerAsync(
      '',
      'test_model.glb',
      scene
    );
    container.addAllToScene();

    // Check that materials were replaced
    const mesh = scene.getMeshByName('stroke_0');
    expect(mesh.material).toBeInstanceOf(BABYLON.ShaderMaterial);
  });
});
```

### Visual Regression Tests

- Capture screenshots of test models
- Compare with three-icosa reference renders
- Use tools like `playwright` or `puppeteer` for automated visual testing

---

## 12. Performance Considerations

### Shader Compilation Caching

```javascript
// Cache compiled shaders to avoid recompilation
class ShaderCache {
  constructor() {
    this.cache = new Map();
  }

  get(brushName) {
    return this.cache.get(brushName);
  }

  set(brushName, material) {
    this.cache.set(brushName, material.clone(brushName + '_clone'));
  }
}
```

### Lazy Loading

```javascript
// Only load brushes when needed
class LazyBrushLoader {
  loadOnDemand(guidOrName) {
    if (!this.loadedBrushes.has(guidOrName)) {
      return this.loadBrush(guidOrName);
    }
    return Promise.resolve(this.loadedBrushes.get(guidOrName));
  }
}
```

### Texture Atlasing

For small textures, combine into a single atlas to reduce draw calls:

```javascript
// Combine multiple 256x256 textures into 2048x2048 atlas
createTextureAtlas(textureList) {
  // Implementation using canvas or texture packer
}
```

---

## 13. Estimated Effort

| Phase | Task | Hours |
|-------|------|-------|
| **Phase 1** | Project setup | 4 |
| | TiltShaderLoader port | 12 |
| | GLSL converter | 8 |
| | Shader includes conversion | 6 |
| | **Subtotal** | **30** |
| **Phase 2** | Manual shader conversion (10 brushes) | 20 |
| | Automated script | 10 |
| | Batch conversion (96 brushes) | 15 |
| | Debugging shader issues | 15 |
| | **Subtotal** | **60** |
| **Phase 3** | glTF extension implementation | 16 |
| | Integration testing | 12 |
| | Edge case handling | 8 |
| | **Subtotal** | **36** |
| **Phase 4** | Performance optimization | 12 |
| | Demo page | 8 |
| | Documentation | 10 |
| | Testing & bug fixes | 16 |
| | **Subtotal** | **46** |
| **TOTAL** | | **172 hours** |

**Timeline**: 4-5 weeks for one experienced developer

---

## 14. Alternative: Node Material Approach

Instead of custom GLSL, use **Babylon's Node Material Editor** for some brushes:

### Pros
- Visual shader editor
- Easier to maintain
- Better performance (auto-optimized)
- Can export to JSON or code
- Cross-platform (WebGL 1/2, WebGPU)

### Cons
- More work upfront (recreate 106 brushes)
- May not support all custom effects
- Learning curve for Node Material system

### Hybrid Approach
- Convert simple brushes (30-40) to Node Materials
- Keep complex brushes (66-76) as custom GLSL
- Best of both worlds: maintainability + flexibility

---

## 15. Package Structure

```
babylon-icosa/
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE
├── examples/
│   ├── basic.html
│   └── advanced.html
├── src/
│   ├── index.ts                          # Main entry point
│   ├── BabylonTiltShaderLoader.ts        # Core shader loader
│   ├── loader/
│   │   └── GLTFTiltBrushExtension.ts     # glTF extension
│   ├── utils/
│   │   ├── ShaderConverter.ts            # GLSL conversion
│   │   ├── TextureUtils.ts               # Texture helpers
│   │   └── MaterialParams.ts             # Material definitions
│   └── materials/
│       └── tiltBrushMaterialParams.ts    # Port of material params
├── brushes/                               # Copy from three-icosa
│   ├── BlocksBasic/
│   ├── Disco/
│   └── ... (106 brushes)
└── dist/                                  # Built output
    ├── babylon-icosa.js
    ├── babylon-icosa.min.js
    └── babylon-icosa.d.ts
```

---

## 16. Migration Guide (for three-icosa Users)

### Before (three.js)

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFGoogleTiltBrushMaterialExtension } from 'three-icosa';

const gltfLoader = new GLTFLoader();
gltfLoader.register(parser =>
  new GLTFGoogleTiltBrushMaterialExtension(parser, './brushes/')
);

gltfLoader.load('model.glb', (gltf) => {
  scene.add(gltf.scene);
});
```

### After (Babylon.js)

```javascript
import * as BABYLON from '@babylonjs/core';
import { registerTiltBrushExtension } from 'babylon-icosa';

registerTiltBrushExtension('./brushes/');

BABYLON.SceneLoader.Append('', 'model.glb', scene, (scene) => {
  // Model loaded
});
```

---

## 17. Next Steps

1. **Validate approach** - Get feedback from Babylon.js community
2. **Set up dev environment** - Create repo, configure build tools
3. **Start with Phase 1** - Port core loader and converter
4. **Test early, test often** - Validate each brush as it's converted
5. **Community engagement** - Share progress, get feedback

---

## Resources

- **Babylon.js Docs**: https://doc.babylonjs.com
- **ShaderMaterial Guide**: https://doc.babylonjs.com/features/featuresDeepDive/materials/shaders/shaderMaterial
- **glTF Loader Extensions**: https://doc.babylonjs.com/features/featuresDeepDive/importers/glTF/glTFExtensions
- **three-icosa Repo**: https://github.com/icosa-gallery/three-icosa
- **Open Brush**: https://openbrush.app

---

**Author**: Generated by Claude Code
**Date**: 2025-11-10
**Version**: 1.0
