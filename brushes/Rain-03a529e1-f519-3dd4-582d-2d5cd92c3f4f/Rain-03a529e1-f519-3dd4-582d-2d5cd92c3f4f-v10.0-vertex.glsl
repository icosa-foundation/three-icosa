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

// Rain vertex shader with tube inflation

precision mediump float;

in vec4 a_position;
in vec3 a_normal;
in vec4 a_color;
in vec3 a_texcoord0;
in vec4 a_tangent;

out vec4 v_color;
out vec3 v_normal;  // Camera-space normal.
out vec3 v_tangent;  // Camera-space tangent.
out vec3 v_bitangent;  // Camera-space bitangent.
out vec3 v_position;  // Camera-space position.
out vec2 v_texcoord0;
out vec3 v_light_dir_0;  // Camera-space light direction, main light.
out vec3 v_light_dir_1;  // Camera-space light direction, other light.
out float f_fog_coord;
out vec4 v_worldPos;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform mat4 u_SceneLight_0_matrix;
uniform mat4 u_SceneLight_1_matrix;
uniform mat4 modelMatrix;

uniform float u_Bulge;
uniform vec4 u_time;

void main() {
  vec4 vertex = a_position;
  
  // Inflate the tube outward using radius from texcoord.z
  // Reduced from Unity's 2.25 for better proportions
  float radius = a_texcoord0.z;
  vertex.xyz += a_normal * 1.5 * radius;
  
  vec4 worldPos = modelMatrix * vertex;
  
  gl_Position = projectionMatrix * modelViewMatrix * vertex;
  f_fog_coord = gl_Position.z;
  // Transform normal and tangent to view space
  vec3 normal = normalize(normalMatrix * a_normal);
  vec3 tangent = normalize(normalMatrix * a_tangent.xyz);
  
  // Compute bitangent using cross product and handedness
  vec3 bitangent = cross(normal, tangent) * a_tangent.w;
  
  v_normal = normal;
  v_tangent = tangent;
  v_bitangent = bitangent;
  v_position = (modelViewMatrix * vertex).xyz;
  v_light_dir_0 = mat3(u_SceneLight_0_matrix) * vec3(0, 0, 1);
  v_light_dir_1 = mat3(u_SceneLight_1_matrix) * vec3(0, 0, 1);
  v_color = a_color;
  v_texcoord0 = a_texcoord0.xy;
  v_worldPos = worldPos;
}
