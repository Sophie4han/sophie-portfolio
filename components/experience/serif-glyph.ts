/** Trace the active browser font, including its actual Korean fallback.
 * This avoids shipping a second font whose glyphs could differ from native text.
 * Contours are generated at 4x display resolution; animation never dashes them.
 */
export function serifGlyph(context:CanvasRenderingContext2D,character:string):string {
  const metrics=context.measureText(character),scale=4,pad=3;
  const left=Math.ceil(metrics.actualBoundingBoxLeft)+pad;
  const ascent=Math.ceil(metrics.actualBoundingBoxAscent)+pad;
  const width=Math.max(1,Math.ceil(left+metrics.actualBoundingBoxRight+pad))*scale;
  const height=Math.max(1,Math.ceil(ascent+metrics.actualBoundingBoxDescent+pad))*scale;
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const pen=canvas.getContext('2d',{willReadFrequently:true});
  if(!pen) return '';
  pen.scale(scale,scale);pen.font=context.font;
  pen.fillText(character,left,ascent);
  const pixels=pen.getImageData(0,0,width,height).data;
  const filled=(x:number,y:number)=>x>=0&&y>=0&&x<width&&y<height&&pixels[(y*width+x)*4+3]>=128;
  // Clockwise outer boundaries and counter-clockwise counters retain glyph holes.
  const edges=new Map<number,number[]>(),stride=width+1;
  const edge=(x:number,y:number,dx:number,dy:number)=>{
    const from=y*stride+x,to=(y+dy)*stride+x+dx;
    const next=edges.get(from);
    if(next) next.push(to); else edges.set(from,[to]);
  };
  for(let y=0;y<height;y++) for(let x=0;x<width;x++) {
    if(!filled(x,y)) continue;
    if(!filled(x,y-1)) edge(x,y,1,0);
    if(!filled(x+1,y)) edge(x+1,y,0,1);
    if(!filled(x,y+1)) edge(x+1,y+1,-1,0);
    if(!filled(x-1,y)) edge(x,y+1,0,-1);
  }
  const coordinate=(point:number)=>`${(point%stride)/scale-left} ${Math.floor(point/stride)/scale-ascent}`;
  const paths:string[]=[];
  while(edges.size) {
    const start=edges.keys().next().value as number;
    let current=start;
    const points=[start];
    do {
      const choices=edges.get(current);
      if(!choices?.length) break;
      const next=choices.pop()!;
      if(!choices.length) edges.delete(current);
      points.push(next);current=next;
    } while(current!==start);
    // Remove collinear raster edges without changing the silhouette.
    const corners=points.filter((point,i)=>{
      if(i===0||i===points.length-1) return true;
      return point-points[i-1]!==points[i+1]-point;
    });
    paths.push(`M${corners.map(coordinate).join('L')}Z`);
  }
  return paths.join('');
}
