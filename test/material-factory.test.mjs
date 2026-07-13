import assert from 'node:assert/strict';
import test from 'node:test';
import { RawShaderMaterial, ShaderMaterial, Texture } from 'three';
import { TiltShaderLoader } from '../dist/three-icosa.module.js';

test( 'uses RawShaderMaterial by default', () => {
    const loader = new TiltShaderLoader();
    const material = loader.createMaterial( {}, 'Flat' );

    assert.ok( material instanceof RawShaderMaterial );
} );

test( 'uses an injected material factory', () => {
    const expected = new ShaderMaterial();
    let receivedBrushName;
    const loader = new TiltShaderLoader( undefined, {
        materialFactory: ( materialParams, brushName ) => {
            receivedBrushName = brushName;
            assert.equal( materialParams.transparent, true );
            return expected;
        }
    } );
    const material = loader.createMaterial( { transparent: true }, 'OilPaint' );

    assert.equal( material, expected );
    assert.equal( receivedBrushName, 'OilPaint' );
} );

test( 'allows callers to configure loaded textures', () => {
    const texture = new Texture();
    let receivedContext;
    const loader = new TiltShaderLoader( undefined, {
        textureConfigurator: ( receivedTexture, context ) => {
            assert.equal( receivedTexture, texture );
            receivedTexture.userData.configured = true;
            receivedContext = context;
        }
    } );

    const result = loader.configureTexture( texture, 'OilPaint', 'u_MainTex' );

    assert.equal( result, texture );
    assert.equal( texture.userData.configured, true );
    assert.deepEqual( receivedContext, {
        brushName: 'OilPaint',
        uniformName: 'u_MainTex',
        isFallback: false
    } );
} );

test( 'keeps texture configuration optional', () => {
    const texture = new Texture();
    const loader = new TiltShaderLoader();

    assert.equal( loader.configureTexture( texture, 'Flat', 'u_MainTex' ), texture );
} );

test( 'binds untextured experimental additive brushes independently', () => {
    const loader = new TiltShaderLoader();

    assert.equal( loader.lookupMaterialName( '30cb9af6-be41-4872-8f3e-cbff63fe3db8' ), 'Digital' );
    assert.equal( loader.lookupMaterialName( 'abfbb2aa-70b4-4a5c-8126-8eedda2b3628' ), 'Race' );
    assert.notEqual( loader.lookupMaterialParams( 'Digital' ), loader.lookupMaterialParams( 'Race' ) );
    assert.match( loader.lookupMaterialParams( 'Digital' ).fragmentShader, /^Digital-/ );
    assert.match( loader.lookupMaterialParams( 'Race' ).fragmentShader, /^Race-/ );
} );
