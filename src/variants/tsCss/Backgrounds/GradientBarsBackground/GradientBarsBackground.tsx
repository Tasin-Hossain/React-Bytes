import type { CSSProperties } from "react"

const NOISE_SVG =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix in='t' type='saturate' values='0' result='g'/%3E%3CfeComponentTransfer in='g'%3E%3CfeFuncR type='linear' slope='2.2' intercept='-0.6'/%3E%3CfeFuncG type='linear' slope='2.2' intercept='-0.6'/%3E%3CfeFuncB type='linear' slope='2.2' intercept='-0.6'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

type Direction = "bottom" | "top"

interface DirectionSetting {
  gradientAngle: string
  maskAngle: string
  transformOrigin: string
}

const DIRECTION_CONFIG: Record<Direction, DirectionSetting> = {
  bottom: { gradientAngle: "to top", maskAngle: "to top", transformOrigin: "bottom" },
  top: { gradientAngle: "to bottom", maskAngle: "to bottom", transformOrigin: "top" },
}

interface GradientBarsProps {
  numBars?: number
  gradientFrom?: string
  gradientTo?: string
  animationDuration?: number
  direction?: Direction
  noise?: number
  className?: string
}

const GradientBars = ({
  numBars = 15,
  gradientFrom = "rgb(255, 60, 0)",
  gradientTo = "transparent",
  animationDuration = 2,
  direction = "bottom",
  noise = 0,
  className = "",
}: GradientBarsProps) => {
  const calculateHeight = (index: number, total: number) => {
    const position = index / (total - 1)
    const maxHeight = 100
    const minHeight = 30

    const center = 0.5
    const distanceFromCenter = Math.abs(position - center)
    const heightPercentage = Math.pow(distanceFromCenter * 2, 1.2)

    return minHeight + (maxHeight - minHeight) * heightPercentage
  }

  const dir = DIRECTION_CONFIG[direction] || DIRECTION_CONFIG.bottom
  const noiseAmount = Math.max(0, Math.min(1, noise))
  const showSecondLayer = noiseAmount > 0.5

  const noiseLayerStyle = (opacity: number, size: number, animDelay: string): CSSProperties => ({
    position: "absolute",
    inset: 0,
    backgroundImage: `url("${NOISE_SVG}")`,
    backgroundSize: `${size}px ${size}px`,
    mixBlendMode: "overlay",
    opacity,
    maskImage: `linear-gradient(${dir.maskAngle}, black, transparent)`,
    WebkitMaskImage: `linear-gradient(${dir.maskAngle}, black, transparent)`,
    animation: "noiseFlicker 0.5s steps(1) infinite",
    animationDelay: animDelay,
    pointerEvents: "none",
  })

  return (
    <>
      <style>{`
        .gbb-wrapper {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .gbb-flex {
          display: flex;
          height: 100%;
        }
        @keyframes pulseBar {
          0% { transform: scaleY(var(--initial-scale)); }
          100% { transform: scaleY(calc(var(--initial-scale) * 0.7)); }
        }
        @keyframes noiseFlicker {
          0%   { background-position: 0px 0px; }
          10%  { background-position: -37px 18px; }
          20%  { background-position: 52px -24px; }
          30%  { background-position: -18px -46px; }
          40%  { background-position: 41px 33px; }
          50%  { background-position: -55px -12px; }
          60%  { background-position: 22px 47px; }
          70%  { background-position: -44px 27px; }
          80%  { background-position: 33px -39px; }
          90%  { background-position: -9px 14px; }
          100% { background-position: 0px 0px; }
        }
      `}</style>

      <div className={`gbb-wrapper ${className}`}>
        <div
          className="gbb-flex"
          style={{
            width: "100%",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          {Array.from({ length: numBars }).map((_, index) => {
            const height = calculateHeight(index, numBars)
            return (
              <div
                key={index}
                style={{
                  flex: `1 0 calc(100% / ${numBars})`,
                  maxWidth: `calc(100% / ${numBars})`,
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  background: `linear-gradient(${dir.gradientAngle}, ${gradientFrom}, ${gradientTo})`,
                  transform: `scaleY(${height / 100})`,
                  transformOrigin: dir.transformOrigin,
                  transition: "transform 0.5s ease-in-out",
                  animation: `pulseBar ${animationDuration}s ease-in-out infinite alternate`,
                  animationDelay: `${index * 0.1}s`,
                  outline: "1px solid rgba(0, 0, 0, 0)",
                  boxSizing: "border-box",
                  ["--initial-scale" as string]: height / 100,
                } as CSSProperties}
              >
                {noiseAmount > 0 && (
                  <div style={noiseLayerStyle(Math.min(noiseAmount, 0.5) * 2, 100, "0s")} />
                )}
                {showSecondLayer && (
                  <div style={noiseLayerStyle((noiseAmount - 0.5) * 2, 220, "0.15s")} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

interface ComponentProps {
  numBars?: number
  gradientFrom?: string
  gradientTo?: string
  animationDuration?: number
  direction?: Direction
  noise?: number
  backgroundColor?: string
}

export default function GradientBarsBackground({
  numBars = 7,
  gradientFrom = "rgb(255, 60, 0)",
  gradientTo = "transparent",
  animationDuration = 2,
  direction = "bottom",
  noise = 0,
  backgroundColor = "rgb(10, 10, 10)",
}: ComponentProps) {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor,
      }}
    >
      <GradientBars
        numBars={numBars}
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
        animationDuration={animationDuration}
        direction={direction}
        noise={noise}
      />
    </section>
  )
}
