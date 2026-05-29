import OrbitDragNumber from './OrbitDragNumber';
import { ORBIT_PALETTES } from '../constants/orbitConfig';

export default function OrbitCodeMockup({ params, colorIdx, onParamChange, onColorChange }) {
  const color = ORBIT_PALETTES[colorIdx].hex;

  return (
    <div
      className="mt-8 w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-(--border-primary) "
      style={{
        animation: 'fadeUp 0.9s 0.5s ease both',
        opacity: 0
      }}
    >
      {/* Topbar */}
      <div className="bg-(--bg-card) border-b border-(--border-primary) px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div className="flex-1  rounded px-3 py-0.5 text-xs text-(--text-primary) geist-mono">
          react-bytes.dev/orbit
        </div>
        <span className="text-xs text-(--text-muted) geist-mono">↕ drag values</span>
      </div>

      {/* Editor body */}
      <div className="bg-(--bg-elevated) px-5 py-4 font-mono text-sm leading-7 text-left overflow-auto">
        <div className="text-slate-600 mb-2 text-xs">// IntegrationOrbit.jsx — live controls</div>

        <div className="mb-1">
          <span className="text-slate-500">import </span>
          <span className="text-sky-400">IntegrationOrbit </span>
          <span className="text-slate-500">from </span>
          <span className="text-violet-400">'@components/IntegrationOrbit'</span>
        </div>

        <div className="mt-1 mb-2">
          <span className="text-violet-400">&lt;IntegrationOrbit</span>
        </div>

        {/* globeColor — three drag numbers in an array */}
        <div className="pl-5">
          <span className="text-violet-400">globeColor</span>
          <span className="text-slate-500">{'={ ['}</span>
          <OrbitDragNumber
            value={params.globeHue}
            min={0}
            max={360}
            step={1}
            onChange={v => onParamChange('globeHue', v)}
          />
          <span className="text-slate-500">{', '}</span>
          <OrbitDragNumber
            value={params.globeSat}
            min={0}
            max={100}
            step={1}
            onChange={v => onParamChange('globeSat', v)}
          />
          <span className="text-slate-500">{', '}</span>
          <OrbitDragNumber
            value={params.globeLit}
            min={20}
            max={85}
            step={1}
            onChange={v => onParamChange('globeLit', v)}
          />
          <span className="text-slate-500">{'] }'}</span>
        </div>

        {/* particleCount */}
        <div className="pl-5">
          <span className="text-violet-400">particleCount</span>
          <span className="text-slate-500">{'={ '}</span>
          <OrbitDragNumber
            value={params.particleCount}
            min={200}
            max={3000}
            step={100}
            onChange={v => onParamChange('particleCount', v)}
          />
          <span className="text-slate-500">{' }'}</span>
        </div>

        {/* speedMultiplier */}
        <div className="pl-5">
          <span className="text-violet-400">speedMultiplier</span>
          <span className="text-slate-500">{'={ '}</span>
          <OrbitDragNumber
            value={params.speed}
            min={0.1}
            max={3}
            step={0.1}
            onChange={v => onParamChange('speed', v)}
          />
          <span className="text-slate-500"> </span>
        </div>

        {/* color static */}
        <div className="pl-5">
          <span className="text-violet-400">accentColor</span>
          <span className="text-slate-500">{'={ '}</span>
          <span className="text-violet-400">"{color}"</span>
          <span className="text-slate-500">{' }'}</span>
        </div>

        <div className="text-slate-500 mt-1">/&gt;</div>

        {/* Palette row */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
          <span className="text-slate-700 text-[10px] mr-1 tracking-widest">accent</span>
          {ORBIT_PALETTES.map((pal, i) => (
            <button
              key={pal.hex}
              onClick={() => onColorChange(i)}
              className="w-4 h-4 rounded-full transition-all duration-150 hover:scale-125"
              style={{
                background: pal.hex,
                border: colorIdx === i ? '2px solid #fff' : '2px solid transparent'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
