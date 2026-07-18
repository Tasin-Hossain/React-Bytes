import {
  RiRocketLine,
  RiFolderLine
} from 'react-icons/ri';
import { RxText } from "react-icons/rx";
import { TbCarouselHorizontal } from "react-icons/tb";
import { TbPlayCardStar } from "react-icons/tb";
import { PiSelectionBackground } from "react-icons/pi";



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
  'Curved Marquee'





];
export const UPDATED = [];

// Used for main sidebar navigation.
// `icon` is the react-icons component shown next to the category in the
// sidebar — set it here (not in Sidebar.jsx) so adding a new category
// automatically gets its icon without touching the sidebar component.
export const CATEGORIES = [
  {
    name: 'Get Started',
    icon: RiRocketLine,
    subcategories: ['Introduction', 'Installation', 'MCP', 'All Components']
  },
  {
    name: 'Text Animations',
    icon: RxText,
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
      'Curved Marquee'

    ]
  },

  {
    name: 'Carousels',
    icon: TbCarouselHorizontal,
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
    icon: TbPlayCardStar,
    subcategories: [
      'ImageCard Hover',
    ]
  },
  {
    name: 'Backgrounds',
    icon: PiSelectionBackground,
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
    ]
  }
];