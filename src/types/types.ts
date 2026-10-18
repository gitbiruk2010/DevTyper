export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  level: Level;
  focus: string;
  text: string;
  source_language: string;
  difficulty_score: number;
}

export interface GameResult {
  wpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
  exerciseId: string;
  timestamp: number;
  language: string;
  level: Level;
  charCount: number;
  xpGained: number;
  isPersonalBest: boolean;
}

export interface ExerciseStat {
  plays: number;
  bestWpm: number;
  bestAccuracy: number;
  cleanRuns: number;
  lastPlayed: number;
}

export type PracticeMode = 'explore' | 'memorize';

export interface UserStats {
  totalWPM: number;
  accuracyHistory: number[];
  weakKeys: string[];
  exercisesCompleted: number;
  bestWPM: number;
  averageAccuracy: number;
  xp: number;
  history: GameResult[];
  keyMisses: Record<string, number>;
  languageRuns: Record<string, number>;
  exerciseStats: Record<string, ExerciseStat>;
}

export interface Settings {
  theme: 'dark' | 'light';
  soundEffects: boolean;
  lastLanguage: string;
  lastLevel: Level;
  mode: PracticeMode;
}

export type GameStatus = 'idle' | 'running' | 'finished';

export type Screen = 'menu' | 'game' | 'result' | 'stats' | 'help';
