# HOME Chooni navigation guide

## Scope / changed files

- New `components/home/ChooniGuide.tsx`: lightweight inline SVG and native Web Animations / timer lifecycle.
- New `components/home/chooni-guide.module.css`: sizing, neutral/smile eyes, once-only blink, hover label and finite crawl accents.
- `components/home/DelayedDown.tsx`: mounts the guide alongside the existing delayed button; exposes its slot as a timing/geometry anchor.
- `components/home/HomePage.tsx`: data attributes identify the intro and positioning exclusion zones.
- `components/home/home.module.css`: reserves a left corridor beside tablet/mobile copy and limits the positioning box to its actual content width.
- No new dependencies. Project Detail, Game, World and Prologue source unchanged.

## Visual / component structure

Ink-colored unfilled SVG gecko: rounded body, tapered curved tail, four short legs, minimal markings, tiny eyes and a short mouth. Separate SVG groups allow eyes to switch to a smile without body movement. Decorative wrapper is aria-hidden and has no tab stop; hello is not essential information.

Initial position: 6px below the headline's bounding box, aligned to the left corridor. No insertion between headline lines. Character dimensions: desktop 80×48px, tablet 56×33.6px, mobile 32×19.2px. Mobile intentionally remains small to preserve the typography and 100svh constraint.

## Interactions

- Blink: once at about 2 seconds, 180ms; skipped for reduced motion.
- Desktop mouse hover: smiling eyes plus a tiny raspberry `hello!` to the right, fading in over 180ms and dismissed after 1.1 seconds even if hover continues. Each pointer-enter session can trigger once. No mobile tap action.
- Button retains its original 30-second delay. Guide starts 400ms after button insertion.
- Native transform animation: 2.4 seconds, a predefined L-shaped route. A small finite body/leg/tail accent gives a crawl rhythm; no scale change, no infinite animation, no repeated route.
- Arrival: smile once, then static. SVG element ends 28px left of button; painted artwork has a little additional internal whitespace.

## Responsive route

| Breakpoint | Corridor x within Hero | Path |
|---|---:|---|
| Desktop ≥1024 | 48px | Below headline → down left of intro → right through reserved button row |
| Tablet 768–1023 | 32px | Same L shape, narrower character; copy/positioning inset 76px |
| Mobile <768 | 5px | Outer left corridor; copy/positioning inset 24px; turn right in button row |

Two corridor rectangles are checked once against headline, intro paragraphs and positioning bounds with a 2px allowance. This is a guard for a predefined route, not a continuously running collision engine. If unsafe, the guide stays static. Font readiness updates the layout; viewport resize cancels and recomputes it.

## Cancellation / accessibility

Any scroll more than 8px conservatively cancels movement, even before Selected Work is reached. It clears pending crawl, blink and greeting timers; running animation is cancelled and the character returns to its stable start. A module session flag prevents replay during client navigation. Full page reload starts a new visit. Unmount disconnects observers/listeners and clears all timers and animations. Button visibility remains governed by the existing deadline.

Reduced motion: no blink, crawl, body/tail accent or greeting transition; static smile is allowed. Button appears after 30 seconds without animation. A preference change during movement also cancels it.

## QA evidence

`layout.json` and initial screenshots: five specified viewports. `interaction.json` and final screenshots: real-time button/crawl checks, hover, early-scroll cancellation, mid-crawl cancellation and reduced motion. Animation frames sample SVG bounding box versus every exclusion zone and Hero bounds.

1440×900, 1366×768, 768×1024, 390×844 and 320×568 retain viewport-sized Hero heights. No text collisions, Hero boundary violations or vertical overflow found. Normal runs finish at 28px button separation. Early scroll and reduced motion remain idle. Hover label appears once and expires while the pointer stays. No runtime exceptions observed.

Lint / standalone TypeScript / production build passed. Chrome desktop and emulated mobile dimensions tested; physical devices, Safari and Firefox not tested. Selected Work and detail source unchanged.
