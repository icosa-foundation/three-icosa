// Copyright 2020 The Tilt Brush Authors
// Updated to OpenGL ES 3.0 by the Icosa Gallery Authors
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

precision highp float;

out vec4 fragColor;

uniform vec4 u_ambient_light_color;
uniform vec4 u_SceneLight_0_color;
uniform vec4 u_SceneLight_1_color;
uniform float u_Shininess;   // Should be in [0.0, 1.0].
uniform vec3 u_SpecColor;

in vec4 v_color;
in vec3 v_normal;
in vec3 v_position;
in vec3 v_light_dir_0;
in vec3 v_light_dir_1;
in vec2 v_texcoord0;

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

// Fogging support
uniform vec3 u_fogColor;
uniform float u_fogDensity;
in float f_fog_coord;

// This fog function emulates the exponential fog used in Tilt Brush
//
// Details:
//   * For exponential fog, Unity defines u_density = density / ln(2) on the CPU, sp that they can
//        convert the base from e to 2 and use exp2 rather than exp. We might as well do the same.
//   * The fog on Plya does not precisely match that in Unity, though it's very close.  Two known
//        reasons for this are
//          1) Clipping plans on Poly are different than in Tilt Brush.  Poly is .1:2000, Tilt
//             Brush is .5:10000.
//          2) Poly applies post processing (vignettes, etc...) that can subtly change the look
//             of the fog.
//   * Finally, Tilt Brush uses "decimeters" for legacy reasons.
//        In order to convert Density values from TB to Poly, we multiply by 10.0 in order to
//        convert decimeters to meters.
//

vec3 ApplyFog(vec3 color) {
  // Per the top comment, we must modify the density value by Unity's ln(2) modification as well as
  // a decimeter conversion
  float density = (u_fogDensity / .693147) * 10.;

  // This exponential fog function is copied directly from unity (see UnityCG.inc).
  float fogFactor = f_fog_coord * density;
  fogFactor = exp2(-fogFactor);
  fogFactor = clamp( fogFactor, 0.0, 1.0 );
  return mix(u_fogColor, color.xyz, fogFactor);
}
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

//
// Standard BRDF Lighting
//

const float PI = 3.141592654;
const float INV_PI = 0.318309886;
const vec3 GAMMA_DIELECTRIC_SPEC = vec3(0.220916301, 0.220916301, 0.220916301);
const float GAMMA_ONE_MINUS_DIELECTRIC = (1.0 - 0.220916301);

// The following functions are based on similar ones in the Unity Standard BRDF
// with minor changes for GLSL and unused #ifdef pruning.

float Pow5(float x) {
  return x * x * x * x * x;
}

