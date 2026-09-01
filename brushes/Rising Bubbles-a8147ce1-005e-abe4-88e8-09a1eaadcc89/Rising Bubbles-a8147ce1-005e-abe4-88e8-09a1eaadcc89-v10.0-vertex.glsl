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

in vec4 a_position;
in vec3 a_normal;
in vec4 a_color;
in vec4 a_texcoord0;
in vec4 a_texcoord1;

out vec4 v_color;
out vec2 v_texcoord0;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 u_time;
uniform float u_ScrollRate;
uniform vec3 u_ScrollDistance;
uniform float u_ScrollJitterIntensity;
uniform float u_ScrollJitterFrequency;
uniform float u_SpreadRate;
uniform float u_GeniusParticlePreviewLifetime;
uniform bool u_isTiltInput;

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
  float fUp = float(corner == 2.0 || corner == 3.0) * 2.0 - 1.0;
  float fRight = float(corner == 1.0 || corner == 3.0) * 2.0 - 1.0;
  vec2 rotatedPosition = vec2(
    c * fRight - s * fUp,
    s * fRight + c * fUp
  ) * size;
  return center + right * rotatedPosition.x + up * rotatedPosition.y;
}

vec4 PositionParticle(
  float vertexId,
  vec4 vertexPos,
  vec3 sizeCenter,
  vec3 center,
  float rotation,
  float birthTime
) {
  float corner = mod(vertexId, 4.0);
  float size = GetParticleHalfSize(vertexPos.xyz, sizeCenter, birthTime);
  float scale = modelMatrix[1][1];
  return vec4(recreateCorner(center, corner, rotation, size * scale), 1.0);
}

void main() {
  float seed = a_color.a;
  float t01 = mod(u_time.y * u_ScrollRate + seed * 10.0, 1.0);
  float birthTime = a_texcoord0.w;
  float spreadProgress = u_isTiltInput ? SpreadProgress(birthTime) : 1.0;
  vec3 center = u_isTiltInput
    ? mix(a_texcoord1.xyz, a_normal, spreadProgress)
    : a_normal;
  vec4 pos = PositionParticle(
    float(gl_VertexID), a_position, a_normal, center, a_texcoord0.z, birthTime
  );

  vec3 worldPos = (modelMatrix * pos).xyz;
  float t2 = u_time.y / 3.0;
  if (u_isTiltInput) {
    // Live geometry is already in renderer meters. Recreate Open Brush's
    // decimeter-space displacement and convert the result back to meters.
    vec3 unityCenter = vec3(center.x, center.y, -center.z) * 10.0;
    vec3 displacement = u_ScrollDistance * t01;
    displacement.x += sin(
      t01 * u_ScrollJitterFrequency + seed * 10.0 + t2 + unityCenter.z
    ) * u_ScrollJitterIntensity;
    displacement.y +=
      (mod(seed * 100.0, 1.0) - 0.5) * u_ScrollDistance.y * t01;
    displacement.z += cos(
      t01 * u_ScrollJitterFrequency + seed * 7.0 + t2 + unityCenter.x
    ) * u_ScrollJitterIntensity;
    worldPos += spreadProgress * 0.1 * vec3(
      displacement.x, displacement.y, -displacement.z
    );
  } else {
    vec3 displacement = u_ScrollDistance * t01;
    displacement.x += sin(
      t01 * u_ScrollJitterFrequency + seed * 10.0 + t2 + center.z
    ) * u_ScrollJitterIntensity;
    displacement.y +=
      (mod(seed * 100.0, 1.0) - 0.5) * u_ScrollDistance.y * t01;
    displacement.z += cos(
      t01 * u_ScrollJitterFrequency + seed * 7.0 + t2 + center.x
    ) * u_ScrollJitterIntensity;
    worldPos += (modelMatrix * vec4(displacement, 0.0)).xyz;
  }

  v_color = a_color;
  v_color.rgb *= (1.0 - t01) * 5.0;
  v_texcoord0 = a_texcoord0.xy;
  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}
