import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from '../components/Confetti';
import { Home, RotateCcw, Trophy } from 'lucide-react';
import { useState } from 'react';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { scores, players, deck, correct, skipped, rounds } = location.state || {};
  const [showConfetti] = useState(true);

  if (!scores) { navigate('/'); return null; }

  const sorted = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  const winner = sorted[0];

  const rankClass = (i) => i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
  const rankEmoji = (i) => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}th`;

  return (
    <div className="page fade-in" style={{ justifyContent: 'center' }}>
      <Confetti active={showConfetti} />

      {/* Trophy */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: '4rem', marginBottom: 8 }}>🏆</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 4 }}>Game Over!</h1>
        <div style={{ color: 'var(--primary-light)', fontWeight: 700, fontSize: '1.1rem' }}>
          🎉 {winner} wins!
        </div>
      </div>

      {/* Global stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Rounds', val: rounds },
          { label: 'Correct', val: correct },
          { label: 'Skipped', val: skipped },
        ].map(({ label, val }) => (
          <div key={label} className="card" style={{ padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{val}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Trophy size={14} /> Leaderboard
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        {sorted.map((player, i) => (
          <div key={player} className="score-row">
            <div className={`score-rank${rankClass(i) ? ` ${rankClass(i)}` : ''}`}>
              {rankEmoji(i)}
            </div>
            <div style={{ flex: 1, fontWeight: 700 }}>{player}</div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{scores[player] || 0}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 4 }}>pts</div>
          </div>
        ))}
      </div>

      {/* Deck played */}
      <div className="card" style={{ padding: 14, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: '1.8rem' }}>{deck.emoji}</span>
        <div>
          <div style={{ fontWeight: 700 }}>{deck.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Deck used</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          className="btn btn-primary btn-lg w-full"
          onClick={() => navigate(`/deck/${deck.id}`, { state: { restart: true } })}
        >
          <RotateCcw size={18} /> Play Again
        </button>
        <button className="btn btn-ghost btn-lg w-full" onClick={() => navigate('/')}>
          <Home size={18} /> Back to Home
        </button>
      </div>
    </div>
  );
}