// https://disney-animation.s3.amazonaws.com/library/s2012_pbs_disney_brdf_notes_v2.pdf
float DisneyDiffuseTerm(float NdotV, float NdotL, float LdotH,
                        float perceptualRoughness) {
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

// Implements Schlick's approximation to Fresnel. IoR is implied by
// F0, which contains minimum reflectance values (per RGB color).
vec3 FresnelTerm (vec3 F0, float cosA) {
  float t = Pow5(1.0 - cosA);
  return F0 + (vec3(1.0) - F0) * t;
}

vec3 SurfaceShaderInternal(
    vec3 normal,  // Unit surface normal.
    vec3 lightDir,  // Unit vector from shading point to light.
    vec3 eyeDir,  // Unit vector from shading point to camera.
    vec3 lightColor,  // RGB color of the light.
    vec3 diffuseColor,  // Surface diffuse color.
    vec3 specularColor,  // Surface specular color, also drives Fresnel.
    float perceptualRoughness) {  // Unity's perceptual Roughness, in [0.0, 1.0].
  float NdotL = clamp(dot(normal, lightDir), 0.0, 1.0);
  float NdotV = abs(dot(normal, eyeDir));

  vec3 halfVector = normalize(lightDir + eyeDir);
  float NdotH = clamp(dot(normal, halfVector), 0.0, 1.0);
  float LdotH = clamp(dot(lightDir, halfVector), 0.0, 1.0);

  float diffuseTerm = NdotL *
    DisneyDiffuseTerm(NdotV, NdotL, LdotH, perceptualRoughness);

  if (length(specularColor) < 1e-5) {
    return diffuseColor * (lightColor * diffuseTerm);
  }

  float roughness = perceptualRoughness * perceptualRoughness;

  // The V term includes both the traditional G term and the BRDF divisors.
  float V = GgxDistributionTerm(NdotH, roughness);
  float D = SmithJointVisibilityTerm(NdotL, NdotV, roughness);
  float specularTerm = V * D * PI;  // RGB-based Fresnel terms applied below.

  specularTerm = sqrt(max(1e-4, specularTerm));  // For Gamma-space rendering.
  specularTerm *= NdotL;

  // Treats specularColor as spectral F0 components of Schlick's formula.
  vec3 fresnelColor = FresnelTerm(specularColor, LdotH);

  return lightColor *
      (diffuseTerm * diffuseColor + specularTerm * fresnelColor);
}

// An emulation of Unity 5.5's Surface shader, minus the global
// illumination part. Returns a per-light color contribution to the
// shaded surface. Ambient illumination needs to be added separately.
vec3 SurfaceShaderSpecularGloss(
    vec3 normal,  // Unit surface normal.
    vec3 lightDir,  // Unit vector from shading point to light.
    vec3 eyeDir,  // Unit vector from shading point to camera.
    vec3 lightColor,  // RGB color of the light.
    vec3 albedoColor,  // Surface albedo color.
    vec3 specularColor,  // Surface specular color, also drives Fresnel.
    float gloss) {  // Unity's perceptual smoothness, in [0.0, 1.0].
  float oneMinusSpecularIntensity =
      1.0 - clamp(max(max(specularColor.r, specularColor.g), specularColor.b), 0., 1.);
  vec3 diffuseColor = albedoColor * oneMinusSpecularIntensity;
  float perceptualRoughness = 1.0 - gloss;

  return SurfaceShaderInternal(
      normal, lightDir, eyeDir, lightColor, diffuseColor, specularColor, perceptualRoughness);
}

// An emulation of Unity 5.5's Surface shader using MetallicSetup(), minus the global
// illumination part. Returns a per-light color contribution to the
// shaded surface. Ambient illumination needs to be added separately.
vec3 SurfaceShaderMetallicRoughness(
    vec3 normal,  // Unit surface normal.
    vec3 lightDir,  // Unit vector from shading point to light.
    vec3 eyeDir,  // Unit vector from shading point to camera.
    vec3 lightColor,  // RGB color of the light.
    vec3 albedoColor,  // Surface albedo color.
    float metallic,  // Surface metallic value, drives specular color and reflectivity.
    float perceptualRoughness) {  // Unity's perceptual Roughness, in [0.0, 1.0], sqrt of roughness.
  vec3 specularColor = mix(GAMMA_DIELECTRIC_SPEC, albedoColor, metallic);
  float oneMinusReflectivity = GAMMA_ONE_MINUS_DIELECTRIC - metallic * GAMMA_ONE_MINUS_DIELECTRIC;
  vec3 diffuseColor = albedoColor * oneMinusReflectivity;

  return SurfaceShaderInternal(
      normal, lightDir, eyeDir, lightColor, diffuseColor, specularColor, perceptualRoughness);
}

//
// An Approximation of Unity SH Lighting
//

// SH lighting needs to emulate Unity's SH light behavior.
// -Diffuse contribution should be roughly 1/2
// -Specularity should "subtract" from the diffuse contribution becuase
//  the SH Lights in unity are not energy preserving.

vec3 ShShaderWithSpec(
    vec3 normal,  // Unit surface normal.
    vec3 lightDir,  // Unit vector from shading point to light.
    vec3 lightColor,  // RGB color of the light.
    vec3 diffuseColor, // Surface diffuse color, i.e. albedo.
    vec3 specularColor) {  // Specular color.  Used to replicate broken SH lighting
                           // in unity which is not energy preserving
  float specularGrayscale = dot(specularColor, vec3(0.3, 0.59, 0.11));
  float NdotL = clamp(dot(normal, lightDir), 0.0, 1.0);
  // Compensate for missing specular contribution
  float shIntensityMultiplier = 1. - specularGrayscale;
  shIntensityMultiplier *= shIntensityMultiplier;
  return diffuseColor * lightColor * NdotL * shIntensityMultiplier;
}

vec3 ShShader(
    vec3 normal,  // Unit surface normal.
    vec3 lightDir,  // Unit vector from shading point to light.
    vec3 lightColor,  // RGB color of the light.
    vec3 diffuseColor) {  // Surface diffuse color, i.e. albedo
  return ShShaderWithSpec(normal, lightDir, lightColor, diffuseColor, vec3(0.,0.,0.));
}

//
// Lambert Lighting
//
vec3 LambertShader(
    vec3 normal,  // Unit surface normal.
    vec3 lightDir,  // Unit vector from shading point to light.
    vec3 lightColor,  // RGB color of the light.
    vec3 diffuseColor) {  // Surface diffuse color, i.e. albedo.
  float NdotL = clamp(dot(normal, lightDir), 0.0, 1.0);
  return diffuseColor * lightColor * NdotL;
}

vec3 computeLighting(vec3 diffuseColor, vec3 specularColor) {
  vec3 normal = normalize(v_normal);

  normal.x = dFdx(normal.x);
  vec3 facetedNormal = normalize(cross(dFdy(v_position), dFdx(v_position)));

  vec3 lightDir0 = normalize(v_light_dir_0);
  vec3 lightDir1 = normalize(v_light_dir_1);
  vec3 eyeDir = -normalize(v_position);

  vec3 lightOut0 = SurfaceShaderSpecularGloss(facetedNormal, lightDir0, eyeDir,
      u_SceneLight_0_color.rgb, diffuseColor, specularColor, u_Shininess);
  vec3 lightOut1 = ShShaderWithSpec(normal, lightDir1, u_SceneLight_1_color.rgb, diffuseColor, u_SpecColor);
  vec3 ambientOut = diffuseColor * u_ambient_light_color.rgb;

  // Add a fake "disco ball" hot spot 
  // Note that in the glsl version of this shader, the hot spot is broader in order to create
  // additional highlights. Glsl does not support glossy environment specularity, so we need to compensate
  // with more visual interest here to make up for it.
  float fakeLightIntensity = pow( abs(dot( facetedNormal, vec3(0.0,1.0,0.0))), 10.0) * 20.;
  vec3 fakeLight = specularColor * fakeLightIntensity;
  return (lightOut0 + lightOut1 + ambientOut + fakeLight);
}

void main() {
  vec3 diffuseColor = vec3(0.0,0.0,0.0);
  vec3 specularColor = v_color.rgb * u_SpecColor;

  fragColor.rgb = ApplyFog(computeLighting(diffuseColor, specularColor));
  fragColor.a = 1.0;
}
