# Porting three-icosa to PlayCanvas

## Executive Summary

This document outlines a strategy for porting the three-icosa library from Three.js to PlayCanvas. The library implements glTF extensions for rendering Open Brush and Tilt Brush files with custom shaders, managing 100+ unique brush materials.

**Key Challenge**: Bridging the architectural differences between Three.js and PlayCanvas while preserving the sophisticated shader and material management system.

---

## 1. Architecture Mapping

### Three.js → PlayCanvas Core Concepts

| Three.js Component | PlayCanvas Equivalent | Notes |
|-------------------|----------------------|-------|
| `THREE.RawShaderMaterial` | `pc.Shader` + `pc.Material` | PlayCanvas separates shader definitions from material instances |
| `THREE.GLTFLoader` extension | `pc.Asset` + Custom Processor | Use PlayCanvas asset pipeline with custom glTF processor |
| `THREE.BufferAttribute` | `pc.VertexBuffer` attributes | Different semantic naming (POSITION vs a_position) |
| `THREE.UniformsLib` | Manual uniform management | PlayCanvas has no equivalent - must manually inject |
| `onBeforeRender` callback | `pc.ScriptType.update()` | Use script system or custom component update loop |
| `THREE.Loader.load()` | `pc.Asset.load()` + callbacks | Different async loading pattern |
| `THREE.TextureLoader` | `pc.AssetRegistry.loadFromUrl()` | Different texture loading API |

---

## 2. Core Components Translation

### 2.1 TiltShaderLoader → PlayCanvasShaderLoader

**Current Responsibilities** (TiltShaderLoader.js - 3,600 lines):
- Loads vertex/fragment shaders from brush directories
- Manages texture loading with caching
- Injects built-in uniforms (lights, fog)
- Maintains material parameter database

**PlayCanvas Implementation Strategy**:

