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

// Default shader for GlTF web preview.
//
// This shader is used as a fall-back when a brush-specific shader is
// unavailable.

in vec4 a_position;
in vec3 a_normal;
in vec4 a_color;
in vec2 a_texcoord0;
in vec4 a_tangent;
in vec4 a_texcoord1;

out vec4 v_color;
out vec3 v_normal;  // Camera-space normal.
out vec3 v_tangent;  // Camera-space tangent.
out vec3 v_bitangent;  // Camera-space bitangent.
out vec3 v_position;  // Camera-space position.
out vec2 v_texcoord0;
out vec3 v_light_dir_0;  // Camera-space light direction, main light.
out vec3 v_light_dir_1;  // Camera-space light direction, other light.

uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform mat4 u_SceneLight_0_matrix;
uniform mat4 u_SceneLight_1_matrix;
uniform bool u_isNewTiltExporter;

uniform vec4 u_time;

void main() {
  vec4 worldPos = modelMatrix * a_position;
  float size = length(a_texcoord1.xyz);
  float lifetime = u_time.y - a_texcoord1.w;
  float release = clamp(lifetime, 0.0, 1.0);

	if (!u_isNewTiltExporter) {
	  // Match Unity's finer grid at birth, relaxing to the particle-size grid.
	  float q = (1. / size) * .5;
	  q += 5.0 * clamp(1.0 - release * 10.0, 0.0, 1.0);
	  worldPos.xyz = ceil(worldPos.xyz * q) / q;
	}

  gl_Position = projectionMatrix * viewMatrix * worldPos;
  // Transform normal and tangent to view space
  vec3 normal = normalize(normalMatrix * a_normal);
  vec3 tangent = normalize(normalMatrix * a_tangent.xyz);
  
  // Compute bitangent using cross product and handedness
  vec3 bitangent = cross(normal, tangent) * a_tangent.w;
  
  v_normal = normal;
  v_tangent = tangent;
  v_bitangent = bitangent;
  v_position = gl_Position.xyz;
  v_light_dir_0 = u_SceneLight_0_matrix[2].xyz;
  v_light_dir_1 = u_SceneLight_1_matrix[2].xyz;
  v_color = 2. * a_color;
  v_texcoord0 = a_texcoord0;
}
