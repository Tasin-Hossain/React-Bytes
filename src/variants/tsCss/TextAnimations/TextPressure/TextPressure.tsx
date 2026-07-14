import { useId, ElementType, CSSProperties, ComponentPropsWithoutRef } from "react";

interface TextPressureProps {
  text: string;
  as?: ElementType;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  scale?: boolean;
  textColor?: string;
  className?: string;
  style?: CSSProperties;
}

export function TextPressure({
  text,
  as = "h1" as ElementType,

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  scale = false,

  textColor = "#FFFFFF",

  className = "",
  style,
  ...rest
}: TextPressureProps & Omit<ComponentPropsWithoutRef<"h1">, keyof TextPressureProps>) {
  const uid = useId().replace(/:/g, "");
  const rootClass = `tp-root-${uid}`;
  const TagComponent = as as any;

  return (
    <>
      <style>{`
        .${rootClass} {
          --tp-hover-padding: ${width ? "calc(1em / 12)" : "0px"};
          display: ${flex ? "flex" : "inline-flex"};
          flex-wrap: ${flex ? "wrap" : "nowrap"};
          justify-content: center;
          text-transform: uppercase;
          text-align: center;
          font-weight: 300;
          font-size: 3.75rem;
          color: ${textColor};
        }
        @media (min-width: 1024px) {
          .${rootClass} { font-size: 6rem; }
        }
        .${rootClass} .tp-letter {
          display: inline-block;
          transition: font-weight 0.4s, padding 0.4s, opacity 0.4s, transform 0.4s;
          will-change: font-weight, padding, opacity, transform;
        }
        ${weight ? `
        .${rootClass} .tp-letter:hover { font-weight: 900; }
        .${rootClass} .tp-letter:has(+ .tp-letter:hover) { font-weight: 600; }
        .${rootClass} .tp-letter:has(+ .tp-letter + .tp-letter:hover) { font-weight: 400; }
        .${rootClass} .tp-letter:hover + .tp-letter { font-weight: 600; }
        .${rootClass} .tp-letter:hover + .tp-letter + .tp-letter { font-weight: 400; }
        ` : ""}
        ${width ? `
        .${rootClass} .tp-letter:hover,
        .${rootClass} .tp-letter:has(+ .tp-letter:hover),
        .${rootClass} .tp-letter:hover + .tp-letter {
          padding-inline: var(--tp-hover-padding);
        }
        ` : ""}
        ${italic ? `.${rootClass} .tp-letter:hover { font-style: italic; }` : ""}
        ${scale ? `.${rootClass} .tp-letter:hover { transform: scale(1.25); }` : ""}
        ${alpha ? `
        .${rootClass} .tp-letter { opacity: 0.5; }
        .${rootClass} .tp-letter:hover { opacity: 1; }
        .${rootClass} .tp-letter:has(+ .tp-letter:hover),
        .${rootClass} .tp-letter:hover + .tp-letter { opacity: 0.8; }
        ` : ""}
        .tp-sr-only {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>

      <TagComponent {...rest} className={`${rootClass} ${className}`} style={style}>
        {text.split("").map((letter, i) => (
          <span key={i} aria-hidden="true" className="tp-letter">
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
        <span className="tp-sr-only">{text}</span>
      </TagComponent>
    </>
  );
}