import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAllDecks, getStoredDecks, saveCustomDecks } from '../data/decks';

const GameContext = createContext(null);

const DEFAULT_SETTINGS = {
  timerDuration: 60,
  rounds: 3,
  kidsMode: false,
  soundEnabled: true,
  largeText: false,
  highContrast: false,
  profanityFilter: false,
};

const DEFAULT_ACHIEVEMENTS = [
  { id: 'first_win', name: 'First Win!', desc: 'Complete your first game', emoji: '🏆', unlocked: false },
  { id: 'streak_3', name: 'On Fire', desc: 'Get 3 correct in a row', emoji: '🔥', unlocked: false },
  { id: 'perfect_round', name: 'Perfect Round', desc: 'Get all words correct in a round', emoji: '⭐', unlocked: false },
  { id: 'voice_creator', name: 'Voice Creator', desc: 'Create a deck with voice input', emoji: '🎙️', unlocked: false },
  { id: 'deck_builder', name: 'Deck Builder', desc: 'Create your first custom deck', emoji: '🃏', unlocked: false },
  { id: 'marathon', name: 'Marathon', desc: 'Play 10 games total', emoji: '🏃', unlocked: false },
  { id: 'speedster', name: 'Speedster', desc: 'Get 5 correct in 30s', emoji: '⚡', unlocked: false },
  { id: 'social', name: 'Party Animal', desc: 'Play with 3+ players', emoji: '🎉', unlocked: false },
];

export function GameProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('game_settings');
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  });

  const [achievements, setAchievements] = useState(() => {
    try {
      const raw = localStorage.getItem('achievements');
      if (!raw) return DEFAULT_ACHIEVEMENTS;
      const saved = JSON.parse(raw);
      return DEFAULT_ACHIEVEMENTS.map(a => ({ ...a, unlocked: saved[a.id] || false }));
    } catch { return DEFAULT_ACHIEVEMENTS; }
  });

  const [stats, setStats] = useState(() => {
    try {
      const raw = localStorage.getItem('game_stats');
      return raw ? JSON.parse(raw) : { gamesPlayed: 0, totalCorrect: 0, bestStreak: 0 };
    } catch { return { gamesPlayed: 0, totalCorrect: 0, bestStreak: 0 }; }
  });

  const [customDecks, setCustomDecks] = useState(getStoredDecks);
  const [allDecks, setAllDecks] = useState(getAllDecks);

  // Apply accessibility to body
  useEffect(() => {
    document.body.classList.toggle('large-text', settings.largeText);
    document.body.classList.toggle('high-contrast', settings.highContrast);
  }, [settings.largeText, settings.highContrast]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('game_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist achievements
  useEffect(() => {
    const map = {};
    achievements.forEach(a => { map[a.id] = a.unlocked; });
    localStorage.setItem('achievements', JSON.stringify(map));
  }, [achievements]);

  // Persist stats
  useEffect(() => {
    localStorage.setItem('game_stats', JSON.stringify(stats));
  }, [stats]);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const unlockAchievement = useCallback((id) => {
    setAchievements(prev =>
      prev.map(a => a.id === id ? { ...a, unlocked: true } : a)
    );
  }, []);

  const addCustomDeck = useCallback((deck) => {
    setCustomDecks(prev => {
      const updated = [...prev, deck];
      saveCustomDecks(updated);
      setAllDecks(getAllDecks());
      return updated;
    });
    unlockAchievement('deck_builder');
  }, [unlockAchievement]);

  const deleteCustomDeck = useCallback((id) => {
    setCustomDecks(prev => {
      const updated = prev.filter(d => d.id !== id);
      saveCustomDecks(updated);
      setAllDecks(getAllDecks());
      return updated;
    });
  }, []);

  const updateStats = useCallback((results) => {
    setStats(prev => {
      const updated = {
        gamesPlayed: prev.gamesPlayed + 1,
        totalCorrect: prev.totalCorrect + results.correct,
        bestStreak: Math.max(prev.bestStreak, results.streak || 0),
      };
      return updated;
    });
  }, []);

  return (
    <GameContext.Provider value={{
      settings, updateSetting,
      achievements, unlockAchievement,
      stats, updateStats,
      customDecks, addCustomDeck, deleteCustomDeck,
      allDecks,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