```javascript
class PlayCanvasTiltShaderLoader {
    constructor(app, brushPath) {
        this.app = app;
        this.brushPath = brushPath;
        this.materialCache = new Map();
        this.shaderCache = new Map();
        this.textureCache = new Map();
    }

    async loadAsync(brushNameOrGuid, params = {}) {
        // Check cache first
        const cacheKey = this.getCacheKey(brushNameOrGuid, params);
        if (this.materialCache.has(cacheKey)) {
            return this.materialCache.get(cacheKey);
        }

        // Load shader source
        const shaderDef = this.getBrushDefinition(brushNameOrGuid);
        const [vertexShader, fragmentShader] = await Promise.all([
            this.loadShaderSource(shaderDef.vertexPath),
            this.loadShaderSource(shaderDef.fragmentPath)
        ]);

        // Process shader includes
        const processedVertex = this.processIncludes(vertexShader);
        const processedFragment = this.processIncludes(fragmentShader);

        // Convert GLSL3 to GLSL ES 2.0
        const glsl2Vertex = this.convertToGLSL2(processedVertex);
        const glsl2Fragment = this.convertToGLSL2(processedFragment);

        // Create PlayCanvas shader
        const shader = this.createShader(glsl2Vertex, glsl2Fragment, shaderDef);

        // Create material with shader
        const material = this.createMaterial(shader, shaderDef, params);

        // Load textures
        await this.loadTextures(material, shaderDef);

        // Cache and return
        this.materialCache.set(cacheKey, material);
        return material;
    }

    createShader(vertexCode, fragmentCode, definition) {
        // Convert Three.js attribute names to PlayCanvas semantics
        const attributes = this.convertAttributes(definition.attributes);

        // Define shader with PlayCanvas API
        const shaderDefinition = {
            attributes: attributes,
            vshader: vertexCode,
            fshader: fragmentCode
        };

        return new pc.Shader(this.app.graphicsDevice, shaderDefinition);
    }

    convertAttributes(threeAttributes) {
        // Map Three.js naming to PlayCanvas semantics
        const mapping = {
            'a_position': pc.SEMANTIC_POSITION,
            'a_normal': pc.SEMANTIC_NORMAL,
            'a_color': pc.SEMANTIC_COLOR,
            'a_texcoord0': pc.SEMANTIC_TEXCOORD0,
            'a_texcoord1': pc.SEMANTIC_TEXCOORD1,
            'a_tangent': pc.SEMANTIC_TANGENT
        };

        return Object.entries(threeAttributes).map(([name, type]) => ({
            semantic: mapping[name] || name,
            type: type
        }));
    }

    convertToGLSL2(glsl3Code) {
        // Convert GLSL 3.0 syntax to GLSL ES 2.0
        let glsl2 = glsl3Code;

        // Remove version directive
        glsl2 = glsl2.replace(/#version 300 es/g, '');

        // in → attribute (vertex shader) or varying (fragment shader)
        // out → varying (vertex shader) or gl_FragColor (fragment shader)
        // texture() → texture2D()

        // This is a simplified conversion - full implementation would need
        // more sophisticated parsing
        glsl2 = glsl2.replace(/\btexture\s*\(/g, 'texture2D(');

        return glsl2;
    }

    createMaterial(shader, definition, params) {
        const material = new pc.Material();
        material.shader = shader;

        // Set up uniforms from definition
        this.setupUniforms(material, definition, params);

        // Set render state
        this.setupRenderState(material, definition);

        return material;
    }

    setupRenderState(material, definition) {
        // Map Three.js blend modes to PlayCanvas
        const blendModeMap = {
            0: pc.BLEND_NORMAL,          // THREE.NormalBlending
            1: pc.BLEND_ADDITIVE,        // THREE.AdditiveBlending
            2: pc.BLEND_ADDITIVE,        // Alternative additive
            5: pc.BLEND_ADDITIVE         // Another variant
        };

        if (definition.blending !== undefined) {
            material.blendType = blendModeMap[definition.blending] || pc.BLEND_NORMAL;
        }

        material.depthWrite = definition.depthWrite !== false;
        material.depthTest = definition.depthTest !== false;
        material.cull = definition.side === 2 ? pc.CULLFACE_NONE : pc.CULLFACE_BACK;

        if (definition.transparent) {
            material.blendType = pc.BLEND_NORMAL;
            material.opacity = 1.0;
        }
    }

    async loadTextures(material, definition) {
        const texturePromises = [];

        // Main texture
        if (definition.mainTexture) {
            texturePromises.push(
                this.loadTexture(definition.mainTexture).then(tex => {
                    material.setParameter('u_MainTex', tex);
                })
            );
        }

        // Bump map
        if (definition.bumpMap) {
            texturePromises.push(
                this.loadTexture(definition.bumpMap).then(tex => {
                    material.setParameter('u_BumpMap', tex);
                })
            );
        }

        // Alpha mask
        if (definition.alphaMask) {
            texturePromises.push(
                this.loadTexture(definition.alphaMask).then(tex => {
                    material.setParameter('u_AlphaMask', tex);
                })
            );
        }

        await Promise.all(texturePromises);
    }

    async loadTexture(path) {
        if (this.textureCache.has(path)) {
            return this.textureCache.get(path);
        }

        const fullPath = `${this.brushPath}/${path}`;

        return new Promise((resolve, reject) => {
            const asset = new pc.Asset(path, 'texture', { url: fullPath });

            asset.on('load', () => {
                const texture = asset.resource;
                this.textureCache.set(path, texture);
                resolve(texture);
            });

            asset.on('error', reject);

            this.app.assets.add(asset);
            this.app.assets.load(asset);
        });
    }
}
```

### 2.2 glTF Extension → PlayCanvas Asset Processor

**Current**: `GLTFGoogleTiltBrushMaterialExtension` (2,197 lines)

**PlayCanvas Strategy**: Custom glTF processor integrated with asset pipeline

