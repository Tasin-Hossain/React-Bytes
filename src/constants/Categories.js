import {
  RiRocketLine,
  RiFolderLine
} from 'react-icons/ri';

import { BackgroundsIcon, CardsIcon, CarouselsIcon, CursorIcon, TextAnimationsIcon } from './CustomIcons.jsx';


// Fallback icon used for any category that doesn't set its own `icon`.
export const DEFAULT_CATEGORY_ICON = RiFolderLine;

export const NEW = [
  'RainDrop Text',
  'Shatter Text',
  'Scroll Stack',
  'Shatter Text',
  'AsciiPlasma Wave',
  'Rotating Stars',
  'Letter3D Swap',
  'Text Pressure',
  'WavePath Text',
  'Particle Text',
  'Mask Reveal',
  'Blur Highlight',
  'Prismatic Burst',
  'Gradient Bars',
  'Spiral Images',
  'Curved Marquee',
  'Silk'





];
export const UPDATED = [];

export const CATEGORIES = [
  {
    name: 'Get Started',
    icon: RiRocketLine,
    subcategories: ['Introduction', 'Installation', 'MCP', 'All Components']
  },
  {
    name: 'Text Animations',
    icon: TextAnimationsIcon,
    subcategories: [
      'Letter3D Swap',
      'Text Pressure',
      'Particle Text',
      'Blur Highlight',
      'Magnetic Text',
      'Curtain Text',
      'Cursor Trail',
      'Blur Text',
      'MeltGlitch Text',
      'Neon Flicker',
      'Smoke Away',
      'Spotlight Text',
      'StaticNoise Text',
      'RainDrop Text',
      'Shatter Text',
      'WavePath Text',
      'Curved Marquee',
      'SmokeyCursor Effect'

    ]
  },

  {
    name: 'Carousels',
    icon: CarouselsIcon,
    subcategories: [
      'Rotating Cards',
      'Rotating Carousel',
      'Scroll Stack',
      'Spectra Slider',
      'Spiral Images'
    ]
  },
   {
    name: 'Cards',
    icon: CardsIcon,
    subcategories: [
      'ImageCard Hover',
    ]
  },
  {
    name: 'Cursors',
    icon: CursorIcon,
    subcategories: [
      'SmokeyCursor Effect',
    ]
  },
  {
    name: 'Backgrounds',
    icon: BackgroundsIcon,
    subcategories: [
      'MouseRepel Dots',
      'MouseRepel Grid',
      'Blinking Squares',
      'Half Tone',
      'Vortex',
      'Ascii Wave',
      'Emoji Wave',
      'Shapes Dots',
      'AsciiPlasma Wave',
      'Rotating Stars',
      'Prismatic Burst',
      'Gradient Bars',
      'Silk'
    ]
  }
];