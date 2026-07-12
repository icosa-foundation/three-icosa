import assert from 'node:assert/strict';
import test from 'node:test';
import { RawShaderMaterial, ShaderMaterial } from 'three';
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
