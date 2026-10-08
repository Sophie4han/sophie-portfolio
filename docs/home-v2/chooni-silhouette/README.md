# Chooni silhouette correction

## Problem and change

The previous top-down silhouette merged head and torso. Four thin bent strokes around the body, plus small decorative dashes, resembled insect legs. The narrow curled tail did not establish a clear gecko shape at Hero size.

The revision uses a low three-quarter pose: a distinct rounded head slightly larger in height than the oval torso, exactly four short bent limbs with broad simple feet, and a thick continuous curved tail. Two small oval spots replace scattered dashes. Stroke increases from 1.7 to 2.1 SVG units. Background-colored fills only mask overlaps between anatomy layers, retaining the ink-on-paper line-art appearance.

## Changed source

- `components/home/ChooniGuide.tsx`: SVG only. Explicit `data-limb` paths: rear-far, front-far, rear-near, front-near. Drawing order is far limbs → tail → torso → head → near limbs → markings/eyes/smile/mouth.
- `components/home/chooni-guide.module.css`: blink origin moved to the new eyes (81,21).

Actor dimensions, route, timers, scroll cancellation, hover behavior and reduced-motion logic unchanged. Four limbs remain separate under crawl transforms; only eye groups switch for smiles/blinks.

## Visual QA

Reviewed actual Hero and enlarged character screenshots. The new head/body/tail separation, four broad feet and continuous tail remove the previous insect-like radial limb arrangement. This is a stylized character interpretation, not a realistic anatomical study.

Initial layout verified at 1440×900, 1366×768, 768×1024, 390×844, 320×568: safe route, visible actor, no added Hero overflow. See `layout.json` and viewport PNGs. Enlarged screenshots are labeled `-detail.png`.

Real-time interaction regression checks cover desktop, smallest mobile, and reduced motion. See `interaction.json`: hover greeting expires, once-only blink, 30-second button with 400ms follow-up crawl, 28px final separation, no text collisions or Hero boundary violations, no runtime exceptions. All movement completes; reduced motion stays static.

ESLint, standalone TypeScript and production build passed. Browser checks use Chrome; physical mobile devices and other browsers were not tested in this visual revision.
