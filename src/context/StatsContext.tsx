import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { GameResult, Settings, UserStats } from '../types/types';
import { calculateXp, getWeakKeys } from '../utils/progress';
import { updateExerciseStat } from '../utils/exercisePicker';
import { StatsContext, defaultSettings, defaultStats } from './statsStore';
import type { NewResult } from './statsStore';

const HISTORY_LIMIT = 200;

export const StatsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userStats, setUserStats] = useState<UserStats>(defaultStats);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from electron-store on mount. Older saves lack the newer fields, so merge over defaults.
  useEffect(() => {
    const loadData = async () => {
      if (window.electronAPI) {
        try {
          const savedStats = await window.electronAPI.store.get<Partial<UserStats>>('userStats');
          const savedSettings = await window.electronAPI.store.get<Partial<Settings>>('settings');
          if (savedStats) {
            const merged = { ...defaultStats, ...savedStats };
            // Older saves have no per-snippet stats: rebuild them from the run history.
            if (Object.keys(merged.exerciseStats).length === 0 && merged.history.length > 0) {
              for (const run of merged.history) {
                merged.exerciseStats[run.exerciseId] = updateExerciseStat(
                  merged.exerciseStats[run.exerciseId], run.wpm, run.accuracy, run.timestamp,
                );
              }
            }
            setUserStats(merged);
          }
          if (savedSettings) setSettings({ ...defaultSettings, ...savedSettings });
        } catch (error) {
          console.error('Failed to load data:', error);
        }
      }
      setIsLoaded(true);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded && window.electronAPI) {
      window.electronAPI.store.set('userStats', userStats);
    }
  }, [userStats, isLoaded]);

  useEffect(() => {
    if (isLoaded && window.electronAPI) {
      window.electronAPI.store.set('settings', settings);
    }
  }, [settings, isLoaded]);

  const recordResult = (input: NewResult, missedKeys: Record<string, number>): GameResult => {
    const prev = userStats;
    const result: GameResult = {
      ...input,
      timestamp: Date.now(),
      xpGained: calculateXp(input.charCount, input.accuracy, input.level),
      isPersonalBest: input.wpm > prev.bestWPM && prev.exercisesCompleted > 0,
    };

    const keyMisses = { ...prev.keyMisses };
    for (const [key, count] of Object.entries(missedKeys)) {
      keyMisses[key] = (keyMisses[key] ?? 0) + count;
    }
    const accuracyHistory = [...prev.accuracyHistory, result.accuracy];
    const exercisesCompleted = prev.exercisesCompleted + 1;

    setUserStats({
      ...prev,
      totalWPM: Math.round((prev.totalWPM * prev.exercisesCompleted + result.wpm) / exercisesCompleted),
      accuracyHistory,
      exercisesCompleted,
      bestWPM: Math.max(prev.bestWPM, result.wpm),
      averageAccuracy: Math.round(accuracyHistory.reduce((a, b) => a + b, 0) / accuracyHistory.length),
      xp: prev.xp + result.xpGained,
      history: [...prev.history, result].slice(-HISTORY_LIMIT),
      keyMisses,
      weakKeys: getWeakKeys(keyMisses).map(([key]) => key),
      exerciseStats: {
        ...prev.exerciseStats,
        [result.exerciseId]: updateExerciseStat(prev.exerciseStats[result.exerciseId], result.wpm, result.accuracy, result.timestamp),
      },
      languageRuns: {
        ...prev.languageRuns,
        [result.language]: (prev.languageRuns[result.language] ?? 0) + 1,
      },
    });
    return result;
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetStats = () => setUserStats(defaultStats);

  return (
    <StatsContext.Provider value={{ userStats, settings, isLoaded, recordResult, updateSettings, resetStats }}>
      {children}
    </StatsContext.Provider>
  );
};
