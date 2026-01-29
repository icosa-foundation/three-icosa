// =============================================================================
// FOG
// =============================================================================

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

precision mediump float;

uniform vec3 u_fogColor;
uniform float u_fogDensity;

vec3 ApplyFog(vec3 color, float fogCoord) {
    float density = (u_fogDensity / .693147) * 10.;
    float fogFactor = abs(fogCoord) * density;  // Use abs() to handle negative camera-space Z
    fogFactor = exp2(-fogFactor);
    fogFactor = clamp( fogFactor, 0.0, 1.0 );
    return mix(u_fogColor, color.xyz, fogFactor);
}
