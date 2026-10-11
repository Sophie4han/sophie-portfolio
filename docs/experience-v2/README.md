# Experience — HOME v2

Route: `/experience`. Entry: fourth HOME Selected Work carousel card (EXPERIENCE / How I got here. / Career Journey). The typography cover uses no image. HOME_CAROUSEL_ITEMS includes Experience; HOME_PROJECTS and project Next navigation remain project-only.

Structure: Intro → DADO GLOBAL / DROPTOP → CAFE KANNA → 29CM → YIC JAPAN (OSAKEDA, Akabane) → INVADER SCHOOL → internal New Business TF / HARUBAREUN branch → separate Product Build / FitMate → current positioning → existing HOME marquee.

Content uses the supplied Experience brief. No invented dates, metrics, images or roles. YIC JAPAN is the employer and OSAKEDA is explicitly the service/brand. HARUBAREUN keeps number 05 as a branch rather than a sixth employer. FitMate is outside the career rail.

Layout: Intro 100svh. Career cases 100svh on desktop (1100px and wider); auto height and at least 100svh below that. Mobile stacks identity, narrative and diagrams. Desktop QA at 1440×900, 1366×768 and 1280×720: all six career cases fit their viewport including every paragraph, diagram and link. Tablet 768×1024 and mobile 390×844 / 320×568 have no text clipping or horizontal overflow. First career starts exactly after Intro.

Interaction: viewport midpoint selects a single Leaf career stage; diagrams activate nodes with 120ms stagger on first entry. Intro phrases fade/translate 12px with 100ms stagger. Reduced motion makes the intro immediate and disables diagram/marquee motion. All copy stays available without hover.

Checks: lint, tsc and production build passed. Browser runtime exceptions: none. HOME → Experience opens at Intro. Project CTAs use existing project IDs and existing detail navigation remains untouched. Screenshots and raw checks are alongside this file.
