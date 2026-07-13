import * as THREE from 'three';

export const TUBE_TOON_INVERTED_BRUSH_GUID = '9871385a-df73-4396-9e33-31e4e4930b27';
export const TUBE_TOON_INVERTED_OUTLINE_SIZE = 0.05;
export const TOON_BRUSH_GUID = '4391385a-df73-4396-9e33-31e4e4930b27';

export function createTiltBrushRenderMaterial(brushNameOrGuid, source, sharedUniforms = {}) {
    if (!source?.uniforms) {
        return source;
    }

    if (isToon(brushNameOrGuid)) {
        const surface = cloneWithSharedUniforms(source, sharedUniforms);
        surface.side = THREE.FrontSide;
        surface.uniforms.u_ToonOutlinePass = { value: false };

        const outline = cloneWithSharedUniforms(source, sharedUniforms);
        outline.side = THREE.BackSide;
        outline.uniforms.u_ToonOutlinePass = { value: true };
        return [surface, outline];
    }

    if (!isTubeToonInverted(brushNameOrGuid)) {
        return source;
    }

    const base = cloneWithSharedUniforms(source, sharedUniforms);
    base.side = THREE.FrontSide;
    base.uniforms.u_TubeToonPass = { value: 1 };
    base.uniforms.u_TubeToonOutlineSize = { value: TUBE_TOON_INVERTED_OUTLINE_SIZE };

    const color = cloneWithSharedUniforms(source, sharedUniforms);
    color.side = THREE.BackSide;
    color.uniforms.u_TubeToonPass = { value: 2 };
    color.uniforms.u_TubeToonOutlineSize = { value: TUBE_TOON_INVERTED_OUTLINE_SIZE };
    return [base, color];
}

export function applyTiltBrushRenderGroups(geometry, indexCount, material) {
    if (!Array.isArray(material)) {
        return;
    }
    geometry.clearGroups();
    for (let materialIndex = 0; materialIndex < material.length; materialIndex += 1) {
        geometry.addGroup(0, indexCount, materialIndex);
    }
}

function isToon(brushNameOrGuid) {
    const normalized = normalizeBrushName(brushNameOrGuid);
    return normalized === 'toon' || normalized === TOON_BRUSH_GUID;
}

function isTubeToonInverted(brushNameOrGuid) {
    const normalized = normalizeBrushName(brushNameOrGuid);
    return normalized === 'tubetooninverted' || normalized === TUBE_TOON_INVERTED_BRUSH_GUID;
}

function normalizeBrushName(brushNameOrGuid) {
    return String(brushNameOrGuid ?? '')
        .replace(/^material_/, '')
        .toLowerCase();
}

function cloneWithSharedUniforms(source, sharedUniforms) {
    const material = source.clone();
    material.uniforms = {
        ...material.uniforms,
        ...sharedUniforms
    };
    return material;
}