```javascript
class PlayCanvasTiltBrushProcessor {
    constructor(app, brushPath) {
        this.app = app;
        this.shaderLoader = new PlayCanvasTiltShaderLoader(app, brushPath);
        this.brushNameMap = new Map(); // GUID → Name mappings
        this.meshToBrushMap = new Map(); // Track which mesh uses which brush
    }

    async processGLTF(gltfAsset, onComplete) {
        const gltfData = gltfAsset.resource;

        // Phase 1: Extract metadata (equivalent to beforeRoot)
        const brushMappings = this.extractBrushMetadata(gltfData);

        // Phase 2: Wait for all meshes to load
        await this.waitForMeshesLoaded(gltfData);

        // Phase 3: Replace materials (equivalent to afterRoot)
        await this.replaceMaterials(gltfData.entity, brushMappings);

        // Phase 4: Setup update loop for animated shaders
        this.setupUpdateLoop(gltfData.entity);

        onComplete(gltfData);
    }

    extractBrushMetadata(gltfData) {
        const mappings = new Map();

        // Parse glTF JSON extensions
        const json = gltfData._gltfJson; // Access to raw glTF JSON

        if (json.materials) {
            json.materials.forEach((material, index) => {
                const ext = material.extensions?.GOOGLE_tilt_brush_material;
                if (ext) {
                    const brushGuid = ext.guid;
                    const brushName = this.guidToBrushName(brushGuid);
                    mappings.set(index, {
                        guid: brushGuid,
                        name: brushName,
                        params: ext.params || {}
                    });
                }
            });
        }

        return mappings;
    }

    async replaceMaterials(rootEntity, brushMappings) {
        const renders = rootEntity.findComponents('render');

        for (const render of renders) {
            for (let i = 0; i < render.meshInstances.length; i++) {
                const meshInstance = render.meshInstances[i];
                const originalMaterial = meshInstance.material;

                // Find brush mapping for this material
                const brushInfo = this.findBrushForMaterial(originalMaterial, brushMappings);

                if (brushInfo) {
                    // Remap geometry attributes
                    this.remapAttributes(meshInstance.mesh);

                    // Convert vertex colors if needed
                    this.convertVertexColors(meshInstance.mesh, brushInfo);

                    // Load custom shader material
                    const customMaterial = await this.shaderLoader.loadAsync(
                        brushInfo.name,
                        brushInfo.params
                    );

                    // Replace material
                    meshInstance.material = customMaterial;

                    // Store reference for update loop
                    this.meshToBrushMap.set(meshInstance, brushInfo.name);
                }
            }
        }
    }

    remapAttributes(mesh) {
        // PlayCanvas already handles standard attributes, but we may need
        // to remap custom Tilt Brush attributes

        const vertexBuffer = mesh.vertexBuffer;
        const format = vertexBuffer.format;

        // Check for Tilt Brush naming conventions and remap
        const remapNeeded = [
            ['_tb_unity_texcoord_0', pc.SEMANTIC_TEXCOORD0],
            ['_tb_unity_texcoord_1', pc.SEMANTIC_TEXCOORD1],
            ['_tb_unity_normal', pc.SEMANTIC_NORMAL]
        ];

        // Note: PlayCanvas may require rebuilding the vertex buffer
        // with new semantic names if non-standard names are present
    }

    convertVertexColors(mesh, brushInfo) {
        // Convert linear to sRGB if needed (modern Open Brush files)
        const colorAttribute = mesh.vertexBuffer.format.elements.find(
            e => e.name === pc.SEMANTIC_COLOR
        );

        if (colorAttribute && brushInfo.needsSRGBConversion) {
            // Access vertex data and convert
            const vertexData = mesh.vertexBuffer.lock();
            // ... perform conversion ...
            mesh.vertexBuffer.unlock();
        }
    }

    setupUpdateLoop(rootEntity) {
        // Create a script component that updates all shader uniforms per-frame
        const UpdateScript = pc.createScript('tiltBrushUpdater');

        UpdateScript.prototype.initialize = function() {
            this.time = 0;
            this.renders = this.entity.findComponents('render');
        };

        UpdateScript.prototype.update = function(dt) {
            this.time += dt;

            // Update time uniforms for all materials
            const timeVec = new pc.Vec4(
                this.time,
                Math.sin(this.time),
                Math.cos(this.time),
                this.time * 0.5
            );

            this.renders.forEach(render => {
                render.meshInstances.forEach(mi => {
                    const material = mi.material;

                    // Update time
                    material.setParameter('u_time', timeVec.data);

                    // Update lights
                    this.updateLightUniforms(material);

                    // Update camera
                    this.updateCameraUniforms(material);

                    // Update fog
                    this.updateFogUniforms(material);
                });
            });
        };

        UpdateScript.prototype.updateLightUniforms = function(material) {
            const lights = this.app.scene.lights;

            // Find directional lights (Tilt Brush uses 2 directional lights)
            const directionalLights = lights.filter(l => l.type === pc.LIGHTTYPE_DIRECTIONAL);

            if (directionalLights.length > 0) {
                const light0 = directionalLights[0];
                const direction = light0.entity.forward.clone().mulScalar(-1);

                material.setParameter('u_SceneLight_0_color', [
                    light0.color.r * light0.intensity,
                    light0.color.g * light0.intensity,
                    light0.color.b * light0.intensity,
                    1.0
                ]);

                material.setParameter('u_SceneLight_0_direction', direction.data);
            }

            if (directionalLights.length > 1) {
                const light1 = directionalLights[1];
                const direction = light1.entity.forward.clone().mulScalar(-1);

                material.setParameter('u_SceneLight_1_color', [
                    light1.color.r * light1.intensity,
                    light1.color.g * light1.intensity,
                    light1.color.b * light1.intensity,
                    1.0
                ]);

                material.setParameter('u_SceneLight_1_direction', direction.data);
            }

            // Ambient light
            const ambient = this.app.scene.ambientLight;
            material.setParameter('u_ambient_light_color', [
                ambient.r,
                ambient.g,
                ambient.b
            ]);
        };

        UpdateScript.prototype.updateCameraUniforms = function(material) {
            const camera = this.app.scene.cameras[0]; // Main camera
            if (camera) {
                material.setParameter('cameraPosition', camera.entity.getPosition().data);
            }
        };

        UpdateScript.prototype.updateFogUniforms = function(material) {
            if (this.app.scene.fog) {
                material.setParameter('u_fogColor', this.app.scene.fog.color.data);
                material.setParameter('u_fogDensity', this.app.scene.fog.density);
            }
        };

        // Add script to root entity
        if (!rootEntity.script) {
            rootEntity.addComponent('script');
        }
        rootEntity.script.create(UpdateScript);
    }
}
```

