// TS-CSS variant
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef, CSSProperties } from "react";

const MAX_COLORS = 8;

type AnimationType = "rotate" | "rotate3d" | "hover";

const hexToVec3 = (hex: string): THREE.Vector3 => {
  const c = hex.replace("#", "").padEnd(6, "0");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return new THREE.Vector3(r, g, b);
};

const resolveLength = (value: number | string | undefined | null, referencePx: number): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return value;
  const str = String(value).trim();
  if (str.endsWith("%"))  return (parseFloat(str) / 100) * referencePx;
  if (str.endsWith("px")) return parseFloat(str);
  const n = parseFloat(str);
  return Number.isNaN(n) ? 0 : n;
};

const ANIMATION_TYPES: Record<AnimationType, number> = { rotate: 0, rotate3d: 1, hover: 2 };

interface FullscreenShaderProps {
  intensity:     number;
  speed:         number;
  animationType: AnimationType;
  colors:        string[];
  distort:       number;
  paused:        boolean;
  offset:        { x?: number | string; y?: number | string };
  hoverDampness: number;
  rayCount?:     number;
}

function FullscreenShader({
  intensity, speed, animationType, colors, distort,
  paused, offset, hoverDampness, rayCount,
}: FullscreenShaderProps) {
  const shaderRef    = useRef<THREE.ShaderMaterial>(null);
  const { size, gl } = useThree();

  const elapsedRef = useRef(0);
  const hoverRef   = useRef<[number, number]>([0, 0]);

  const colorVectors = useMemo(() => {
    const list = (colors || []).slice(0, MAX_COLORS).map((hex) => hexToVec3(hex));
    while (list.length < MAX_COLORS) list.push(new THREE.Vector3(0, 0, 0));
    return list;
  }, [colors]);

  const uniforms = useMemo(() => ({
    uTime:          { value: 0 },
    uResolution:    { value: new THREE.Vector3(size.width, size.height, 1) },
    uIntensity:     { value: intensity },
    uDistort:       { value: distort },
    uRayCount:      { value: rayCount || 0 },
    uAnimationType: { value: ANIMATION_TYPES[animationType] ?? ANIMATION_TYPES.rotate3d },
    uOffset:        { value: new THREE.Vector2(0, 0) },
    uColors:        { value: colorVectors },
    uColorCount:    { value: Math.min(colors?.length || 0, MAX_COLORS) },
  }), [animationType, colorVectors, colors?.length, distort, intensity, rayCount, size.height, size.width]);

  useFrame(({ pointer }, delta) => {
    if (!shaderRef.current) return;
    const u = shaderRef.current.uniforms;

    if (!paused) elapsedRef.current += delta * speed;
    u.uTime.value = elapsedRef.current;

    const bufferSize = new THREE.Vector2();
    gl.getDrawingBufferSize(bufferSize);
    u.uResolution.value.set(bufferSize.x, bufferSize.y, 1);

    u.uIntensity.value     = intensity;
    u.uDistort.value       = distort;
    u.uRayCount.value      = rayCount || 0;
    u.uAnimationType.value = ANIMATION_TYPES[animationType] ?? ANIMATION_TYPES.rotate3d;
    u.uColors.value        = colorVectors;
    u.uColorCount.value    = Math.min(colors?.length || 0, MAX_COLORS);

    const staticX = resolveLength(offset?.x, size.width)  / size.height;
    const staticY = resolveLength(offset?.y, size.height) / size.height;

    let hoverX = 0, hoverY = 0;
    if (animationType === "hover") {
      const targetX = pointer.x * 0.5;
      const targetY = pointer.y * 0.5;
      if (hoverDampness > 0) {
        const factor = Math.min(1, 1 - Math.exp(-delta / hoverDampness));
        hoverRef.current[0] += (targetX - hoverRef.current[0]) * factor;
        hoverRef.current[1] += (targetY - hoverRef.current[1]) * factor;
      } else {
        hoverRef.current[0] = targetX;
        hoverRef.current[1] = targetY;
      }
      hoverX = hoverRef.current[0];
      hoverY = hoverRef.current[1];
    }

    u.uOffset.value.set(staticX + hoverX, staticY + hoverY);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={shaderRef}
        depthWrite={false}
        depthTest={false}
        transparent={false}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          void main() { gl_Position = vec4(position, 1.0); }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;
          #define MAX_COLORS 8
          #define TWO_PI 6.28318530718

          uniform vec3 uResolution;
          uniform float uTime;
          uniform float uIntensity;
          uniform float uDistort;
          uniform float uRayCount;
          uniform int uAnimationType;
          uniform vec2 uOffset;
          uniform vec3 uColors[MAX_COLORS];
          uniform int uColorCount;

          float randVal(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
          float noise2d(vec2 p){
              vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);
              float a=randVal(i+vec2(0,0));float b=randVal(i+vec2(1,0));
              float c=randVal(i+vec2(0,1));float d=randVal(i+vec2(1,1));
              return(a+(b-a)*u.x+(c-a)*u.y+(a-b-c+d)*u.x*u.y)/4.0;
          }
          float mirrored(float t,float shift){t=fract(t+shift);return 2.0*abs(t-0.5);}
          float radialLayer(float angle,float radius){
              const float SCALE=45.0;
              radius=pow(radius,0.01);float off=-uTime*0.07;
              vec2 p=vec2(mirrored(angle,0.1),radius+off); float n1=noise2d(p*SCALE);
              p=2.1*vec2(mirrored(angle,0.4),radius+off);  float n2=noise2d(p*SCALE);
              p=3.7*vec2(mirrored(angle,0.8),radius+off);  float n3=noise2d(p*SCALE);
              p=5.8*vec2(mirrored(angle,0.0),radius+off);  float n4=noise2d(p*SCALE);
              return pow((n1+0.5*n2+0.25*n3+0.125*n4)*3.0,1.0);
          }
          vec3 applyColor(float v){
              v=clamp(v,0.0,1.0);
              vec3 col=mix(vec3(0.0,0.0,1.1),vec3(0.0,1.0,1.0),v);
              col=mix(col,vec3(1.0,1.0,1.0),v*4.0-3.0)*v;
              col=max(col,vec3(0.0));
              col=mix(col,vec3(1.0,0.25,1.0),smoothstep(1.0,0.2,v)*smoothstep(0.15,0.9,v));
              return col;
          }
          vec3 colorFromGradient(float v){
              v=clamp(v,0.0,1.0);
              if(uColorCount<=1)return uColors[0];
              float s=v*float(uColorCount-1);int idx=int(floor(s));float fr=fract(s);
              return mix(uColors[idx],uColors[idx+1],fr);
          }
          void renderMain(out vec4 fragColor,in vec2 fragCoord){
              vec2 uv=(fragCoord*2.0-uResolution.xy)/uResolution.y*0.5;
              uv-=uOffset;
              if(uAnimationType==0){float a=uTime*0.15;float ca=cos(a);float sa=sin(a);uv=mat2(ca,-sa,sa,ca)*uv;}
              else if(uAnimationType==1){
                  vec3 p3=vec3(uv,sqrt(max(0.0,1.0-dot(uv,uv))));
                  float ax=uTime*0.21;float ay=uTime*0.33;
                  mat3 rx=mat3(1,0,0,0,cos(ax),-sin(ax),0,sin(ax),cos(ax));
                  mat3 ry=mat3(cos(ay),0,sin(ay),0,1,0,-sin(ay),0,cos(ay));
                  p3=ry*rx*p3;uv=p3.xy;
              }
              float dist=dot(uv,uv);float ang=atan(uv.y,uv.x)/TWO_PI;
              if(uDistort>0.0){float d=noise2d(vec2(ang*3.0,dist*3.0)+uTime*0.05);ang+=(d-0.5)*uDistort*0.6;dist+=(d-0.5)*uDistort*0.3;}
              float val=radialLayer(ang,dist);val=val*2.5-1.4;val=mix(0.0,val,0.8*smoothstep(0.0,0.8,dist));
              if(uRayCount>0.0){float sp=fract(ang*uRayCount);val*=mix(0.15,1.0,smoothstep(0.0,0.12,sp)*smoothstep(1.0,0.88,sp));}
              vec3 col=(uColorCount>0)?colorFromGradient(val):applyColor(val);
              col*=uIntensity;fragColor=vec4(col,1.0);
          }
          void main(){vec4 o;renderMain(o,gl_FragCoord.xy);gl_FragColor=o;}
        `}
      />
    </mesh>
  );
}

interface PrismaticBurstProps {
  intensity?:     number;
  speed?:         number;
  animationType?: AnimationType;
  colors?:        string[];
  distort?:       number;
  paused?:        boolean;
  offset?:        { x?: number | string; y?: number | string };
  hoverDampness?: number;
  rayCount?:      number;
  mixBlendMode?:  string;
  className?:     string;
}

export const PrismaticBurst = ({
  intensity     = 2,
  speed         = 0.5,
  animationType = "rotate3d",
  colors        = [],
  distort       = 0,
  paused        = false,
  offset        = { x: 0, y: 0 },
  hoverDampness = 0,
  rayCount,
  mixBlendMode  = "lighten",
  className,
}: PrismaticBurstProps) => {
  const style: CSSProperties = {
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    gap:           "1rem",
    padding:       0,
    borderRadius:  "0.5rem",
    width:         "100%",
    height:        "100vh",
    mixBlendMode:  (mixBlendMode === "none" ? "normal" : mixBlendMode) as CSSProperties["mixBlendMode"],
  };

  const classes = `${className ?? ""}`;

  return (
    <div style={style} className={classes}>
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }} dpr={[1, 2]}>
        <color attach="background" args={["#000000"]} />
        <FullscreenShader
          intensity={intensity}
          speed={speed}
          animationType={animationType}
          colors={colors}
          distort={distort}
          paused={paused}
          offset={offset}
          hoverDampness={hoverDampness}
          rayCount={rayCount}
        />
      </Canvas>
    </div>
  );
};

export default PrismaticBurst;