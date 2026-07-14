import { ElementType, CSSProperties, ComponentPropsWithoutRef } from 'react';

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
  as = 'h1' as ElementType,

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  scale = false,

  textColor = '#FFFFFF',

  className = '',
  style,
  ...rest
}: TextPressureProps & Omit<ComponentPropsWithoutRef<'h1'>, keyof TextPressureProps>) {
  const mergedStyle: CSSProperties = {
    ['--hover-padding' as string]: width ? 'calc(1em / 12)' : '0px',
    color: textColor,
    ...style
  };

  const weightClasses = weight
    ? 'hover:font-[900] has-[+span:hover]:font-[600] has-[+span+span:hover]:font-[400] [:hover+&]:font-[600] [:hover+span+&]:font-[400]'
    : '';

  const widthClasses = width
    ? 'hover:[padding-inline:var(--hover-padding)] has-[+span:hover]:[padding-inline:var(--hover-padding)] [:hover+&]:[padding-inline:var(--hover-padding)]'
    : '';

  const italicClasses = italic ? 'hover:italic' : '';

  const scaleClasses = scale ? 'hover:scale-125' : '';

  const alphaClasses = alpha ? 'opacity-50 hover:opacity-100 has-[+span:hover]:opacity-80 [:hover+&]:opacity-80' : '';

  const wrapperLayout = flex ? 'flex flex-wrap' : 'inline-flex';
  const TagComponent = as as any;

  return (
    <TagComponent
      {...rest}
      className={`${wrapperLayout} font-light text-6xl sm:text-6xl md:text-6xl lg:text-8xl ${className}`}
      style={mergedStyle}
    >
      {text.split('').map((letter, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            transition: 'font-weight 0.4s, padding 0.4s, opacity 0.4s, transform 0.4s',
            willChange: 'font-weight, padding, opacity, transform'
          }}
          className={['inline-block', weightClasses, widthClasses, italicClasses, scaleClasses, alphaClasses]
            .filter(Boolean)
            .join(' ')}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </TagComponent>
  );
}