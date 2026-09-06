# BUILD Island — Quiet Woodland FINAL Candidate v05

Status: visually approved production FINAL. Canonical asset is island-harubareun-base.png. Not runtime-integrated.

## Preserved previous BUILD identity

Primary architectural reference: v02 floating BUILD source. Preserved recognizable cream-stone/dark-frame asymmetric formulation studio, roof planting, elevated corked green flask, open formulation shelf with jars/bottles, lower bottle niche, sample table and entry steps. Packaging retains varied cartons, black-capped bottles, open lime carton and small sample planters. Circular launch platform retains concentric rings and entry stairs. These are generative design continuities, not claims of pixel-identical geometry.

Studio at the rear/left, packaging to its right and launch forward/right form the formulation → packaging → launch narrative. All three have exposed faces and connected small thresholds within the clearing. A compact floating rocky underside remains; environmental contours have been recomposed.

## Transferred from v04

Meaningful tree masses define the rear boundary, sides and entrance, with tall rear-left broadleaf/evergreen canopy, mixed heights behind studio, right-side woodland and smaller front groups. They enclose an open middle rather than decorating a bare platform. A winding earth-and-irregular-stone path enters from lower right, passes the bench and opens into the workshop clearing, connecting the architectural trio. Moss, shrubs, rocks, flowers, stump and fallen log cluster near canopy, path and edges.

Visual hierarchy: forest silhouette → winding entrance path → small central/back clearing → studio → formulation/packaging/launch details. Overview shows the canopy, path and three landmarks; individual jars and carton details require the source image and are not fully readable at Overview resolution. Focus improves landmark distinction but is still the approved 1.55× camera, not a detail-only enlargement.

Canopy visually occupies approximately 50–60% of the above-cliff composition (estimate, not segmented measurement). Green pixel proxy is 62.3% of opaque island pixels including cliff, versus v04's 68.8%; the increase in visible project-specific stone and packaging contributes to this decrease. Green remains dominant. Some yellow-green highlights remain; the existing atmospheric background also retains its warmer sky area. Mood is submitted for visual review, not asserted approved.

## Contract and clearance

- Logical canvas 1600×900; production raster 1920×1080; logical origin at raster (160,90).
- Approved visual box (245,170,300,205) remains; aspect-preserving image fitting is centered within it.
- Measured nonzero-alpha bounds: raster (425,260,260,205), logical (265,170,260,205), entirely within approved bounds.
- Interaction box (220,145,360,250), label (390,135), state (520,175), CHOONI idle (535,375), pointing (565,350) are unchanged.
- Minimum distance to alpha >127 at native raster scale: label 46.8px; state 56.6px; idle 57.0px; pointing 63.6px.
- Anchor points are clear of island art. Actual character silhouette and foot-to-path contact remain unverified: approved world idle/pointing sprites were not composited. No anchors were moved to imply contact. The entrance is inside the island while preserved CHOONI anchors lie outside it.
- Overview uses unchanged centered placement. Focus uses desktop manifest translation (18%,13%), scale 1.55, origin (24%,30%). On the raster: x′=1.55x−11.2, y′=1.55y−81, with 0.2px X rounding. Same method as v04.

## Production and validation

Built-in ImageGen used both inspected v02 architecture and v04 environment as references. Final prompt is stored in `generation-prompt.txt`. The previously mentioned external woodland reference was not available in this session; its user-written principles were followed.

The generated source was RGB with a baked neutral checkerboard. Existing deterministic edge-connected neutral-background removal was reused for alpha packaging; then the cutout was fitted into the approved placement without redrawing island content. Overview and Focus composites were visually inspected after packaging. They are asset review images, not runtime screenshots; no UI or character is painted into the production asset.

- Intermediate generated source: permanently deleted after approval; not a dependency.
- Production: `public/images/pixel/world/islands/harubareun/island-harubareun-base.png`
- Desktop Overview: `composite-desktop-overview-build-woodland-v05.png`
- Desktop BUILD Focus: `composite-desktop-build-focus-build-woodland-v05.png`
- Numeric checks: `validation.json`
- Historical preservation snapshot: removed after final cleanup; original verification below records the pre-cleanup state.
- Final review reproduction from canonical PNG (no source regeneration): `node scripts/world-assets/prepare-build-island-woodland-v05.mjs`

Verified dimensions, alpha containment and script syntax. SHA-256 comparison confirms all 57 snapshotted existing assets/source previews and app/components/lib/types files unchanged, including v01–v04 production assets and manifest/camera code. App lint/build and browser interaction QA were not run for this asset-only change.

Visual approval has been granted. Runtime integration, ITERATE and UNDERSTAND have not started. Old source/production paths mentioned in historical validation are obsolete records, not dependencies.
