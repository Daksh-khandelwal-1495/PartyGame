import { useState } from 'react';
import type { Deck, Settings } from '../types';
import { ChevronRight } from 'lucide-react';

interface Props {
  decks: Deck[];
  settings: Settings;
  onStart: (deck: Deck) => void;
}

export default function PlayPage({ decks, onStart }: Props) {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(decks.map(d => d.category)))];
  const filtered = filter === 'All' ? decks : decks.filter(d => d.category === filter);

  return (
    <div className="page fade-in">
      {/* Hero */}
      <div className="flex-col items-center text-center gap-2" style={{ paddingTop: 8, marginBottom: 28 }}>
        <div className="hero-logo">MyGame</div>
        <p className="hero-tagline">Pick a deck and start a round</p>
      </div>

      {/* Category filter */}
      <div style={{ marginBottom: 20 }}>
        <p className="section-title">Category</p>
        <div className="chip-group">
          {categories.map(cat => (
            <button key={cat} className={`chip ${filter === cat ? 'selected' : ''}`} onClick={() => setFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Deck list */}
      <div className="flex-col gap-2">
        {filtered.map(deck => (
          <button key={deck.id} className="deck-card" onClick={() => onStart(deck)} style={{ textAlign: 'left' }}>
            <div className="deck-emoji">{deck.emoji}</div>
            <div className="deck-info">
              <div className="deck-name">{deck.name}</div>
              <div className="deck-meta">{deck.words.length} words · {deck.category}</div>
            </div>
            {deck.isCustom && (
              <span className="badge badge-accent" style={{ marginRight: 4 }}>Custom</span>
            )}
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>
        ))}
      </div>
    </div>
  );
}
