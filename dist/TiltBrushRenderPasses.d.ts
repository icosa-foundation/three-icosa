import type { BufferGeometry, Material, ShaderMaterial } from 'three';

export const TUBE_TOON_INVERTED_BRUSH_GUID: string;
export const TUBE_TOON_INVERTED_OUTLINE_SIZE: number;

export function createTiltBrushRenderMaterial(
    brushNameOrGuid: string,
    source: Material,
    sharedUniforms?: Record<string, { value: unknown }>
): Material | ShaderMaterial[];

export function applyTiltBrushRenderGroups(
    geometry: BufferGeometry,
    indexCount: number,
    material: Material | Material[]
): void;
