import { copyFile } from 'node:fs/promises';

await Promise.all( [
    copyFile( 'src/index.d.ts', 'dist/index.d.ts' ),
    copyFile( 'src/TiltShaderLoader.d.ts', 'dist/TiltShaderLoader.d.ts' )
] );
