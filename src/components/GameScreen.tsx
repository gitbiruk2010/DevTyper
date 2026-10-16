import React from 'react';
import { TypingArea } from './TypingArea';
import type { Exercise } from '../types/types';
import type { EngineResult } from '../hooks/useTypingEngine';
import { getLanguage } from '../data/languages';

interface GameScreenProps {
  exercise: Exercise;
  bestWPM: number;
  onComplete: (result: EngineResult) => void;
  onBack: () => void;
}

const LEVEL_STYLE: Record<Exercise['level'], string> = {
  beginner: 'text-neon-lime border-neon-lime/30 bg-neon-lime/10',
  intermediate: 'text-neon-amber border-neon-amber/30 bg-neon-amber/10',
  advanced: 'text-neon-pink border-neon-pink/30 bg-neon-pink/10',
};

export const GameScreen: React.FC<GameScreenProps> = ({ exercise, bestWPM, onComplete, onBack }) => {
  const language = getLanguage(exercise.source_language);
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-sm font-bold text-ink-950"
            style={{ background: language.color }}
          >
            {language.glyph}
          </span>
          <div>
            <h2 className="text-xl font-bold leading-tight">{language.name}</h2>
            <div className="flex gap-2 text-xs">
              <span className={`rounded-full border px-2 py-0.5 capitalize ${LEVEL_STYLE[exercise.level]}`}>
                {exercise.level}
              </span>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-mist">
                difficulty {exercise.difficulty_score}/10
              </span>
            </div>
          </div>
        </div>
        <button onClick={onBack} className="btn-secondary">
          ← Menu
        </button>
      </div>
      <TypingArea exercise={exercise} bestWPM={bestWPM} onComplete={onComplete} />
    </div>
  );
};
