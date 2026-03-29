import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Decks from './pages/Decks';
import DeckDetail from './pages/DeckDetail';
import GamePlay from './pages/GamePlay';
import Results from './pages/Results';
import CreateDeck from './pages/CreateDeck';
import Settings from './pages/Settings';
import Achievements from './pages/Achievements';

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          {/* Fullscreen routes (no navbar) */}
          <Route path="/play" element={<GamePlay />} />
          <Route path="/results" element={<Results />} />

          {/* App shell routes (with navbar) */}
          <Route path="/*" element={<AppShell />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

function AppShell() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/decks" element={<Decks />} />
        <Route path="/deck/:id" element={<DeckDetail />} />
        <Route path="/create" element={<CreateDeck />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/achievements" element={<Achievements />} />
      </Routes>
      <Navbar />
    </>
  );
}
