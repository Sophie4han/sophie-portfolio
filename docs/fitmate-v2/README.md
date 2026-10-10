# FITMATE single-scroll renewal

## Structure and source mapping

Hero → Problem → Core Experience → Define the MVP → Make It Work → Design the States → Build → Test & Iterate → Shipped → Result / My Role → Reflection → slim marquee.

- Strategy sections: original problem/hypothesis/direction, seven-step product loop and MVP/expansion priorities.
- Technical sections: original components/colors/typography, architecture, auth, mate connection, realtime sessions, exception states, conceptual data model and reward loop. Existing ownership labels retained.
- Test sections: all four validated flows and both GitHub PR screenshots retained. Version progression moved to Shipped.
- From Plan to Product: requirement translation moved to Make It Work; repeated positioning statements consolidated into role/results/reflection. Role scope and collaboration retained.
- Shared ProjectNavigation remains unchanged. ProjectEntry renders FITMATE directly.

## Reused evidence

11 existing assets: five-screen overview; components, colors, typography, GitHub README; mate connection, realtime exercise, reward/shop, history/mypage; early and refinement GitHub PRs. No new raster assets. The old logo is no longer used as the hero headline; the asset remains on disk.

Personal contribution: product/UX structure, onboarding, mate connection, main experience, shop/avatar state and UI/UX refinement. Team product: realtime exercise/session architecture, shared testing/PR history, and release. Visual design credited to collaborating designer.

## Verification

- npm run lint: passed without warnings.
- npx tsc --noEmit: passed.
- npm run build: passed.
- Browser: localhost:3036/?project=fitmate, 1440×900, 768×1024, 390×844, 320×568; no horizontal overflow or runtime exceptions. One h1 and ten chapters after Hero, no old click-through controls.
- All 11 images decoded successfully.
- All seven core loop steps, two MVP phases, five user states and seven test/implementation steps activated in sequence during scroll.
- Reduced motion: marquee stopped and evidence transitions disabled.
- Screenshots and raw QA results stored alongside this file.
- Common Back links retain /#work. An initial return check showed the Hero; a subsequent comparison confirmed both HARUBAREUN and FITMATE return with Selected Work visible and the intro unlocked (back-comparison.json). HOME scroll-lock and shared navigation were not changed by this task.
