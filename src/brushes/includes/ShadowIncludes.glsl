// Shadow sampling code for Tilt Brush materials
// Based on Three.js shadowmap implementation

precision mediump float;

#ifdef USE_SHADOWMAP

#if NUM_DIR_LIGHT_SHADOWS > 0
    uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
    varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];

    struct DirectionalLightShadow {
        float shadowBias;
        float shadowNormalBias;
        float shadowRadius;
        vec2 shadowMapSize;
    };

    uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
#endif

// PCF shadow sampling
float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
    return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
}

float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
    float shadow = 1.0;

    shadowCoord.xyz /= shadowCoord.w;
    shadowCoord.z += shadowBias;

    // Check if in shadow map bounds
    bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
    bool frustumTest = inFrustum && shadowCoord.z <= 1.0;

    if ( frustumTest ) {
        // PCF filtering (2x2 kernel)
        vec2 texelSize = vec2( 1.0 ) / shadowMapSize;

        float dx0 = - texelSize.x * shadowRadius;
        float dy0 = - texelSize.y * shadowRadius;
        float dx1 = + texelSize.x * shadowRadius;
        float dy1 = + texelSize.y * shadowRadius;

        shadow = (
            texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
            texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
            texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
            texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
            texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
            texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
            texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
            texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
            texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
        ) * ( 1.0 / 9.0 );
    }

    return shadow;
}

// Get combined shadow factor from all directional lights
float getDirectionalShadowFactor() {
    float shadow = 1.0;

    #if NUM_DIR_LIGHT_SHADOWS > 0
    for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
        shadow *= getShadow(
            directionalShadowMap[ i ],
            directionalLightShadows[ i ].shadowMapSize,
            directionalLightShadows[ i ].shadowBias,
            directionalLightShadows[ i ].shadowRadius,
            vDirectionalShadowCoord[ i ]
        );
    }
    #endif

    return shadow;
}

#else

// No shadows - return full light
float getDirectionalShadowFactor() {
    return 1.0;
}

#endif
