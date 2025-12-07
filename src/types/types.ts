export interface Exercise {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  focus: string;
  text: string;
  source_language: string;
  difficulty_score: number;
}

export interface UserStats {
  totalWPM: number;
  accuracyHistory: number[];
  weakKeys: string[];
  exercisesCompleted: number;
  bestWPM: number;
  averageAccuracy: number;
}

export interface GameResult {
  wpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
  exerciseId: string;
  timestamp: number;
}

export interface Settings {
  theme: 'dark' | 'light';
  soundEffects: boolean;
}

export type GameStatus = 'idle' | 'running' | 'finished';

export type Screen = 'menu' | 'game' | 'result';
