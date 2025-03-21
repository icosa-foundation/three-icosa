// Adapted from original GLTF 1.0 Loader in three.js r86
// https://github.com/mrdoob/three.js/blob/r86/examples/js/loaders/GLTFLoader.js

import {
    Vector2,
    Vector3,
    Vector4,
    Matrix3,
    Matrix4,
    Loader,
    LoaderUtils,
    FileLoader,
    Color,
    DirectionalLight,
    SpotLight,
    PointLight,
    AmbientLight,
    InterpolateLinear,
    InterpolateDiscrete,
    Texture,
    Skeleton,
    SkinnedMesh,
    Object3D,
    Bone,
    QuaternionKeyframeTrack,
    VectorKeyframeTrack,
    OrthographicCamera,
    PerspectiveCamera,
    BufferGeometry,
    Group,

    AnimationClip,
    AnimationUtils,

    NearestFilter,
    LinearFilter,
    NearestMipmapNearestFilter,
    LinearMipmapNearestFilter,
    NearestMipmapLinearFilter,
    LinearMipmapLinearFilter,
    ClampToEdgeWrapping,
    MirroredRepeatWrapping,
    RepeatWrapping,

    AlphaFormat,
    RGBFormat,
    RGBAFormat,
    LuminanceFormat,
    LuminanceAlphaFormat,

    UnsignedByteType,
    UnsignedShort4444Type,
    UnsignedShort5551Type,
    Mesh,
    LineLoop,
    Line,
    LineSegments,
    BackSide, // Culling front
    FrontSide, // Culling back

    NeverDepth,
    LessDepth,
    EqualDepth,
    LessEqualDepth,
    GreaterEqualDepth,
    NotEqualDepth,
    AlwaysDepth,

    AddEquation,
    SubtractEquation,
    ReverseSubtractEquation,

    ZeroFactor,
    OneFactor,
    SrcColorFactor,
    OneMinusSrcColorFactor,
    SrcAlphaFactor,
    OneMinusSrcAlphaFactor,
    DstAlphaFactor,
    OneMinusDstAlphaFactor,
    DstColorFactor,
    OneMinusDstColorFactor,
    SrcAlphaSaturateFactor,

    MeshPhongMaterial,
    UniformsUtils,
    RawShaderMaterial,

    InterleavedBuffer,
    InterleavedBufferAttribute,
    BufferAttribute,

    TextureLoader,
    MeshLambertMaterial,
    MeshBasicMaterial,
    DoubleSide,

    CustomBlending,
    NoBlending,
    Scene
} from 'three';


