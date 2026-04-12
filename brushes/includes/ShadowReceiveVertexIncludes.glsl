precision mediump float;

#if NUM_SPOT_LIGHT_COORDS > 0
uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
out vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif

#ifdef USE_SHADOWMAP
  #if NUM_DIR_LIGHT_SHADOWS > 0
    uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
    out vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];

    struct DirectionalLightShadow {
      float shadowBias;
      float shadowNormalBias;
      float shadowRadius;
      vec2 shadowMapSize;
    };

    uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
  #endif

  #if NUM_SPOT_LIGHT_SHADOWS > 0
    struct SpotLightShadow {
      float shadowBias;
      float shadowNormalBias;
      float shadowRadius;
      vec2 shadowMapSize;
    };

    uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
  #endif

  #if NUM_POINT_LIGHT_SHADOWS > 0
    uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
    out vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];

    struct PointLightShadow {
      float shadowBias;
      float shadowNormalBias;
      float shadowRadius;
      vec2 shadowMapSize;
      float shadowCameraNear;
      float shadowCameraFar;
    };

    uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
  #endif
#endif

vec3 TiltBrushWorldNormal(vec3 objectNormal, mat4 shadowModelMatrix) {
  return normalize(mat3(transpose(inverse(shadowModelMatrix))) * objectNormal);
}

void TiltBrushSetShadowCoords(vec4 worldPosition, vec3 objectNormal, mat4 shadowModelMatrix) {
  #if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
    vec3 shadowWorldNormal = TiltBrushWorldNormal(objectNormal, shadowModelMatrix);
    vec4 shadowWorldPosition;
  #endif

  #if defined( USE_SHADOWMAP )
    #if NUM_DIR_LIGHT_SHADOWS > 0
      #pragma unroll_loop_start
      for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
        shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0.0 );
        vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
      }
      #pragma unroll_loop_end
    #endif

    #if NUM_POINT_LIGHT_SHADOWS > 0
      #pragma unroll_loop_start
      for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
        shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0.0 );
        vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
      }
      #pragma unroll_loop_end
    #endif
  #endif

  #if NUM_SPOT_LIGHT_COORDS > 0
    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
      shadowWorldPosition = worldPosition;
      #if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
        shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
      #endif
      vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
    }
    #pragma unroll_loop_end
  #endif
}
