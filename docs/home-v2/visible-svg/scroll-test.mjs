import fs from 'node:fs/promises';
const target=await(await fetch('http://127.0.0.1:9230/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');


await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://localhost:3036/'});await send('Page.bringToFront');await pause(3000);
await run(`new Promise(resolve=>{function wait(){const n=document.querySelector('[data-chooni]');if(n.dataset.state==='crawling')resolve();else requestAnimationFrame(wait)}wait()})`);
await pause(250);const inspect=`(()=>{const n=document.querySelector('[data-chooni]'),svg=n.querySelector('[data-facing]>svg');return {time:performance.now(),state:n.dataset.state,pose:n.dataset.pose,scroll:scrollY,heroBottom:n.closest('section').getBoundingClientRect().bottom,svg:svg.getBoundingClientRect().toJSON()}})()`;
const before=await run(inspect);await run(`scrollTo({top:12,behavior:'instant'})`);await pause(100);const after=await run(inspect);await pause(6200);const final=await run(inspect);console.log(JSON.stringify({before,after,final}));await fs.writeFile('docs/home-v2/visible-svg/scroll-test.json',JSON.stringify({before,after,final},null,2));ws.close();
