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
in vec4 a_texcoord0;
in vec4 a_texcoord1;
in vec4 a_tangent;

out vec4 v_color;
out vec3 v_normal;  // Camera-space normal.
out vec3 v_tangent;  // Camera-space tangent.
out vec3 v_bitangent;  // Camera-space bitangent.
out vec3 v_position;  // Camera-space position.
out vec2 v_texcoord0;
out vec4 v_texcoord1;

uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform vec4 u_time;
uniform float u_ScrollRate;
uniform vec3 u_ScrollDistance;
uniform float u_ScrollJitterIntensity;
uniform float u_ScrollJitterFrequency;
uniform float u_SpreadRate;
uniform float u_GeniusParticlePreviewLifetime;
uniform bool u_isTiltInput;

vec4 _Time;

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

const float kRecipSquareRootOfTwo = 0.70710678;

float GetParticleSizeAdjust(float birthTime) {
  if (birthTime < 0.0) {
    float life01 = clamp(
      (u_time.y - abs(birthTime)) / u_GeniusParticlePreviewLifetime,
      0.0,
      1.0
    );
    return 1.0 - life01 * life01;
  }
  return 1.0;
}

float GetParticleHalfSize(vec3 corner, vec3 center, float birthTime) {
  float adjust = u_isTiltInput ? GetParticleSizeAdjust(birthTime) : 1.0;
  return length(corner - center) * kRecipSquareRootOfTwo * adjust;
}

float SpreadProgress(float birthTime) {
  float age = max(0.0, abs(u_time.y) - abs(birthTime));
  return 1.0 - exp(-u_SpreadRate * age);
}

// Given a centerpoint, up and right vectors, the particle rotation and vertex index,
// This will create the appropriate position of a quad that faces the camera.
vec3 recreateCorner(vec3 center, float corner, float rotation, float size) {
  float c = cos(rotation);
  float s = sin(rotation);

  if (!u_isTiltInput) {
    vec3 up = vec3(s, c, 0.0);
    vec3 right = vec3(c, -s, 0.0);
    float fUp = float(corner == 0.0 || corner == 1.0) * 2.0 - 1.0;
    float fRight = float(corner == 0.0 || corner == 2.0) * 2.0 - 1.0;
    center = (modelViewMatrix * vec4(center, 1.0)).xyz;
    center += fRight * right * size;
    center += fUp * up * size;
    return (inverse(modelViewMatrix) * vec4(center, 1.0)).xyz;
  }

  mat4 cameraToObject = inverse(modelViewMatrix);
  vec3 upIsh = (cameraToObject * vec4(0.0, 1.0, 0.0, 0.0)).xyz;
  vec3 cameraPosition = (cameraToObject * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  vec3 forward = center - cameraPosition;
  vec3 right = normalize(cross(upIsh, forward));
  vec3 up = normalize(cross(forward, right));

  // Corner diagram:
  //
  //   2 . . . 3
  //   .   |   .
  //   . - c - < --- center
  //   .   |   .
  //   0 . . . 1
  //
  // The top corners are corners 2 & 3
  float fUp = float(corner == 2.0 || corner == 3.0) * 2.0 - 1.0;

  // The corners to the right are corners 1 & 3
  float fRight = float(corner == 1.0 || corner == 3.0) * 2.0 - 1.0;

  vec2 rotatedPosition = vec2(
    c * fRight - s * fUp,
    s * fRight + c * fUp
  ) * size;
  return center + right * rotatedPosition.x + up * rotatedPosition.y;
}

// Adjusts the vertex of a quad to make a camera-facing quad. Also optionally scales the particle if
// the particle is in the preview brush.
vec4 PositionParticle(
	float vertexId,
	vec4 vertexPos,
	vec3 sizeCenter,
	vec3 center,
	float rotation,
	float birthTime) {

	float corner = mod(vertexId, 4.0);
	float size = GetParticleHalfSize(vertexPos.xyz, sizeCenter, birthTime);

	// Gets the scale from the model matrix
	float scale = modelMatrix[1][1];
	vec3 newCorner = recreateCorner(center, corner, rotation, size * scale);

	return vec4(newCorner.x, newCorner.y, newCorner.z, 1);
}

// Returns the particle position for this vertex, untransformed, in local/object space.
void main() {
  float birthTime = a_texcoord0.w;
  float spreadProgress = u_isTiltInput ? SpreadProgress(birthTime) : 1.0;
  vec3 center = u_isTiltInput ? mix(a_texcoord1.xyz, a_normal, spreadProgress) : a_normal;
  vec4 pos = PositionParticle(
    float(gl_VertexID), a_position, a_normal, center, a_texcoord0.z, birthTime
  );

  _Time = u_time;
  // Transform normal and tangent to view space
  vec3 normal = normalize(normalMatrix * a_normal);
  vec3 tangent = normalize(normalMatrix * a_tangent.xyz);
  
  // Compute bitangent using cross product and handedness
  vec3 bitangent = cross(normal, tangent) * a_tangent.w;
  
  v_normal = normal;
  v_tangent = tangent;
  v_bitangent = bitangent;
  v_color = a_color;
  v_texcoord0 = a_texcoord0.xy;
  v_texcoord1 = a_texcoord1;

  float scrollAmount = _Time.y;
  float t = mod(scrollAmount * u_ScrollRate + a_color.a, 1.0);

  vec3 scrollDistance = u_isTiltInput
    ? vec3(-u_ScrollDistance.x, u_ScrollDistance.y, -u_ScrollDistance.z) * 10.0
    : u_ScrollDistance;
  float jitterIntensity = u_isTiltInput
    ? u_ScrollJitterIntensity * 10.0
    : u_ScrollJitterIntensity;
  vec4 dispVec = (t - .5) * vec4(scrollDistance, 0.0);

  dispVec.x += sin(t * u_ScrollJitterFrequency + _Time.y) * jitterIntensity;
  dispVec.z += cos(t * u_ScrollJitterFrequency * .5 + _Time.y) * jitterIntensity;
  if (u_isTiltInput) {
    dispVec.z = -dispVec.z;
  }

  vec3 worldPos = (modelMatrix * pos).xyz;
  float displacementScale = u_isTiltInput ? spreadProgress * 0.1 : 1.0;
  worldPos.xyz += displacementScale * dispVec.xyz;

  v_color.a = pow(1.0 - abs(2.0*(t - .5)), 3.0);

  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos.x, worldPos.y, worldPos.z,1.0);
  v_position = (modelViewMatrix * pos).xyz;
}
