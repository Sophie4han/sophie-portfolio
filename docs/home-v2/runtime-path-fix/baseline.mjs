import fs from 'node:fs/promises';
const target=await(await fetch('http://127.0.0.1:9230/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');


const report={};
for(const [width,height] of [[1440,900]]) {
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://localhost:3036'});await send('Page.bringToFront');await pause(3000);
 await run(`(()=>{window.trace=[];window.hits=0;const n=document.querySelector('[data-chooni]'),h=n.closest('section');const zones=[...h.querySelectorAll('[data-intro] p,[data-positioning],h1 svg')].map(e=>e.getBoundingClientRect());const word=h.querySelector('[data-toward]');const w=document.createTreeWalker(h.querySelector('h1'),NodeFilter.SHOW_TEXT);while(w.nextNode()){if(!w.currentNode.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(w.currentNode);for(const b of r.getClientRects()){const inset=word.contains(w.currentNode)?parseFloat(getComputedStyle(word).fontSize)*.22:0;zones.push(new DOMRect(b.x,b.y+inset,b.width,b.height-inset))}}function tick(){const b=n.getBoundingClientRect();if(n.dataset.state==='crawling'){trace.push({segment:n.dataset.segment,direction:n.dataset.direction,x:b.x,y:b.y,face:getComputedStyle(n.querySelector('svg')).transform,legs:[...n.querySelectorAll('[data-limb]')].map(e=>getComputedStyle(e).transform)});if(zones.some(z=>b.left<z.right&&b.right>z.left&&b.top<z.bottom&&b.bottom>z.top))hits++;}if(n.dataset.state!=='arrived')requestAnimationFrame(tick)}tick()})()`);
 if(width===1440)await fs.writeFile('docs/home-v2/runtime-path-fix/baseline-start.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 const captured=new Set();const deadline=Date.now()+16000;
 while(Date.now()<deadline){
  const state=await run(`({state:document.querySelector('[data-chooni]').dataset.state,segment:document.querySelector('[data-chooni]').dataset.segment})`);
  if(width===1440&&state.segment&&!captured.has(state.segment)){captured.add(state.segment);await fs.writeFile(`docs/home-v2/runtime-path-fix/baseline-segment-${state.segment}.png`,Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));}
  if(state.state==='arrived')break;await pause(30);
 }
 report[`${width}x${height}`]=await run(`(()=>{const n=document.querySelector('[data-chooni]'),h=n.closest('section'),b=h.querySelector('[data-down-slot] a');return {trace,hits,safe:n.dataset.pathSafe,final:n.dataset.state,gap:n.getBoundingClientRect().left-b.getBoundingClientRect().right,height:h.clientHeight,scrollHeight:h.scrollHeight,running:n.getAnimations({subtree:true}).filter(a=>a.playState==='running').length}})()`);
 if(width===1440)await fs.writeFile('docs/home-v2/runtime-path-fix/baseline-final.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 console.log(width,JSON.stringify({...report[`${width}x${height}`],trace:undefined,segments:[...new Set(report[`${width}x${height}`].trace.map(e=>e.segment))]}));
}
await fs.writeFile('docs/home-v2/runtime-path-fix/baseline-qa.json',JSON.stringify({report,errors},null,2));ws.close();
