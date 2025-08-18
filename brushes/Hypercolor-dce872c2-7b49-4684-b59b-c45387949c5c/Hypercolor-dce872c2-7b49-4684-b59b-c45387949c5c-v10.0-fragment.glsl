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

// Auto-copied from Hypercolor-e8ef32b1-baa8-460a-9c2c-9cf8506794f5-v10.0-fragment.glsl
// Brush-specific shader for GlTF web preview, based on Standard.glsl
// generator with parameters: a=0.5.

precision mediump float;

out vec4 fragColor;

uniform vec4 u_ambient_light_color;
uniform vec4 u_SceneLight_0_color;
uniform vec4 u_SceneLight_1_color;
uniform float u_Shininess;   // Should be in [0.0, 1.0].
uniform vec3 u_SpecColor;


in vec4 v_color;
in vec3 v_normal;
in vec3 v_position;
in vec3 v_light_dir_0;
in vec3 v_light_dir_1;
in vec2 v_texcoord0;

uniform sampler2D u_MainTex;
uniform vec4 u_time;
uniform float u_Cutoff;

float dispAmount = .0005;

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

// Requires a global constant "float dispAmount"
// TODO: turn it into a parameter!


uniform vec4 u_BumpMap_TexelSize;

// HACK: Workaround for GPUs which struggle with vec3/vec2 derivatives.
vec3 xxx_dFdx3(vec3 v) {
  return vec3(dFdx(v.x), dFdx(v.y), dFdx(v.z));
}
vec3 xxx_dFdy3(vec3 v) {
  return vec3(dFdy(v.x), dFdy(v.y), dFdy(v.z));
}
vec2 xxx_dFdx2(vec2 v) {
  return vec2(dFdx(v.x), dFdx(v.y));
}
vec2 xxx_dFdy2(vec2 v) {
  return vec2(dFdy(v.x), dFdy(v.y));
}
// </HACK>








vec3 computeLighting(vec3 diffuseColor, vec3 specularColor, vec3 normal) {
  if (!gl_FrontFacing) {
    // Always use front-facing normal for double-sided surfaces.
    normal *= -1.0;
  }
  vec3 lightDir0 = normalize(v_light_dir_0);
  vec3 lightDir1 = normalize(v_light_dir_1);
  vec3 eyeDir = -normalize(v_position);

  vec3 lightOut0 = SurfaceShaderSpecularGloss(normal, lightDir0, eyeDir, u_SceneLight_0_color.rgb,
      diffuseColor, specularColor, u_Shininess);
  vec3 lightOut1 = ShShaderWithSpec(normal, lightDir1, u_SceneLight_1_color.rgb, diffuseColor, u_SpecColor);
  vec3 ambientOut = diffuseColor * u_ambient_light_color.rgb;

  return (lightOut0 + lightOut1 + ambientOut);
}

void main() {
  vec4 tex = texture(u_MainTex, v_texcoord0);

  // WARNING: PerturbNormal uses derivatives and must not be called conditionally.
  vec3 normal = PerturbNormal(v_position, normalize(v_normal), v_texcoord0);

  // Unfortunately, the compiler keeps optimizing the call to PerturbNormal into the branch below, 
  // causing issues on some hardware/drivers. So we compute lighting just to discard it later.
  float scroll = u_time.z;
  tex.rgb = vec3(1.0, 0.0, 0.0) * (sin(tex.r * 2.0 + scroll*0.5 - v_texcoord0.x) + 1.0) * 2.0;
  tex.rgb += vec3(0.0, 1.0, 0.0) * (sin(tex.r * 3.3 + scroll*1.0 - v_texcoord0.x) + 1.0) * 2.0;
  tex.rgb += vec3(0.0, 0.0, 1.0) * (sin(tex.r * 4.66 + scroll*0.25 - v_texcoord0.x) + 1.0) * 2.0;

  float colorMultiplier = 0.5; // This factor is glsl specific - not exactly sure why I need to fudge this to match the look in Tilt Brush.
  vec3 specularColor = u_SpecColor * tex.rgb * colorMultiplier;
  vec3 diffuseColor = tex.rgb * v_color.rgb * colorMultiplier;
  fragColor.rgb = ApplyFog(computeLighting(diffuseColor, specularColor, normal));
  fragColor.a = 1.0;

  // This must come last to ensure PerturbNormal is called uniformly for all invocations.
  if (tex.w <= u_Cutoff) {
	  discard;
  }
}