---

## 3. Shader System Translation

### 3.1 GLSL Version Conversion

**Challenge**: three-icosa uses GLSL 3.0, PlayCanvas uses GLSL ES 2.0

**Key Differences**:

| GLSL 3.0 | GLSL ES 2.0 | Notes |
|----------|-------------|-------|
| `in` (vertex) | `attribute` | Input to vertex shader |
| `in` (fragment) | `varying` | Input to fragment shader |
| `out` (vertex) | `varying` | Output from vertex shader |
| `out` (fragment) | `gl_FragColor` | Output color |
| `texture()` | `texture2D()` / `textureCube()` | Texture sampling |
| `layout(location=0)` | Removed | Not supported |

**Conversion Tool**:

```javascript
class GLSLConverter {
    static convertToGLSL2(glsl3Source, shaderType) {
        let glsl2 = glsl3Source;

        // Remove version directive
        glsl2 = glsl2.replace(/#version 300 es\n?/g, '');

        if (shaderType === 'vertex') {
            // in → attribute
            glsl2 = glsl2.replace(/\bin\s+/g, 'attribute ');
            // out → varying
            glsl2 = glsl2.replace(/\bout\s+/g, 'varying ');
        } else if (shaderType === 'fragment') {
            // in → varying
            glsl2 = glsl2.replace(/\bin\s+/g, 'varying ');

            // Handle out vec4 fragColor → gl_FragColor
            // This requires more sophisticated parsing
            glsl2 = glsl2.replace(/out\s+vec4\s+(\w+);/g, '// using gl_FragColor');
            glsl2 = glsl2.replace(/\bfragColor\b/g, 'gl_FragColor');
        }

        // texture() → texture2D()
        glsl2 = glsl2.replace(/\btexture\s*\(/g, 'texture2D(');

        // Remove layout qualifiers
        glsl2 = glsl2.replace(/layout\s*\([^)]*\)\s*/g, '');

        return glsl2;
    }

    static extractVaryings(vertexShader) {
        // Extract varying declarations for consistency between vertex and fragment
        const varyingRegex = /varying\s+(highp|mediump|lowp)?\s*\w+\s+(\w+);/g;
        const varyings = [];
        let match;

        while ((match = varyingRegex.exec(vertexShader)) !== null) {
            varyings.push(match[0]);
        }

        return varyings;
    }
}
```

### 3.2 Shader Includes System

**Current**: `brushes/includes/SurfaceShaderIncludes.glsl`, `FogShaderIncludes.glsl`

**PlayCanvas Strategy**: Pre-process includes before shader compilation

