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

// Fairy brush - procedural animated particle dots
// Ported from Unity Fairy.shader

precision mediump float;

out vec4 fragColor;

uniform float u_EmissionGain;
uniform float u_Dissolve;
uniform vec4 u_time;

in vec4 v_color;
in vec2 v_texcoord0;

// Random functions for procedural generation
float random(vec2 p) {
  const vec2 r = vec2(23.14079263, 2.7651234);
  return fract(cos(mod(123432189.0, 1e-7 + 256.0 * dot(p, r))));
}

vec2 random2(vec2 p) {
  return vec2(random(p), random(p + vec2(1.0)));
}

// Simple bloom color approximation (replaces Unity's bloomColor function)
vec3 bloomColor(vec3 color, float intensity) {
  return color * (1.0 + intensity);
}

void main() {
  float scale1 = 3.0;
  float scale2 = 3.0;

  vec2 st = v_texcoord0.xy;
  vec2 uv = st;

  // fix aspect ratio
  st.x *= 5.0;

  // divide the space into tiles
  vec2 scaler = floor(st);
  scaler = vec2(random(scaler));
  scaler *= scale1;
  scaler = max(scaler, vec2(1.0));
  scaler = floor(scaler);
  st *= scaler;

  // and again  
  scaler = floor(st);
  scaler = vec2(random(scaler + vec2(234.4)));
  scaler *= scale2;
  scaler = max(scaler, vec2(1.0));
  scaler = floor(scaler);
  st *= scaler;

  // row,col (only used as random seed)
  vec2 rc = floor(st);

  // get the tile uv
  st = fract(st);
  st -= vec2(0.5);
  st *= 2.0;

  // scale it a bit
  float rscale = mix(0.2, 1.0, random(rc));
  st /= rscale;

  // move it a little bit
  vec2 offset = random2(rc + vec2(5.0)) * 0.1;
  st += offset;

  float r = length(st);
  float lum = 1.0 - r;

  // make sure the dot fully fades by the time we get to the edge
  // of the square, otherwise it will get chopped off
  lum -= max(offset.x, offset.y);
  lum = clamp(lum, 0.0, 1.0);

  // vary the radial brightness falloff
  float powpow = random(rc);
  powpow = powpow * 2.0 - 1.0;
  powpow = max(0.3, powpow);
  if (powpow < 0.0) {
    powpow = 1.0 / abs(powpow);
  }
  lum *= 2.0;
  lum = pow(lum, powpow);

  // fade the dots in and out with variety
  float fadespeed = mix(0.25, 1.25, random(rc));
  float fadephase = random(rc) * 2.0 * 3.14159;
  float time = sin(u_time.z * fadespeed + fadephase) / 2.0 + 0.5;
  lum *= mix(0.0, 1.0, time);

  vec4 color;
  fragColor.a = 1.0;
  fragColor.rgb = lum * bloomColor(v_color.rgb, lum * u_EmissionGain);
}