import useComponentProps from "../../../hooks/useComponentProps";
import { FaArrowRotateLeft } from "react-icons/fa6";
import DemoOverlay from "./DemoOverlay";

const PreviewTab = ({ className, children,childrenClassname, showReplay = true, minHeight = 'min-h-100!', demoContent = false, onToggleDemoContent }) => {
  const { replay, animKey } = useComponentProps();

  return (
    <div
      className={`relative rounded-md border border-(--border-secondary) bg-(--bg-white)/3 z-10
        flex items-center justify-center ${minHeight} mb-6 overflow-hidden ${className}`}
    >
      {showReplay && <RefreshButton onClick={replay} />}
      
      {/* childrenClassname for backgrounds  */}
      <div key={animKey} className={` ${childrenClassname} `}>
        {children}
      </div>

      {demoContent && <DemoOverlay />}

      {onToggleDemoContent && (
  <button
    type="button"
    role="switch"
    aria-checked={demoContent}
    aria-label="Show Demo"
    onClick={() => onToggleDemoContent(!demoContent)}
    onKeyDown={(e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onToggleDemoContent(!demoContent);
      }
    }}
    className="absolute bottom-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5
      rounded-md border border-(--border-secondary) bg-(--bg-elevated)
      text-(--text-muted) hover:text-(--text-primary) text-xs font-medium
      transition-all duration-150 cursor-pointer outline-none touch-none
      focus-visible:outline-2 focus-visible:outline-(--bg-white)/20"
  >
    <span>Show Demo</span>

    <span
      className={[
        'relative w-9 h-5 rounded-full border border-(--border-button)',
        'transition-colors duration-200',
        demoContent ? 'bg-(--brand)' : 'bg-(--bg-white)/8',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 w-3.5 h-3.5 rounded-full',
          'transition-transform duration-200',
          demoContent ? 'translate-x-0 bg-white' : '-translate-x-3.5 bg-(--bg-white)/50',
        ].join(' ')}
      />
    </span>
  </button>
)}
    </div>
  );
};

export const RefreshButton = ({ onClick }) => (
  <button
    onClick={onClick}
    title="Replay"
    className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center
      rounded-md border border-(--border-button) bg-(--bg-button) 
      text-(--text-muted) hover:text-(--text-primary) transition-all duration-150 cursor-pointer"
  >
    <FaArrowRotateLeft />
  </button>
);

export default PreviewTab;