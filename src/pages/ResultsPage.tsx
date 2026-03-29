import type { RoundResult } from '../types';
import { Trophy, RotateCcw, Home } from 'lucide-react';

interface Props {
  results: RoundResult[];
  onPlayAgain: () => void;
  onHome: () => void;
}

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.5}s`,
    duration: `${2 + Math.random() * 2}s`,
    color: ['#ff3cac','#ffd32a','#00f5a0','#00b4d8','#a855f7'][Math.floor(Math.random() * 5)],
    rotate: `${Math.random() * 360}deg`,
  }));
  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: p.left, animationDelay: p.delay, animationDuration: p.duration,
          background: p.color, transform: `rotate(${p.rotate})`,
        }} />
      ))}
    </div>
  );
}

export default function ResultsPage({ results, onPlayAgain, onHome }: Props) {
  const totalCorrect = results.reduce((s, r) => s + r.correct, 0);
  const totalSkipped = results.reduce((s, r) => s + r.skipped, 0);
  const totalWords   = totalCorrect + totalSkipped;

  const pct = totalWords > 0 ? Math.round((totalCorrect / totalWords) * 100) : 0;
  const allCorrect = totalSkipped === 0 && totalCorrect > 0;

  return (
    <div className="page fade-in" style={{ gap: 24 }}>
      {allCorrect && <Confetti />}

      {/* Trophy */}
      <div className="flex-col items-center text-center" style={{ paddingTop: 8, gap: 8 }}>
        <div style={{ fontSize: '4rem' }}>
          {pct >= 80 ? '🏆' : pct >= 50 ? '🎉' : '💪'}
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>
          {pct >= 80 ? 'Amazing!' : pct >= 50 ? 'Great job!' : 'Keep going!'}
        </h1>
        <p style={{ color: 'var(--text-sub)' }}>{results.length} round{results.length !== 1 ? 's' : ''} played</p>
      </div>

      {/* Big score */}
      <div className="card flex items-center justify-center text-center" style={{ padding: '32px 16px', gap: 40 }}>
        <div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--success)' }}>{totalCorrect}</div>
          <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Correct</div>
        </div>
        <div style={{ width: 1, height: 48, background: 'var(--border)' }} />
        <div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--danger)' }}>{totalSkipped}</div>
          <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Skipped</div>
        </div>
        <div style={{ width: 1, height: 48, background: 'var(--border)' }} />
        <div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--primary-light)' }}>{pct}%</div>
          <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Score</div>
        </div>
      </div>

      {/* Round breakdown */}
      {results.length > 1 && (
        <div>
          <p className="section-title">Round Breakdown</p>
          <div className="flex-col gap-2">
            {results.map((r, i) => (
              <div key={i} className="score-row">
                <div className={`score-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : 'bronze'}`}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{r.deckName}</div>
                  <div style={{ fontSize: '.8rem', color: 'var(--text-sub)' }}>
                    {r.correct} correct · {r.skipped} skipped · {r.durationSecs}s
                  </div>
                </div>
                <Trophy size={16} color="var(--warning)" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Word list */}
      {results[0] && (
        <div>
          <p className="section-title">Words Played</p>
          <div className="flex" style={{ flexWrap: 'wrap', gap: 8 }}>
            {results.flatMap(r => r.entries).map((e, i) => (
              <span key={i} className={`badge ${e.result === 'correct' ? 'badge-success' : 'badge-warning'}`}>
                {e.result === 'correct' ? '✓' : '✗'} {e.word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex-col gap-2" style={{ marginTop: 'auto' }}>
        <button className="btn btn-primary btn-lg w-full" onClick={onPlayAgain}>
          <RotateCcw size={18} /> Play Again
        </button>
        <button className="btn btn-ghost w-full" onClick={onHome}>
          <Home size={18} /> Change Deck
        </button>
      </div>
    </div>
  );
}
