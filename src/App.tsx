import React, { useMemo, useState } from 'react';
import { MenuScreen } from './components/MenuScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { StatsScreen } from './components/StatsScreen';
import { StatsProvider } from './context/StatsContext';
import { useStats } from './context/useStats';
import type { EngineResult } from './hooks/useTypingEngine';
import type { Exercise, GameResult, Level, PracticeMode, Screen } from './types/types';
import { getProgress, pickExercise } from './utils/exercisePicker';
import { exercises } from './data/exercises';


const AppContent: React.FC = () => {
  const { userStats, settings, recordResult, updateSettings, resetStats } = useStats();
  const [screen, setScreen] = useState<Screen>('menu');
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const [bestStreak, setBestStreak] = useState(0);

  const { lastLanguage: language, lastLevel: level, mode } = settings;

  const counts = useMemo(() => {
    const out: Record<string, Record<Level, number>> = {};
    for (const ex of exercises) {
      out[ex.source_language] ??= { beginner: 0, intermediate: 0, advanced: 0 };
      out[ex.source_language][ex.level]++;
    }
    return out;
  }, []);

  const progress = useMemo(() => {
    const out: Record<string, ReturnType<typeof getProgress>> = {};
    const ids = [...new Set(exercises.map(e => e.source_language))];
    for (const id of ids) {
      out[id] = getProgress(exercises.filter(e => e.source_language === id && e.level === level), userStats.exerciseStats);
    }
    out.any = getProgress(exercises.filter(e => e.level === level), userStats.exerciseStats);
    return out;
  }, [level, userStats.exerciseStats]);

  const startGame = (avoidId?: string) => {
    const next = pickExercise(exercises, language, level, mode, userStats.exerciseStats, avoidId);
    if (!next) return;
    setExercise(next);
    setAttempt(a => a + 1);
    setResult(null);
    setScreen('game');
  };

  const handleComplete = (engine: EngineResult) => {
    if (!exercise) return;
    const saved = recordResult(
      {
        wpm: engine.wpm,
        accuracy: engine.accuracy,
        errors: engine.errors,
        timeElapsed: engine.timeElapsed,
        exerciseId: exercise.id,
        language: exercise.source_language,
        level: exercise.level,
        charCount: engine.charCount,
      },
      engine.missedKeys,
    );
    setBestStreak(engine.bestStreak);
    setResult(saved);
    setScreen('result');
  };

  const backToMenu = () => {
    setScreen('menu');
    setExercise(null);
    setResult(null);
  };

  const retry = () => {
    setAttempt(a => a + 1);
    setResult(null);
    setScreen('game');
  };

  return (
    <div className="relative h-full overflow-y-auto">
      {/* ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] animate-drift rounded-full bg-neon-violet/15 blur-3xl" />
        <div className="absolute -bottom-48 -right-32 h-[30rem] w-[30rem] animate-drift rounded-full bg-neon-cyan/10 blur-3xl [animation-delay:-6s]" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 animate-drift rounded-full bg-neon-pink/10 blur-3xl [animation-delay:-11s]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
      </div>

      <div className="relative z-10">
        {screen === 'menu' && (
          <MenuScreen
            stats={userStats}
            language={language}
            level={level}
            counts={counts}
            progress={progress}
            mode={mode}
            onModeChange={(m: PracticeMode) => updateSettings({ mode: m })}
            onLanguageChange={l => updateSettings({ lastLanguage: l })}
            onLevelChange={l => updateSettings({ lastLevel: l })}
            onStart={() => startGame()}
            onOpenStats={() => setScreen('stats')}
          />
        )}

        {screen === 'stats' && <StatsScreen stats={userStats} onBack={backToMenu} onReset={resetStats} />}

        {screen === 'game' && exercise && (
          <GameScreen
            key={`${exercise.id}-${attempt}`}
            exercise={exercise}
            bestWPM={userStats.bestWPM}
            onComplete={handleComplete}
            onBack={backToMenu}
          />
        )}

        {screen === 'result' && result && (
          <ResultScreen
            result={result}
            bestStreak={bestStreak}
            totalXp={userStats.xp}
            exerciseStat={userStats.exerciseStats[result.exerciseId]}
            progress={progress[result.language]}
            onNext={() => startGame(exercise?.id)}
            onRetry={retry}
            onBackToMenu={backToMenu}
          />
        )}
      </div>
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

export default App;
