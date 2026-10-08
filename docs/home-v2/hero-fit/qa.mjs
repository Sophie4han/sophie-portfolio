import fs from 'node:fs/promises';
const target=await(await fetch('http://127.0.0.1:9230/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');

const report={};
const started=Date.now();
await send('Page.navigate',{url:'http://localhost:3036'});await pause(2000);
report.before30=await run(`document.querySelector('a[aria-label="Selected Work로 이동"]')===null`);
for(const [width,height] of [[1440,900],[1366,768],[768,1024],[390,844],[320,568]]) {
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await pause(300);
 report[`${width}x${height}`]=await run(`(()=>{const hero=document.querySelector('main > section');const r=hero.getBoundingClientRect();const parts=[...hero.querySelectorAll('h1,p')].map(e=>{const b=e.getBoundingClientRect();const range=document.createRange();range.selectNodeContents(e);const t=range.getBoundingClientRect();return {text:e.textContent,height:b.height,top:b.top,bottom:b.bottom,textInside:t.bottom<=r.bottom&&t.top>=r.top&&t.right<=r.right&&t.left>=r.left}});return {height:r.height,scrollHeight:hero.scrollHeight,clientHeight:hero.clientHeight,overflow:hero.scrollHeight>hero.clientHeight,nav:!!document.querySelector('header nav'),workTop:document.querySelector('#work').getBoundingClientRect().top,parts}})()`);
 await fs.writeFile(`docs/home-v2/hero-fit/${width}x${height}.png`,Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
}
await run(`window.scrollTo(0,300)`);report.directScroll=await run(`scrollY===300`);await run(`window.scrollTo(0,0)`);
await pause(Math.max(0, 29000-(Date.now()-started)));
report.at29Seconds=await run(`document.querySelector('a[aria-label="Selected Work로 이동"]')===null`);
await pause(4000);
report.after30=await run(`(()=>{const a=document.querySelector('a[aria-label="Selected Work로 이동"]');const r=a?.getBoundingClientRect();return {visible:!!a,inside:r&&r.bottom<=innerHeight&&r.top>=0}})()`);
await run(`window.scrollTo(0,700);window.scrollTo(0,0)`);report.returnVisible=await run(`!!document.querySelector('a[aria-label="Selected Work로 이동"]')`);
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});report.reduced=await run(`getComputedStyle(document.querySelector('a[aria-label="Selected Work로 이동"]')).animationName`);
await run(`document.querySelector('a[aria-label="Selected Work로 이동"]').click()`);await pause(200);report.downFocus=await run(`document.activeElement.id`);
await run(`document.querySelector('button[aria-label="다음 프로젝트"]').click()`);await pause(200);report.next=await run(`document.querySelector('#work [aria-live]').innerText`);
report.errors=errors;await fs.writeFile('docs/home-v2/hero-fit/qa.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));ws.close();