```javascript
class ShaderIncludeProcessor {
    constructor(brushPath) {
        this.brushPath = brushPath;
        this.includeCache = new Map();
    }

    async processIncludes(shaderSource) {
        // Find #include directives (custom syntax)
        const includeRegex = /#include\s+"([^"]+)"/g;
        let processedSource = shaderSource;
        const includes = [];

        let match;
        while ((match = includeRegex.exec(shaderSource)) !== null) {
            includes.push(match[1]);
        }

        // Load all includes
        for (const includePath of includes) {
            const includeContent = await this.loadInclude(includePath);
            const includeDirective = `#include "${includePath}"`;
            processedSource = processedSource.replace(includeDirective, includeContent);
        }

        return processedSource;
    }

    async loadInclude(path) {
        if (this.includeCache.has(path)) {
            return this.includeCache.get(path);
        }

        const fullPath = `${this.brushPath}/includes/${path}`;
        const response = await fetch(fullPath);
        const content = await response.text();

        this.includeCache.set(path, content);
        return content;
    }
}
```

### 3.3 Surface Shader Emulation

**Key Functions from SurfaceShaderIncludes.glsl**:
- `PerturbNormal()` - Normal mapping
- `DisneyDiffuse()` - Diffuse BRDF
- `SpecularGGX()` - Specular BRDF
- `computeLighting()` - Main lighting calculation

**PlayCanvas Integration**: These functions can be kept mostly as-is after GLSL 2.0 conversion, but lighting uniform access needs updating:

```glsl
// Three.js style (from UniformsLib)
uniform vec3 directionalLights[MAX_DIR_LIGHTS].direction;
uniform vec3 directionalLights[MAX_DIR_LIGHTS].color;

// PlayCanvas style (manual uniforms)
uniform vec3 u_SceneLight_0_direction;
uniform vec4 u_SceneLight_0_color;
uniform vec3 u_SceneLight_1_direction;
uniform vec4 u_SceneLight_1_color;
uniform vec3 u_ambient_light_color;
```

---

## 4. Implementation Phases

### Phase 1: Foundation (Week 1-2)
**Goal**: Basic infrastructure without rendering

- [ ] Create `PlayCanvasTiltShaderLoader` class structure
- [ ] Implement brush definition database (port `tiltBrushMaterialParams`)
- [ ] Build shader loading system (fetch vertex/fragment files)
- [ ] Implement texture loading and caching
- [ ] Create GLSL 3.0 → 2.0 converter
- [ ] Build shader include processor

**Deliverable**: Loader that can fetch and cache shader sources

### Phase 2: Shader Translation (Week 3-4)
**Goal**: Working shader compilation

- [ ] Convert all 100+ shaders from GLSL 3.0 to 2.0
- [ ] Test each shader compiles successfully
- [ ] Port `SurfaceShaderIncludes.glsl` to GLSL 2.0
- [ ] Port `FogShaderIncludes.glsl` to GLSL 2.0
- [ ] Create shader validation suite
- [ ] Document any shaders with conversion issues

**Deliverable**: All shaders compile in PlayCanvas

### Phase 3: Material System (Week 5-6)
**Goal**: Create materials with proper render state

- [ ] Implement `createMaterial()` with uniform setup
- [ ] Map Three.js blend modes to PlayCanvas
- [ ] Handle transparency, depth, and culling states
- [ ] Implement texture binding (MainTex, BumpMap, etc.)
- [ ] Create material parameter system
- [ ] Test material variations (solid, transparent, additive)

**Deliverable**: Materials render with basic colors/textures

### Phase 4: glTF Integration (Week 7-8)
**Goal**: Load glTF files with custom extension

- [ ] Create `PlayCanvasTiltBrushProcessor` class
- [ ] Implement metadata extraction (`beforeRoot` equivalent)
- [ ] Build material replacement system (`afterRoot` equivalent)
- [ ] Handle attribute remapping (Tilt Brush → PlayCanvas)
- [ ] Implement color space conversion (linear → sRGB)
- [ ] Test with sample Tilt Brush glTF files

**Deliverable**: Load basic Tilt Brush files

### Phase 5: Dynamic Updates (Week 9)
**Goal**: Animated shaders and lighting

- [ ] Create `TiltBrushUpdater` script component
- [ ] Implement per-frame time uniform updates
- [ ] Connect PlayCanvas lights to shader uniforms
- [ ] Implement camera position updates
- [ ] Add fog parameter updates
- [ ] Test animated brushes (Fire, Electricity, etc.)

**Deliverable**: Animated shaders work correctly

### Phase 6: Optimization & Polish (Week 10-11)
**Goal**: Production-ready performance

- [ ] Profile material loading performance
- [ ] Optimize shader compilation (batch compilations)
- [ ] Implement progressive loading for large scenes
- [ ] Add error handling and fallback materials
- [ ] Create debugging tools (material inspector)
- [ ] Write comprehensive documentation

**Deliverable**: Optimized, documented library

### Phase 7: Testing & Examples (Week 12)
**Goal**: Validation and samples

- [ ] Create test suite with various Tilt Brush files
- [ ] Build example scenes showcasing each brush category
- [ ] Test edge cases (missing textures, invalid GUIDs, etc.)
- [ ] Performance benchmarking vs Three.js version
- [ ] Create migration guide for existing users
- [ ] Publish to npm/GitHub

**Deliverable**: Released v1.0.0

---

## 5. Key Technical Challenges

### Challenge 1: Uniform Injection System

**Three.js Approach**: `THREE.UniformsLib.lights` automatically provides:
```javascript
{
  directionalLights: { value: [], properties: { direction: {}, color: {} } },
  ambientLightColor: { value: [] },
  // ... many more
}
```

**PlayCanvas Solution**: Manual uniform management in update loop
```javascript
// Must manually query scene and set uniforms
material.setParameter('u_SceneLight_0_color', lightColor);
material.setParameter('u_SceneLight_0_direction', lightDir);
```

**Complexity**: ~100 shaders × ~10 light uniforms each = significant manual setup

**Mitigation**:
- Create uniform injection helper class
- Generate uniform setup code from shader definitions
- Use shader preprocessing to standardize uniform names

### Challenge 2: Attribute Semantic Mapping

**Issue**: Three.js allows arbitrary attribute names (`a_position`), PlayCanvas uses semantic constants

**Example**:
```javascript
// Three.js
geometry.setAttribute('a_position', new THREE.BufferAttribute(...));

