import { useState, useEffect } from 'react';
import type { Stats, Achievement } from '../types';

const STATS_KEY = 'mygame_stats';

const DEFAULT_STATS: Stats = {
  gamesPlayed: 0,
  totalCorrect: 0,
  totalSkipped: 0,
  bestStreak: 0,
  customDecksCreated: 0,
  voiceDeckCreated: false,
};

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_game',      emoji: '🎮', title: 'First Game',      desc: 'Complete your first game',             unlocked: false },
  { id: 'perfect_round',   emoji: '🏆', title: 'Perfect Round',   desc: 'Get every word correct in a round',    unlocked: false },
  { id: 'speed_demon',     emoji: '⚡', title: 'Speedster',        desc: 'Get 5+ correct in 30 seconds',         unlocked: false },
  { id: 'voice_creator',   emoji: '🎤', title: 'Voice Creator',    desc: 'Create a deck with voice input',       unlocked: false },
  { id: 'custom_deck',     emoji: '✏️', title: 'Deck Builder',     desc: 'Create your first custom deck',        unlocked: false },
  { id: 'party_animal',    emoji: '🎉', title: 'Party Animal',     desc: 'Play 10 games',                        unlocked: false },
  { id: 'on_fire',         emoji: '🔥', title: 'On Fire',          desc: 'Get a streak of 5 correct in a row',   unlocked: false },
  { id: 'boss_fight',      emoji: '👑', title: 'Boss Fight',       desc: 'Play 50 rounds total',                 unlocked: false },
];

function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

export function useStats() {
  const [stats, setStats] = useState<Stats>(loadStats);

  useEffect(() => {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }, [stats]);

  function recordGame(correct: number, skipped: number, streak: number) {
    setStats(s => ({
      ...s,
      gamesPlayed: s.gamesPlayed + 1,
      totalCorrect: s.totalCorrect + correct,
      totalSkipped: s.totalSkipped + skipped,
      bestStreak: Math.max(s.bestStreak, streak),
    }));
  }

  function recordCustomDeck(voice = false) {
    setStats(s => ({
      ...s,
      customDecksCreated: s.customDecksCreated + 1,
      voiceDeckCreated: s.voiceDeckCreated || voice,
    }));
  }

  function getAchievements(): Achievement[] {
    return ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: checkUnlocked(a.id, stats),
    }));
  }

  return { stats, recordGame, recordCustomDeck, getAchievements };
}

function checkUnlocked(id: string, s: Stats): boolean {
  switch (id) {
    case 'first_game':    return s.gamesPlayed >= 1;
    case 'perfect_round': return s.totalSkipped === 0 && s.totalCorrect > 0;
    case 'speed_demon':   return s.bestStreak >= 5;
    case 'voice_creator': return s.voiceDeckCreated;
    case 'custom_deck':   return s.customDecksCreated >= 1;
    case 'party_animal':  return s.gamesPlayed >= 10;
    case 'on_fire':       return s.bestStreak >= 5;
    case 'boss_fight':    return s.gamesPlayed >= 50;
    default:              return false;
  }
}