const FS_GLSL = "precision highp float; const float INV_PI = 0.31830988618; const float PI = 3.141592654; const float _RefractiveIndex = 1.2; const float environmentStrength = 1.5; varying vec3 v_normal; varying vec3 v_position; varying vec3 v_binormal; varying vec3 v_tangent; uniform vec3 u_color; uniform float u_metallic; uniform float u_roughness; uniform vec3 u_light0Pos; uniform vec3 u_light0Color; uniform vec3 u_light1Pos; uniform vec3 u_light1Color; uniform mat4 u_modelMatrix; uniform sampler2D u_reflectionCube; uniform sampler2D u_reflectionCubeBlur; const float u_noiseIntensity = 0.015; const float colorNoiseAmount = 0.015; const float noiseScale = 700.0; uniform vec3 cameraPosition; // Noise functions from https://github.com/ashima/webgl-noise // Used under the MIT license - license text in MITLICENSE // Copyright (C) 2011 by Ashima Arts (Simplex noise) // Copyright (C) 2011-2016 by Stefan Gustavson (Classic noise and others) vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; } vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; } vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); } vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; } float snoise(vec3 v, out vec3 gradient) { const vec2 C = vec2(1.0/6.0, 1.0/3.0) ; const vec4 D = vec4(0.0, 0.5, 1.0, 2.0); // First corner vec3 i = floor(v + dot(v, C.yyy) ); vec3 x0 = v - i + dot(i, C.xxx) ; // Other corners vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min( g.xyz, l.zxy ); vec3 i2 = max( g.xyz, l.zxy ); // x0 = x0 - 0.0 + 0.0 * C.xxx; // x1 = x0 - i1 + 1.0 * C.xxx; // x2 = x0 - i2 + 2.0 * C.xxx; // x3 = x0 - 1.0 + 3.0 * C.xxx; vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y vec3 x3 = x0 - D.yyy; // -1.0+3.0*C.x = -0.5 = -D.y // Permutations i = mod289(i); vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 )); // Gradients: 7x7 points over a square, mapped onto an octahedron. // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294) float n_ = 0.142857142857; // 1.0/7.0 vec3 ns = n_ * D.wyz - D.xzx; vec4 j = p - 49.0 * floor(p * ns.z * ns.z); // mod(p,7*7) vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_ ); // mod(j,N) vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y); vec4 b0 = vec4( x.xy, y.xy ); vec4 b1 = vec4( x.zw, y.zw ); //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0; //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0; vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0)); vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ; vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w); //Normalise gradients vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3))); p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w; // Mix final noise value vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); vec4 m2 = m * m; vec4 m4 = m2 * m2; vec4 pdotx = vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)); // Determine noise gradient vec4 temp = m2 * m * pdotx; gradient = -8.0 * (temp.x * x0 + temp.y * x1 + temp.z * x2 + temp.w * x3); gradient += m4.x * p0 + m4.y * p1 + m4.z * p2 + m4.w * p3; gradient *= 42.0; return 42.0 * dot(m4, pdotx); } // End of noise code float GGX(float nDotH, float roughness2) { float nDotH2 = nDotH * nDotH; float alpha = nDotH2 * roughness2 + 1.0 - nDotH2; float denominator = PI * alpha * alpha; return (nDotH2 > 0.0 ? 1.0 : 0.0) * roughness2 / denominator; } float BlinnPhongNDF(float nDotH) { float exponent = (2.0 / (u_roughness * u_roughness) - 2.0); float coeff = 1.0 / (PI * u_roughness * u_roughness); return coeff * pow(nDotH, exponent); } float CT_GeoAtten(float nDotV, float nDotH, float vDotH, float nDotL, float lDotH) { float a = (2.0 * nDotH * nDotV) / vDotH; float b = (2.0 * nDotH * nDotL) / lDotH; return min(1.0, min(a, b)); } float GeoAtten(float nDotV) { float c = nDotV / (u_roughness * sqrt(1.0 - nDotV * nDotV)); return c >= 1.6 ? 1.0 : (3.535 * c + 2.181 * c * c) / (1.0 + 2.276 * c + 2.577 * c * c); } vec3 evaluateFresnelSchlick(float vDotH, vec3 f0) { return f0 + (1.0 - f0) * pow(1.0 - vDotH, 5.0); } float saturate(float value) { return clamp(value, 0.0, 1.0); } vec3 saturate(vec3 value) { return clamp(value, 0.0, 1.0); } mat3 transpose(mat3 inMat) { return mat3(inMat[0][0], inMat[0][1], inMat[0][2], inMat[1][0], inMat[1][1], inMat[1][2], inMat[2][0], inMat[2][1], inMat[2][2]); } void generatePapercraftColorNormal(vec3 normal, vec3 tangent, vec3 binormal, vec3 noisePos, inout vec4 outColorMult, inout vec3 outNormal) { mat3 tangentToObject; tangentToObject[0] = vec3(tangent.x, tangent.y, tangent.z); tangentToObject[1] = vec3(binormal.x, binormal.y, binormal.z); tangentToObject[2] = vec3(normal.x, normal.y, normal.z); mat3 objectToTangent = transpose(tangentToObject); vec3 intensificator = vec3(u_noiseIntensity, u_noiseIntensity, 1.0); vec3 tangentPos = objectToTangent * noisePos; vec3 gradient = vec3(0.0); float noiseOut = snoise(tangentPos * noiseScale, gradient); vec3 tangentSpaceNormal = normalize(intensificator * vec3(gradient.xy, 1.0)); outNormal = tangentToObject * tangentSpaceNormal; outColorMult = vec4(vec3(1.0 + noiseOut * colorNoiseAmount), 1.0); } void evaluatePBRLight( vec3 materialColor, vec3 lightColor, float nDotL, float nDotV, float nDotH, float vDotH, float lDotH, inout vec3 diffuseOut, inout vec3 specularOut, inout vec3 debug, float specAmount) { vec3 diffuse = INV_PI * nDotL * lightColor; vec3 d = vec3(GGX(nDotH, u_roughness * u_roughness)); vec3 g = vec3(CT_GeoAtten(nDotV, nDotH, vDotH, nDotL, lDotH)); vec3 f0 = vec3(abs((1.0 - _RefractiveIndex) / (1.0 + _RefractiveIndex))); f0 = f0 * f0; f0 = mix(f0, materialColor, u_metallic); vec3 f = evaluateFresnelSchlick(vDotH, f0); diffuseOut = diffuseOut + (1.0 - saturate(f)) * (1.0 - u_metallic) * lightColor * diffuse; specularOut = specularOut + specAmount * lightColor * saturate((d * g * f) / saturate(4.0 * saturate(nDotH) * nDotV)); debug = saturate(g); } void setParams(vec3 worldPosition, inout vec3 normal, inout vec3 view, inout float nDotV) { normal = normalize(normal); view = normalize(cameraPosition - worldPosition); nDotV = saturate(dot(normal, view)); } void setLightParams(vec3 lightPosition, vec3 worldPosition, vec3 V, vec3 N, inout vec3 L, inout vec3 H, inout float nDotL, inout float nDotH, inout float vDotH, inout float lDotH) { L = normalize(lightPosition - worldPosition); H = normalize(L + V); nDotL = saturate(dot(N, L)); nDotH = saturate(dot(N, H)); vDotH = saturate(dot(V, H)); lDotH = saturate(dot(L, H)); } void main() { vec3 materialColor = u_color; vec4 outColorMult; vec3 normalisedNormal = v_normal; vec3 normalisedView; float nDotV; generatePapercraftColorNormal(v_normal, v_tangent, v_binormal, v_position, outColorMult, normalisedNormal); setParams(v_position, normalisedNormal, normalisedView, nDotV); vec3 normalisedLight; vec3 normalisedHalf; float nDotL; float nDotH; float vDotH; float lDotH; setLightParams(u_light0Pos, v_position, normalisedView, normalisedNormal, normalisedLight, normalisedHalf, nDotL, nDotH, vDotH, lDotH); vec3 diffuse = vec3(0.0, 0.0, 0.0); vec3 specular = vec3(0.0, 0.0, 0.0); vec3 debug = vec3(0.0, 0.0, 0.0); evaluatePBRLight(materialColor * outColorMult.rgb, u_light0Color, nDotL, nDotV, nDotH, vDotH, lDotH, diffuse, specular, debug, 1.0); vec3 ambient = (1.0 - u_metallic) * materialColor * outColorMult.rgb * 0.0; setLightParams(u_light1Pos, v_position, normalisedView, normalisedNormal, normalisedLight, normalisedHalf, nDotL, nDotH, vDotH, lDotH); evaluatePBRLight(materialColor * outColorMult.rgb, u_light1Color, nDotL, nDotV, nDotH, vDotH, lDotH, diffuse, specular, debug, 1.0); vec3 R = -reflect(normalisedView, normalisedNormal); setLightParams(v_position + R, v_position, normalisedView, normalisedNormal, normalisedLight, normalisedHalf, nDotL, nDotH, vDotH, lDotH); vec3 envColor = mix(materialColor, vec3(1.0, 1.0, 1.0), 0.7); evaluatePBRLight(materialColor * outColorMult.rgb, envColor * environmentStrength, nDotL, nDotV, nDotH, vDotH, lDotH, diffuse, specular, debug, 0.25); gl_FragColor = vec4(specular + diffuse * materialColor, 1.0); }";
const VS_GLSL = "uniform mat4 u_modelViewMatrix; uniform mat4 u_projectionMatrix; uniform mat3 u_normalMatrix; attribute vec3 a_position; attribute vec3 a_normal; varying vec3 v_normal; varying vec3 v_position; varying vec3 v_binormal; varying vec3 v_tangent; void main() { vec3 objPosition = a_position; vec4 worldPosition = vec4(objPosition, 1.0); // Our object space has no rotation and no scale, so this is fine. v_normal = a_normal; v_position = worldPosition.xyz; // Looking for an arbitrary vector that isn't parallel to the normal. Avoiding axis directions should improve our chances. vec3 arbitraryVector = normalize(vec3(0.42, -0.21, 0.15)); vec3 alternateArbitraryVector = normalize(vec3(0.43, 1.5, 0.15)); // If arbitrary vector is parallel to the normal, choose a different one. v_tangent = normalize(abs(dot(v_normal, arbitraryVector)) < 1.0 ? cross(v_normal, arbitraryVector) : cross(v_normal, alternateArbitraryVector)); v_binormal = normalize(cross(v_normal, v_tangent)); gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(objPosition, 1.0); }";
const GEMFS_GLSL = "precision highp float; const float INV_PI = 0.31830988618; const float PI = 3.141592654; const float _RefractiveIndex = 1.2; const float _Metallic = 0.5; const float environmentStrength = 1.5; varying vec3 v_normal; varying vec3 v_position; varying float v_fresnel; uniform sampler2D u_gem; uniform vec4 u_color; uniform float u_metallic; uniform float u_roughness; uniform vec3 u_light0Pos; uniform vec3 u_light0Color; uniform vec3 u_light1Pos; uniform vec3 u_light1Color; uniform vec3 cameraPosition; float GGX(float nDotH, float roughness2) { float nDotH2 = nDotH * nDotH; float alpha = nDotH2 * roughness2 + 1.0 - nDotH2; float denominator = PI * alpha * alpha; return (nDotH2 > 0.0 ? 1.0 : 0.0) * roughness2 / denominator; } float BlinnPhongNDF(float nDotH) { float exponent = (2.0 / (u_roughness * u_roughness) - 2.0); float coeff = 1.0 / (PI * u_roughness * u_roughness); return coeff * pow(nDotH, exponent); } float CT_GeoAtten(float nDotV, float nDotH, float vDotH, float nDotL, float lDotH) { float a = (2.0 * nDotH * nDotV) / vDotH; float b = (2.0 * nDotH * nDotL) / lDotH; return min(1.0, min(a, b)); } float GeoAtten(float nDotV) { float c = nDotV / (u_roughness * sqrt(1.0 - nDotV * nDotV)); return c >= 1.6 ? 1.0 : (3.535 * c + 2.181 * c * c) / (1.0 + 2.276 * c + 2.577 * c * c); } vec3 evaluateFresnelSchlick(float vDotH, vec3 f0) { return f0 + (1.0 - f0) * pow(1.0 - vDotH, 5.0); } float saturate(float value) { return clamp(value, 0.0, 1.0); } vec3 saturate(vec3 value) { return clamp(value, 0.0, 1.0); } mat3 transpose(mat3 inMat) { return mat3(inMat[0][0], inMat[0][1], inMat[0][2], inMat[1][0], inMat[1][1], inMat[1][2], inMat[2][0], inMat[2][1], inMat[2][2]); } void evaluatePBRLight( vec3 materialColor, vec3 lightColor, float nDotL, float nDotV, float nDotH, float vDotH, float lDotH, inout vec3 diffuseOut, inout vec3 specularOut, inout vec3 debug, float specAmount) { vec3 diffuse = INV_PI * nDotL * lightColor; vec3 d = vec3(GGX(nDotH, u_roughness * u_roughness)); vec3 g = vec3(CT_GeoAtten(nDotV, nDotH, vDotH, nDotL, lDotH)); vec3 f0 = vec3(abs((1.0 - _RefractiveIndex) / (1.0 + _RefractiveIndex))); f0 = f0 * f0; f0 = mix(f0, materialColor, u_metallic); vec3 f = evaluateFresnelSchlick(vDotH, f0); diffuseOut = diffuseOut + (1.0 - saturate(f)) * (1.0 - u_metallic) * lightColor * diffuse; specularOut = specularOut + specAmount * lightColor * saturate((d * g * f) / saturate(4.0 * saturate(nDotH) * nDotV)); debug = saturate(g); } void setParams(vec3 worldPosition, inout vec3 normal, inout vec3 view, inout float nDotV) { normal = normalize(normal); view = normalize(cameraPosition - worldPosition); nDotV = saturate(dot(normal, view)); } void setLightParams(vec3 lightPosition, vec3 worldPosition, vec3 V, vec3 N, inout vec3 L, inout vec3 H, inout float nDotL, inout float nDotH, inout float vDotH, inout float lDotH) { L = normalize(lightPosition - worldPosition); H = normalize(L + V); nDotL = saturate(dot(N, L)); nDotH = saturate(dot(N, H)); vDotH = saturate(dot(V, H)); lDotH = saturate(dot(L, H)); } void main() { vec3 materialColor = u_color.rgb; vec3 normalisedNormal = v_normal; vec3 normalisedView = cameraPosition - v_position; float nDotV; setParams(v_position, normalisedNormal, normalisedView, nDotV); vec3 normalisedLight; vec3 normalisedHalf; float nDotL; float nDotH; float vDotH; float lDotH; setLightParams(u_light0Pos, v_position, normalisedView, normalisedNormal, normalisedLight, normalisedHalf, nDotL, nDotH, vDotH, lDotH); vec3 diffuse = vec3(0.0, 0.0, 0.0); vec3 specular = vec3(0.0, 0.0, 0.0); vec3 debug = vec3(0.0, 0.0, 0.0); evaluatePBRLight(materialColor, u_light0Color, nDotL, nDotV, nDotH, vDotH, lDotH, diffuse, specular, debug, 1.0); vec3 ambient = materialColor * 0.3; setLightParams(u_light1Pos, v_position, normalisedView, normalisedNormal, normalisedLight, normalisedHalf, nDotL, nDotH, vDotH, lDotH); evaluatePBRLight(materialColor, u_light1Color, nDotL, nDotV, nDotH, vDotH, lDotH, diffuse, specular, debug, 1.0); vec3 R = reflect(normalisedView, normalisedNormal); vec4 color = vec4(texture2D( u_gem, vec2(0.5*(INV_PI*atan(R.x, R.z)+1.0),0.5*(R.y+1.0)) ).rgb, u_color.a); setLightParams(v_position + R, v_position, normalisedView, normalisedNormal, normalisedLight, normalisedHalf, nDotL, nDotH, vDotH, lDotH); vec3 envColor = mix(materialColor, vec3(1.0, 1.0, 1.0), 0.5); evaluatePBRLight(materialColor, envColor * environmentStrength, nDotL, nDotV, nDotH, vDotH, lDotH, diffuse, specular, debug, 0.25); gl_FragColor = vec4(ambient + specular + diffuse * color.rgb, 1.0); } "
const GEMVS_GLSL = "uniform mat4 u_modelViewMatrix; uniform mat4 u_projectionMatrix; uniform mat3 u_normalMatrix; attribute vec3 a_position; attribute vec3 a_normal; varying vec3 v_normal; varying vec3 v_position; void main() { vec4 worldPosition = vec4(a_position, 1.0); v_normal = a_normal; v_position = worldPosition.xyz; gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(a_position, 1.0); } "
const GLASSFS_GLSL = "precision highp float; const float INV_PI = 0.31830988618; const float PI = 3.141592654; const float _RefractiveIndex = 1.2; // Always default to Olive Oil. const float _Metallic = 0.5; const float environmentStrength = 1.0; varying vec3 v_normal; varying vec3 v_position; uniform vec4 u_color; uniform float u_metallic; uniform float u_roughness; uniform vec3 u_light0Pos; uniform vec3 u_light0Color; uniform vec3 u_light1Pos; uniform vec3 u_light1Color; uniform vec3 cameraPosition; // camera position world float GGX(float nDotH, float roughness2) { float nDotH2 = nDotH * nDotH; float alpha = nDotH2 * roughness2 + 1.0 - nDotH2; float denominator = PI * alpha * alpha; return (nDotH2 > 0.0 ? 1.0 : 0.0) * roughness2 / denominator; } float BlinnPhongNDF(float nDotH) { float exponent = (2.0 / (u_roughness * u_roughness) - 2.0); float coeff = 1.0 / (PI * u_roughness * u_roughness); return coeff * pow(nDotH, exponent); } float CT_GeoAtten(float nDotV, float nDotH, float vDotH, float nDotL, float lDotH) { float a = (2.0 * nDotH * nDotV) / vDotH; float b = (2.0 * nDotH * nDotL) / lDotH; return min(1.0, min(a, b)); } float GeoAtten(float nDotV) { float c = nDotV / (u_roughness * sqrt(1.0 - nDotV * nDotV)); return c >= 1.6 ? 1.0 : (3.535 * c + 2.181 * c * c) / (1.0 + 2.276 * c + 2.577 * c * c); } vec3 evaluateFresnelSchlick(float vDotH, vec3 f0) { return f0 + (1.0 - f0) * pow(1.0 - vDotH, 5.0); } float saturate(float value) { return clamp(value, 0.0, 1.0); } vec3 saturate(vec3 value) { return clamp(value, 0.0, 1.0); } mat3 transpose(mat3 inMat) { return mat3(inMat[0][0], inMat[0][1], inMat[0][2], inMat[1][0], inMat[1][1], inMat[1][2], inMat[2][0], inMat[2][1], inMat[2][2]); } void evaluatePBRLight( vec3 materialColor, vec3 lightColor, float nDotL, float nDotV, float nDotH, float vDotH, float lDotH, inout vec3 diffuseOut, inout vec3 specularOut, inout vec3 debug, float specAmount) { vec3 diffuse = INV_PI * nDotL * lightColor; vec3 d = vec3(GGX(nDotH, u_roughness * u_roughness)); vec3 g = vec3(CT_GeoAtten(nDotV, nDotH, vDotH, nDotL, lDotH)); vec3 f0 = vec3(abs((1.0 - _RefractiveIndex) / (1.0 + _RefractiveIndex))); f0 = f0 * f0; f0 = mix(f0, materialColor, u_metallic); vec3 f = evaluateFresnelSchlick(vDotH, f0); diffuseOut = diffuseOut + (1.0 - saturate(f)) * (1.0 - u_metallic) * lightColor * diffuse; specularOut = specularOut + specAmount * lightColor * saturate((d * g * f) / saturate(4.0 * saturate(nDotH) * nDotV)); debug = saturate(g); } void setParams(vec3 worldPosition, inout vec3 normal, inout vec3 view, inout float nDotV) { normal = normalize(normal); view = normalize(cameraPosition - worldPosition); nDotV = saturate(dot(normal, view)); } void setLightParams(vec3 lightPosition, vec3 worldPosition, vec3 V, vec3 N, inout vec3 L, inout vec3 H, inout float nDotL, inout float nDotH, inout float vDotH, inout float lDotH) { L = normalize(lightPosition - worldPosition); H = normalize(L + V); nDotL = saturate(dot(N, L)); nDotH = saturate(dot(N, H)); vDotH = saturate(dot(V, H)); lDotH = saturate(dot(L, H)); } void main() { vec3 materialColor = u_color.rgb; vec4 outColorMult; vec3 normalisedNormal = v_normal; vec3 normalisedView; float nDotV; setParams(v_position, normalisedNormal, normalisedView, nDotV); vec3 normalisedLight; vec3 normalisedHalf; float nDotL; float nDotH; float vDotH; float lDotH; setLightParams(u_light0Pos, v_position, normalisedView, normalisedNormal, normalisedLight, normalisedHalf, nDotL, nDotH, vDotH, lDotH); vec3 diffuse = vec3(0.0, 0.0, 0.0); vec3 specular = vec3(0.0, 0.0, 0.0); vec3 debug = vec3(0.0, 0.0, 0.0); evaluatePBRLight(materialColor, u_light0Color, nDotL, nDotV, nDotH, vDotH, lDotH, diffuse, specular, debug, 1.0); vec3 ambient = materialColor * 0.3; setLightParams(u_light1Pos, v_position, normalisedView, normalisedNormal, normalisedLight, normalisedHalf, nDotL, nDotH, vDotH, lDotH); evaluatePBRLight(materialColor, u_light1Color, nDotL, nDotV, nDotH, vDotH, lDotH, diffuse, specular, debug, 1.0); vec3 R = -reflect(normalisedView, normalisedNormal); setLightParams(v_position + R, v_position, normalisedView, normalisedNormal, normalisedLight, normalisedHalf, nDotL, nDotH, vDotH, lDotH); vec3 envColor = mix(materialColor, vec3(1.0, 1.0, 1.0), 0.5); evaluatePBRLight(materialColor, envColor * environmentStrength, nDotL, nDotV, nDotH, vDotH, lDotH, diffuse, specular, debug, 0.2); gl_FragColor = vec4(ambient + specular + diffuse * materialColor, u_color.a); } "
const GLASSVS_GLSL = "uniform mat4 u_modelViewMatrix; uniform mat4 u_projectionMatrix; uniform mat3 u_normalMatrix; attribute vec3 a_position; attribute vec3 a_normal; varying vec3 v_normal; varying vec3 v_position; void main() { vec4 worldPosition = vec4(a_position, 1.0); // Our object space has no rotation and no scale, so this is fine. v_normal = a_normal; v_position = worldPosition.xyz; gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(a_position, 1.0); } "