// PlayCanvas
new pc.VertexBuffer(device, format, numVertices, pc.BUFFER_STATIC, data);
// Format must use pc.SEMANTIC_POSITION, not 'a_position'
```

**Solution**: Attribute remapping during mesh processing
```javascript
const semanticMap = {
    'a_position': pc.SEMANTIC_POSITION,
    'a_normal': pc.SEMANTIC_NORMAL,
    'a_color': pc.SEMANTIC_COLOR,
    // ... etc
};
```

### Challenge 3: Shader Compilation Performance

**Issue**: 100+ shaders × multiple variants = slow initial load

**Optimization Strategies**:
1. **Lazy Loading**: Only compile shaders when first used
2. **Shader Variants**: Use uber-shader with #defines to reduce combinations
3. **Precompilation**: Ship precompiled shaders (platform-specific)
4. **Web Workers**: Compile shaders in background thread (if supported)

### Challenge 4: Color Space Conversions

**Issue**: Different color spaces between Unity, Tilt Brush, Three.js, PlayCanvas

**Current System** (from three-icosa):
```javascript
// Detect if file needs sRGB conversion
const needsSrgbConversion = this.detectLegacyFile(gltf);

// Convert vertex colors
if (needsSrgbConversion) {
    color.r = Math.pow(color.r / 255, 2.2);
    // ... etc
}
```

**PlayCanvas Considerations**:
- Check PlayCanvas color space assumptions
- May need additional conversions for textures
- Test with files from different Tilt Brush versions

---

## 6. API Design

### 6.1 Simple Usage

```javascript
import { TiltBrushLoader } from 'playcanvas-icosa';

// Initialize
const app = new pc.Application(canvas);
const loader = new TiltBrushLoader(app, {
    brushPath: '/assets/brushes/'
});

// Load Tilt Brush glTF file
loader.load('my-painting.glb', (entity) => {
    app.root.addChild(entity);
});
```

### 6.2 Advanced Usage

```javascript
// Custom brush path
const loader = new TiltBrushLoader(app, {
    brushPath: 'https://cdn.example.com/tilt-brushes/',
    enableCaching: true,
    lazyLoadShaders: true,
    debugMode: false
});

// Load with progress callback
loader.load('complex-scene.glb', {
    onProgress: (loaded, total) => {
        console.log(`Loading: ${(loaded/total*100).toFixed(0)}%`);
    },
    onComplete: (entity) => {
        console.log('Loaded!', entity);
    },
    onError: (err) => {
        console.error('Failed:', err);
    }
});

// Preload specific brushes
await loader.preloadBrushes([
    'BlocksBasic',
    'Fire',
    'Electricity'
]);

// Access material programmatically
const material = loader.getMaterial('Fire', {
    emissionGain: 2.0,
    scrollSpeed: 1.5
});
```

### 6.3 Manual Material Creation

```javascript
// Create material without loading glTF
const fireMaterial = await loader.shaderLoader.loadAsync('Fire', {
    u_EmissionGain: 2.0,
    u_ScrollRate: 1.5,
    u_ScrollDistance: new pc.Vec3(0, 1, 0)
});

