import fs from 'node:fs/promises';
const target=await(await fetch('http://127.0.0.1:9230/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');



const report={};
await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.layoutShifts=[];new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)layoutShifts.push(e.value)}).observe({type:'layout-shift',buffered:true})`});
for(const [width,height] of [[1440,900],[1366,768],[768,1024],[390,844],[320,568]]) {
await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://localhost:3036'});await pause(3500);
report[`${width}x${height}`]=await run(`(()=>{const h=document.querySelector('main>section');const words=[...h.querySelectorAll('h1 svg')].map(s=>({color:getComputedStyle(s.previousElementSibling).color,italic:getComputedStyle(s.parentElement).fontStyle,draw:getComputedStyle(s.querySelector('path')).strokeDashoffset,rect:s.getBoundingClientRect().toJSON()}));return {heroHeight:h.clientHeight,overflow:h.scrollHeight>h.clientHeight,horizontal:document.documentElement.scrollWidth>innerWidth,words,annotations:h.querySelectorAll('svg[aria-hidden]').length,chooniSafe:document.querySelector('[data-chooni]').dataset.pathSafe,cls:layoutShifts.reduce((a,b)=>a+b,0)}})()`);
await fs.writeFile(`docs/home-v2/hierarchy/${width}.png`,Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
}
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await send('Page.navigate',{url:'http://localhost:3036'});await pause(1200);
report.reduced=await run(`[...document.querySelectorAll('h1 svg')].map(s=>({color:getComputedStyle(s.previousElementSibling).color,colorAnimation:getComputedStyle(s.previousElementSibling).animationName,drawAnimation:getComputedStyle(s.querySelector('path')).animationName,offset:getComputedStyle(s.querySelector('path')).strokeDashoffset}))`);
report.errors=errors;await fs.writeFile('docs/home-v2/hierarchy/qa.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));ws.close();
