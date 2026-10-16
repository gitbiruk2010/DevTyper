import type { GameResult, Level, UserStats } from '../types/types';

export interface Rank {
  title: string;
  min: number;
  color: string;
}

export const RANKS: Rank[] = [
  { title: 'Hello World', min: 0, color: '#94a3b8' },
  { title: 'Script Kiddie', min: 20, color: '#a3e635' },
  { title: 'Junior Dev', min: 30, color: '#34d399' },
  { title: 'Mid-level Dev', min: 45, color: '#22d3ee' },
  { title: 'Senior Dev', min: 60, color: '#60a5fa' },
  { title: 'Staff Engineer', min: 75, color: '#a78bfa' },
  { title: 'Principal Typist', min: 90, color: '#f472b6' },
  { title: '10x Typist', min: 110, color: '#fbbf24' },
];

export const getRank = (wpm: number): Rank =>
  [...RANKS].reverse().find(r => wpm >= r.min) ?? RANKS[0];

const LEVEL_MULTIPLIER: Record<Level, number> = { beginner: 1, intermediate: 1.5, advanced: 2 };

export const calculateXp = (charCount: number, accuracy: number, level: Level): number =>
  Math.round(charCount * (accuracy / 100) ** 2 * LEVEL_MULTIPLIER[level]);

export interface LevelInfo {
  level: number;
  intoLevel: number;
  forNext: number;
}

// Reaching level n+1 needs 40 * n^2 total XP, so levels get slower as you grow.
export function getLevelInfo(xp: number): LevelInfo {
  let level = 1;
  while (xp >= 40 * level * level) level++;
  const floor = 40 * (level - 1) * (level - 1);
  return { level, intoLevel: xp - floor, forNext: 40 * level * level - floor };
}

export function getDayStreak(history: GameResult[]): number {
  if (history.length === 0) return 0;
  const days = new Set(history.map(r => new Date(r.timestamp).toDateString()));
  const cursor = new Date();
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export function getAchievements(stats: UserStats): Achievement[] {
  const h = stats.history;
  const languages = Object.keys(stats.languageRuns).length;
  const defs: [string, string, string, string, boolean][] = [
    ['first', '🚀', 'First Commit', 'Finish your first exercise', stats.exercisesCompleted >= 1],
    ['ten', '🔟', 'Ten Down', 'Finish 10 exercises', stats.exercisesCompleted >= 10],
    ['fifty', '🏗️', 'Build Server', 'Finish 50 exercises', stats.exercisesCompleted >= 50],
    ['wpm40', '⚡', 'Getting Warm', 'Reach 40 WPM', stats.bestWPM >= 40],
    ['wpm60', '🔥', 'On Fire', 'Reach 60 WPM', stats.bestWPM >= 60],
    ['wpm80', '🚄', 'Bullet Train', 'Reach 80 WPM', stats.bestWPM >= 80],
    ['perfect', '💎', 'Zero Bugs', 'Finish with 100% accuracy', h.some(r => r.accuracy === 100)],
    ['poly', '🌍', 'Polyglot', 'Practice 5 different languages', languages >= 5],
    ['streak3', '📅', 'Habit Forming', 'Practice 3 days in a row', getDayStreak(h) >= 3],
    ['advanced', '🧠', 'Big Brain', 'Advanced exercise with 95%+ accuracy', h.some(r => r.level === 'advanced' && r.accuracy >= 95)],
  ];
  return defs.map(([id, icon, title, description, unlocked]) => ({ id, icon, title, description, unlocked }));
}

export const getWeakKeys = (keyMisses: Record<string, number>, count = 6): [string, number][] =>
  Object.entries(keyMisses)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count);
