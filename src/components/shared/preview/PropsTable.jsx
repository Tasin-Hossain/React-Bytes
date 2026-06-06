export const PropsTable = ({ PROPS_DATA }) => (
  <section className="mb-8">
    <h2 className="title-two mb-4">Props</h2>

    {/* Desktop table */}
    <div className="hidden sm:block rounded-md border border-(--border-secondary) overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-(--border-button) bg-(--bg-button)">
            {['Property', 'Type', 'Default', 'Description'].map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-(--text-primary) font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PROPS_DATA.map((p) => (
            <tr key={p.name} className="border-b border-(--border-secondary) last:border-0">
              <td className="px-4 py-2.5"><code className="text-(--text-muted) bg-(--bg-button) border border-(--border-button) px-1.5 py-0.5 rounded text-xs">{p.name}</code></td>
              <td className="px-4 py-2.5 text-(--text-muted)">{p.type}</td>
              <td className="px-4 py-2.5"><code className="text-(--text-muted) bg-(--bg-button) border border-(--border-button) px-1.5 py-0.5 rounded text-xs">{p.def}</code></td>
              <td className="px-4 py-2.5 text-(--text-muted)">{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile cards */}
    <div className="flex sm:hidden flex-col gap-2.5">
      {PROPS_DATA.map((p) => (
        <div key={p.name} className="rounded-md border border-(--border-secondary) p-3.5 space-y-2 bg-(--bg-elevated)">
          <code className="">{p.name}</code>
          <div className="flex justify-between text-[13px]">
            <span className="text-(--text-muted)">Type</span>
            <span className="text-(--text-muted)">{p.type}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-(--text-muted)">Default</span>
            <code className="...">{p.def}</code>
          </div>
          <div className="text-[13px] text-(--text-muted)">{p.desc}</div>
        </div>
      ))}
    </div>
  </section>
);