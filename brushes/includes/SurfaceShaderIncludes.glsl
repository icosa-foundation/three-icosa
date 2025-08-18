// Copyright 2020 The Tilt Brush Authors
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

// Complete Surface Shader emulation package for Three.js
// Includes: PerturbNormal, Surface Shader BRDF functions

precision mediump float;

// =============================================================================
// BUMP MAPPING (PerturbNormal)
// =============================================================================

uniform sampler2D u_BumpMap;

// Unpack a normal map from [0,1] to [-1,1] range
vec3 UnpackNormal(vec3 normalMapSample) {
    return normalize(normalMapSample * 2.0 - 1.0);
}

// Convert normal from tangent space to world space
vec3 PerturbNormal(vec3 position, vec3 normal, vec2 uv) {
    // Handle face orientation first - flip base normal for back faces
    if (!gl_FrontFacing) {
        normal = -normal;
    }
    
    // Sample the normal map
    vec3 normalMapSample = texture(u_BumpMap, uv).xyz;
    
    // If this is a 2-channel normal map (RG format), reconstruct Z
    if (length(normalMapSample.z) < 0.1) {
        normalMapSample.z = sqrt(1.0 - clamp(dot(normalMapSample.xy, normalMapSample.xy), 0.0, 1.0));
    }
    
    // Unpack from [0,1] to [-1,1] range
    vec3 tangentNormal = UnpackNormal(normalMapSample);
    
    // For now, we'll use a simplified approach since we don't have tangent vectors
    // This assumes the normal map is relatively aligned with the surface normal
    vec3 perturbedNormal = normalize(normal + tangentNormal * 0.3);
    
    return perturbedNormal;
}

// =============================================================================
// SURFACE SHADER BRDF FUNCTIONS
// =============================================================================

const float PI = 3.141592654;
const float INV_PI = 0.318309886;
const vec3 GAMMA_DIELECTRIC_SPEC = vec3(0.220916301, 0.220916301, 0.220916301);
const float GAMMA_ONE_MINUS_DIELECTRIC = (1.0 - 0.220916301);

float Pow5(float x) {
    return x * x * x * x * x;
}

float DisneyDiffuseTerm(float NdotV, float NdotL, float LdotH, float perceptualRoughness) {
    float fd90 = 0.5 + 2.0 * LdotH * LdotH * perceptualRoughness;
    float lightScatter = 1.0 + (fd90 - 1.0) * Pow5(1.0 - NdotL);
    float viewScatter  = 1.0 + (fd90 - 1.0) * Pow5(1.0 - NdotV);
    return lightScatter * viewScatter;
}

float SmithJointVisibilityTerm(float NdotL, float NdotV, float roughness) {
    float lambdaV = NdotL * mix(NdotV, 1.0, roughness);
    float lambdaL = NdotV * mix(NdotL, 1.0, roughness);
    return 0.5 / (lambdaV + lambdaL + 1e-5);
}

float GgxDistributionTerm(float NdotH, float roughness) {
    float a2 = roughness * roughness;
    float d = (NdotH * a2 - NdotH) * NdotH + 1.0;
    return INV_PI * a2 / (d * d + 1e-7);
}

vec3 FresnelTerm (vec3 F0, float cosA) {
    float t = Pow5(1.0 - cosA);
    return F0 + (vec3(1.0) - F0) * t;
}

vec3 SurfaceShaderInternal(
    vec3 normal, vec3 lightDir, vec3 eyeDir, vec3 lightColor,
    vec3 diffuseColor, vec3 specularColor, float perceptualRoughness) {
    float NdotL = clamp(dot(normal, lightDir), 0.0, 1.0);
    float NdotV = abs(dot(normal, eyeDir));

    vec3 halfVector = normalize(lightDir + eyeDir);
    float NdotH = clamp(dot(normal, halfVector), 0.0, 1.0);
    float LdotH = clamp(dot(lightDir, halfVector), 0.0, 1.0);

    float diffuseTerm = NdotL * DisneyDiffuseTerm(NdotV, NdotL, LdotH, perceptualRoughness);

    if (length(specularColor) < 1e-5) {
        return diffuseColor * (lightColor * diffuseTerm);
    }

    float roughness = perceptualRoughness * perceptualRoughness;
    float V = GgxDistributionTerm(NdotH, roughness);
    float D = SmithJointVisibilityTerm(NdotL, NdotV, roughness);
    float specularTerm = V * D * PI;
    specularTerm = sqrt(max(1e-4, specularTerm));
    specularTerm *= NdotL;

    vec3 fresnelColor = FresnelTerm(specularColor, LdotH);
    return lightColor * (diffuseTerm * diffuseColor + specularTerm * fresnelColor);
}

vec3 SurfaceShaderSpecularGloss(
        vec3 normal,
        vec3 lightDir,
        vec3 eyeDir,
        vec3 lightColor,
        vec3 albedoColor,
        vec3 specularColor,
        float gloss) {

    float oneMinusSpecularIntensity = 1.0 - clamp(max(max(specularColor.r, specularColor.g), specularColor.b), 0., 1.);
    vec3 diffuseColor = albedoColor * oneMinusSpecularIntensity;
    float perceptualRoughness = 1.0 - gloss;
    return SurfaceShaderInternal(normal, lightDir, eyeDir, lightColor, diffuseColor, specularColor, perceptualRoughness);

}

vec3 SurfaceShaderMetallicRoughness(
    vec3 normal, vec3 lightDir, vec3 eyeDir, vec3 lightColor,
    vec3 albedoColor, float metallic, float perceptualRoughness) {
    vec3 specularColor = mix(GAMMA_DIELECTRIC_SPEC, albedoColor, metallic);
    float oneMinusReflectivity = GAMMA_ONE_MINUS_DIELECTRIC - metallic * GAMMA_ONE_MINUS_DIELECTRIC;
    vec3 diffuseColor = albedoColor * oneMinusReflectivity;
    return SurfaceShaderInternal(normal, lightDir, eyeDir, lightColor, diffuseColor, specularColor, perceptualRoughness);
}

vec3 ShShaderWithSpec(vec3 normal, vec3 lightDir, vec3 lightColor, vec3 diffuseColor, vec3 specularColor) {
    float specularGrayscale = dot(specularColor, vec3(0.3, 0.59, 0.11));
    float NdotL = clamp(dot(normal, lightDir), 0.0, 1.0);
    float shIntensityMultiplier = 1. - specularGrayscale;
    shIntensityMultiplier *= shIntensityMultiplier;
    return diffuseColor * lightColor * NdotL * shIntensityMultiplier;
}

vec3 ShShader(vec3 normal, vec3 lightDir, vec3 lightColor, vec3 diffuseColor) {
    return ShShaderWithSpec(normal, lightDir, lightColor, diffuseColor, vec3(0.,0.,0.));
}

vec3 LambertShader(vec3 normal, vec3 lightDir, vec3 lightColor, vec3 diffuseColor) {
    float NdotL = clamp(dot(normal, lightDir), 0.0, 1.0);
    return diffuseColor * lightColor * NdotL;
}
