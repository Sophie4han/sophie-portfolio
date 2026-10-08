import fs from 'node:fs/promises';
const target=await(await fetch('http://127.0.0.1:9230/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');



await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://localhost:3036'});await pause(3200);
const report={};
async function capture(name) { const r=await run(`document.querySelector('[data-chooni]').getBoundingClientRect().toJSON()`);await fs.writeFile(`docs/home-v2/chooni-face/${name}.png`,Buffer.from((await send('Page.captureScreenshot',{format:'png',clip:{x:r.x-3,y:r.y-3,width:r.width+6,height:r.height+6,scale:6}})).data,'base64')); }
await capture('neutral');
const r=await run(`document.querySelector('[data-chooni]').getBoundingClientRect().toJSON()`);await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:r.x+r.width/2,y:r.y+r.height/2});await pause(250);await capture('hover');
report.hover=await run(`({hello:!!document.querySelector('[data-hello]'),dotCount:document.querySelectorAll('[data-anatomy="gaze"] circle').length,gaze:getComputedStyle(document.querySelector('[data-anatomy="gaze"]')).transform})`);
await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1200,y:100});await pause(250);
// Sample the existing one-shot blink at its closed keyframe without a new blink trigger.
await run(`{const eyes=document.querySelector('[data-anatomy="gaze"] > g');const a=eyes.animate([{transform:'scaleY(1)'},{transform:'scaleY(.08)'},{transform:'scaleY(1)'}],{duration:180});a.pause();a.currentTime=90;window.sampleBlink=a;}`);await capture('blink');await run('sampleBlink.cancel()');
await pause(31000);await capture('arrived');
report.arrival=await run(`({state:document.querySelector('[data-chooni]').dataset.state,dotCount:document.querySelectorAll('[data-anatomy="gaze"] circle').length,gaze:getComputedStyle(document.querySelector('[data-anatomy="gaze"]')).transform,limbs:document.querySelectorAll('[data-limb]').length})`);
await fs.writeFile('docs/home-v2/chooni-face/hero-final.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));report.errors=errors;await fs.writeFile('docs/home-v2/chooni-face/qa.json',JSON.stringify(report,null,2));console.log(report);ws.close();
