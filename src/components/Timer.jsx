import { useEffect, useRef, useCallback } from 'react';

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Timer({ timeLeft, total }) {
  const fillRef = useRef(null);
  const pct = timeLeft / total;
  const offset = CIRCUMFERENCE * (1 - pct);
  const isWarn = timeLeft <= Math.floor(total * 0.33);
  const isDanger = timeLeft <= 10;

  return (
    <div className="timer-ring" style={{ width: 100, height: 100 }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={RADIUS} strokeWidth="7" className="track" />
        <circle
          ref={fillRef}
          cx="50" cy="50"
          r={RADIUS}
          strokeWidth="7"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className={`fill${isDanger ? ' danger' : isWarn ? ' warn' : ''}`}
        />
      </svg>
      <div className="timer-value" style={{ color: isDanger ? 'var(--danger)' : isWarn ? 'var(--warning)' : 'var(--text)' }}>
        {timeLeft}
      </div>
    </div>
  );
}
