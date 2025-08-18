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
// with parameters lit=1, a=0.5.

precision mediump float;

out vec4 fragColor;

uniform vec4 u_ambient_light_color;
uniform vec4 u_SceneLight_0_color;
uniform vec4 u_SceneLight_1_color;

uniform vec3 u_SpecColor;
uniform float u_Shininess;
uniform float u_Cutoff;
uniform sampler2D u_MainTex;
uniform vec4 u_time;

// From three.js
uniform vec3 cameraPosition;

in vec4 v_color;
in vec3 v_normal;
in vec3 v_position;
in vec3 v_light_dir_0;
in vec3 v_light_dir_1;
in vec2 v_texcoord0;

float dispAmount = .0025;

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

in float f_fog_coord;

// This fog function emulates the exponential fog used in Tilt Brush
//
// Details:
//   * For exponential fog, Unity defines u_density = density / ln(2) on the CPU, sp that they can
//        convert the base from e to 2 and use exp2 rather than exp. We might as well do the same.
//   * The fog on Plya does not precisely match that in Unity, though it's very close.  Two known
//        reasons for this are
//          1) Clipping plans on Poly are different than in Tilt Brush.  Poly is .1:2000, Tilt
//             Brush is .5:10000.
//          2) Poly applies post processing (vignettes, etc...) that can subtly change the look
//             of the fog.
//   * Finally, Tilt Brush uses "decimeters" for legacy reasons.
//        In order to convert Density values from TB to Poly, we multiply by 10.0 in order to
//        convert decimeters to meters.
//

vec3 computeLighting(vec3 normal) {
    if (!gl_FrontFacing) {
        // Always use front-facing normal for double-sided surfaces.
        normal *= 1.0;
    }
    vec3 lightDir0 = normalize(v_light_dir_0);
    vec3 lightDir1 = normalize(v_light_dir_1);
    vec3 eyeDir = -normalize(v_position);

    vec3 lightOut0 = SurfaceShaderSpecularGloss(normal, lightDir0, eyeDir, u_SceneLight_0_color.rgb,
v_color.rgb, u_SpecColor, u_Shininess);
    vec3 lightOut1 = ShShaderWithSpec(normal, lightDir1, u_SceneLight_1_color.rgb, v_color.rgb, u_SpecColor);
    vec3 ambientOut = v_color.rgb * u_ambient_light_color.rgb;

    return (lightOut0 + lightOut1 + ambientOut);
}

void main() {

    vec3 baseColor = v_color.xyz;

    // Rim term in world space
    vec3 N = normalize(-v_normal);
    vec3 V = normalize(cameraPosition - v_position);
    float rim = 1.0 - abs(dot(V, N));
    rim *= (1.0 - pow(rim, 5.0));

    // Thin-slit diffraction ramp lookup
    vec2 diffUV = vec2(rim + u_time.y + N.y, rim + N.y);
    vec3 diffraction = texture(u_MainTex, diffUV).rgb;

    // Emission (matches Unity mix)
    //vec3 emission = rim * (0.25 * diffraction * rim + 0.75 * diffraction * v_color.rgb);
    vec3 emission = vec3(0,0,0);

    // Unfortunately, the compiler keeps optimizing the call to PerturbNormal into the branch below,
    // causing issues on some hardware/drivers. So we compute lighting just to discard it later.
    fragColor.rgb = ApplyFog(computeLighting(v_normal) + emission, f_fog_coord);
    fragColor.a = 1.0;
}
