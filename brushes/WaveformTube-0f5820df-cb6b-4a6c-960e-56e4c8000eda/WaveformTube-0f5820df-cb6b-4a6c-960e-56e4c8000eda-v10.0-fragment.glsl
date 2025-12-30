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

uniform float u_Speed;
uniform float u_EmissionGain;
uniform sampler2D u_MainTex;
uniform vec4 u_time;

in vec4 v_color;
in vec2 v_texcoord0;

void main() {
  vec2 uv = v_texcoord0;
  uv.x -= u_time.x;
  uv.y += uv.x;
  uv.x *= .25;

  float wav = texture(u_MainTex, vec2(uv.x, 0)).r - .5f;
  uv.y += wav;
  fragColor = v_color * texture(u_MainTex, uv);
}

