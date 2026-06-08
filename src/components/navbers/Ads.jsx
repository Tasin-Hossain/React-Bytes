import { useNavigate } from 'react-router';
import Button from "../ui/Button/Button";


const Ads = () => {
  const navigate = useNavigate();
  return (
    <aside className="hidden xl:flex flex-col gap-4 w-(--right-panel-width) shrink-0">
      <div className="sticky top-20.25 flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-(--text-muted)">
          Sponsored
        </p>

        {/* React Bits Pro Card */}
        <div
          className="relative overflow-hidden rounded-lg border border-purple-500/25 p-5 flex flex-col gap-3"
          style={{ background: "var(--bg-card-gradient)" }}
        >

          {/* Glow effect */}
          <div className="pointer-events-none absolute -top-10 -right-10 size-30 rounded-full bg-(--brand) blur-3xl" />

          {/* PRO Badge */}
          <div className="inline-flex">
            <span className="rounded-md border border-(--bg-white)/10 bg-(--brand) px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
              Free
            </span>
          </div>

          {/* Title */}
          <p className="text-[15px] font-bold leading-snug text-purple-50 m-0">
            React Bytes
          </p>

          {/* Description */}
          <p className="text-[13px] leading-relaxed text-purple-200/75 m-0">
            Handcrafted, accessible React primitives. No bloat, no lock-in. Just copy and use.
          </p>

          {/* CTA Button */}
         <Button text="Browse Components" onClick={() => navigate('/text-animations/magnetic-text')} />
        </div>

      </div>
    </aside>
  );
};

export default Ads;
