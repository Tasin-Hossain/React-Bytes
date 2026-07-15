import { IoDiamondSharp } from 'react-icons/io5';
import { PiTrophyDuotone, PiMedalDuotone } from 'react-icons/pi';

// NOTE: no JSX here (this is a .js file) — we pass the icon
// *component* itself, and render it with <tier.icon /> in the .jsx file.
export const tiers = [
  {
    label: 'Diamond',
    icon: IoDiamondSharp,
    iconClassName: 'text-(--brand)',
    size: 'lg',
    slots: 2,
    variant: 'full',
    sponsors: [
      // { name: '', desc: '', link: '', logo: '' },
    ],
  },
  {
    label: 'Platinum',
    icon: PiTrophyDuotone,
    iconClassName: 'text-slate-300',
    size: 'md',
    slots: 3,
    variant: 'logo',
    sponsors: [

    ],
  },
  {
    label: 'Silver',
    icon: PiMedalDuotone,
    iconClassName: 'text-amber-500',
    size: 'sm',
    slots: 4,
    variant: 'logo',
    sponsors: []

  },
];