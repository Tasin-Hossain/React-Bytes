const PreviewSwitch = ({ label = '', value = false, isDisabled = false, onChange }) => {
  const handleChange = () => {
    if (!isDisabled) onChange?.(!value);
  };

  return (
    <div className="relative w-full select-none">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
        onClick={handleChange}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleChange();
          }
        }}
        className={[
          'relative w-full h-10 flex items-center',
          'rounded-md border border-(--border-secondary)',
          'bg-(--bg-elevated) cursor-pointer outline-none touch-none',
          'focus-visible:outline-2 focus-visible:outline-(--bg-white)/20',
          isDisabled ? 'opacity-35 pointer-events-none' : '',
        ].join(' ')}
      >
        {/* Label */}
        <span className="absolute left-3.5 text-[13px] text-(--text-muted) pointer-events-none whitespace-nowrap">
          {label}
        </span>

        {/* Toggle pill — matches .scrubber-switch-toggle */}
        <span
          className={[
            'absolute right-3 top-1/2 -translate-y-1/2',
            'w-9 h-5 rounded-full border border-(--border-button)',
            'transition-colors duration-200 z-4',
            value ? 'bg-(--brand)' : 'bg-(--bg-white)/8',
          ].join(' ')}
        >
          {/* Knob — matches .scrubber-switch-knob */}
          <span
            className={[
              'absolute top-0.5 w-3.5 h-3.5 rounded-full',
              'transition-transform duration-200',
              value ? 'translate-x-0 bg-white' : '-translate-x-3.5 bg-(--bg-white)/50'
            ].join(' ')}
          />
        </span>
      </button>
    </div>
  );
};

export default PreviewSwitch;