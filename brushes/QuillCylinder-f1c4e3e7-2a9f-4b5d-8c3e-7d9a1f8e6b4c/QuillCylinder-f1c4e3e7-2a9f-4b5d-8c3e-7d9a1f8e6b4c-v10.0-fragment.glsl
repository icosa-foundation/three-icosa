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

// Brush-specific shader for GlTF web preview, based on General generator
// with parameters lit=0, a=0.01.

precision mediump float;

out vec4 fragColor;

in vec4 v_color;
in vec3 v_position;
in vec2 v_texcoord0;
in float f_fog_coord;
in float v_object_seed;

uniform sampler2D u_MainTex;
uniform float u_Cutoff;
uniform float u_A2CEnabled;
uniform float u_DitherStrength;
uniform float u_OrderedDither;
uniform float u_AlphaBias;
uniform float u_AlphaPower;

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


float OrderedDither4x4(vec2 pixelPos) {
    ivec2 p = ivec2(pixelPos) & 3;
    int index = p.x + p.y * 4;
    int d = (index == 0) ? 0 :
            (index == 1) ? 8 :
            (index == 2) ? 2 :
            (index == 3) ? 10 :
            (index == 4) ? 12 :
            (index == 5) ? 4 :
            (index == 6) ? 14 :
            (index == 7) ? 6 :
            (index == 8) ? 3 :
            (index == 9) ? 11 :
            (index == 10) ? 1 :
            (index == 11) ? 9 :
            (index == 12) ? 15 :
            (index == 13) ? 7 :
            (index == 14) ? 13 :
            5;
    return (float(d) + 0.5) / 16.0;
}

float InterleavedGradientNoise(vec2 pixelPos) {
    vec2 p = floor(pixelPos);
    float f = dot(p, vec2(0.06711056, 0.00583715));
    return fract(52.9829189 * fract(f));
}

void main() {
    float alpha = clamp(pow(clamp(v_color.a + u_AlphaBias, 0.0, 1.0), max(u_AlphaPower, 0.0001)), 0.0, 1.0);

    if (u_A2CEnabled < 0.5) {
        if (alpha <= u_Cutoff) {
            discard;
        }
        fragColor.rgb = ApplyFog(v_color.rgb, f_fog_coord);
        fragColor.a = 1.0;
        return;
    }

    vec2 pixelPos = gl_FragCoord.xy;
    pixelPos += v_object_seed * 4096.0;
    float ditherOrdered = OrderedDither4x4(pixelPos);
    float ditherNoise = InterleavedGradientNoise(pixelPos);
    float dither = mix(ditherNoise, ditherOrdered, step(0.5, u_OrderedDither));
    float ditherAmount = u_DitherStrength * (1.0 - alpha);
    float adjustedAlpha = clamp(alpha + (dither - 0.5) * ditherAmount, 0.0, 1.0);

    if (adjustedAlpha < 0.01) {
        discard;
    }

    fragColor.rgb = ApplyFog(v_color.rgb, f_fog_coord);
    fragColor.a = adjustedAlpha;
}
