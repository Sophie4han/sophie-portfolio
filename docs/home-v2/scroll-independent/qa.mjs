import fs from 'node:fs/promises';
const target=await(await fetch('http://127.0.0.1:9230/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');


const results=[];
for(const [name,offset] of [['no-scroll',0],['scroll-5px',5],['scroll-50px',50],['fast-scroll',1800]]) {
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://localhost:3036/'});await send('Page.bringToFront');await pause(3000);
 await run(`(()=>{const n=document.querySelector('[data-chooni]'),hero=n.closest('section'),slot=hero.querySelector('[data-down-slot]');window.qa={frames:[],events:[]};new MutationObserver(()=>{qa.events.push({time:performance.now(),state:n.dataset.state,pose:n.dataset.pose});if(n.dataset.state==='arrived')qa.finished=true}).observe(n,{attributes:true,attributeFilter:['data-state']});new MutationObserver((m,o)=>{if(slot.querySelector('a')){qa.unlockAt=performance.now();scrollTo({top:${offset},behavior:'instant'});qa.scrollAfterUnlock=scrollY;qa.stateAtUnlock=n.dataset.state;o.disconnect()}}).observe(slot,{childList:true});function sample(now){const svg=n.querySelector('[data-facing]>svg'),b=svg.getBoundingClientRect(),h=hero.getBoundingClientRect();qa.frames.push({time:now,state:n.dataset.state,pose:n.dataset.pose,x:b.x-h.x,y:b.y-h.y,scroll:scrollY,transform:n.style.transform,legTransforms:[...n.querySelectorAll('[data-limb]')].map(e=>getComputedStyle(e).transform)});if(!qa.finished)requestAnimationFrame(sample)}requestAnimationFrame(sample)})()`);
 await run(`new Promise((resolve,reject)=>{const deadline=performance.now()+16000;function check(){if(qa.finished)return resolve();if(performance.now()>deadline)return reject(Error('No arrival'));setTimeout(check,25)}check()})`);
 const result=await run(`({...qa,waypoints:JSON.parse(document.querySelector('[data-chooni]').dataset.waypoints),rest:[...document.querySelectorAll('[data-limb]')].map(e=>getComputedStyle(e).transform),stage:document.querySelector('[data-intro-stage]').dataset.introStage})`);
 const moving=result.frames.filter(f=>f.state==='crawling');const start=result.events.find(e=>e.state==='crawling').time,end=result.events.find(e=>e.state==='arrived').time;
 const route=result.waypoints;const speed=route.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p.x-route[i].x,p.y-route[i].y),0)/3600;
 const jumps=moving.slice(1).filter((b,i)=>Math.hypot(b.x-moving[i].x,b.y-moving[i].y)>speed*(b.time-moving[i].time)+2).length;
 const summary={name,scroll:result.scrollAfterUnlock,duration:end-start,movingFrames:moving.length,missingPose:moving.filter(f=>!f.pose).length,poseChanges:moving.slice(1).filter((f,i)=>f.pose!==moving[i].pose).length,jumps,neutral:result.rest.every(v=>v==='none'),independentStage:result.stage};
 summary.pass=summary.duration>=3580&&summary.duration<3800&&summary.scroll===offset&&summary.missingPose===0&&summary.poseChanges>=18&&summary.jumps===0&&summary.neutral&&summary.independentStage==='navigationReady';
 console.log(summary);results.push({summary,...result});
}
await fs.writeFile('docs/home-v2/scroll-independent/qa.json',JSON.stringify({results,errors},null,2));ws.close();if(results.some(r=>!r.summary.pass)||errors.length)throw Error('QA failed');
