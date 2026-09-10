import fs from 'node:fs/promises';import sharp from 'sharp';
const dir='docs/world-final-polish';const report={islands:{}};
for(const [id,folder,source] of [
 ['harubareun','harubareun',`${dir}/harubareun-native-cutout.png`],
 ['project-02','invader','docs/step-08/water/cutout-v01.png'],
 ['fitmate','fitmate','docs/world-overview-polish/fitmate-cutout.png'],
]){
 const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});let x0=info.width,y0=info.height,x1=0,y1=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
 const width=x1-x0+1,height=y1-y0+1,x=Math.floor((1920-width)/2),y=Math.floor((1080-height)/2);
 const sprite=await sharp(source).extract({left:x0,top:y0,width,height}).png().toBuffer();
 const file=`public/images/pixel/world/islands/${folder}/island-${folder}-base.png`;
 await sharp({create:{width:1920,height:1080,channels:4,background:'#00000000'}}).composite([{input:sprite,left:x,top:y}]).png().toFile(file);
 report.islands[id]={file,alphaBounds:{x,y,width,height}};
}
await fs.writeFile(`${dir}/after/asset-validation.json`,JSON.stringify(report,null,2));console.log(report);
