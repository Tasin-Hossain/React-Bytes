
const IconBase = ({ children, size = 16, className = "shrink-0", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {children}
  </svg>
);


export const TextAnimationsIcon = (props) => (
  <IconBase {...props}>
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" x2="15" y1="20" y2="20" />
    <line x1="12" x2="12" y1="4" y2="20" />
  </IconBase>
);


export const CardsIcon = (props) => (
  <IconBase {...props}>
    <rect width="20" height="12" x="2" y="6" rx="2" />
  </IconBase>
);


export const CursorIcon = (props) => (
  <IconBase {...props}>
    <path d="M11.8125 16.3125L14.6614 13.4636C15.1815 12.9435 14.981 12.0588 14.2876 11.8137L5.47398 8.69785C4.68128 8.41761 3.91761 9.18128 4.19785 9.97398L7.31369 18.7876C7.55884 19.481 8.44353 19.6815 8.96361 19.1614L11.8125 16.3125ZM11.8125 16.3125L16.5 21" />
    <path d="M20 4H11" />
    <path d="M20 8H16" />
  </IconBase>
);


export const BackgroundsIcon = (props) => (
  <IconBase {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </IconBase>
);


export const CarouselsIcon = (props) => (
  <IconBase {...props}>
    <path d="M15 4H9C7.89543 4 7 4.89543 7 6V18C7 19.1046 7.89543 20 9 20H15C16.1046 20 17 19.1046 17 18V6C17 4.89543 16.1046 4 15 4Z" />
    <path d="M17 6H19C20.1046 6 21 6.89543 21 8V16C21 17.1046 20.1046 18 19 18H17" />
    <path d="M7 18H5C3.89543 18 3 17.1046 3 16V8C3 6.89543 3.89543 6 5 6H7" />
  </IconBase>
);
