import { useState, useEffect } from 'react';
import type { Deck } from '../types';
import { BUILT_IN_DECKS } from '../data/decks';

const CUSTOM_KEY = 'mygame_custom_decks';

export function useDecks() {
  const [customDecks, setCustomDecks] = useState<Deck[]>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customDecks));
  }, [customDecks]);

  const allDecks = [...BUILT_IN_DECKS, ...customDecks];

  function addDeck(deck: Deck) {
    setCustomDecks(d => [...d, { ...deck, isCustom: true }]);
  }

  function removeDeck(id: string) {
    setCustomDecks(d => d.filter(x => x.id !== id));
  }

  function updateDeck(id: string, patch: Partial<Deck>) {
    setCustomDecks(d => d.map(x => x.id === id ? { ...x, ...patch } : x));
  }

  return { allDecks, customDecks, addDeck, removeDeck, updateDeck };
}
