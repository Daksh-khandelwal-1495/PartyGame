import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TIMER_OPTIONS = [30, 60, 90, 120];
const ROUND_OPTIONS = [1, 2, 3, 5];

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  );
}

export default function Settings() {
  const { settings, updateSetting } = useGame();
  const navigate = useNavigate();

  return (
    <div className="page fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Settings</h1>
        <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>Customize your game experience</p>
      </div>

      {/* Gameplay */}
      <div className="section-title">Gameplay</div>
      <div className="card" style={{ padding: '4px 16px', marginBottom: 20 }}>

        <div className="toggle-wrap">
          <div>
            <div className="toggle-label">⏱️ Round Timer</div>
            <div className="toggle-desc">Duration of each round</div>
            <div className="chip-group" style={{ marginTop: 10 }}>
              {TIMER_OPTIONS.map(t => (
                <button
                  key={t}
                  className={`chip${settings.timerDuration === t ? ' selected' : ''}`}
                  onClick={() => updateSetting('timerDuration', t)}
                >{t}s</button>
              ))}
            </div>
          </div>
        </div>

        <div className="toggle-wrap">
          <div>
            <div className="toggle-label">🔄 Rounds per Game</div>
            <div className="toggle-desc">Rounds per game session</div>
            <div className="chip-group" style={{ marginTop: 10 }}>
              {ROUND_OPTIONS.map(r => (
                <button
                  key={r}
                  className={`chip${settings.rounds === r ? ' selected' : ''}`}
                  onClick={() => updateSetting('rounds', r)}
                >{r}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="toggle-wrap">
          <div>
            <div className="toggle-label">🧒 Kids Mode</div>
            <div className="toggle-desc">Show only family-friendly decks</div>
          </div>
          <Toggle checked={settings.kidsMode} onChange={v => updateSetting('kidsMode', v)} />
        </div>

        <div className="toggle-wrap">
          <div>
            <div className="toggle-label">🔇 Profanity Filter</div>
            <div className="toggle-desc">Hide any mature-themed decks</div>
          </div>
          <Toggle checked={settings.profanityFilter} onChange={v => updateSetting('profanityFilter', v)} />
        </div>

        <div className="toggle-wrap">
          <div>
            <div className="toggle-label">🔊 Sound Effects</div>
            <div className="toggle-desc">Play sounds during gameplay</div>
          </div>
          <Toggle checked={settings.soundEnabled} onChange={v => updateSetting('soundEnabled', v)} />
        </div>
      </div>

      {/* Accessibility */}
      <div className="section-title">Accessibility</div>
      <div className="card" style={{ padding: '4px 16px', marginBottom: 20 }}>
        <div className="toggle-wrap">
          <div>
            <div className="toggle-label">🔠 Large Text</div>
            <div className="toggle-desc">Increase font size across the app</div>
          </div>
          <Toggle checked={settings.largeText} onChange={v => updateSetting('largeText', v)} />
        </div>
        <div className="toggle-wrap">
          <div>
            <div className="toggle-label">🎨 High Contrast</div>
            <div className="toggle-desc">Boost color contrast for visibility</div>
          </div>
          <Toggle checked={settings.highContrast} onChange={v => updateSetting('highContrast', v)} />
        </div>
      </div>

      {/* About */}
      <div className="section-title">About</div>
      <div className="card" style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>MyGame v1.0</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.7 }}>
          A free, open Heads Up!-style charades party game.<br />
          10 built-in decks · Voice deck creation · Offline-ready<br />
          Local pass-and-play for unlimited players.
        </div>
      </div>
    </div>
  );
}
