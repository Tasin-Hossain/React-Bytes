import { useState } from 'react';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { FaCode } from 'react-icons/fa6';
import { FaArrowRotateLeft } from 'react-icons/fa6';
import { IoCopyOutline, IoCheckmark } from 'react-icons/io5';
import useComponentProps from '../../hooks/useComponentProps';



const TabsLayout = ({ preview, code, componentName }) => {
  const { mainTab, setMainTab, replay } = useComponentProps();
  const [copied, setCopied] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const handleCopy = () => {
    if (!componentName) return;
    navigator.clipboard?.writeText(componentName);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleReplay = () => {
    setSpinning(true);
    replay?.();
    setTimeout(() => setSpinning(false), 500);
  };

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">

        {/* Left — tabs + component name + copy */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <TabBtn
              active={mainTab === 'preview'}
              onClick={() => setMainTab('preview')}
              icon={<MdOutlineRemoveRedEye size={16} />}
            >
              Preview
            </TabBtn>
            <TabBtn
              active={mainTab === 'code'}
              onClick={() => setMainTab('code')}
              icon={<FaCode size={14} />}
            >
              Code
            </TabBtn>
          </div>

          {componentName && (
            <>
              <span className="w-px h-4 bg-(--border-button)" />
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-(--text-muted)">{componentName}</span>
                <button
                  onClick={handleCopy}
                  title="Copy name"
                  className="flex items-center justify-center w-6 h-6 rounded-md
                    text-(--text-muted) hover:text-(--text-primary)
                    transition-all duration-150 cursor-pointer"
                >
                  {copied ? (
                    <IoCheckmark size={13} className="text-emerald-500" />
                  ) : (
                    <IoCopyOutline size={13} />
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right — device buttons + refresh */}
        {mainTab === 'preview' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReplay}
              title="Replay"
              className="flex items-center justify-center w-9 h-9
                rounded-md border border-(--border-button) bg-(--bg-button)
                text-(--text-muted) hover:text-(--text-primary)
                transition-all duration-150 cursor-pointer"
            >
              <FaArrowRotateLeft
                size={13}
                className={`transition-transform duration-500 ${spinning ? 'rotate-[-360deg]' : ''}`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Active tab */}
      {mainTab === 'preview' && (
        <div
          className="mx-auto transition-all duration-300"
        >
          {preview}
        </div>
      )}
      {mainTab === 'code' && code}
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 h-9 rounded-md text-sm 
      transition-all duration-200 cursor-pointer
      ${active
        ? 'bg-(--bg-button) text-(--text-primary)'
        : 'text-(--text-muted) hover:text-(--text-primary)'
      }`}
  >
    {icon}
    {children}
  </button>
);

export default TabsLayout;