// Apply to existing mesh
meshInstance.material = fireMaterial;
```

---

## 7. Testing Strategy

### 7.1 Unit Tests

```javascript
describe('PlayCanvasTiltShaderLoader', () => {
    it('should load shader source files', async () => {
        const loader = new PlayCanvasTiltShaderLoader(app, '/brushes/');
        const material = await loader.loadAsync('BlocksBasic');
        expect(material).toBeDefined();
        expect(material.shader).toBeDefined();
    });

    it('should cache loaded materials', async () => {
        const loader = new PlayCanvasTiltShaderLoader(app, '/brushes/');
        const mat1 = await loader.loadAsync('Fire');
        const mat2 = await loader.loadAsync('Fire');
        expect(mat1).toBe(mat2); // Same instance
    });

    it('should handle GUID lookups', () => {
        const loader = new PlayCanvasTiltShaderLoader(app, '/brushes/');
        const name = loader.guidToBrushName('0e87b49c-6546-3a34-3a44-8a556d7d6c3e');
        expect(name).toBe('BlocksBasic');
    });
});

describe('GLSLConverter', () => {
    it('should convert GLSL 3.0 to 2.0', () => {
        const glsl3 = `#version 300 es
            in vec3 position;
            out vec3 vPosition;
            void main() {
                vPosition = position;
            }`;

        const glsl2 = GLSLConverter.convertToGLSL2(glsl3, 'vertex');
        expect(glsl2).toContain('attribute vec3 position');
        expect(glsl2).toContain('varying vec3 vPosition');
        expect(glsl2).not.toContain('#version 300 es');
    });
});
```

### 7.2 Integration Tests

```javascript
describe('Tilt Brush File Loading', () => {
    it('should load BlocksBasic brush scene', async () => {
        const loader = new TiltBrushLoader(app, { brushPath: '/brushes/' });
        const entity = await loader.loadAsync('/test-files/blocks-basic.glb');

        expect(entity).toBeDefined();
        expect(entity.render).toBeDefined();
        expect(entity.render.meshInstances.length).toBeGreaterThan(0);

        const material = entity.render.meshInstances[0].material;
        expect(material.shader).toBeDefined();
    });

    it('should handle animated brushes', async (done) => {
        const loader = new TiltBrushLoader(app, { brushPath: '/brushes/' });
        const entity = await loader.loadAsync('/test-files/fire-animation.glb');

        // Wait one frame for update script to run
        setTimeout(() => {
            const material = entity.render.meshInstances[0].material;
            const timeUniform = material.getParameter('u_time');
            expect(timeUniform).toBeDefined();
            expect(timeUniform[0]).toBeGreaterThan(0); // Time has advanced
            done();
        }, 100);
    });
});
```

### 7.3 Visual Regression Tests

Use PlayCanvas screenshot API to compare rendered output:

```javascript
describe('Visual Regression', () => {
    it('should match reference rendering for Fire brush', async () => {
        const loader = new TiltBrushLoader(app, { brushPath: '/brushes/' });
        const entity = await loader.loadAsync('/test-files/fire.glb');

        // Render frame
        app.renderNextFrame();

        // Capture screenshot
        const screenshot = app.graphicsDevice.canvas.toDataURL();

        // Compare with reference (using image diff library)
        const diff = await compareImages(screenshot, '/references/fire.png');
        expect(diff).toBeLessThan(0.01); // Less than 1% difference
    });
});
```

---

## 8. Migration Path for Existing Users

### For Three.js Users Switching to PlayCanvas

```javascript
// Before (three-icosa)
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFGoogleTiltBrushMaterialExtension, TiltShaderLoader } from 'three-icosa';

const loader = new GLTFLoader();
const tiltShaderLoader = new TiltShaderLoader();
loader.register(parser => new GLTFGoogleTiltBrushMaterialExtension(parser, tiltShaderLoader));

loader.load('painting.glb', (gltf) => {
    scene.add(gltf.scene);
});

// After (playcanvas-icosa)
import { TiltBrushLoader } from 'playcanvas-icosa';

