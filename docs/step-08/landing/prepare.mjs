import fs from 'node:fs/promises';
import sharp from 'sharp';
import assert from 'node:assert/strict';
const dir=new URL('./',import.meta.url);
const before=await fs.readFile(new URL('before.png',dir));
const {data,info}=await sharp(await fs.readFile(new URL('extension-source.png',dir))).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const w=info.width,h=info.height,mask=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0;
function enqueue(i){if(mask[i])return;const p=i*4,min=Math.min(data[p],data[p+1],data[p+2]),max=Math.max(data[p],data[p+1],data[p+2]);if(data[p+3]===0||(min>=238&&max-min<=12)){mask[i]=1;queue[tail++]=i;}}
for(let x=0;x<w;x++){enqueue(x);enqueue((h-1)*w+x);}for(let y=0;y<h;y++){enqueue(y*w);enqueue(y*w+w-1);}
while(head<tail){const i=queue[head++],x=i%w,y=Math.floor(i/w);if(x)enqueue(i-1);if(x+1<w)enqueue(i+1);if(y)enqueue(i-w);if(y+1<h)enqueue(i+w);}
for(let i=0;i<mask.length;i++)if(mask[i])data[i*4+3]=0;
const cutout=await sharp(data,{raw:{width:w,height:h,channels:4}}).png().toBuffer();
await fs.writeFile(new URL('extension-cutout.png',dir),cutout);
// Land surface center in source at (550,690), mapped to raster (1195,465),
// i.e. logical (1035,375). One uniform scale preserves the source perspective.
const scale=.16,origin={x:1107,y:355};
const small=await sharp(cutout).resize(Math.round(w*scale),Math.round(h*scale)).png().toBuffer();
const extension=await sharp({create:{width:1920,height:1080,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:small,left:origin.x,top:origin.y}]).png().toBuffer();
const final=await sharp(before).composite([{input:extension}]).png().toBuffer();
const output='public/images/pixel/world/islands/invader/island-invader-base.png';
await fs.writeFile(output,final);
const raw=await sharp(final).raw().toBuffer(),old=await sharp(before).raw().toBuffer();
let added=0,opaque=0,changedOriginalOpaque=0,x0=1920,y0=1080,x1=0,y1=0;
for(let i=0;i<1920*1080;i++){const p=i*4;if(old[p+3]>127)opaque++;if(old[p+3]===255&&!raw.subarray(p,p+4).equals(old.subarray(p,p+4)))changedOriginalOpaque++;if(raw[p+3]>127&&old[p+3]<=127)added++;if(raw[p+3]>0){const x=i%1920,y=Math.floor(i/1920);x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}}
assert(changedOriginalOpaque / opaque < .06, "Junction change exceeds 6% of original opaque area");
// Conservative landing footprint, checked against dry stone source surface.
const anchor={x:1195,y:465};let footprintOpaque=true;
for(let y=anchor.y-7;y<=anchor.y+7;y++)for(let x=anchor.x-14;x<=anchor.x+14;x++)if(raw[(y*1920+x)*4+3]!==255)footprintOpaque=false;
assert(footprintOpaque);
// Connected-component test from landing center to the existing shore.
const seen=new Uint8Array(1920*1080),q=new Int32Array(1920*1080);head=0;tail=0;const start=anchor.y*1920+anchor.x;seen[start]=1;q[tail++]=start;let reachesShore=false;
while(head<tail){const i=q[head++],x=i%1920,y=Math.floor(i/1920);if(old[i*4+3]>127)reachesShore=true;for(const n of [x?i-1:-1,x<1919?i+1:-1,y?i-1920:-1,y<1079?i+1920:-1])if(n>=0&&!seen[n]&&raw[n*4+3]>127){seen[n]=1;q[tail++]=n;}}
assert(reachesShore);
const report={output,resolution:[1920,1080],scale,origin,anchor:{logical:{x:1035,y:375},raster:anchor,rgba:[...raw.subarray(start*4,start*4+4)],opaqueFootprint:{width:29,height:15,passed:footprintOpaque}},connectedToOriginalShore:reachesShore,changedOriginalOpaquePixels:changedOriginalOpaque,addedOpaquePixels:added,originalOpaquePixels:opaque,addedAreaPercent:added/opaque*100,alphaBounds:{x:x0,y:y0,width:x1-x0+1,height:y1-y0+1}};
await fs.writeFile(new URL('validation.json',dir),JSON.stringify(report,null,2)+'\n');
await sharp(final).extract({left:1140,top:360,width:210,height:160}).resize(840,640).png().toFile(new URL('landing-closeup.png',dir).pathname);
console.log(JSON.stringify(report,null,2));
