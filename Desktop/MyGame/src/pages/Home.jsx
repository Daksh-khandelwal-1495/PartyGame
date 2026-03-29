import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import DeckCard from '../components/DeckCard';
import { Zap, Users, Star } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { allDecks, settings, stats } = useGame();

  // Show featured decks (first 4 built-in)
  const featured = allDecks.filter(d => !d.isCustom).slice(0, 4);
  const recent = allDecks.filter(d => d.isCustom).slice(0, 3);

  return (
    <div className="page fade-in">
      {/* Hero */}
      <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 24 }}>
        <div className="hero-logo">MyGame</div>
        <div className="hero-tagline">The ultimate free party charades game 🎉</div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
        {[
          { icon: Zap, label: 'Games', val: stats.gamesPlayed },
          { icon: Star, label: 'Correct', val: stats.totalCorrect },
          { icon: Users, label: 'Best Streak', val: stats.bestStreak },
        ].map(({ icon: Icon, label, val }) => (
          <div key={label} className="card" style={{ padding: '14px 10px', textAlign: 'center' }}>
            <Icon size={18} color="var(--primary-light)" style={{ marginBottom: 4 }} />
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{val}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Play CTA */}
      <button
        className="btn btn-primary btn-lg w-full"
        style={{ marginBottom: 28, fontSize: '1.1rem' }}
        onClick={() => navigate('/decks')}
      >
        🎮 Play Now
      </button>

      {/* Featured Decks */}
      <div className="section-title">Featured Decks</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {featured.map(deck => (
          <DeckCard
            key={deck.id}
            deck={deck}
            onClick={() => navigate(`/deck/${deck.id}`)}
          />
        ))}
      </div>

      {/* Custom Decks preview */}
      {recent.length > 0 && (
        <>
          <div className="section-title">Your Custom Decks</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {recent.map(deck => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onClick={() => navigate(`/deck/${deck.id}`)}
              />
            ))}
          </div>
        </>
      )}

      {/* Tips */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 8, fontSize: '0.9rem' }}>💡 How to Play</div>
        <ul style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.8, paddingLeft: 18 }}>
          <li>Pick a deck and start a round</li>
          <li>Hold your phone to your forehead</li>
          <li>Tilt <strong>forward ↓</strong> = Correct ✅</li>
          <li>Tilt <strong>backward ↑</strong> = Skip ❌</li>
          <li>Or tap the big ✅/❌ buttons on screen</li>
        </ul>
      </div>
    </div>
  );
}
