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

// Brush-specific shader for GlTF web preview, based on Diffuse.glsl
// generator with parameters: a=0.067.

precision mediump float;

out vec4 fragColor;

uniform vec4 u_ambient_light_color;
uniform vec4 u_SceneLight_0_color;
uniform vec4 u_SceneLight_1_color;
uniform float u_Shininess;
uniform float u_RimIntensity;
uniform float u_RimPower;
uniform vec4 u_Color;

in vec4 v_color;
in vec3 v_normal;
in vec3 v_position;
in vec3 v_light_dir_0;
in vec3 v_light_dir_1;
in vec2 v_texcoord0;







// Specular only lighting
vec3 computeGlassReflection() {
  vec3 normal = normalize(v_normal);
  float backfaceDimming = 1.; 
  if (!gl_FrontFacing) {
    // Always use front-facing normal for double-sided surfaces.
    normal *= -1.0;
    backfaceDimming = .25;
  }
  vec3 lightDir0 = normalize(v_light_dir_0);
  vec3 lightDir1 = normalize(v_light_dir_1);
  vec3 eyeDir = -normalize(v_position);

  vec3 diffuseColor = vec3(0.,0.,0.);
  vec3 specularColor = vec3(u_Color.r, u_Color.g, u_Color.b);
  vec3 lightOut0 = SurfaceShaderSpecularGloss(normal, lightDir0, eyeDir, u_SceneLight_0_color.rgb,
      diffuseColor, specularColor, u_Shininess);

  // Calculate rim lighting
  float viewAngle = clamp(dot(eyeDir, normal),0.,1.);
  float rim =  pow(1. - viewAngle, u_RimPower) * u_RimIntensity;
  vec3 rimColor = vec3(rim,rim,rim);

  return (lightOut0 + rimColor) * backfaceDimming;
}

void main() {
    fragColor.rgb = computeGlassReflection();
    fragColor.a = 1.0;
}
