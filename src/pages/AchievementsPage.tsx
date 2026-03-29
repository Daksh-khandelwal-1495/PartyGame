import type { Achievement, Stats } from '../types';
import { Lock } from 'lucide-react';

interface Props {
  achievements: Achievement[];
  stats: Stats;
}

export default function AchievementsPage({ achievements, stats }: Props) {
  const unlocked = achievements.filter(a => a.unlocked).length;

  return (
    <div className="page fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Achievements</h1>
        <p style={{ color: 'var(--text-sub)', marginTop: 4, fontSize: '.9rem' }}>
          {unlocked}/{achievements.length} unlocked
        </p>
        {/* Progress */}
        <div className="progress-bar" style={{ marginTop: 12 }}>
          <div className="progress-fill" style={{ width: `${(unlocked / achievements.length) * 100}%` }} />
        </div>
      </div>

      {/* Stats summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Games Played',  value: stats.gamesPlayed },
          { label: 'Total Correct', value: stats.totalCorrect },
          { label: 'Best Streak',   value: stats.bestStreak },
          { label: 'Custom Decks',  value: stats.customDecksCreated },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-light)' }}>{s.value}</div>
            <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Achievement list */}
      <div className="flex-col gap-2">
        {achievements.map(a => (
          <div key={a.id} className={`ach-card ${a.unlocked ? 'unlocked' : ''}`}>
            <div className="ach-icon">{a.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '.95rem' }}>{a.title}</div>
              <div style={{ fontSize: '.80rem', color: 'var(--text-sub)', marginTop: 2 }}>{a.desc}</div>
            </div>
            {a.unlocked
              ? <span className="badge badge-success">Unlocked</span>
              : <Lock size={16} color="var(--text-muted)" />
            }
          </div>
        ))}
      </div>
    </div>
  );
}
