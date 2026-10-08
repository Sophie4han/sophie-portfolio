import fs from 'node:fs/promises';
const target=await(await fetch('http://127.0.0.1:9230/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');


await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.events=[];new MutationObserver(()=>{const n=document.querySelector('[data-chooni]'),b=document.querySelector('[data-down-slot] a');for(const [key,on] of [['button',!!b],['walking',n?.dataset.state==='crawling'],['arrived',n?.dataset.state==='arrived']])if(on&&!events.some(e=>e.key===key))events.push({key,t:performance.now()})}).observe(document,{subtree:true,childList:true,attributes:true,attributeFilter:['data-state']})`});
await send('Page.navigate',{url:'http://localhost:3036/'});await send('Page.bringToFront');await pause(5000);
const before=await run(`({button:!!document.querySelector('[data-down-slot] a'),locked:document.querySelector('[data-down-slot]').dataset.scrollLocked})`);
await pause(8000);
await send('Input.dispatchMouseEvent',{type:'mouseWheel',x:800,y:450,deltaX:0,deltaY:1000});
await send('Input.dispatchKeyEvent',{type:'keyDown',key:'PageDown',code:'PageDown',windowsVirtualKeyCode:34});
await run(`scrollTo(0,800);document.dispatchEvent(new Event('touchmove',{bubbles:true,cancelable:true}))`);await pause(300);
const locked=await run(`({scroll:scrollY,locked:document.querySelector('[data-down-slot]').dataset.scrollLocked,events,workInert:document.getElementById('work').inert})`);
await run(`document.querySelector('[data-down-slot] a').click()`);await pause(1200);
const clicked=await run(`({scroll:scrollY,locked:document.querySelector('[data-down-slot]').dataset.scrollLocked,workInert:document.getElementById('work').inert})`);
await send('Page.reload');await pause(2000);
const reload=await run(`({scroll:scrollY,locked:document.querySelector('[data-down-slot]').dataset.scrollLocked,button:!!document.querySelector('[data-down-slot] a')})`);
const duration=locked.events.find(e=>e.key==='arrived').t-locked.events.find(e=>e.key==='walking').t;
const sync=Math.abs(locked.events.find(e=>e.key==='button').t-locked.events.find(e=>e.key==='walking').t);
console.log({before,locked,clicked,reload,duration,sync,errors});
await fs.writeFile('docs/home-v2/eight-second-navigation/qa.json',JSON.stringify({before,locked,clicked,reload,duration,sync,errors},null,2));
ws.close();if(before.button||locked.scroll!==0||!clicked.scroll||reload.scroll!==0||reload.button||sync>100||duration<3500||duration>4000||errors.length)throw Error('QA failed');
