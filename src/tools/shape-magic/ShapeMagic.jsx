import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { RiSettings3Line, RiDownloadLine, RiArrowUpSLine } from 'react-icons/ri';
import Canvas from './Canvas';
import LeftPanel from './components/LeftPanel';
import ExportPanel from './components/ExportPanel';

import { createInitialState, createShape, PRESETS } from './Types';
import { computeBridges, computeCornerRadii } from './Computebridges';
import Ads from '../../components/navbers/Ads';

const useHistory = initialState => {
  const [history, setHistory] = useState([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const current = history[historyIndex];

  const push = useCallback(
    newState => {
      setHistory(prev => [...prev.slice(0, historyIndex + 1), newState]);
      setHistoryIndex(prev => prev + 1);
    },
    [historyIndex]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) setHistoryIndex(prev => prev - 1);
  }, [historyIndex]);
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) setHistoryIndex(prev => prev + 1);
  }, [historyIndex, history.length]);

  return { current, push, undo, redo, canUndo: historyIndex > 0, canRedo: historyIndex < history.length - 1 };
};

// Shared bottom-sheet wrapper used by both mobile triggers (Controls / Export)
const MobileSheet = ({ open, title, onClose, children }) => (
  <>
    <div
      className="fixed inset-0 transition-all duration-300"
      style={{
        background: 'rgba(0,0,0,0.6)',
        opacity: open ? 1 : 0,
        visibility: open ? 'visible' : 'hidden',
        zIndex: 999
      }}
      onClick={onClose}
    />
    <div
      className="fixed bottom-0 left-0 right-0 flex flex-col"
      style={{
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-primary)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 1000,
        height: '85vh',
        maxHeight: '85vh',
        overflow: 'hidden'
      }}
    >
      <div className="flex justify-center pt-3 pb-2 cursor-pointer shrink-0" onClick={onClose}>
        <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-primary)' }} />
      </div>
      <div
        className="flex items-center justify-between px-4 pb-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border-primary)' }}
      >
        <span className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </span>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-colors"
          style={{ background: 'var(--bg-elevated)' }}
          onClick={onClose}
        >
          <RiArrowUpSLine size={20} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        {children}
      </div>
    </div>
  </>
);

