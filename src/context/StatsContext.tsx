import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserStats, GameResult, Settings } from '../types/types';

interface StatsContextType {
  userStats: UserStats;
  settings: Settings;
  updateStats: (result: GameResult) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  resetStats: () => void;
}

const defaultStats: UserStats = {
  totalWPM: 0,
  accuracyHistory: [],
  weakKeys: [],
  exercisesCompleted: 0,
  bestWPM: 0,
  averageAccuracy: 0,
};

const defaultSettings: Settings = {
  theme: 'dark',
  soundEffects: false,
};

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within StatsProvider');
  }
  return context;
};

interface StatsProviderProps {
  children: ReactNode;
}

export const StatsProvider: React.FC<StatsProviderProps> = ({ children }) => {
  const [userStats, setUserStats] = useState<UserStats>(defaultStats);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load stats from electron-store on mount
  useEffect(() => {
    const loadData = async () => {
      if (window.electronAPI) {
        try {
          const savedStats = await window.electronAPI.store.get('userStats');
          const savedSettings = await window.electronAPI.store.get('settings');
          
          if (savedStats) {
            setUserStats(savedStats);
          }
          if (savedSettings) {
            setSettings(savedSettings);
          }
        } catch (error) {
          console.error('Failed to load data:', error);
        }
      }
      setIsLoaded(true);
    };

    loadData();
  }, []);

  // Save stats whenever they change
  useEffect(() => {
    if (isLoaded && window.electronAPI) {
      window.electronAPI.store.set('userStats', userStats);
    }
  }, [userStats, isLoaded]);

  // Save settings whenever they change
  useEffect(() => {
    if (isLoaded && window.electronAPI) {
      window.electronAPI.store.set('settings', settings);
    }
  }, [settings, isLoaded]);

  const updateStats = (result: GameResult) => {
    setUserStats(prev => {
      const newAccuracyHistory = [...prev.accuracyHistory, result.accuracy];
      const newExercisesCompleted = prev.exercisesCompleted + 1;
      const newBestWPM = Math.max(prev.bestWPM, result.wpm);
      const newAverageAccuracy = Math.round(
        newAccuracyHistory.reduce((a, b) => a + b, 0) / newAccuracyHistory.length
      );
      const newTotalWPM = Math.round(
        ((prev.totalWPM * prev.exercisesCompleted) + result.wpm) / newExercisesCompleted
      );

      return {
        ...prev,
        totalWPM: newTotalWPM,
        accuracyHistory: newAccuracyHistory,
        exercisesCompleted: newExercisesCompleted,
        bestWPM: newBestWPM,
        averageAccuracy: newAverageAccuracy,
      };
    });
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetStats = () => {
    setUserStats(defaultStats);
  };

  return (
    <StatsContext.Provider value={{ userStats, settings, updateStats, updateSettings, resetStats }}>
      {children}
    </StatsContext.Provider>
  );
};
