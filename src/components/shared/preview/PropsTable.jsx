import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export const PropsTable = ({ PROPS_DATA }) => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const rows = rootRef.current.querySelectorAll('.props-row, .props-card');
      gsap.set(rows, { opacity: 0, y: 10 });
      gsap.to(rows, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.05,
        delay: 0.05,
      });
    }, rootRef);
    return () => ctx.revert();
  }, [PROPS_DATA]);

  return (
    <section ref={rootRef} className="mb-8 mt-12">
      <h2 className="title-two mb-4">Props</h2>

      {/* Desktop table */}
      <div className="hidden lg:block rounded-md border border-(--border-secondary) overflow-hidden">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {['Property', 'Type', 'Default', 'Description'].map((h) => (
                <th
                  key={h}
                  className="text-left bg-(--bg-card) px-4.5 py-3.5 text-xs font-medium tracking-wide text-(--text-muted) border-b border-(--border-secondary) whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROPS_DATA.map((p) => (
              <tr
                key={p.name}
                className="props-row border-b border-(--border-secondary) last:border-0 transition-colors duration-150 hover:bg-(--bg-hover)"
              >
                <td className="px-4.5 py-3.5 align-middle">
                  <code className="font-mono text-xs font-medium text-(--text-primary) bg-(--bg-button) border border-(--border-button) px-2 py-0.75 rounded-md whitespace-nowrap">
                    {p.name}
                  </code>
                </td>
                <td className="px-4.5 py-3.5 align-middle font-mono text-xs text-(--text-muted) max-w-85 leading-relaxed">
                  {p.type}
                </td>
                <td className="px-4.5 py-3.5 align-middle">
                  <code className="font-mono text-xs font-medium text-(--text-primary) bg-(--bg-button) border border-(--border-button) px-2 py-0.75 rounded-md whitespace-nowrap">
                    {p.def?.length ? p.def : '—'}
                  </code>
                </td>
                <td className="px-4.5 py-3.5 align-middle text-(--text-muted) leading-relaxed">
                  {p.desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex lg:hidden flex-col gap-2.5">
        {PROPS_DATA.map((p) => (
          <div
            key={p.name}
            className="props-card rounded-xl border border-(--border-secondary) p-4 flex flex-col gap-2.5"
          >
            <div className="flex items-center justify-between gap-3">
              <code className="font-mono text-xs font-medium text-(--text-primary) bg-(--bg-button) border border-(--border-button) px-2 py-0.75 rounded-md">
                {p.name}
              </code>
              <span className="font-mono text-[11px] text-(--text-muted) shrink-0">{p.type}</span>
            </div>
            <p className="text-[13px] text-(--text-muted) leading-relaxed m-0">{p.desc}</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-(--text-muted) shrink-0">Default</span>
              <code className="font-mono text-xs font-medium text-(--text-primary) bg-(--bg-button) border border-(--border-button) px-2 py-0.75 rounded-md">
                {p.def?.length ? p.def : '—'}
              </code>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropsTable;
