import { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaInfo } from 'react-icons/fa';
import { TOOLS } from '../config/toolRegistry';

const ToolDropdown = ({ selectedTool, onSelect, isOpen, setIsOpen }) => {
  const ref = useRef(null);
  const [tooltip, setTooltip] = useState(false);
  const selected = TOOLS.find(t => t.id === selectedTool) || TOOLS[0];
  const Icon = selected.icon;

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [setIsOpen]);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2.5 rounded-xl border border-(--border-secondary) bg-(--bg-card) px-3 py-2.5 transition hover:border-(--brand)/30"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-(--brand)/15">
            <Icon size={15} className="text-(--brand)" />
          </div>
          <span className="text-[14px] font-semibold text-(--text-primary)">{selected.label}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Info tooltip */}
          <div
            className="relative"
            onMouseEnter={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)}
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
          >
            <FaInfo size={14} className="text-(--text-muted)" />
            {tooltip && (
              <div className="absolute bottom-full left-1/2 z-9999 mb-2 w-52 -translate-x-1/2 rounded-lg border border-(--border-secondary) bg-(--bg-card) p-2.5 text-[12px] leading-relaxed text-(--text-muted) shadow-xl">
                {selected.description}
              </div>
            )}
          </div>

          <FaChevronDown
            size={14}
            className={`text-(--text-muted) transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Options list */}
      <div
        className={`absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-(--border-secondary) bg-(--bg-card) shadow-xl transition-all duration-200 ${
          isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        {TOOLS.map(tool => {
          const TIcon = tool.icon;
          const active = selectedTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => { onSelect(tool.id); setIsOpen(false); }}
              className={`flex w-full items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-(--bg-button) ${active ? 'bg-(--bg-button)' : ''}`}
            >
              <div className={`flex size-6 items-center justify-center rounded-lg transition-colors ${active ? 'bg-(--brand)/20' : 'bg-(--bg-button)'}`}>
                <TIcon size={13} className={active ? 'text-(--brand)' : 'text-(--text-muted)'} />
              </div>
              <span className={`text-[13px] ${active ? 'font-semibold text-(--text-primary)' : 'font-medium text-(--text-secondary)'}`}>
                {tool.label}
              </span>
              {!tool.component && (
                <span className="ml-auto text-[10px] font-bold text-(--text-muted)">SOON</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ToolDropdown;
