import React, { useEffect, useRef, useState } from 'react';
import type { Level, PracticeMode, UserStats } from '../types/types';
import type { Progress } from '../utils/exercisePicker';
import { LANGUAGES, getLanguage } from '../data/languages';
import { cn } from '../utils/cn';
import logo from '../assets/logo.png';
import { getDayStreak, getLevelInfo, getRank } from '../utils/progress';

interface MenuScreenProps {
  stats: UserStats;
  language: string; // 'any' or a language id
  level: Level;
  counts: Record<string, Record<Level, number>>;
  progress: Record<string, Progress>;
  mode: PracticeMode;
  onModeChange: (mode: PracticeMode) => void;
  onLanguageChange: (language: string) => void;
  onLevelChange: (level: Level) => void;
  onStart: () => void;
  onOpenStats: () => void;
  onOpenHelp: () => void;
}

const LEVELS: { id: Level; label: string; bars: number; hint: string }[] = [
  { id: 'beginner', label: 'Beginner', bars: 1, hint: 'Short and sweet' },
  { id: 'intermediate', label: 'Intermediate', bars: 2, hint: 'Real snippets' },
  { id: 'advanced', label: 'Advanced', bars: 3, hint: 'Symbol storm' },
];

const MODES: { id: PracticeMode; label: string; hint: string }[] = [
  { id: 'explore', label: 'Explore', hint: 'New snippets first, then the ones you played longest ago' },
  { id: 'memorize', label: 'Memorize', hint: 'Repeat the snippets you have not mastered yet, weakest first' },
];

const MiniStat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="px-5 py-3 text-center">
    <div className="font-mono text-xl font-bold tabular-nums">{value}</div>
    <div className="text-[0.65rem] uppercase tracking-widest text-mist">{label}</div>
  </div>
);

const StartPill: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <button
    onClick={onStart}
    aria-label="Start typing"
    className="absolute right-3 top-3 z-10 animate-pop rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet px-3.5 py-1.5 text-sm font-bold text-ink-950 shadow-lg shadow-neon-cyan/30 transition-transform hover:scale-105 active:scale-95"
  >
    ▶ Start
  </button>
);

