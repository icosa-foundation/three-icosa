// Copyright 2020 The Tilt Brush Authors
// Updated to OpenGL ES 3.0 by the Icosa Gallery Authors

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

out vec4 fragColor;

in vec4 v_color;
in vec2 v_texcoord0;
in vec3 v_position;

#if TB_HAS_ALPHA_CUTOFF
uniform sampler2D u_MainTex;
#endif

in float f_fog_coord;

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


vec3 computeLighting() {
  return v_color.rgb;
}

void main() {
#if TB_HAS_ALPHA_CUTOFF
  const float alpha_threshold = TB_ALPHA_CUTOFF;
  float brush_mask = texture(u_MainTex, v_texcoord0).w;
  if (brush_mask > alpha_threshold) {
    fragColor.rgb = ApplyFog(computeLighting(), f_fog_coord);
    fragColor.a = 1.0;
  } else {
    discard;
  }
#else
  fragColor.rgb = ApplyFog(computeLighting());
  fragColor.a = 1.0;
#endif
}
