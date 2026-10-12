// Centre-line pen strokes for the temporary drawing only, never final glyphs.
const consonants: Record<string,string[]> = {
  'ㄱ':['M.08 .1H.9V.92'], 'ㄴ':['M.1 .08V.9H.92'],
  'ㄷ':['M.1 .1H.9','M.1 .1V.9H.9'],
  'ㄹ':['M.1 .1H.9V.5','M.1 .5H.9','M.1 .5V.9H.9'],
  'ㅁ':['M.1 .1V.9','M.1 .1H.9V.9','M.1 .9H.9'],
  'ㅂ':['M.1 .08V.92','M.9 .08V.92','M.1 .48H.9','M.1 .9H.9'],
  'ㅅ':['M.52 .08Q.43 .64 .05 .94','M.5 .36Q.65 .74 .95 .94'],
  'ㅇ':['M.5 .07C-.05 .07 -.05 .93 .5 .93C1.05 .93 1.05 .07 .5 .07'],
  'ㅈ':['M.07 .12H.93','M.52 .12Q.43 .64 .05 .94','M.5 .4Q.65 .74 .95 .94'],
  'ㅊ':['M.4 .03L.6 .1','M.07 .27H.93','M.52 .27Q.43 .7 .05 .96','M.5 .5Q.65 .79 .95 .96'],
  'ㅋ':['M.08 .1H.9V.92','M.1 .5H.9'],
  'ㅌ':['M.1 .1H.9','M.1 .5H.9','M.1 .1V.9H.9'],
  'ㅍ':['M.04 .1H.96','M.27 .1V.9','M.73 .1V.9','M.04 .9H.96'],
  'ㅎ':['M.4 .02L.6 .08','M.05 .25H.95','M.5 .4C0 .4 0 .96 .5 .96C1 .96 1 .4 .5 .4'],
};
const vowels: Record<string,string[]> = {
  'ㅏ':['M.35 .03V.97','M.35 .48H.95'], 'ㅑ':['M.35 .03V.97','M.35 .3H.95','M.35 .66H.95'],
  'ㅓ':['M.05 .48H.65','M.65 .03V.97'], 'ㅕ':['M.05 .3H.65','M.05 .66H.65','M.65 .03V.97'],
  'ㅗ':['M.5 .04V.72','M.03 .72H.97'], 'ㅛ':['M.3 .04V.72','M.7 .04V.72','M.03 .72H.97'],
  'ㅜ':['M.03 .28H.97','M.5 .28V.96'], 'ㅠ':['M.03 .28H.97','M.3 .28V.96','M.7 .28V.96'],
  'ㅡ':['M.03 .5H.97'], 'ㅣ':['M.5 .03V.97'],
};
const doubles: Record<string,string> = {'ㄲ':'ㄱ','ㄸ':'ㄷ','ㅃ':'ㅂ','ㅆ':'ㅅ','ㅉ':'ㅈ'};
const pairs: Record<string,string[]> = {
  'ㄳ':['ㄱ','ㅅ'],'ㄵ':['ㄴ','ㅈ'],'ㄶ':['ㄴ','ㅎ'],'ㄺ':['ㄹ','ㄱ'],'ㄻ':['ㄹ','ㅁ'],
  'ㄼ':['ㄹ','ㅂ'],'ㄽ':['ㄹ','ㅅ'],'ㄾ':['ㄹ','ㅌ'],'ㄿ':['ㄹ','ㅍ'],'ㅀ':['ㄹ','ㅎ'],'ㅄ':['ㅂ','ㅅ'],
  'ㅐ':['ㅏ','ㅣ'],'ㅒ':['ㅑ','ㅣ'],'ㅔ':['ㅓ','ㅣ'],'ㅖ':['ㅕ','ㅣ']
};
const compounds: Record<string,string[]> = {'ㅘ':['ㅗ','ㅏ'],'ㅙ':['ㅗ','ㅐ'],'ㅚ':['ㅗ','ㅣ'],'ㅝ':['ㅜ','ㅓ'],'ㅞ':['ㅜ','ㅔ'],'ㅟ':['ㅜ','ㅣ'],'ㅢ':['ㅡ','ㅣ']};
const initials=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
const medials=[...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'];
const finals=['',...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'];
export interface PenPart { paths:string[]; x:number; y:number; width:number; height:number }
function part(jamo:string,x:number,y:number,width:number,height:number):PenPart[] {
  const pair=doubles[jamo] ? [doubles[jamo],doubles[jamo]] : pairs[jamo];
  if(pair) return [...part(pair[0],x,y,width*.48,height),...part(pair[1],x+width*.52,y,width*.48,height)];
  return [{paths:consonants[jamo] ?? vowels[jamo] ?? [],x,y,width,height}];
}
export function hangulStrokes(character:string):PenPart[] {
  const code=character.codePointAt(0)!-0xac00;
  if(code<0||code>11171) return [{paths:['M.3 .5L.7 .5'],x:0,y:0,width:1,height:1}];
  const initial=initials[Math.floor(code/588)],vowel=medials[Math.floor(code/28)%21],final=finals[code%28];
  const upper=final ? .68 : 1,parts:PenPart[]=[];
  if(compounds[vowel]) {
    const [horizontal,vertical]=compounds[vowel];
    parts.push(...part(initial,.02,0,.56,upper*.55),...part(horizontal,0,upper*.58,.64,upper*.4),...part(vertical,.67,0,.33,upper));
  } else if('ㅗㅛㅜㅠㅡ'.includes(vowel)) {
    parts.push(...part(initial,.08,0,.84,upper*.56),...part(vowel,0,upper*.62,1,upper*.36));
  } else {
    parts.push(...part(initial,0,0,.55,upper),...part(vowel,.61,0,.39,upper));
  }
  if(final) parts.push(...part(final,.05,.75,.9,.25));
  return parts;
}
// Resolve into pixel space BEFORE dashing, avoiding scale/dash rendering artifacts.
export function positionStroke(path:string,box:Omit<PenPart,'paths'>):string {
  let command='',axis=0;
  return (path.match(/[A-Za-z]|-?(?:\d*\.)?\d+/g) ?? []).map(token=>{
    if(/^[A-Za-z]$/.test(token)) { command=token;axis=0;return token; }
    const isY=command==='V'||(command!=='H'&&axis++%2===1);
    return String(Number((isY ? box.y+Number(token)*box.height : box.x+Number(token)*box.width).toFixed(3)));
  }).join(' ');
}
