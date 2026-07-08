import { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { FaCode } from 'react-icons/fa6';
import { FaArrowRotateLeft } from 'react-icons/fa6';
import { IoCopyOutline, IoCheckmark } from 'react-icons/io5';
import useComponentProps from '../../hooks/useComponentProps';

const TabsLayout = ({ preview, code, componentName }) => {
  const { mainTab, setMainTab, replay } = useComponentProps();
  const [copied, setCopied] = useState(false);

  const containerRef = useRef(null);
  const indicatorRef = useRef(null);
  const btnRefs = useRef({});
  const [hovered, setHovered] = useState(null);
  const copyBtnRef = useRef(null);
  const replayBtnRef = useRef(null);

  const targetTab = hovered ?? mainTab;

  useLayoutEffect(() => {
    const btn = btnRefs.current[targetTab];
    const container = containerRef.current;
    if (!btn || !container) return;

    const btnRect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    gsap.to(indicatorRef.current, {
      x: btnRect.left - containerRect.left,
      width: btnRect.width,
      duration: 0.3,
      ease: 'power3.out'
    });
  }, [targetTab]);

  const handleTabClick = (tab) => {
    setMainTab(tab);
    gsap.fromTo(
      btnRefs.current[tab],
      { scale: 0.92 },
      { scale: 1, duration: 0.3, ease: 'back.out(3)' }
    );
  };

  const handleCopy = () => {
    if (!componentName) return;
    navigator.clipboard?.writeText(componentName);
    setCopied(true);

    gsap.fromTo(
      copyBtnRef.current,
      { scale: 0.7, rotate: -15 },
      { scale: 1, rotate: 0, duration: 0.35, ease: 'back.out(4)' }
    );

    setTimeout(() => setCopied(false), 1200);
  };

  const handleReplay = () => {
    replay?.();
    gsap.fromTo(
      replayBtnRef.current,
      { rotate: 0, scale: 0.9 },
      { rotate: -360, scale: 1, duration: 0.6, ease: 'power3.out' }
    );
  };

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">

        {/* Left — tabs + component name + copy */}
        <div className="flex items-center gap-3">
          <div
            ref={containerRef}
            onMouseLeave={() => setHovered(null)}
            className="relative flex items-center gap-1 rounded-md p-1"
          >
            {/* sliding indicator */}
            <div
              ref={indicatorRef}
              className="absolute top-1 bottom-1 left-0 rounded-md bg-(--bg-button) pointer-events-none"
            />

            <TabBtn
              tabRef={(el) => (btnRefs.current['preview'] = el)}
              active={mainTab === 'preview'}
              onClick={() => handleTabClick('preview')}
              onMouseEnter={() => setHovered('preview')}
              icon={<MdOutlineRemoveRedEye size={16} />}
            >
              Preview
            </TabBtn>
            <TabBtn
              tabRef={(el) => (btnRefs.current['code'] = el)}
              active={mainTab === 'code'}
              onClick={() => handleTabClick('code')}
              onMouseEnter={() => setHovered('code')}
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
                  ref={copyBtnRef}
                  onClick={handleCopy}
                  title="Copy name"
                  className="flex items-center justify-center w-6 h-6 rounded-md
                    text-(--text-muted) hover:text-(--text-primary)
                    transition-colors duration-150 cursor-pointer"
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
              ref={replayBtnRef}
              onClick={handleReplay}
              title="Replay"
              className="flex items-center justify-center w-9 h-9
                rounded-md border border-(--border-button) bg-(--bg-button)
                text-(--text-muted) hover:text-(--text-primary)
                transition-colors duration-150 cursor-pointer"
            >
              <FaArrowRotateLeft size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Active tab */}
      {mainTab === 'preview' && (
        <div className="mx-auto transition-all duration-300">
          {preview}
        </div>
      )}
      {mainTab === 'code' && code}
    </div>
  );
};

const TabBtn = ({ active, onClick, onMouseEnter, icon, children, tabRef }) => (
  <button
    ref={tabRef}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    className={`relative z-10 flex items-center gap-1.5 px-3 h-9 rounded-md text-sm 
      transition-colors duration-200 cursor-pointer
      ${active ? 'text-(--text-primary)' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
  >
    {icon}
    {children}
  </button>
);

export default TabsLayout;