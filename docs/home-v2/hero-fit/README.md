# Hero viewport / delayed navigation revision

This revision supersedes the initial HOME v2 report's growing-Hero decision.

## Changes

- `components/home/HomePage.tsx`: removes header/navigation; reorganizes the introduction into two compact blocks plus a separate positioning line. All original career areas and problem-solving claims retained; redundant wording shortened.
- `components/home/home.module.css`: explicit border-box 100svh Hero with hidden overflow; responsive headline and copy layout; reserved bottom row prevents the delayed button from shifting content. Desktop safe margins ≥32px; mobile 20px horizontal. Short mobile uses 32px headline and 14px body.
- `components/home/DelayedDown.tsx`: new client-only 30-second timer, initial null button, cleanup on unmount. Module deadline retains eligibility across client navigation; scrolling away and back does not reset state. Full document reload starts a new visit. Reduced motion preserves the delay and disables the entrance animation.
- SelectedWork, HomeAnchor, project detail, Prologue, World and Gate source unchanged in this revision.

## QA

Local Chrome, requested viewport dimensions. `qa.json` records measured Hero clientHeight/scrollHeight, text bounds, next-section boundary and runtime exceptions; screenshots in this directory.

| Viewport | Hero height | Hero vertical overflow | Headline / Korean / positioning clipping |
|---|---:|---|---|
| 1440×900 | 900px | None | None |
| 1366×768 | 768px | None | None |
| 768×1024 | 1024px | None | None |
| 390×844 | 844px | None | None |
| 320×568 | 568px | None | None |

No first-screen navigation. Selected Work begins exactly at the viewport boundary. Normal page scrolling remains enabled throughout; the whole HOME naturally scrolls to later sections.

Timer checked using real elapsed time: button absent initially and at 29 seconds; present after 30 seconds, within Hero bounds. Scroll away/back retains visible state. Reduced-motion animationName is none. Button still transfers focus to Work, and carousel next arrow advances to 02 / 03. No runtime exceptions observed.

ESLint, standalone TypeScript check, production build: passed.

Limitations: Chrome emulated dimensions, not physical mobile devices. No Safari/Firefox pass in this revision. Extreme text zoom and viewport sizes outside those requested have not been validated.
