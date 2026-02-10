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

in vec4 a_position;
in vec3 a_normal;
in vec4 a_color;
in vec4 a_texcoord0;
in vec4 a_texcoord1;

out vec4 v_color;
out vec3 v_normal;  // Camera-space normal.
out vec3 v_position;  // Camera-space position.
out vec2 v_texcoord0;
out vec3 v_light_dir_0;  // Camera-space light direction, main light.
out vec3 v_light_dir_1;  // Camera-space light direction, other light.

uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform mat4 u_SceneLight_0_matrix;
uniform mat4 u_SceneLight_1_matrix;

uniform vec4 u_time;
uniform float u_ScrollRate;
uniform float u_ScrollJitterIntensity;
uniform float u_ScrollJitterFrequency;

// -------------------------------------------------------------------------
// Particle utilities (from Particles.cginc)
// -------------------------------------------------------------------------

const float kRecipSquareRootOfTwo = 0.70710678;

vec3 recreateCorner(vec3 center, float corner, float rotation, float size) {
  float c = cos(rotation);
  float s = sin(rotation);

  vec3 up = vec3(s, c, 0);
  vec3 right = vec3(c, -s, 0);

  float fUp = float(corner == 0. || corner == 1.) * 2.0 - 1.0;
  float fRight = float(corner == 0. || corner == 2.) * 2.0 - 1.0;

  center = (modelViewMatrix * vec4(center, 1.0)).xyz;
  center += fRight * right * size;
  center += fUp * up * size;
  return (inverse(modelViewMatrix) * vec4(center, 1.0)).xyz;
}

vec4 OrientParticle(vec3 center, float halfSize, float vertexId, float rotation) {
  float corner = mod(vertexId, 4.0);
  float scale = modelMatrix[1][1];
  vec3 newCorner = recreateCorner(center, corner, rotation, halfSize * scale);
  return vec4(newCorner, 1.0);
}

// -------------------------------------------------------------------------
// Simplex noise (from Noise.cginc, ported to GLSL)
// -------------------------------------------------------------------------

vec3 mod289_v3(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289_v2(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute_v3(vec3 x) {
  return mod289_v3(((x * 34.0) + 1.0) * x);
}

float snoise2D(vec2 v) {
  const vec4 C = vec4(0.211324865405187,   // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,   // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,   // -1.0 + 2.0 * C.x
                      0.024390243902439);  // 1.0 / 41.0

  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289_v2(i);
  vec3 p = permute_v3(permute_v3(i.y + vec3(0.0, i1.y, 1.0))
                                + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 snoise3D(vec3 v) {
  return vec3(
    snoise2D(vec2(v.x, v.y)),
    snoise2D(vec2(v.y, v.z)),
    snoise2D(vec2(v.z, v.x))
  );
}

// -------------------------------------------------------------------------
// Curl noise (from Noise.cginc)
// -------------------------------------------------------------------------

float curlX(vec3 v, float d) {
  return (
    (snoise3D(vec3(v.x, v.y + d, v.z)).z - snoise3D(vec3(v.x, v.y - d, v.z)).z)
   -(snoise3D(vec3(v.x, v.y, v.z + d)).y - snoise3D(vec3(v.x, v.y, v.z - d)).y)
  ) / 2.0 / d;
}

float curlY(vec3 v, float d) {
  return (
    (snoise3D(vec3(v.x, v.y, v.z + d)).x - snoise3D(vec3(v.x, v.y, v.z - d)).x)
   -(snoise3D(vec3(v.x + d, v.y, v.z)).z - snoise3D(vec3(v.x - d, v.y, v.z)).z)
  ) / 2.0 / d;
}

float curlZ(vec3 v, float d) {
  return (
    (snoise3D(vec3(v.x + d, v.y, v.z)).y - snoise3D(vec3(v.x - d, v.y, v.z)).y)
   -(snoise3D(vec3(v.x, v.y + d, v.z)).x - snoise3D(vec3(v.x, v.y - d, v.z)).x)
  ) / 2.0 / d;
}

// -------------------------------------------------------------------------
// Bubble displacement (from Bubbles.shader computeDisplacement)
// -------------------------------------------------------------------------

// Seed is expected in decimeter-scale coordinates (matching Unity).
// Web geometry is in meters, so the caller must scale the seed by 10.
// Output is in decimeters; the caller must scale by 0.1 to get meters.
vec3 computeDisplacement(vec3 seed, float timeOffset) {
  // Jitter
  float t = u_time.y * u_ScrollRate + timeOffset;
  vec3 jitter;
  jitter.x = sin(t       + u_time.y + seed.z * u_ScrollJitterFrequency);
  jitter.z = cos(t       + u_time.y + seed.x * u_ScrollJitterFrequency);
  jitter.y = cos(t * 1.2 + u_time.y + seed.x * u_ScrollJitterFrequency);
  jitter *= u_ScrollJitterIntensity;

  // Curl noise
  vec3 v = (seed + jitter) * 0.1 + u_time.x * 5.0;
  float d = 30.0;
  vec3 curl = vec3(curlX(v, d), curlY(v, d), curlZ(v, d)) * 10.0;

  return jitter + curl;
}

// -------------------------------------------------------------------------
// Main
// -------------------------------------------------------------------------

void main() {
  // Get particle half size from corner/center distance
  float halfSize = length(a_position.xyz - a_normal) * kRecipSquareRootOfTwo;
  float rotation = a_texcoord0.z;

  // Center is stored in a_normal (particle center)
  vec3 center = a_normal;

  // Orient particle to face camera (in object space)
  vec4 pos = OrientParticle(center, halfSize, float(gl_VertexID), rotation);

  // Transform to world space, then add displacement directly
  // (matches Snow/Embers web pattern: displacement added in world space)
  vec3 worldPos = (modelMatrix * pos).xyz;
  vec3 worldCenter = (modelMatrix * vec4(center, 1.0)).xyz;

  // Scale seed to decimeters (Unity units) for correct noise sampling,
  // then scale result back to meters (web units).
  // Unity geometry is in decimeters; exported GLTF geometry is in meters (10x smaller).
  vec3 seedDecimeters = worldCenter * 10.0;
  vec3 displacement = computeDisplacement(seedDecimeters, 1.0) * 0.1;
  worldPos += displacement;

  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
  v_normal = normalize(normalMatrix * a_normal);
  v_position = (viewMatrix * vec4(worldPos, 1.0)).xyz;
  v_light_dir_0 = mat3(u_SceneLight_0_matrix) * vec3(0, 0, 1);
  v_light_dir_1 = mat3(u_SceneLight_1_matrix) * vec3(0, 0, 1);
  v_color = a_color;
  // Brighten up the bubbles (matches Unity: o.color.a = 1)
  v_color.a = 1.0;
  v_texcoord0 = a_texcoord0.xy;
}
