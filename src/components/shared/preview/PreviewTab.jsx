import useComponentProps from "../../../hooks/useComponentProps";
import { FaArrowRotateLeft } from "react-icons/fa6";

const PreviewTab = ({ children, showReplay = true, minHeight = 'min-h-90!' }) => {
  const { replay, animKey } = useComponentProps(); 

  return (
    <div
      className={`relative rounded-md border border-(--border-secondary) bg-(--bg-white)/3 z-10
        flex items-center justify-center ${minHeight} mb-6 overflow-hidden`}
    >
      {showReplay && <RefreshButton onClick={replay} />}
      <div key={animKey} className="contents"> 
        {children}
      </div>
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