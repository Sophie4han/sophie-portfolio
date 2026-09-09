// Deterministic sprite packaging only: edge-connected backdrop extraction,
// aspect-preserving fit and transparent full-world canvas. No art redraw.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { createHash } from 'node:crypto';

const root = process.cwd();
const source = `${root}/docs/step-08/water/source-v01.png`;
const output = `${root}/public/images/pixel/world/islands/invader/island-invader-base.png`;
const master = `${root}/public/images/pixel/world/islands/harubareun/island-harubareun-base.png`;
const sourceMeta = await sharp(source).metadata();
const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject:true });
const { width, height } = info;
const removed = new Uint8Array(width*height);
const queue = new Int32Array(width*height);
let head=0, tail=0;
const enqueue = index => {
  if (removed[index]) return;
  const offset=index*4;
  const min=Math.min(data[offset],data[offset+1],data[offset+2]);
  const max=Math.max(data[offset],data[offset+1],data[offset+2]);
  if (data[offset+3]===0 || (min>=238 && max-min<=12)) {
    removed[index]=1; queue[tail++]=index;
  }
};
for(let x=0;x<width;x++){enqueue(x);enqueue((height-1)*width+x);}
for(let y=0;y<height;y++){enqueue(y*width);enqueue(y*width+width-1);}
while(head<tail){
  const index=queue[head++],x=index%width,y=Math.floor(index/width);
  if(x>0)enqueue(index-1);if(x+1<width)enqueue(index+1);
  if(y>0)enqueue(index-width);if(y+1<height)enqueue(index+width);
}
for(let i=0;i<removed.length;i++)if(removed[i])data[i*4+3]=0;

function alphaBounds(raw,w,h,threshold=0){
  let x0=w,y0=h,x1=-1,y1=-1;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(raw[(y*w+x)*4+3]>threshold){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  assert(x1>=x0 && y1>=y0,'Empty alpha');
  return {x:x0,y:y0,width:x1-x0+1,height:y1-y0+1};
}
const sourceBounds=alphaBounds(data,width,height);
const cutout=await sharp(data,{raw:{width,height,channels:4}}).extract({left:sourceBounds.x,top:sourceBounds.y,width:sourceBounds.width,height:sourceBounds.height}).png().toBuffer();
await fs.writeFile(`${root}/docs/step-08/water/cutout-v01.png`,cutout);
const fit=await sharp(cutout).resize({width:305,height:205,fit:'inside',withoutEnlargement:true}).png().toBuffer({resolveWithObject:true});
const left=160+1055+Math.floor((305-fit.info.width)/2);
const top=90+165+Math.floor((205-fit.info.height)/2);
await sharp({create:{width:1920,height:1080,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:fit.data,left,top}]).png().toFile(output);
async function inspect(path){
  const bytes=await fs.readFile(path);
  const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const bounds=alphaBounds(data,info.width,info.height);
  return {path:path.replace(root+'/',''),width:info.width,height:info.height,channels:info.channels,sha256:createHash('sha256').update(bytes).digest('hex'),alphaBounds:bounds,logicalBounds:{...bounds,x:bounds.x-160,y:bounds.y-90},data};
}
const production=await inspect(output), masterInfo=await inspect(master);
assert(production.width===1920 && production.height===1080 && production.channels===4);
const b=production.logicalBounds;
assert(b.x>=1055 && b.y>=165 && b.x+b.width<=1360 && b.y+b.height<=370);
const sample=(x,y)=>Array.from(production.data.subarray(((y+90)*1920+x+160)*4,((y+90)*1920+x+160)*4+4));
const anchor={x:1035,y:375};
let nearest=Infinity;
for(let y=0;y<1080;y++)for(let x=0;x<1920;x++)if(production.data[(y*1920+x)*4+3]>127)nearest=Math.min(nearest,Math.hypot(x-(anchor.x+160),y-(anchor.y+90)));
const landing={anchor,rgba:sample(anchor.x,anchor.y),distanceToOpaqueArt:nearest,clearOfOcclusion:true,onTerrain:false,note:'The fixed anchor is outside the fixed visual bbox. A dry entrance clearing exists on the island, but terrain under the prescribed anchor cannot be created without an approved contract change. No character or anchor moved to conceal this.'};
delete production.data;delete masterInfo.data;
const report={source:{path:'docs/step-08/water/source-v01.png',width:sourceMeta.width,height:sourceMeta.height,channels:sourceMeta.channels,alphaBounds:sourceBounds},processing:{method:'Edge-connected near-white removal (min RGB >=238, spread <=12), aspect-preserving downsample, no color grading or texture edits',removedPixelCount:tail,fit:{left,top,width:fit.info.width,height:fit.info.height}},production,master:masterInfo,landing};
await fs.writeFile(`${root}/docs/step-08/asset-validation.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
