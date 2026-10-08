import fs from 'node:fs/promises';
const target=await(await fetch('http://127.0.0.1:9230/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');

const report={};
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:'http://localhost:3036'});await pause(1600);
const word=await run(`(()=>{const r=document.querySelector('h1 span span span').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})()`);
await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:word.x+word.width/2,y:word.y+word.height/2});await pause(350);
report.hoverStable=await run(`document.querySelector('h1 span span span').getBoundingClientRect().width===${word.width}`);
await run(`document.querySelector('#work').scrollIntoView()`);await pause(200);
await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:900,y:300});await send('Input.dispatchMouseEvent',{type:'mousePressed',x:900,y:300,button:'left',clickCount:1});
for(let x=850;x>=150;x-=50)await send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y:300,button:'left',buttons:1});
await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:150,y:300,button:'left',clickCount:1});await pause(900);
report.drag=await run(`({number:document.querySelector('#work [aria-live]').innerText,stillHome:!!document.querySelector('#work')})`);
const before=await run(`scrollY`);await send('Input.dispatchMouseEvent',{type:'mouseWheel',x:700,y:300,deltaX:0,deltaY:180});await pause(500);report.verticalWheel=await run(`scrollY>${before}`);
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setTouchEmulationEnabled',{enabled:true});await send('Page.navigate',{url:'http://localhost:3036'});await pause(1000);await run(`document.querySelector('#work').scrollIntoView()`);
await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:340,y:180}]});
for(let x=320;x>=40;x-=20){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:180}]});await pause(25)}
await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(900);report.swipe=await run(`document.querySelector('#work [aria-live]').innerText`);
report.errors=errors;await fs.writeFile('docs/home-v2/interaction-qa.json',JSON.stringify(report,null,2));console.log(report);ws.close();
