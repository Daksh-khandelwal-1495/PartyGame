import { useState, useEffect, useCallback, useRef } from 'react';
import type { Deck, RoundEntry, Settings } from '../types';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Props {
  deck: Deck;
  settings: Settings;
  round: number;
  totalRounds: number;
  onRoundEnd: (entries: RoundEntry[], duration: number) => void;
}

const COUNTDOWN_SECS = 3;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GameScreen({ deck, settings, round, totalRounds, onRoundEnd }: Props) {
  const [phase, setPhase] = useState<'countdown' | 'playing' | 'done'>('countdown');
  const [countdown, setCountdown] = useState(COUNTDOWN_SECS);
  const [words] = useState(() => shuffle(deck.words));
  const [wordIdx, setWordIdx] = useState(0);
  const [entries, setEntries] = useState<RoundEntry[]>([]);
  const [timeLeft, setTimeLeft] = useState(settings.timerSecs);
  const [flash, setFlash] = useState<'correct' | 'skip' | 'neutral'>('neutral');
  const startTime = useRef(Date.now());

  const tilt = useDeviceOrientation(settings.tiltEnabled && phase === 'playing');

  // Countdown
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) { setPhase('playing'); startTime.current = Date.now(); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Game timer
  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) { setPhase('done'); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  // Tilt → action
  useEffect(() => {
    if (tilt === 'none') return;
    if (tilt === 'correct') handleCorrect();
    if (tilt === 'skip')    handleSkip();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tilt]);

  // Done → fire callback
  useEffect(() => {
    if (phase !== 'done') return;
    const duration = Math.round((Date.now() - startTime.current) / 1000);
    onRoundEnd(entries, duration);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const advance = useCallback((result: 'correct' | 'skip') => {
    if (phase !== 'playing') return;
    const word = words[wordIdx] ?? '';
    setEntries(e => [...e, { word, result }]);
    setFlash(result);
    setTimeout(() => setFlash('neutral'), 400);
    if (wordIdx + 1 >= words.length) {
      setPhase('done');
    } else {
      setWordIdx(i => i + 1);
    }
  }, [phase, words, wordIdx]);

  function handleCorrect() { advance('correct'); }
  function handleSkip()    { advance('skip'); }

  // Timer ring
  const radius = 44;
  const ratio  = timeLeft / settings.timerSecs;
  const strokeClass = ratio > .5 ? '' : ratio > .25 ? 'warn' : 'danger';

  if (phase === 'countdown') {
    return (
      <div className="flex-col items-center justify-center" style={{ minHeight: '100dvh', gap: 24 }}>
        <p style={{ fontSize: '1rem', color: 'var(--text-sub)', fontWeight: 600 }}>
          Round {round} of {totalRounds} · {deck.name}
        </p>
        <div style={{ fontSize: 'clamp(5rem,25vw,9rem)', fontWeight: 900 }}>
          {countdown === 0 ? '🚀' : countdown}
        </div>
        <p className="tilt-hints" style={{ maxWidth: 320 }}>
          Get ready!
        </p>
        {settings.tiltEnabled && (
          <div className="tilt-hints" style={{ maxWidth: 360 }}>
            <div className="tilt-hint"><span>📲</span>Tilt forward = Correct</div>
            <div className="tilt-hint"><span>📵</span>Tilt back = Skip</div>
          </div>
        )}
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="flex-col items-center justify-center" style={{ minHeight: '100dvh' }}>
        <div style={{ fontSize: '4rem' }}>⏰</div>
        <p style={{ marginTop: 16, fontSize: '1.1rem', color: 'var(--text-sub)' }}>Time's up!</p>
      </div>
    );
  }

  return (
    <div className="flex-col" style={{ minHeight: '100dvh', padding: '24px 16px 32px', maxWidth: 480, margin: '0 auto', gap: 20 }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Round {round}/{totalRounds}
          </p>
          <p style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--text-sub)' }}>{deck.name}</p>
        </div>
        <div className="timer-ring">
          <svg width={56} height={56}>
            <circle className="track" cx={28} cy={28} r={radius * 0.78} strokeWidth={6} />
            <circle
              className={`fill ${strokeClass}`}
              cx={28} cy={28} r={radius * 0.78}
              strokeWidth={6}
              style={{ strokeDasharray: 2 * Math.PI * (radius * 0.78), strokeDashoffset: 2 * Math.PI * (radius * 0.78) * (1 - ratio) }}
            />
          </svg>
          <div className="timer-value">{timeLeft}</div>
        </div>
      </div>

      {/* Score bar */}
      <div className="flex gap-2 items-center">
        <span style={{ fontSize: '.8rem', color: 'var(--success)', fontWeight: 700 }}>
          ✓ {entries.filter(e => e.result === 'correct').length}
        </span>
        <span style={{ fontSize: '.8rem', color: 'var(--danger)', fontWeight: 700 }}>
          ✗ {entries.filter(e => e.result === 'skip').length}
        </span>
        <div className="progress-bar" style={{ flex: 1 }}>
          <div className="progress-fill" style={{ width: `${((wordIdx) / words.length) * 100}%` }} />
        </div>
        <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{wordIdx}/{words.length}</span>
      </div>

      {/* Word card */}
      <div className="word-card-wrap" style={{ flex: 1 }}>
        <div className={`word-card ${flash}`}>
          <p className="word-deck-label">{deck.name}</p>
          <p className="word-text">{words[wordIdx]}</p>
          {flash === 'correct' && <p style={{ fontSize: '2rem', marginTop: 16 }}>✅</p>}
          {flash === 'skip'    && <p style={{ fontSize: '2rem', marginTop: 16 }}>⏭️</p>}
        </div>
      </div>

      {/* Action buttons */}
      <div className="action-btns">
        <button className="action-btn action-btn-correct" onClick={handleCorrect}>
          <CheckCircle size={28} />
          Correct
        </button>
        <button className="action-btn action-btn-skip" onClick={handleSkip}>
          <XCircle size={28} />
          Skip
        </button>
      </div>

      {/* Word list recap */}
      {entries.length > 0 && (
        <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          {entries.slice(-3).map((e, i) => (
            <span key={i} style={{ marginRight: 8, color: e.result === 'correct' ? 'var(--success)' : 'var(--danger)' }}>
              {e.result === 'correct' ? '✓' : '✗'} {e.word}
            </span>
          ))}
        </div>
      )}

      {/* Tilt indicator */}
      {settings.tiltEnabled && tilt !== 'none' && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', zIndex: 50,
          background: tilt === 'correct' ? 'rgba(22,163,74,.25)' : 'rgba(225,29,72,.25)',
        }}>
          <RotateCcw size={80} color={tilt === 'correct' ? 'var(--success)' : 'var(--danger)'} />
        </div>
      )}
    </div>
  );
}
