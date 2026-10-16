import React, { useState } from 'react';
import type { UserStats } from '../types/types';
import { getLanguage } from '../data/languages';
import { getAchievements, getDayStreak, getLevelInfo, getRank, getWeakKeys } from '../utils/progress';
import { formatTime } from '../utils/typing';
import { Sparkline } from './Sparkline';

interface StatsScreenProps {
  stats: UserStats;
  onBack: () => void;
  onReset: () => void;
}

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <section className={`glass animate-fade-up p-5 ${className ?? ''}`}>
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-mist">{title}</h2>
    {children}
  </section>
);

export const StatsScreen: React.FC<StatsScreenProps> = ({ stats, onBack, onReset }) => {
  const [confirming, setConfirming] = useState(false);
  const rank = getRank(stats.bestWPM);
  const lvl = getLevelInfo(stats.xp);
  const achievements = getAchievements(stats);
  const unlocked = achievements.filter(a => a.unlocked).length;
  const weak = getWeakKeys(stats.keyMisses);
  const recent = stats.history.slice(-30);
  const languages = Object.entries(stats.languageRuns).sort((a, b) => b[1] - a[1]);
  const maxRuns = Math.max(1, ...languages.map(([, n]) => n));

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your stats</h1>
          <p className="text-sm text-mist">
            <span style={{ color: rank.color }} className="font-semibold">{rank.title}</span> · Level {lvl.level} · {stats.xp} XP
          </p>
        </div>
        <button onClick={onBack} className="btn-secondary">← Menu</button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ['Best WPM', stats.bestWPM],
          ['Avg WPM', stats.totalWPM],
          ['Avg accuracy', `${stats.averageAccuracy}%`],
          ['Day streak', getDayStreak(stats.history)],
        ].map(([label, value]) => (
          <div key={label} className="glass p-4 text-center">
            <div className="font-mono text-3xl font-bold tabular-nums">{value}</div>
            <div className="text-[0.65rem] uppercase tracking-widest text-mist">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Speed trend (last 30 runs)">
          <Sparkline values={recent.map(r => r.wpm)} color="#22d3ee" />
        </Card>
        <Card title="Accuracy trend">
          <Sparkline values={recent.map(r => r.accuracy)} color="#a3e635" />
        </Card>

        <Card title="Languages played">
          {languages.length === 0 ? (
            <p className="text-sm text-mist">Nothing yet. Pick a language and start typing!</p>
          ) : (
            <ul className="space-y-2">
              {languages.map(([id, count]) => {
                const l = getLanguage(id);
                return (
                  <li key={id} className="flex items-center gap-3 text-sm">
                    <span className="w-24 truncate">{l.name}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-600">
                      <div className="h-full rounded-full" style={{ width: `${(count / maxRuns) * 100}%`, background: l.color }} />
                    </div>
                    <span className="w-6 text-right font-mono text-mist">{count}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title="Keys you miss most">
          {weak.length === 0 ? (
            <p className="text-sm text-mist">No misses recorded yet. Suspiciously good!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {weak.map(([key, count]) => (
                <span key={key} className="flex items-center gap-2 rounded-lg border border-neon-red/30 bg-neon-red/10 px-3 py-1.5">
                  <span className="font-mono text-lg font-bold text-neon-red">{key}</span>
                  <span className="text-xs text-mist">×{count}</span>
                </span>
              ))}
            </div>
          )}
        </Card>

        <Card title={`Achievements (${unlocked}/${achievements.length})`} className="md:col-span-2">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {achievements.map(a => (
              <div
                key={a.id}
                title={a.description}
                className={`rounded-xl border p-3 text-center transition-opacity ${a.unlocked ? 'border-neon-amber/30 bg-neon-amber/10' : 'border-white/5 opacity-40 grayscale'}`}
              >
                <div className="text-2xl">{a.icon}</div>
                <div className="text-sm font-semibold">{a.title}</div>
                <div className="text-[0.65rem] text-mist">{a.description}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent runs" className="md:col-span-2">
          {stats.history.length === 0 ? (
            <p className="text-sm text-mist">Your runs will show up here.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-widest text-mist">
                <tr>
                  <th className="pb-2">Language</th>
                  <th className="pb-2">Level</th>
                  <th className="pb-2 text-right">WPM</th>
                  <th className="pb-2 text-right">Acc</th>
                  <th className="pb-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {stats.history.slice(-8).reverse().map(r => (
                  <tr key={r.timestamp} className="border-t border-white/5">
                    <td className="py-1.5 font-sans">{getLanguage(r.language).name}</td>
                    <td className="py-1.5 font-sans capitalize text-mist">{r.level}</td>
                    <td className="py-1.5 text-right">{r.wpm}{r.isPersonalBest ? ' 🏆' : ''}</td>
                    <td className="py-1.5 text-right">{r.accuracy}%</td>
                    <td className="py-1.5 text-right">{formatTime(Math.round(r.timeElapsed))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <div className="mt-8 text-center">
        {confirming ? (
          <span className="inline-flex items-center gap-3 text-sm">
            Erase all stats and progress?
            <button className="btn-secondary !px-4 !py-2 !text-neon-red" onClick={() => { onReset(); setConfirming(false); }}>
              Yes, erase
            </button>
            <button className="btn-ghost" onClick={() => setConfirming(false)}>Cancel</button>
          </span>
        ) : (
          <button className="btn-ghost text-sm" onClick={() => setConfirming(true)}>Reset all stats</button>
        )}
      </div>
    </div>
  );
};
