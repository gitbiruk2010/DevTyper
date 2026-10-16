import { createContext } from 'react';
import type { GameResult, Settings, UserStats } from '../types/types';

export type NewResult = Omit<GameResult, 'timestamp' | 'xpGained' | 'isPersonalBest'>;

export interface StatsContextType {
  userStats: UserStats;
  settings: Settings;
  isLoaded: boolean;
  recordResult: (result: NewResult, missedKeys: Record<string, number>) => GameResult;
  updateSettings: (settings: Partial<Settings>) => void;
  resetStats: () => void;
}

export const defaultStats: UserStats = {
  totalWPM: 0,
  accuracyHistory: [],
  weakKeys: [],
  exercisesCompleted: 0,
  bestWPM: 0,
  averageAccuracy: 0,
  xp: 0,
  history: [],
  keyMisses: {},
  languageRuns: {},
  exerciseStats: {},
};

export const defaultSettings: Settings = {
  theme: 'dark',
  soundEffects: false,
  lastLanguage: 'any',
  lastLevel: 'beginner',
  mode: 'explore',
};

export const StatsContext = createContext<StatsContextType | undefined>(undefined);
