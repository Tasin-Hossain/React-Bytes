
const PkgTabs = ({ active, onChange }) => {
  return (
    <div className="flex items-center gap-3 mb-2">
    {['pnpm', 'npm', 'yarn', 'bun'].map((p) => (
      <button
        key={p}
        onClick={() => onChange(p)}
        className={`text-sm px-2 py-0.5 rounded transition-colors duration-150 cursor-pointer
          ${active === p
            ? 'text-(--brand) font-semibold underline underline-offset-5 '
            : 'text-(--text-muted) hover:text-(--text-primary)'}`}
      >
        {p}
      </button>
    ))}
  </div>
  )
}

export default PkgTabs