export class LegacyGLTFLoader extends Loader {


    load ( url, onLoad, onProgress, onError ) {

        var scope = this;

        var resourcePath;

        if ( this.resourcePath !== '' ) {

            resourcePath = this.resourcePath;

        } else if ( this.path !== '' ) {

            resourcePath = this.path;

        } else {

            resourcePath = LoaderUtils.extractUrlBase( url );

        }
        var loader = new FileLoader( scope.manager );

        loader.setPath( this.path );
        loader.setResponseType( 'arraybuffer' );

        loader.load( url, function ( data ) {

            scope.parse( data, resourcePath, onLoad );

        }, onProgress, onError );

    }

    parse ( data, path, callback ) {

        var content;
        var extensions = {};

        var magic = LoaderUtils.decodeText( new Uint8Array( data, 0, 4 ) );

        if ( magic === BINARY_EXTENSION_HEADER_DEFAULTS.magic ) {

            extensions[ EXTENSIONS.KHR_BINARY_GLTF ] = new GLTFBinaryExtension( data );
            content = extensions[ EXTENSIONS.KHR_BINARY_GLTF ].content;

        } else {

            content = LoaderUtils.decodeText( new Uint8Array( data ) );

        }

        var json = JSON.parse( content );

        if ( json.extensionsUsed && json.extensionsUsed.indexOf( EXTENSIONS.KHR_MATERIALS_COMMON ) >= 0 ) {

            extensions[ EXTENSIONS.KHR_MATERIALS_COMMON ] = new GLTFMaterialsCommonExtension( json );

        }

        var parser = new GLTFParser( json, extensions, {

            crossOrigin: this.crossOrigin,
            manager: this.manager,
            path: path || this.resourcePath || ''

        } );

        parser.parse( function ( scene, scenes, cameras, animations ) {

            var glTF = {
                "scene": scene,
                "scenes": scenes,
                "cameras": cameras,
                "animations": animations
            };

            callback( glTF );

        } );
    }
}

function GLTFRegistry() {

    var objects = {};

    return	{

        get: function ( key ) {

            return objects[ key ];

        },

        add: function ( key, object ) {

            objects[ key ] = object;

        },

        remove: function ( key ) {

            delete objects[ key ];

        },

        removeAll: function () {

            objects = {};

        },

        update: function ( scene, camera ) {

            for ( var name in objects ) {

                var object = objects[ name ];

                if ( object.update ) {

                    object.update( scene, camera );

                }

            }

        }

    };

}

class GLTFShader {
    constructor ( targetNode, allNodes ) {

        var boundUniforms = {};

        // bind each uniform to its source node

        var uniforms = targetNode.material.uniforms;

        for ( var uniformId in uniforms ) {

            var uniform = uniforms[ uniformId ];

            if ( uniform.semantic ) {

                var sourceNodeRef = uniform.node;

                var sourceNode = targetNode;

                if ( sourceNodeRef ) {

                    sourceNode = allNodes[ sourceNodeRef ];

                }

                boundUniforms[ uniformId ] = {
                    semantic: uniform.semantic,
                    sourceNode: sourceNode,
                    targetNode: targetNode,
                    uniform: uniform
                };

            }

        }

        this.boundUniforms = boundUniforms;
        this._m4 = new Matrix4();
    }

