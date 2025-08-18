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

// BubbleWand fragment shader with rim lighting and diffraction effects

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

in vec4 v_color;
in vec3 v_normal;
in vec3 v_position;
in vec3 v_light_dir_0;
in vec3 v_light_dir_1;
in vec2 v_texcoord0;
in vec3 v_viewDir;

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

void main() {
  vec3 normal = normalize(v_normal);
  vec3 viewDir = normalize(-v_position);
  
  // Hardcode some shiny specular values
  float smoothness = 0.9;
  vec3 specularColor = 0.6 * v_color.rgb;
  vec3 albedo = vec3(0.0);

  // Calculate rim effect
  float rim = 1.0 - abs(dot(viewDir, normal));
  rim *= 1.0 - pow(rim, 5.0);

  // Thin slit diffraction texture ramp lookup
  vec3 diffraction = texture(u_MainTex, vec2(rim + u_time.x + normal.y, rim + normal.y)).xyz;
  vec3 emission = rim * (0.25 * diffraction * rim + 0.75 * diffraction * v_color.rgb);

  // Apply lighting
  vec3 lightDir0 = normalize(v_light_dir_0);
  vec3 lightDir1 = normalize(v_light_dir_1);
  
  // Specular contribution from main light
  vec3 halfVector = normalize(lightDir0 + viewDir);
  float NdotH = max(dot(normal, halfVector), 0.0);
  float specular = pow(NdotH, smoothness * 128.0);
  
  vec3 color = emission;
  color += specularColor * specular * u_SceneLight_0_color.rgb;
  color += v_color.rgb * u_ambient_light_color.rgb * 0.1;

  fragColor = vec4(ApplyFog(color, f_fog_coord), v_color.a);
}
