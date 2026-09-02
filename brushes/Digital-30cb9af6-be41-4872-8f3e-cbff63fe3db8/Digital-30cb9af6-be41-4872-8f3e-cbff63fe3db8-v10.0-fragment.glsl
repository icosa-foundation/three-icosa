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

precision highp float;

out vec4 fragColor;

uniform float u_EmissionGain;

in vec4 v_color;
in vec2 v_st;

float random(vec2 p) {
  const vec2 r = vec2(23.14079263, 2.7651234);
  return fract(cos(mod(123432189.0, 1e-7 + 256.0 * dot(p, r))));
}

vec4 bloomColor(vec4 color, float gain) {
  float cmin = length(color.rgb) * 0.05;
  color.rgb = max(color.rgb, vec3(cmin));
  color = pow(color, vec4(2.2));
  color.rgb *= 2.0 * exp(gain * 10.0);
  return color;
}

void main() {
  const float rows = 5.0;
  const float strokeWidth = 0.1;
  const float antialiasFeatherPx = 4.0;
  vec2 stPerPx = fwidth(v_st);
  vec2 rc = floor(v_st);
  vec2 tileSt = (fract(v_st) - 0.5) * 2.0;
  float lum = 0.0;

  for (int ii = -1; ii <= 1; ++ii) {
    if (rc.x + float(ii) < 0.0) continue;
    for (int jj = -1; jj <= 1; ++jj) {
      if (abs(ii) == abs(jj)) continue;
      if (rc.y + float(jj) < 0.0) continue;
      if (rc.y + float(jj) >= rows) continue;

      vec2 ij = vec2(float(ii), float(jj));
      if (random(rc) + random(rc + ij) < 1.0) continue;

      vec2 ijPerp = vec2(-ij.y, ij.x);
      vec2 bound1 = strokeWidth * -ijPerp + strokeWidth * -ij;
      vec2 bound2 = ij + strokeWidth * ijPerp;
      vec2 minBound = min(bound1, bound2);
      vec2 maxBound = max(bound1, bound2);
      vec2 aaFeather = stPerPx * antialiasFeatherPx;
      float currentLum =
          smoothstep(minBound.x - aaFeather.x, minBound.x, tileSt.x) *
          (1.0 - smoothstep(maxBound.x, maxBound.x + aaFeather.x, tileSt.x)) *
          smoothstep(minBound.y - aaFeather.y, minBound.y, tileSt.y) *
          (1.0 - smoothstep(maxBound.y, maxBound.y + aaFeather.y, tileSt.y));
      lum = max(lum, currentLum);
    }
  }

  vec4 color = vec4(lum * bloomColor(v_color, lum * u_EmissionGain).rgb, 1.0);
  fragColor = color;
}
