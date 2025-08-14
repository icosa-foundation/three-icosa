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

precision mediump float;

uniform sampler2D u_MainTex;
uniform vec4 u_time;
uniform float u_NumSides;
uniform float u_Speed;
uniform vec4 u_MainTex_ST; // Texture tiling and offset (x=tileX, y=tileY, z=offsetX, w=offsetY)

in vec4 v_color;
in vec2 v_texcoord0;
in vec4 v_worldPos;

out vec4 fragColor;

float rand_1_05(vec2 uv) {
  float noise = fract(sin(dot(uv, vec2(12.9898, 78.233) * 2.0)) * 4550.0);
  return abs(noise) * 0.7;
}

void main() {
  float u_scale = u_Speed;  // Unity: u_scale = _Speed
  // Fix: our u_time.y advances ~4x faster than Unity's _Time.y  
  float time_scale = 0.3;  // Adjusted for proper Unity timing
  float t = mod(u_time.y * time_scale * 4.0 * u_scale, u_scale);
  
  // Rescale U coord and animate it
  vec2 uvs = v_texcoord0;
  float u = uvs.x * u_scale - t; // Unity: u = uvs.x * u_scale - t
  
  // Calculate face ID for randomization
  float row_id = float(int(uvs.y * u_NumSides));
  float rand = rand_1_05(vec2(row_id));
  
  // Randomize animation by row ID
  u += rand * u_time.y * time_scale * 2.75 * u_scale;
  
  // Wrap U coordinate
  u = mod(u, u_scale); // Unity: u = fmod(u, u_scale)
  
  // Rescale V coord for each strip
  float v = uvs.y * u_NumSides;
  
  // Apply Unity's texture tiling from uniform
  vec2 tiledUV = vec2(u * u_MainTex_ST.x + u_MainTex_ST.z, v * u_MainTex_ST.y + u_MainTex_ST.w);
  vec4 tex = texture(u_MainTex, tiledUV);
  
  // Clip texture outside 0-1 U range
  tex = (u < 0.0) ? vec4(0.0) : tex;
  tex = (u > 1.0) ? vec4(0.0) : tex;
  
  // Fade at stroke edges
  float fade = pow(abs(v_texcoord0.x * 0.25), 9.0);
  vec4 color = v_color * tex;
  vec4 finalColor = mix(color, vec4(0.0), clamp(fade, 0.0, 1.0));
  
  fragColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);
}
