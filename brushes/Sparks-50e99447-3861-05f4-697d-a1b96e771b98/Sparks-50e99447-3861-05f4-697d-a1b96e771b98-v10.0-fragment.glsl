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

// Sparks fragment shader (additive)
precision mediump float;

uniform sampler2D u_MainTex;
uniform float u_EmissionGain;
uniform float u_StretchDistortionExponent;
uniform float u_NumSides;
uniform float u_Speed;
uniform vec4 u_time;

in vec4 v_color;
in vec2 v_texcoord0;

out vec4 fragColor;

float rand_1_05(float row) {
  float n = fract(sin(row * (12.9898 + 78.233) * 2.0) * 50.0);
  return abs(n + n) * 0.75; // Approximation of HLSL trick
}

void main() {
  // Warp U to slow near the end of the stroke
  vec2 uv = v_texcoord0;
  uv.x = pow(uv.x, u_StretchDistortionExponent);

  // Animate origin along U in [0, u_Scale)
  float u_scale = u_Speed;
  float t = mod(u_time.w * u_scale, u_scale);
  float u = uv.x * u_scale - t;

  // Row-based random offset so strips don't animate together
  float row_id = floor(uv.y * u_NumSides);
  float r = rand_1_05(row_id);
  u += r * u_scale;
  u = mod(u, u_scale);

  // Rescale V per side
  float v = uv.y * u_NumSides;

  // Sample and manually clamp outside [0,1] in U
  vec4 tex = texture(u_MainTex, vec2(u, v));
  if (u < 0.0 || u > 1.0) tex = vec4(0.0);

  float bloom = exp(u_EmissionGain * 5.0) * (1.0 - v_texcoord0.x);
  vec4 color = v_color * tex * bloom;

  // Additive output
  fragColor = vec4(color.rgb, color.a);
}