export const MenuScreen: React.FC<MenuScreenProps> = ({
  stats,
  language,
  level,
  counts,
  progress,
  mode,
  onModeChange,
  onLanguageChange,
  onLevelChange,
  onStart,
  onOpenStats,
  onOpenHelp,
}) => {
  const [query, setQuery] = useState('');
  const startRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    startRef.current?.focus({ preventScroll: true });
  }, []);

  const rank = getRank(stats.bestWPM);
  const lvl = getLevelInfo(stats.xp);
  const streak = getDayStreak(stats.history);

  const known = LANGUAGES.map(l => l.id);
  const ids = [...known, ...Object.keys(counts).filter(id => !known.includes(id))];
  const q = query.trim().toLowerCase();
  const available = ids
    .filter(id => (counts[id]?.[level] ?? 0) > 0)
    .map(getLanguage)
    .filter(l => !q || l.name.toLowerCase().includes(q) || l.blurb.toLowerCase().includes(q));
  const mixedCount = Object.values(counts).reduce((sum, c) => sum + c[level], 0);
  const selectedMeta = language === 'any' ? null : getLanguage(language);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="mb-10 animate-fade-up text-center">
        <img
          src={logo}
          alt="DevTyper logo"
          className="mx-auto mb-4 h-28 w-28 animate-float object-contain drop-shadow-[0_10px_30px_rgba(56,189,248,0.35)]"
        />
        <h1 className="bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink bg-clip-text text-6xl font-bold tracking-tight text-transparent">
          DevTyper
        </h1>
        <p className="mt-3 text-lg text-mist">Type real code. Beat your ghost. Level up your fingers.</p>
      </header>

      <section
        className="glass mb-8 flex animate-fade-up flex-wrap items-center justify-between gap-4 px-6 py-4"
        style={{ animationDelay: '60ms' }}
      >
        <div className="min-w-[14rem] flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-md bg-neon-violet/15 px-2 py-0.5 font-mono text-xs font-bold text-neon-violet">
              LV {lvl.level}
            </span>
            <span className="text-sm font-semibold" style={{ color: rank.color }}>
              {rank.title}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ink-600">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet transition-[width] duration-500"
              style={{ width: `${(lvl.intoLevel / lvl.forNext) * 100}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-mist">
            {lvl.intoLevel} / {lvl.forNext} XP to next level
          </div>
        </div>
        <div className="flex divide-x divide-white/[0.06]">
          <MiniStat label="Best WPM" value={stats.bestWPM} />
          <MiniStat label="Avg Acc" value={`${stats.averageAccuracy}%`} />
          <MiniStat label="Day streak" value={streak} />
        </div>
        <div className="flex gap-2">
          <button onClick={onOpenStats} className="btn-secondary">
            📊 Stats
          </button>
          <button onClick={onOpenHelp} className="btn-secondary">
            ❓ Help
          </button>
        </div>
      </section>

      <section className="mb-8 animate-fade-up" style={{ animationDelay: '120ms' }}>
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-mist">1 · Pick a language</h2>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${Object.keys(counts).length} languages...`}
            aria-label="Search languages"
            className="w-56 rounded-xl border border-white/10 bg-ink-800 px-3 py-1.5 text-sm text-snow placeholder:text-mist focus:border-neon-cyan/60 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <div className="relative">
          {language === 'any' && <StartPill onStart={onStart} />}
          <button
            onClick={() => onLanguageChange('any')}
            className={cn(
              'h-full w-full rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5',
              language === 'any'
                ? 'border-neon-cyan/60 bg-neon-cyan/10 shadow-lg shadow-neon-cyan/10'
                : 'glass hover:border-white/20',
            )}
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan to-neon-pink text-lg">
              🎲
            </div>
            <div className="font-semibold">Mix it up</div>
            <div className="text-xs text-mist">{mixedCount} snippets, all languages</div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink-600">
              <div className="h-full rounded-full bg-neon-cyan" style={{ width: `${(progress.any.mastered / progress.any.total) * 100}%` }} />
            </div>
            <div className="mt-1 text-[0.65rem] text-mist">{progress.any.mastered}/{progress.any.total} mastered</div>
          </button>
          </div>
          {available.length === 0 && (
            <p className="col-span-full py-6 text-center text-sm text-mist">No language matches that search.</p>
          )}
          {available.map(l => {
            const selected = language === l.id;
            return (
              <div key={l.id} className="relative">
              {selected && <StartPill onStart={onStart} />}
              <button
                onClick={() => onLanguageChange(l.id)}
                className={cn(
                  'h-full w-full rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5',
                  !selected && 'glass hover:border-white/20',
                )}
                style={
                  selected
                    ? {
                        borderColor: `${l.color}99`,
                        background: `${l.color}18`,
                        boxShadow: `0 10px 30px -12px ${l.color}66`,
                      }
                    : undefined
                }
              >
                <div
                  className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl font-mono text-sm font-bold text-ink-950"
                  style={{ background: l.color }}
                >
                  {l.glyph}
                </div>
                <div className="font-semibold">{l.name}</div>
                <div className="truncate text-xs text-mist">{l.blurb}</div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink-600">
                  <div className="h-full rounded-full" style={{ width: `${(progress[l.id].mastered / progress[l.id].total) * 100}%`, background: l.color }} />
                </div>
                <div className="mt-1 text-[0.65rem] text-mist">
                  {progress[l.id].mastered}/{progress[l.id].total} mastered · {progress[l.id].played} played
                </div>
              </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-10 animate-fade-up" style={{ animationDelay: '180ms' }}>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-mist">2 · Choose difficulty</h2>
        <div className="grid grid-cols-3 gap-3">
          {LEVELS.map(l => (
            <button
              key={l.id}
              onClick={() => onLevelChange(l.id)}
              className={cn(
                'rounded-2xl border px-4 py-3 text-center transition-all',
                level === l.id ? 'border-neon-violet/60 bg-neon-violet/15' : 'glass hover:border-white/20',
              )}
            >
              <div className="mb-1.5 flex justify-center gap-1" aria-hidden>
                {[1, 2, 3].map(n => (
                  <span key={n} className={cn('h-1.5 w-6 rounded-full', n <= l.bars ? 'bg-neon-violet' : 'bg-ink-600')} />
                ))}
              </div>
              <div className="font-semibold">{l.label}</div>
              <div className="text-xs text-mist">{l.hint}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10 animate-fade-up" style={{ animationDelay: '210ms' }}>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-mist">3 · Practice mode</h2>
        <div className="grid grid-cols-2 gap-3">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={cn(
                'rounded-2xl border px-4 py-3 text-left transition-all',
                mode === m.id ? 'border-neon-cyan/60 bg-neon-cyan/10' : 'glass hover:border-white/20',
              )}
            >
              <div className="font-semibold">{m.label}</div>
              <div className="text-xs text-mist">{m.hint}</div>
            </button>
          ))}
        </div>
      </section>

      <div className="animate-fade-up text-center" style={{ animationDelay: '240ms' }}>
        <button ref={startRef} onClick={onStart} className="btn-primary px-12 py-4 text-lg">
          ▶ Start typing{selectedMeta ? ` ${selectedMeta.name}` : ''}
        </button>
        <p className="mt-4 text-sm text-mist">
          Press <span className="kbd">Enter</span> to start · <span className="kbd">Esc</span> restarts a run
        </p>
      </div>
    </div>
  );
};
