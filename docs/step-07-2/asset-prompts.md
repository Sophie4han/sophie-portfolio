# STEP 07.2 asset provenance

Built-in `image_gen` only. Edits of STEP 07.1 sources, no CLI, new libraries, local upscale, blur or sharpening. Selected outputs copied unchanged into `public/images/pixel/prologue/`.

## Selected background → woodland-clearing-v03.png

Use case: style-transfer. Edit target: supplied woodland background. Preserve EXACT composition, camera, framing, every tree location and size, winding path geometry, clearing, rock/shrub/flower positions and scale. Do not create a new forest. Change ONLY material/shading fidelity to high resolution soft 3D / 2.5D stylized game illustration, halfway between painted illustration and full 3D. Rounded foliage masses with gently lit upper-left surfaces and shaded undersides, cylindrical tree trunks, rounded rocks, subtle contact shadows projecting lower-right. Soft upper-left daylight, ambient fill, muted cream/sage/moss palette retained. Soil path soft relief and recessed grassy edges. Gentle atmospheric distance without blur. Keep tiny flower accents tiny. Retain subtle pixel-inspired illustration identity but reduce flat pixel clusters. No characters, gate, UI, new objects, plastic, gloss, photorealism, cinematic lighting, bloom, fog or depth of field. Keep 3:2 canvas, ideally 3072x2048.

Input: woodland-clearing-v02.png. Output: exec-49b6e2f7-cdee-46fc-964d-0c24305d27a9.png.
Actual output 1536×1024; requested larger canvas was not returned.

## Selected gate material pass

Edit this transparent PNG, retaining its original alpha channel exactly. Keep background and arch hole transparent, not checkerboard. Only soften stone texture into matte soft 2.5D rounded stone, slightly less gritty with cream upper-left highlights and gentle sage shaded right sides, moss volume. Keep exact geometry, silhouette, ivy, ground grass and framing. Export transparent PNG asset.

Input: woodland-gate-v02.png. Output: exec-413eae21-af52-463d-bf53-89a60c67ef4b.png (RGB black background, not used directly).

## Selected gate transparency correction → woodland-gate-v03.png

Remove the black background from this image. Return the exact gate as an isolated cutout on a transparent background, including transparency in the archway. Preserve all gate details, colors, placement, and canvas dimensions. This is background removal only.

Input: preceding material pass. Output: exec-147074fb-6131-428f-b29c-0fb8bac67628.png. Verified 1254×1254 RGBA; outside corner and center opening alpha are 0.

Earlier gate candidates with baked checkerboards were rejected and never installed in the project. Generated outputs live under `/Users/sophie/.codex/generated_images/01a07fd9-67cc-75b3-8211-8ca479181fad/`. Generation reinterprets small leaves/edges; it does not guarantee pixel-identical botanical detail or silhouettes.
