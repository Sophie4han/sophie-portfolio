import fs from 'node:fs/promises';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const source='docs/step-09/source-v02.png';
const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
// Remove the deliberately generated magenta technical backdrop. Recover edge
// colors from alpha coverage before downsampling so no magenta halo survives.
for(let p=0;p<data.length;p+=4){
 const d=Math.max(0,Math.min(data[p],data[p+2])-data[p+1]);
 const a=1-d/255;
 if(a<.4){data[p]=data[p+1]=data[p+2]=data[p+3]=0;continue;}
 data[p]=Math.max(0,Math.min(255,Math.round((data[p]-255*(1-a))/a)));
 data[p+1]=Math.max(0,Math.min(255,Math.round(data[p+1]/a)));
 data[p+2]=Math.max(0,Math.min(255,Math.round((data[p+2]-255*(1-a))/a)));
 data[p+3]=Math.round(data[p+3]*a);
}
const cutout=await sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).png().toBuffer();
await fs.writeFile('docs/step-09/cutout-v02.png',cutout);
// Uniform fit: main terrain ~224px wide, supporting the two earlier islands.
// Source landing center ~1140,715 maps to raster 1145,845 = logical 985,755.
const scale=.31,origin={x:792,y:623};
const sprite=await sharp(cutout).resize(Math.round(info.width*scale),Math.round(info.height*scale)).png().toBuffer();
const output='public/images/pixel/world/islands/fitmate/island-fitmate-base.png';
await sharp({create:{width:1920,height:1080,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:sprite,left:origin.x,top:origin.y}]).png().toFile(output);
async function inspect(file){
 const bytes=await fs.readFile(file);const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let x0=info.width,y0=info.height,x1=-1,y1=-1,opaque=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const a=data[(y*info.width+x)*4+3];if(a>127)opaque++;if(a>0){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}}
 return {file,width:info.width,height:info.height,channels:info.channels,sha256:createHash('sha256').update(bytes).digest('hex'),alphaBounds:{x:x0,y:y0,width:x1-x0+1,height:y1-y0+1},opaquePixels:opaque,data};
}
const fitmate=await inspect(output),harubareun=await inspect('public/images/pixel/world/islands/harubareun/island-harubareun-base.png'),invader=await inspect('public/images/pixel/world/islands/invader/island-invader-base.png');
const anchor={x:1145,y:845},raw=fitmate.data;let footprintOpaque=true,nearestEdge=Infinity;
for(let y=anchor.y-10;y<=anchor.y+10;y++)for(let x=anchor.x-18;x<=anchor.x+18;x++)if(raw[(y*1920+x)*4+3]<250)footprintOpaque=false;
for(let y=790;y<910;y++)for(let x=1070;x<1220;x++)if(raw[(y*1920+x)*4+3]<128)nearestEdge=Math.min(nearestEdge,Math.hypot(x-anchor.x,y-anchor.y));
assert(footprintOpaque,'Landing footprint is not opaque terrain');
const seen=new Uint8Array(1920*1080),queue=new Int32Array(1920*1080);let head=0,tail=0;const start=anchor.y*1920+anchor.x;seen[start]=1;queue[tail++]=start;let reachesMain=false;
while(head<tail){const i=queue[head++],x=i%1920,y=Math.floor(i/1920);if(x<1050&&y<790)reachesMain=true;for(const n of [x?i-1:-1,x<1919?i+1:-1,y?i-1920:-1,y<1079?i+1920:-1])if(n>=0&&!seen[n]&&raw[n*4+3]>127){seen[n]=1;queue[tail++]=n;}}
assert(reachesMain,'Landing is detached from the main island');
const landing={logical:{x:985,y:755},raster:anchor,rgba:[...raw.subarray(start*4,start*4+4)],footprint:{width:37,height:21,opaque:footprintOpaque},distanceToTransparentEdge:nearestEdge,connectedToMain:reachesMain};
for(const item of [fitmate,harubareun,invader])delete item.data;
const report={source:{path:source,width:info.width,height:info.height},processing:{scale,origin,method:'Chroma alpha extraction/decontamination, uniform downsample, full-world transparent raster'},islands:{harubareun,'project-02':invader,fitmate},landing};
await fs.writeFile('docs/step-09/asset-validation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
