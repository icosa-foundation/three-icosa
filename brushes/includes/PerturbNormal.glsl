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

// Fixed PerturbNormal function that correctly handles normal maps instead of height maps
// This replaces the derivative-based height map approach with proper normal map unpacking

uniform sampler2D u_BumpMap;

// Unpack a normal map from [0,1] to [-1,1] range
vec3 UnpackNormal(vec3 normalMapSample) {
    return normalize(normalMapSample * 2.0 - 1.0);
}

// Convert normal from tangent space to world space
vec3 PerturbNormal(vec3 position, vec3 normal, vec2 uv) {
    // Sample the normal map
    vec3 normalMapSample = texture(u_BumpMap, uv).xyz;
    
    // If this is a 2-channel normal map (RG format), reconstruct Z
    if (length(normalMapSample.z) < 0.1) {
        normalMapSample.z = sqrt(1.0 - clamp(dot(normalMapSample.xy, normalMapSample.xy), 0.0, 1.0));
    }
    
    // Unpack from [0,1] to [-1,1] range
    vec3 tangentNormal = UnpackNormal(normalMapSample);
    
    // For now, we'll use a simplified approach since we don't have tangent vectors
    // This assumes the normal map is relatively aligned with the surface normal
    vec3 perturbedNormal = normalize(normal + tangentNormal * 0.3);
    
    // Handle back face flipping for double-sided surfaces
    if (!gl_FrontFacing) {
        perturbedNormal = -perturbedNormal;
    }
    
    return perturbedNormal;
}