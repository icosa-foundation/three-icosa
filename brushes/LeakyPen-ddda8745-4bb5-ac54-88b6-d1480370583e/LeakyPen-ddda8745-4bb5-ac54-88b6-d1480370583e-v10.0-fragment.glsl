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

// LeakyPen brush fragment shader
// Implements dual texture sampling with alpha cutout

precision mediump float;

out vec4 fragColor;

uniform vec4 u_ambient_light_color;
uniform vec4 u_SceneLight_0_color;
uniform vec4 u_SceneLight_1_color;

uniform float u_Cutoff;
uniform sampler2D u_MainTex;

in vec4 v_color;
in vec3 v_normal;
in vec3 v_position;
in vec3 v_light_dir_0;
in vec3 v_light_dir_1;
in vec2 v_texcoord0;  // MainTex UV (for alpha mask)
in vec2 v_texcoord1;  // SecondaryTex UV (for diffuse)
in float f_fog_coord;

// Simple diffuse lighting for LeakyPen (no specular)
vec3 computeSimpleLighting(vec3 normal, vec3 albedo) {
  vec3 lightDir0 = normalize(v_light_dir_0);
  vec3 lightDir1 = normalize(v_light_dir_1);
  
  // Simple Lambert diffuse for both lights
  float NdotL0 = max(0.0, dot(normal, lightDir0));
  float NdotL1 = max(0.0, dot(normal, lightDir1));
  
  vec3 lightOut0 = albedo * u_SceneLight_0_color.rgb * NdotL0;
  vec3 lightOut1 = albedo * u_SceneLight_1_color.rgb * NdotL1;
  vec3 ambientOut = albedo * u_ambient_light_color.rgb;
  
  return lightOut0 + lightOut1 + ambientOut;
}

void main() {
  // Now that we know the values are correct, apply proper alpha testing
  
  vec3 secondary_tex = texture(u_MainTex, v_texcoord1).rgb;  // Diffuse from SecondaryTex UV
  float primary_tex = texture(u_MainTex, v_texcoord0).r;     // Alpha mask from MainTex UV
  
  // Alpha test - since red varies and all other values are good, this should work
  float alpha_test = primary_tex * v_color.a;  // Should vary along the strip
  
  if (alpha_test < u_Cutoff) {
    discard;
  }

  // Combine the two texture elements as per Unity shader
  vec3 tex = secondary_tex * primary_tex;
  
  // Use vertex color as albedo (matches Unity: o.Albedo = IN.color.rgb)
  vec3 albedo = v_color.rgb;
  
  // Apply simple lighting (no specular, matches Unity: o.Specular = 0)
  vec3 normal = normalize(v_normal);
  vec3 litColor = computeSimpleLighting(normal, albedo);
  
  // Apply fog and output
  fragColor.rgb = ApplyFog(litColor, f_fog_coord);
  fragColor.a = 1.0;
}
