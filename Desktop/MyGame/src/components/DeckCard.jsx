import { ChevronRight } from 'lucide-react';

export default function DeckCard({ deck, onClick, compact = false }) {
  const wordCount = deck.words?.length ?? 0;
  return (
    <div className="deck-card" onClick={onClick} style={{ '--deck-color': deck.color }}>
      <div className="deck-emoji" style={{ boxShadow: `0 0 0 1px ${deck.color}30` }}>
        {deck.emoji}
      </div>
      <div className="deck-info">
        <div className="deck-name">{deck.name}</div>
        <div className="deck-meta">
          {wordCount} words
          {deck.isCustom && <span style={{ color: 'var(--primary-light)', marginLeft: 8 }}>• Custom</span>}
          {deck.kidsMode && <span style={{ color: 'var(--warning)', marginLeft: 8 }}>• Kids</span>}
        </div>
        {!compact && deck.tags && (
          <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
            {deck.tags.slice(0, 2).map(t => (
              <span key={t} className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      <ChevronRight size={18} color="var(--text-muted)" />
    </div>
  );
}
