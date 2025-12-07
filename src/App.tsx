import React, { useState } from 'react';
import { MenuScreen } from './components/MenuScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { StatsProvider, useStats } from './context/StatsContext';
import type { Exercise, GameResult, Screen } from './types/types';
import exercisesData from './data/exercises.json';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const { updateStats } = useStats();

  const selectRandomExercise = (level: Exercise['level']): Exercise => {
    const filtered = exercisesData.filter(ex => ex.level === level);
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex] as Exercise;
  };

  const handleStartGame = (level: Exercise['level']) => {
    const exercise = selectRandomExercise(level);
    setCurrentExercise(exercise);
    setCurrentScreen('game');
  };

  const handleGameComplete = (wpm: number, accuracy: number, errors: number, timeElapsed: number) => {
    if (!currentExercise) return;

    const result: GameResult = {
      wpm,
      accuracy,
      errors,
      timeElapsed,
      exerciseId: currentExercise.id,
      timestamp: Date.now(),
    };

    setGameResult(result);
    updateStats(result);
    setCurrentScreen('result');
  };

  const handlePlayAgain = () => {
    if (!currentExercise) return;
    const exercise = selectRandomExercise(currentExercise.level);
    setCurrentExercise(exercise);
    setCurrentScreen('game');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    setCurrentExercise(null);
    setGameResult(null);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {currentScreen === 'menu' && (
        <MenuScreen onStartGame={handleStartGame} />
      )}

      {currentScreen === 'game' && currentExercise && (
        <GameScreen
          exercise={currentExercise}
          onComplete={handleGameComplete}
          onBack={handleBackToMenu}
        />
      )}

      {currentScreen === 'result' && gameResult && (
        <ResultScreen
          result={gameResult}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <StatsProvider>
      <AppContent />
    </StatsProvider>
  );
}

export default App
