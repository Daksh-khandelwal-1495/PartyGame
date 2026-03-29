import React, { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_DECKS } from '../data/decks'

const GameContext = createContext()

const INITIAL_ACHIEVEMENTS = [
  { id: 'first_win', name: 'First Win!', desc: 'Win your first game', emoji: '🥇' },
  { id: 'streak_3', name: 'On Fire!', desc: 'Get a streak of 3 words', emoji: '🔥' },
  { id: 'social', name: 'Social Butterfly', desc: 'Play with 3+ players', emoji: '🦋' },
  { id: 'deck_creator', name: 'Deck Designer', desc: 'Create a custom deck', emoji: '🎨' },
  { id: 'pro', name: 'Charade Master', desc: 'Guess 10 words correctly in one go', emoji: '🏆' },
]

export function GameProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('mygame_settings')
    return saved ? JSON.parse(saved) : {
      timerDuration: 60,
      rounds: 3,
      players: 2,
      kidsMode: false,
      profanityFilter: true,
      sound: true,
      largeText: false,
      highContrast: false,
    }
  })

  const [customDecks, setCustomDecks] = useState(() => {
    const saved = localStorage.getItem('mygame_custom_decks')
    return saved ? JSON.parse(saved) : []
  })

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('mygame_stats')
    return saved ? JSON.parse(saved) : {
      gamesPlayed: 0,
      totalCorrect: 0,
      bestStreak: 0,
      unlockedAchievements: [], 
    }
  })

  const allDecks = [...INITIAL_DECKS, ...customDecks.map(d => ({ ...d, isCustom: true }))]

  const achievements = INITIAL_ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: (stats.unlockedAchievements || []).includes(a.id),
  }))

  useEffect(() => {
    localStorage.setItem('mygame_settings', JSON.stringify(settings))
    document.body.className = `${settings.largeText ? 'large-text ' : ''}${settings.highContrast ? 'high-contrast' : ''}`
  }, [settings])

  useEffect(() => {
    localStorage.setItem('mygame_stats', JSON.stringify(stats))
  }, [stats])

  const saveCustomDeck = (newDeck) => {
    const updated = [...customDecks, { ...newDeck, id: Date.now().toString() }]
    setCustomDecks(updated)
    localStorage.setItem('mygame_custom_decks', JSON.stringify(updated))
  }

  const deleteCustomDeck = (id) => {
    const updated = customDecks.filter(d => d.id !== id)
    setCustomDecks(updated)
    localStorage.setItem('mygame_custom_decks', JSON.stringify(updated))
  }

  const updateStats = ({ correct, streak }) => {
    setStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      totalCorrect: prev.totalCorrect + correct,
      bestStreak: Math.max(prev.bestStreak, streak),
    }))
  }

  const unlockAchievement = (id) => {
    if (!stats.unlockedAchievements.includes(id)) {
      setStats(prev => ({
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, id]
      }))
    }
  }

  return (
    <GameContext.Provider value={{
      settings, setSettings,
      allDecks, customDecks, saveCustomDeck, deleteCustomDeck,
      stats, setStats, achievements, updateStats, unlockAchievement
    }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
