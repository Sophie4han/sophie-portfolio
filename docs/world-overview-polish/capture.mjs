import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const production = process.env.POLISH_PRODUCTION_URL ?? 'http://localhost:3032';
const debuggerUrl = process.env.POLISH_DEBUGGER_URL ?? 'http://127.0.0.1:9229';
const output = new URL('./', import.meta.url);
const metadata = JSON.parse(await fs.readFile(new URL('asset-validation.json', output), 'utf8'));
const target = await (await fetch(`${debuggerUrl}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let nextId = 0;
const pending = new Map();
const exceptions = [];
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.id) { pending.get(message.id)?.(message); pending.delete(message.id); }
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, message => message.error ? reject(Error(`${method}: ${JSON.stringify(message.error)}`)) : resolve(message.result));
  ws.send(JSON.stringify({ id, method, params }));
});
const run = async expression => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true });
  if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const waitFor = async condition => {
  for (let i = 0; i < 150; i++) {
    try { await send('Page.captureScreenshot', { format:'png' }); } catch (error) {
      if (!error.message.includes('Not attached to an active page')) throw error;
    }
    if (await run(condition)) return;
    await sleep(200);
  }
  await screenshot('capture-failure');
  await fs.writeFile(new URL('capture-failure.json', output), JSON.stringify(await run(`({text:document.body.innerText,images:[...document.images].map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0}))})`), null, 2));
  throw Error(`Timed out: ${condition}`);
};
const screenshot = async name => fs.writeFile(new URL(`${name}.png`, output), Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
const measure = () => run(`(() => {
  const rect = element => element?.getBoundingClientRect().toJSON();
  const definitions = ${JSON.stringify(Object.fromEntries(Object.entries(metadata.islands).map(([id,asset])=>[id,asset.alphaBounds])))};
  const islands = [...document.querySelectorAll('[data-destination]')].map(element => {
    const img = element.querySelector('img');
    const r = img?.getBoundingClientRect();
    const b = definitions[element.dataset.destination];
    const visibleArt = r && b ? { x:r.x+b.x/1920*r.width, y:r.y+b.y/1080*r.height, width:b.width/1920*r.width, height:b.height/1080*r.height } : null;
    return { id:element.dataset.destination, status:img?.dataset.status, loaded:img?.complete && img.naturalWidth>0, raster:rect(img), visibleArt, filter:img ? getComputedStyle(img).filter : null, opacity:img ? getComputedStyle(img).opacity : null, label:rect(element.querySelector('[class*="islandLabel"]')) };
  });
  return { url:location.href, width:innerWidth, height:innerHeight, camera:document.querySelector('[data-camera-preset]')?.dataset.cameraPreset, focused:document.querySelector('[data-camera-preset]')?.dataset.focused, islands, actor:rect(document.querySelector('[data-chooni-intent="world-idle"]')), hud:rect(document.querySelector('[aria-labelledby="focused-project-title"]')), overflow:document.documentElement.scrollWidth>innerWidth, targets:[...document.querySelectorAll('button[data-island]')].map(b=>({id:b.dataset.island,disabled:b.getAttribute('aria-disabled'),rect:rect(b)})) };
})()`);
const assertScene = result => {
  assert.equal(result.overflow, false);
  for (const island of result.islands.filter(island => island.visibleArt)) {
    assert.equal(island.loaded, true);
    if (result.focused === 'false' || island.id === 'fitmate') {
      const b = island.visibleArt;
      assert(b.x >= 0 && b.y >= 0 && b.x+b.width <= result.width && b.y+b.height <= result.height, `${island.id} cropped`);
    }
  }
};

try {
  await sleep(500);
  await send('Page.enable');
  await send('Page.bringToFront');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  const results = { method: 'Production Overview via normal Prologue flow. FitMate Focus via development-only isolated WorldScene fixture. No unlock-rule or app timer overrides.' };
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: name === 'mobile' });
    await send('Page.navigate', { url: production });
    await waitFor(`document.querySelector('[data-intro-scene]')?.dataset.transitionPhase==='idle' && !![...document.querySelectorAll('button')].find(b=>b.textContent.includes('Sounds good!')&&!b.disabled)`);
    await sleep(800);
    const reply = await run(`(() => {const r=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Sounds good!')).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
    await send('Input.dispatchMouseEvent', { type:'mousePressed', button:'left', clickCount:1, ...reply });
    await send('Input.dispatchMouseEvent', { type:'mouseReleased', button:'left', clickCount:1, ...reply });
    await waitFor(`document.querySelector('[data-camera-preset]')?.dataset.cameraPreset==='OVERVIEW' && [...document.images].every(i=>i.complete&&i.naturalWidth>0) && document.querySelector('button[data-island="harubareun"]')?.getAttribute('aria-disabled')==='false'`);
    await sleep(800);
    results[`${name}Overview`] = await measure();
    assertScene(results[`${name}Overview`]);
    assert.equal(results[`${name}Overview`].actor, undefined, 'Overview placeholder must be absent');
    if (name === 'mobile') {
      const fitmate = results.mobileOverview.islands.find(island => island.id === 'fitmate');
      assert(fitmate.label.y >= fitmate.visibleArt.y + fitmate.visibleArt.height + 6, 'Mobile FitMate label overlaps terrain');
      assert(fitmate.label.bottom <= height, 'Mobile FitMate label cropped');
    }
    assert.equal(results[`${name}Overview`].targets.find(t=>t.id==='fitmate').disabled, 'true');
    await screenshot(`${name}-overview`);
    await run(`document.querySelector('button[data-island="fitmate"]').click()`);
    await sleep(500);
    assert.equal(await run(`document.querySelector('[data-camera-preset]').dataset.cameraPreset`), 'OVERVIEW');
    if (name === 'desktop') {
      const targetRect = results.desktopOverview.targets.find(t=>t.id==='harubareun').rect;
      await send('Input.dispatchMouseEvent', { type:'mouseMoved', x:targetRect.x+targetRect.width/2, y:targetRect.y+targetRect.height/2 });
      results.buildHover = await measure();
      assert.equal(results.buildHover.islands.find(i=>i.id==='fitmate').filter, 'none');
      await send('Input.dispatchMouseEvent', { type:'mouseMoved', x:0, y:0 });
    }
  }
  results.exceptions = exceptions;
  assert.equal(exceptions.length, 0);
  await fs.writeFile(new URL('browser-validation.json', output), JSON.stringify(results, null, 2)+'\n');
  console.log(JSON.stringify(results, null, 2));
} finally {
  ws.close();
  await fetch(`${debuggerUrl}/json/close/${target.id}`);
}
