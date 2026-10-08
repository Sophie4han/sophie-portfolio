# Chooni: supplied reference interpretation

Reference: user's screenshot `스크린샷 2026-10-07 오후 5.20.42.png`.

Rebuilt the actual pose and facial silhouette from the attached image: protruding large eyes at different heights, broad tilted head, a continuous cheek-to-cheek mouth, raised neck/chest, four short feet and an upward-curved substantial tail. Removed green/brown coloring and heart. Simplified eye layers into open outlines and short pupil strokes; reduced toe detail. All SVG paths remain unfilled ink strokes.

Source files: `components/home/ChooniGuide.tsx`, `components/home/chooni-guide.module.css`.

The previous 100×60 horizontal illustration is replaced by a 120×140 upright viewBox. Display sizes are 60×70 desktop, 44×51.333 tablet, 24×28 mobile. Hero typography and section layout are unchanged. Existing measured path automatically uses the new actor size. Each eye now blinks around its own center rather than collapsing the two staggered eyes toward one horizontal axis.

QA: five target viewports checked for initial visibility, safe path and no Hero overflow. Real 30-second movement, hover label and reduced-motion checks recorded in interaction.json. Normal runs arrive 28px beside button with no text collisions, out-of-Hero bounds or runtime exceptions. Enlarged character and full Hero screenshots in this directory. Lint, standalone TypeScript and production build passed. Chrome desktop/emulated sizes; no physical-device or cross-browser test in this revision.
