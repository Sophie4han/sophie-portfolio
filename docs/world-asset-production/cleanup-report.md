# BUILD FINAL actual cleanup report

2026-09-07. Actual deletion, no archive relocation. REVIEW REQUIRED: none among the inspected candidates.

## Measurements

Counts include regular files, tracked and untracked; exclude .git, node_modules, .next and symlinks. Bytes are logical file sizes, not filesystem allocation. Git history storage is not reduced by working-tree deletion.

| Scope | Before files | After files | Before bytes | After bytes | Saved bytes |
|---|---:|---:|---:|---:|---:|
| Repository working files | 98 | 71 | 42589549 | 7340723 | 35248826 |
| docs/world-asset-production + public/images/pixel/world + scripts/world-assets | 43 | 16 | 41994857 | 6746031 | 35248826 |

## All deleted files (28)

- `docs/world-asset-production/archived-production/build/island-harubareun-base-v01.png`
- `docs/world-asset-production/archived-production/build/island-harubareun-base-v02.png`
- `docs/world-asset-production/archived-production/build/island-harubareun-base-v03.png`
- `docs/world-asset-production/archived-production/build/island-harubareun-base-v04.png`
- `docs/world-asset-production/step-02/composite-desktop-build-focus-v01.png`
- `docs/world-asset-production/step-02/composite-desktop-overview-v01.png`
- `docs/world-asset-production/step-02/composite-mobile-build-focus-v01.png`
- `docs/world-asset-production/step-02/composite-mobile-contained-overview-v01.png`
- `docs/world-asset-production/step-02/source/island-harubareun-generated-transparent-v01.png`
- `docs/world-asset-production/step-02-correction/composite-desktop-build-focus-floating-v02.png`
- `docs/world-asset-production/step-02-correction/composite-desktop-overview-floating-v02.png`
- `docs/world-asset-production/step-02-correction/source/island-harubareun-floating-generated-v02.png`
- `docs/world-asset-production/step-02-correction/source/world-background-floating-generated-v02.png`
- `docs/world-asset-production/step-02-forest-v03/composite-desktop-build-focus-build-forest-v03.png`
- `docs/world-asset-production/step-02-forest-v03/composite-desktop-overview-build-forest-v03.png`
- `docs/world-asset-production/step-02-forest-v03/source/island-harubareun-forest-generated-v03.png`
- `docs/world-asset-production/step-02-forest-v04/composite-desktop-build-focus-build-forest-v04.png`
- `docs/world-asset-production/step-02-forest-v04/composite-desktop-overview-build-forest-v04.png`
- `docs/world-asset-production/step-02-forest-v04/source/island-harubareun-forest-generated-v04.png`
- `docs/world-asset-production/step-02-woodland-v05/preserved-files.sha256.json`
- `docs/world-asset-production/step-02-woodland-v05/source/island-harubareun-woodland-generated-v05.png`
- `public/images/pixel/world/islands/harubareun/island-harubareun-base-v05.png`
- `public/images/pixel/world/shared/world-background-base-v01.png`
- `public/images/pixel/world/shared/world-environment-distant-v01.png`
- `public/images/pixel/world/shared/world-terrain-base-v01.png`
- `scripts/world-assets/prepare-build-island-floating.mjs`
- `scripts/world-assets/prepare-build-island-forest-v04.mjs`
- `scripts/world-assets/prepare-build-island.mjs`

## All remaining files in cleanup scope (16)

- `docs/world-asset-production/build-production-final.md`
- `docs/world-asset-production/cleanup-report.md`
- `docs/world-asset-production/step-02-correction/provenance.md`
- `docs/world-asset-production/step-02-forest-v03/provenance.md`
- `docs/world-asset-production/step-02-forest-v04/generation-prompt.txt`
- `docs/world-asset-production/step-02-forest-v04/provenance.md`
- `docs/world-asset-production/step-02-forest-v04/validation.json`
- `docs/world-asset-production/step-02-woodland-v05/composite-desktop-build-focus-build-woodland-v05.png`
- `docs/world-asset-production/step-02-woodland-v05/composite-desktop-overview-build-woodland-v05.png`
- `docs/world-asset-production/step-02-woodland-v05/generation-prompt.txt`
- `docs/world-asset-production/step-02-woodland-v05/provenance.md`
- `docs/world-asset-production/step-02-woodland-v05/validation.json`
- `docs/world-asset-production/step-02/provenance.md`
- `public/images/pixel/world/islands/harubareun/island-harubareun-base.png`
- `public/images/pixel/world/shared/world-background-floating-v02.png`
- `scripts/world-assets/prepare-build-island-woodland-v05.mjs`

## Shared classification

- A / retained: world-background-floating-v02.png. Atmospheric background used in approved final review and useful for future floating-world production.
- B / deleted: world-background-base-v01.png and world-environment-distant-v01.png. Only obsolete v01 reproduction used these; not required by final composition or runtime.
- C / deleted: world-terrain-base-v01.png. Superseded continent terrain; only obsolete reproduction referenced it.
- The intermediate floating background source was deleted; the actual normalized shared atmospheric PNG remains.

## Scripts

Only prepare-build-island-woodland-v05.mjs remains. It now reads canonical BUILD and retained floating background to recreate the two final review composites. It never writes production and has no deleted-source dependency. All three v01–v04 reproduction scripts were deleted, including the unused-variable warning source.

## Validation

- Canonical SHA-256 unchanged: 3520383354937b99565f64f7d36a9e247ccdcb5fa1761e284952103fd255a56e.
- Retained script ran successfully; both final previews are byte-identical to their pre-cleanup versions.
- Shared floating background and app/components/lib/types protected files are byte-identical.
- Historical provenance explicitly marks removed image/script references obsolete; v05 provenance now points to canonical and final-only review reproduction. Prompts and small validation records remain lightweight history.
- npm run lint: exit 0, 0 errors, 0 warnings.
- No runtime/manifest/camera/coordinate/CHOONI changes. No ITERATE/UNDERSTAND.

## Git status

```text
 D public/images/pixel/world/shared/world-background-base-v01.png
 D public/images/pixel/world/shared/world-environment-distant-v01.png
 D public/images/pixel/world/shared/world-terrain-base-v01.png
?? docs/world-asset-production/
?? public/images/pixel/world/islands/
?? public/images/pixel/world/shared/world-background-floating-v02.png
?? scripts/
```

No staging or commit performed. Removed untracked files do not appear as D in git status; the deletion inventory above includes them.
