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

// LoftedHueShift fragment shader
precision mediump float;

out vec4 fragColor;

uniform sampler2D u_MainTex;
uniform float u_Opacity;

in vec4 v_color;
in vec2 v_texcoord0;

// Hue to RGB conversion from ColorSpace.cginc
vec3 hue06_to_base_rgb(float hue06) {
    float r = -1.0 + abs(hue06 - 3.0);
    float g =  2.0 - abs(hue06 - 2.0);
    float b =  2.0 - abs(hue06 - 4.0);
    return clamp(vec3(r, g, b), 0.0, 1.0);
}

void main() {
    // Sample texture and multiply by vertex color
    vec4 tex = texture(u_MainTex, v_texcoord0) * v_color;

    // Create hue shift based on color
    // Unity: float shift = 5; shift += IN.color;
    // Unity: float3 hueshift = hue06_to_base_rgb(IN.color * shift);
    float shift = 5.0 + v_color.r;  // Using red component like Unity
    vec3 hueshift = hue06_to_base_rgb(v_color.r * shift);
    vec4 colorShift = vec4(hueshift, 1.0);

    // Create vignette effect from center
    // Unity: float huevignette = pow(abs(IN.uv_MainTex - .5) * 2.0, 2.0);
    vec2 centeredUV = abs(v_texcoord0 - 0.5) * 2.0;
    float huevignette = pow(length(centeredUV), 2.0);

    // Lerp between original texture and hue-shifted color
    // Unity: o.Albedo = lerp(tex, _ColorShift, saturate(huevignette));
    vec4 color = mix(tex, colorShift, clamp(huevignette, 0.0, 1.0));

    color.rgb *= color.a;
    fragColor = color;
}