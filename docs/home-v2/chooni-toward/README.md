# Toward perch and articulated crawl

Changed source: `HomePage.tsx`, `home.module.css`, `ChooniGuide.tsx`, `chooni-guide.module.css` under components/home. Existing project/game/world/prologue files and dependencies unchanged.

## Placement / route

The toward word now provides a measured text anchor. Chooni sits 4px above its text box, horizontally over the right portion of the word. Desktop/tablet use the existing space to the right of the first headline line. Mobile gives toward its own line and reserves 50px above it; the compact 320px layout reserves 36px and uses an 18×21px character.

Three predefined segments: travel right in the clear space above toward, descend the outer right corridor, travel left within the button row. Stops 28px to the RIGHT of the button. Copy/positioning reserve space on the right; obsolete left-side mobile clearance is returned to text. Headline/body font sizes unchanged; line wrapping can change with the clearance.

The placement is calculated after headline entrance and font readiness. Headline text-run rectangles, annotation rectangles, intro paragraphs and positioning are exclusion zones. Checking the three swept rectangles once guards the fixed route; there is no live collision engine. An unsafe route remains static. Font-placement timers are also cleaned up.

## Motion

Button insertion → 350ms pause → 1800ms native translate animation. Cumulative segment lengths define keyframe offsets. Each of four limbs has its own SVG group and anatomical transform-origin. Diagonal pairs use explicitly opposite -3/+3 degree keyframes, twice over the single crawl. Body/chest bob is 0–1.5 SVG px; tail rotates -2/+2 degrees independently. Head contour has no transform animation. No loop or replay. On arrival all gait animations finish and the existing subtle downward gaze remains.

Early scroll and mid-crawl scroll cancel timers and movement and return to the stable initial perch. Reduced motion keeps the character static. Resize cancels and recalculates. Session guard remains in place.

## QA

1440×900 / 1366×768 / 768×1024 / 390×844 plus 320×568: visible initial perch, safe route, Hero exactly viewport height, no overflow. Real-time normal crawls finish 28px beside the button. Frame sampling finds zero text/annotation collisions and zero Hero boundary violations. Early and mid-scroll cancellation and reduced-motion runs stay idle. Runtime exceptions: none.

`interaction.json`: real 30-second timing and route checks. `joint-qa.json`: final opposite-phase CSS sample (manually applies crawling state for inspection), independent origins, fixed head, no running gait animation after arrival (the gaze transition is allowed). `layout.json`: final initial coordinates and screenshots. Full Hero screenshots show initial and arrived states.

Lint, standalone TypeScript and production build passed. Chrome / emulated viewports; physical mobile and other browsers not tested.
