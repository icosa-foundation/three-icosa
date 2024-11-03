// Copyright 2021-2022 Icosa Gallery
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
    MeshStandardMaterial,
    Vector4,
    Clock
} from 'three';

import { TiltShaderLoader } from '../TiltShaderLoader.js';

export class GLTFGoogleTiltBrushTechniquesExtension {

    constructor(parser, brushPath) {
        this.name = "GOOGLE_tilt_brush_techniques";
        this.parser = parser;
        this.brushPath = brushPath;

        this.materialDefs = {
            "f72ec0e7-a844-4e38-82e3-140c44772699": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 0,
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.600000024
                },
                "normalTexture": {
                    "index": 1,
                    "texCoord": 0
                },
                "name": "brush_OilPaint",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "f72ec0e7-a844-4e38-82e3-140c44772699"
                    }
                }

            },
            "f5c336cf-5108-4b40-ade9-c687504385ab": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 2,
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.600000024
                },
                "normalTexture": {
                    "index": 3,
                    "texCoord": 0
                },
                "name": "brush_Ink",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "f5c336cf-5108-4b40-ade9-c687504385ab"
                    }
                }
            },
            "75b32cf0-fdd6-4d89-a64b-e2a00b247b0f": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 4,
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.600000024
                },
                "normalTexture": {
                    "index": 5,
                    "texCoord": 0
                },
                "name": "brush_ThickPaint",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "75b32cf0-fdd6-4d89-a64b-e2a00b247b0f"
                    }
                }
            },
            "b67c0e81-ce6d-40a8-aeb0-ef036b081aa3": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.300000012,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 6,
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.149999976
                },
                "normalTexture": {
                    "index": 7,
                    "texCoord": 0
                },
                "name": "brush_WetPaint",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "b67c0e81-ce6d-40a8-aeb0-ef036b081aa3"
                    }
                }
            },
            "429ed64a-4e97-4466-84d3-145a861ef684": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.0670000017,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 8,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Marker",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "429ed64a-4e97-4466-84d3-145a861ef684"
                    }
                }
            },
            "d90c6ad8-af0f-4b54-b422-e0f92abe1b3c": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.0670000017,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 9,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_TaperedMarker",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "d90c6ad8-af0f-4b54-b422-e0f92abe1b3c"
                    }
                }
            },
            "0d3889f3-3ede-470c-8af4-de4813306126": {
                "alphaMode": "OPAQUE",
                "doubleSided": true,
                "name": "brush_DoubleTaperedMarker",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "0d3889f3-3ede-470c-8af4-de4813306126"
                    }
                }
            },
            "cf019139-d41c-4eb0-a1d0-5cf54b0a42f3": {
                "alphaMode": "BLEND",
                "alphaCutoff": 0.119999997,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 10,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Highlighter",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "cf019139-d41c-4eb0-a1d0-5cf54b0a42f3"
                    }
                }
            },
            "2d35bcf0-e4d8-452c-97b1-3311be063130": {
                "alphaMode": "OPAQUE",
                "doubleSided": true,
                "name": "brush_Flat",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "2d35bcf0-e4d8-452c-97b1-3311be063130"
                    }
                }
            },
            "b468c1fb-f254-41ed-8ec9-57030bc5660c": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.0670000017,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 11,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_TaperedFlat",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "b468c1fb-f254-41ed-8ec9-57030bc5660c"
                    }
                }
            },
            "0d3889f3-3ede-470c-8af4-f44813306126": {
                "alphaMode": "OPAQUE",
                "doubleSided": true,
                "name": "brush_DoubleTaperedFlat",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "0d3889f3-3ede-470c-8af4-f44813306126"
                    }
                }
            },
            "accb32f5-4509-454f-93f8-1df3fd31df1b": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 12,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_SoftHighlighter",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "accb32f5-4509-454f-93f8-1df3fd31df1b"
                    }
                }
            },
            "2241cd32-8ba2-48a5-9ee7-2caef7e9ed62": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 13,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Light",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "2241cd32-8ba2-48a5-9ee7-2caef7e9ed62"
                    }
                }
            },
            "cb92b597-94ca-4255-b017-0e3f42f12f9e": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 14,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Fire",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "cb92b597-94ca-4255-b017-0e3f42f12f9e"
                    }
                }
            },
            "02ffb866-7fb2-4d15-b761-1012cefb1360": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 15,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Embers",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "02ffb866-7fb2-4d15-b761-1012cefb1360"
                    }
                }
            },
            "70d79cca-b159-4f35-990c-f02193947fe8": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 16,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Smoke",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "70d79cca-b159-4f35-990c-f02193947fe8"
                    }
                }
            },
            "ad1ad437-76e2-450d-a23a-e17f8310b960": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "name": "brush_Rainbow",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "ad1ad437-76e2-450d-a23a-e17f8310b960"
                    }
                }
            },
            "0eb4db27-3f82-408d-b5a1-19ebd7d5b711": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 17,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Stars",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "0eb4db27-3f82-408d-b5a1-19ebd7d5b711"
                    }
                }
            },
            "d229d335-c334-495a-a801-660ac8a87360": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 18,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_VelvetInk",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "d229d335-c334-495a-a801-660ac8a87360"
                    }
                }
            },
            "10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 19,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Waveform",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab"
                    }
                }
            },
            "8dc4a70c-d558-4efd-a5ed-d4e860f40dc3": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.200000003,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 20,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Splatter",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "8dc4a70c-d558-4efd-a5ed-d4e860f40dc3"
                    }
                }
            },
            "d0262945-853c-4481-9cbd-88586bed93cb": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.200000003,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 21,
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.585999966
                },
                "normalTexture": {
                    "index": 22,
                    "texCoord": 0
                },
                "name": "brush_DuctTape",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "d0262945-853c-4481-9cbd-88586bed93cb"
                    }
                }
            },
            "f1114e2e-eb8d-4fde-915a-6e653b54e9f5": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.159999996,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 23,
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.855000019
                },
                "normalTexture": {
                    "index": 24,
                    "texCoord": 0
                },
                "name": "brush_Paper",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "f1114e2e-eb8d-4fde-915a-6e653b54e9f5"
                    }
                }
            },
            "d902ed8b-d0d1-476c-a8de-878a79e3a34c": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 25,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Snow",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "d902ed8b-d0d1-476c-a8de-878a79e3a34c"
                    }
                }
            },
            "1161af82-50cf-47db-9706-0c3576d43c43": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.25,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 26,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_CoarseBristles",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "1161af82-50cf-47db-9706-0c3576d43c43"
                    }
                }
            },
            "5347acf0-a8e2-47b6-8346-30c70719d763": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 27,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_WigglyGraphite",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "5347acf0-a8e2-47b6-8346-30c70719d763"
                    }
                }
            },
            "f6e85de3-6dcc-4e7f-87fd-cee8c3d25d51": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "name": "brush_Electricity",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "f6e85de3-6dcc-4e7f-87fd-cee8c3d25d51"
                    }
                }
            },
            "44bb800a-fbc3-4592-8426-94ecb05ddec3": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 28,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Streamers",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "44bb800a-fbc3-4592-8426-94ecb05ddec3"
                    }
                }
            },
            "dce872c2-7b49-4684-b59b-c45387949c5c": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 29,
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.5
                },
                "normalTexture": {
                    "index": 30,
                    "texCoord": 0
                },
                "name": "brush_Hypercolor",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "dce872c2-7b49-4684-b59b-c45387949c5c"
                    }
                }
            },
            "89d104cd-d012-426b-b5b3-bbaee63ac43c": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 31,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Bubbles",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "89d104cd-d012-426b-b5b3-bbaee63ac43c"
                    }
                }
            },
            "b2ffef01-eaaa-4ab5-aa64-95a2c4f5dbc6": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "name": "brush_NeonPulse",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "b2ffef01-eaaa-4ab5-aa64-95a2c4f5dbc6"
                    }
                }
            },
            "700f3aa8-9a7c-2384-8b8a-ea028905dd8c": {
                "alphaMode": "MASK",
                "alphaCutoff": 0.55400002,
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 32,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_CelVinyl",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "700f3aa8-9a7c-2384-8b8a-ea028905dd8c"
                    }
                }
            },
            "6a1cf9f9-032c-45ec-9b6e-a6680bee32e9": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 33,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_HyperGrid",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "6a1cf9f9-032c-45ec-9b6e-a6680bee32e9"
                    }
                }
            },
            "4391aaaa-df81-4396-9e33-31e4e4930b27": {
                "alphaMode": "OPAQUE",
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 34,
                        "texCoord": 0
                    },
                    "metallicFactor": 0,
                    "roughnessFactor": 0.189999998
                },
                "name": "brush_LightWire",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "4391aaaa-df81-4396-9e33-31e4e4930b27"
                    }
                }
            },
            "0f0ff7b2-a677-45eb-a7d6-0cd7206f4816": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "name": "brush_ChromaticWave",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "0f0ff7b2-a677-45eb-a7d6-0cd7206f4816"
                    }
                }
            },
            "6a1cf9f9-032c-45ec-9b1d-a6680bee30f7": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 35,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Dots",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "6a1cf9f9-032c-45ec-9b1d-a6680bee30f7"
                    }
                }
            },
            "e0abbc80-0f80-e854-4970-8924a0863dcc": {
                "alphaMode": "OPAQUE",
                "doubleSided": true,
                "name": "brush_Petal",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "e0abbc80-0f80-e854-4970-8924a0863dcc"
                    }
                }
            },
            "2f212815-f4d3-c1a4-681a-feeaf9c6dc37": {
                "alphaMode": "OPAQUE",
                "alphaCutoff": 0.5,
                "pbrMetallicRoughness": {
                    "metallicFactor": 0,
                    "roughnessFactor": 0.850000024
                },
                "normalTexture": {
                    "index": 36,
                    "texCoord": 0
                },
                "name": "brush_Icing",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "2f212815-f4d3-c1a4-681a-feeaf9c6dc37"
                    }
                }
            },
            "4391385a-df73-4396-9e33-31e4e4930b27": {
                "alphaMode": "OPAQUE",
                "name": "brush_Toon",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "4391385a-df73-4396-9e33-31e4e4930b27"
                    }
                }
            },
            "4391385a-cf83-4396-9e33-31e4e4930b27": {
                "alphaMode": "OPAQUE",
                "alphaCutoff": 0.0670000017,
                "doubleSided": true,
                "name": "brush_Wire",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "4391385a-cf83-4396-9e33-31e4e4930b27"
                    }
                }
            },
            "cf7f0059-7aeb-53a4-2b67-c83d863a9ffa": {
                "alphaMode": "OPAQUE",
                "name": "brush_Spikes",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "cf7f0059-7aeb-53a4-2b67-c83d863a9ffa"
                    }
                }
            },
            "d381e0f5-3def-4a0d-8853-31e9200bcbda": {
                "alphaMode": "OPAQUE",
                "name": "brush_Lofted",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "d381e0f5-3def-4a0d-8853-31e9200bcbda"
                    }
                }
            },
            "4391aaaa-df73-4396-9e33-31e4e4930b27": {
                "alphaMode": "OPAQUE",
                "name": "brush_Disco",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "4391aaaa-df73-4396-9e33-31e4e4930b27"
                    }
                }
            },
            "1caa6d7d-f015-3f54-3a4b-8b5354d39f81": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 37,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_Comet",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "1caa6d7d-f015-3f54-3a4b-8b5354d39f81"
                    }
                }
            },
            "faaa4d44-fcfb-4177-96be-753ac0421ba3": {
                "alphaMode": "OPAQUE",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "name": "brush_ShinyHull",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "faaa4d44-fcfb-4177-96be-753ac0421ba3"
                    }
                }
            },
            "79348357-432d-4746-8e29-0e25c112e3aa": {
                "alphaMode": "OPAQUE",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "name": "brush_MatteHull",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "79348357-432d-4746-8e29-0e25c112e3aa"
                    }
                }
            },
            "a8fea537-da7c-4d4b-817f-24f074725d6d": {
                "alphaMode": "OPAQUE",
                "alphaCutoff": 0.5,
                "doubleSided": true,
                "name": "brush_UnlitHull",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "a8fea537-da7c-4d4b-817f-24f074725d6d"
                    }
                }
            },
            "c8313697-2563-47fc-832e-290f4c04b901": {
                "alphaMode": "BLEND",
                "doubleSided": true,
                "pbrMetallicRoughness": {
                    "baseColorTexture": {
                        "index": 38,
                        "texCoord": 0
                    },
                    "metallicFactor": 0
                },
                "name": "brush_DiamondHull",
                "extensions": {
                    "GOOGLE_tilt_brush_material": {
                        "guid": "c8313697-2563-47fc-832e-290f4c04b901"
                    }
                }
            }
        };

        // Quick repair of path if required
        if (this.brushPath.slice(this.brushPath.length - 1) !== "/") {
            this.brushPath += "/";
        }

        this.tiltShaderLoader = new TiltShaderLoader(parser.options.manager);
        this.tiltShaderLoader.setPath(brushPath);
        this.clock = new Clock();
    }

    beforeRoot() {
        const parser = this.parser;
        const json = parser.json;
        if (!json.extensionsUsed || !json.extensionsUsed.includes(this.name)) {
            return null;
        }

        if (!json.extensionsUsed.includes("GOOGLE_tilt_brush_material")) {
            json.extensionsUsed.push("GOOGLE_tilt_brush_material");
        }

        let count = 0;

        json.materials.forEach(material => {
            const extensionsDef = material.extensions;

            if (!extensionsDef || !extensionsDef[this.name]) {
                return;
            }

            const guid = material.name.replace("material_", "")
            json.materials[count] = this.materialDefs[guid];

            //MainTex
            let mainTexIndex = extensionsDef.GOOGLE_tilt_brush_techniques.values.MainTex;
            if(mainTexIndex !== undefined) {
                json.materials[count].pbrMetallicRoughness.baseColorTexture.index = mainTexIndex;
            }

            //BumpMap
            let bumpMapIndex = extensionsDef.GOOGLE_tilt_brush_techniques.values.BumpMap;
            if(bumpMapIndex !== undefined) {
                json.materials[count].pbrMetallicRoughness.normalTexture.index = bumpMapIndex;
            }
            count++;

        });

    }
}
