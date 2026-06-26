import { RiAddLine, RiDeleteBinLine, RiFileCopyLine, RiMergeCellsHorizontal, RiDownloadLine, RiCodeLine, RiFileCodeLine, RiImageLine, RiArrowUpSLine, RiPaletteLine, RiPenNibLine, RiSunLine, RiShapesLine, RiEqualizerLine, RiRefreshLine, RiKeyboardLine, RiSparklingLine } from 'react-icons/ri';
import { LuAlignHorizontalJustifyStart, LuAlignHorizontalJustifyCenter, LuAlignHorizontalJustifyEnd, LuAlignVerticalJustifyStart, LuAlignVerticalJustifyCenter, LuAlignVerticalJustifyEnd, LuAlignHorizontalSpaceAround, LuAlignVerticalSpaceAround } from 'react-icons/lu';
import { useState, useCallback } from 'react';
import {
  generateMergedSVG, generateMergedClipPathSVG, generateReactComponent,
  generateCSSClipPath, getRoundedRectPath, getBridgePathAt
} from './svgRenderers';
import { computeBridges, computeCornerRadii } from './computeBridges';
import { DEFAULT_STYLE } from './types';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';
import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';

const ColorInput = ({ label, value, onChange }) => (
  <PreviewColorPicker title={label} color={value} onChange={onChange} />
);

const NumberInput = ({ label, value, onChange, min, max, step = 1 }) => (
  <div className="flex items-center gap-2 flex-1 min-w-0">
    <span className="text-[12px] min-w-6 shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
    <input
      type="number"
      value={Math.round(value)}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      min={min} max={max} step={step}
      className="flex-1 min-w-0 h-8 px-2 text-[12px] rounded-md border outline-none focus:border-(--color-primary) transition-colors"
      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
    />
  </div>
);

const ToggleButton = ({ icon: IconComponent, label, isActive, onClick, disabled, flex }) => (
  <button
    type="button"
    className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] transition-all duration-150 hover:border-(--color-primary)"
    style={{
      flex: flex,
      background: isActive ? 'rgba(168,85,247,0.15)' : 'var(--bg-elevated)',
      borderColor: isActive ? 'var(--color-primary)' : 'var(--border-primary)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      color: isActive ? 'var(--color-primary)' : 'var(--text-muted)'
    }}
    onClick={disabled ? undefined : onClick}
  >
    <IconComponent size={14} />
    {label && <span>{label}</span>}
  </button>
);

const CollapsibleSection = ({ title, icon: IconComponent, action, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between" style={{ marginBottom: open ? '12px' : 0 }}>
        <button
          type="button"
          className="flex items-center gap-1.5 flex-1 cursor-pointer"
          onClick={() => setOpen(o => !o)}
        >
          {IconComponent && <IconComponent size={12} style={{ color: 'var(--text-muted)' }} />}
          <span className="text-[11px] font-semibold uppercase tracking-[0.5px]" style={{ color: 'var(--text-muted)' }}>
            {title}
          </span>
          <RiArrowUpSLine
            size={12}
            style={{
              color: 'var(--text-muted)',
              transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s ease',
              marginLeft: 4
            }}
          />
        </button>
        {action}
      </div>
      <div style={{ display: open ? 'block' : 'none' }}>{children}</div>
    </div>
  );
};

const PresetTile = ({ preset, onClick }) => {
  const shapes = preset.build();
  const bridges = computeBridges(shapes, preset.radius, 1);
  const corners = computeCornerRadii(shapes, preset.radius, 1);

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  shapes.forEach(s => {
    minX = Math.min(minX, s.x); minY = Math.min(minY, s.y);
    maxX = Math.max(maxX, s.x + s.w); maxY = Math.max(maxY, s.y + s.h);
  });
  const pad = 12;
  const vbW = maxX - minX + pad * 2;
  const vbH = maxY - minY + pad * 2;

  return (
    <button
      type="button"
      className="flex flex-col items-center justify-center gap-1 p-2 rounded-sm border transition-all duration-150 cursor-pointer hover:border-(--color-primary)"
      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
      onClick={onClick}
      title={preset.name}
    >
      <div className="w-full h-10.5">
        <svg width="100%" height="100%" viewBox={`${minX - pad} ${minY - pad} ${vbW} ${vbH}`} preserveAspectRatio="xMidYMid meet">
          <g fill="var(--text-muted)">
            {shapes.map(s => (
              <path key={s.id} d={getRoundedRectPath(s.x, s.y, s.w, s.h, corners[s.id] || { tl: preset.radius, tr: preset.radius, br: preset.radius, bl: preset.radius })} />
            ))}
            {bridges.map(b => (
              <path key={b.id} d={getBridgePathAt(b.x, b.y, b.r, b.rotation, 0.6)} />
            ))}
          </g>
        </svg>
      </div>
      <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{preset.name}</span>
    </button>
  );
};

