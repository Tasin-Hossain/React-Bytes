// TS-CSS variant
import { useRef, useEffect, CSSProperties } from 'react';
import { Renderer, Program, Geometry, Mesh, Vec2 } from 'ogl';

type ColorMode         = 'solid' | 'gradient' | 'rainbow';
type GradientDirection = 'horizontal' | 'vertical' | 'diagonal' | 'radial';
type AnimationMode     = 'none' | 'breathing' | 'pulse-glow' | 'shimmer' | 'auto-ripple';

interface Node {
  x: number; y: number; bx: number; by: number;
  vx: number; vy: number; glow: number;
  noisePhaseX: number; noisePhaseY: number;
}

interface MouseRepelGridProps {
  gridSpacing?:           number;
  curveStrength?:         number;
  repelRadius?:           number;
  force?:                 number;
  easeSpeed?:             number;
  damping?:               number;
  springK?:               number;
  waveAmplitude?:         number;
  ambientNoise?:          boolean;
  ambientNoiseAmplitude?: number;
  ambientNoiseSpeed?:     number;
  lineWidth?:             number;
  glowIntensity?:         number;
  lineColor?:             string;
  glowColor?:             string;
  backgroundColor?:       string;
  diagonals?:             boolean;
  colorMode?:             ColorMode;
  gradientColors?:        string[];
  gradientDirection?:     GradientDirection;
  rainbowSpeed?:          number;
  rainbowSaturation?:     number;
  rainbowLightness?:      number;
  vignette?:              boolean;
  vignetteStrength?:      number;
  animationMode?:         AnimationMode;
  animationSpeed?:        number;
  animationIntensity?:    number;
  pulseOnClick?:          boolean;
  className?:             string;
  style?:                 CSSProperties;
}

