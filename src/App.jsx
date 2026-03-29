import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import Home from './pages/Home'
import Decks from './pages/Decks'
import DeckDetail from './pages/DeckDetail'
import GamePlay from './pages/GamePlay'
import Results from './pages/Results'
import CreateDeck from './pages/CreateDeck'
import Achievements from './pages/Achievements'
import Settings from './pages/Settings'

function App() {
  return (
    <Router>
      <GameProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decks" element={<Decks />} />
          <Route path="/deck/:id" element={<DeckDetail />} />
          <Route path="/play" element={<GamePlay />} />
          <Route path="/results" element={<Results />} />
          <Route path="/create" element={<CreateDeck />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </GameProvider>
    </Router>
  )
}

export default App
