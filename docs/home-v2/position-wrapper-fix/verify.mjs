import fs from 'node:fs/promises';
const target=await(await fetch('http://127.0.0.1:9230/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();const errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');



await send('Emulation.setDeviceMetricsOverride',{width:1440,height:780,deviceScaleFactor:1,mobile:false});
await send('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{const native=Element.prototype.animate;window.positionProbe={calls:[],frames:[]};Element.prototype.animate=function(k,o){const a=native.call(this,k,o);if(this.matches('[data-chooni]')){let square=document.querySelector('#position-probe');if(!square){square=document.createElement('div');square.id='position-probe';square.style.cssText='position:absolute;left:0;top:0;width:20px;height:20px;background:red;z-index:99;pointer-events:none';this.parentElement.append(square)}native.call(square,k,o);positionProbe.calls.push({time:performance.now(),keyframes:k,options:o,safe:this.dataset.pathSafe});if(!positionProbe.started){positionProbe.started=performance.now();const node=this;function sample(){const b=node.getBoundingClientRect(),s=node.querySelector('svg').getBoundingClientRect(),r=square.getBoundingClientRect();positionProbe.frames.push({t:performance.now()-positionProbe.started,x:b.x,y:b.y,svgX:s.x,svgY:s.y,redX:r.x,redY:r.y,transform:getComputedStyle(node).transform,state:node.dataset.state});if(performance.now()-positionProbe.started<2400)requestAnimationFrame(sample)}sample()}}return a}})()`});
await send('Page.navigate',{url:'http://localhost:3036/'});await send('Page.bringToFront');await pause(14000);
const data=await run('positionProbe');
const mid=data.frames.find(f=>f.t>=1000),first=data.frames[0];if(data.calls.length!==5||Math.hypot(mid.x-first.x,mid.y-first.y)<50||mid.state!=='crawling')throw Error('Position did not travel');
await fs.writeFile('docs/home-v2/position-wrapper-fix/after.json',JSON.stringify(data,null,2));console.log({calls:data.calls,mid:data.frames.find(f=>f.t>=1000),end:data.frames.at(-1)});
await run("document.querySelector('#position-probe')?.remove()");ws.close();
