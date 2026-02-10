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
in vec4 a_color;
in vec2 a_texcoord0;
in vec4 a_texcoord1;

out vec4 v_color;
out vec2 v_texcoord0;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 u_time;

vec3 hash3(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
           dot(p, vec3(269.5, 183.3, 246.1)),
           dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453123);
}

float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float n000 = dot(hash3(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0));
  float n100 = dot(hash3(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0));
  float n010 = dot(hash3(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0));
  float n110 = dot(hash3(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0));
  float n001 = dot(hash3(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0));
  float n101 = dot(hash3(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0));
  float n011 = dot(hash3(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0));
  float n111 = dot(hash3(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0));

  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);
  float nxy0 = mix(nx00, nx10, f.y);
  float nxy1 = mix(nx01, nx11, f.y);
  return mix(nxy0, nxy1, f.z);
}

float curlX(vec3 p, float d) {
  float y1 = noise3(p + vec3(0.0, d, 0.0));
  float y2 = noise3(p - vec3(0.0, d, 0.0));
  float z1 = noise3(p + vec3(0.0, 0.0, d));
  float z2 = noise3(p - vec3(0.0, 0.0, d));
  return (y1 - y2 - (z1 - z2)) / (2.0 * d);
}

float curlY(vec3 p, float d) {
  float z1 = noise3(p + vec3(0.0, 0.0, d));
  float z2 = noise3(p - vec3(0.0, 0.0, d));
  float x1 = noise3(p + vec3(d, 0.0, 0.0));
  float x2 = noise3(p - vec3(d, 0.0, 0.0));
  return (z1 - z2 - (x1 - x2)) / (2.0 * d);
}

float curlZ(vec3 p, float d) {
  float x1 = noise3(p + vec3(d, 0.0, 0.0));
  float x2 = noise3(p - vec3(d, 0.0, 0.0));
  float y1 = noise3(p + vec3(0.0, d, 0.0));
  float y2 = noise3(p - vec3(0.0, d, 0.0));
  return (x1 - x2 - (y1 - y2)) / (2.0 * d);
}

void main() {
  vec4 worldPos = modelMatrix * a_position;

  vec3 perVertOffset = a_texcoord1.xyz;
  float lifetime = u_time.y - a_texcoord1.w;
  float release = clamp(lifetime * 0.1, 0.0, 1.0);

  vec3 localMidpointPos = a_position.xyz - perVertOffset;
  vec4 worldMidpointPos = modelMatrix * vec4(localMidpointPos, 1.0);

  float t = lifetime;
  float d = 10.0 + a_color.g * 3.0;
  float freq = 1.5 + a_color.r;
  vec3 p = worldMidpointPos.xyz * freq + vec3(t);

  vec3 disp = vec3(curlX(p, d), curlY(p, d), curlZ(p, d));
  worldMidpointPos.xyz += release * disp * 10.0;

  vec3 perVertOffsetWS = (modelMatrix * vec4(perVertOffset, 0.0)).xyz;
  worldPos.xyz = worldMidpointPos.xyz + perVertOffsetWS;

  gl_Position = projectionMatrix * viewMatrix * worldPos;
  v_color = a_color;
  v_texcoord0 = a_texcoord0;
}
