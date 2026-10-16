import React, { useEffect } from 'react';
import type { ExerciseStat, GameResult } from '../types/types';
import { MASTERY_RUNS } from '../utils/exercisePicker';
import type { Progress } from '../utils/exercisePicker';
import { getLanguage } from '../data/languages';
import { formatTime } from '../utils/typing';
import { getLevelInfo, getRank } from '../utils/progress';

interface ResultScreenProps {
  result: GameResult;
  bestStreak: number;
  totalXp: number;
  exerciseStat?: ExerciseStat;
  progress?: Progress;
  onNext: () => void;
  onRetry: () => void;
  onBackToMenu: () => void;
}

const COLORS = ['#22d3ee', '#a78bfa', '#f472b6', '#a3e635', '#fbbf24'];

// Deterministic pseudo-random so rendering stays pure.
const seeded = (n: number) => {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const Confetti: React.FC = () => (
  <div aria-hidden className="pointer-events-none fixed inset-x-0 top-1/3 flex justify-center">
    {Array.from({ length: 36 }, (_, i) => {
      const angle = seeded(i + 1) * Math.PI * 2;
      const dist = 140 + seeded(i + 50) * 260;
      return (
        <span
          key={i}
          className="absolute h-2.5 w-1.5 animate-confetti rounded-sm"
          style={
            {
              background: COLORS[i % COLORS.length],
              '--dx': `${Math.cos(angle) * dist}px`,
              '--dy': `${Math.sin(angle) * dist - 80}px`,
              '--rot': `${seeded(i + 99) * 720}deg`,
              animationDelay: `${seeded(i + 7) * 150}ms`,
            } as React.CSSProperties
          }
        />
      );
    })}
  </div>
);

const Tile: React.FC<{ label: string; value: React.ReactNode; sub?: string; accent?: string; delay: number }> = ({
  label,
  value,
  sub,
  accent,
  delay,
}) => (
  <div className="glass animate-pop p-5 text-center" style={{ animationDelay: `${delay}ms` }}>
    <div className="text-[0.65rem] uppercase tracking-widest text-mist">{label}</div>
    <div className="my-1 font-mono text-5xl font-bold tabular-nums" style={{ color: accent }}>
      {value}
    </div>
    <div className="text-xs text-mist">{sub}</div>
  </div>
);

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  bestStreak,
  totalXp,
  exerciseStat,
  progress,
  onNext,
  onRetry,
  onBackToMenu,
}) => {
  const language = getLanguage(result.language);
  const rank = getRank(result.wpm);
  const lvl = getLevelInfo(totalXp);
  const leveledUp = getLevelInfo(totalXp - result.xpGained).level < lvl.level;
  const celebrate = result.isPersonalBest || result.accuracy === 100;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onNext();
      else if (e.key === 'r' || e.key === 'R') onRetry();
      else if (e.key === 'Escape') onBackToMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNext, onRetry, onBackToMenu]);

  const wpmColor = result.wpm >= 60 ? '#a3e635' : result.wpm >= 40 ? '#fbbf24' : '#fb923c';
  const accColor = result.accuracy >= 95 ? '#a3e635' : result.accuracy >= 85 ? '#fbbf24' : '#fb923c';

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      {celebrate && <Confetti />}

      <div className="mb-8 animate-fade-up text-center">
        <div className="mb-2 text-sm font-semibold uppercase tracking-widest" style={{ color: language.color }}>
          {language.name} · {result.level}
        </div>
        <h1 className="text-5xl font-bold">
          {result.isPersonalBest ? '🏆 New personal best!' : result.accuracy === 100 ? '💎 Flawless run!' : 'Run complete'}
        </h1>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold" style={{ color: rank.color, borderColor: `${rank.color}55`, background: `${rank.color}14` }}>
          Rank: {rank.title}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Tile label="Speed" value={result.wpm} sub="words / min" accent={wpmColor} delay={60} />
        <Tile label="Accuracy" value={`${result.accuracy}%`} sub={`${result.errors} error${result.errors === 1 ? '' : 's'}`} accent={accColor} delay={120} />
        <Tile label="Time" value={formatTime(Math.round(result.timeElapsed))} sub={`${result.charCount} characters`} delay={180} />
        <Tile label="Best streak" value={bestStreak} sub="clean keystrokes" accent="#fbbf24" delay={240} />
      </div>

      <div className="glass mb-8 flex animate-fade-up items-center justify-between px-6 py-4" style={{ animationDelay: '300ms' }}>
        <div>
          <div className="text-sm text-mist">XP earned</div>
          <div className="font-mono text-2xl font-bold text-neon-violet">+{result.xpGained} XP</div>
        </div>
        <div className="w-1/2">
          <div className="mb-1 flex justify-between text-xs text-mist">
            <span>{leveledUp ? '🎉 Level up!' : 'Level progress'}</span>
            <span className="font-mono font-bold text-neon-violet">LV {lvl.level}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ink-600">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet"
              style={{ width: `${(lvl.intoLevel / lvl.forNext) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {exerciseStat && (
        <div className="glass mb-8 animate-fade-up px-6 py-4 text-center text-sm" style={{ animationDelay: '330ms' }}>
          {exerciseStat.cleanRuns >= MASTERY_RUNS ? (
            <span className="font-semibold text-neon-lime">Snippet mastered! You typed it cleanly {exerciseStat.cleanRuns} times.</span>
          ) : (
            <span>
              Clean runs on this snippet: <b>{exerciseStat.cleanRuns}/{MASTERY_RUNS}</b>. Type it with 96%+ accuracy {MASTERY_RUNS - exerciseStat.cleanRuns} more time(s) to master it.
            </span>
          )}
          {progress && (
            <div className="mt-1 text-mist">
              {language.name} {result.level}: {progress.mastered}/{progress.total} snippets mastered
            </div>
          )}
        </div>
      )}

      <div className="flex animate-fade-up flex-wrap justify-center gap-3" style={{ animationDelay: '360ms' }}>
        <button onClick={onNext} className="btn-primary">
          Next snippet <span className="kbd !bg-black/20 !text-ink-950">Enter</span>
        </button>
        <button onClick={onRetry} className="btn-secondary">
          Retry <span className="kbd">R</span>
        </button>
        <button onClick={onBackToMenu} className="btn-secondary">
          Menu <span className="kbd">Esc</span>
        </button>
      </div>
    </div>
  );
};