export default function ShapeMagic({ toolSelector }) {
  // isMobile now tracks the xl breakpoint (1280px) since that's where the
  // desktop Export sidebar actually appears. Below xl, Export falls back
  // to the floating button + bottom sheet, same as Controls.
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const [mobileExportOpen, setMobileExportOpen] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1280);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const initialState = useMemo(() => createInitialState(), []);
  const { current: state, push: pushState, undo, redo } = useHistory(initialState);

  const [shapes, setShapes] = useState(state.shapes);
  const [selectedIds, setSelectedIds] = useState([]);
  const [style, setStyle] = useState(state.style);
  const [globalRadius, setGlobalRadius] = useState(state.globalRadius);
  const [smoothing, setSmoothing] = useState(state.smoothing);
  const [showBridgeDebug, setShowBridgeDebug] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(10);

  const justPushedRef = useRef(false);
  const tolerance = 1;

  useEffect(() => {
    if (justPushedRef.current) {
      justPushedRef.current = false;
      return;
    }
    setShapes(state.shapes);
    setStyle(state.style);
    setGlobalRadius(state.globalRadius);
    setSmoothing(state.smoothing);
  }, [state]);

  const bridges = useMemo(() => computeBridges(shapes, globalRadius, tolerance), [shapes, globalRadius, tolerance]);
  const cornerRadii = useMemo(
    () => computeCornerRadii(shapes, globalRadius, tolerance),
    [shapes, globalRadius, tolerance]
  );

  const saveToHistory = useCallback(
    (newShapes, newStyle, newRadius, newSmoothing) => {
      justPushedRef.current = true;
      pushState({
        shapes: newShapes ?? shapes,
        style: newStyle ?? style,
        globalRadius: newRadius ?? globalRadius,
        smoothing: newSmoothing ?? smoothing
      });
    },
    [pushState, shapes, style, globalRadius, smoothing]
  );

  const handleApplyPreset = useCallback(
    presetId => {
      const preset = PRESETS.find(p => p.id === presetId);
      if (!preset) return;
      const newShapes = preset.build();
      const newRadius = preset.radius ?? globalRadius;
      setShapes(newShapes);
      setGlobalRadius(newRadius);
      setSelectedIds([]);
      saveToHistory(newShapes, undefined, newRadius);
    },
    [globalRadius, saveToHistory]
  );

  const handleAddShape = useCallback(() => {
    let x = 320,
      y = 240;
    if (shapes.length > 0) {
      const maxX = Math.max(...shapes.map(s => s.x + s.w));
      const minY = Math.min(...shapes.map(s => s.y));
      const maxY = Math.max(...shapes.map(s => s.y + s.h));
      x = maxX + 40;
      y = Math.round((minY + maxY) / 2 - 40);
    }
    const newShape = createShape(x, y, 120, 80);
    const newShapes = [...shapes, newShape];
    setShapes(newShapes);
    setSelectedIds([newShape.id]);
    saveToHistory(newShapes);
  }, [shapes, saveToHistory]);

  const handleDeleteShapes = useCallback(() => {
    if (selectedIds.length === 0) return;
    const newShapes = shapes.filter(s => !selectedIds.includes(s.id));
    setShapes(newShapes);
    setSelectedIds([]);
    saveToHistory(newShapes);
  }, [shapes, selectedIds, saveToHistory]);

  const handleDuplicateShapes = useCallback(() => {
    if (selectedIds.length === 0) return;
    const duplicates = shapes
      .filter(s => selectedIds.includes(s.id))
      .map(s => ({
        ...s,
        id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: s.x + 20,
        y: s.y + 20
      }));
    const newShapes = [...shapes, ...duplicates];
    setShapes(newShapes);
    setSelectedIds(duplicates.map(s => s.id));
    saveToHistory(newShapes);
  }, [shapes, selectedIds, saveToHistory]);

  const handleShapeUpdate = useCallback((id, updates) => {
    setShapes(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const handleDragEnd = useCallback(() => saveToHistory(shapes), [shapes, saveToHistory]);

  const handleAlignShapes = useCallback(
    alignment => {
      if (selectedIds.length < 2) return;
      const selected = shapes.filter(s => selectedIds.includes(s.id));
      const bounds = {
        minX: Math.min(...selected.map(s => s.x)),
        maxX: Math.max(...selected.map(s => s.x + s.w)),
        minY: Math.min(...selected.map(s => s.y)),
        maxY: Math.max(...selected.map(s => s.y + s.h))
      };
      const newShapes = shapes.map(s => {
        if (!selectedIds.includes(s.id)) return s;
        switch (alignment) {
          case 'left':
            return { ...s, x: bounds.minX };
          case 'right':
            return { ...s, x: bounds.maxX - s.w };
          case 'centerH':
            return { ...s, x: bounds.minX + (bounds.maxX - bounds.minX) / 2 - s.w / 2 };
          case 'top':
            return { ...s, y: bounds.minY };
          case 'bottom':
            return { ...s, y: bounds.maxY - s.h };
          case 'centerV':
            return { ...s, y: bounds.minY + (bounds.maxY - bounds.minY) / 2 - s.h / 2 };
          default:
            return s;
        }
      });
      setShapes(newShapes);
      saveToHistory(newShapes);
    },
    [shapes, selectedIds, saveToHistory]
  );

  const handleDistributeShapes = useCallback(
    direction => {
      if (selectedIds.length < 3) return;
      const selected = shapes
        .filter(s => selectedIds.includes(s.id))
        .sort((a, b) => (direction === 'horizontal' ? a.x - b.x : a.y - b.y));

      if (direction === 'horizontal') {
        const minX = selected[0].x;
        const maxX = selected[selected.length - 1].x + selected[selected.length - 1].w;
        const totalShapeWidth = selected.reduce((sum, s) => sum + s.w, 0);
        const gapBetween = (maxX - minX - totalShapeWidth) / (selected.length - 1);
        let currentX = minX;
        const positions = {};
        selected.forEach(s => {
          positions[s.id] = currentX;
          currentX += s.w + gapBetween;
        });
        const newShapes = shapes.map(s => (positions[s.id] !== undefined ? { ...s, x: positions[s.id] } : s));
        setShapes(newShapes);
        saveToHistory(newShapes);
      } else {
        const minY = selected[0].y;
        const maxY = selected[selected.length - 1].y + selected[selected.length - 1].h;
        const totalShapeHeight = selected.reduce((sum, s) => sum + s.h, 0);
        const gapBetween = (maxY - minY - totalShapeHeight) / (selected.length - 1);
        let currentY = minY;
        const positions = {};
        selected.forEach(s => {
          positions[s.id] = currentY;
          currentY += s.h + gapBetween;
        });
        const newShapes = shapes.map(s => (positions[s.id] !== undefined ? { ...s, y: positions[s.id] } : s));
        setShapes(newShapes);
        saveToHistory(newShapes);
      }
    },
    [shapes, selectedIds, saveToHistory]
  );

  const clipboardRef = useRef([]);

  const handleCopyShapes = useCallback(() => {
    if (selectedIds.length === 0) return;
    clipboardRef.current = shapes.filter(s => selectedIds.includes(s.id)).map(s => ({ ...s }));
  }, [shapes, selectedIds]);

  const handlePasteShapes = useCallback(() => {
    if (clipboardRef.current.length === 0) return;
    const pastedShapes = clipboardRef.current.map(s => ({
      ...s,
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: s.x + 20,
      y: s.y + 20
    }));
    clipboardRef.current = pastedShapes.map(s => ({ ...s }));
    const newShapes = [...shapes, ...pastedShapes];
    setShapes(newShapes);
    setSelectedIds(pastedShapes.map(s => s.id));
    saveToHistory(newShapes);
  }, [shapes, saveToHistory]);

  const handleAltDragDuplicate = useCallback(
    shapeIds => {
      if (shapeIds.length === 0) return [];
      const duplicates = shapes
        .filter(s => shapeIds.includes(s.id))
        .map(s => ({
          ...s,
          id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
      const newShapes = [...shapes, ...duplicates];
      setShapes(newShapes);
      setSelectedIds(duplicates.map(s => s.id));
      return duplicates;
    },
    [shapes]
  );

  useEffect(() => {
    const handleKeyDown = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.length > 0) {
        if (document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          handleDeleteShapes();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        handleDuplicateShapes();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        if (document.activeElement?.tagName !== 'INPUT' && selectedIds.length > 0) {
          e.preventDefault();
          handleCopyShapes();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        if (document.activeElement?.tagName !== 'INPUT' && clipboardRef.current.length > 0) {
          e.preventDefault();
          handlePasteShapes();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedIds, handleDeleteShapes, handleDuplicateShapes, handleCopyShapes, handlePasteShapes]);

  const leftPanelProps = {
    shapes,
    selectedIds,
    style,
    globalRadius,
    smoothing,
    snapToGrid,
    showGrid,
    gridSize,
    presets: PRESETS,
    onAddShape: handleAddShape,
    onDeleteShapes: handleDeleteShapes,
    onDuplicateShapes: handleDuplicateShapes,
    onStyleChange: setStyle,
    onGlobalRadiusChange: setGlobalRadius,
    onSmoothingChange: setSmoothing,
    onShapeUpdate: handleShapeUpdate,
    onAlignShapes: handleAlignShapes,
    onDistributeShapes: handleDistributeShapes,
    onApplyPreset: handleApplyPreset,
    onToggleSnap: setSnapToGrid,
    onToggleGrid: setShowGrid,
    onGridSizeChange: setGridSize,
    toolSelector
  };

  const exportPanelProps = {
    shapes,
    bridges,
    cornerRadii,
    style,
    globalRadius,
    smoothing
  };

  return (
    <div
      className={`h-full w-full relative overflow-hidden flex flex-col ${isMobile ? 'gap-0' : 'gap-4'} lg:flex-row`}
    >
      {/* Desktop left sidebar — Shape Magic / presets / tools / style + shortcuts pinned at bottom */}
      <div className="w-70 shrink-0 h-full overflow-hidden hidden lg:flex flex-col">
        <LeftPanel {...leftPanelProps} />
      </div>

      {/* Canvas area */}
      <div
        className={`bg-(--bg-body) mx-auto  ${isMobile ? 'rounded-xl min-h-100' : 'rounded-2xl min-h-auto'} w-full min-h-[] max-w-480 flex-1 relative overflow-hidden border border-(--canvas-border)!`}
      >
        <Canvas
          ref={canvasRef}
          shapes={shapes}
          bridges={bridges}
          cornerRadii={cornerRadii}
          globalRadius={globalRadius}
          smoothing={smoothing}
          style={style}
          selectedIds={selectedIds}
          onShapeUpdate={handleShapeUpdate}
          onSelectionChange={setSelectedIds}
          onDragEnd={handleDragEnd}
          onAltDragDuplicate={handleAltDragDuplicate}
          snapToGrid={snapToGrid}
          gridSize={gridSize}
          showGrid={showGrid}
          showBridgeDebug={showBridgeDebug}
          onShowBridgeDebugChange={setShowBridgeDebug}
        />

        {/* Floating triggers inside canvas, stacked in one flex-col so they never overlap.
            Controls hides at lg (sidebar takes over). Export hides at xl (sidebar takes
            over later), so between lg and xl only Export remains in this stack. */}
        <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2.5">
          <button
            className="lg:hidden bg-(--bg-button) flex items-center gap-2 px-4 py-2 rounded-md border border-(--border-button) cursor-pointer transition-transform duration-100 active:scale-95"
            onClick={() => setMobileControlsOpen(true)}
          >
            <RiSettings3Line size={16} className='text-(--text-primary)' />
            <span className="text-[13px] font-medium text-(--text-primary)">Controls</span>
          </button>

          <button
            className="xl:hidden bg-(--brand) flex items-center gap-2 px-4 py-2 rounded-md border border-(--border-button) cursor-pointer transition-transform duration-100 active:scale-95"
            onClick={() => setMobileExportOpen(true)}
          >
            <RiDownloadLine size={16} color='#ffffff' />
            <span className="text-[13px] font-semibold text-white">
              Export
            </span>
          </button>
        </div>
      </div>

      {/* Desktop right sidebar — Export */}
      <div className=" w-70 shrink-0 h-full overflow-hidden hidden xl:flex flex-col gap-3">
        <Ads/>
        <ExportPanel {...exportPanelProps} />
      </div>

      {/* Mobile/tablet sheets — Controls sheet active below lg, Export sheet active below xl */}
      <MobileSheet open={mobileControlsOpen} title="Controls" onClose={() => setMobileControlsOpen(false)}>
        <LeftPanel {...leftPanelProps} />
      </MobileSheet>
      <MobileSheet open={mobileExportOpen} title="Export" onClose={() => setMobileExportOpen(false)}>
        <ExportPanel {...exportPanelProps} />
      </MobileSheet>
    </div>
  );
}
