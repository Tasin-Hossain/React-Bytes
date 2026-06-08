import './Button.css';

const Button = ({
  text = 'Community',
  icon,
  className = '',
  onclick,
  ...props
}) => {
  return (
    <button
      type="button"
      className={`${className} relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-md border-none bg-[linear-gradient(0deg,#7a5af8,#7a5af8),radial-gradient(65.28%_65.28%_at_50%_100%,rgba(223,113,255,0.8)_0%,rgba(223,113,255,0)_100%)] px-3 py-1.5 outline-none transition-all duration-300 active:scale-95 group button-custom`}
      onClick={onclick}
      {...props}
    >
      <div className="absolute inset-0 z-1 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <i key={i} className={`point point-${i + 1}`}></i>
        ))}
      </div>

      <span className="relative z-2 flex items-center justify-center gap-1.5 text-white">
        {text}
        {icon && <span className="flex items-center">{icon}</span>}
      </span>
    </button>
  );
};

export default Button;