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

// Space fragment shader - analogous color space effect with noise
precision mediump float;

out vec4 fragColor;

uniform vec4 u_time;
uniform float u_Opacity;

in vec4 v_color;
in vec2 v_texcoord0;

// Simple hash function for noise
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float hash(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
}

// Simple noise function
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // smoothstep

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
    mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
    mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}

// Fractional Brownian Motion (fbm) - simplified version
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for(int i = 0; i < 3; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for(int i = 0; i < 3; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// RGB to HSV conversion
vec3 RGBtoHSV(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// HSV to RGB conversion
vec3 HSVToRGB(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Clamped remap function from Math.cginc
float clampedRemap(float x1, float x2, float y1, float y2, float x) {
    float t = clamp((x - x1) / (x2 - x1), 0.0, 1.0);
    return mix(y1, y2, t);
}

void main() {
    float analog_spread = 0.1;  // how far the analogous hues are from the primary
    float gain = 10.0;
    float gain2 = 0.0;

    // Primary hue is chosen by user
    vec3 i_HSV = RGBtoHSV(v_color.rgb);

    // We're gonna mix these 3 colors together
    float primary_hue = i_HSV.x;
    float analog1_hue = fract(primary_hue - analog_spread);
    float analog2_hue = fract(primary_hue + analog_spread);

    float r = abs(v_texcoord0.y * 2.0 - 1.0);  // distance from center of stroke

    // Determine the contributions of each hue
    float primary_a = 0.2 * fbm(v_texcoord0 + u_time.x) * gain + gain2;
    float analog1_a = 0.2 * fbm(vec3(v_texcoord0.x + 12.52, v_texcoord0.y + 12.52, u_time.x * 5.2)) * gain + gain2;
    float analog2_a = 0.2 * fbm(vec3(v_texcoord0.x + 6.253, v_texcoord0.y + 6.253, u_time.x * 0.8)) * gain + gain2;

    // The main hue is present in the center and falls off with randomized radius
    primary_a = clampedRemap(0.0, 0.5, primary_a, 0.0, r + fbm(vec2(u_time.x + 50.0, v_texcoord0.x)) * 2.0);

    // The analog hues start a little out from the center and increase with intensity going out
    analog1_a = clampedRemap(0.2, 1.0, 0.0, analog1_a * 1.2, r);
    analog2_a = clampedRemap(0.2, 1.0, 0.0, analog2_a * 1.2, r);

    vec4 color;
    color.a = primary_a + analog1_a + analog2_a;

    float final_hue = (primary_a * primary_hue + analog1_a * analog1_hue + analog2_a * analog2_hue) / color.a;

    // Now sculpt the overall shape of the stroke
    float lum = 1.0 - r;
    float rfbm = fbm(vec2(v_texcoord0.x, u_time.x));
    rfbm += 1.2;
    rfbm *= 0.8;
    lum *= step(r, rfbm);  // shorten the radius with fbm

    // Blur the edge a little bit
    lum *= smoothstep(rfbm, rfbm - 0.2, r);

    color.rgb = HSVToRGB(vec3(final_hue, i_HSV.y, i_HSV.z * lum));
    color = clamp(color, 0.0, 1.0);  // Unity had saturate() here

    // Apply HDR-style boost and final opacity
    color.rgb *= color.a * u_Opacity;
    fragColor = color * u_Opacity;
}