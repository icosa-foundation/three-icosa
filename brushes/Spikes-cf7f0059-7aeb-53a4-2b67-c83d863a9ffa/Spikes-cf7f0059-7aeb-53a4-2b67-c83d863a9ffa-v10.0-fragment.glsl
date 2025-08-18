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

precision mediump float;

out vec4 fragColor;

uniform vec4 u_ambient_light_color;
uniform vec4 u_SceneLight_0_color;
uniform vec4 u_SceneLight_1_color;

uniform vec3 u_SpecColor;
uniform float u_Shininess;
uniform float u_Cutoff;
uniform sampler2D u_MainTex;

in vec4 v_color;
in vec3 v_normal;
in vec3 v_position;
in vec3 v_light_dir_0;
in vec3 v_light_dir_1;
in vec2 v_texcoord0;

vec3 computeLighting() {
  vec3 normal = normalize(v_normal);
  if (!gl_FrontFacing) {
    // Always use front-facing normal for double-sided surfaces.
    normal *= -1.0;
  }
  vec3 lightDir0 = normalize(v_light_dir_0);
  vec3 lightDir1 = normalize(v_light_dir_1);

  vec3 lightOut0 = LambertShader(normal, lightDir0,
      u_SceneLight_0_color.rgb, v_color.rgb);
  vec3 lightOut1 = ShShader(normal, lightDir1,
      u_SceneLight_1_color.rgb, v_color.rgb);
  vec3 ambientOut = v_color.rgb * u_ambient_light_color.rgb;

  return (lightOut0 + lightOut1 + ambientOut);
}

void main() {
    float brush_mask = texture(u_MainTex, v_texcoord0).w;
    brush_mask *= v_color.w;

    // Now using fixed normal map unpacking instead of derivative-based height mapping
    vec3 normal = PerturbNormal(v_position, normalize(v_normal), v_texcoord0);
    fragColor.rgb = ApplyFog(computeLighting(normal), f_fog_coord);
    fragColor.a = 1.0;

    if (brush_mask <= u_Cutoff) {
        discard;
    }
}
