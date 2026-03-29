import { useState } from 'react';
import type { Deck, RoundResult } from './types';
import { useSettings }           from './hooks/useSettings';
import { useDecks }              from './hooks/useDecks';
import { useStats }              from './hooks/useStats';
import PlayPage                  from './pages/PlayPage';
import GameScreen                from './pages/GameScreen';
import ResultsPage               from './pages/ResultsPage';
import DecksPage                 from './pages/DecksPage';
import AchievementsPage          from './pages/AchievementsPage';
import SettingsPage              from './pages/SettingsPage';
import { Gamepad2, Layers, Trophy, Settings } from 'lucide-react';

type Tab = 'play' | 'decks' | 'achievements' | 'settings';
type GameFlow = 'select' | 'playing' | 'results';

export default function App() {
  const { settings, update: updateSettings } = useSettings();
  const { allDecks, customDecks, addDeck, removeDeck } = useDecks();
  const { stats, recordGame, recordCustomDeck, getAchievements } = useStats();

  const [tab,       setTab]       = useState<Tab>('play');
  const [gameFlow,  setGameFlow]  = useState<GameFlow>('select');
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [currentRound,  setCurrentRound]  = useState(1);
  const [roundResults,  setRoundResults]  = useState<RoundResult[]>([]);

  function startGame(deck: Deck) {
    setSelectedDeck(deck);
    setCurrentRound(1);
    setRoundResults([]);
    setGameFlow('playing');
  }

  function handleRoundEnd(entries: import('./types').RoundEntry[], duration: number) {
    if (!selectedDeck) return;
    const correct = entries.filter(e => e.result === 'correct').length;
    const skipped = entries.filter(e => e.result === 'skip').length;
    const result: RoundResult = {
      deckId: selectedDeck.id,
      deckName: selectedDeck.name,
      entries, correct, skipped,
      durationSecs: duration,
    };
    const newResults = [...roundResults, result];
    setRoundResults(newResults);

    if (currentRound < settings.rounds) {
      setCurrentRound(r => r + 1);
      // stay in playing phase – GameScreen will re-mount for the next round
      setGameFlow('select');
      setTimeout(() => setGameFlow('playing'), 50);
    } else {
      // compute streak across all rounds
      let streak = 0, best = 0;
      newResults.flatMap(r => r.entries).forEach(e => {
        if (e.result === 'correct') { streak++; best = Math.max(best, streak); }
        else streak = 0;
      });
      recordGame(
        newResults.reduce((s, r) => s + r.correct, 0),
        newResults.reduce((s, r) => s + r.skipped, 0),
        best,
      );
      setGameFlow('results');
    }
  }

  function handlePlayAgain() {
    if (selectedDeck) startGame(selectedDeck);
  }

  function handleHome() {
    setGameFlow('select');
    setTab('play');
  }

  // ── Full-screen game modes ──────────────────────────────────────────
  if (gameFlow === 'playing' && selectedDeck) {
    return (
      <GameScreen
        key={currentRound}
        deck={selectedDeck}
        settings={settings}
        round={currentRound}
        totalRounds={settings.rounds}
        onRoundEnd={handleRoundEnd}
      />
    );
  }

  if (gameFlow === 'results') {
    return (
      <ResultsPage
        results={roundResults}
        onPlayAgain={handlePlayAgain}
        onHome={handleHome}
      />
    );
  }

  // ── Tabbed UI ───────────────────────────────────────────────────────
  return (
    <>
      {tab === 'play' && (
        <PlayPage decks={allDecks} settings={settings} onStart={startGame} />
      )}
      {tab === 'decks' && (
        <DecksPage
          customDecks={customDecks}
          onAdd={deck => { addDeck(deck); recordCustomDeck(false); }}
          onRemove={removeDeck}
          onVoiceDeck={() => recordCustomDeck(true)}
        />
      )}
      {tab === 'achievements' && (
        <AchievementsPage achievements={getAchievements()} stats={stats} />
      )}
      {tab === 'settings' && (
        <SettingsPage settings={settings} onUpdate={updateSettings} />
      )}

      {/* Bottom nav */}
      <nav className="navbar">
        {([
          { id: 'play',         label: 'Play',    Icon: Gamepad2 },
          { id: 'decks',        label: 'Decks',   Icon: Layers   },
          { id: 'achievements', label: 'Awards',  Icon: Trophy   },
          { id: 'settings',     label: 'Settings',Icon: Settings },
        ] as { id: Tab; label: string; Icon: React.ComponentType<{ size: number }> }[]).map(({ id, label, Icon }) => (
          <button key={id} className={`nav-item ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            <Icon size={22} />
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}
