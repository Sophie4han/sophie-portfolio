# HOME Hero — 10-second introduction

## Scope and files

Only HOME Hero changed in this iteration; no dependencies added.

- `components/home/HomePage.tsx`: remove headline/Korean underlines; two inline SVG emphasis marks, each exactly three strokes.
- `components/home/home.module.css`: green/red fan strokes, 280ms single entrance after keyword color; preserve reveal clipping and 100svh layout; pre-hydration scroll lock selector.
- `components/home/DelayedDown.tsx`: four-stage timeline, 10-second scroll lock, button reveal and full cleanup.
- `components/home/ChooniGuide.tsx`: closer toward perch, dot pupils, predefined safe route, one-shot navigation and persistent arrival label.
- `components/home/chooni-guide.module.css`: independent diagonal leg pairs, body/tail motion and final label.

Selected Work, Project Detail, Game, World and Prologue implementation were not changed by this iteration.

## Timeline

1. `introLocked`: no down-button DOM; document overflow/touch movement/wheel/navigation keys locked. Other main sections and footer are temporarily inert. Original styles and inert values are saved. Programmatic scroll correction is instant so global smooth scrolling cannot interfere.
2. At 10,000ms: restore scroll styles/listeners/inert values and render button (`navigationReady`).
3. 350ms later: `chooniWalking`, 2,000ms native transform animation. Four SVG leg groups move in opposing diagonal pairs ±3°, body bobs 0–1.5px, tail sways ±2°. All keyframes run once.
4. `chooniArrived`: stop movement; stay 28px to the right of the button; persist “Let's explore!”.

State persists through Hero scroll reentry and client-side project navigation. A full page reload starts a new introduction. Unmount clears timers, animation and observers and restores previous document styles/listeners/inert values. Motion preference changes are observed.

## Placement and path

The initial perch uses the actual toward text range, with a font whitespace inset to bring the illustration close without covering glyphs. Desktop: 60×70px; tablet: 44×51.333px; mobile: 22×25.667px; narrow/short mobile: 18×21px.

Predefined path: toward → right outer rail → bottom button row → button right. Desktop/tablet rail uses 16px outer padding; mobile uses 2px and a smaller illustration. A one-time swept-rectangle safety check includes headline text, emphasis SVGs, Korean blocks and positioning. No real-time collision engine. An unsafe untested layout skips walking and settles directly.

Scrolling after unlock never relocks the document. Scrolling during walking cancels the animation and settles at the final position. Reduced motion retains the 10-second lock, then immediately applies final position and label with no walking.

## Verification artifacts

`flow-qa.mjs` tests actual Chrome through CDP without accelerating the application timer. It samples actor/text intersections during movement, measures 9.9s/10s states, checks input lock/unlock, reduced motion, mid-walk interruption, client return and unmount cleanup. Results are in `flow-qa.json`. `hover-qa.json` records initial hello, blink, four leg groups and two pupils.

Screenshots:

| Viewport | Before 10s | After arrival |
| --- | --- | --- |
| 1440×900 | [Before](1440-normal-before.png) | [After](1440-normal-after.png) |
| 390×844 | [Before](390-normal-before.png) | [After](390-normal-after.png) |

Screenshots use the development server; the bottom-left Next.js development indicator is not part of the production UI.

## Final QA results

| Viewport | Hero / scroll height | Text collisions | Outside Hero | Final gap |
| --- | --- | --- | --- | --- |
| 1440x900 | 900 / 900px | 0 | 0 | 28px |
| 1366x768 | 768 / 768px | 0 | 0 | 28px |
| 768x1024 | 1024 / 1024px | 0 | 0 | 28px |
| 390x844 | 844 / 844px | 0 | 0 | 28px |
| 320x568 | 568 / 568px | 0 | 0 | 28px |

All five viewports: 9.9s button absent and scroll locked; button/unlock at approximately 10.006–10.007s; walking starts approximately 350ms later. Wheel/key/touch and programmatic pin checks passed. No horizontal overflow. Three emphasis strokes per keyword; no old underlines. All carousel checks reached 02 / 03; down button focused Selected Work. Client navigation returned with arrived state preserved. Reduced-motion, interruption, and unmount cleanup passed. No captured runtime exceptions or console errors, including hydration errors. Chrome emulation only; physical iOS/Safari not tested.

`npm run lint`, `npx tsc --noEmit`, and `npm run build`: passed. `git diff --check`: passed. No deployment performed.
