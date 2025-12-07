import React from 'react';
import { TypingArea } from './TypingArea';
import type { Exercise } from '../types/types';

interface GameScreenProps {
  exercise: Exercise;
  onComplete: (wpm: number, accuracy: number, errors: number, timeElapsed: number) => void;
  onBack: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ exercise, onComplete, onBack }) => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Type the code below</h2>
            <div className="flex gap-4 text-sm">
              <span className="px-3 py-1 bg-blue-600 rounded-full text-white">
                {exercise.level}
              </span>
              <span className="px-3 py-1 bg-gray-700 rounded-full text-gray-300">
                {exercise.source_language}
              </span>
              <span className="px-3 py-1 bg-gray-700 rounded-full text-gray-300">
                Difficulty: {exercise.difficulty_score}/10
              </span>
            </div>
          </div>
          <button
            onClick={onBack}
            className="btn-secondary"
          >
            ← Back to Menu
          </button>
        </div>

        <TypingArea targetText={exercise.text} onComplete={onComplete} />
      </div>
    </div>
  );
};