const loader = new TiltBrushLoader(app, { brushPath: '/brushes/' });
loader.load('painting.glb', (entity) => {
    app.root.addChild(entity);
});
```

**Key Differences**:
- No need to manually register extensions
- Brush path configuration at loader level
- Returns PlayCanvas entity instead of Three.js Object3D
- Automatic setup of update scripts

---

## 9. Performance Considerations

### 9.1 Expected Performance Characteristics

| Metric | Three.js Version | PlayCanvas Target | Notes |
|--------|------------------|-------------------|-------|
| Initial load time | ~2-5s (100 brushes) | ~2-5s | Similar (network bound) |
| Shader compilation | ~1-3s | ~1-3s | GPU bound, similar |
| Runtime FPS | 60 FPS | 60 FPS | Should match |
| Memory usage | Baseline | +10-20% | PlayCanvas overhead |

### 9.2 Optimization Checklist

- [ ] Implement shader variant system to reduce unique shaders
- [ ] Use texture atlases where possible
- [ ] Batch meshes with same material
- [ ] Implement LOD system for complex brushes
- [ ] Profile uniform updates (may be bottleneck)
- [ ] Consider instancing for repeated brush strokes
- [ ] Lazy-load shaders not visible in current view

### 9.3 Profiling Points

```javascript
class PerformanceMonitor {
    static logShaderCompilation(brushName, duration) {
        console.log(`[Perf] ${brushName} compiled in ${duration}ms`);
    }

    static logMaterialCreation(brushName, duration) {
        console.log(`[Perf] ${brushName} material created in ${duration}ms`);
    }

    static logFrameUpdate(meshCount, duration) {
        if (duration > 16.67) { // Slower than 60 FPS
            console.warn(`[Perf] Frame update took ${duration}ms for ${meshCount} meshes`);
        }
    }
}
```

---

## 10. Open Questions & Decisions Needed

1. **Distribution Format**:
   - Separate package (`playcanvas-icosa`) or fork (`three-icosa-playcanvas`)?
   - Include precompiled shaders or compile at runtime?

2. **Shader Variant Strategy**:
   - Keep 100+ individual shaders or create uber-shader with #defines?
   - What's the compilation time trade-off?

3. **Lighting Model**:
   - Strictly match Three.js lighting or adapt to PlayCanvas standard?
   - How to handle scenes with different lighting setups?

4. **Backwards Compatibility**:
   - Support old Tilt Brush files vs. only modern Open Brush?
   - How much legacy code to port?

5. **Asset Pipeline Integration**:
   - Custom PlayCanvas Editor extension?
   - Runtime-only or design-time support?

6. **Mobile Support**:
   - Three-icosa targets desktop - what's the mobile strategy?
   - Shader simplification needed?

---

## 11. Resources & References

### PlayCanvas Documentation
- [Custom Shaders](https://developer.playcanvas.com/en/user-manual/graphics/advanced-rendering/custom-shaders/)
- [Material System](https://developer.playcanvas.com/en/user-manual/graphics/physical-rendering/physical-materials/)
- [Asset Loading](https://developer.playcanvas.com/en/user-manual/assets/loading/)
- [glTF Import](https://developer.playcanvas.com/en/user-manual/assets/import-pipeline/gltf/)

### Three.js References
- [three-icosa repository](https://github.com/icosa-foundation/three-icosa)
- [THREE.RawShaderMaterial](https://threejs.org/docs/#api/en/materials/RawShaderMaterial)
- [THREE.GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)

### Tilt Brush / Open Brush
- [Open Brush GitHub](https://github.com/icosa-foundation/open-brush)
- [Tilt Brush Toolkit](https://github.com/googlevr/tilt-brush-toolkit)
- [glTF Extension Spec](https://github.com/icosa-foundation/three-icosa/blob/main/docs/GOOGLE_tilt_brush_material.md)

---

## Conclusion

Porting three-icosa to PlayCanvas is a substantial but achievable project. The core architecture (shader loading, material management, glTF processing) can be preserved, but the implementation details must be adapted to PlayCanvas APIs.

**Estimated Effort**: 10-12 weeks for full-featured v1.0

**Biggest Challenges**:
1. GLSL 3.0 → 2.0 shader conversion (100+ shaders)
2. Manual uniform injection system (no UniformsLib equivalent)
3. Attribute semantic mapping differences
4. Per-frame update performance optimization

**Biggest Advantages**:
1. Well-architected source code to work from
2. Clear separation of concerns (loader, materials, extensions)
3. Comprehensive brush definitions already documented
4. Strong test cases available in Three.js version

**Recommended Next Steps**:
1. Create proof-of-concept with 3-5 simple brushes (BlocksBasic, Flat, etc.)
2. Validate GLSL conversion process
3. Benchmark performance vs Three.js version
4. Decide on distribution strategy
5. Begin Phase 1 implementation
