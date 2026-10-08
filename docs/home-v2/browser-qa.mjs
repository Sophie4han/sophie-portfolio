import fs from 'node:fs/promises';
const target=await(await fetch('http://127.0.0.1:9230/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');
const report={};
for(const width of [1440,768,390,320]){
await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://localhost:3036'});await pause(2500);
report[width]=await run(`({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelector('h1')?.innerText,links:document.querySelectorAll('a[href^="/?project="]').length})`);
await fs.writeFile(`docs/home-v2/${width}.png`,Buffer.from((await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));
}
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
await run(`document.querySelector('a[aria-label="Selected Work로 이동"]').click()`);await pause(900);
report.down=await run(`({focused:document.activeElement.id,top:document.querySelector('#work').getBoundingClientRect().top})`);
await run(`document.querySelector('button[aria-label="다음 프로젝트"]').click()`);await pause(800);report.next=await run(`document.querySelector('#work [aria-live]').innerText`);
await run(`document.querySelector('[aria-label^="프로젝트 목록"]').focus()`);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'End',code:'End'});await pause(800);report.keyboard=await run(`document.querySelector('#work [aria-live]').innerText`);
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});report.reduced=await run(`getComputedStyle(document.querySelector('h1 > span > span')).animationName`);
for(const project of ['harubareun','project-02','fitmate']){await send('Page.navigate',{url:'http://localhost:3036/?project='+project});await pause(3000);report[project]=await run(`({heading:document.querySelector('h1')?.textContent,home:!!document.querySelector('a[href="/#work"]')})`)}
await run(`document.querySelector('a[href="/#work"]').click()`);await pause(1500);report.returnHome=await run(`!!document.querySelector('#work')`);
report.errors=errors;await fs.writeFile('docs/home-v2/browser-qa.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));ws.close();
