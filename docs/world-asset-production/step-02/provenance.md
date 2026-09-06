> Historical record — superseded by approved v05. Old production/source/preview images and reproduction scripts named below were permanently removed during final cleanup. These are obsolete visual references, not required dependencies. The floating background, where mentioned, remains available.

# World Asset Production Step 02 — BUILD Island

## Selected production direction

The BUILD island uses a stepped terrain-to-launch sequence: formulation studio, modular packaging system, and launch pedestal. It is an abstract project system rather than a literal office, dashboard, or oversized product SKU.

## Generation provenance

- Tool: built-in ImageGen
- Use case: `stylized-concept`, followed by `precise-object-edit` and `background-extraction`
- Source references: the three approved `public/images/pixel/world/shared/` raster layers
- Selected source: `source/island-harubareun-generated-transparent-v01.png`
- Production asset: `public/images/pixel/world/islands/harubareun/island-harubareun-base-v01.png`

## Final generation prompt

Extract the island only from the selected compact BUILD-island revision. Remove every white and light-gray checkerboard square from the background and replace the entire checkerboard region with genuine 0-alpha transparency. Preserve the island geometry, colors, lighting, details, scale, and framing. Produce a clean transparent PNG cutout with antialiased alpha edges and no halo. Do not add, remove, redesign, crop, or move island content. No checkerboard rendered into the pixels; no solid background; no shadow outside the island footprint; no text; no watermark.

## Coordinate contract

- Production raster: 1920×1080
- Logical origin: (160, 90)
- Visual bbox: (245, 170, 300, 205)
- Raster placement: (405, 260, 300, 205)
- Interaction bounds: (220, 145, 360, 250)
- Focus center: (390, 275)
- Label anchor: (390, 135)
- State anchor: (520, 175)
- CHOONI idle: (535, 375)
- CHOONI pointing: (565, 350)
- Foreground overlap zone: x=465–565, y=300–410

The composite previews contain yellow validation guides. They are documentation only and are not part of the production raster.
