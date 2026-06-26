import { RiArrowUpSLine } from 'react-icons/ri';
import { useState } from 'react';
import { computeBridges, computeCornerRadii } from '../Computebridges';
import { getRoundedRectPath, getBridgePathAt } from '../Svgrenderers';
import PreviewColorPicker from '../../../components/shared/preview/PreviewColorPicker';

export const ColorInput = ({ label, value, onChange }) => (
  <PreviewColorPicker title={label} color={value} onChange={onChange} />
);

export const NumberInput = ({ label, value, onChange, min, max, step = 1 }) => (
  <div className="flex items-center gap-2 flex-1 min-w-0">
    <span className="text-[12px] min-w-6 shrink-0 text-(--text-muted)">
      {label}
    </span>
    <input
      type="number"
      value={Math.round(value)}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      min={min}
      max={max}
      step={step}
      className="flex-1 min-w-0 h-8 px-2 text-[12px] rounded-md border focus:ring-0 outline-none focus:border-(--brand) transition-colors bg-(--bg-button) border-(--border-button) text-(--text-primary)"
    />
  </div>
);

export const ToggleButton = ({ icon: IconComponent, label, isActive, onClick, disabled, flex }) => (
  <button
    type="button"
    className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] transition-all duration-150 hover:border-(--brand) ${
      flex ? 'flex-1' : ''
    } ${
      isActive ? 'bg-[rgba(168,85,247,0.15)] border-(--color-primary) text-(--color-primary)' : 'bg-(--bg-button) border-(--border-button) text-(--text-primary)'
    } ${
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'
    }`}
    onClick={disabled ? undefined : onClick}
  >
    <IconComponent size={14} />
    {label && <span>{label}</span>}
  </button>
);

export const CollapsibleSection = ({ title, icon: IconComponent, action, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <div className={`flex items-center justify-between ${open ? 'mb-3' : 'mb-0'}`}>
        <button
          type="button"
          className="flex items-center gap-1.5 flex-1 cursor-pointer"
          onClick={() => setOpen(o => !o)}
        >
          {IconComponent && <IconComponent size={12} className="text-(--brand)" />}
          <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-(--brand)">
            {title}
          </span>
          <RiArrowUpSLine
            size={14}
            className={`text-(--text-muted) transition-transform duration-200 ml-1 ${
              open ? 'rotate-0' : 'rotate-180'
            }`}
          />
        </button>
        {action}
      </div>
      <div className={open ? 'block' : 'hidden'}>{children}</div>
    </div>
  );
};

export const PresetTile = ({ preset, onClick }) => {
  const shapes = preset.build();
  const bridges = computeBridges(shapes, preset.radius, 1);
  const corners = computeCornerRadii(shapes, preset.radius, 1);

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  shapes.forEach(s => {
    minX = Math.min(minX, s.x);
    minY = Math.min(minY, s.y);
    maxX = Math.max(maxX, s.x + s.w);
    maxY = Math.max(maxY, s.y + s.h);
  });
  const pad = 12;
  const vbW = maxX - minX + pad * 2;
  const vbH = maxY - minY + pad * 2;

  return (
    <button
      type="button"
      className="flex flex-col items-center justify-center gap-1 p-2 rounded-sm border border-(--border-secondary) transition-all duration-150 cursor-pointer hover:border-(--brand) bg-(--bg-elevated) "
      onClick={onClick}
      title={preset.name}
    >
      <div className="w-full h-10.5">
        <svg
          width="100%"
          height="100%"
          viewBox={`${minX - pad} ${minY - pad} ${vbW} ${vbH}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <g fill="var(--persets-text)">
            {shapes.map(s => (
              <path
                key={s.id}
                d={getRoundedRectPath(
                  s.x,
                  s.y,
                  s.w,
                  s.h,
                  corners[s.id] || { tl: preset.radius, tr: preset.radius, br: preset.radius, bl: preset.radius }
                )}
              />
            ))}
            {bridges.map(b => (
              <path key={b.id} d={getBridgePathAt(b.x, b.y, b.r, b.rotation, 0.6)} />
            ))}
          </g>
        </svg>
      </div>
      <span className="text-[10px] font-medium text-(--text-muted)">
        {preset.name}
      </span>
    </button>
  );
};

export const StyledKbd = ({ children }) => (
  <kbd
    className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px]  border bg-(--bg-card) border-(--border-secondary) text-(--text-primary) "
  >
    {children}
  </kbd>
);

export const ExportButton = ({ icon: IconComponent, label, active, onClick, flex, primary }) => (
  <button
    type="button"
    className={`flex items-center justify-center gap-2 rounded-sm transition-all duration-150 cursor-pointer  ${
      flex ? 'flex-1' : ''
    } ${
      primary
        ? 'bg-(--brand-2) border-none py-2.5 text-white'
        : active
        ? 'bg-(--brand) py-2 text-white'
        : 'bg-(--bg-button) border border-(--border-button) py-2 text-(--text-primary) hover:border-(--brand)/40 hover:scale-95'
    }`}
    onClick={onClick}
  >
    <IconComponent size={16} />
    <span className={`text-[12px] ${primary ? 'font-semibold' : 'font-medium'}`}>
      {label}
    </span>
  </button>
);
