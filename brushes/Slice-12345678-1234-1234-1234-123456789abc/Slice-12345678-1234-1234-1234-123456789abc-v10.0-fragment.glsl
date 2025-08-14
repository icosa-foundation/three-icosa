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

// Slice fragment shader - procedural color generation
precision mediump float;

out vec4 fragColor;

in vec3 v_texcoord0;

uniform float u_Opacity;

// From ColorSpace.cginc - hue06_to_base_rgb function
vec3 hue06_to_base_rgb(float hue06) {
  float r = -1.0 + abs(hue06 - 3.0);
  float g =  2.0 - abs(hue06 - 2.0);
  float b =  2.0 - abs(hue06 - 4.0);
  return clamp(vec3(r, g, b), 0.0, 1.0);
}

// From ColorSpace.cginc - cy_to_rgb function  
vec3 g_max_luma = vec3(0.299, 0.587, 0.114);
vec3 cy_to_rgb(vec3 base_rgb, float chroma, float luma) {
  float rgb_luma = dot(base_rgb, g_max_luma);
  if (luma < rgb_luma) {
    chroma *= luma / rgb_luma;
  } else if (luma < 1.0) {
    chroma *= (1.0 - luma) / (1.0 - rgb_luma);
  }
  return (base_rgb - rgb_luma) * chroma + luma;
}

void main() {
  // Unity calculation: fmod(i.texcoord.z * 5, 6)
  float hue = mod(v_texcoord0.z * 5.0, 6.0);
  vec3 base_rgb = hue06_to_base_rgb(hue);
  
  // Unity: cy_to_rgb(base_rgb, i.texcoord.x, i.texcoord.y)
  vec3 finalColor = cy_to_rgb(base_rgb, v_texcoord0.x, v_texcoord0.y);
  
  fragColor = vec4(clamp(finalColor, 0.0, 1.0), u_Opacity);
}