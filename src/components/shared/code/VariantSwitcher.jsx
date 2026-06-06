const SegmentedControl = ({ options, active, onChange }) => (
  <div className="flex items-center gap-0.5 bg-(--bg) border border-(--border-button) rounded-md p-0.5">
    {options.map(({ value, label }) => (
      <button
        key={value}
        onClick={() => onChange(value)}
        className={`px-2.5 sm:px-3 h-8 rounded-md text-xs sm:text-sm transition-all duration-150 cursor-pointer whitespace-nowrap
          ${active === value ? 'bg-(--bg-button) text-(--text-primary)' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
      >
        {label}
      </button>
    ))}
  </div>
);

const VariantSwitcher = ({ langTab, setLangTab, styleTab, setStyleTab }) => (
  <div className="flex flex-wrap items-center gap-2">
    <SegmentedControl
      options={[{ value: 'js', label: 'JavaScript' }, { value: 'ts', label: 'TypeScript' }]}
      active={langTab}
      onChange={setLangTab}
    />
    <SegmentedControl
      options={[{ value: 'css', label: 'CSS' }, { value: 'tailwind', label: 'Tailwind' }]}
      active={styleTab}
      onChange={setStyleTab}
    />
  </div>
);

export default VariantSwitcher;