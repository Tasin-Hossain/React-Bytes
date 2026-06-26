const Pulse = ({ className = '', style = {} }) => (
  <div
    className={`animate-pulse rounded bg-(--bg-button) ${className}`}
    style={style}
  />
);

const SectionLabel = ({ children }) => (
  <span
    style={{
      fontSize: '9px',
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--text-dimmed)',
    }}
  >
    {children}
  </span>
);

const FakeSlider = ({ label, width = '100%' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</span>
      <Pulse style={{ width: '28px', height: '14px', borderRadius: '4px' }} />
    </div>
    <div
      style={{
        position: 'relative',
        height: '3px',
        borderRadius: '99px',
        background: 'var(--bg-button)',
        width,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${Math.floor(Math.random() * 40) + 30}%`,
          borderRadius: '99px',
          background:
            'linear-gradient(90deg, var(--brand-2), var(--brand))',
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${Math.floor(Math.random() * 40) + 30}%`,
          transform: 'translate(-50%, -50%)',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: 'var(--brand)',
          opacity: 0.4,
        }}
      />
    </div>
  </div>
);

const FakeToggle = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</span>
    <div
      style={{
        width: '28px',
        height: '15px',
        borderRadius: '99px',
        background: 'var(--bg-button)',
        border: '1px solid var(--border-button)',
        opacity: 0.5,
      }}
    />
  </div>
);

const ComingSoon = ({ label, toolSelector }) => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        borderRadius: '12px',
        border: '1px solid var(--border-secondary)',
      }}
    >
      {/* ── Left Controls Panel ── */}
      <div
        className="hidden lg:flex"
        style={{
          width: '220px',
          flexShrink: 0,
          flexDirection: 'column',
          borderRight: '1px solid var(--border-secondary)',
          background: 'var(--bg-card)',
        }}
      >
        {toolSelector && (
          <div
            style={{
              padding: '10px',
              borderBottom: '1px solid var(--border-secondary)',
            }}
          >
            {toolSelector}
          </div>
        )}

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Shape section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <SectionLabel>Shape</SectionLabel>
            <FakeSlider label="Complexity" />
            <FakeSlider label="Smoothness" />
            <FakeSlider label="Size" />
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border-secondary)' }} />

          {/* Fill section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <SectionLabel>Fill</SectionLabel>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['#d35af8', '#7a5af8', '#5af8c8', '#f8a15a', '#5a9ef8'].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: c,
                    opacity: 0.35,
                  }}
                />
              ))}
            </div>
            <FakeSlider label="Opacity" />
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border-secondary)' }} />

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <SectionLabel>Options</SectionLabel>
            <FakeToggle label="Shadow" />
            <FakeToggle label="Outline" />
            <FakeToggle label="Animate" />
          </div>
        </div>
      </div>

      {/* ── Canvas Area ── */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'var(--bg)',
          backgroundImage:
            'linear-gradient(var(--border-secondary) 1px, transparent 1px), linear-gradient(90deg, var(--border-secondary) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Floating shape previews – blurred/faded */}
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.06,
            pointerEvents: 'none',
          }}
        >
          <rect x="18%" y="15%" width="80" height="80" rx="18" fill="var(--brand)" />
          <ellipse cx="72%" cy="28%" rx="55" ry="38" fill="var(--brand-2)" />
          <rect x="62%" y="62%" width="64" height="64" rx="32" fill="var(--brand)" />
          <ellipse cx="25%" cy="72%" rx="40" ry="52" fill="var(--brand-2)" />
        </svg>

        {/* Center badge */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          {/* Icon ring */}
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              border: '1px solid var(--border-button)',
              background: 'var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--brand)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="2.5" />
              <ellipse cx="6.5" cy="17.5" rx="3.5" ry="3.5" />
              <path d="M14 14 L21 14 L17.5 21 Z" />
            </svg>
          </div>

          {/* Label */}
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-dimmed)',
                margin: '4px 0 0',
              }}
            >
              This tool is on its way
            </p>
          </div>

          {/* Coming soon pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '99px',
              border: '1px solid var(--border-button)',
              background: 'var(--bg-card)',
            }}
          >
            {/* pulsing dot */}
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--brand)',
                display: 'inline-block',
                animation: 'cs-pulse 2s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
              }}
            >
              Coming soon
            </span>
          </div>
        </div>

        {/* CSS keyframe for the dot */}
        <style>{`@keyframes cs-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
      </div>

      {/* ── Right Inspect Panel ── */}
      <div
        className="hidden lg:flex"
        style={{
          width: '190px',
          flexShrink: 0,
          flexDirection: 'column',
          borderLeft: '1px solid var(--border-secondary)',
          background: 'var(--bg-card)',
        }}
      >
        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-secondary)' }}>
          {['Inspect', 'Code'].map((tab, i) => (
            <div
              key={tab}
              style={{
                flex: 1,
                padding: '10px 0',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 600,
                color: i === 0 ? 'var(--brand)' : 'var(--text-dimmed)',
                borderBottom: i === 0 ? '2px solid var(--brand)' : 'none',
                letterSpacing: '0.02em',
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Properties skeleton */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SectionLabel>Properties</SectionLabel>
            {[60, 44, 72, 36, 52].map((w, i) => (
              <div
                key={i}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Pulse style={{ width: `${w - 10}px`, height: '10px', borderRadius: '3px' }} />
                <Pulse style={{ width: `${w * 0.6}px`, height: '10px', borderRadius: '3px' }} />
              </div>
            ))}
          </div>

          <div style={{ height: '1px', background: 'var(--border-secondary)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SectionLabel>Export as</SectionLabel>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
              }}
            >
              {['SVG', 'PNG', 'CSS', 'JSX'].map(fmt => (
                <div
                  key={fmt}
                  style={{
                    borderRadius: '6px',
                    border: '1px solid var(--border-button)',
                    background: 'var(--bg-button)',
                    padding: '6px 0',
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--text-dimmed)',
                    letterSpacing: '0.04em',
                    opacity: 0.5,
                  }}
                >
                  {fmt}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export button skeleton */}
        <div style={{ padding: '10px', borderTop: '1px solid var(--border-secondary)' }}>
          <div
            style={{
              height: '32px',
              borderRadius: '8px',
              background: 'var(--bg-button)',
              border: '1px solid var(--border-button)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              opacity: 0.4,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Export
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