const MouseRepelGrid = ({
  gridSpacing           = 28,
  curveStrength         = 0,
  repelRadius           = 100,
  force                 = 14,
  easeSpeed             = 0.1,
  damping               = 0.9,
  springK               = 0.08,
  waveAmplitude         = 0,
  ambientNoise          = false,
  ambientNoiseAmplitude = 4,
  ambientNoiseSpeed     = 0.3,
  lineWidth             = 1,
  glowIntensity         = 0.7,
  lineColor             = '#5a4cff',
  glowColor             = '#b8a0ff',
  backgroundColor       = '#050310',
  diagonals             = false,
  colorMode             = 'solid',
  gradientColors        = ['#5a4cff', '#d35af8'],
  gradientDirection     = 'horizontal',
  rainbowSpeed          = 0.2,
  rainbowSaturation     = 0.7,
  rainbowLightness      = 0.6,
  vignette              = false,
  vignetteStrength      = 0.6,
  animationMode         = 'none',
  animationSpeed        = 1,
  animationIntensity    = 1,
  pulseOnClick          = false,
  className             = '',
  style                 = {},
}: MouseRepelGridProps) => {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap   = wrapRef.current!;
    const canvas = canvasRef.current!;

    const resolveColor = (color: string): string | null => {
      if (!color || color === 'transparent') return null;
      if (color.startsWith('var(')) {
        const varName = color.match(/var\((--[^)]+)\)/)?.[1];
        if (!varName) return null;
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || null;
      }
      return color;
    };

    const parseToNorm = (colorStr: string | null): [number,number,number] => {
      if (!colorStr) return [0,0,0];
      const trimmed = colorStr.trim();
      const rgbMatch = trimmed.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
      if (rgbMatch) return [+rgbMatch[1]/255, +rgbMatch[2]/255, +rgbMatch[3]/255];
      let hex = trimmed.replace('#','');
      if (hex.length===3) hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
      return [parseInt(hex.slice(0,2),16)/255, parseInt(hex.slice(2,4),16)/255, parseInt(hex.slice(4,6),16)/255];
    };

    const colorNorm     = (color: string): [number,number,number] => parseToNorm(resolveColor(color));
    const hexNorm       = (hex: string):   [number,number,number] => parseToNorm(hex);
    const isTransparent = (color: string): boolean => !color || color === 'transparent';

    const lerpColors = (colors: string[], t: number): [number,number,number] => {
      const norm = colors.map(hexNorm);
      if (norm.length===1) return norm[0];
      const tt=Math.min(1,Math.max(0,t)), segs=norm.length-1;
      const segT=tt*segs, i=Math.min(segs-1,Math.floor(segT)), localT=segT-i;
      const a=norm[i], b=norm[i+1];
      return [a[0]+(b[0]-a[0])*localT, a[1]+(b[1]-a[1])*localT, a[2]+(b[2]-a[2])*localT];
    };

    const hsl2rgb = (h: number, s: number, l: number): [number,number,number] => {
      if (s===0) return [l,l,l];
      const hue2rgb=(p: number,q: number,t: number)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
      const q=l<0.5?l*(1+s):l+s-l*s, p=2*l-q;
      return [hue2rgb(p,q,h+1/3), hue2rgb(p,q,h), hue2rgb(p,q,h-1/3)];
    };

    const transparent = isTransparent(backgroundColor);
    const renderer    = new Renderer({ canvas, alpha: transparent, antialias: true, premultipliedAlpha: false });
    const gl          = renderer.gl;

    const applyBg = () => {
      if (transparent) { gl.clearColor(0,0,0,0); }
      else { const [r,g,b]=colorNorm(backgroundColor); gl.clearColor(r,g,b,1); }
    };
    applyBg();

    const S = {
      nodes:[] as Node[], pX:0, pY:0,
      mouse:{ x:-99999, y:-99999 },
      pulseStart:-10, pulseCenter:{ x:0, y:0 },
      t0:performance.now(), rafId:0,
      lineMesh:null as Mesh|null, vignetteMesh:null as Mesh|null,
      cx:0, cy:0,
    };

    const gridVert = `
      attribute vec2 aPos; attribute float aGlow; attribute vec3 aColor;
      uniform vec2 uRes; uniform float uLW;
      varying float vGlow; varying vec3 vColor;
      void main(){
        vGlow=aGlow; vColor=aColor;
        vec2 c=(aPos/uRes)*2.0-1.0; c.y=-c.y;
        gl_Position=vec4(c,0.0,1.0); gl_PointSize=uLW+aGlow*3.0;
      }
    `;
    const gridFrag = `
      precision highp float;
      varying float vGlow; varying vec3 vColor; uniform vec3 uGC;
      void main(){
        vec3 col=mix(vColor,uGC,vGlow);
        float alpha=0.3+vGlow*0.7;
        gl_FragColor=vec4(col,alpha);
      }
    `;
    const vigVert = `
      attribute vec2 aPos; varying vec2 vUv;
      void main(){ vUv=aPos*0.5+0.5; gl_Position=vec4(aPos,0.0,1.0); }
    `;
    const vigFrag = `
      precision highp float;
      varying vec2 vUv; uniform vec3 uBg; uniform float uStrength;
      void main(){
        vec2 c=vUv-0.5; float d=length(c)*2.0;
        float a=smoothstep(0.35,1.25,d)*uStrength;
        gl_FragColor=vec4(uBg,a);
      }
    `;

    const gridUniforms = { uRes:{ value:new Vec2(1,1) }, uLW:{ value:lineWidth }, uGC:{ value:colorNorm(glowColor) } };
    const vigUniforms  = { uBg:{ value:colorNorm(backgroundColor) }, uStrength:{ value:transparent?0:vignetteStrength } };

    const gridProg = new Program(gl,{ vertex:gridVert, fragment:gridFrag, uniforms:gridUniforms, transparent:true });
    const vigProg  = new Program(gl,{ vertex:vigVert,  fragment:vigFrag,  uniforms:vigUniforms,  transparent:true });

    const baseColorFor = (bx: number, by: number, W: number, H: number, t: number): [number,number,number] => {
      if (colorMode==='gradient') {
        let tt: number;
        switch(gradientDirection){
          case 'vertical': tt=by/H; break;
          case 'diagonal': tt=(bx/W+by/H)/2; break;
          case 'radial': { const dx=bx-W/2,dy=by-H/2,md=Math.sqrt((W/2)**2+(H/2)**2)||1; tt=Math.sqrt(dx*dx+dy*dy)/md; break; }
          default: tt=bx/W;
        }
        return lerpColors(gradientColors, tt);
      }
      if (colorMode==='rainbow') {
        let tt: number;
        switch(gradientDirection){
          case 'vertical': tt=by/H; break;
          case 'diagonal': tt=(bx/W+by/H)/2; break;
          case 'radial': { const dx=bx-W/2,dy=by-H/2,md=Math.sqrt((W/2)**2+(H/2)**2)||1; tt=Math.sqrt(dx*dx+dy*dy)/md; break; }
          default: tt=bx/W;
        }
        const hue=((tt+t*rainbowSpeed)%1+1)%1;
        return hsl2rgb(hue, rainbowSaturation, rainbowLightness);
      }
      return hexNorm(lineColor);
    };

    const buildGrid = () => {
      const rect=wrap.getBoundingClientRect();
      const W=rect.width, H=rect.height;
      renderer.setSize(W,H);
      gridUniforms.uRes.value=new Vec2(W,H);
      applyBg();

      const pX=Math.floor(W/gridSpacing)+1, pY=Math.floor(H/gridSpacing)+1;
      const offX=(W-(pX-1)*gridSpacing)/2, offY=(H-(pY-1)*gridSpacing)/2;
      const cx=W/2, cy=H/2, maxDist=Math.sqrt(cx*cx+cy*cy)||1;

      const nodes: Node[]=[];
      for(let j=0;j<pY;j++){
        for(let i=0;i<pX;i++){
          let bx=offX+i*gridSpacing, by=offY+j*gridSpacing;
          if(curveStrength>0){ const dx=bx-cx,dy=by-cy,d=Math.sqrt(dx*dx+dy*dy)/maxDist,f=1+(curveStrength/60)*0.4*d; bx=cx+dx*f; by=cy+dy*f; }
          nodes.push({ x:bx,y:by,bx,by,vx:0,vy:0,glow:0,noisePhaseX:Math.random()*Math.PI*2,noisePhaseY:Math.random()*Math.PI*2 });
        }
      }
      S.nodes=nodes; S.pX=pX; S.pY=pY; S.cx=cx; S.cy=cy;

      const total=pX*pY;
      const posD=new Float32Array(total*2), glowD=new Float32Array(total), colorD=new Float32Array(total*3);
      const idx=(i: number,j: number)=>j*pX+i, lineIdx: number[]=[];
      for(let j=0;j<pY;j++){
        for(let i=0;i<pX;i++){
          if(i<pX-1) lineIdx.push(idx(i,j),idx(i+1,j));
          if(j<pY-1) lineIdx.push(idx(i,j),idx(i,j+1));
          if(diagonals&&i<pX-1&&j<pY-1) lineIdx.push(idx(i,j),idx(i+1,j+1));
        }
      }

      S.lineMesh=new Mesh(gl,{ mode:gl.LINES, geometry:new Geometry(gl,{
        aPos:{ size:2,data:posD,usage:gl.DYNAMIC_DRAW },
        aGlow:{ size:1,data:glowD,usage:gl.DYNAMIC_DRAW },
        aColor:{ size:3,data:colorD,usage:gl.DYNAMIC_DRAW },
        index:{ data:new Uint32Array(lineIdx) },
      }), program:gridProg });

      const vigPos=new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]);
      S.vignetteMesh=new Mesh(gl,{ mode:gl.TRIANGLES, geometry:new Geometry(gl,{ aPos:{ size:2,data:vigPos } }), program:vigProg });
    };

    const animate = () => {
      S.rafId=requestAnimationFrame(animate);
      const rect=wrap.getBoundingClientRect();
      const W=rect.width, H=rect.height;
      const t=(performance.now()-S.t0)/1000;
      const { mouse,nodes,pX,pulseCenter }=S;

      gridUniforms.uGC.value=colorNorm(glowColor);
      gridUniforms.uLW.value=lineWidth;
      vigUniforms.uBg.value=colorNorm(backgroundColor);
      vigUniforms.uStrength.value=transparent?0:vignetteStrength;
      applyBg();

      const posD=S.lineMesh!.geometry.attributes.aPos.data as Float32Array;
      const glowD=S.lineMesh!.geometry.attributes.aGlow.data as Float32Array;
      const colorD=S.lineMesh!.geometry.attributes.aColor.data as Float32Array;

      for(let k=0;k<nodes.length;k++){
        const n=nodes[k], i=k%pX;
        const waveOff=waveAmplitude>0?Math.sin((i/pX)*Math.PI*2+t*2)*waveAmplitude:0;
        let ambX=0,ambY=0;
        if(ambientNoise&&ambientNoiseAmplitude>0){ ambX=Math.sin(t*ambientNoiseSpeed+n.noisePhaseX)*ambientNoiseAmplitude; ambY=Math.cos(t*ambientNoiseSpeed*0.8+n.noisePhaseY)*ambientNoiseAmplitude; }
        let baseX=n.bx,baseY=n.by;
        if(animationMode==='breathing'){ const scale=1+Math.sin(t*animationSpeed)*0.04*animationIntensity; baseX=S.cx+(n.bx-S.cx)*scale; baseY=S.cy+(n.by-S.cy)*scale; }
        const bx=baseX+ambX,by=baseY+waveOff+ambY;
        let tx=bx,ty=by;
        const ddx=bx-mouse.x,ddy=by-mouse.y,dist=Math.sqrt(ddx*ddx+ddy*ddy);
        n.glow=0;
        if(dist<repelRadius&&dist>0.01){ const s=1-dist/repelRadius; n.glow=s*glowIntensity; const push=s*force; tx+=(ddx/dist)*push; ty+=(ddy/dist)*push; }
        if(pulseOnClick&&S.pulseStart>-5){ const age=t-S.pulseStart; if(age>=0&&age<1.2){ const ringR=age*Math.max(W,H)*0.6,pd=Math.sqrt((bx-pulseCenter.x)**2+(by-pulseCenter.y)**2),band=Math.exp(-(((pd-ringR)*0.05)**2))*(1-age/1.2); n.glow=Math.max(n.glow,band*glowIntensity); const ang=Math.atan2(by-pulseCenter.y,bx-pulseCenter.x); tx+=Math.cos(ang)*band*8; ty+=Math.sin(ang)*band*8; } }
        if(animationMode==='pulse-glow'){ const pulse=(Math.sin(t*animationSpeed*2)*0.5+0.5)*glowIntensity*0.6*animationIntensity; n.glow=Math.max(n.glow,pulse); }
        else if(animationMode==='shimmer'){ const head=(t*animationSpeed*0.3)%1.4-0.2,nx=n.bx/W,band=Math.max(0,1-Math.abs(nx-head)/0.08)*animationIntensity; n.glow=Math.max(n.glow,band*glowIntensity); }
        else if(animationMode==='auto-ripple'){ const period=3/Math.max(animationSpeed,0.01),age=t%period; if(age<1.2){ const ringR=age*Math.max(W,H)*0.6,pd=Math.sqrt((bx-S.cx)**2+(by-S.cy)**2),band=Math.exp(-(((pd-ringR)*0.05)**2))*(1-age/1.2)*animationIntensity; n.glow=Math.max(n.glow,band*glowIntensity); } }
        n.vx+=(bx-n.x)*springK; n.vy+=(by-n.y)*springK;
        n.vx*=damping; n.vy*=damping;
        n.x+=(tx+n.vx-n.x)*easeSpeed; n.y+=(ty+n.vy-n.y)*easeSpeed;
        posD[k*2]=n.x; posD[k*2+1]=n.y; glowD[k]=n.glow;
        const [r,g,b]=baseColorFor(n.bx,n.by,W,H,t);
        colorD[k*3]=r; colorD[k*3+1]=g; colorD[k*3+2]=b;
      }

      const lineGeo=S.lineMesh!.geometry;
      lineGeo.attributes.aPos.needsUpdate=true;
      lineGeo.attributes.aGlow.needsUpdate=true;
      lineGeo.attributes.aColor.needsUpdate=true;
      renderer.render({ scene:S.lineMesh!, clear:true });
      if(vignette&&!transparent) renderer.render({ scene:S.vignetteMesh!, clear:false });
    };

    const onMove   = (e: MouseEvent) => { const r=wrap.getBoundingClientRect(); S.mouse.x=e.clientX-r.left; S.mouse.y=e.clientY-r.top; };
    const onLeave  = ()              => { S.mouse.x=-99999; S.mouse.y=-99999; };
    const onClick  = (e: MouseEvent) => { if(!pulseOnClick)return; const r=wrap.getBoundingClientRect(); S.pulseCenter.x=e.clientX-r.left; S.pulseCenter.y=e.clientY-r.top; S.pulseStart=(performance.now()-S.t0)/1000; };
    const onResize = ()              => buildGrid();

    buildGrid();
    S.rafId=requestAnimationFrame(animate);
    wrap.addEventListener('mousemove',  onMove);
    wrap.addEventListener('mouseleave', onLeave);
    wrap.addEventListener('click',      onClick);
    window.addEventListener('resize',   onResize);

    return () => {
      cancelAnimationFrame(S.rafId);
      wrap.removeEventListener('mousemove',  onMove);
      wrap.removeEventListener('mouseleave', onLeave);
      wrap.removeEventListener('click',      onClick);
      window.removeEventListener('resize',   onResize);
    };
  }, [
    gridSpacing, repelRadius, force, easeSpeed, damping, springK,
    curveStrength, waveAmplitude,
    ambientNoise, ambientNoiseAmplitude, ambientNoiseSpeed,
    lineWidth, glowIntensity, lineColor, glowColor, backgroundColor,
    diagonals, pulseOnClick,
    colorMode, gradientColors, gradientDirection,
    rainbowSpeed, rainbowSaturation, rainbowLightness,
    vignette, vignetteStrength,
    animationMode, animationSpeed, animationIntensity,
  ]);

  const styles = {
    wrapper: { position:'relative' as const, width:'100%', height:'100%', overflow:'hidden', ...style },
    canvas:  { display:'block', width:'100%', height:'100%' },
  };

  const classes = `${className}`;

  return (
    <div ref={wrapRef} style={styles.wrapper} className={classes}>
      <canvas ref={canvasRef} style={styles.canvas} />
    </div>
  );
};

export default MouseRepelGrid;