const StyledKbd = ({ children }) => (
  <kbd
    className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border"
    style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', color: 'var(--color-accent)' }}
  >
    {children}
  </kbd>
);

const ExportButton = ({ icon: IconComponent, label, active, onClick, flex, primary }) => (
  <button
    type="button"
    className="flex items-center justify-center gap-2 rounded-sm border transition-all duration-150 cursor-pointer"
    style={{
      flex,
      background: primary ? 'var(--color-primary)' : active ? 'rgba(168,85,247,0.15)' : 'var(--bg-elevated)',
      border: primary ? 'none' : active ? '1px solid var(--color-primary)' : '1px solid var(--border-primary)',
      padding: primary ? '10px 0' : '8px 0',
      color: primary ? 'var(--text-primary)' : 'var(--text-muted)'
    }}
    onClick={onClick}
  >
    <IconComponent size={16} />
    <span className="text-[12px]" style={{ fontWeight: primary ? 600 : 500 }}>{label}</span>
  </button>
);

export default function Controls({
  shapes, bridges, cornerRadii, selectedIds, style, globalRadius, smoothing = 0.6,
  snapToGrid, showGrid, gridSize, presets = [],
  onAddShape, onDeleteShapes, onDuplicateShapes, onStyleChange, onGlobalRadiusChange,
  onSmoothingChange, onShapeUpdate, onAlignShapes, onDistributeShapes,
  onApplyPreset, onToggleSnap, onToggleGrid, onGridSizeChange, toolSelector, disabled = false
}) {
  const [copyStatus, setCopyStatus] = useState(null);
  const [shortcutsHovered, setShortcutsHovered] = useState(false);
  const [pngScale, setPngScale] = useState('2');
  const [exportPad, setExportPad] = useState(16);
  const [includeBg, setIncludeBg] = useState(false);

  const selectedShape = shapes.find(s => s.id === selectedIds[0]);
  const hasMultiSelection = selectedIds.length > 1;
  const hasThreeOrMoreSelected = selectedIds.length >= 3;

  const setStyle = useCallback(patch => onStyleChange({ ...style, ...patch }), [onStyleChange, style]);

  const exportOpts = { padding: exportPad, forceBackground: includeBg };

  const flash = key => { setCopyStatus(key); setTimeout(() => setCopyStatus(null), 2000); };

  const handleCopySVG = useCallback(() => {
    navigator.clipboard.writeText(generateMergedSVG(shapes, bridges, cornerRadii || {}, style, globalRadius, smoothing, exportOpts));
    flash('svg');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes, bridges, cornerRadii, globalRadius, style, smoothing, exportPad, includeBg]);

  const handleCopyReact = useCallback(() => {
    navigator.clipboard.writeText(generateReactComponent(shapes, bridges, cornerRadii || {}, style, globalRadius, smoothing));
    flash('react');
  }, [shapes, bridges, cornerRadii, globalRadius, style, smoothing]);

  const handleCopyMerged = useCallback(() => {
    navigator.clipboard.writeText(generateMergedClipPathSVG(shapes, bridges, cornerRadii || {}, style, globalRadius, smoothing));
    flash('merged');
  }, [shapes, bridges, cornerRadii, globalRadius, style, smoothing]);

  const handleCopyCSS = useCallback(() => {
    navigator.clipboard.writeText(generateCSSClipPath(shapes, bridges, cornerRadii || {}, globalRadius, smoothing));
    flash('css');
  }, [shapes, bridges, cornerRadii, globalRadius, smoothing]);

  const handleDownloadSVG = useCallback(() => {
    const svg = generateMergedSVG(shapes, bridges, cornerRadii || {}, style, globalRadius, smoothing, exportOpts);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'merged-shape.svg'; link.href = url; link.click();
    URL.revokeObjectURL(url);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes, bridges, cornerRadii, globalRadius, style, smoothing, exportPad, includeBg]);

  const downloadRaster = useCallback(format => {
    const isJpg = format === 'jpg';
    const opts = { padding: exportPad, forceBackground: includeBg || isJpg };
    const svg = generateMergedSVG(shapes, bridges, cornerRadii || {}, style, globalRadius, smoothing, opts);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new window.Image();
    img.onload = () => {
      const scale = parseInt(pngScale, 10) || 2;
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale; canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (isJpg) { ctx.fillStyle = style.backgroundColor || '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.scale(scale, scale); ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(outBlob => {
        const outUrl = URL.createObjectURL(outBlob);
        const link = document.createElement('a');
        link.download = `merged-shape.${format}`; link.href = outUrl; link.click();
        URL.revokeObjectURL(outUrl);
      }, isJpg ? 'image/jpeg' : 'image/png', isJpg ? 0.92 : undefined);
    };
    img.src = url;
  }, [shapes, bridges, cornerRadii, globalRadius, style, smoothing, pngScale, exportPad, includeBg]);

  const isGradient = style.fillType === 'linear' || style.fillType === 'radial';

  return (
    <div
      className="flex flex-col h-full overflow-hidden transition-opacity duration-200"
      style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
    >
      {toolSelector && <div className="mb-4 shrink-0">{toolSelector}</div>}

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

        {/* Presets */}
        {presets.length > 0 && (
          <CollapsibleSection title="Presets" icon={RiSparklingLine} defaultOpen>
            <div className="grid grid-cols-4 gap-2">
              {presets.map(p => <PresetTile key={p.id} preset={p} onClick={() => onApplyPreset?.(p.id)} />)}
            </div>
          </CollapsibleSection>
        )}

        {/* Tools */}
        <CollapsibleSection title="Tools" icon={RiShapesLine} defaultOpen>
          <div className="flex gap-2">
            <ToggleButton icon={RiAddLine} label="Add" onClick={onAddShape} flex={1} />
            <ToggleButton icon={RiDeleteBinLine} label="Delete" onClick={onDeleteShapes} flex={1} />
            <ToggleButton icon={RiFileCopyLine} label="Duplicate" onClick={onDuplicateShapes} flex={1} />
          </div>

          {hasMultiSelection && (
            <>
              <p className="text-[11px] mt-3 mb-2" style={{ color: 'var(--text-muted)' }}>Align</p>
              <div className="flex gap-2 flex-wrap">
                <ToggleButton icon={LuAlignHorizontalJustifyStart} onClick={() => onAlignShapes('left')} />
                <ToggleButton icon={LuAlignHorizontalJustifyCenter} onClick={() => onAlignShapes('centerH')} />
                <ToggleButton icon={LuAlignHorizontalJustifyEnd} onClick={() => onAlignShapes('right')} />
                <ToggleButton icon={LuAlignVerticalJustifyStart} onClick={() => onAlignShapes('top')} />
                <ToggleButton icon={LuAlignVerticalJustifyCenter} onClick={() => onAlignShapes('centerV')} />
                <ToggleButton icon={LuAlignVerticalJustifyEnd} onClick={() => onAlignShapes('bottom')} />
              </div>
              {hasThreeOrMoreSelected && (
                <>
                  <p className="text-[11px] mt-3 mb-2" style={{ color: 'var(--text-muted)' }}>Distribute</p>
                  <div className="flex gap-2">
                    <ToggleButton icon={LuAlignHorizontalSpaceAround} label="Horizontal" onClick={() => onDistributeShapes('horizontal')} flex={1} />
                    <ToggleButton icon={LuAlignVerticalSpaceAround} label="Vertical" onClick={() => onDistributeShapes('vertical')} flex={1} />
                  </div>
                </>
              )}
            </>
          )}
        </CollapsibleSection>

        {/* Selected Shape */}
        {selectedShape && !hasMultiSelection && (
          <CollapsibleSection title="Selected Shape" icon={RiEqualizerLine} defaultOpen>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <NumberInput label="X" value={selectedShape.x} onChange={v => onShapeUpdate(selectedShape.id, { x: v })} />
                <NumberInput label="Y" value={selectedShape.y} onChange={v => onShapeUpdate(selectedShape.id, { y: v })} />
              </div>
              <div className="flex gap-2">
                <NumberInput label="W" value={selectedShape.w} onChange={v => onShapeUpdate(selectedShape.id, { w: Math.max(20, v) })} min={20} />
                <NumberInput label="H" value={selectedShape.h} onChange={v => onShapeUpdate(selectedShape.id, { h: Math.max(20, v) })} min={20} />
              </div>
              <PreviewSlider label="Corner Radius" min={0} max={120} step={1}
                value={selectedShape.r !== undefined ? selectedShape.r : globalRadius}
                valueUnit="px" onChange={v => onShapeUpdate(selectedShape.id, { r: v })} />
              {selectedShape.r !== undefined && (
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 py-1.5 rounded-sm border transition-all duration-150 cursor-pointer hover:border-(--color-primary)"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
                  onClick={() => onShapeUpdate(selectedShape.id, { r: undefined })}
                >
                  <RiRefreshLine size={12} style={{ color: 'var(--text-muted)' }} />
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Use global radius</span>
                </button>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* Fill */}
        <CollapsibleSection
          title="Fill"
          icon={RiPaletteLine}
          action={
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 rounded-md border cursor-pointer hover:border-(--color-primary) transition-colors"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
              onClick={() => onStyleChange({ ...DEFAULT_STYLE })}
              title="Reset all styles"
            >
              <RiRefreshLine size={12} style={{ color: 'var(--text-muted)' }} />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Reset</span>
            </button>
          }
        >
          <div className="flex flex-col gap-2">
            <PreviewSelect label="Type" value={style.fillType || 'solid'}
              options={[{ value: 'solid', label: 'Solid' }, { value: 'linear', label: 'Linear Gradient' }, { value: 'radial', label: 'Radial Gradient' }]}
              onChange={v => setStyle({ fillType: v })} />
            <ColorInput label={isGradient ? 'Color 1' : 'Color'} value={style.fill} onChange={v => setStyle({ fill: v })} />
            {isGradient && <ColorInput label="Color 2" value={style.fillColor2} onChange={v => setStyle({ fillColor2: v })} />}
            {style.fillType === 'linear' && (
              <PreviewSlider label="Angle" min={0} max={360} step={1} value={style.gradientAngle} valueUnit="°" onChange={v => setStyle({ gradientAngle: v })} />
            )}
            <PreviewSlider label="Opacity" min={0} max={1} step={0.01} value={style.opacity ?? 1} displayValue={v => `${Math.round(v * 100)}%`} onChange={v => setStyle({ opacity: v })} />
          </div>
        </CollapsibleSection>

        {/* Stroke */}
        <CollapsibleSection title="Stroke" icon={RiPenNibLine} defaultOpen={false}>
          <div className="flex flex-col gap-2">
            <PreviewSwitch label="Enable outline" value={!!style.strokeEnabled} onChange={v => setStyle({ strokeEnabled: v })} />
            <ColorInput label="Color" value={style.strokeColor} onChange={v => setStyle({ strokeColor: v })} />
            <PreviewSlider label="Width" min={1} max={40} step={1} value={style.strokeWidth} valueUnit="px" isDisabled={!style.strokeEnabled} onChange={v => setStyle({ strokeWidth: v })} />
          </div>
        </CollapsibleSection>

        {/* Shadow */}
        <CollapsibleSection title="Shadow" icon={RiSunLine} defaultOpen={false}>
          <div className="flex flex-col gap-2">
            <PreviewSwitch label="Enable shadow" value={!!style.shadowEnabled} onChange={v => setStyle({ shadowEnabled: v })} />
            <ColorInput label="Color" value={style.shadowColor} onChange={v => setStyle({ shadowColor: v })} />
            <PreviewSlider label="Blur" min={0} max={80} step={1} value={style.shadowBlur} valueUnit="px" isDisabled={!style.shadowEnabled} onChange={v => setStyle({ shadowBlur: v })} />
            <PreviewSlider label="Offset X" min={-60} max={60} step={1} value={style.shadowOffsetX} valueUnit="px" isDisabled={!style.shadowEnabled} onChange={v => setStyle({ shadowOffsetX: v })} />
            <PreviewSlider label="Offset Y" min={-60} max={60} step={1} value={style.shadowOffsetY} valueUnit="px" isDisabled={!style.shadowEnabled} onChange={v => setStyle({ shadowOffsetY: v })} />
            <PreviewSlider label="Strength" min={0} max={1} step={0.01} value={style.shadowOpacity} displayValue={v => `${Math.round(v * 100)}%`} isDisabled={!style.shadowEnabled} onChange={v => setStyle({ shadowOpacity: v })} />
          </div>
        </CollapsibleSection>

        {/* Shape */}
        <CollapsibleSection title="Shape" icon={RiShapesLine} defaultOpen={false}>
          <div className="flex flex-col gap-2">
            <PreviewSlider label="Global Radius" min={0} max={120} step={1} value={globalRadius} valueUnit="px" onChange={onGlobalRadiusChange} />
            <PreviewSlider label="Bridge Smoothness" min={0} max={1} step={0.01} value={smoothing} displayValue={v => `${Math.round(v * 100)}%`} onChange={onSmoothingChange} />
          </div>
        </CollapsibleSection>

        {/* Canvas */}
        <CollapsibleSection title="Canvas" icon={RiEqualizerLine} defaultOpen={false}>
          <div className="flex flex-col gap-2">
            <PreviewSwitch label="Background" value={!!style.backgroundEnabled} onChange={v => setStyle({ backgroundEnabled: v })} />
            {style.backgroundEnabled && <ColorInput label="Color" value={style.backgroundColor} onChange={v => setStyle({ backgroundColor: v })} />}
            <PreviewSwitch label="Show grid" value={!!showGrid} onChange={v => onToggleGrid?.(v)} />
            <PreviewSwitch label="Snap to grid" value={!!snapToGrid} onChange={v => onToggleSnap?.(v)} />
            <PreviewSlider label="Grid Size" min={5} max={50} step={5} value={gridSize} valueUnit="px" isDisabled={!snapToGrid && !showGrid} onChange={v => onGridSizeChange?.(v)} />
          </div>
        </CollapsibleSection>
      </div>

      {/* Shortcuts */}
      <div
        className="rounded-sm border mb-4 shrink-0 overflow-hidden transition-all duration-200"
        style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
        onMouseEnter={() => setShortcutsHovered(true)}
        onMouseLeave={() => setShortcutsHovered(false)}
      >
        <div className="flex items-center justify-between gap-1.5 p-3 cursor-pointer">
          <div className="flex items-center gap-1.5">
            <RiKeyboardLine size={12} style={{ color: 'var(--text-muted)' }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.5px]" style={{ color: 'var(--text-muted)' }}>Shortcuts</span>
          </div>
          <RiArrowUpSLine
            size={12}
            style={{ color: 'var(--text-muted)', transform: shortcutsHovered ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s ease' }}
          />
        </div>
        <div
          className="overflow-hidden transition-all duration-200 px-3"
          style={{ maxHeight: shortcutsHovered ? '240px' : '0px', opacity: shortcutsHovered ? 1 : 0, paddingBottom: shortcutsHovered ? '12px' : 0 }}
        >
          <div className="flex flex-col gap-1.5">
            {[
              ['Undo', ['⌘', 'Z']],
              ['Redo', ['⌘', '⇧', 'Z']],
              ['Duplicate', ['⌘', 'D']],
              ['Copy / Paste', ['⌘', 'C/V']],
              ['Delete', ['⌫']],
              ['Pan', ['Space+Drag']],
              ['Duplicate-drag', ['Alt+Drag']]
            ].map(([label, keys]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
                <div className="flex gap-1">
                  {keys.map((k, i) => <StyledKbd key={i}>{k}</StyledKbd>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="pt-4 shrink-0" style={{ borderTop: '1px solid var(--border-primary)' }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.5px] mb-3" style={{ color: 'var(--text-muted)' }}>Export</p>

        <div className="flex flex-col gap-2 mb-3">
          <PreviewSwitch label="Bake background" value={includeBg} onChange={setIncludeBg} />
          <PreviewSlider label="Padding" min={0} max={120} step={2} value={exportPad} valueUnit="px" onChange={setExportPad} />
          <PreviewSelect label="Raster scale" value={pngScale}
            options={[{ value: '1', label: '1x' }, { value: '2', label: '2x' }, { value: '3', label: '3x' }, { value: '4', label: '4x' }]}
            onChange={setPngScale} />
        </div>

        <div className="flex flex-col gap-2">
          <ExportButton icon={RiMergeCellsHorizontal} label={copyStatus === 'merged' ? 'Copied!' : 'Merge & Copy (Mask-Ready)'} active={copyStatus === 'merged'} onClick={handleCopyMerged} />
          <div className="flex gap-2">
            <ExportButton icon={RiCodeLine} label={copyStatus === 'svg' ? 'Copied!' : 'Copy SVG'} active={copyStatus === 'svg'} onClick={handleCopySVG} flex={1} />
            <ExportButton icon={RiCodeLine} label={copyStatus === 'react' ? 'Copied!' : 'Copy React'} active={copyStatus === 'react'} onClick={handleCopyReact} flex={1} />
          </div>
          <ExportButton icon={RiFileCodeLine} label={copyStatus === 'css' ? 'Copied!' : 'Copy CSS clip-path'} active={copyStatus === 'css'} onClick={handleCopyCSS} />
          <div className="flex gap-2">
            <ExportButton icon={RiDownloadLine} label="SVG" onClick={handleDownloadSVG} flex={1} primary />
            <ExportButton icon={RiImageLine} label="PNG" onClick={() => downloadRaster('png')} flex={1} primary />
            <ExportButton icon={RiImageLine} label="JPG" onClick={() => downloadRaster('jpg')} flex={1} primary />
          </div>
        </div>
      </div>
    </div>
  );
}
