import { useGame } from '../context/GameContext';

export default function Achievements() {
  const { achievements, stats } = useGame();
  const unlocked = achievements.filter(a => a.unlocked).length;

  return (
    <div className="page fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Achievements</h1>
        <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>
          {unlocked} / {achievements.length} unlocked
        </p>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-sub)' }}>
          <span>Overall progress</span>
          <span>{Math.round((unlocked / achievements.length) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(unlocked / achievements.length) * 100}%` }} />
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Games', val: stats.gamesPlayed },
          { label: 'Correct', val: stats.totalCorrect },
          { label: 'Best Streak', val: stats.bestStreak },
        ].map(({ label, val }) => (
          <div key={label} className="card" style={{ padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{val}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Achievement list */}
      <div className="section-title">Badges</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {achievements.map(a => (
          <div key={a.id} className={`ach-card${a.unlocked ? ' unlocked' : ''}`}>
            <div className="ach-icon">{a.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                {a.name}
                {a.unlocked && <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>Unlocked</span>}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginTop: 2 }}>{a.desc}</div>
            </div>
            {!a.unlocked && <span style={{ fontSize: '1.2rem', filter: 'grayscale(1) opacity(0.3)' }}>🔒</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
