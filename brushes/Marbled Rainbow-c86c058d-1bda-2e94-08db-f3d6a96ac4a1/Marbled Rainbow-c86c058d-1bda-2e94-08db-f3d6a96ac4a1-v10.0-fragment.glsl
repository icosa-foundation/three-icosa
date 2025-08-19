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

// MarbledRainbow fragment shader with specular texturing

out vec4 fragColor;

uniform vec4 u_ambient_light_color;
uniform vec4 u_SceneLight_0_color;
uniform vec4 u_SceneLight_1_color;

uniform vec3 u_SpecColor;
uniform float u_Shininess;
uniform float u_Cutoff;
uniform sampler2D u_MainTex;
uniform sampler2D u_SpecTex;

in vec4 v_color;
in vec3 v_normal;
in vec3 v_tangent;
in vec3 v_bitangent;
in vec3 v_position;
in vec3 v_light_dir_0;
in vec3 v_light_dir_1;
in vec2 v_texcoord0;
in vec3 v_worldPos;
in float f_fog_coord;

vec3 computeLighting(vec3 normal) {
    if (!gl_FrontFacing) {
        // Always use front-facing normal for double-sided surfaces.
        normal *= -1.0;
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
    vec4 mainTex = texture(u_MainTex, v_texcoord0);
    vec4 specTex = texture(u_SpecTex, v_texcoord0);
    vec3 normal = normalize(v_normal);
    
    // Sample bump map and perturb normal - now using proper tangent vectors
    vec3 bumpNormal = PerturbNormal(v_tangent, v_bitangent, normal, v_texcoord0);
    
    // Surface properties
    vec3 albedo = mainTex.rgb * v_color.rgb;
    vec3 specularColor = u_SpecColor * specTex.rgb;
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

