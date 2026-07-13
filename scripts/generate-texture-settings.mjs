import fs from "node:fs";
import path from "node:path";

const [manifestPath, assetsPath, loaderPath, textureOutputPath, materialOutputPath] =
    process.argv.slice(2);

if (!materialOutputPath) {
    throw new Error(
        "Usage: node scripts/generate-texture-settings.mjs <exportManifest.json> <brush-assets.json> <TiltShaderLoader.js> <texture-output.js> <material-output.js>"
    );
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const assets = JSON.parse(fs.readFileSync(assetsPath, "utf8"));
const loaderSource = fs.readFileSync(loaderPath, "utf8");
const settings = {};

for (const [guid, brush] of Object.entries(manifest.brushes)) {
    const extracted = assets.brushes[guid];
    if (!extracted?.textures) continue;

    for (const [uniformName, texture] of Object.entries(extracted.textures)) {
        if (!texture.importer) continue;
        const escapedFile = texture.file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const bindingPattern = new RegExp(
            `(u_[A-Za-z0-9_]+)\\s*:\\s*\\{\\s*value:\\s*"[^"]*${escapedFile}"`,
            "g"
        );
        const bindings = [...loaderSource.matchAll(bindingPattern)];
        if (bindings.length === 0) continue;
        settings[brush.name] ??= {};
        for (const binding of bindings) {
            settings[brush.name][binding[1] ?? `u_${uniformName}`] = texture.importer;
        }
    }
}

const source = `// Generated from pinned Open Brush texture importer metadata.\n` +
    `// Regenerate with scripts/generate-texture-settings.mjs; do not edit by hand.\n` +
    `export const brushTextureSettings = ${JSON.stringify(settings, null, 4)};\n`;

fs.writeFileSync(textureOutputPath, source);
console.log(`Wrote ${Object.keys(settings).length} brush entries to ${path.resolve(textureOutputPath)}`);

const materialSettings = {};
for (const [guid, brush] of Object.entries(manifest.brushes)) {
    const extracted = assets.brushes[guid];
    if (
        !["standard", "experimental"].includes(extracted?.catalogSection) ||
        extracted.tags?.includes("broken") ||
        typeof extracted.geometry?.renderBackfaces !== "boolean"
    ) continue;
    materialSettings[brush.name] = {
        renderBackfaces: extracted.geometry.renderBackfaces
    };
}

const materialSource = `// Generated from pinned Open Brush brush render metadata.\n` +
    `// Regenerate with scripts/generate-texture-settings.mjs; do not edit by hand.\n` +
    `export const brushMaterialSettings = ${JSON.stringify(materialSettings, null, 4)};\n`;

fs.writeFileSync(materialOutputPath, materialSource);
console.log(`Wrote ${Object.keys(materialSettings).length} brush entries to ${path.resolve(materialOutputPath)}`);
