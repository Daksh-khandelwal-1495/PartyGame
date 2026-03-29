import { useState } from 'react';
import type { Deck } from '../types';
import { Plus, Trash2, Mic, MicOff, ChevronRight } from 'lucide-react';

interface Props {
  customDecks: Deck[];
  onAdd: (deck: Deck) => void;
  onRemove: (id: string) => void;
  onVoiceDeck: () => void;
}

const EMOJIS = ['🎭','🌈','🦄','🍕','🚀','🎵','⚽','🏖️','🌮','🎲','🐉','🦋','🌙','⭐','🎪'];

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}
interface SpeechRecognitionAlternative {
  transcript: string;
}

export default function DecksPage({ customDecks, onAdd, onRemove, onVoiceDeck }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [deckEmoji, setDeckEmoji] = useState('🎭');
  const [wordInput, setWordInput] = useState('');
  const [wordList, setWordList]   = useState<string[]>([]);
  const [listening, setListening] = useState(false);

  function addWord() {
    const w = wordInput.trim();
    if (w && !wordList.includes(w)) setWordList(l => [...l, w]);
    setWordInput('');
  }

  function removeWord(w: string) {
    setWordList(l => l.filter(x => x !== w));
  }

  function saveDeck() {
    if (!deckName.trim() || wordList.length === 0) return;
    const deck: Deck = {
      id: `custom_${Date.now()}`,
      name: deckName.trim(),
      emoji: deckEmoji,
      category: 'Custom',
      words: wordList,
      isCustom: true,
    };
    onAdd(deck);
    // reset
    setShowCreate(false);
    setDeckName('');
    setWordList([]);
    setWordInput('');
  }

  function startVoice() {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) { alert('Voice not supported in this browser'); return; }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const t = e.results[0]?.[0]?.transcript ?? '';
      if (t) {
        const words = t.split(/[,\s]+/).map(w => w.trim()).filter(Boolean);
        setWordList(l => [...l, ...words.filter(w => !l.includes(w))]);
        onVoiceDeck();
      }
    };
    rec.onerror = () => setListening(false);
    rec.onend   = () => setListening(false);
    rec.start();
    setListening(true);
  }

  return (
    <div className="page fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Your Custom Decks</h1>
        <p style={{ color: 'var(--text-sub)', marginTop: 4, fontSize: '.9rem' }}>
          Create and manage your own word decks
        </p>
      </div>

      {/* Create button */}
      {!showCreate && (
        <button className="btn btn-primary w-full" style={{ marginBottom: 24 }} onClick={() => setShowCreate(true)}>
          <Plus size={18} /> Create Deck
        </button>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="card slide-up" style={{ padding: 20, marginBottom: 24, gap: 16, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontWeight: 800 }}>New Deck</h2>

          {/* Emoji picker */}
          <div>
            <p className="section-title">Choose Icon</p>
            <div className="flex" style={{ flexWrap: 'wrap', gap: 8 }}>
              {EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => setDeckEmoji(e)}
                  style={{
                    fontSize: '1.5rem', width: 44, height: 44, borderRadius: 12,
                    background: deckEmoji === e ? 'rgba(255,60,172,.25)' : 'var(--bg-3)',
                    border: deckEmoji === e ? '2px solid var(--primary)' : '2px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <p className="section-title">Deck Name</p>
            <input
              className="input-field"
              placeholder="e.g. Office Jokes"
              value={deckName}
              onChange={e => setDeckName(e.target.value)}
            />
          </div>

          {/* Add words */}
          <div>
            <p className="section-title">Add Words</p>
            <div className="flex gap-1" style={{ marginBottom: 12 }}>
              <input
                className="input-field"
                placeholder="Type a word…"
                value={wordInput}
                onChange={e => setWordInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addWord()}
                style={{ flex: 1 }}
              />
              <button className="btn btn-ghost btn-sm" onClick={addWord}>Add</button>
            </div>

            {/* Voice input */}
            <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
              <button className={`voice-btn ${listening ? 'listening' : ''}`} onClick={startVoice}>
                {listening ? <MicOff size={22} color="#fff" /> : <Mic size={22} color="#fff" />}
              </button>
              <span style={{ fontSize: '.85rem', color: 'var(--text-sub)' }}>
                {listening ? 'Listening… Speak your words' : 'Tap the mic and speak your word list'}
              </span>
            </div>

            {wordList.length > 0 && (
              <div>
                <p style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Tap a word to remove it
                </p>
                <div className="flex" style={{ flexWrap: 'wrap', gap: 8 }}>
                  {wordList.map(w => (
                    <button
                      key={w}
                      className="badge badge-accent"
                      style={{ cursor: 'pointer' }}
                      onClick={() => removeWord(w)}
                    >
                      {w} ✕
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveDeck} disabled={!deckName.trim() || wordList.length === 0}>
              Save Deck ({wordList.length} words)
            </button>
            <button className="btn btn-ghost" onClick={() => { setShowCreate(false); setWordList([]); setWordInput(''); setDeckName(''); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Custom deck list */}
      {customDecks.length === 0 && !showCreate ? (
        <div className="card text-center" style={{ padding: 40, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📂</div>
          <p style={{ fontWeight: 700 }}>No decks found</p>
          <p style={{ fontSize: '.85rem', marginTop: 4 }}>Create your first custom deck above</p>
        </div>
      ) : (
        <div className="flex-col gap-2">
          {customDecks.map(deck => (
            <div key={deck.id} className="deck-card">
              <div className="deck-emoji">{deck.emoji}</div>
              <div className="deck-info">
                <div className="deck-name">{deck.name}</div>
                <div className="deck-meta">{deck.words.length} words</div>
              </div>
              <button
                className="btn btn-icon btn-ghost"
                onClick={() => onRemove(deck.id)}
                style={{ color: 'var(--danger)', flexShrink: 0 }}
              >
                <Trash2 size={16} />
              </button>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
