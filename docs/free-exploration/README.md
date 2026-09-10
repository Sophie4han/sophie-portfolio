# World navigation — free exploration

All three projects are available from the initial empty completion state. Completion records are deduplicated in display order, including non-prefix records such as FitMate alone. They affect progress presentation but never access. BUILD / ITERATE / UNDERSTAND and their existing numbers remain presentation labels. The reducer no longer rejects selection based on prior project completion.

The existing Case Study implementation is a foundation placeholder, not authored project content. Added OPEN CASE STUDY and BACK TO WORLD controls to the existing entry/placeholder flow so it is reachable for any project and does not strand visitors. No case-study content or project page has been invented.

Runtime files changed in this task:

- `lib/project-progression.ts`
- `lib/scene-machine.ts`
- `lib/scene-descriptors.ts` (Case Study return event only)
- `components/game/SceneViewport.tsx` (foundation entry/return controls only)

World visuals, renderer, island images, manifest/cameras/positions, Prologue and CHOONI retain the preceding task's state. Earlier uncommitted changes remain in the working tree. No commit/push.

Verification logs and screenshots are in this directory. Browser harness uses production, normal Prologue flow, native mouse/touch and Tab/Enter inputs. Each mode explores FitMate → INVADER → HARUBAREUN with zero completed projects, checking Focus → Back and entry → Case Study placeholder → Back.

Final result: all nine project/mode journeys passed, zero uncaught runtime exceptions. Desktop and 390 × 844 mobile Overview have no overflow. lint, TypeScript, Webpack production build and `git diff --check` passed. See `browser-validation.json`, `capture.log`, `lint.log`, `typescript.log`, `build.log` and `progression-test.log`.

Progression tests cover all eight completion subsets × three island selections (24 combinations), including nonsequential and duplicate completion records. Reproduce with:

```sh
npx --no-install tsc lib/project-progression.ts lib/scene-machine.ts --outDir /tmp/free-exploration-tests --module commonjs --target es2020 --skipLibCheck
node docs/free-exploration/progression.test.mjs
```
