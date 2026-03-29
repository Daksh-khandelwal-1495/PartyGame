import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import VoiceButton from '../components/VoiceButton';
import { useVoice } from '../hooks/useVoice';
import { ArrowLeft, X, Plus } from 'lucide-react';

const EMOJIS = ['🎯','🎮','🎬','🌍','🎵','🍕','⚽','🔬','🐾','👑','🌟','🎯','🎪','🚀','💡','🏆','🦄','🌈','🔥','💎'];
const COLORS = ['#7c3aed','#0891b2','#16a34a','#db2777','#ea580c','#b45309','#4f46e5','#0d9488'];

export default function CreateDeck() {
  const navigate = useNavigate();
  const { addCustomDeck, unlockAchievement } = useGame();
  const [name, setName] = useState('');
  const [words, setWords] = useState([]);
  const [input, setInput] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [color, setColor] = useState('#7c3aed');
  const [bulkText, setBulkText] = useState('');
  const [tab, setTab] = useState('type'); // type | bulk | voice

  const handleVoiceResult = useCallback((newWords) => {
    setWords(prev => {
      const all = [...prev, ...newWords.filter(w => !prev.includes(w) && w.length > 0)];
      return all;
    });
    unlockAchievement('voice_creator');
  }, [unlockAchievement]);

  const { listening, supported, toggle } = useVoice(handleVoiceResult);

  const addWord = () => {
    const trimmed = input.trim();
    if (trimmed && !words.includes(trimmed)) {
      setWords(prev => [...prev, trimmed]);
    }
    setInput('');
  };

  const addBulk = () => {
    const parsed = bulkText
      .split(/[\n,;]+/)
      .map(w => w.trim())
      .filter(w => w.length > 0 && !words.includes(w));
    setWords(prev => [...prev, ...parsed]);
    setBulkText('');
  };

  const removeWord = (i) => setWords(prev => prev.filter((_, idx) => idx !== i));

  const saveDeck = () => {
    if (!name.trim() || words.length < 2) return;
    const newDeck = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      emoji,
      color,
      category: 'custom',
      tags: ['custom'],
      isCustom: true,
      words,
    };
    addCustomDeck(newDeck);
    navigate('/decks');
  };

  const canSave = name.trim().length > 0 && words.length >= 2;

  return (
    <div className="page fade-in">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20, width: 'fit-content' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 4 }}>Create Deck</h1>
      <p style={{ color: 'var(--text-sub)', marginBottom: 24, fontSize: '0.9rem' }}>Add words by typing, pasting, or speaking</p>

      {/* Deck name */}
      <div style={{ marginBottom: 16 }}>
        <div className="section-title">Deck Name</div>
        <input
          className="input-field"
          placeholder="e.g. My Awesome Deck"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={40}
        />
      </div>

      {/* Emoji picker */}
      <div style={{ marginBottom: 16 }}>
        <div className="section-title">Icon</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EMOJIS.map(e => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              style={{
                width: 40, height: 40, borderRadius: 10, fontSize: '1.3rem',
                border: `2px solid ${emoji === e ? 'var(--primary)' : 'var(--border)'}`,
                background: emoji === e ? 'rgba(139,92,246,0.2)' : 'var(--bg-3)',
                cursor: 'pointer',
              }}
            >{e}</button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-title">Color</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: c, cursor: 'pointer', border: 'none',
                outline: color === c ? `3px solid white` : '3px solid transparent',
                outlineOffset: 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Input tabs */}
      <div style={{ marginBottom: 16 }}>
        <div className="section-title">Add Words</div>
        <div className="chip-group" style={{ marginBottom: 14 }}>
          {['type','bulk','voice'].map(t => (
            <button key={t} className={`chip${tab === t ? ' selected' : ''}`} onClick={() => setTab(t)}>
              {t === 'type' ? '⌨️ Type' : t === 'bulk' ? '📋 Paste' : '🎙️ Voice'}
            </button>
          ))}
        </div>

        {tab === 'type' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="input-field"
              placeholder="Type a word and press Enter…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addWord()}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={addWord}><Plus size={16} /></button>
          </div>
        )}

        {tab === 'bulk' && (
          <div>
            <textarea
              className="input-field"
              placeholder={"Paste words separated by commas or newlines:\napple, banana, cherry\nor one per line"}
              value={bulkText}
              onChange={e => setBulkText(e.target.value)}
              rows={5}
              style={{ resize: 'vertical' }}
            />
            <button className="btn btn-primary" style={{ marginTop: 8, width: '100%' }} onClick={addBulk}>
              Add All Words
            </button>
          </div>
        )}

        {tab === 'voice' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '20px 0' }}>
            <VoiceButton listening={listening} supported={supported} onToggle={toggle} />
            <div style={{ color: 'var(--text-sub)', fontSize: '0.85rem', textAlign: 'center', maxWidth: 260 }}>
              {listening
                ? '🔴 Listening… say words separated by commas or pauses'
                : 'Tap the mic and speak your word list'}
            </div>
          </div>
        )}
      </div>

      {/* Word chips */}
      {words.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="section-title">{words.length} words added</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {words.map((w, i) => (
              <span
                key={i}
                className="badge badge-primary"
                style={{ cursor: 'pointer', paddingRight: 6, display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => removeWord(i)}
              >
                {w} <X size={10} />
              </span>
            ))}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>Tap a word to remove it</div>
        </div>
      )}

      {words.length < 2 && name.trim() && (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>Add at least 2 words to save.</div>
      )}

      <button
        className="btn btn-primary btn-lg w-full"
        onClick={saveDeck}
        disabled={!canSave}
        style={{ opacity: canSave ? 1 : 0.45 }}
      >
        Save Deck ({words.length} words)
      </button>
    </div>
  );
}
