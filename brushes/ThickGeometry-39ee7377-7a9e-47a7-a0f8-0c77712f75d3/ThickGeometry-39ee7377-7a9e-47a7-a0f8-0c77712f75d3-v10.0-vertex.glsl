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

// DefaultVS.glsl
in vec4 a_position;
in vec3 a_normal;
in vec4 a_color;
in vec2 a_texcoord0;
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

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform mat4 u_SceneLight_0_matrix;
uniform mat4 u_SceneLight_1_matrix;
uniform vec4 u_MainTex_ST; // xy: tiling, zw: offset

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * a_position;
    f_fog_coord = gl_Position.z;
    // Transform normal and tangent to view space
    vec3 normal = normalize(normalMatrix * a_normal);
    vec3 tangent = normalize(normalMatrix * a_tangent.xyz);

    // Compute bitangent using cross product and handedness
    vec3 bitangent = cross(normal, tangent) * a_tangent.w;

    v_normal = normal;
    v_tangent = tangent;
    v_bitangent = bitangent;
    v_position = (modelViewMatrix * a_position).xyz;
    v_light_dir_0 = mat3(u_SceneLight_0_matrix) * vec3(0, 0, 1);
    v_light_dir_1 = mat3(u_SceneLight_1_matrix) * vec3(0, 0, 1);
    v_color = a_color;
    v_texcoord0 = a_texcoord0 * u_MainTex_ST.xy + u_MainTex_ST.zw;
}
