// JS-CSS variant
import { useRef, useEffect } from "react";

const MouseRepelGrid = ({
  gridSpacing           = 28,
  curveStrength         = 0,
  diagonals             = false,
  repelRadius           = 100,
  force                 = 14,
  easeSpeed             = 0.1,
  damping               = 0.85,
  springK               = 0.08,
  waveAmplitude         = 0,
  waveSpeed             = 1,
  ambientNoise          = false,
  ambientNoiseAmplitude = 4,
  ambientNoiseSpeed     = 0.3,
  animationMode         = "none",
  animationSpeed        = 1,
  animationIntensity    = 1,
  lineWidth             = 1,
  glowIntensity         = 0.7,
  glowBlur              = 0,
  lineColor             = "#5a4cff",
  glowColor             = "#b8a0ff",
  backgroundColor       = "transparent",
  colorMode             = "solid",
  gradientColors        = ["#5a4cff", "#d35af8"],
  gradientDirection     = "horizontal",
  rainbowSpeed          = 0.2,
  rainbowSaturation     = 0.7,
  rainbowLightness      = 0.6,
  vignette              = false,
  vignetteStrength      = 0.6,
  pulseOnClick          = false,
  className             = "",
  style                 = {},
}) => {
  const wrapRef   = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap   = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    const S = {
      nodes: [], pX: 0, pY: 0, cx: 0, cy: 0,
      mouse: { x: -10000, y: -10000 },
      pulseStart: -10, pulseCenter: { x: 0, y: 0 },
      startTime: performance.now(),
      rafId: null,
    };

    const hexToRgb = (hex) => {
      let v = hex.replace("#","");
      if (v.length===3) v=v[0]+v[0]+v[1]+v[1]+v[2]+v[2];
      return [parseInt(v.slice(0,2),16), parseInt(v.slice(2,4),16), parseInt(v.slice(4,6),16)];
    };

    const lerpRgb = (a,b,t) => [
      Math.round(a[0]+(b[0]-a[0])*t),
      Math.round(a[1]+(b[1]-a[1])*t),
      Math.round(a[2]+(b[2]-a[2])*t),
    ];

    const hsl2hex = (h,s,l) => {
      const hue2rgb=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<0.5)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
      const q=l<0.5?l*(1+s):l+s-l*s, p=2*l-q;
      const r=hue2rgb(p,q,h+1/3), g=hue2rgb(p,q,h), b=hue2rgb(p,q,h-1/3);
      const toHex=x=>Math.round(x*255).toString(16).padStart(2,"0");
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const gradientStops = gradientColors.map(hexToRgb);
    const lerpGradient  = (t) => {
      const tt=Math.min(1,Math.max(0,t)), segs=gradientStops.length-1;
      const seg=Math.min(segs-1,Math.floor(tt*segs)), local=tt*segs-seg;
      return lerpRgb(gradientStops[seg], gradientStops[seg+1], local);
    };

    const baseColorRgb = (bx,by,W,H,t) => {
      if (colorMode==="gradient") {
        let tt;
        if      (gradientDirection==="vertical")  tt=by/H;
        else if (gradientDirection==="diagonal")  tt=(bx/W+by/H)/2;
        else if (gradientDirection==="radial")    { const dx=bx-W/2,dy=by-H/2,md=Math.sqrt((W/2)**2+(H/2)**2)||1; tt=Math.sqrt(dx*dx+dy*dy)/md; }
        else                                       tt=bx/W;
        return lerpGradient(tt);
      }
      if (colorMode==="rainbow") {
        let tt;
        if      (gradientDirection==="vertical")  tt=by/H;
        else if (gradientDirection==="diagonal")  tt=(bx/W+by/H)/2;
        else if (gradientDirection==="radial")    { const dx=bx-W/2,dy=by-H/2,md=Math.sqrt((W/2)**2+(H/2)**2)||1; tt=Math.sqrt(dx*dx+dy*dy)/md; }
        else                                       tt=bx/W;
        const hue=((tt+t*rainbowSpeed)%1+1)%1;
        return hexToRgb(hsl2hex(hue, rainbowSaturation, rainbowLightness));
      }
      return hexToRgb(lineColor);
    };

    const buildGrid = () => {
      const rect=wrap.getBoundingClientRect();
      const dpr=window.devicePixelRatio||1;
      canvas.width=rect.width*dpr; canvas.height=rect.height*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const W=rect.width, H=rect.height;
      const pX=Math.floor(W/gridSpacing)+1, pY=Math.floor(H/gridSpacing)+1;
      const offX=(W-(pX-1)*gridSpacing)/2, offY=(H-(pY-1)*gridSpacing)/2;
      const cx=W/2, cy=H/2, maxD=Math.sqrt(cx*cx+cy*cy)||1;
      const nodes=[];
      for (let j=0;j<pY;j++) {
        for (let i=0;i<pX;i++) {
          let bx=offX+i*gridSpacing, by=offY+j*gridSpacing;
          if (curveStrength>0) { const dx=bx-cx,dy=by-cy,d=Math.sqrt(dx*dx+dy*dy)/maxD,f=1+(curveStrength/60)*0.4*d; bx=cx+dx*f; by=cy+dy*f; }
          nodes.push({ x:bx,y:by,bx,by,vx:0,vy:0,glow:0,noisePhaseX:Math.random()*Math.PI*2,noisePhaseY:Math.random()*Math.PI*2 });
        }
      }
      S.nodes=nodes; S.pX=pX; S.pY=pY; S.cx=cx; S.cy=cy;
    };

    const idxFn = (i,j) => j*S.pX+i;

    const drawVignette = (W,H) => {
      const grad=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*0.7);
      grad.addColorStop(0,"rgba(0,0,0,0)");
      grad.addColorStop(1,`rgba(0,0,0,${vignetteStrength})`);
      ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);
    };

    const animate = () => {
      S.rafId=requestAnimationFrame(animate);
      const rect=wrap.getBoundingClientRect();
      const W=rect.width, H=rect.height;
      const t=(performance.now()-S.startTime)/1000;
      const { mouse,nodes,pX,pY,cx,cy,pulseCenter }=S;
      const glowRgb=hexToRgb(glowColor);

      if (backgroundColor==="transparent") { ctx.clearRect(0,0,W,H); }
      else { ctx.fillStyle=backgroundColor; ctx.fillRect(0,0,W,H); }

      for (const n of nodes) {
        const waveOff=waveAmplitude>0?Math.sin((n.bx/W)*Math.PI*2+t*waveSpeed*2)*waveAmplitude:0;
        let ambX=0,ambY=0;
        if (ambientNoise) { ambX=Math.sin(t*ambientNoiseSpeed+n.noisePhaseX)*ambientNoiseAmplitude; ambY=Math.cos(t*ambientNoiseSpeed*0.8+n.noisePhaseY)*ambientNoiseAmplitude; }
        let baseX=n.bx,baseY=n.by;
        if (animationMode==="breathing") { const scale=1+Math.sin(t*animationSpeed)*0.04*animationIntensity; baseX=cx+(n.bx-cx)*scale; baseY=cy+(n.by-cy)*scale; }
        const bx=baseX+ambX, by=baseY+waveOff+ambY;
        let tx=bx, ty=by; n.glow=0;
        const ddx=bx-mouse.x,ddy=by-mouse.y,dist=Math.sqrt(ddx*ddx+ddy*ddy);
        if (dist<repelRadius&&dist>0.01) { const s=1-dist/repelRadius; n.glow=s*glowIntensity; const push=s*force; tx+=(ddx/dist)*push; ty+=(ddy/dist)*push; }
        if (pulseOnClick&&S.pulseStart>-5) { const age=t-S.pulseStart; if(age>=0&&age<1.2){ const ringR=age*Math.max(W,H)*0.6,pd=Math.sqrt((bx-pulseCenter.x)**2+(by-pulseCenter.y)**2),band=Math.exp(-(((pd-ringR)*0.05)**2))*(1-age/1.2); n.glow=Math.max(n.glow,band*glowIntensity); const ang=Math.atan2(by-pulseCenter.y,bx-pulseCenter.x); tx+=Math.cos(ang)*band*8; ty+=Math.sin(ang)*band*8; } }
        if (animationMode==="pulse-glow") { const pulse=(Math.sin(t*animationSpeed*2)*0.5+0.5)*glowIntensity*0.6*animationIntensity; n.glow=Math.max(n.glow,pulse); }
        else if (animationMode==="shimmer") { const head=(t*animationSpeed*0.3)%1.4-0.2,nx=n.bx/W,band=Math.max(0,1-Math.abs(nx-head)/0.08)*animationIntensity; n.glow=Math.max(n.glow,band*glowIntensity); }
        else if (animationMode==="auto-ripple") { const period=3/Math.max(animationSpeed,0.01),age=t%period; if(age<1.2){ const ringR=age*Math.max(W,H)*0.6,pd=Math.sqrt((bx-cx)**2+(by-cy)**2),band=Math.exp(-(((pd-ringR)*0.05)**2))*(1-age/1.2)*animationIntensity; n.glow=Math.max(n.glow,band*glowIntensity); } }
        n.vx+=(bx-n.x)*springK; n.vy+=(by-n.y)*springK;
        n.vx*=damping; n.vy*=damping;
        n.x+=(tx+n.vx-n.x)*easeSpeed; n.y+=(ty+n.vy-n.y)*easeSpeed;
      }

      for (let j=0;j<pY;j++) {
        for (let i=0;i<pX;i++) {
          const n=nodes[idxFn(i,j)], glow=n.glow||0;
          const base=baseColorRgb(n.bx,n.by,W,H,t);
          const [r,g,b]=lerpRgb(base,glowRgb,glow);
          const alpha=0.3+glow*0.7, lw=lineWidth+glow*1.5;
          ctx.strokeStyle=`rgba(${r},${g},${b},${alpha})`; ctx.lineWidth=lw;
          if (glowBlur>0) { ctx.shadowColor=`rgba(${glowRgb[0]},${glowRgb[1]},${glowRgb[2]},${glow})`; ctx.shadowBlur=glowBlur*glow; }
          else { ctx.shadowBlur=0; }
          if (i<pX-1) { const right=nodes[idxFn(i+1,j)]; ctx.beginPath(); ctx.moveTo(n.x,n.y); ctx.lineTo(right.x,right.y); ctx.stroke(); }
          if (j<pY-1) { const down=nodes[idxFn(i,j+1)];  ctx.beginPath(); ctx.moveTo(n.x,n.y); ctx.lineTo(down.x,down.y);  ctx.stroke(); }
          if (diagonals&&i<pX-1&&j<pY-1) { const diag=nodes[idxFn(i+1,j+1)]; ctx.beginPath(); ctx.moveTo(n.x,n.y); ctx.lineTo(diag.x,diag.y); ctx.stroke(); }
        }
      }

      ctx.shadowBlur=0;
      if (vignette) drawVignette(W,H);
    };

    const onMove   = (e) => { const r=wrap.getBoundingClientRect(); S.mouse.x=e.clientX-r.left; S.mouse.y=e.clientY-r.top; };
    const onLeave  = ()  => { S.mouse.x=-10000; S.mouse.y=-10000; };
    const onClick  = (e) => { if(!pulseOnClick)return; const r=wrap.getBoundingClientRect(); S.pulseCenter.x=e.clientX-r.left; S.pulseCenter.y=e.clientY-r.top; S.pulseStart=(performance.now()-S.startTime)/1000; };
    const onResize = ()  => buildGrid();

    buildGrid();
    S.rafId=requestAnimationFrame(animate);
    wrap.addEventListener("mousemove",  onMove);
    wrap.addEventListener("mouseleave", onLeave);
    wrap.addEventListener("click",      onClick);
    window.addEventListener("resize",   onResize);

    return () => {
      cancelAnimationFrame(S.rafId);
      wrap.removeEventListener("mousemove",  onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      wrap.removeEventListener("click",      onClick);
      window.removeEventListener("resize",   onResize);
    };
  }, [
    gridSpacing, curveStrength, diagonals,
    repelRadius, force, easeSpeed, damping, springK,
    waveAmplitude, waveSpeed, ambientNoise, ambientNoiseAmplitude, ambientNoiseSpeed,
    animationMode, animationSpeed, animationIntensity,
    lineWidth, glowIntensity, glowBlur,
    lineColor, glowColor, backgroundColor,
    colorMode, gradientColors, gradientDirection,
    rainbowSpeed, rainbowSaturation, rainbowLightness,
    vignette, vignetteStrength, pulseOnClick,
  ]);

  const styles = {
    wrapper: { position: "relative", width: "100%", height: "100%", overflow: "hidden", ...style },
    canvas:  { display: "block", width: "100%", height: "100%" },
  };

  const classes = `${className}`;

  return (
    <div ref={wrapRef} style={styles.wrapper} className={classes}>
      <canvas ref={canvasRef} style={styles.canvas} />
    </div>
  );
};

export default MouseRepelGrid;