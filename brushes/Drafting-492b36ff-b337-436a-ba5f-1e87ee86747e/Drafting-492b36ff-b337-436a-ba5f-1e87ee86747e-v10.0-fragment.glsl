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

// Drafting fragment shader
precision mediump float;

out vec4 fragColor;

in vec4 v_color;
in vec2 v_texcoord0;

uniform sampler2D u_MainTex;
uniform float u_Opacity;

void main() {
  vec4 tex = texture(u_MainTex, v_texcoord0);
  vec4 color = v_color * tex;
  color.rgb *= color.a * u_Opacity;
  fragColor = color * u_Opacity;
}
