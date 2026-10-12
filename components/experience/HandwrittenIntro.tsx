"use client";

import { useEffect, useId, useRef, useState } from "react";
import { hangulStrokes, positionStroke } from "./hangul-strokes";
import { serifGlyph } from "./serif-glyph";
import s from "./handwritten-intro.module.css";

const SENTENCE_MS=5800;
const GAP_MS=700;
const START_MS=400;
interface GlyphInk { outline:string; x:number; y:number; width:number; height:number; paths:string[]; firstStroke:number }
interface SentenceInk { glyphs:GlyphInk[]; strokeCount:number; strokeWidth:number; start:number }

/** The SVG performance is disposable. Finished letters are always native text. */
export function HandwrittenIntro({phrases,className}:{phrases:readonly string[];className:string}) {
  const maskPrefix=useId().replace(/:/g,'');
  const root=useRef<HTMLOListElement>(null);
  const started=useRef(0);
  const [ink,setInk]=useState<{sentences:SentenceInk[];elapsed:number}|null>(null);
  useEffect(()=>{
    const element=root.current;
    if(!element) return;
    let disposed=false,frame=0;
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const measure=()=>{
      frame=0;
      if(disposed) return;
      if(preference.matches) { setInk(null);return; }
      const context=document.createElement('canvas').getContext('2d');
      if(!context) return;
      const sentences:SentenceInk[]=[];
      const outlines=new Map<string,string>();
      element.querySelectorAll<HTMLElement>('[data-ink-text]').forEach((text,index)=>{
        const bounds=text.getBoundingClientRect(),node=text.firstChild;
        if(!node) return;
        const style=getComputedStyle(text),fontSize=parseFloat(style.fontSize);
        context.font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const glyphs:GlyphInk[]=[];
        let strokeCount=0;
        let offset=0;
        for(const character of text.textContent ?? '') {
          const range=document.createRange();
          range.setStart(node,offset);offset+=character.length;range.setEnd(node,offset);
          if(/\s/.test(character)) continue;
          const rect=range.getBoundingClientRect(),metrics=context.measureText(character);
          const ascent=metrics.fontBoundingBoxAscent ?? fontSize*.8;
          const descent=metrics.fontBoundingBoxDescent ?? fontSize*.2;
          const baseline=rect.top-bounds.top+(rect.height-ascent-descent)/2+ascent;
          const x=rect.left-bounds.left-metrics.actualBoundingBoxLeft;
          const y=baseline-metrics.actualBoundingBoxAscent;
          const width=Math.max(1,metrics.actualBoundingBoxLeft+metrics.actualBoundingBoxRight);
          const height=Math.max(1,metrics.actualBoundingBoxAscent+metrics.actualBoundingBoxDescent);
          const paths:string[]=[];
          for(const part of hangulStrokes(character)) {
            const box={x:x+part.x*width,y:y+part.y*height,width:part.width*width,height:part.height*height};
            paths.push(...part.paths.map(path=>positionStroke(path,box)));
          }
          const key=context.font+character;
          let outline=outlines.get(key);
          if(outline===undefined) { outline=serifGlyph(context,character);outlines.set(key,outline); }
          glyphs.push({outline,x:rect.left-bounds.left,y:baseline,width,height,paths,firstStroke:strokeCount});
          strokeCount+=paths.length;
        }
        sentences.push({glyphs,strokeCount,strokeWidth:Math.max(1,fontSize*.035),start:START_MS+index*(SENTENCE_MS+GAP_MS)});
      });
      if(!started.current) started.current=performance.now();
      setInk({sentences,elapsed:performance.now()-started.current});
    };
    const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);};
    const observer=new ResizeObserver(schedule);
    observer.observe(element);
    preference.addEventListener('change',schedule);
    document.fonts.ready.then(()=>{if(!disposed) schedule();});
    schedule();
    return ()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();preference.removeEventListener('change',schedule);};
  },[phrases]);
  return <ol ref={root} className={className} data-handwriting={ink?'ready':'pending'}>
    {phrases.map((phrase,index)=>{
      const sentence=ink?.sentences[index];
      const delay=sentence ? `${sentence.start+SENTENCE_MS-ink!.elapsed}ms` : undefined;
      return <li key={phrase} className={s.sentence}>
        <span key={`text-${ink?.elapsed ?? 'pending'}`} className={s.text} data-ink-text style={{animationDelay:delay}}>{phrase}</span>
        {sentence && <svg key={`ink-${ink!.elapsed}`} className={s.writing} aria-hidden="true" focusable="false" style={{animationDelay:delay}}>
          {sentence.glyphs.map((glyph,glyphIndex)=>{
            const maskId=`${maskPrefix}-${index}-${glyphIndex}`;
            const strokeMs=SENTENCE_MS/sentence.strokeCount;
            const complete=sentence.start+(glyph.firstStroke+glyph.paths.length)*strokeMs-ink!.elapsed;
            return <g key={glyphIndex}>
              <defs><mask id={maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={glyph.x-glyph.width} y={glyph.y-glyph.height-8}
                width={glyph.width*3+8} height={glyph.height*2+16} style={{maskType:'alpha'}}>
                {glyph.paths.map((d,i)=><path key={i} d={d} className={s.stroke} fill="none" stroke="white"
                  strokeWidth={Math.max(glyph.width,glyph.height)*.45+.75} strokeLinecap="round" strokeLinejoin="round" pathLength="1"
                  style={{animationDuration:`${strokeMs}ms`,animationDelay:`${sentence.start+(glyph.firstStroke+i)*strokeMs-ink!.elapsed}ms`}} />)}
                {/* Complete serif terminals immediately after this glyph's last pen stroke. */}
                <rect x={glyph.x-glyph.width} y={glyph.y-glyph.height-8} width={glyph.width*3+8} height={glyph.height*2+16}
                  fill="white" className={s.completeGlyph} style={{animationDelay:`${complete}ms`}} />
              </mask></defs>
              <g mask={`url(#${maskId})`}><path data-serif-glyph className={s.glyph} d={glyph.outline} transform={`translate(${glyph.x} ${glyph.y})`}
                fill="currentColor" /></g>
            </g>;
          })}
        </svg>}
      </li>;
    })}
  </ol>;
}
