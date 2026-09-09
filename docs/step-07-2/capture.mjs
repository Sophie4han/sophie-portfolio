import fs from 'node:fs/promises';
const target = await (await fetch('http://127.0.0.1:9227/json/new?about:blank',{method:'PUT'})).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params);});
const send=(method,params={})=>new Promise((resolve,reject)=>{const i=++id;pending.set(i,m=>m.error?reject({method,...m.error}):resolve(m.result));ws.send(JSON.stringify({id:i,method,params}));});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const shot=async name=>fs.writeFile(`/Users/sophie/sophie-portfolio/docs/step-07-2/after/${name}.png`,Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
const geometry=()=>run(`({scene:document.querySelector('[data-intro-scene]')?.dataset.introScene,phase:document.querySelector('[data-intro-scene]')?.dataset.transitionPhase,gate:document.querySelector('[data-gate-visibility]')?.getBoundingClientRect().toJSON(),actor:document.querySelector('[data-ground-anchor]')?.getBoundingClientRect().toJSON(),dialogue:document.querySelector('[data-speaker]')?.getBoundingClientRect().toJSON(),overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.images].map(i=>({loaded:i.complete&&i.naturalWidth>0,src:i.currentSrc,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,rect:i.getBoundingClientRect().toJSON(),sizes:i.sizes}))})`);
await send('Runtime.enable');await send('Page.enable');await send('Network.enable');await send('Network.clearBrowserCache');await send('Network.setCacheDisabled',{cacheDisabled:true});
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});

await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.__advance=[];const original=window.setTimeout;window.setTimeout=function(fn,ms,...args){if([1100,760,620].includes(ms)){const id=original(()=>fn(...args),60000);window.__advance.push(()=>{clearTimeout(id);fn(...args)});return id;}return original(fn,ms,...args);};`});
const waitFor=async condition=>{for(let n=0;n<80;n++){await send('Page.captureScreenshot',{format:'png'});if(await run(condition))return;await sleep(100);}throw Error('Timed out: '+condition);};
const results={};
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:name==='mobile'});
 await send('Page.navigate',{url:'http://localhost:3020'});await sleep(1500);
 await waitFor(`document.querySelector('[data-intro-scene]')?.dataset.transitionPhase==='idle'&&[...document.images].every(i=>i.complete&&i.naturalWidth)`);
 await sleep(600);await send('Page.captureScreenshot',{format:'png'});await sleep(300);
 results[name+'Greeting']=await geometry();await shot(name+'-greeting');
 await run(`[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Sounds good!')).click()`);
 await waitFor(`document.querySelector('[data-intro-scene]')?.dataset.introScene==='intro-follow'&&document.querySelector('[data-intro-scene]')?.dataset.transitionPhase==='idle'`);
 await sleep(1000);await run(`window.__advance.shift()()`);
 await waitFor(`document.querySelector('[data-intro-scene]')?.dataset.introScene==='intro-gate'&&document.querySelector('[data-intro-scene]')?.dataset.transitionPhase==='idle'&&[...document.images].every(i=>i.complete&&i.naturalWidth)`);
 await sleep(350);await send('Page.captureScreenshot',{format:'png'});
 results[name+'Gate']=await geometry();await shot(name+'-gate-revealed');
 if(name==='desktop'){await sleep(1000);await send('Page.captureScreenshot',{format:'png'});results.desktopPreEntry=await geometry();await shot('desktop-before-gate-entry');}
}
results.errors=errors;results.captureMethod='Production Chrome; only automatic dwell timers held by browser harness for stable visual review, app source and scene events unchanged. Normal automatic flow independently verified in automatic-flow-validation.json.';
await fs.writeFile('/Users/sophie/sophie-portfolio/docs/step-07-2/after/browser-validation.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));ws.close();
