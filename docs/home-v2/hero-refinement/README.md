# Hero visual / walking refinement

Changed only `components/home/home.module.css`, `components/home/ChooniGuide.tsx`, and `components/home/chooni-guide.module.css`. No dependencies or timeline/navigation changes.

- Emphasis SVG grew from 0.35em (26–36px) to 0.58em (34–62px), with proportional height and stroke width 1.2 → 1.5. Three strokes and existing colors/entrance remain. Questions has a lower offset to avoid the preceding line.
- Chooni perch moved from 70% to 50% along toward's available width. Font whitespace adjustment increased from 0.12em to 0.22em, bringing the feet closer to the glyph tops. A 3px safety margin remains before the text exclusion boundary.
- Walking uses three discrete SVG leg poses: A → neutral → B → neutral. `steps(1,end)` switches opposing diagonal pairs over 660ms, repeated only three times during the existing 2-second journey. Poses use ±7° rotation, ±2 SVG units horizontal travel, and 1.5 SVG units foot lift. This is a bounded pose cycle, not an idle loop. Head remains fixed; existing restrained body/tail motion remains.
- Existing right-rail route, collision guards, 10-second lock/unlock, 350ms start delay, final 28px gap, reduced motion, and Let's explore state remain.

Screenshots: [initial](1440-normal-before.png), [walking](1440-walking.png), [arrival](1440-normal-after.png).

Verification: `flow-qa.mjs` and `flow-qa.json`. Chrome viewport emulation; not a physical Safari/iOS test.

## Verified results

| Viewport | Hero / scroll height | Text collisions | Outside Hero | Walk ran |
|---|---|---|---|---|
| 1440x900 | 900 / 900px | 0 | 0 | True |
| 1366x768 | 768 / 768px | 0 | 0 | True |
| 768x1024 | 1024 / 1024px | 0 | 0 | True |
| 390x844 | 844 / 844px | 0 | 0 | True |
| 320x568 | 568 / 568px | 0 | 0 | True |

All five completed at 28px right-of-button gap with no running animation. 9.9s lock / 10s unlock, reduced motion, interrupted walk, client return, cleanup and carousel checks passed. No captured console errors or runtime exceptions. Lint, tsc, production build and diff whitespace check passed.
