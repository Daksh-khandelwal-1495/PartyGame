import type { Settings } from '../types';

interface Props {
  settings: Settings;
  onUpdate: (patch: Partial<Settings>) => void;
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="toggle-wrap">
      <div>
        <div className="toggle-label">{label}</div>
        {desc && <div className="toggle-desc">{desc}</div>}
      </div>
      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="toggle-slider" />
      </label>
    </div>
  );
}

export default function SettingsPage({ settings, onUpdate }: Props) {
  return (
    <div className="page fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Settings</h1>
        <p style={{ color: 'var(--text-sub)', marginTop: 4, fontSize: '.9rem' }}>Customize your game experience</p>
      </div>

      {/* Timer */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
        <p className="section-title">Timer</p>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <span style={{ fontWeight: 700 }}>Duration</span>
          <span className="badge badge-primary">{settings.timerSecs}s</span>
        </div>
        <div className="chip-group">
          {[30, 45, 60, 90, 120].map(v => (
            <button key={v} className={`chip ${settings.timerSecs === v ? 'selected' : ''}`} onClick={() => onUpdate({ timerSecs: v })}>
              {v}s
            </button>
          ))}
        </div>
      </div>

      {/* Rounds */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
        <p className="section-title">Rounds per game session</p>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <span style={{ fontWeight: 700 }}>Rounds</span>
          <span className="badge badge-primary">{settings.rounds}</span>
        </div>
        <div className="chip-group">
          {[1, 2, 3, 5, 7].map(v => (
            <button key={v} className={`chip ${settings.rounds === v ? 'selected' : ''}`} onClick={() => onUpdate({ rounds: v })}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Gameplay */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
        <p className="section-title">Gameplay</p>
        <Toggle
          label="Sound Effects"
          desc="Play sounds during gameplay"
          checked={settings.soundEnabled}
          onChange={v => onUpdate({ soundEnabled: v })}
        />
        <Toggle
          label="Tilt Controls"
          desc="Tilt phone forward/backward to guess or skip"
          checked={settings.tiltEnabled}
          onChange={v => onUpdate({ tiltEnabled: v })}
        />
      </div>

      {/* Accessibility */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <p className="section-title">Accessibility</p>
        <Toggle
          label="Large Text"
          desc="Increase font size for easier reading"
          checked={settings.largeText}
          onChange={v => onUpdate({ largeText: v })}
        />
        <Toggle
          label="High Contrast"
          desc="Boost color contrast for visibility"
          checked={settings.highContrast}
          onChange={v => onUpdate({ highContrast: v })}
        />
      </div>

      {/* About */}
      <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-muted)', fontSize: '.8rem' }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>MyGame v1.0</p>
        <p>A free Heads Up!-style party charades game</p>
      </div>
    </div>
  );
}
