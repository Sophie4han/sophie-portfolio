import fs from 'node:fs/promises';
const target=await(await fetch('http://127.0.0.1:9230/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');


const report={};
for (const [width,height] of [[1440,900],[1366,768],[768,1024],[390,844],[320,568]]) {
await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:'http://localhost:3036'});await pause(1800);
report[`${width}x${height}`]=await run(`(()=>{const n=document.querySelector('[data-chooni]');const h=n.closest('section');return {safe:n.dataset.pathSafe,visible:getComputedStyle(n).visibility,actor:n.getBoundingClientRect().toJSON(),height:h.clientHeight,scrollHeight:h.scrollHeight,text:[...h.querySelectorAll('h1,[data-intro] p,[data-positioning]')].map(e=>e.getBoundingClientRect().toJSON())}})()`);
const actor=await run(`document.querySelector('[data-chooni]').getBoundingClientRect().toJSON()`);
await fs.writeFile(`docs/home-v2/chooni-silhouette/${width}-detail.png`,Buffer.from((await send('Page.captureScreenshot',{format:'png',clip:{x:actor.x-2,y:actor.y-2,width:actor.width+4,height:actor.height+4,scale:6}})).data,'base64'));
await fs.writeFile(`docs/home-v2/chooni-silhouette/${width}.png`,Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
}
console.log(JSON.stringify(report,null,2));await fs.writeFile('docs/home-v2/chooni-silhouette/layout.json',JSON.stringify(report,null,2));ws.close();