    update ( scene, camera ) {

        var boundUniforms = this.boundUniforms;

        for ( var name in boundUniforms ) {

            var boundUniform = boundUniforms[ name ];

            switch ( boundUniform.semantic ) {

                case "MODELVIEW":

                    var m4 = boundUniform.uniform.value;
                    m4.multiplyMatrices( camera.matrixWorldInverse, boundUniform.sourceNode.matrixWorld );
                    break;

                case "MODELVIEWINVERSETRANSPOSE":

                    var m3 = boundUniform.uniform.value;
                    this._m4.multiplyMatrices( camera.matrixWorldInverse, boundUniform.sourceNode.matrixWorld );
                    m3.getNormalMatrix( this._m4 );
                    break;

                case "PROJECTION":

                    var m4 = boundUniform.uniform.value;
                    m4.copy( camera.projectionMatrix );
                    break;

                case "JOINTMATRIX":

                    var m4v = boundUniform.uniform.value;

                    for ( var mi = 0; mi < m4v.length; mi ++ ) {

                        // So it goes like this:
                        // SkinnedMesh world matrix is already baked into MODELVIEW;
                        // transform joints to local space,
                        // then transform using joint's inverse
                        m4v[ mi ]
                            .getInverse( boundUniform.sourceNode.matrixWorld )
                            .multiply( boundUniform.targetNode.skeleton.bones[ mi ].matrixWorld )
                            .multiply( boundUniform.targetNode.skeleton.boneInverses[ mi ] )
                            .multiply( boundUniform.targetNode.bindMatrix );

                    }

                    break;

                default :

                    console.warn( "Unhandled shader semantic: " + boundUniform.semantic );
                    break;

            }

        }
    }


}

var EXTENSIONS = {
    KHR_BINARY_GLTF: 'KHR_binary_glTF',
    KHR_MATERIALS_COMMON: 'KHR_materials_common'
};

function GLTFMaterialsCommonExtension( json ) {

    this.name = EXTENSIONS.KHR_MATERIALS_COMMON;

    this.lights = {};

    var extension = ( json.extensions && json.extensions[ EXTENSIONS.KHR_MATERIALS_COMMON ] ) || {};
    var lights = extension.lights || {};

    for ( var lightId in lights ) {

        var light = lights[ lightId ];
        var lightNode;

        var lightParams = light[ light.type ];
        var color = new Color().fromArray( lightParams.color );

        switch ( light.type ) {

            case "directional":
                lightNode = new DirectionalLight( color );
                lightNode.position.set( 0, 0, 1 );
                break;

            case "point":
                lightNode = new PointLight( color );
                break;

            case "spot":
                lightNode = new SpotLight( color );
                lightNode.position.set( 0, 0, 1 );
                break;

            case "ambient":
                lightNode = new AmbientLight( color );
                break;

        }

        if ( lightNode ) {

            this.lights[ lightId ] = lightNode;

        }

    }
}

var BINARY_EXTENSION_BUFFER_NAME = 'binary_glTF';

var BINARY_EXTENSION_HEADER_DEFAULTS = { magic: 'glTF', version: 1, contentFormat: 0 };

var BINARY_EXTENSION_HEADER_LENGTH = 20;

class GLTFBinaryExtension {
    constructor( data ) {

        this.name = EXTENSIONS.KHR_BINARY_GLTF;

        var headerView = new DataView( data, 0, BINARY_EXTENSION_HEADER_LENGTH );

        var header = {
            magic: LoaderUtils.decodeText( new Uint8Array( data.slice( 0, 4 ) ) ),
            version: headerView.getUint32( 4, true ),
            length: headerView.getUint32( 8, true ),
            contentLength: headerView.getUint32( 12, true ),
            contentFormat: headerView.getUint32( 16, true )
        };

        for ( var key in BINARY_EXTENSION_HEADER_DEFAULTS ) {

            var value = BINARY_EXTENSION_HEADER_DEFAULTS[ key ];

            if ( header[ key ] !== value ) {

                throw new Error( 'Unsupported glTF-Binary header: Expected "%s" to be "%s".', key, value );

            }

        }

        var contentArray = new Uint8Array( data, BINARY_EXTENSION_HEADER_LENGTH, header.contentLength );

        this.header = header;
        this.content = LoaderUtils.decodeText( contentArray );
        this.body = data.slice( BINARY_EXTENSION_HEADER_LENGTH + header.contentLength, header.length );
    }

    loadShader ( shader, bufferViews ) {

        var bufferView = bufferViews[ shader.extensions[ EXTENSIONS.KHR_BINARY_GLTF ].bufferView ];
        var array = new Uint8Array( bufferView );

        return LoaderUtils.decodeText( array );

    };
}

var WEBGL_CONSTANTS = {
    FLOAT: 5126,
    //FLOAT_MAT2: 35674,
    FLOAT_MAT3: 35675,
    FLOAT_MAT4: 35676,
    FLOAT_VEC2: 35664,
    FLOAT_VEC3: 35665,
    FLOAT_VEC4: 35666,
    LINEAR: 9729,
    REPEAT: 10497,
    SAMPLER_2D: 35678,
    TRIANGLES: 4,
    LINES: 1,
    UNSIGNED_BYTE: 5121,
    UNSIGNED_SHORT: 5123,

    VERTEX_SHADER: 35633,
    FRAGMENT_SHADER: 35632
};

var WEBGL_TYPE = {
    5126: Number,
    //35674: Matrix2,
    35675: Matrix3,
    35676: Matrix4,
    35664: Vector2,
    35665: Vector3,
    35666: Vector4,
    35678: Texture
};

var WEBGL_COMPONENT_TYPES = {
    5120: Int8Array,
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array
};

var WEBGL_FILTERS = {
    9728: NearestFilter,
    9729: LinearFilter,
    9984: NearestMipmapNearestFilter,
    9985: LinearMipmapNearestFilter,
    9986: NearestMipmapLinearFilter,
    9987: LinearMipmapLinearFilter
};

var WEBGL_WRAPPINGS = {
    33071: ClampToEdgeWrapping,
    33648: MirroredRepeatWrapping,
    10497: RepeatWrapping
};

var WEBGL_TEXTURE_FORMATS = {
    6406: AlphaFormat,
    6407: RGBFormat,
    6408: RGBAFormat,
    6409: LuminanceFormat,
    6410: LuminanceAlphaFormat
};

var WEBGL_TEXTURE_DATATYPES = {
    5121: UnsignedByteType,
    32819: UnsignedShort4444Type,
    32820: UnsignedShort5551Type
};

var WEBGL_SIDES = {
    1028: BackSide, // Culling front
    1029: FrontSide // Culling back
    //1032: NoSide   // Culling front and back, what to do?
};

var WEBGL_DEPTH_FUNCS = {
    512: NeverDepth,
    513: LessDepth,
    514: EqualDepth,
    515: LessEqualDepth,
    516: GreaterEqualDepth,
    517: NotEqualDepth,
    518: GreaterEqualDepth,
    519: AlwaysDepth
};

var WEBGL_BLEND_EQUATIONS = {
    32774: AddEquation,
    32778: SubtractEquation,
    32779: ReverseSubtractEquation
};

var WEBGL_BLEND_FUNCS = {
    0: ZeroFactor,
    1: OneFactor,
    768: SrcColorFactor,
    769: OneMinusSrcColorFactor,
    770: SrcAlphaFactor,
    771: OneMinusSrcAlphaFactor,
    772: DstAlphaFactor,
    773: OneMinusDstAlphaFactor,
    774: DstColorFactor,
    775: OneMinusDstColorFactor,
    776: SrcAlphaSaturateFactor
    // The followings are not supported by js yet
    //32769: CONSTANT_COLOR,
    //32770: ONE_MINUS_CONSTANT_COLOR,
    //32771: CONSTANT_ALPHA,
    //32772: ONE_MINUS_CONSTANT_COLOR
};

var WEBGL_TYPE_SIZES = {
    'SCALAR': 1,
    'VEC2': 2,
    'VEC3': 3,
    'VEC4': 4,
    'MAT2': 4,
    'MAT3': 9,
    'MAT4': 16
};

var PATH_PROPERTIES = {
    scale: 'scale',
    translation: 'position',
    rotation: 'quaternion'
};

var INTERPOLATION = {
    LINEAR: InterpolateLinear,
    STEP: InterpolateDiscrete
};

var STATES_ENABLES = {
    2884: 'CULL_FACE',
    2929: 'DEPTH_TEST',
    3042: 'BLEND',
    3089: 'SCISSOR_TEST',
    32823: 'POLYGON_OFFSET_FILL',
    32926: 'SAMPLE_ALPHA_TO_COVERAGE'
};

function _each( object, callback, thisObj ) {

    if ( ! object ) {

        return Promise.resolve();

    }

    var results;
    var fns = [];

    if ( Object.prototype.toString.call( object ) === '[object Array]' ) {

        results = [];

        var length = object.length;

        for ( var idx = 0; idx < length; idx ++ ) {

            var value = callback.call( thisObj || this, object[ idx ], idx );

            if ( value ) {

                fns.push( value );

                if ( value instanceof Promise ) {

                    value.then( function ( key, value ) {

                        results[ key ] = value;

                    }.bind( this, idx ) );

                } else {

                    results[ idx ] = value;

                }

            }

        }

    } else {

        results = {};

        for ( var key in object ) {

            if ( object.hasOwnProperty( key ) ) {

                var value = callback.call( thisObj || this, object[ key ], key );

                if ( value ) {

                    fns.push( value );

                    if ( value instanceof Promise ) {

                        value.then( function ( key, value ) {

                            results[ key ] = value;

                        }.bind( this, key ) );

                    } else {

                        results[ key ] = value;

                    }

                }

            }

        }

    }

    return Promise.all( fns ).then( function () {

        return results;

    } );

}

