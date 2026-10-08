import fs from 'node:fs/promises';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function check(width,height,mode='normal') {
const target=await(await fetch('http://127.0.0.1:9230/json/new?about:blank',{method:'PUT'})).json();const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown'||(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error'))errors.push(m.params)});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
await send('Page.addScriptToEvaluateOnNewDocument',{source:`const original=window.setTimeout;window.setTimeout=function(fn,delay,...args){if(delay>=9500&&delay<=10000)window.introDeadline=performance.now()+delay;return original.call(this,fn,delay,...args)};`});
if(mode==='reduced')await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await send('Page.navigate',{url:'http://localhost:3036'});
for(let i=0;i<50;i++){if(await run(`!!window.introDeadline&&!!document.querySelector('[data-chooni]')`))break;await pause(150)}
await run(`(()=>{const n=document.querySelector('[data-chooni]'),h=n.closest('section'),slot=h.querySelector('[data-down-slot]');window.qa={events:[],collisions:0,outside:0,frames:0,lockedScrollViolations:0,prematureButton:0};function sample(){const locked=slot.dataset.introStage==='introLocked';if(locked&&scrollY>0)qa.lockedScrollViolations++;if(performance.now()<introDeadline-10&&!!slot.querySelector('a'))qa.prematureButton++;if(getComputedStyle(n).visibility==='visible'){const a=n.getBoundingClientRect(),r=h.getBoundingClientRect();const z=[...h.querySelectorAll('[data-intro] p,[data-positioning],h1 svg')].map(e=>e.getBoundingClientRect());const w=document.createTreeWalker(h.querySelector('h1'),NodeFilter.SHOW_TEXT);while(w.nextNode()){if(!w.currentNode.textContent.trim())continue;const t=document.createRange();t.selectNodeContents(w.currentNode);for(const b of t.getClientRects()){if(h.querySelector('[data-toward]').contains(w.currentNode)){const inset=parseFloat(getComputedStyle(h.querySelector('[data-toward]')).fontSize)*.22;z.push(new DOMRect(b.x,b.y+inset,b.width,b.height-inset))}else z.push(b)}}if(z.some(b=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top))qa.collisions++;if(a.left<r.left||a.right>r.right||a.top<r.top||a.bottom>r.bottom)qa.outside++;qa.frames++;}if(performance.now()<introDeadline+3500)requestAnimationFrame(sample)}sample();new MutationObserver(()=>qa.events.push({ms:performance.now()-introDeadline+10000,stage:slot.dataset.introStage,state:n.dataset.state,button:!!slot.querySelector('a'),overflow:getComputedStyle(document.documentElement).overflow})).observe(h,{subtree:true,attributes:true,attributeFilter:['data-state','data-intro-stage'],childList:true});})()`);
await pause(2200);
await send('Input.dispatchMouseEvent',{type:'mouseWheel',x:width/2,y:height/2,deltaX:0,deltaY:700});
for(const key of ['PageDown',' ','ArrowDown','End'])await send('Input.dispatchKeyEvent',{type:'keyDown',key});
if(width<768){await send('Emulation.setTouchEmulationEnabled',{enabled:true});await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:500}]});await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y:200}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
await pause(200);await run(`qa.lockedInputs={scroll:scrollY,overflow:getComputedStyle(document.documentElement).overflow,button:!!document.querySelector('[data-down-slot] a'),workInert:document.querySelector('#work').inert}`);
await run('scrollTo(0,500)');await pause(150);await run(`qa.programmaticPinned=scrollY===0`);
await fs.writeFile(`docs/home-v2/hero-refinement/${width}-${mode}-before.png`,Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
if(mode==='cleanup'){
 await run(`document.querySelector('a[href="/?project=harubareun"]').click()`);await pause(1300);const result=await run(`({detail:!!document.querySelector('h1'),lockMarker:!!document.querySelector('[data-intro-stage]'),htmlOverflow:document.documentElement.style.overflow,bodyOverflow:document.body.style.overflow})`);result.errors=errors;ws.close();return [`${width}-${mode}`,result];
}
if(mode==='mid')await run(`new MutationObserver((m,o)=>{if(document.querySelector('[data-chooni]').dataset.state==='crawling'){o.disconnect();setTimeout(()=>scrollTo(0,innerHeight+20),400)}}).observe(document.querySelector('[data-chooni]'),{attributes:true,attributeFilter:['data-state']})`);
const remaining=await run('Math.max(0,introDeadline-performance.now()-100)');await pause(remaining);
await run(`qa.nearDeadline={ms:performance.now()-introDeadline+10000,button:!!document.querySelector('[data-down-slot] a'),scroll:scrollY,stage:document.querySelector('[data-down-slot]').dataset.introStage}`);
await pause(700);
if(width===1440&&mode==='normal') {
 await fs.writeFile('docs/home-v2/hero-refinement/1440-walking.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await run(`qa.walking={state:document.querySelector('[data-chooni]').dataset.state,legs:[...document.querySelectorAll('[data-limb]')].map(n=>({limb:n.dataset.limb,transform:getComputedStyle(n).transform,animation:getComputedStyle(n).animationName}))}`);
}
await pause(2600);
await run('scrollTo(0,0)');await pause(200);
const result=await run(`(()=>{const n=document.querySelector('[data-chooni]'),h=n.closest('section'),b=h.querySelector('[data-down-slot] a'),a=n.getBoundingClientRect(),r=b?.getBoundingClientRect();const text=[...n.querySelectorAll('span')].filter(e=>getComputedStyle(e).display!=='none').map(e=>e.innerText).join(' ');return {...qa,stage:h.querySelector('[data-intro-stage]').dataset.introStage,finalState:n.dataset.state,label:text,gap:r?a.left-r.right:null,height:h.clientHeight,scrollHeight:h.scrollHeight,horizontal:document.documentElement.scrollWidth>innerWidth,dashes:[...h.querySelectorAll('h1 svg')].map(s=>s.querySelectorAll('path').length),underlines:h.querySelectorAll('[class*="annotation"],[class*="bodyEmphasis"]').length,htmlOverflow:document.documentElement.style.overflow,bodyOverflow:document.body.style.overflow,workInert:document.querySelector('#work').inert,running:n.getAnimations({subtree:true}).filter(a=>a.playState==='running').length}})()`);
await fs.writeFile(`docs/home-v2/hero-refinement/${width}-${mode}-after.png`,Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
await send('Input.dispatchMouseEvent',{type:'mouseWheel',x:width/2,y:height/2,deltaX:0,deltaY:300});await pause(250);result.unlockedWheel=await run('scrollY>0');await run('scrollTo(0,0)');await pause(100);result.reentry=await run(`({state:document.querySelector('[data-chooni]').dataset.state,stage:document.querySelector('[data-intro-stage]').dataset.introStage,button:!!document.querySelector('[data-down-slot] a')})`);
await run(`document.querySelector('[data-down-slot] a').click()`);await pause(1600);result.down=await run(`({focus:document.activeElement.id,scroll:scrollY})`);
await run(`document.querySelector('button[aria-label="다음 프로젝트"]').click()`);await pause(1600);result.carousel=await run(`document.querySelector('#work [aria-live]').innerText`);
if(width===1440&&mode==='normal'){
 await run(`document.querySelector('a[href="/?project=harubareun"]').click()`);await pause(1700);result.detail=await run(`document.querySelector('h1')?.innerText`);await run(`document.querySelector('a[href="/#work"]').click()`);await pause(1400);result.clientReturn=await run(`({state:document.querySelector('[data-chooni]')?.dataset.state,stage:document.querySelector('[data-intro-stage]')?.dataset.introStage,overflow:document.documentElement.style.overflow})`);
}
result.errors=errors;ws.close();return [`${width}x${height}-${mode}`,result];
}
const entries=[];for(const args of [[1440,900],[1366,768],[768,1024],[390,844],[320,568],[390,844,'reduced'],[390,844,'mid'],[1440,900,'cleanup']])entries.push(await check(...args));
await fs.writeFile('docs/home-v2/hero-refinement/flow-qa.json',JSON.stringify(Object.fromEntries(entries),null,2));console.log(JSON.stringify(Object.fromEntries(entries),null,2));
