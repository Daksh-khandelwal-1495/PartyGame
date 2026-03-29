export interface Deck {
  id: string;
  name: string;
  emoji: string;
  category: string;
  words: string[];
  isCustom?: boolean;
  color?: string;
}

export type GamePhase = 'idle' | 'countdown' | 'playing' | 'results';

export interface RoundEntry {
  word: string;
  result: 'correct' | 'skip';
}

export interface RoundResult {
  deckId: string;
  deckName: string;
  entries: RoundEntry[];
  correct: number;
  skipped: number;
  durationSecs: number;
}

export interface GameState {
  phase: GamePhase;
  deck: Deck | null;
  wordIndex: number;
  entries: RoundEntry[];
  timerLeft: number;
  roundResults: RoundResult[];
  currentRound: number;
}

export interface Settings {
  timerSecs: number;
  rounds: number;
  soundEnabled: boolean;
  tiltEnabled: boolean;
  largeText: boolean;
  highContrast: boolean;
}

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  unlocked: boolean;
}

export interface Stats {
  gamesPlayed: number;
  totalCorrect: number;
  totalSkipped: number;
  bestStreak: number;
  customDecksCreated: number;
  voiceDeckCreated: boolean;
}
