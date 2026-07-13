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
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 u_time;
uniform float u_ScrollRate;
uniform vec4 u_ScrollDistance;
uniform float u_ScrollJitterIntensity;
uniform float u_ScrollJitterFrequency;
uniform float u_SpreadRate;

const float kRecipSquareRootOfTwo = 0.70710678;

vec2 rotatedCorner(float vertexId, float rotation, float halfSize) {
  float corner = mod(vertexId, 4.0);
  float upSign = (corner == 0.0 || corner == 1.0) ? -1.0 : 1.0;
  float rightSign = (corner == 1.0 || corner == 3.0) ? 1.0 : -1.0;
  float sine = sin(rotation);
  float cosine = cos(rotation);
  return mat2(cosine, sine, -sine, cosine) *
    vec2(rightSign, upSign) * halfSize;
}

void main() {
  float birthTime = a_texcoord0.w;
  float halfSize = length(a_position.xyz - a_normal) * kRecipSquareRootOfTwo;
  if (birthTime < 0.0) {
    float life01 = clamp((u_time.y + birthTime) / 0.2, 0.0, 1.0);
    halfSize *= 1.0 - life01 * life01;
  }

  float age = max(0.0, abs(u_time.y) - abs(birthTime));
  float spreadProgress = 1.0 - exp(-u_SpreadRate * age);
  vec3 center = mix(a_texcoord1.xyz, a_normal, spreadProgress);
  float seed = a_color.a;
  float t01 = mod(u_time.y * u_ScrollRate + seed * 10.0, 1.0);
  float t2 = u_time.y / 3.0;
  vec3 displacement = u_ScrollDistance.xyz * t01;
  displacement.x += sin(
    t01 * u_ScrollJitterFrequency + seed * 10.0 + t2 + center.z
  ) * u_ScrollJitterIntensity;
  displacement.y += (mod(seed * 100.0, 1.0) - 0.5) *
    u_ScrollDistance.y * t01;
  displacement.z += cos(
    t01 * u_ScrollJitterFrequency + seed * 7.0 + t2 + center.x
  ) * u_ScrollJitterIntensity;

  vec4 worldCenter = modelMatrix * vec4(center, 1.0);
  worldCenter.xyz += spreadProgress * displacement;
  vec4 viewCenter = viewMatrix * worldCenter;
  float worldScale = length(modelMatrix[0].xyz);
  vec2 cornerOffset = rotatedCorner(
    float(gl_VertexID), a_texcoord0.z, halfSize * worldScale
  );
  viewCenter.xy += cornerOffset;
  gl_Position = projectionMatrix * viewCenter;

  v_color = a_color;
  v_color.rgb *= (1.0 - t01) * 5.0;
  v_texcoord0 = a_texcoord0.xy;
}
