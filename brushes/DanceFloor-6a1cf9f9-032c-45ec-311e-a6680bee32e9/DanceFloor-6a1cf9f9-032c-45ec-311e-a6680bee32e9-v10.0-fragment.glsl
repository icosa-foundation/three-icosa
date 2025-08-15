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

// DanceFloor fragment shader - simplified to match Unity approach

precision mediump float;

out vec4 fragColor;

uniform sampler2D u_MainTex;
uniform vec4 u_TintColor;

in vec4 v_color;
in vec2 v_texcoord0;

// Simple HDR encoding (Unity: encodeHdr)
vec4 encodeHdr(vec3 color) {
  // Simplified HDR encoding for web - just return as-is with alpha = 1
  return vec4(color, 1.0);
}

void main() {
  // Unity: float4 c = i.color * _TintColor * tex2D(_MainTex, i.texcoord);
  vec4 c = v_color * u_TintColor * texture(u_MainTex, v_texcoord0);
  
  // Unity: c = encodeHdr(c.rgb * c.a);
  fragColor = encodeHdr(c.rgb * c.a);
}