import * as THREE from 'three';

const ENVELOPE_EPSILON = 1e-5;
const EDGE_U_EPSILON = 1e-5;

export function prepareElectricityGeometry(geometry, isNewTiltExporter) {
    if (!isNewTiltExporter) return 'legacy';
    if (geometry.getAttribute('a_texcoord2')) return 'complete';

    const position = geometry.getAttribute('a_position') || geometry.getAttribute('position');
    const uv0 = geometry.getAttribute('a_texcoord0') || geometry.getAttribute('uv');
    if (!position || !uv0 || position.itemSize < 3 || uv0.itemSize < 1) {
        return 'unsupported';
    }

    const vertexCount = position.count;
    const midpoint = new Float32Array(vertexCount * 2);
    const midpointZAndWidth = new Float32Array(vertexCount * 2);
    const paired = new Uint8Array(vertexCount);
    const index = geometry.index;
    const indexCount = index?.count ?? vertexCount;

    const pairEdge = (a, b) => {
        if (a === b || paired[a] || paired[b]) return;
        if (Math.abs(uv0.getX(a) - uv0.getX(b)) > EDGE_U_EPSILON) return;

        const ax = position.getX(a);
        const ay = position.getY(a);
        const az = position.getZ(a);
        const bx = position.getX(b);
        const by = position.getY(b);
        const bz = position.getZ(b);
        const mx = (ax + bx) * 0.5;
        const my = (ay + by) * 0.5;
        const mz = (az + bz) * 0.5;
        const bakedHalfWidth = Math.hypot(ax - bx, ay - by, az - bz) * 0.5;
        const envelope = Math.sin(uv0.getX(a) * Math.PI);
        const envelopePow = 1 - Math.pow(1 - envelope, 10);
        const widthiness = envelopePow > ENVELOPE_EPSILON
            ? bakedHalfWidth / envelopePow / 0.02
            : 0;

        for (const vertex of [a, b]) {
            midpoint[vertex * 2] = mx;
            midpoint[vertex * 2 + 1] = my;
            midpointZAndWidth[vertex * 2] = mz;
            midpointZAndWidth[vertex * 2 + 1] = widthiness;
            paired[vertex] = 1;
        }
    };

    for (let offset = 0; offset + 2 < indexCount; offset += 3) {
        const a = index ? index.getX(offset) : offset;
        const b = index ? index.getX(offset + 1) : offset + 1;
        const c = index ? index.getX(offset + 2) : offset + 2;
        pairEdge(a, b);
        pairEdge(b, c);
        pairEdge(c, a);
    }

    let pairedCount = 0;
    for (const value of paired) pairedCount += value;
    if (pairedCount === 0) return 'unsupported';

    const existingUv1 = geometry.getAttribute('a_texcoord1');
    const packedMidpoints = existingUv1
        && existingUv1.itemSize >= 2
        && looksLikePackedMidpoints(existingUv1, midpoint, paired, position);
    geometry.setAttribute('a_texcoord1', new THREE.BufferAttribute(midpoint, 2));
    geometry.setAttribute('a_texcoord2', new THREE.BufferAttribute(midpointZAndWidth, 2));
    return packedMidpoints ? 'reconstructed-baked' : 'reconstructed-unbaked';
}

function looksLikePackedMidpoints(uv1, midpoint, paired, position) {
    const bounds = new THREE.Box3().setFromBufferAttribute(position);
    const tolerance = Math.max(bounds.getSize(new THREE.Vector3()).length() * 1e-4, 1e-5);
    let compared = 0;
    let error = 0;
    for (let vertex = 0; vertex < position.count; vertex += 1) {
        if (!paired[vertex]) continue;
        const expectedX = midpoint[vertex * 2];
        const expectedY = midpoint[vertex * 2 + 1];
        const actualX = uv1.getX(vertex);
        const actualY = uv1.getY(vertex);
        error += Math.abs(actualX - expectedX);
        error += Math.min(Math.abs(actualY - expectedY), Math.abs(1 - actualY - expectedY));
        compared += 2;
    }
    return compared > 0 && error / compared <= tolerance;
}
