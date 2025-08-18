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

// Lacewing fragment shader with animated specular effects

precision mediump float;

out vec4 fragColor;

uniform vec4 u_ambient_light_color;
uniform vec4 u_SceneLight_0_color;
uniform vec4 u_SceneLight_1_color;

uniform vec3 u_SpecColor;
uniform float u_Shininess;
uniform float u_Cutoff;
uniform sampler2D u_MainTex;
uniform sampler2D u_SpecTex;
uniform vec4 u_time;

in vec4 v_color;
in vec3 v_normal;
in vec3 v_position;
in vec3 v_light_dir_0;
in vec3 v_light_dir_1;
in vec2 v_texcoord0;
in vec3 v_worldPos;

float dispAmount = .0015;

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

void main() {
    vec4 mainTex = texture(u_MainTex, v_texcoord0);
    vec4 specTex = texture(u_SpecTex, v_texcoord0);
    vec3 normal = normalize(v_normal);
    
    // Sample bump map and perturb normal
    vec3 bumpNormal = PerturbNormal(v_position.xyz, normal, v_texcoord0);
    
    float scroll = u_time.z;
    
    // Animate the spectral effect based on spectex values and time
    vec3 animatedSpec;
    animatedSpec.r = (sin(specTex.r * 2.0 + scroll * 0.5 - v_texcoord0.x) + 1.0) * 1.0;
    animatedSpec.g = (sin(specTex.r * 3.3 + scroll * 1.0 - v_texcoord0.x) + 1.0) * 1.0;
    animatedSpec.b = (sin(specTex.r * 4.66 + scroll * 0.25 - v_texcoord0.x) + 1.0) * 1.0;
    
    // Surface properties
    vec3 albedo = mainTex.rgb * v_color.rgb;
    vec3 specularColor = u_SpecColor * animatedSpec;
    float smoothness = u_Shininess;
    float alpha = mainTex.a * v_color.a;
    
    // Lighting calculation
    vec3 lightDir0 = normalize(v_light_dir_0);
    vec3 lightDir1 = normalize(v_light_dir_1);
    vec3 eyeDir = normalize(-v_position);
    
    vec3 lightOut0 = SurfaceShaderSpecularGloss(bumpNormal, lightDir0, eyeDir, 
                                               u_SceneLight_0_color.rgb,
                                               albedo, specularColor, smoothness);
    vec3 lightOut1 = ShShaderWithSpec(bumpNormal, lightDir1, u_SceneLight_1_color.rgb, 
                                     albedo, specularColor);
    vec3 ambientOut = albedo * u_ambient_light_color.rgb;
    
    vec3 color = lightOut0 + lightOut1 + ambientOut;
    
    fragColor = vec4(ApplyFog(color, f_fog_coord), alpha);
    
    // Alpha test
    if (alpha <= u_Cutoff) {
        discard;
    }
}
