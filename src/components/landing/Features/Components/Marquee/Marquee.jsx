import { Link } from 'react-router';
import './Marquee.css';

const Marquee = () => {
  const toSlug = s => s.toLowerCase().replace(/\s+/g, '-');

  const ROW_A = [
    { name: 'Dot Field', cat: 'backgrounds' },
    { name: 'Line Waves', cat: 'backgrounds' },
    { name: 'Blob Cursor', cat: 'animations' },
    { name: 'Soft Aurora', cat: 'backgrounds' },
    { name: 'Magnet Lines', cat: 'animations' },
    { name: 'Antigravity', cat: 'animations' },
    { name: 'Ballpit', cat: 'backgrounds' },
    { name: 'Pixel Trail', cat: 'animations' },
    { name: 'Magic Rings', cat: 'animations' }
  ];

  const ROW_B = [
    { name: 'Radar', cat: 'backgrounds' },
    { name: 'Shape Grid', cat: 'backgrounds' },
    { name: 'Ribbons', cat: 'animations' },
    { name: 'Grainient', cat: 'backgrounds' },
    { name: 'Orbit Images', cat: 'animations' },
    { name: 'Metallic Paint', cat: 'animations' },
    { name: 'Balatro', cat: 'backgrounds' },
    { name: 'Aurora', cat: 'backgrounds' },
    { name: 'Splash Cursor', cat: 'animations' },
    { name: 'Beams', cat: 'backgrounds' }
  ];

  return (
    <div
      className="
        w-full h-full
        flex flex-col justify-center
        gap-2
        mask-[linear-gradient(90deg,transparent_0%,#000_15%,#000_85%,transparent_100%)]
        [-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_15%,#000_85%,transparent_100%)]
      "
    >
      {[
        { items: ROW_A, dur: '25s', rev: false },
        { items: ROW_B, dur: '28s', rev: true }
      ].map(({ items, dur, rev }, ri) => (
        <div key={ri} className="overflow-hidden w-full group">
          <div
            className={`
              flex gap-2 w-max
              ${rev ? 'animate-[marqueeRev_linear_infinite]' : 'animate-[marquee_linear_infinite]'}
              group-hover:[animation-play-state:paused]
            `}
            style={{ animationDuration: dur }}
          >
            {[...items, ...items].map((c, i) => (
              <Link
                key={i}
                to={`/${c.cat}/${toSlug(c.name)}`}
                className="
                  font-mono text-[12px]
                  text-(--text-muted)
                  no-underline
                  bg-(--bg-button)
                  border border-(--border-button)
                  rounded-[7px]
                  py-1.25 px-3
                  whitespace-nowrap shrink-0
                  transition-all duration-200
                  group-hover:text-(--text-muted)
                  group-hover:border-(--border-button)
                  group-hover:bg-(--bg-button)
                  hover:text-(--text-primary)!
                  hover:border-(--border-button)!
                  hover:bg-(--border-button)!
                  hover:scale-[1.07]
                "
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Marquee;
