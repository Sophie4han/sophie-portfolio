# INVADER — ImageGen provenance

Superseded woodland direction. Not used in runtime. Current WATER candidate: `water/generation-prompt.md`.

Tool: built-in `image_gen`, no external provider or npm package added.

## First production candidate

Master reference: `public/images/pixel/world/islands/harubareun/island-harubareun-base.png`.

Source output: `/Users/sophie/.codex/generated_images/01a07ff8-8ca5-7660-8dce-5d1d9a946df9/exec-d9ebfdab-2b66-4962-84bd-d93a6c966811.png`.
Actual dimensions: 1429×1101, RGB, no alpha. Despite transparent-background instructions, a checkerboard was baked into the output.

```text
Use case: stylized-concept.
Asset type: one production transparent PNG floating woodland island for MOVE ON, INVADER / ITERATE region.
Reference image role: the attached HARUBAREUN production island is the MASTER STYLE reference only. Study the small island within its transparent canvas carefully. Match its camera elevation/isometric projection, shallow vertical weathered columnar stone cliff base, irregular island contour, intricate moss/grass/shrub/flower density, mixed woodland canopy tree scale, warm muted cream/sage/moss/wood/stone palette, upper-left soft daylight and detailed high-resolution 2.5D stylized game illustration. It must look like another region of the EXACT same game. No new visual style, no smooth plastic low-poly toy, no heavy pixel grid.
Generate ONE new isolated island centered, filling most of the image with generous transparent padding. Actual RGBA transparent background, no checkerboard paint, no surrounding landscape, no sky, no backdrop, no floating extra objects, no shadow outside the island. Entire canopy and entire short rocky underside visible, not cut off. Overall alpha silhouette width:height approximately 1.30, like the reference (260:205). Natural woodland comes first; architecture small and lower than tallest trees.
Subject: quiet woodland observation and iteration station. Slightly more open woodland than master, but still wooded at the rear and sides with many small mixed broadleaf trees and a few evergreen trees. An irregular, unobtrusive looping dirt-and-stone woodland path circles a small central observation clearing, with a short open entrance at the FRONT LEFT leading naturally into the loop. Keep front-left entrance area open and unobstructed by tall trees/foreground objects, for a future character (do not draw a character).
Landmark: compact circular or semicircular cream stone and dark timber observation pavilion in middle/rear-right clearing. A small muted sage/blue-gray shallow roof and low observation instrument, a tiny wood signal mast with ONE soft amber indicator, integrated quietly into the pavilion. A small peripheral adjustment point with one small blank marker stone or wood lever at a path bend hints at observe > adjust > return, without arrows or diagrams. Avoid a large roof or tower: similar scale to the small workshop in reference. Pavilion clearly different silhouette from reference rectilinear workshop. Most area still vegetation and loop path; keep nature-first hierarchy.
Materials: finely textured foliage, moss at stone joints, irregular stepping stones in earth, small edge shrubs, occasional tiny flowers, visible short vertically striated mossy cliff sides exactly like the master. Keep cliff depth compact.
No text, lettering, numbers, logos, graphs, charts, UI, PM icons, arrows, characters, school, classroom, desks, blackboards, broadcast studio, satellite dish, giant antenna, office, sci-fi laboratory, neon, vivid blue, cyber colors. No workshop packaging or flask copied from master. Subtle muted teal / dusty blue-gray and tiny amber only.
Output one high-resolution transparent cutout, prefer 1536x1024 or larger with undistorted full island. This is one first production candidate, not a concepts sheet.
```

## Background-only correction attempt

Input: first candidate. Output: `exec-8dd33e56-d4ad-41f8-b3ed-e5a416dc9458.png` in the same generated-images directory. Actual dimensions: 1429×1100, RGB, still no alpha. Not a successful transparent production asset.

```text
Use case: background-extraction. Edit target: attached INVADER island candidate. Change ONLY the background: remove the entire gray/white checkerboard and return ACTUAL RGBA transparency (alpha zero outside island), not a simulated transparency checker pattern. Preserve the complete island, exact tree shapes, path, pavilion, colors, lighting, cliff edges and composition. No redesign, no objects added, no resizing/cropping of the subject. Clean natural cutout edges. A single transparent PNG production game sprite. The checkerboard is unwanted backdrop, NOT image content to preserve.
```
