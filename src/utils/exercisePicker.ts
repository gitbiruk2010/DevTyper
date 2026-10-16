import type { Exercise, ExerciseStat, Level, PracticeMode, UserStats } from '../types/types';

/** A snippet counts as mastered after this many clean runs. */
export const MASTERY_RUNS = 2;
export const CLEAN_ACCURACY = 96;

export const isMastered = (stat?: ExerciseStat) => (stat?.cleanRuns ?? 0) >= MASTERY_RUNS;

export const updateExerciseStat = (
  prev: ExerciseStat | undefined,
  wpm: number,
  accuracy: number,
  now: number,
): ExerciseStat => ({
  plays: (prev?.plays ?? 0) + 1,
  bestWpm: Math.max(prev?.bestWpm ?? 0, wpm),
  bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
  cleanRuns: (prev?.cleanRuns ?? 0) + (accuracy >= CLEAN_ACCURACY ? 1 : 0),
  lastPlayed: now,
});

export interface Progress {
  total: number;
  played: number;
  mastered: number;
}

export function getProgress(pool: Exercise[], stats: UserStats['exerciseStats']): Progress {
  let played = 0;
  let mastered = 0;
  for (const ex of pool) {
    const s = stats[ex.id];
    if (s) played++;
    if (isMastered(s)) mastered++;
  }
  return { total: pool.length, played, mastered };
}

const pickRandom = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

/**
 * Explore: unseen snippets first, then whichever you played longest ago. Never repeats back-to-back.
 * Memorize: snippets you've played but not mastered yet (weakest accuracy first), then new ones.
 */
export function pickExercise(
  exercises: Exercise[],
  language: string,
  level: Level,
  mode: PracticeMode,
  stats: UserStats['exerciseStats'],
  avoidId?: string,
): Exercise | null {
  const pool = exercises.filter(e => e.level === level && (language === 'any' || e.source_language === language));
  if (pool.length === 0) return null;
  const candidates = pool.filter(e => e.id !== avoidId);
  const options = candidates.length > 0 ? candidates : pool;

  const unseen = options.filter(e => !stats[e.id]);
  const learning = options.filter(e => stats[e.id] && !isMastered(stats[e.id]));

  if (mode === 'memorize') {
    if (learning.length > 0) {
      const worst = Math.min(...learning.map(e => stats[e.id].bestAccuracy));
      return pickRandom(learning.filter(e => stats[e.id].bestAccuracy === worst));
    }
    if (unseen.length > 0) return pickRandom(unseen);
  } else if (unseen.length > 0) {
    return pickRandom(unseen);
  }

  const oldest = Math.min(...options.map(e => stats[e.id]?.lastPlayed ?? 0));
  return pickRandom(options.filter(e => (stats[e.id]?.lastPlayed ?? 0) === oldest));
}