function resolveURL( url, path ) {

    // Invalid URL
    if ( typeof url !== 'string' || url === '' )
        return '';

    // Absolute URL http://,https://,//
    if ( /^(https?:)?\/\//i.test( url ) ) {

        return url;

    }

    // Data URI
    if ( /^data:.*,.*$/i.test( url ) ) {

        return url;

    }

    // Blob URL
    if ( /^blob:.*$/i.test( url ) ) {

        return url;

    }

    // Relative URL
    return ( path || '' ) + url;

}

// js seems too dependent on attribute names so globally
// replace those in the shader code
function replaceTHREEShaderAttributes( shaderText, technique ) {

    // Expected technique attributes
    var attributes = {};

    for ( var attributeId in technique.attributes ) {

        var pname = technique.attributes[ attributeId ];

        var param = technique.parameters[ pname ];
        var atype = param.type;
        var semantic = param.semantic;

        attributes[ attributeId ] = {
            type: atype,
            semantic: semantic
        };

    }

    // Figure out which attributes to change in technique

    var shaderParams = technique.parameters;
    var shaderAttributes = technique.attributes;
    var params = {};

    for ( var attributeId in attributes ) {

        var pname = shaderAttributes[ attributeId ];
        var shaderParam = shaderParams[ pname ];
        var semantic = shaderParam.semantic;
        if ( semantic ) {

            params[ attributeId ] = shaderParam;

        }

    }

    for ( var pname in params ) {

        var param = params[ pname ];
        var semantic = param.semantic;

        var regEx = new RegExp( "\\b" + pname + "\\b", "g" );

        switch ( semantic ) {

            case "POSITION":

                shaderText = shaderText.replace( regEx, 'position' );
                break;

            case "NORMAL":

                shaderText = shaderText.replace( regEx, 'normal' );
                break;

            case 'TEXCOORD_0':
            case 'TEXCOORD0':
            case 'TEXCOORD':

                shaderText = shaderText.replace( regEx, 'uv' );
                break;

            case 'TEXCOORD_1':

                shaderText = shaderText.replace( regEx, 'uv2' );
                break;

            case 'COLOR_0':
            case 'COLOR0':
            case 'COLOR':

                shaderText = shaderText.replace( regEx, 'color' );
                break;

            case "WEIGHT":

                shaderText = shaderText.replace( regEx, 'skinWeight' );
                break;

            case "JOINT":

                shaderText = shaderText.replace( regEx, 'skinIndex' );
                break;

        }

    }

    return shaderText;

}

function createDefaultMaterial() {

    return new MeshPhongMaterial( {
        color: 0x00000,
        emissive: 0x888888,
        specular: 0x000000,
        shininess: 0,
        transparent: false,
        depthTest: true,
        side: FrontSide
    } );

}

class DeferredShaderMaterial {
    constructor( params ) {
        this.isDeferredShaderMaterial = true;

        this.params = params;
    }

    create() {

        var uniforms = UniformsUtils.clone( this.params.uniforms );

        for ( var uniformId in this.params.uniforms ) {

            var originalUniform = this.params.uniforms[ uniformId ];

            if ( originalUniform.value instanceof Texture ) {

                uniforms[ uniformId ].value = originalUniform.value;
                uniforms[ uniformId ].value.needsUpdate = true;

            }

            uniforms[ uniformId ].semantic = originalUniform.semantic;
            uniforms[ uniformId ].node = originalUniform.node;

        }

        this.params.uniforms = uniforms;

        return new RawShaderMaterial( this.params );
    }
}

class GLTFParser {
    constructor( json, extensions, options ) {
        this.json = json || {};
        this.extensions = extensions || {};
        this.options = options || {};

        // loader object cache
        this.cache = new GLTFRegistry();
    }

    _withDependencies( dependencies ) {

        var _dependencies = {};

        for ( var i = 0; i < dependencies.length; i ++ ) {

            var dependency = dependencies[ i ];
            var fnName = "load" + dependency.charAt( 0 ).toUpperCase() + dependency.slice( 1 );

            var cached = this.cache.get( dependency );

            if ( cached !== undefined ) {

                _dependencies[ dependency ] = cached;

            } else if ( this[ fnName ] ) {

                var fn = this[ fnName ]();
                this.cache.add( dependency, fn );

                _dependencies[ dependency ] = fn;

            }

        }

        return _each( _dependencies, function ( dependency ) {

            return dependency;

        } );

    };

    parse( callback ) {

        var json = this.json;

        // Clear the loader cache
        this.cache.removeAll();

        // Fire the callback on complete
        this._withDependencies( [

            "scenes",
            "cameras",
            "animations"

        ] ).then( function ( dependencies ) {

            var scenes = [];

            for ( var name in dependencies.scenes ) {

                scenes.push( dependencies.scenes[ name ] );

            }

            var scene = json.scene !== undefined ? dependencies.scenes[ json.scene ] : scenes[ 0 ];

            var cameras = [];

            for ( var name in dependencies.cameras ) {

                var camera = dependencies.cameras[ name ];
                cameras.push( camera );

            }

            var animations = [];

            for ( var name in dependencies.animations ) {

                animations.push( dependencies.animations[ name ] );

            }

            callback( scene, scenes, cameras, animations );

        } );

    };

