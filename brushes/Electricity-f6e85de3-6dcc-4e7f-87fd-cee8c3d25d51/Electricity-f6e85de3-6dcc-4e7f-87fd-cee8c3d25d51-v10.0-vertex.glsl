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
in vec3 a_texcoord1;
in vec2 a_texcoord2;

out vec4 v_color;
out vec3 v_normal;  // Camera-space normal.
out vec3 v_tangent;  // Camera-space tangent.
out vec3 v_bitangent;  // Camera-space bitangent.
out vec3 v_position;  // Camera-space position.
out vec2 v_texcoord0;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform bool u_isNewTiltExporter;

uniform vec4 u_time;
uniform float u_ScrollRate;
uniform vec3 u_ScrollDistance;
uniform float u_ScrollJitterIntensity;
uniform float u_ScrollJitterFrequency;
uniform float u_DisplacementIntensity;

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m *= m;
  m *= m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 snoise3D(vec3 v) {
  return vec3(
    snoise(vec2(v.x, v.y)),
    snoise(vec2(v.y, v.z)),
    snoise(vec2(v.z, v.x))
  );
}

float curlX(vec3 v, float d) {
  return (
    (snoise3D(vec3(v.x, v.y + d, v.z)).z - snoise3D(vec3(v.x, v.y - d, v.z)).z) -
    (snoise3D(vec3(v.x, v.y, v.z + d)).y - snoise3D(vec3(v.x, v.y, v.z - d)).y)
  ) / (2.0 * d);
}

float curlY(vec3 v, float d) {
  return (
    (snoise3D(vec3(v.x, v.y, v.z + d)).x - snoise3D(vec3(v.x, v.y, v.z - d)).x) -
    (snoise3D(vec3(v.x + d, v.y, v.z)).z - snoise3D(vec3(v.x - d, v.y, v.z)).z)
  ) / (2.0 * d);
}

float curlZ(vec3 v, float d) {
  return (
    (snoise3D(vec3(v.x + d, v.y, v.z)).y - snoise3D(vec3(v.x - d, v.y, v.z)).y) -
    (snoise3D(vec3(v.x, v.y + d, v.z)).x - snoise3D(vec3(v.x, v.y - d, v.z)).x)
  ) / (2.0 * d);
}

vec3 displacement(vec3 pos, float mod, float time) {
  float d = 30.0;
  float freq = 0.1 + mod;
  vec3 disp = vec3(1.0, 0.0, 0.0) * curlX(pos * freq + time, d);
  disp += vec3(0.0, 1.0, 0.0) * curlY(pos * freq + time, d);
  disp += vec3(0.0, 0.0, 1.0) * curlZ(pos * freq + time, d);

  time *= 1.777;
  d = 100.0;
  freq = 0.2 + mod;
  vec3 disp2 = vec3(1.0, 0.0, 0.0) * curlX(pos * freq + time, d);
  disp2 += vec3(0.0, 1.0, 0.0) * curlY(pos * freq + time, d);
  disp2 += vec3(0.0, 0.0, 1.0) * curlZ(pos * freq + time, d);

  return disp * 3.0 + disp2 * 7.0;
}

void main() {
  float envelope = sin(a_texcoord0.x * 3.14159);
  float envelopePow = 1.0 - pow(1.0 - envelope, 10.0);
  float mod = 1.0;
  float time = u_time.w;
  vec3 worldPos = (modelMatrix * a_position).xyz;

  if (!u_isNewTiltExporter) {
    vec3 offsetFromMiddleToEdge_CS = a_texcoord1.xyz;
    float widthiness_CS = length(offsetFromMiddleToEdge_CS) / 0.02;
    vec3 midpointPos_CS = a_position.xyz - offsetFromMiddleToEdge_CS;

    worldPos = midpointPos_CS + offsetFromMiddleToEdge_CS * envelopePow;
    worldPos = vec4(modelMatrix * vec4(worldPos, 1.0)).xyz;

    if (widthiness_CS > 0.0) {
      vec3 dispVec = displacement(midpointPos_CS / widthiness_CS, mod, time);
      worldPos += widthiness_CS * dispVec * u_DisplacementIntensity * envelopePow;
    }
  } else {
    vec3 midpointPos_CS = vec3(a_texcoord1.xy, a_texcoord2.x);
    float widthiness_CS = a_texcoord2.y;

    if (widthiness_CS > 0.0) {
      vec3 currentDispVec = displacement(midpointPos_CS / widthiness_CS, mod, time);
      vec3 bakedDispVec = displacement(midpointPos_CS / widthiness_CS, mod, 0.0);
      worldPos += widthiness_CS * (currentDispVec - bakedDispVec) * u_DisplacementIntensity * envelopePow;
    }
  }

  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
  v_position = (viewMatrix * vec4(worldPos, 1.0)).xyz;
  v_color = a_color;
  v_color += v_color * (1.0 - envelopePow);
  v_texcoord0 = a_texcoord0;

  vec3 normal = normalize(normalMatrix * a_normal);
  vec3 tangent = normalize(normalMatrix * a_tangent.xyz);
  vec3 bitangent = cross(normal, tangent) * a_tangent.w;

  v_normal = normal;
  v_tangent = tangent;
  v_bitangent = bitangent;
}
