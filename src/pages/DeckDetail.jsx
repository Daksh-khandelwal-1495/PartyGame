import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Play, Users } from 'lucide-react';
import { useState } from 'react';

export default function DeckDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allDecks, settings } = useGame();
  const [players, setPlayers] = useState(['Player 1', 'Player 2']);
  const [newName, setNewName] = useState('');

  const deck = allDecks.find(d => d.id === id);
  if (!deck) return <div className="page"><p>Deck not found.</p></div>;

  const addPlayer = () => {
    if (newName.trim() && players.length < 8) {
      setPlayers([...players, newName.trim()]);
      setNewName('');
    }
  };
  const removePlayer = (i) => setPlayers(players.filter((_, idx) => idx !== i));

  const startGame = () => {
    navigate('/play', { state: { deck, players } });
  };

  return (
    <div className="page fade-in">
      {/* Back button */}
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20, width: 'fit-content' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Deck header */}
      <div className="card" style={{ padding: 24, textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>{deck.emoji}</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 4 }}>{deck.name}</h1>
        <div style={{ color: 'var(--text-sub)', marginBottom: 12 }}>{deck.words.length} words</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          {deck.tags?.map(t => (
            <span key={t} className="badge badge-primary">{t}</span>
          ))}
          {deck.kidsMode && <span className="badge badge-warning">Kids Mode</span>}
          {deck.isCustom && <span className="badge badge-accent">Custom</span>}
        </div>
      </div>

      {/* Settings summary */}
      <div className="card" style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {[
            { label: 'Timer', val: `${settings.timerDuration}s` },
            { label: 'Rounds', val: settings.rounds },
            { label: 'Players', val: players.length },
          ].map(({ label, val }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{val}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Players setup */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={14} /> Players
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
          {players.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', border: '1px solid var(--border)' }}>
              <span style={{ flex: 1, fontWeight: 600 }}>{p}</span>
              {players.length > 1 && (
                <button onClick={() => removePlayer(i)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
              )}
            </div>
          ))}
        </div>
        {players.length < 8 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="input-field"
              placeholder="Add player name…"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addPlayer()}
              style={{ flex: 1 }}
            />
            <button className="btn btn-ghost" onClick={addPlayer}>+ Add</button>
          </div>
        )}
      </div>

      {/* Word preview */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-title">Sample Words</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {deck.words.slice(0, 8).map((w, i) => (
            <span key={i} className="badge badge-primary">{w}</span>
          ))}
          {deck.words.length > 8 && (
            <span className="badge badge-primary">+{deck.words.length - 8} more…</span>
          )}
        </div>
      </div>

      {/* Start */}
      <button className="btn btn-primary btn-lg w-full" onClick={startGame}>
        <Play size={20} /> Start Game
      </button>
    </div>
  );
}
