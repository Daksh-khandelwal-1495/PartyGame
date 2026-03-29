import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Timer from '../components/Timer';
import { useTilt } from '../hooks/useTilt';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { useGame } from '../context/GameContext';
import { CheckCircle, XCircle } from 'lucide-react';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const STATES = { READY: 'ready', PLAYING: 'playing', FLASH: 'flash', ROUNDOVER: 'roundover', DONE: 'done' };

export default function GamePlay() {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, updateStats, unlockAchievement } = useGame();

  const { deck, players } = location.state || {};
  if (!deck) { navigate('/'); return null; }

  const [words] = useState(() => shuffle(deck.words));
  const [wordIdx, setWordIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [roundResults, setRoundResults] = useState([]);
  const [flash, setFlash] = useState(null); // 'correct' | 'skip'
  const [gameState, setGameState] = useState(STATES.READY);
  const [permissionError, setPermissionError] = useState('');
  const [scores, setScores] = useState(() => Object.fromEntries(players.map(p => [p, 0])));
  const streakRef = useRef(0);

  const handleEnd = useCallback(() => {
    setGameState(STATES.ROUNDOVER);
  }, []);

  const { timeLeft, start } = useTimer(settings.timerDuration, undefined, handleEnd);

  const triggerFlash = useCallback((type) => {
    setFlash(type);
    setTimeout(() => setFlash(null), 600);
  }, []);

  const handleCorrect = useCallback(() => {
    if (gameState !== STATES.PLAYING) return;
    triggerFlash('correct');
    const newStreak = streakRef.current + 1;
    streakRef.current = newStreak;
    setBestStreak(prev => Math.max(prev, newStreak));
    setCorrect(c => c + 1);
    setScores(prev => ({ ...prev, [players[playerIdx]]: (prev[players[playerIdx]] || 0) + 1 }));
    setRoundResults(prev => [...prev, { word: words[wordIdx], result: 'correct' }]);
    if (wordIdx < words.length - 1) setWordIdx(i => i + 1);
    else handleEnd();
  }, [gameState, wordIdx, words, playerIdx, players, handleEnd, triggerFlash]);

  const handleSkip = useCallback(() => {
    if (gameState !== STATES.PLAYING) return;
    triggerFlash('skip');
    streakRef.current = 0;
    setSkipped(s => s + 1);
    setRoundResults(prev => [...prev, { word: words[wordIdx], result: 'skip' }]);
    if (wordIdx < words.length - 1) setWordIdx(i => i + 1);
    else handleEnd();
  }, [gameState, wordIdx, words, handleEnd, triggerFlash]);

  const { requestPermission } = useTilt(
    handleCorrect,
    handleSkip,
    gameState === STATES.PLAYING
  );

  useWakeLock(gameState === STATES.PLAYING);

  const startRound = useCallback(async () => {
    const granted = await requestPermission();
    if (!granted) {
      setPermissionError('Motion access is blocked. Enable Motion & Orientation access in browser/site settings to use tilt controls.');
      return;
    }

    setPermissionError('');
    setGameState(STATES.PLAYING);
    start();
  }, [requestPermission, start]);

  const nextRound = useCallback(() => {
    if (round >= settings.rounds) {
      // Game over
      updateStats({ correct, streak: bestStreak });
      if (correct > 0) unlockAchievement('first_win');
      if (bestStreak >= 3) unlockAchievement('streak_3');
      if (players.length >= 3) unlockAchievement('social');
      navigate('/results', { state: { scores, players, deck, correct, skipped, rounds: round } });
    } else {
      setRound(r => r + 1);
      setPlayerIdx(i => (i + 1) % players.length);
      setRoundResults([]);
      setWordIdx(idx => Math.min(idx + 1, words.length - 1));
      setGameState(STATES.READY);
    }
  }, [round, settings.rounds, correct, skipped, bestStreak, scores, players, deck, navigate, updateStats, unlockAchievement, words.length]);

  const cardClass = flash === 'correct' ? 'word-card correct' : flash === 'skip' ? 'word-card skip' : 'word-card neutral';

  if (gameState === STATES.READY) {
    return (
      <div className="page" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 24 }}>
        <div style={{ fontSize: '3rem' }}>{deck.emoji}</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Round {round} of {settings.rounds}</h2>
        <div style={{ color: 'var(--text-sub)' }}>
          <strong style={{ color: 'var(--primary-light)' }}>{players[playerIdx]}</strong>'s turn
        </div>
        <div style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>Hold your phone to your forehead and tilt to answer</div>
        {permissionError && (
          <div className="card" style={{ padding: 12, color: 'var(--warning)', borderColor: 'rgba(255,211,42,0.5)', background: 'rgba(255,211,42,0.08)' }}>
            {permissionError}
          </div>
        )}
        <div className="tilt-hints">
          <div className="tilt-hint"><span>✅</span>Tilt forward = Correct</div>
          <div className="tilt-hint"><span>❌</span>Tilt back = Skip</div>
        </div>
        <button className="btn btn-primary btn-lg w-full" onClick={startRound}>
          Ready! Start Round
        </button>
      </div>
    );
  }

  if (gameState === STATES.ROUNDOVER) {
    const roundCorrect = roundResults.filter(r => r.result === 'correct').length;
    return (
      <div className="page fade-in" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 20 }}>
        <div style={{ fontSize: '3rem' }}>🎯</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Round {round} Over!</h2>
        <div style={{ color: 'var(--text-sub)' }}>{players[playerIdx]}'s results:</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
          <div className="card" style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--success)' }}>{roundCorrect}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: 4 }}>Correct</div>
          </div>
          <div className="card" style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--danger)' }}>{roundResults.length - roundCorrect}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: 4 }}>Skipped</div>
          </div>
        </div>
        <div style={{ width: '100%', maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {roundResults.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', border: '1px solid var(--border)' }}>
              <span>{r.result === 'correct' ? '✅' : '❌'}</span>
              <span style={{ flex: 1, textAlign: 'left', fontWeight: 600 }}>{r.word}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-lg w-full" onClick={nextRound}>
          {round >= settings.rounds ? '🏆 See Final Results' : `Next Round →`}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', padding: '16px', maxWidth: 480, margin: '0 auto', gap: 16 }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Round {round}/{settings.rounds}</div>
          <div style={{ fontWeight: 700 }}>{players[playerIdx]}</div>
        </div>
        <Timer timeLeft={timeLeft} total={settings.timerDuration} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Score</div>
          <div style={{ fontWeight: 700 }}>{scores[players[playerIdx]] || 0}</div>
        </div>
      </div>

      {/* Word card */}
      <div className={cardClass} style={{ flex: 1, border: '2px solid var(--border)', position: 'relative' }}>
        <div className="word-deck-label">{deck.name}</div>
        <div className="word-text">{words[wordIdx]}</div>
        {flash && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', animation: 'fadeIn 0.2s ease', borderRadius: 'inherit' }}>
            {flash === 'correct' ? '✅' : '❌'}
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 16, right: 16, color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
          {wordIdx + 1} / {words.length}
        </div>
      </div>

      {/* Action buttons */}
      <div className="action-btns">
        <button className="action-btn action-btn-skip" onClick={handleSkip}>
          <XCircle size={28} />
          <span>Skip</span>
        </button>
        <button className="action-btn action-btn-correct" onClick={handleCorrect}>
          <CheckCircle size={28} />
          <span>Correct</span>
        </button>
      </div>

      {/* Streak */}
      {streakRef.current >= 2 && (
        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--warning)', fontWeight: 700 }}>
          🔥 {streakRef.current} streak!
        </div>
      )}
    </div>
  );
}
