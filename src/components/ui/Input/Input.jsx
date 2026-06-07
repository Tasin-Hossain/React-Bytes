// components/ui/Input/Input.jsx

const InputGroup = ({ startElement, endElement, className = '', children }) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      {startElement && (
        <div className="absolute left-3 z-10 flex items-center pointer-events-none">
          {startElement}
        </div>
      )}
      {children}
      {endElement && (
        <div className="absolute right-3 z-10 flex items-center pointer-events-none">
          {endElement}
        </div>
      )}
    </div>
  );
};

const Input = ({
  value,
  onChange,
  placeholder = '',
  disabled = false,
  className = '',
  startElement,
  endElement,
  ...props
}) => {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      
      className={`
        w-full h-9 rounded-md text-sm font-medium
        bg-(--bg-input) text-(--text-primary)
        border border-(--border-secondary)
        backdrop-blur-[32px]
        placeholder:text-(--text-muted) 
        transition-colors duration-150
        outline-none focus:border-(--brand) shadow-none
        hover:border-(--border-primary)
        disabled:opacity-40 disabled:pointer-events-none
        ${startElement ? 'pl-9' : 'pl-3'}
        ${endElement ? 'pr-9' : 'pr-3'}
        ${className}
      `}
      {...props}
    />
  );
};

export { InputGroup, Input };