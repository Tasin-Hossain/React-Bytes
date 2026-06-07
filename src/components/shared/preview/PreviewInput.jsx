const PreviewInput = ({
  title = '',
  value = '',
  placeholder = '',
  maxLength,
  isDisabled = false,
  onChange
}) => {
  const handleChange = (e) => onChange?.(e.target.value);

  return (
    <div className="relative w-full select-none">
      <div
        className="relative h-10 rounded-md bg-(--bg-elevated) border border-(--border-secondary)
          overflow-hidden cursor-default opacity-100 data-[disabled=true]:opacity-35
          data-[disabled=true]:pointer-events-none"
        data-disabled={isDisabled}
      >
        {/* Label */}
        <span className="absolute top-1/2 left-3.5 -translate-y-1/2 whitespace-nowrap
          text-(--text-muted) text-[13px] pointer-events-none z-4">
          {title}
        </span>

        {/* Input */}
        <input
          className="absolute inset-0 bg-transparent border-none! outline-none!
            text-(--text-primary) font-mono text-sm font-medium
            pl-[40%] pr-3 text-right z-4 placeholder:text-(--text-muted)"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={isDisabled}
          aria-label={title}
        />
      </div>
    </div>
  );
};

export default PreviewInput;