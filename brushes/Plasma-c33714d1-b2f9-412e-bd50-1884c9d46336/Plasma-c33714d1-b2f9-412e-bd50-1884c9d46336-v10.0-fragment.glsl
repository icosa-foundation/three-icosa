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

// Brush-specific shader for GlTF web preview, based on Additive.glsl
// generator with parameters: g=0.2.

precision mediump float;

out vec4 fragColor;
  
uniform sampler2D u_MainTex;
uniform vec4 u_time; 
uniform bool u_isTiltInput;

in vec4 v_color; 
in vec2 v_texcoord0;

void main() {
  float brush_alpha = clamp(v_color.a, 0.0, 1.0);
  float source_v = u_isTiltInput ? 1.0 - v_texcoord0.y : v_texcoord0.y;
 
  // Tuning constants for 3 lines
  vec3 A     = vec3(0.55, 0.3, 0.7 );
  vec3 aRate = vec3(1.2 , 1.0, 1.33);
  vec3 M     = vec3(1.0 , 2.2, 1.5);  // kind of a multiplier on A's values
  vec3 bRate = vec3(1.5 , 3.0, 2.25) + M * aRate;
  vec3 LINE_POS = vec3(0.5,0.5,0.5);
  vec3 LINE_WIDTH = vec3(.012,.012,.012);

  // Calculate uvs for each line
  vec3 us, vs;
  {
    us = A * v_texcoord0.x - aRate * u_time.y;

    vec3 tmp = M*A * v_texcoord0.x - bRate * u_time.y;
    tmp = abs(fract(tmp) - 0.5);
    vs = source_v + .4 * brush_alpha * vec3(1.,-1.,1.) * tmp;
    vs = clamp(mix((vs - .5) * 4., vs,	sin( (3.14159/2.) * brush_alpha)),0.,1.);
  }

  vec3 texture_v = u_isTiltInput ? vec3(1.0) - vs : vs;
  vec4 tex = texture(u_MainTex, vec2(us[0], texture_v[0]));
  tex += texture(u_MainTex, vec2(us[1], texture_v[1]));
  tex += texture(u_MainTex, vec2(us[2], texture_v[2]));

  // render 3 procedural lines
  vec3 procline = vec3(1.) - clamp(pow((vs - LINE_POS) / LINE_WIDTH, vec3(2.)), 0., 1.);
  tex += dot(procline, vec3(1.));

  // adjust brightness; modulate by color
  tex *= .8 * (1. + 30. * pow(1. - brush_alpha, 5.));
  vec4 color = vec4(v_color.rgb, 1.0) * tex;

  fragColor = vec4(color.rgb * color.a, 1.0);
}
