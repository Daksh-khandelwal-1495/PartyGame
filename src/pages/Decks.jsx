import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeckCard from '../components/DeckCard';
import { useGame } from '../context/GameContext';
import { Search, Plus } from 'lucide-react';

const CATEGORIES = ['All', 'entertainment', 'nature', 'geography', 'sports', 'educational', 'lifestyle', 'kids'];

export default function Decks() {
  const navigate = useNavigate();
  const { allDecks, settings, deleteCustomDeck } = useGame();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = allDecks.filter(d => {
    if (settings.kidsMode && !d.kidsMode && d.category !== 'kids') return false;
    if (cat !== 'All' && d.category !== cat) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="page fade-in">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 4 }}>Deck Library</h1>
        <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>{allDecks.length} decks available</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          className="input-field"
          style={{ paddingLeft: 40 }}
          placeholder="Search decks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category chips */}
      <div className="chip-group" style={{ marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button key={c} className={`chip${cat === c ? ' selected' : ''}`} onClick={() => setCat(c)}>
            {c === 'All' ? '🌟 All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Deck list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            No decks found
          </div>
        )}
        {filtered.map(deck => (
          <div key={deck.id} style={{ position: 'relative' }}>
            <DeckCard deck={deck} onClick={() => navigate(`/deck/${deck.id}`)} />
            {deck.isCustom && (
              <button
                onClick={e => { e.stopPropagation(); if (confirm('Delete this deck?')) deleteCustomDeck(deck.id); }}
                style={{ position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)', color: 'var(--danger)', background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', padding: '4px 8px' }}
              >
                🗑
              </button>
            )}
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/create')}
        style={{
          position: 'fixed', right: 20, bottom: 80,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(139,92,246,0.5)', border: 'none', cursor: 'pointer',
          zIndex: 50,
        }}
      >
        <Plus size={24} color="white" />
      </button>
    </div>
  );
}
