// Rebuild final review composites only. Never modifies the approved canonical asset.
import sharp from 'sharp';
import path from 'node:path';
const root = process.cwd();
const asset = path.join(root, 'public/images/pixel/world/islands/harubareun/island-harubareun-base.png');
const background = path.join(root, 'public/images/pixel/world/shared/world-background-floating-v02.png');
const output = path.join(root, 'docs/world-asset-production/step-02-woodland-v05');
for (const file of [asset, background]) {
  const { width, height } = await sharp(file).metadata();
  if (width !== 1920 || height !== 1080) throw new Error(`Unexpected raster dimensions: ${file}`);
}
const overview = await sharp(background).composite([{ input: asset }]).png().toBuffer();
await sharp(overview).png().toFile(path.join(output, 'composite-desktop-overview-build-woodland-v05.png'));
// Unchanged desktop camera on centered 1600×900 logical canvas:
// translate(18%,13%), scale 1.55, origin(24%,30%); raster X rounds by 0.2px.
await sharp(overview).resize(2976, 1674)
  .extract({ left: 11, top: 81, width: 1920, height: 1080 }).png()
  .toFile(path.join(output, 'composite-desktop-build-focus-build-woodland-v05.png'));
