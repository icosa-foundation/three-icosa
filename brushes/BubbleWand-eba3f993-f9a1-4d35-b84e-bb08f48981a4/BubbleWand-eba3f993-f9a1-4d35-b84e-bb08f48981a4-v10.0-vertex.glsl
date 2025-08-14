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

// BubbleWand vertex shader with displacement and bulge effects

precision mediump float;

in vec4 a_position;
in vec3 a_normal;
in vec4 a_color;
in vec3 a_texcoord0;

out vec4 v_color;
out vec3 v_normal;  // Camera-space normal.
out vec3 v_position;  // Camera-space position.
out vec2 v_texcoord0;
out vec3 v_light_dir_0;  // Camera-space light direction, main light.
out vec3 v_light_dir_1;  // Camera-space light direction, other light.
out float f_fog_coord;
out vec3 v_viewDir;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform mat4 u_SceneLight_0_matrix;
uniform mat4 u_SceneLight_1_matrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

uniform vec4 u_time;
uniform float u_ScrollRate;
uniform float u_ScrollJitterIntensity;
uniform float u_ScrollJitterFrequency;

// Noise functions from Noise.cginc
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

float permute(float x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 snoise3D(vec3 v){
  vec3 n = vec3(
    snoise(vec2(v.x, v.y)),
    snoise(vec2(v.y, v.z)),
    snoise(vec2(v.z, v.x))
  );
  return n;
}

float curlX(vec3 v, float d){
  return (
          (snoise3D(vec3(v.x,v.y+d,v.z)).z - snoise3D(vec3(v.x,v.y-d,v.z)).z)
-(snoise3D(vec3(v.x,v.y,v.z+d)).y - snoise3D(vec3(v.x,v.y,v.z-d)).y)
    ) /2.0/d;
}

float curlY(vec3 v, float d){
  return (
          (snoise3D(vec3(v.x,v.y,v.z+d)).x - snoise3D(vec3(v.x,v.y,v.z-d)).x)
-(snoise3D(vec3(v.x+d,v.y,v.z)).z - snoise3D(vec3(v.x-d,v.y,v.z)).z)
    ) /2.0/d;
}

float curlZ(vec3 v, float d){
  return (
          (snoise3D(vec3(v.x+d,v.y,v.z)).y - snoise3D(vec3(v.x-d,v.y,v.z)).y)
-(snoise3D(vec3(v.x,v.y+d,v.z)).x - snoise3D(vec3(v.x,v.y-d,v.z)).x)
    ) /2.0/d;
}

vec4 displace(vec4 pos, float timeOffset) {
  float t = u_time.y * u_ScrollRate + timeOffset;

  pos.x += sin(t + u_time.y + pos.z * u_ScrollJitterFrequency) * u_ScrollJitterIntensity;
  pos.z += cos(t + u_time.y + pos.x * u_ScrollJitterFrequency) * u_ScrollJitterIntensity;
  pos.y += cos(t * 1.2 + u_time.y + pos.x * u_ScrollJitterFrequency) * u_ScrollJitterIntensity;

  float time = u_time.x;
  float d = 30.0;
  float freq = 0.1;
  vec3 disp = vec3(1,0,0) * curlX(pos.xyz * freq + time, d);
  disp += vec3(0,1,0) * curlY(pos.xyz * freq + time, d);
  disp += vec3(0,0,1) * curlZ(pos.xyz * freq + time, d);
  pos.xyz = u_ScrollJitterIntensity * disp * 0.05; // Reduced noise scale
  return pos;
}

void main() {
  vec4 vertex = a_position;
  vec3 normal = a_normal;
  
  float radius = a_texcoord0.z;

  // Bulge displacement - increased scale for better visibility
  float wave = sin(a_texcoord0.x * 3.14159);
  vec3 wave_displacement = radius * normal * wave * 2.0; // Scale up the bulge
  vertex.xyz += wave_displacement;
  
  // Noise displacement
  vec4 displacement = displace(vertex, 0.0);
  vertex.xyz += displacement.xyz;

  // Perturb normal
  normal = normalize(normal + displacement.xyz * 2.5 + wave_displacement * 2.5);

  gl_Position = projectionMatrix * modelViewMatrix * vertex;
  f_fog_coord = gl_Position.z;
  v_normal = normalMatrix * normal;
  v_position = (modelViewMatrix * vertex).xyz;
  v_light_dir_0 = mat3(u_SceneLight_0_matrix) * vec3(0, 0, 1);
  v_light_dir_1 = mat3(u_SceneLight_1_matrix) * vec3(0, 0, 1);
  v_color = a_color;
  v_texcoord0 = a_texcoord0.xy;
  v_viewDir = normalize(v_position);
}
