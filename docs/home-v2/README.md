# HOME v2 implementation / QA

Scope: HOME only. No dependencies added. Original project detail, game, intro, world, global style and layout files are unchanged (`git diff --exit-code` verified).

## Files

- `app/page.tsx`: HOME entry; query-based adapter into existing experience.
- `components/home/HomePage.tsx`: server-rendered Hero, About teaser and footer.
- `components/home/HomeAnchor.tsx`: smooth anchor navigation with focus transfer and reduced-motion support.
- `components/home/SelectedWork.tsx`: native horizontal scrolling, mouse drag, touch swipe, keyboard navigation and progress.
- `components/home/ProjectEntry.tsx`: initializes existing scene entry, lazy-loads GameShell, adds HOME return link. Existing detail navigation still works through original scene machine.
- `components/home/home.module.css`: isolated HOME styles; no shared style changes.
- `lib/home-projects.ts`: typed project metadata and reused image paths.

## Verification

- ESLint: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- Chrome desktop 1440, tablet 768, mobile 390 and 320: no document horizontal overflow; three accessible project links.
- Desktop/mobile screenshots visually inspected (1440 and 390).
- Down anchor scrolls to Selected Work and transfers focus.
- Next arrow: 02 / 03; keyboard End: 03 / 03.
- Mouse drag: advances to 02 / 03 without accidental project navigation.
- Emulated touch swipe: advances to 02 / 03.
- Vertical wheel over reel retains vertical document scrolling.
- Serif hover preserves word width; regular and italic share a reserved grid area.
- Reduced motion disables headline animation.
- All three project entry URLs render their original detail headings; HOME return works.
- No browser runtime exceptions in tested flows.
- JSON evidence and screenshots in this directory. Scripts use local app port 3036 and Chrome debugging port 9230.

## Remaining content decisions / limitations

- HARUBAREUN uses 2026.06–08 from the existing detail rather than the brief's conflicting 2025–2026.
- INVADER / FitMate periods not present in current project data: marked `[기간 확인 필요]`.
- Email / LinkedIn / Instagram URLs unavailable: explicit text placeholders, not fabricated links.
- No About destination exists. Teaser temporarily uses `Explore my work` linking to Selected Work; replace with `More about me` once an approved destination is supplied.
- Complete supplied Korean introduction takes precedence over fixed 100svh height; Hero grows on shorter viewports.
- Clean 550ms entry fallback used; no shared-image transition because existing detail hero differs and detail changes are outside scope.
- No optional Chooni interaction added.
- Physical trackpad, real mobile hardware, Safari and Firefox not tested. Native horizontal scrolling is used without wheel interception.
- No deployment performed. Next decision: visual/content review, missing contact/About data, then deployment approval if desired.
