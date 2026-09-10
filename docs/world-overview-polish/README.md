# World Overview polish — 2026-09-10

Completed without commit/push. Prior STEP 09 local work is retained.

- INVADER: removed the separately composited extension by repackaging its original WATER cutout. Lagoon, water channels and pavilion remain intact. Landing now uses the existing interior dry clearing at world (1130, 305).
- FitMate: built-in imagegen edit removes the external causeway and satellite pad; the paired station, frozen pond and small interior bridge remain. Landing is on the front interior snow/stone clearing at world (850, 710). [Exact prompt](prompt.md).
- HARUBAREUN: uniform enlargement only; no artistic edits.
- Body widths: HARUBAREUN 260 → 291 px (+11.9%), INVADER 281 → 315 px (+12.1%), FitMate approximately 224 → 251 px (+12.1%). Previous external tails are excluded from body measurements. All rasters remain transparent 1920 × 1080 PNGs.
- Retained island horizontal body centers, top alignment, project labels and camera presets. Updated visual bounds and the two authorized landing anchors. Rendering now mounts the World CHOONI placeholder only when an island is focused.
- Progression/lock/camera implementation, Prologue, CHOONI rig and Case Study files unchanged. No packages installed.

Assets:

- `public/images/pixel/world/islands/harubareun/island-harubareun-base.png`
- `public/images/pixel/world/islands/invader/island-invader-base.png`
- `public/images/pixel/world/islands/fitmate/island-fitmate-base.png`

Validation:

- [Desktop Overview](desktop-overview.png), 1440 × 900, and [Mobile Overview](mobile-overview.png), 390 × 844: three compact silhouettes visible, no cropping or overlap, labels retained, central placeholder absent. WOOD/WATER/ICE remain distinct, with ICE supporting the first two islands.
- [INVADER landing closeup](project-02-landing-closeup.png) and [FitMate landing closeup](fitmate-landing-closeup.png): image centers are the new anchors. Both lie on clear interior ground; 25 × 17 raster footprints fully opaque. This validates terrain placement for future DROP → LAND → IDLE; animation/rig implementation is outside this task.
- lint, TypeScript and Webpack production build passed; logs in this directory.
- Browser assertions passed: assets loaded, no overflow/cropping, Overview actor absent, locked FitMate click does not change camera, scoped hover, zero uncaught runtime exceptions. See [browser-validation.json](browser-validation.json).
- `git diff --check`: passed.
