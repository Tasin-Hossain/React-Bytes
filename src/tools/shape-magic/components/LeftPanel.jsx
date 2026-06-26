import { RiAddLine, RiDeleteBinLine, RiFileCopyLine, RiArrowUpSLine, RiPaletteLine, RiPenNibLine, RiSunLine, RiShapesLine, RiEqualizerLine, RiRefreshLine, RiKeyboardLine, RiSparklingLine } from 'react-icons/ri';
import { LuAlignVerticalJustifyStart, LuAlignVerticalJustifyCenter, LuAlignVerticalJustifyEnd, LuAlignHorizontalSpaceAround, LuAlignVerticalSpaceAround, LuAlignLeft, LuAlignCenter, LuAlignRight } from 'react-icons/lu';
import { useState, useCallback } from 'react';
import { DEFAULT_STYLE } from '../Types';
import PreviewSlider from '../../../components/shared/preview/PreviewSlider';
import PreviewSelect from '../../../components/shared/preview/PreviewSelect';
import PreviewSwitch from '../../../components/shared/preview/PreviewSwitch';
import { ColorInput, NumberInput, ToggleButton, CollapsibleSection, PresetTile, StyledKbd } from './ControlsShared';

const SHORTCUTS = [
  ['Undo', ['⌘', 'Z']],
  ['Redo', ['⌘', '⇧', 'Z']],
  ['Duplicate', ['⌘', 'D']],
  ['Copy / Paste', ['⌘', 'C/V']],
  ['Delete', ['⌫']],
  ['Pan', ['Space+Drag']],
  ['Duplicate-drag', ['Alt+Drag']]
];

export default function LeftPanel({
  shapes, selectedIds, style, globalRadius, smoothing = 0.6,
  snapToGrid, showGrid, gridSize, presets = [],
  onAddShape, onDeleteShapes, onDuplicateShapes, onStyleChange, onGlobalRadiusChange,
  onSmoothingChange, onShapeUpdate, onAlignShapes, onDistributeShapes,
  onApplyPreset, onToggleSnap, onToggleGrid, onGridSizeChange, toolSelector, disabled = false
}) {
  const [shortcutsHovered, setShortcutsHovered] = useState(false);

  const selectedShape = shapes.find(s => s.id === selectedIds[0]);
  const hasMultiSelection = selectedIds.length > 1;
  const hasThreeOrMoreSelected = selectedIds.length >= 3;

  const setStyle = useCallback(patch => onStyleChange({ ...style, ...patch }), [onStyleChange, style]);

  const isGradient = style.fillType === 'linear' || style.fillType === 'radial';

  return (
    <div
      className={`flex bg flex-col h-full overflow-hidden transition-opacity duration-200 ${
        disabled ? 'opacity-50 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {toolSelector && <div className="mb-4 shrink-0">{toolSelector}</div>}

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none [-webkit-overflow-scrolling:touch]">

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
              <p className=" mt-3 mb-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-(--brand)">Align</p>
              <div className="flex gap-2 flex-wrap">
                <ToggleButton icon={LuAlignLeft} onClick={() => onAlignShapes('left')} />
                <ToggleButton icon={LuAlignCenter } onClick={() => onAlignShapes('centerH')} />
                <ToggleButton icon={LuAlignRight} onClick={() => onAlignShapes('right')} />
                <ToggleButton icon={LuAlignVerticalJustifyStart} onClick={() => onAlignShapes('top')} />
                <ToggleButton icon={LuAlignVerticalJustifyCenter} onClick={() => onAlignShapes('centerV')} />
                <ToggleButton icon={LuAlignVerticalJustifyEnd} onClick={() => onAlignShapes('bottom')} />
              </div>
              {hasThreeOrMoreSelected && (
                <>
                  <p className="mt-3 mb-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-(--brand)">Distribute</p>
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
              <div className="flex gap-4">
                <NumberInput label="X" value={selectedShape.x} onChange={v => onShapeUpdate(selectedShape.id, { x: v })} />
                <NumberInput label="Y" value={selectedShape.y} onChange={v => onShapeUpdate(selectedShape.id, { y: v })} />
              </div>
              <div className="flex gap-4">
                <NumberInput label="W" value={selectedShape.w} onChange={v => onShapeUpdate(selectedShape.id, { w: Math.max(20, v) })} min={20} />
                <NumberInput label="H" value={selectedShape.h} onChange={v => onShapeUpdate(selectedShape.id, { h: Math.max(20, v) })} min={20} />
              </div>
              <div className='mt-1'>
                <PreviewSlider label="Corner Radius" min={0} max={120} step={1} value={selectedShape.r !== undefined ? selectedShape.r : globalRadius} valueUnit="px" onChange={v => onShapeUpdate(selectedShape.id, { r: v })} />
              </div>
              {selectedShape.r !== undefined && (
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 py-1.5 rounded-sm border transition-all duration-150 cursor-pointer hover:border-(--brand) bg-(--bg-button) border-(--border-button)"
                  onClick={() => onShapeUpdate(selectedShape.id, { r: undefined })}
                >
                  <RiRefreshLine size={14} className="text-(--text-primary)" />
                  <span className="text-[12px] text-(--text-primary)">Use global radius</span>
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
              className="flex items-center gap-1  px-3 py-1.5 rounded-md border cursor-pointer hover:border-(--brand)/40 transition-colors bg-(--brand) border-(--border-button)"
              onClick={() => onStyleChange({ ...DEFAULT_STYLE })}
              title="Reset all styles"
            >
              <RiRefreshLine size={12} className="text-white" />
              <span className="text-[10px] text-white">Reset</span>
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

      {/* Shortcuts - pinned to bottom, expands on hover */}
      <div
        className="rounded-sm border shrink-0 overflow-hidden transition-all duration-200 bg-(--bg-button) border-(--border-button)"
        onMouseEnter={() => setShortcutsHovered(true)}
        onMouseLeave={() => setShortcutsHovered(false)}
      >
        <div className="flex items-center justify-between gap-1.5 p-3 cursor-pointer">
          <div className="flex items-center gap-1.5">
            <RiKeyboardLine size={14} className="text-(--text-primary)" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-(--text-primary)">Shortcuts</span>
          </div>
          <RiArrowUpSLine
            size={12}
            className={`text-(--text-primary) transition-transform duration-200 ${
              shortcutsHovered ? 'rotate-0' : 'rotate-180'
            }`}
          />
        </div>
        <div
          className={`overflow-hidden transition-all duration-200 px-3 ${
            shortcutsHovered ? 'max-h-60 opacity-100 pb-3' : 'max-h-0 opacity-0 pb-0'
          }`}
        >
          <div className="flex flex-col gap-1.5">
            {SHORTCUTS.map(([label, keys]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-[12px] text-(--text-muted)">{label}</span>
                <div className="flex gap-1">
                  {keys.map((k, i) => <StyledKbd key={i}>{k}</StyledKbd>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
