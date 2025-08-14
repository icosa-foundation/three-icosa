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

// KeijiroTube vertex shader with wave animation
in vec4 a_position;
in vec3 a_normal;
in vec4 a_color;
in vec3 a_texcoord0;  // Need z component for radius

out vec4 v_color;
out vec3 v_normal;
out vec3 v_position;
out vec2 v_texcoord0;
out vec3 v_light_dir_0;
out vec3 v_light_dir_1;
out float f_fog_coord;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform mat4 u_SceneLight_0_matrix;
uniform mat4 u_SceneLight_1_matrix;
uniform vec3 u_time;

void main() {
  vec4 pos = a_position;
  
  // Wave animation (from Unity KeijiroTube)
  float radius = a_texcoord0.z;
  float wave = sin(a_texcoord0.x - u_time.z);
  float pulse = smoothstep(0.45, 0.5, clamp(wave, 0.0, 1.0));
  pos.xyz -= pulse * radius * a_normal;
  
  gl_Position = projectionMatrix * modelViewMatrix * pos;
  f_fog_coord = gl_Position.z;
  v_normal = normalMatrix * a_normal;
  v_position = (modelViewMatrix * pos).xyz;
  v_light_dir_0 = mat3(u_SceneLight_0_matrix) * vec3(0, 0, 1);
  v_light_dir_1 = mat3(u_SceneLight_1_matrix) * vec3(0, 0, 1);
  v_color = a_color;
  v_texcoord0 = a_texcoord0.xy;
}
