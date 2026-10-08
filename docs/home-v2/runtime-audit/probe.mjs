import fs from 'node:fs/promises';
const target=await(await fetch('http://127.0.0.1:9230/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');


await send('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{window.motionAudit=[];const original=requestAnimationFrame;window.requestAnimationFrame=function(callback){if(!callback.toString().includes('walk-bob'))return original.call(window,callback);return original.call(window,time=>{callback(time);const n=document.querySelector('[data-chooni]');motionAudit.push({time,state:n?.dataset.state,transform:n?.style.transform,pose:n?.dataset.pose,stack:motionAudit.length?undefined:callback.toString()})})}})()`});
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://localhost:3036/'});await send('Page.bringToFront');await pause(3500);
console.log('marker',await run(`({url:location.href,marker:document.querySelector('[data-motion-probe]')?.textContent,count:document.querySelectorAll('[data-chooni]').length,scripts:[...document.scripts].map(s=>s.src).filter(Boolean),workers:navigator.serviceWorker.controller?.scriptURL})`));
await fs.writeFile('docs/home-v2/runtime-audit/marker.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
await pause(11500);
const result=await run(`({url:location.href,frames:motionAudit,marker:!!document.querySelector('[data-motion-probe]'),state:document.querySelector('[data-chooni]')?.dataset.state,styles:[...document.querySelectorAll('link[rel=stylesheet]')].map(e=>e.href),cache:performance.getEntriesByType('resource').filter(e=>e.name.includes('.js')).map(e=>({url:e.name,transfer:e.transferSize}))})`);
await fs.writeFile('docs/home-v2/runtime-audit/probe.json',JSON.stringify({...result,errors},null,2));console.log({frames:result.frames.length,transforms:new Set(result.frames.map(f=>f.transform)).size,first:result.frames[0],last:result.frames.at(-1),errors});ws.close();
