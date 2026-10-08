# Hero visual hierarchy refinement

Changed: `components/home/HomePage.tsx`, `components/home/home.module.css` only. Hero layout, headline/body font sizes, Chooni component and timing, and Selected Work onward are unchanged.

## Before / after

Previously the heading and copy were mostly ink; keyword personality depended on hover. Now design and questions are italic at rest, with permanent Leaf Green (#5E9B63) and Raspberry (#C94F68) after entrance. This creates two clear reading anchors without increasing headline size or adding new objects. Two thin body marks connect those anchors to the meaning of the Korean introduction.

- design: one asymmetric near-full-width green stroke.
- questions: short curved raspberry stroke on the right half, distinct from design.
- Body: only 왜 만드는지 and 필요한 문제, with thin green/raspberry marks; body text stays ink.
- Decorative SVGs are aria-hidden, absolutely positioned and take no layout space.

## Sequence

Keyword reveal: design 120–670ms, questions 300–850ms. Color begins 200ms after each reveal, lasts 550ms. Mark draws after color, over 550ms. Body marks draw at 1900ms / 2050ms. No loops, flashes or pulses. Hover only shifts a keyword upward 1px, with no color darkening or font substitution. Reduced motion immediately exposes final italic/color/marks and disables animations.

Expanded reveal clipping allowance preserves italic descenders and annotation strokes without changing the line-height or type size.

## QA

1440×900, 1366×768, 768×1024, 390×844 and additional 320×568: viewport-sized Hero, no vertical or horizontal overflow, four annotations, safe Chooni path. Observed layout-shift total 0 in all five Chrome runs. Final keyword colors verified. Reduced-motion computed animation is none for color and stroke draw, with final stroke offset 0. No runtime exceptions. Desktop/mobile screenshots visually inspected for letter clipping, annotation placement and density.

Lint / standalone TypeScript / production build passed. Chrome emulation only; no new cross-browser/physical-device pass.

Before: `../chooni-pupils/1440.png`; after: `1440.png`. Detailed evidence: `qa.json` and viewport PNGs.
