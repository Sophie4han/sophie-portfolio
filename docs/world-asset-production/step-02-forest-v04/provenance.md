> Historical record — superseded by approved v05. Old production/source/preview images and reproduction scripts named below were permanently removed during final cleanup. These are obsolete visual references, not required dependencies. The floating background, where mentioned, remains available.

# BUILD Forest v04 — Quiet Woodland

Status: visual approval pending. BUILD only; no runtime integration.

## Composition review

- Rear left: tallest broadleaf mass with dark evergreen accents. Rear center: mixed-height canopy behind the workshop. Rear right: medium broadleaf/evergreen group. Front: smaller trees framing a visible path; low growth at the entrance.
- Canopy coverage is visually estimated at 50–60% of the above-cliff composition; this is not a segmented measurement. Green-classified pixels account for 68.8% of opaque island pixels including the cliff (G > 1.04R and G > 1.12B, alpha >127). This color proxy includes grass and moss, not just trees.
- A narrow S-shaped dirt path starts at the lower-right edge, passes between trees, and reaches the central-back clearing. Sparse irregular stones replace the earlier paving network.
- The smaller studio sits inside the rear canopy frame. The formulation bottle and opening remain visible; packaging modules sit to the right; the reduced circular launch pedestal sits forward/right within the clearing. Formulation → packaging → launch remains legible in the source, while tiny details necessarily simplify in Overview.
- Natural detail clusters sit under trees and at path/cliff edges: flowers, rocks, fallen log and moss. Bench, lamp and stump seat provide restrained human presence.
- The island has a rounder, uneven outline with grass/moss overhang. The lower-right path entrance remains visible.
- Visual caveat: some yellow-green highlights and a blocky cliff vocabulary remain. The existing v02 background is reused, including its warmer sky area. Final forest mood acceptance belongs to the visual review.

## Contract and measured validation

- Logical canvas: 1600×900; production raster: 1920×1080; logical origin in raster: (160,90).
- Approved placement box stays (245,170,300,205), raster (405,260,300,205). Aspect-preserving fitting produces actual nonzero-alpha bounds (278,170,234,205) logical / (438,260,234,205) raster. No alpha extends beyond the approved box.
- Interaction bounds: (220,145,360,250); label: (390,135); state: (520,175); idle: (535,375); pointing: (565,350). All unchanged.
- Minimum raster distance from each anchor point to alpha >127: label 49.6px, state 63.6px, idle 65.1px, pointing 74.7px. Points are clear; this does not establish full character silhouette clearance or foot-to-path contact. No approved world idle/pointing sprite was composited. The entrance is inside the island while the preserved anchors sit outside it; future character placement needs visual verification without silently moving anchors.
- Overview uses the established centered raster placement. Focus reproduces the manifest desktop transform: translation (18%,13%), scale 1.55, origin (24%,30%) on the centered logical canvas. Raster transform: x′=1.55x−11.2, y′=1.55y−81; X is rounded by 0.2px. The prior v03 review used a 2× crop; v04 uses the actual preset, so apparent size is not a like-for-like crop comparison.
- These are asset composites, not integrated browser screenshots. UI labels, state and character are not painted into production art.
- Production dimensions, alpha bounds, anchor distances and script syntax checked. Tracked app/components/lib/types/package files have no diff. No app code changed; application lint/build/browser QA were not run for this asset-only review.

## Generation and files

Built-in ImageGen, `precise-object-edit`, using the inspected v03 source. The user-referenced Animal Crossing image was absent from this turn's attachment directory; only the supplied written spatial/mood guidance was used, with no proprietary assets.

- Final prompt: `generation-prompt.txt`
- Selected raw source: `source/island-harubareun-forest-generated-v04.png`
- Production: `public/images/pixel/world/islands/harubareun/island-harubareun-base-v04.png`
- Overview: `composite-desktop-overview-build-forest-v04.png`
- Focus: `composite-desktop-build-focus-build-forest-v04.png`
- Measurements: `validation.json`
- Reproduction: `node scripts/world-assets/prepare-build-island-forest-v04.mjs`

ImageGen returned an RGB source with a baked neutral checkerboard. A subsequent ImageGen alpha-extraction attempt altered the art and added a dark background, so it was rejected. Production uses the first source and the existing edge-connected neutral-background removal routine, followed by alpha trimming and aspect-preserving fitting. Generated source art was not redrawn during packaging. Final composites were visually inspected for a remaining rectangular background.

Next decision: approve or revise BUILD Forest v04 visuals. ITERATE, UNDERSTAND and runtime integration have not started.