    loadShaders() {

        var json = this.json;
        var extensions = this.extensions;
        var options = this.options;

        return this._withDependencies( [

            "bufferViews"

        ] ).then( function ( dependencies ) {

            return _each( json.shaders, function ( shader ) {

                if ( shader.extensions && shader.extensions[ EXTENSIONS.KHR_BINARY_GLTF ] ) {

                    return extensions[ EXTENSIONS.KHR_BINARY_GLTF ].loadShader( shader, dependencies.bufferViews );

                }

                return new Promise( function ( resolve ) {

                    var loader = new FileLoader( options.manager );

                    // Common google urls to save pointless requests
                    if (shader.uri === 'https://vr.google.com/shaders/w/fs.glsl') {return FS_GLSL}
                    if (shader.uri === 'https://vr.google.com/shaders/w/vs.glsl') {return VS_GLSL}
                    if (shader.uri === 'https://vr.google.com/shaders/w/glassVS.glsl') {return GLASSVS_GLSL}
                    if (shader.uri === 'https://vr.google.com/shaders/w/glassFS.glsl') {return GLASSFS_GLSL}
                    if (shader.uri === 'https://vr.google.com/shaders/w/gemVS.glsl') {return GEMVS_GLSL}
                    if (shader.uri === 'https://vr.google.com/shaders/w/gemFS.glsl') {return GEMFS_GLSL}

                    let shaderPath = "https://icosa-foundation.github.io/icosa-sketch-assets/"
                    // Catch anything else - it would give a CORS error in any case
                    let url = shader.uri.replace("https://vr.google.com/shaders/w/", shaderPath);
                    url = url.replace(/https:\/\/web\.archive\.org\/web\/\d+\/https:\/\/www\.tiltbrush\.com\/shaders\//, shaderPath);
                    url = url.replace('https://www.tiltbrush.com/shaders/', shaderPath);

                    loader.load( resolveURL( url, options.path ), function ( shaderText ) {

                        resolve( shaderText );

                    } );

                } );

            } );

        } );

    };

    loadBuffers() {
        var json = this.json;
        var extensions = this.extensions;
        var options = this.options;

        return _each( json.buffers, function ( buffer, name ) {

            if ( name === BINARY_EXTENSION_BUFFER_NAME ) {

                return extensions[ EXTENSIONS.KHR_BINARY_GLTF ].body;

            }

            if ( buffer.type === 'arraybuffer' || buffer.type === undefined ) {

                return new Promise( function ( resolve ) {

                    var loader = new FileLoader( options.manager );
                    loader.setResponseType( 'arraybuffer' );
                    loader.setCrossOrigin('no-cors');
                    loader.load( resolveURL( buffer.uri, options.path ), function ( buffer ) {

                        resolve( buffer );

                    } );

                } );

            } else {

                console.warn( 'THREE.LegacyGLTFLoader: ' + buffer.type + ' buffer type is not supported' );

            }

        } );

    };

    loadBufferViews() {

        var json = this.json;

        return this._withDependencies( [

            "buffers"

        ] ).then( function ( dependencies ) {

            return _each( json.bufferViews, function ( bufferView ) {

                var arraybuffer = dependencies.buffers[ bufferView.buffer ];

                var byteLength = bufferView.byteLength !== undefined ? bufferView.byteLength : 0;

                return arraybuffer.slice( bufferView.byteOffset, bufferView.byteOffset + byteLength );

            } );

        } );

    };

    loadAccessors() {

        var json = this.json;

        return this._withDependencies( [

            "bufferViews"

        ] ).then( function ( dependencies ) {

            return _each( json.accessors, function ( accessor ) {

                var arraybuffer = dependencies.bufferViews[ accessor.bufferView ];
                var itemSize = WEBGL_TYPE_SIZES[ accessor.type ];
                var TypedArray = WEBGL_COMPONENT_TYPES[ accessor.componentType ];

                // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
                var elementBytes = TypedArray.BYTES_PER_ELEMENT;
                var itemBytes = elementBytes * itemSize;

                // The buffer is not interleaved if the stride is the item size in bytes.
                if ( accessor.byteStride && accessor.byteStride !== itemBytes ) {

                    // Use the full buffer if it's interleaved.
                    var array = new TypedArray( arraybuffer );

                    // Integer parameters to IB/IBA are in array elements, not bytes.
                    var ib = new InterleavedBuffer( array, accessor.byteStride / elementBytes );

                    return new InterleavedBufferAttribute( ib, itemSize, accessor.byteOffset / elementBytes );

                } else {

                    array = new TypedArray( arraybuffer, accessor.byteOffset, accessor.count * itemSize );

                    return new BufferAttribute( array, itemSize );

                }

            } );

        } );

    };

    loadTextures() {

        var json = this.json;
        var options = this.options;

        return this._withDependencies( [

            "bufferViews"

        ] ).then( function ( dependencies ) {

            return _each( json.textures, function ( texture ) {

                if ( texture.source ) {

                    return new Promise( function ( resolve ) {

                        var source = json.images[ texture.source ];

                        // TODO Make this configurable
                        var sourceUri = source.uri.replace("https://www.tiltbrush.com/shaders/", "https://icosa-foundation.github.io/icosa-sketch-assets/");

                        var isObjectURL = false;

                        if ( source.extensions && source.extensions[ EXTENSIONS.KHR_BINARY_GLTF ] ) {

                            var metadata = source.extensions[ EXTENSIONS.KHR_BINARY_GLTF ];
                            var bufferView = dependencies.bufferViews[ metadata.bufferView ];
                            var blob = new Blob( [ bufferView ], { type: metadata.mimeType } );
                            sourceUri = URL.createObjectURL( blob );
                            isObjectURL = true;

                        }

                        var textureLoader = options.manager.getHandler( sourceUri );

                        if ( textureLoader === null ) {

                            textureLoader = new TextureLoader( options.manager );

                        }

                        textureLoader.setCrossOrigin( options.crossOrigin );

                        textureLoader.load( resolveURL( sourceUri, options.path ), function ( _texture ) {

                            if ( isObjectURL ) URL.revokeObjectURL( sourceUri );

                            _texture.flipY = false;

                            if ( texture.name !== undefined ) _texture.name = texture.name;

                            _texture.format = texture.format !== undefined ? WEBGL_TEXTURE_FORMATS[ texture.format ] : RGBAFormat;

                            if ( texture.internalFormat !== undefined && _texture.format !== WEBGL_TEXTURE_FORMATS[ texture.internalFormat ] ) {

                                console.warn( 'THREE.LegacyGLTFLoader: Three.js doesn\'t support texture internalFormat which is different from texture format. ' +
                                    'internalFormat will be forced to be the same value as format.' );

                            }

                            _texture.type = texture.type !== undefined ? WEBGL_TEXTURE_DATATYPES[ texture.type ] : UnsignedByteType;

                            if ( texture.sampler ) {

                                var sampler = json.samplers[ texture.sampler ];

                                _texture.magFilter = WEBGL_FILTERS[ sampler.magFilter ] || LinearFilter;
                                _texture.minFilter = WEBGL_FILTERS[ sampler.minFilter ] || NearestMipmapLinearFilter;
                                _texture.wrapS = WEBGL_WRAPPINGS[ sampler.wrapS ] || RepeatWrapping;
                                _texture.wrapT = WEBGL_WRAPPINGS[ sampler.wrapT ] || RepeatWrapping;

                            }

                            resolve( _texture );

                        }, undefined, function () {

                            if ( isObjectURL ) URL.revokeObjectURL( sourceUri );

                            resolve();

                        } );

                    } );

                }

            } );

        } );

    };

    loadMaterials() {

        var json = this.json;

        return this._withDependencies( [

            "shaders",
            "textures"

        ] ).then( function ( dependencies ) {

            return _each( json.materials, function ( material ) {

                var materialType;
                var materialValues = {};
                var materialParams = {};

                var khr_material;

                if ( material.extensions && material.extensions[ EXTENSIONS.KHR_MATERIALS_COMMON ] ) {

                    khr_material = material.extensions[ EXTENSIONS.KHR_MATERIALS_COMMON ];

                }

                if ( khr_material ) {

                    // don't copy over unused values to avoid material warning spam
                    var keys = [ 'ambient', 'emission', 'transparent', 'transparency', 'doubleSided' ];

                    switch ( khr_material.technique ) {

                        case 'BLINN' :
                        case 'PHONG' :
                            materialType = MeshPhongMaterial;
                            keys.push( 'diffuse', 'specular', 'shininess' );
                            break;

                        case 'LAMBERT' :
                            materialType = MeshLambertMaterial;
                            keys.push( 'diffuse' );
                            break;

                        case 'CONSTANT' :
                        default :
                            materialType = MeshBasicMaterial;
                            break;

                    }

                    keys.forEach( function ( v ) {

                        if ( khr_material.values[ v ] !== undefined ) materialValues[ v ] = khr_material.values[ v ];

                    } );

                    if ( khr_material.doubleSided || materialValues.doubleSided ) {

                        materialParams.side = DoubleSide;

                    }

                    if ( khr_material.transparent || materialValues.transparent ) {

                        materialParams.transparent = true;
                        materialParams.opacity = ( materialValues.transparency !== undefined ) ? materialValues.transparency : 1;

                    }

                } else if ( material.technique === undefined ) {

                    materialType = MeshPhongMaterial;

                    Object.assign( materialValues, material.values );

                } else {

                    materialType = DeferredShaderMaterial;

                    var technique = json.techniques[ material.technique ];

                    materialParams.uniforms = {};

                    var program = json.programs[ technique.program ];

                    if ( program ) {

                        materialParams.fragmentShader = dependencies.shaders[ program.fragmentShader ];

                        if ( ! materialParams.fragmentShader ) {

                            console.warn( "ERROR: Missing fragment shader definition:", program.fragmentShader );
                            materialType = MeshPhongMaterial;

                        }

                        var vertexShader = dependencies.shaders[ program.vertexShader ];

                        if ( ! vertexShader ) {

                            console.warn( "ERROR: Missing vertex shader definition:", program.vertexShader );
                            materialType = MeshPhongMaterial;

                        }

                        // IMPORTANT: FIX VERTEX SHADER ATTRIBUTE DEFINITIONS
                        materialParams.vertexShader = replaceTHREEShaderAttributes( vertexShader, technique );

                        var uniforms = technique.uniforms;

                        for ( var uniformId in uniforms ) {

                            var pname = uniforms[ uniformId ];
                            var shaderParam = technique.parameters[ pname ];

                            var ptype = shaderParam.type;

                            if ( WEBGL_TYPE[ ptype ] ) {

                                var pcount = shaderParam.count;
                                var value;

                                if ( material.values !== undefined ) value = material.values[ pname ];

                                var uvalue = new WEBGL_TYPE[ ptype ]();
                                var usemantic = shaderParam.semantic;
                                var unode = shaderParam.node;

                                switch ( ptype ) {

                                    case WEBGL_CONSTANTS.FLOAT:

                                        uvalue = shaderParam.value;

                                        if ( pname == "transparency" ) {

                                            materialParams.transparent = true;

                                        }

                                        if ( value !== undefined ) {

                                            uvalue = value;

                                        }

                                        break;

                                    case WEBGL_CONSTANTS.FLOAT_VEC2:
                                    case WEBGL_CONSTANTS.FLOAT_VEC3:
                                    case WEBGL_CONSTANTS.FLOAT_VEC4:
                                    case WEBGL_CONSTANTS.FLOAT_MAT3:

                                        if ( shaderParam && shaderParam.value ) {

                                            uvalue.fromArray( shaderParam.value );

                                        }

                                        if ( value ) {

                                            uvalue.fromArray( value );

                                        }

                                        break;

                                    case WEBGL_CONSTANTS.FLOAT_MAT2:

                                        // what to do?
                                        console.warn( "FLOAT_MAT2 is not a supported uniform type" );
                                        break;

                                    case WEBGL_CONSTANTS.FLOAT_MAT4:

                                        if ( pcount ) {

                                            uvalue = new Array( pcount );

                                            for ( var mi = 0; mi < pcount; mi ++ ) {

                                                uvalue[ mi ] = new WEBGL_TYPE[ ptype ]();

                                            }

                                            if ( shaderParam && shaderParam.value ) {

                                                var m4v = shaderParam.value;
                                                uvalue.fromArray( m4v );

                                            }

                                            if ( value ) {

                                                uvalue.fromArray( value );

                                            }

                                        } else {

                                            if ( shaderParam && shaderParam.value ) {

                                                var m4 = shaderParam.value;
                                                uvalue.fromArray( m4 );

                                            }

                                            if ( value ) {

                                                uvalue.fromArray( value );

                                            }

                                        }

                                        break;

                                    case WEBGL_CONSTANTS.SAMPLER_2D:

                                        if ( value !== undefined ) {

                                            uvalue = dependencies.textures[ value ];

                                        } else if ( shaderParam.value !== undefined ) {

                                            uvalue = dependencies.textures[ shaderParam.value ];

                                        } else {

                                            uvalue = null;

                                        }

                                        break;

                                }

                                materialParams.uniforms[ uniformId ] = {
                                    value: uvalue,
                                    semantic: usemantic,
                                    node: unode
                                };

                            } else {

                                throw new Error( "Unknown shader uniform param type: " + ptype );

                            }

                        }

                        var states = technique.states || {};
                        var enables = states.enable || [];
                        var functions = states.functions || {};

                        var enableCullFace = false;
                        var enableDepthTest = false;
                        var enableBlend = false;

                        for ( var i = 0, il = enables.length; i < il; i ++ ) {

                            var enable = enables[ i ];

                            switch ( STATES_ENABLES[ enable ] ) {

                                case 'CULL_FACE':

                                    enableCullFace = true;

                                    break;

                                case 'DEPTH_TEST':

                                    enableDepthTest = true;

                                    break;

                                case 'BLEND':

                                    enableBlend = true;

                                    break;

                                // TODO: implement
                                case 'SCISSOR_TEST':
                                case 'POLYGON_OFFSET_FILL':
                                case 'SAMPLE_ALPHA_TO_COVERAGE':

                                    break;

                                default:

                                    throw new Error( "Unknown technique.states.enable: " + enable );

                            }

                        }

                        if ( enableCullFace ) {

                            materialParams.side = functions.cullFace !== undefined ? WEBGL_SIDES[ functions.cullFace ] : FrontSide;

                        } else {

                            materialParams.side = DoubleSide;

                        }

                        materialParams.depthTest = enableDepthTest;
                        materialParams.depthFunc = functions.depthFunc !== undefined ? WEBGL_DEPTH_FUNCS[ functions.depthFunc ] : LessDepth;
                        materialParams.depthWrite = functions.depthMask !== undefined ? functions.depthMask[ 0 ] : true;

                        materialParams.blending = enableBlend ? CustomBlending : NoBlending;
                        materialParams.transparent = enableBlend;

                        var blendEquationSeparate = functions.blendEquationSeparate;

                        if ( blendEquationSeparate !== undefined ) {

                            materialParams.blendEquation = WEBGL_BLEND_EQUATIONS[ blendEquationSeparate[ 0 ] ];
                            materialParams.blendEquationAlpha = WEBGL_BLEND_EQUATIONS[ blendEquationSeparate[ 1 ] ];

                        } else {

                            materialParams.blendEquation = AddEquation;
                            materialParams.blendEquationAlpha = AddEquation;

                        }

                        var blendFuncSeparate = functions.blendFuncSeparate;

                        if ( blendFuncSeparate !== undefined ) {

                            materialParams.blendSrc = WEBGL_BLEND_FUNCS[ blendFuncSeparate[ 0 ] ];
                            materialParams.blendDst = WEBGL_BLEND_FUNCS[ blendFuncSeparate[ 1 ] ];
                            materialParams.blendSrcAlpha = WEBGL_BLEND_FUNCS[ blendFuncSeparate[ 2 ] ];
                            materialParams.blendDstAlpha = WEBGL_BLEND_FUNCS[ blendFuncSeparate[ 3 ] ];

                        } else {

                            materialParams.blendSrc = OneFactor;
                            materialParams.blendDst = ZeroFactor;
                            materialParams.blendSrcAlpha = OneFactor;
                            materialParams.blendDstAlpha = ZeroFactor;

                        }

                    }

                }

                if ( Array.isArray( materialValues.diffuse ) ) {

                    materialParams.color = new Color().fromArray( materialValues.diffuse );

                } else if ( typeof ( materialValues.diffuse ) === 'string' ) {

                    materialParams.map = dependencies.textures[ materialValues.diffuse ];

                }

                delete materialParams.diffuse;

                if ( typeof ( materialValues.reflective ) === 'string' ) {

                    materialParams.envMap = dependencies.textures[ materialValues.reflective ];

                }

                if ( typeof ( materialValues.bump ) === 'string' ) {

                    materialParams.bumpMap = dependencies.textures[ materialValues.bump ];

                }

                if ( Array.isArray( materialValues.emission ) ) {

                    if ( materialType === MeshBasicMaterial ) {

                        materialParams.color = new Color().fromArray( materialValues.emission );

                    } else {

                        materialParams.emissive = new Color().fromArray( materialValues.emission );

                    }

                } else if ( typeof ( materialValues.emission ) === 'string' ) {

                    if ( materialType === MeshBasicMaterial ) {

                        materialParams.map = dependencies.textures[ materialValues.emission ];

                    } else {

                        materialParams.emissiveMap = dependencies.textures[ materialValues.emission ];

                    }

                }

                if ( Array.isArray( materialValues.specular ) ) {

                    materialParams.specular = new Color().fromArray( materialValues.specular );

                } else if ( typeof ( materialValues.specular ) === 'string' ) {

                    materialParams.specularMap = dependencies.textures[ materialValues.specular ];

                }

                if ( materialValues.shininess !== undefined ) {

                    materialParams.shininess = materialValues.shininess;

                }

                var _material = new materialType( materialParams );
                if ( material.name !== undefined ) _material.name = material.name;

                return _material;

            } );

        } );

    };

    loadMeshes() {

        var json = this.json;

        return this._withDependencies( [

            "accessors",
            "materials"

        ] ).then( function ( dependencies ) {

            return _each( json.meshes, function ( mesh ) {

                var group = new Group();
                if ( mesh.name !== undefined ) group.name = mesh.name;

                if ( mesh.extras ) group.userData = mesh.extras;

                var primitives = mesh.primitives || [];

                for ( var name in primitives ) {

                    var primitive = primitives[ name ];

                    if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLES || primitive.mode === undefined ) {

                        var geometry = new BufferGeometry();

                        var attributes = primitive.attributes;

                        for ( var attributeId in attributes ) {

                            var attributeEntry = attributes[ attributeId ];

                            if ( ! attributeEntry ) return;

                            var bufferAttribute = dependencies.accessors[ attributeEntry ];

                            switch ( attributeId ) {

                                case 'POSITION':
                                    geometry.setAttribute( 'position', bufferAttribute );
                                    break;

                                case 'NORMAL':
                                    geometry.setAttribute( 'normal', bufferAttribute );
                                    break;

                                case 'TEXCOORD_0':
                                case 'TEXCOORD0':
                                case 'TEXCOORD':
                                    geometry.setAttribute( 'uv', bufferAttribute );
                                    break;

                                case 'TEXCOORD_1':
                                    geometry.setAttribute( 'uv2', bufferAttribute );
                                    break;

                                case 'COLOR_0':
                                case 'COLOR0':
                                case 'COLOR':
                                    geometry.setAttribute( 'color', bufferAttribute );
                                    break;

                                case 'WEIGHT':
                                    geometry.setAttribute( 'skinWeight', bufferAttribute );
                                    break;

                                case 'JOINT':
                                    geometry.setAttribute( 'skinIndex', bufferAttribute );
                                    break;

                                default:

                                    if ( ! primitive.material ) break;

                                    var material = json.materials[ primitive.material ];

                                    if ( ! material.technique ) break;

                                    var parameters = json.techniques[ material.technique ].parameters || {};

                                    for ( var attributeName in parameters ) {

                                        if ( parameters[ attributeName ][ 'semantic' ] === attributeId ) {

                                            geometry.setAttribute( attributeName, bufferAttribute );

                                        }

                                    }

                            }

                        }

                        if ( primitive.indices ) {

                            geometry.setIndex( dependencies.accessors[ primitive.indices ] );

                        }

                        var material = dependencies.materials !== undefined ? dependencies.materials[ primitive.material ] : createDefaultMaterial();

                        var meshNode = new Mesh( geometry, material );
                        meshNode.castShadow = true;
                        meshNode.name = ( name === "0" ? group.name : group.name + name );

                        if ( primitive.extras ) meshNode.userData = primitive.extras;

                        group.add( meshNode );

                    } else if ( primitive.mode === WEBGL_CONSTANTS.LINES ) {

                        var geometry = new BufferGeometry();

                        var attributes = primitive.attributes;

                        for ( var attributeId in attributes ) {

                            var attributeEntry = attributes[ attributeId ];

                            if ( ! attributeEntry ) return;

                            var bufferAttribute = dependencies.accessors[ attributeEntry ];

                            switch ( attributeId ) {

                                case 'POSITION':
                                    geometry.setAttribute( 'position', bufferAttribute );
                                    break;

                                case 'COLOR_0':
                                case 'COLOR0':
                                case 'COLOR':
                                    geometry.setAttribute( 'color', bufferAttribute );
                                    break;

                            }

                        }

                        var material = dependencies.materials[ primitive.material ];

                        var meshNode;

                        if ( primitive.indices ) {

                            geometry.setIndex( dependencies.accessors[ primitive.indices ] );

                            meshNode = new LineSegments( geometry, material );

                        } else {

                            meshNode = new Line( geometry, material );

                        }

                        meshNode.name = ( name === "0" ? group.name : group.name + name );

                        if ( primitive.extras ) meshNode.userData = primitive.extras;

                        group.add( meshNode );

                    } else {

                        console.warn( "Only triangular and line primitives are supported" );

                    }

                }

                return group;

            } );

        } );

    };

