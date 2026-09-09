# INVADER landing correction

The fixed logical landing destination **(1035,375)** is now on the interior of a dry stone clearing connected to the existing front-left shore by continuous stone terrain. No manifest coordinate, camera preset, progression rule, lock rule or character renderer changed in this correction.

## Asset result

Only runtime asset changed: `public/images/pixel/world/islands/invader/island-invader-base.png`, still 1920×1080 RGBA. The main WATER island retains its size, lagoon, water channels, observation pavilion and lighting. A small landing clearing and narrow connecting terrain extend into the authorized foreground area. Main visualBounds metadata is unchanged; actual alpha expands to logical (994,165,354,249).

The addition was generated using built-in ImageGen from the WATER reference. Its exact prompt and normalization/compositing method are in `prompt.md`; source and before-image are retained here. Reproduce with `node docs/step-08/landing/prepare.mjs` (the earlier `water/prepare-asset.mjs` reproduces v01 without the landing correction).

Added opaque area is 5,809 pixels, 14.6% of the original island's opaque area. 2,131 original opaque pixels change at the connecting shore, approximately 5.4%; the remainder is preserved. The original main island is not enlarged. Desktop Overview keeps the two main island bodies at the same displayed height; the narrow landing approach extends toward the fixed anchor.

## Landing evidence

- Logical (1035,375) maps to raster (1195,465), which samples opaque dry stone color RGBA (245,229,187,255).
- A 29×15 landing footprint around the point is fully opaque and visually on the flat dry interior, not water, raised decoration or the cliff edge.
- Distance from the center to the nearest transparent edge is approximately 19.2 logical pixels.
- Opaque connected-component validation reaches the original shore from the landing point; visual inspection confirms a continuous terrain walkway through the corrected junction.
- No tall foreground plant, rock, waterfall or landmark covers the footprint.
- The existing circular CHOONI placeholder is unchanged. It covers much of the small clearing in normal Focus. `landing-destination.png` hides only that placeholder in the browser harness and marks the fixed point with a thin red circle, to expose the actual ground. This is a diagnostic screenshot, not a renderer change or implemented DROP animation.

## Verification

- `npm run lint`: exit 0.
- `npx --no-install tsc --noEmit`: exit 0.
- `npm run build -- --webpack`: exit 0.
- Desktop Overview 1440×900: complete WOOD and WATER assets visible, no horizontal overflow; WATER identity and landmark retained.
- INVADER Focus 1440×900: complete island plus ledge in view, no HUD overlap. Camera policy unchanged.
- Browser JavaScript exceptions: 0. Locked production selection remains blocked. Development-only Focus page is still HTTP 404 in production.
- `protected-before.sha256` matches manifest, world CSS, scene reducer and progression files after the correction.

Screenshots: `desktop-overview.png`, `desktop-invader-focus.png`, `landing-destination.png`. Numeric evidence: `validation.json`, `browser-validation.json`. Logs: `lint.log`, `typescript.log`, `build.log`, `capture.log`.

No commit or push. Stop for review.
