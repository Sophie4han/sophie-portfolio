import fs from 'node:fs/promises';
const target=await(await fetch('http://127.0.0.1:9230/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');



await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://localhost:3036'});await pause(3500);
await run(`document.querySelector('[data-chooni]').dataset.state='crawling'`);await pause(450);
const result=await run(`({joints:[...document.querySelectorAll('[data-limb]')].map(g=>({limb:g.dataset.limb,transform:getComputedStyle(g).transform,origin:getComputedStyle(g).transformOrigin})),head:getComputedStyle(document.querySelector('[data-anatomy="head"]')).transform})`);
await pause(1500);await run(`document.querySelector('[data-chooni]').dataset.state='arrived'`);await pause(100);result.runningAfter=await run(`document.querySelector('[data-chooni]').getAnimations({subtree:true}).filter(a=>a.playState==='running' && a.effect.getTiming().duration===1800).length`);await fs.writeFile('docs/home-v2/chooni-toward/joint-qa.json',JSON.stringify(result,null,2));console.log(result);ws.close();
