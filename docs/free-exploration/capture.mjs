import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const production = process.env.POLISH_PRODUCTION_URL ?? 'http://localhost:3034';
const debuggerUrl = process.env.POLISH_DEBUGGER_URL ?? 'http://127.0.0.1:9229';
const output = new URL('./', import.meta.url);
const metadata = JSON.parse(await fs.readFile(new URL('../world-final-polish/after/asset-validation.json', output), 'utf8'));
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

const key = async (key, code) => {
  await send('Input.dispatchKeyEvent',{type:'rawKeyDown',key,code,windowsVirtualKeyCode:code==='Tab'?9:13});
  if(code==='Enter') await send('Input.dispatchKeyEvent',{type:'char',text:'\r',unmodifiedText:'\r',key:'Enter',windowsVirtualKeyCode:13});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:code==='Tab'?9:13});
};
const activate = async (selector, mode) => {
  if(mode==='keyboard') {
    for(let i=0;i<60;i++) {
      if(await run(`document.activeElement?.matches(${JSON.stringify(selector)})`)) {await key('Enter','Enter');return;}
      await key('Tab','Tab');
    }
    throw Error('Keyboard target not reachable: '+selector);
  }
  const p=await run(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  if(mode==='mobile') {
    await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});
    await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  } else {
    await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});
    await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});
  }
};
try {
  await send('Page.enable');await send('Page.bringToFront');await send('Runtime.enable');
  const results={};
  for(const mode of ['desktop','mobile','keyboard']) {
    await send('Emulation.setDeviceMetricsOverride',{width:mode==='mobile'?390:1440,height:mode==='mobile'?844:900,deviceScaleFactor:1,mobile:mode==='mobile'});
    await send('Page.navigate',{url:production});
    await waitFor(`document.querySelector('[data-intro-scene]')?.dataset.transitionPhase==='idle' && [...document.querySelectorAll('button')].some(b=>b.textContent.includes('Sounds good!')&&!b.disabled)`);
    await sleep(800);
    await run(`[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Sounds good!')).setAttribute('data-reply','true')`);
    await activate('[data-reply]',mode);
    const overview=`document.querySelector('[data-camera-preset]')?.dataset.cameraPreset==='OVERVIEW' && [...document.querySelectorAll('button[data-island]')].length===3 && [...document.querySelectorAll('button[data-island]')].every(b=>b.getAttribute('aria-disabled')==='false')`;
    await waitFor(overview);await sleep(500);
    results[mode]={overview:await measure(),journeys:[]};assertScene(results[mode].overview);
    await screenshot(mode+'-overview');
    for(const [id,preset] of [['fitmate','UNDERSTAND_FOCUS'],['project-02','ITERATE_FOCUS'],['harubareun','BUILD_FOCUS']]) {
      const selector='button[data-island="'+id+'"]';
      await activate(selector,mode);
      await waitFor(`document.querySelector('[data-camera-preset]')?.dataset.cameraPreset==='${preset}' && !!document.querySelector('[aria-labelledby="focused-project-title"]')`);
      await screenshot(mode+'-'+id+'-focus');
      await activate('[aria-labelledby="focused-project-title"] button:last-child',mode);
      await waitFor(overview);
      await activate(selector,mode);
      await waitFor(`!!document.querySelector('[aria-labelledby="focused-project-title"]')`);
      await activate('[aria-labelledby="focused-project-title"] button:first-child',mode);
      await waitFor(`document.querySelector('h1')?.textContent==='island-entry' && [...document.querySelectorAll('button')].some(b=>b.textContent.includes('OPEN CASE STUDY')&&!b.disabled)`);
      await run(`[...document.querySelectorAll('button')].find(b=>b.textContent.includes('OPEN CASE STUDY')).setAttribute('data-open-case','true')`);
      await activate('[data-open-case]',mode);
      await waitFor(`document.querySelector('h1')?.textContent==='case-study-transition' && [...document.querySelectorAll('button')].some(b=>b.textContent.includes('BACK TO WORLD')&&!b.disabled)`);
      await run(`[...document.querySelectorAll('button')].find(b=>b.textContent.includes('BACK TO WORLD')).setAttribute('data-case-back','true')`);
      await activate('[data-case-back]',mode);await waitFor(overview);
      assert((await run('document.body.innerText')).includes('00 / 03 completed'));
      results[mode].journeys.push({id,focusBack:true,caseStudyPlaceholderBack:true,completedCount:0});
    }
  }
  assert.equal(exceptions.length,0);results.exceptions=exceptions;
  await fs.writeFile(new URL('browser-validation.json',output),JSON.stringify(results,null,2));console.log('All desktop, mobile touch, keyboard journeys passed.');
} finally {ws.close();await fetch(`${debuggerUrl}/json/close/${target.id}`);}
