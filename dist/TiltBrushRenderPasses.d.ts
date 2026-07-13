import type { BufferGeometry, Material, ShaderMaterial } from 'three';

export const TUBE_TOON_INVERTED_BRUSH_GUID: string;
export const TUBE_TOON_INVERTED_OUTLINE_SIZE: number;
export const TOON_BRUSH_GUID: string;
export const ELECTRICITY_BRUSH_GUID: string;
export const ELECTRICITY_DISPLACEMENT_MODS: readonly number[];

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
