precision mediump float;

uniform bool receiveShadow;

#if NUM_SPOT_LIGHT_COORDS > 0
in vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif

#if NUM_SPOT_LIGHT_MAPS > 0
uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif

const float PackUpscale = 256.0 / 255.0;
const float UnpackDownscale = 255.0 / 256.0;
const vec3 PackFactors = vec3( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0 );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1.0 );

float unpackRGBAToDepth( const in vec4 v ) {
  return dot( v, UnpackFactors );
}

vec2 unpackRGBATo2Half( vec4 v ) {
  return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}

#ifdef USE_SHADOWMAP
  #if NUM_DIR_LIGHT_SHADOWS > 0
    uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
    in vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];

    struct DirectionalLightShadow {
      float shadowBias;
      float shadowNormalBias;
      float shadowRadius;
      vec2 shadowMapSize;
    };

    uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
  #endif

  #if NUM_SPOT_LIGHT_SHADOWS > 0
    uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];

    struct SpotLightShadow {
      float shadowBias;
      float shadowNormalBias;
      float shadowRadius;
      vec2 shadowMapSize;
    };

    uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
  #endif

  #if NUM_POINT_LIGHT_SHADOWS > 0
    uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
    in vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];

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

  float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
    return step( compare, unpackRGBAToDepth( texture( depths, uv ) ) );
  }

  vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
    return unpackRGBATo2Half( texture( shadow, uv ) );
  }

  float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
    float occlusion = 1.0;
    vec2 distribution = texture2DDistribution( shadow, uv );
    float hardShadow = step( compare, distribution.x );

    if ( hardShadow != 1.0 ) {
      float distance = compare - distribution.x;
      float variance = max( 0.0, distribution.y * distribution.y );
      float softnessProbability = variance / ( variance + distance * distance );
      softnessProbability = clamp( ( softnessProbability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );
      occlusion = clamp( max( hardShadow, softnessProbability ), 0.0, 1.0 );
    }

    return occlusion;
  }

  float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
    float shadow = 1.0;
    shadowCoord.xyz /= shadowCoord.w;
    shadowCoord.z += shadowBias;

    bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
    bool frustumTest = inFrustum && shadowCoord.z <= 1.0;

    if ( frustumTest ) {
      #if defined( SHADOWMAP_TYPE_PCF )
        vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
        float dx0 = - texelSize.x * shadowRadius;
        float dy0 = - texelSize.y * shadowRadius;
        float dx1 = + texelSize.x * shadowRadius;
        float dy1 = + texelSize.y * shadowRadius;
        float dx2 = dx0 / 2.0;
        float dy2 = dy0 / 2.0;
        float dx3 = dx1 / 2.0;
        float dy3 = dy1 / 2.0;
        shadow = (
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
        ) * ( 1.0 / 17.0 );
      #elif defined( SHADOWMAP_TYPE_PCF_SOFT )
        vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
        float dx = texelSize.x;
        float dy = texelSize.y;
        vec2 uv = shadowCoord.xy;
        vec2 f = fract( uv * shadowMapSize + 0.5 );
        uv -= f * texelSize;
        shadow = (
          texture2DCompare( shadowMap, uv, shadowCoord.z ) +
          texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
          texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
          texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
          mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
               texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
               f.x ) +
          mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
               texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
               f.x ) +
          mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
               texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
               f.y ) +
          mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
               texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
               f.y ) +
          mix(
            mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
                 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
                 f.x ),
            mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
                 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
                 f.x ),
            f.y
          )
        ) * ( 1.0 / 9.0 );
      #elif defined( SHADOWMAP_TYPE_VSM )
        shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
      #else
        shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
      #endif
    }

    return shadow;
  }

  vec2 cubeToUV( vec3 v, float texelSizeY ) {
    vec3 absV = abs( v );
    float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
    absV *= scaleToCube;
    v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );

    vec2 planar = v.xy;
    float almostATexel = 1.5 * texelSizeY;
    float almostOne = 1.0 - almostATexel;

    if ( absV.z >= almostOne ) {
      if ( v.z > 0.0 ) {
        planar.x = 4.0 - v.x;
      }
    } else if ( absV.x >= almostOne ) {
      float signX = sign( v.x );
      planar.x = v.z * signX + 2.0 * signX;
    } else if ( absV.y >= almostOne ) {
      float signY = sign( v.y );
      planar.x = v.x + 2.0 * signY + 2.0;
      planar.y = v.z * signY - 2.0;
    }

    return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
  }

  float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
    float shadow = 1.0;
    vec3 lightToPosition = shadowCoord.xyz;
    float lightToPositionLength = length( lightToPosition );

    if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
      float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );
      dp += shadowBias;
      vec3 bd3D = normalize( lightToPosition );
      vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );

      #if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
        vec2 offset = vec2( -1.0, 1.0 ) * shadowRadius * texelSize.y;
        shadow = (
          texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
          texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
          texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
          texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
          texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
          texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
          texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
          texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
          texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
        ) * ( 1.0 / 9.0 );
      #else
        shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
      #endif
    }

    return shadow;
  }
#endif

float TiltBrushGetShadowMask() {
  float shadow = 1.0;

  #ifdef USE_SHADOWMAP
    #if NUM_DIR_LIGHT_SHADOWS > 0
      DirectionalLightShadow directionalLight;
      #pragma unroll_loop_start
      for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
        directionalLight = directionalLightShadows[ i ];
        shadow *= receiveShadow ? getShadow(
          directionalShadowMap[ i ],
          directionalLight.shadowMapSize,
          directionalLight.shadowBias,
          directionalLight.shadowRadius,
          vDirectionalShadowCoord[ i ]
        ) : 1.0;
      }
      #pragma unroll_loop_end
    #endif

    #if NUM_SPOT_LIGHT_SHADOWS > 0
      SpotLightShadow spotLight;
      #pragma unroll_loop_start
      for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
        spotLight = spotLightShadows[ i ];
        shadow *= receiveShadow ? getShadow(
          spotShadowMap[ i ],
          spotLight.shadowMapSize,
          spotLight.shadowBias,
          spotLight.shadowRadius,
          vSpotLightCoord[ i ]
        ) : 1.0;
      }
      #pragma unroll_loop_end
    #endif

    #if NUM_POINT_LIGHT_SHADOWS > 0
      PointLightShadow pointLight;
      #pragma unroll_loop_start
      for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
        pointLight = pointLightShadows[ i ];
        shadow *= receiveShadow ? getPointShadow(
          pointShadowMap[ i ],
          pointLight.shadowMapSize,
          pointLight.shadowBias,
          pointLight.shadowRadius,
          vPointShadowCoord[ i ],
          pointLight.shadowCameraNear,
          pointLight.shadowCameraFar
        ) : 1.0;
      }
      #pragma unroll_loop_end
    #endif
  #endif

  return shadow;
}
