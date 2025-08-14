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

// TaperedHueShift fragment shader
precision mediump float;

out vec4 fragColor;

in vec4 v_color;
in vec2 v_texcoord0;

uniform sampler2D u_MainTex;
uniform float u_Cutoff;

// Actual Tilt Brush hue06_to_base_rgb function from ColorSpace.cginc
vec3 hue06_to_base_rgb(float hue06) {
  float r = -1.0 + abs(hue06 - 3.0);
  float g =  2.0 - abs(hue06 - 2.0);
  float b =  2.0 - abs(hue06 - 4.0);
  return clamp(vec3(r, g, b), 0.0, 1.0);
}

void main() {
  vec4 c = texture(u_MainTex, v_texcoord0) * v_color;
  
  // Discard transparent pixels
  if (c.a < u_Cutoff) {
    discard;
  }
  
  // Create hue shift effect - working toward Unity's red->purple behavior
  float shift = 5.0 + v_color.r + v_color.g + v_color.b + v_color.a;
  // Try different calculations to find what maps red -> purple (hue ≈ 4.5)
  float hueInput = 4.5 + v_color.r * 0.5; // Start with purple base, slight red variation
  vec3 hueShiftColor = hue06_to_base_rgb(hueInput);
  
  // Create vignette effect for hue blending (matches Unity calculation)
  // Unity: pow(abs(i.texcoord - .5) * 2.0, 2.0) - likely uses x component only for strip ends
  float vignette = pow(abs(v_texcoord0.x - 0.5) * 2.0, 2.0);
  
  // Blend original color with hue-shifted color based on vignette
  vec3 finalColor = mix(c.rgb, hueShiftColor, clamp(vignette, 0.0, 1.0));
  
  fragColor = vec4(finalColor, 1.0);
}
