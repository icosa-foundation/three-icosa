import assert from 'node:assert/strict';
import test from 'node:test';
import {
    BackSide,
    ClampToEdgeWrapping,
    DoubleSide,
    FrontSide,
    LinearFilter,
    LinearMipmapNearestFilter,
    NoColorSpace,
    RawShaderMaterial,
    RepeatWrapping,
    ShaderMaterial,
    SRGBColorSpace,
    Texture
} from 'three';
import {
    applyTiltBrushRenderGroups,
    createTiltBrushRenderMaterial,
    TiltShaderLoader
} from '../dist/three-icosa.module.js';

test( 'keeps render materials unchanged unless a supported pass is requested', () => {
    const source = new ShaderMaterial();
    assert.equal(createTiltBrushRenderMaterial('Flat', source), source);
} );

test( 'creates opt-in inverted Toon render passes', () => {
    const source = new ShaderMaterial({ uniforms: { u_time: { value: 0 } } });
    const materials = createTiltBrushRenderMaterial('TubeToonInverted', source);
    assert.equal(materials.length, 2);
    assert.deepEqual(materials.map(material => material.side), [FrontSide, BackSide]);
    assert.deepEqual(materials.map(material => material.uniforms.u_TubeToonPass.value), [1, 2]);
    assert.deepEqual(materials.map(material => material.uniforms.u_TubeToonOutlineSize.value), [0.05, 0.05]);

    const groups = [];
    const geometry = {
        clearGroups: () => { groups.length = 0; },
        addGroup: (start, count, materialIndex) => groups.push({ start, count, materialIndex })
    };
    applyTiltBrushRenderGroups(geometry, 18, materials);
    assert.deepEqual(groups, [
        { start: 0, count: 18, materialIndex: 0 },
        { start: 0, count: 18, materialIndex: 1 }
    ]);
} );

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

test( 'applies authoritative required-brush culling by default', () => {
    const loader = new TiltShaderLoader();

    const flat = loader.createMaterial( {}, 'Flat' );
    const toon = loader.createMaterial( {}, 'Toon' );
    const dryBrush = loader.createMaterial( {}, 'DryBrush' );
    const digital = loader.createMaterial( {}, 'Digital' );

    assert.equal( flat.side, DoubleSide );
    assert.equal( toon.side, FrontSide );
    assert.equal( dryBrush.side, DoubleSide );
    assert.equal( digital.side, FrontSide );
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
    assert.equal( texture.wrapS, ClampToEdgeWrapping );
    assert.equal( texture.wrapT, ClampToEdgeWrapping );
    assert.equal( texture.userData.configured, true );
    assert.deepEqual( receivedContext, {
        brushName: 'OilPaint',
        uniformName: 'u_MainTex',
        isFallback: false
    } );
} );

test( 'applies authoritative brush texture settings by default', () => {
    const texture = new Texture();
    const loader = new TiltShaderLoader();

    loader.configureTexture( texture, 'OilPaint', 'u_MainTex' );

    assert.equal( texture.colorSpace, SRGBColorSpace );
    assert.equal( texture.wrapS, ClampToEdgeWrapping );
    assert.equal( texture.wrapT, ClampToEdgeWrapping );
    assert.equal( texture.generateMipmaps, true );
    assert.equal( texture.magFilter, LinearFilter );
    assert.equal( texture.minFilter, LinearMipmapNearestFilter );
    assert.equal( texture.anisotropy, 4 );
} );

test( 'does not mutate shared fallback textures', () => {
    const texture = new Texture();
    texture.wrapS = RepeatWrapping;
    const loader = new TiltShaderLoader();

    loader.configureTexture( texture, 'OilPaint', 'u_MainTex', true );

    assert.equal( texture.wrapS, RepeatWrapping );
} );

test( 'follows shader uniform aliases when applying texture settings', () => {
    const texture = new Texture();
    const loader = new TiltShaderLoader();

    loader.configureTexture( texture, 'Rain', 'u_AlphaMask' );

    assert.equal( texture.colorSpace, NoColorSpace );
    assert.equal( texture.generateMipmaps, false );
    assert.equal( texture.minFilter, LinearFilter );
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
