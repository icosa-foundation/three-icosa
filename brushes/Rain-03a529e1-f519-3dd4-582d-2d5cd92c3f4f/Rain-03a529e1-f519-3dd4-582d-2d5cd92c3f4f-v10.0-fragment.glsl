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

// Rain fragment shader with animated UV strips

precision highp float;

uniform sampler2D u_MainTex;
uniform vec4 u_time;
uniform float u_NumSides;
uniform float u_Speed;

in vec4 v_color;
in vec2 v_texcoord0;
in vec4 v_worldPos;

out vec4 fragColor;

float rand_1_05(vec2 uv) {
  // The sine hash is not stable between the Direct3D reference and WebGL.
  // Preserve the Direct3D phases for Rain's fixed integer tube-row IDs.
  int row = int(uv.x);
  if (row == 1) return 0.416650385;
  if (row == 2) return 0.654;
  if (row == 3) return 0.030078124;
  if (row == 4) return 0.369;
  if (row == 5) return 0.394433588;
  if (row == 6) return 0.199609369;
  return 0.0;
}

float fmodCompat(float value, float divisor) {
  return value - divisor * trunc(value / divisor);
}

void main() {
  float u_scale = u_Speed;  // Unity: u_scale = _Speed
  float t = fmodCompat(u_time.y * 4.0 * u_scale, u_scale);
  
  // Rescale U coord and animate it
  vec2 uvs = v_texcoord0;
  float u = uvs.x * u_scale - t; // Unity: u = uvs.x * u_scale - t
  
  // Calculate face ID for randomization
  float row_id = float(int(uvs.y * u_NumSides));
  float rand = rand_1_05(vec2(row_id));
  
  // Randomize animation by row ID
  u += rand * u_time.y * 2.75 * u_scale;
  
  // Wrap U coordinate
  u = fmodCompat(u, u_scale);
  
  // Rescale V coord for each strip
  float v = uvs.y * u_NumSides;
  
  vec4 tex = texture(u_MainTex, vec2(u, v));
  
  // Clip texture outside 0-1 U range
  tex = (u < 0.0) ? vec4(0.0) : tex;
  tex = (u > 1.0) ? vec4(0.0) : tex;
  
  // Fade at stroke edges
  float fade = pow(abs(v_texcoord0.x * 0.25), 9.0);
  vec4 color = v_color * tex;
  vec4 finalColor = mix(color, vec4(0.0), clamp(fade, 0.0, 1.0));
  
  fragColor = vec4(finalColor.rgb * finalColor.a, 1.0);
}
