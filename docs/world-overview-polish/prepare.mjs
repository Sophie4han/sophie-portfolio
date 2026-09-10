import fs from 'node:fs/promises';
import sharp from 'sharp';
const dir = 'docs/world-overview-polish';
const raw = await sharp(`${dir}/fitmate-source.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let p=0;p<raw.data.length;p+=4){
  const a=1-Math.max(0,Math.min(raw.data[p],raw.data[p+2])-raw.data[p+1])/255;
  if(a<.4){raw.data.fill(0,p,p+4);continue;}
  for(const c of [0,2])raw.data[p+c]=Math.max(0,Math.min(255,Math.round((raw.data[p+c]-255*(1-a))/a)));
  raw.data[p+1]=Math.min(255,Math.round(raw.data[p+1]/a));raw.data[p+3]=Math.round(raw.data[p+3]*a);
}
await sharp(raw.data,{raw:raw.info}).png().toFile(`${dir}/fitmate-cutout.png`);
function bounds(data,w,h){
  let x0=w,y0=h,x1=0,y1=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>0){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  return {x:x0,y:y0,width:x1-x0+1,height:y1-y0+1};
}
const islands={};
for(const [id,folder,source,width,center,top] of [
  ['harubareun','harubareun',`${dir}/harubareun-before.png`,291,555,260],
  ['project-02','invader','docs/step-08/water/cutout-v01.png',315,1367,255],
  ['fitmate','fitmate',`${dir}/fitmate-cutout.png`,251,970,661],
]){
 const r=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});const b=bounds(r.data,r.info.width,r.info.height);
 const sprite=await sharp(source).extract({left:b.x,top:b.y,width:b.width,height:b.height}).resize({width}).png().toBuffer({resolveWithObject:true});
 const left=Math.round(center-width/2),file=`public/images/pixel/world/islands/${folder}/island-${folder}-base.png`;
 await sharp({create:{width:1920,height:1080,channels:4,background:'#00000000'}}).composite([{input:sprite.data,left,top}]).png().toFile(file);
 islands[id]={file,alphaBounds:{x:left,y:top,width,height:sprite.info.height},sourceBounds:b};
}
await fs.writeFile(`${dir}/asset-validation.json`,JSON.stringify({islands},null,2));
console.log(JSON.stringify(islands,null,2));
