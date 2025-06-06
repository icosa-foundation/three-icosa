#define TB_ALPHA_CUTOFF 0.5
#define TB_HAS_ALPHA_CUTOFF 1
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

// Unlit.glsl
precision mediump float;

out vec4 v_color;
out vec2 v_texcoord0;
out vec3 v_position;

#if TB_HAS_ALPHA_CUTOFF
uniform sampler2D u_MainTex;
#endif

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

// Fogging support
uniform vec3 u_fogColor;
uniform float u_fogDensity;
out float f_fog_coord;

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

vec3 ApplyFog(vec3 color) {
  // Per the top comment, we must modify the density value by Unity's ln(2) modification as well as
  // a decimeter conversion
  float density = (u_fogDensity / .693147) * 10.;

  // This exponential fog function is copied directly from unity (see UnityCG.inc).
  float fogFactor = f_fog_coord * density;
  fogFactor = exp2(-fogFactor);
  fogFactor = clamp( fogFactor, 0.0, 1.0 );
  return mix(u_fogColor, color.xyz, fogFactor);
}

vec3 computeLighting() {
  return v_color.rgb;
}

void main() {
#if TB_HAS_ALPHA_CUTOFF
  const float alpha_threshold = TB_ALPHA_CUTOFF;
  float brush_mask = texture(u_MainTex, v_texcoord0).w;
  if (brush_mask > alpha_threshold) {
    v_color.rgb = ApplyFog(computeLighting());
    v_color.a = 1.0;
  } else {
    discard;
  }
#else
  v_color.rgb = ApplyFog(computeLighting());
  v_color.a = 1.0;
#endif
}
