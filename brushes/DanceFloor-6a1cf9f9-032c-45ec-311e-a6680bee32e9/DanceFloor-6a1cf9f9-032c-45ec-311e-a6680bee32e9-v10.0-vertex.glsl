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

// DanceFloor vertex shader with quantization and lifetime animation
in vec4 a_position;
in vec3 a_normal;
in vec4 a_color;
in vec2 a_texcoord0;
in vec4 a_tangent;
in vec4 a_texcoord1;
in float a_timestamp;

out vec4 v_color;
out vec3 v_normal;
out vec3 v_tangent;  // Camera-space tangent.
out vec3 v_bitangent;  // Camera-space bitangent.
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
uniform vec4 u_time;

void  main() {
  vec4 worldPos = a_position;
  
  // Create per-quad variation using hash of quad index
  int quadIndex = gl_VertexID / 4;
  float hash = fract(sin(float(quadIndex) * 12.9898) * 43758.5453);
  float fakeCreationTime = a_timestamp + hash * 2.0;  // Add 0-2 second offset per quad
  float lifetime = u_time.y - fakeCreationTime;
  
  // Add vertex displacement along normals (Unity: worldPos.xyz += v.normal * pow(fmod(lifetime,1),3) * .1)
  worldPos.xyz += a_normal * pow(mod(lifetime, 1.0), 3.0) * 0.1;
  
  gl_Position = projectionMatrix * modelViewMatrix * worldPos;
  f_fog_coord = gl_Position.z;
  // Transform normal and tangent to view space
  vec3 normal = normalize(normalMatrix * a_normal);
  vec3 tangent = normalize(normalMatrix * a_tangent.xyz);
  
  // Compute bitangent using cross product and handedness
  vec3 bitangent = cross(normal, tangent) * a_tangent.w;
  
  v_normal = normal;
  v_tangent = tangent;
  v_bitangent = bitangent;
  v_position = (modelViewMatrix * worldPos).xyz;
  v_light_dir_0 = mat3(u_SceneLight_0_matrix) * vec3(0, 0, 1);
  v_light_dir_1 = mat3(u_SceneLight_1_matrix) * vec3(0, 0, 1);
  
  // Color animation (Unity: v.color.xyz = pow(fmod(lifetime,1),3) * v.color.xyz)
  vec4 animatedColor = a_color;
  animatedColor.xyz = pow(mod(lifetime, 1.0), 3.0) * a_color.xyz;
  
  // Additional Unity color processing: o.color = 2 * v.color + v.color.yzxw * _BeatOutput.x
  // Skip the _BeatOutput part (audio reactive), but apply the 2x multiplier
  v_color = 2.0 * animatedColor;
  
  v_texcoord0 = a_texcoord0;
}
