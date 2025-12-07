import React from 'react';
import type { GameResult } from '../types/types';
import { formatTime } from '../utils/typing';

interface ResultScreenProps {
  result: GameResult;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onPlayAgain, onBackToMenu }) => {
  const getWPMColor = (wpm: number) => {
    if (wpm >= 60) return 'text-green-400';
    if (wpm >= 40) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-400';
    if (accuracy >= 85) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-gray-900">
      <div className="max-w-2xl w-full mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">Results</h1>
          <p className="text-gray-400">Great job! Here's how you performed:</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 mb-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-gray-400 text-sm uppercase tracking-wide mb-2">
                Words Per Minute
              </div>
              <div className={`text-6xl font-bold ${getWPMColor(result.wpm)}`}>
                {result.wpm}
              </div>
              <div className="text-gray-500 text-sm mt-2">WPM</div>
            </div>

            <div className="text-center">
              <div className="text-gray-400 text-sm uppercase tracking-wide mb-2">
                Accuracy
              </div>
              <div className={`text-6xl font-bold ${getAccuracyColor(result.accuracy)}`}>
                {result.accuracy}%
              </div>
              <div className="text-gray-500 text-sm mt-2">
                {result.errors} error{result.errors !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex justify-around text-center">
              <div>
                <div className="text-gray-400 text-sm mb-1">Time</div>
                <div className="text-2xl font-semibold text-white">
                  {formatTime(Math.round(result.timeElapsed))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={onPlayAgain} className="btn-primary">
            🔄 Try Another
          </button>
          <button onClick={onBackToMenu} className="btn-secondary">
            🏠 Back to Menu
          </button>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>💡 Tip: Practice regularly to improve your speed and accuracy!</p>
        </div>
      </div>
    </div>
  );
};