    loadCameras() {

        var json = this.json;

        return _each( json.cameras, function ( camera ) {

            if ( camera.type == "perspective" && camera.perspective ) {

                var yfov = camera.perspective.yfov;
                var aspectRatio = camera.perspective.aspectRatio !== undefined ? camera.perspective.aspectRatio : 1;

                // According to COLLADA spec...
                // aspectRatio = xfov / yfov
                var xfov = yfov * aspectRatio;

                var _camera = new PerspectiveCamera( Math.radToDeg( xfov ), aspectRatio, camera.perspective.znear || 1, camera.perspective.zfar || 2e6 );
                if ( camera.name !== undefined ) _camera.name = camera.name;

                if ( camera.extras ) _camera.userData = camera.extras;

                return _camera;

            } else if ( camera.type == "orthographic" && camera.orthographic ) {

                var _camera = new OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, camera.orthographic.znear, camera.orthographic.zfar );
                if ( camera.name !== undefined ) _camera.name = camera.name;

                if ( camera.extras ) _camera.userData = camera.extras;

                return _camera;

            }

        } );

    };

    loadSkins() {

        var json = this.json;

        return this._withDependencies( [

            "accessors"

        ] ).then( function ( dependencies ) {

            return _each( json.skins, function ( skin ) {

                var bindShapeMatrix = new Matrix4();

                if ( skin.bindShapeMatrix !== undefined ) bindShapeMatrix.fromArray( skin.bindShapeMatrix );

                var _skin = {
                    bindShapeMatrix: bindShapeMatrix,
                    jointNames: skin.jointNames,
                    inverseBindMatrices: dependencies.accessors[ skin.inverseBindMatrices ]
                };

                return _skin;

            } );

        } );

    };

    loadAnimations() {

        var json = this.json;

        return this._withDependencies( [

            "accessors",
            "nodes"

        ] ).then( function ( dependencies ) {

            return _each( json.animations, function ( animation, animationId ) {

                var tracks = [];

                for ( var channelId in animation.channels ) {

                    var channel = animation.channels[ channelId ];
                    var sampler = animation.samplers[ channel.sampler ];

                    if ( sampler ) {

                        var target = channel.target;
                        var name = target.id;
                        var input = animation.parameters !== undefined ? animation.parameters[ sampler.input ] : sampler.input;
                        var output = animation.parameters !== undefined ? animation.parameters[ sampler.output ] : sampler.output;

                        var inputAccessor = dependencies.accessors[ input ];
                        var outputAccessor = dependencies.accessors[ output ];

                        var node = dependencies.nodes[ name ];

                        if ( node ) {

                            node.updateMatrix();
                            node.matrixAutoUpdate = true;

                            var TypedKeyframeTrack = PATH_PROPERTIES[ target.path ] === PATH_PROPERTIES.rotation
                                ? QuaternionKeyframeTrack
                                : VectorKeyframeTrack;

                            var targetName = node.name ? node.name : node.uuid;
                            var interpolation = sampler.interpolation !== undefined ? INTERPOLATION[ sampler.interpolation ] : InterpolateLinear;

                            // KeyframeTrack.optimize() will modify given 'times' and 'values'
                            // buffers before creating a truncated copy to keep. Because buffers may
                            // be reused by other tracks, make copies here.
                            tracks.push( new TypedKeyframeTrack(
                                targetName + '.' + PATH_PROPERTIES[ target.path ],
                                AnimationUtils.arraySlice( inputAccessor.array, 0 ),
                                AnimationUtils.arraySlice( outputAccessor.array, 0 ),
                                interpolation
                            ) );

                        }

                    }

                }

                var name = animation.name !== undefined ? animation.name : "animation_" + animationId;

                return new AnimationClip( name, undefined, tracks );

            } );

        } );

    };

    loadNodes() {

        var json = this.json;
        var extensions = this.extensions;
        var scope = this;

        return _each( json.nodes, function ( node ) {

            var matrix = new Matrix4();

            var _node;

            if ( node.jointName ) {

                _node = new Bone();
                _node.name = node.name !== undefined ? node.name : node.jointName;
                _node.jointName = node.jointName;

            } else {

                _node = new Object3D();
                if ( node.name !== undefined ) _node.name = node.name;

            }

            if ( node.extras ) _node.userData = node.extras;

            if ( node.matrix !== undefined ) {

                matrix.fromArray( node.matrix );
                _node.applyMatrix4( matrix );

            } else {

                if ( node.translation !== undefined ) {

                    _node.position.fromArray( node.translation );

                }

                if ( node.rotation !== undefined ) {

                    _node.quaternion.fromArray( node.rotation );

                }

                if ( node.scale !== undefined ) {

                    _node.scale.fromArray( node.scale );

                }

            }

            return _node;

        } ).then( function ( __nodes ) {

            return scope._withDependencies( [

                "meshes",
                "skins",
                "cameras"

            ] ).then( function ( dependencies ) {

                return _each( __nodes, function ( _node, nodeId ) {

                    var node = json.nodes[ nodeId ];

                    if ( node.meshes !== undefined ) {

                        for ( var meshId in node.meshes ) {

                            var mesh = node.meshes[ meshId ];
                            var group = dependencies.meshes[ mesh ];

                            if ( group === undefined ) {

                                console.warn( 'LegacyGLTFLoader: Couldn\'t find node "' + mesh + '".' );
                                continue;

                            }

                            for ( var childrenId in group.children ) {

                                var child = group.children[ childrenId ];

                                // clone Mesh to add to _node

                                var originalMaterial = child.material;
                                var originalGeometry = child.geometry;
                                var originalUserData = child.userData;
                                var originalName = child.name;

                                var material;

                                if ( originalMaterial.isDeferredShaderMaterial ) {

                                    originalMaterial = material = originalMaterial.create();

                                } else {

                                    material = originalMaterial;

                                }

                                switch ( child.type ) {

                                    case 'LineSegments':
                                        child = new LineSegments( originalGeometry, material );
                                        break;

                                    case 'LineLoop':
                                        child = new LineLoop( originalGeometry, material );
                                        break;

                                    case 'Line':
                                        child = new Line( originalGeometry, material );
                                        break;

                                    default:
                                        child = new Mesh( originalGeometry, material );

                                }

                                child.castShadow = true;
                                child.userData = originalUserData;
                                child.name = originalName;

                                var skinEntry;

                                if ( node.skin ) {

                                    skinEntry = dependencies.skins[ node.skin ];

                                }

                                // Replace Mesh with SkinnedMesh in library
                                if ( skinEntry ) {

                                    var getJointNode = function ( jointId ) {

                                        var keys = Object.keys( __nodes );

                                        for ( var i = 0, il = keys.length; i < il; i ++ ) {

                                            var n = __nodes[ keys[ i ] ];

                                            if ( n.jointName === jointId ) return n;

                                        }

                                        return null;

                                    };

                                    var geometry = originalGeometry;
                                    var material = originalMaterial;
                                    material.skinning = true;

                                    child = new SkinnedMesh( geometry, material );
                                    child.castShadow = true;
                                    child.userData = originalUserData;
                                    child.name = originalName;

                                    var bones = [];
                                    var boneInverses = [];

                                    for ( var i = 0, l = skinEntry.jointNames.length; i < l; i ++ ) {

                                        var jointId = skinEntry.jointNames[ i ];
                                        var jointNode = getJointNode( jointId );

                                        if ( jointNode ) {

                                            bones.push( jointNode );

                                            var m = skinEntry.inverseBindMatrices.array;
                                            var mat = new Matrix4().fromArray( m, i * 16 );
                                            boneInverses.push( mat );

                                        } else {

                                            console.warn( "WARNING: joint: '" + jointId + "' could not be found" );

                                        }

                                    }

                                    child.bind( new Skeleton( bones, boneInverses ), skinEntry.bindShapeMatrix );

                                    var buildBoneGraph = function ( parentJson, parentObject, property ) {

                                        var children = parentJson[ property ];

                                        if ( children === undefined ) return;

                                        for ( var i = 0, il = children.length; i < il; i ++ ) {

                                            var nodeId = children[ i ];
                                            var bone = __nodes[ nodeId ];
                                            var boneJson = json.nodes[ nodeId ];

                                            if ( bone !== undefined && bone.isBone === true && boneJson !== undefined ) {

                                                parentObject.add( bone );
                                                buildBoneGraph( boneJson, bone, 'children' );

                                            }

                                        }

                                    };

                                    buildBoneGraph( node, child, 'skeletons' );

                                }

                                _node.add( child );

                            }

                        }

                    }

                    if ( node.camera !== undefined ) {

                        var camera = dependencies.cameras[ node.camera ];

                        _node.add( camera );

                    }

                    if ( node.extensions
                        && node.extensions[ EXTENSIONS.KHR_MATERIALS_COMMON ]
                        && node.extensions[ EXTENSIONS.KHR_MATERIALS_COMMON ].light ) {

                        var extensionLights = extensions[ EXTENSIONS.KHR_MATERIALS_COMMON ].lights;
                        var light = extensionLights[ node.extensions[ EXTENSIONS.KHR_MATERIALS_COMMON ].light ];

                        _node.add( light );

                    }

                    return _node;

                } );

            } );

        } );

    };

    loadScenes() {

        var json = this.json;

        // scene node hierachy builder

        function buildNodeHierachy( nodeId, parentObject, allNodes ) {

            var _node = allNodes[ nodeId ];
            parentObject.add( _node );

            var node = json.nodes[ nodeId ];

            if ( node.children ) {

                var children = node.children;

                for ( var i = 0, l = children.length; i < l; i ++ ) {

                    var child = children[ i ];
                    buildNodeHierachy( child, _node, allNodes );

                }

            }

        }

        return this._withDependencies( [

            "nodes"

        ] ).then( function ( dependencies ) {

            return _each( json.scenes, function ( scene ) {

                var _scene = new Scene();
                if ( scene.name !== undefined ) _scene.name = scene.name;

                if ( scene.extras ) _scene.userData = scene.extras;

                var nodes = scene.nodes || [];

                for ( var i = 0, l = nodes.length; i < l; i ++ ) {

                    var nodeId = nodes[ i ];
                    buildNodeHierachy( nodeId, _scene, dependencies.nodes );

                }

                _scene.traverse( function ( child ) {

                    // Register raw material meshes with LegacyGLTFLoader.Shaders
                    if ( child.material && child.material.isRawShaderMaterial ) {

                        child.gltfShader = new GLTFShader( child, dependencies.nodes );
                        child.onBeforeRender = function ( renderer, scene, camera ) {

                            this.gltfShader.update( scene, camera );

                        };

                    }

                } );

                return _scene;

            } );

        } );

    };
}
