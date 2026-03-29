import React from 'react'
import { Link } from 'react-router-dom'
import { Play, TrendingUp, Award, Settings, Layers, Mic } from 'lucide-react'
import { useGame } from '../context/GameContext'

function Home() {
  const { stats, allDecks } = useGame()
  const featured = allDecks.slice(0, 3)

  return (
    <div className="page fade-in">
      <div className="flex-col items-center text-center gap-2" style={{ marginBottom: '40px' }}>
        <h1 className="hero-logo">MyGame</h1>
        <p className="text-sub" style={{ fontWeight: 500 }}>The ultimate free party charades game 🎊</p>
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: '32px' }}>
        <div className="flex justify-between items-center">
          <div className="flex-col">
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Lifetime Stats</span>
            <div className="flex gap-4" style={{ marginTop: '12px' }}>
              <div className="flex-col">
                <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>{stats.gamesPlayed}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-sub)', fontWeight: 600 }}>GAMES</span>
              </div>
              <div className="flex-col">
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--success)' }}>{stats.totalCorrect}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-sub)', fontWeight: 600 }}>CORRECT</span>
              </div>
              <div className="flex-col">
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-light)' }}>{stats.bestStreak}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-sub)', fontWeight: 600 }}>BEST STREAK</span>
              </div>
            </div>
          </div>
          <Link to="/achievements">
            <Award className="nav-icon" style={{ color: 'var(--warning)', width: '32px', height: '32px' }} />
          </Link>
        </div>
      </div>

      <Link to="/decks" className="btn btn-primary btn-lg w-full" style={{ marginBottom: '40px' }}>
        <Play fill="white" size={24} />
        Play Now
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Featured Decks</h2>
        <Link to="/decks" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-light)' }}>See All</Link>
      </div>

      <div className="flex-col gap-2">
        {featured.map(deck => (
          <Link key={deck.id} to={`/deck/${deck.id}`} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '1.5rem', background: 'var(--bg-3)', padding: '10px', borderRadius: '12px' }}>{deck.emoji}</div>
            <div className="flex-col">
              <span style={{ fontWeight: 800 }}>{deck.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{deck.words.length} words</span>
            </div>
          </Link>
        ))}
      </div>

      <nav className="navbar">
        <Link to="/" className="nav-item active"><Layers className="nav-icon" /><span>Home</span></Link>
        <Link to="/decks" className="nav-item"><Layers className="nav-icon" /><span>Decks</span></Link>
        <Link to="/create" className="nav-item"><Mic className="nav-icon" /><span>Create</span></Link>
        <Link to="/achievements" className="nav-item"><Award className="nav-icon" /><span>Awards</span></Link>
        <Link to="/settings" className="nav-item"><Settings className="nav-icon" /><span>Settings</span></Link>
      </nav>
    </div>
  )
}

export default Home
