# World final polish — 2026-09-10

The 1920 × 1080 PNGs previously held islands only 251–315 pixels wide. Focus enlarged these downsampled sprites. Re-export now retains original occupied pixels and maps an explicit `productionSourceBounds` to the unchanged logical `visualBounds`. Canvas size, island positions, labels, landing anchors, camera presets and camera implementation are unchanged. FitMate alone has `renderedScale: 1.12`, centered on its existing bbox.

| Island | Before occupied pixels | After occupied pixels |
| --- | --- | --- |
| HARUBAREUN | 291 × 229 | 1261 × 993 |
| INVADER | 315 × 230 | 1278 × 932 |
| FitMate | 251 × 195 | 1102 × 858 |

No new generative edits, nearest-neighbor enlargement, blur or sharpening. INVADER and FitMate use their existing native cutouts without resampling. HARUBAREUN's same original was recovered from `/Users/sophie/.codex/generated_images/01a07727-b68a-7d82-bb8f-6253181953c0/exec-01f182bb-2501-4fb5-a3b9-586bb2ed079b.png`. Its technical neutral backdrop was removed by edge-connected flood fill (minimum RGB >170 and channel spread <22); the retained native cutout is included here. Silhouette, trees and architectural details match the existing island. `export.mjs` packages all three native cutouts into transparent full canvases without enlargement.

## Screenshots

| View | Before | After |
| --- | --- | --- |
| Desktop Overview | [before](before/desktop-overview.png) | [after](after/desktop-overview.png) |
| HARUBAREUN Focus | [before](before/harubareun-focus.png) | [after](after/harubareun-focus.png) |
| INVADER Focus | [before](before/invader-focus.png) | [after](after/invader-focus.png) |
| FitMate Focus | [before](before/fitmate-focus.png) | [after](after/fitmate-focus.png) |
| 390 × 844 Mobile Overview | [before](before/mobile-overview.png) | [after](after/mobile-overview.png) |

Overview and HARUBAREUN Focus use the normal production journey. Locked INVADER/FitMate Focus use the existing isolated development fixtures with the exact WorldScene and camera; progression rules were not changed. Captures use the same viewport and device scale before/after. Focus inspection confirms clearer foliage, cliff seams, pavilion roof and station/bridge masonry. The existing active-state glow remains unchanged.

lint, TypeScript and Webpack production build passed. Browser assertions passed with zero uncaught runtime exceptions and no mobile overflow. `placement-validation.json` confirms unchanged WOOD/WATER Overview dimensions, FitMate ×1.12, and identical label positions. No commit/push.
