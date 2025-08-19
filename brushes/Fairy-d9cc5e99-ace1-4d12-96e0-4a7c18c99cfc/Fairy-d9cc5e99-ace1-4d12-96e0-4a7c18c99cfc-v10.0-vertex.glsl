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

// Fairy vertex shader - simple pass-through for procedural fragment shader
in vec4 a_position;
in vec4 a_color;
in vec2 a_texcoord0;
in vec4 a_tangent;

out vec4 v_color;
out vec2 v_texcoord0;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * a_position;
  v_color = a_color;
  v_texcoord0 = a_texcoord0;
}
