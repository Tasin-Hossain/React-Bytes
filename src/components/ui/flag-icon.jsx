// components/ui/flag-icon.jsx
const FlagIcon = ({ code, className = '' }) => {
  if (!code) return null;

  return (
    <span
      className={`fi fi-${code.toLowerCase()} inline-block shrink-0 bg-cover bg-center ${className}`}
      role="img"
      aria-label={`${code.toUpperCase()} flag`}
    />
  );
};

export default FlagIcon;