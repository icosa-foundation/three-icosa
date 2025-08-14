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

// FacetedTube fragment shader (GLSL 3.0)
precision mediump float;

out vec4 fragColor;

// Per-vertex color (alpha is preserved)
in vec4 v_color;

// World position for facet normal computation
in vec3 v_worldPos;

// Configurable axis colors
uniform vec4 u_ColorX; // default (1,0,0,1)
uniform vec4 u_ColorY; // default (0,1,0,1)
uniform vec4 u_ColorZ; // default (0,0,1,1)

void main() {
  // Compute a faceted normal from screen-space derivatives of world position
  vec3 n = normalize(cross(dFdy(v_worldPos), dFdx(v_worldPos)));

  // Reconstruct color from axis contributions (Unity's lerp behavior)
  vec3 c = mix(vec3(0.0), u_ColorX.rgb, n.x)
         + mix(vec3(0.0), u_ColorY.rgb, n.y)
         + mix(vec3(0.0), u_ColorZ.rgb, n.z);

  fragColor = vec4(c, v_color.a);
}

