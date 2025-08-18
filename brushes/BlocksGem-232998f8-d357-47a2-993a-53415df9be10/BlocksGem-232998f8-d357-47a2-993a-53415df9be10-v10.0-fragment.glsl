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
precision mediump float;

out vec4 fragColor;

uniform vec4 u_ambient_light_color;
uniform vec4 u_SceneLight_0_color;
uniform vec4 u_SceneLight_1_color;
uniform float u_Shininess;
uniform float u_RimIntensity;
uniform float u_RimPower;
uniform vec4 u_Color;
uniform float u_Frequency;
uniform float u_Jitter;

in vec4 v_color;
in vec3 v_normal;
in vec3 v_position;
in vec3 v_local_position;
in vec3 v_light_dir_0;
in vec3 v_light_dir_1;
in vec2 v_texcoord0;






//
// Voronoi implementation taken from
// https://github.com/Scrawk/GPU-Voronoi-Noise
// (MIT License)
//

//1/7
#define K 0.142857142857
//3/7
#define Ko 0.428571428571

#define OCTAVES 1

vec3 fmod(vec3 x, float y) { return x - y * floor(x/y); }
vec2 fmod(vec2 x, float y) { return x - y * floor(x/y); }

// Permutation polynomial: (34x^2 + x) mod 289
vec3 Permutation(vec3 x)
{
    return mod((34.0 * x + 1.0) * x, 289.0);
}

vec2 inoise(vec3 P, float jitter)
{
    vec3 Pi = mod(floor(P), 289.0);
    vec3 Pf = fract(P);
    vec3 oi = vec3(-1.0, 0.0, 1.0);
    vec3 of = vec3(-0.5, 0.5, 1.5);
    vec3 px = Permutation(Pi.x + oi);
    vec3 py = Permutation(Pi.y + oi);
    
    vec3 p, ox, oy, oz, dx, dy, dz;
    vec2 F = vec2(1e6,1e6);
    
    for(int i = 0; i < 3; i++) {
        for(int j = 0; j < 3; j++) {
            p = Permutation(px[i] + py[j] + Pi.z + oi); // pij1, pij2, pij3
            
            ox = fract(p*K) - Ko;
            oy = mod(floor(p*K),7.0)*K - Ko;
            p = Permutation(p);
            
            oz = fract(p*K) - Ko;
            
            dx = Pf.x - of[i] + jitter*ox;
            dy = Pf.y - of[j] + jitter*oy;
            dz = Pf.z - of + jitter*oz;
            
            vec3 d = dx * dx + dy * dy + dz * dz; // dij1, dij2 and dij3, squared
            
            //Find lowest and second lowest distances
            for(int n = 0; n < 3; n++) {
                if(d[n] < F[0]) {
                    F[1] = F[0];
                    F[0] = d[n];
                } else if(d[n] < F[1]) {
                    F[1] = d[n];
                }
            }
        }
    }
    return F;
}

// fractal sum, range -1.0 - 1.0
vec2 fBm_F0(vec3 p, int octaves)
{
    //u_Frequency needs a bit of a boost for the gltf to look right
    float freq = u_Frequency * 4.;
    float amp = 0.5;
    vec2 F = inoise(p * freq, u_Jitter) * amp;
    return F;
}


// Specular only lighting
vec3 computeGemReflection() {
  vec3 normal = normalize(v_normal);
  
  // Get Voronoi
  vec2 F = fBm_F0(v_local_position, OCTAVES);
  float gem = (F.y - F.x);

  // Perturb normal with voronoi cells
  float perturbIntensity = 50.; //was 10. in unity.  Presumably glsl vs. hlsl is the source of the discrepancy.
  normal.y += dFdy(gem) * perturbIntensity;
  normal.x += dFdx(gem) * perturbIntensity;
  normal = normalize(normal);

  vec3 lightDir0 = normalize(v_light_dir_0);
  vec3 lightDir1 = normalize(v_light_dir_1);
  vec3 eyeDir = -normalize(v_position);
  vec3 diffuseColor = vec3(0.,0.,0.);

  // Artifical diffraction highlights to simulate what I see in blocks. Tuned to taste.
  vec3 refl = eyeDir - 2. * dot(eyeDir, normal) * normal + gem;
  vec3 colorRamp = vec3(1.,.3,0)*sin(refl.x * 30.) + vec3(0.,1.,.5)*cos(refl.y * 37.77) + vec3(0.,0.,1.)*sin(refl.z*43.33);

  // was colorRamp * .1 in unity, but boosting since
  // we don't have an environment map on Poly
  vec3 specularColor = u_Color.rgb + colorRamp * .5;
  float smoothness =  u_Shininess;

  vec3 lightOut0 = SurfaceShaderSpecularGloss(normal, lightDir0, eyeDir, u_SceneLight_0_color.rgb,
      diffuseColor, specularColor, smoothness);

  // Calculate rim lighting
  float viewAngle = clamp(dot(eyeDir, normal),0.,1.);
  float rim =  pow(1. - viewAngle, u_RimPower);
  vec3 rimColor = vec3(rim,rim,rim) * u_RimIntensity;

  return (lightOut0 + rimColor);
}

void main() {
    fragColor.rgb = computeGemReflection();
    fragColor.a = 1.0;
}
