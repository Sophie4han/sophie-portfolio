import fs from 'node:fs/promises';
const target=await (await fetch('http://127.0.0.1:9227/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params);});
const send=(method,params={})=>new Promise((resolve,reject)=>{const i=++id;pending.set(i,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:i,method,params}));});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');await send('Network.enable');
const results=[];
for(const [name,width,height,motion] of [['desktop',1440,900,'no-preference'],['mobile',390,844,'no-preference'],['reduced',1440,900,'reduce']]) {
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:name==='mobile'});
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:motion}]});
 await send('Network.clearBrowserCache');await send('Page.navigate',{url:'http://localhost:3020'});await sleep(1800); for(let n=0;n<80;n++){await send('Page.captureScreenshot',{format:'png'});if(await run(`document.querySelector('[data-intro-scene]')?.dataset.transitionPhase==='idle' && [...document.querySelectorAll('button')].some(b=>b.textContent.includes('Sounds good!')&&!b.disabled)`))break;await sleep(100);}
 await run(`window.__frames=[];window.__gateNode=null;window.__replaced=0;window.__started=performance.now();function sample(){const gate=document.querySelector('[data-gate-visibility]');const img=gate?.querySelector('img');if(gate&&window.__gateNode&&gate!==window.__gateNode)window.__replaced++;if(gate)window.__gateNode=gate;window.__frames.push({t:performance.now()-window.__started,scene:document.querySelector('[data-intro-scene]')?.dataset.introScene||'world',gate:!!gate,opacity:img?+getComputedStyle(img).opacity:null,loaded:img?img.complete&&img.naturalWidth>0:null,actor:document.querySelector('[data-ground-anchor]')?.getBoundingClientRect().x});if(performance.now()-window.__started<7000)requestAnimationFrame(sample)}sample();[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Sounds good!')).click()`);
 for(let n=0;n<75;n++){await send('Page.captureScreenshot',{format:'png'});await sleep(100);if(await run(`!!document.querySelector('[data-camera-preset]')`))break;}
 const result=await run(`({frames:window.__frames,replaced:window.__replaced,world:!!document.querySelector('[data-camera-preset]')})`);
 const visible=result.frames.filter(f=>f.gate);result.name=name;result.opacityRegressions=visible.filter((f,i)=>i&&f.opacity+.005<visible[i-1].opacity).length;result.unloadedVisibleFrames=visible.filter(f=>f.opacity>0&&!f.loaded).length;result.greetingGateFrames=result.frames.filter(f=>f.scene==='intro-greeting'&&f.gate).length;results.push(result);
}
await fs.writeFile('/Users/sophie/sophie-portfolio/docs/step-07-2/reveal-frame-validation.json',JSON.stringify({results,errors},null,2));console.log(results.map(({frames,...r})=>({...r,frameCount:frames.length})));ws.close();
