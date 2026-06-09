// SearchModal.jsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { RiSearchLine, RiArrowRightLine } from 'react-icons/ri';
import { useNavigate } from 'react-router';
import { CATEGORIES, NEW, UPDATED } from '../../constants/Categories.js';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const ALL_ITEMS = useMemo(
    () => CATEGORIES.flatMap(cat => cat.subcategories.map(sub => ({ name: sub, category: cat.name }))),
    []
  );

  const results = useMemo(() => {
    if (!query.trim()) return ALL_ITEMS;
    const q = query.toLowerCase();
    return ALL_ITEMS.filter(item => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));
  }, [query, ALL_ITEMS]);

  const grouped = useMemo(() => {
    const map = {};
    results.forEach(item => {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    });
    return Object.entries(map);
  }, [results]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      setActiveIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = e => {
      if (e.key === '/' && !isOpen) {
        e.preventDefault();
        onClose(true);
      }
      if (e.key === 'Escape' && isOpen) onClose(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const toRoute = item => {
    const categorySlug = item.category.toLowerCase().replace(/\s+/g, '-');
    const nameSlug = item.name.toLowerCase().replace(/\s+/g, '-');
    return `/${categorySlug}/${nameSlug}`;
  };

  const handleKeyDown = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      navigate(toRoute(results[activeIndex]));
      onClose(false);
    }
  };

  const handleSelect = item => {
    navigate(toRoute(item));
    onClose(false);
  };

  if (!isOpen) return null;

  let flatIndex = 0;

  return (
    <div
      className="fixed inset-0 z-999 flex items-start justify-center px-4"
      style={{ paddingTop: 'clamp(60px, 12vh, 120px)' }}
      onClick={() => onClose(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-140 rounded-md overflow-hidden bg-(--bg-card) border border-(--border-secondary)"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 ">
          <RiSearchLine size={17} className="text-(--text-muted) shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search components, categories, or keywords..."
            className="flex-1 bg-transparent outline-none ring-0 border-none text-[14px] text-(--text-primary) placeholder:text-(--text-muted)"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-(--text-muted) hover:text-(--text-primary) transition-colors text-xs px-1.5 py-0.5 rounded border border-(--border-button) bg-(--bg-button)"
            >
              clear
            </button>
          )}
          <kbd className="text-xs px-1.5 py-0.5 rounded-md border border-(--border-button) bg-(--bg-button) text-(--text-muted)">
            esc
          </kbd>
        </div>

        <div className="h-px bg-(--border-secondary)" />

        {/* Results */}
        <div ref={listRef} className="max-h-95 overflow-y-auto sidebar-scroll p-2">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <RiSearchLine size={28} className="text-(--text-muted) opacity-40" />
              <p className="text-sm text-(--text-muted)">
                No results for <span className="text-(--text-primary)">"{query}"</span>
              </p>
            </div>
          ) : (
            grouped.map(([category, items]) => (
              <div key={category} className="mb-1">
                <p className="text-[10.5px] font-semibold text-(--text-primary) uppercase tracking-widest px-2.5 pt-3 pb-1.5">
                  {category}
                </p>
                {items.map(item => {
                  const idx = flatIndex++;
                  const isActive = activeIndex === idx;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleSelect(item)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer text-left transition-all duration-100 group
                        ${isActive ? 'bg-(--bg-hover)' : 'hover:bg-(--bg-hover)'}`}
                    >
                      {/* Active indicator */}
                      <span
                        className={`shrink-0 w-1 h-1 rounded-full transition-all duration-150
                          ${isActive ? 'bg-(--brand) scale-100' : 'bg-transparent scale-0'}`}
                      />

                      <span
                        className={`flex-1 text-[13px] transition-colors duration-100
                        ${isActive ? 'text-(--text-primary)' : 'text-(--text-muted) group-hover:text-(--text-primary)'}`}
                      >
                        {item.name}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {NEW.includes(item.name) && (
                          <span className="text-[11px] font-bold px-2 py-px rounded-md bg-linear-to-r from-(--brand) to-violet-500 text-white">
                            New
                          </span>
                        )}
                        {UPDATED.includes(item.name) && (
                          <span className="text-[11px] font-bold px-2 py-px rounded-md bg-(--bg-button) text-(--text-muted) border border-(--border-button)">
                            Updated
                          </span>
                        )}
                        <RiArrowRightLine
                          size={13}
                          className={`transition-all duration-150
                            ${isActive ? 'text-(--brand) translate-x-0 opacity-100' : 'opacity-0 -translate-x-1'}`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="h-px bg-(--border-secondary)" />
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex gap-3">
            {[
              ['↑↓', 'navigate'],
              ['<-', 'select'],
              ['esc', 'close']
            ].map(([key, label]) => (
              <span key={key} className="flex items-center gap-1.5 text-[11px] text-(--text-muted)">
                <kbd className="px-1.5 py-0.5 rounded-md border border-(--border-button) bg-(--bg-button) text-[10px] font-medium">
                  {key}
                </kbd>
                {label}
              </span>
            ))}
          </div>
          <span className="text-[11px] text-(--text-muted)">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
