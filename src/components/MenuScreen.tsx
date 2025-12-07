import React from 'react';
import type { Exercise } from '../types/types';

interface MenuScreenProps {
  onStartGame: (level: Exercise['level']) => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ onStartGame }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          DevTyper
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Master your coding speed, one keystroke at a time
        </p>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white mb-6">Select Difficulty</h2>
          
          <button
            onClick={() => onStartGame('beginner')}
            className="block w-64 mx-auto btn-primary"
          >
            🟢 Beginner
          </button>

          <button
            onClick={() => onStartGame('intermediate')}
            className="block w-64 mx-auto btn-primary"
          >
            🟡 Intermediate
          </button>

          <button
            onClick={() => onStartGame('advanced')}
            className="block w-64 mx-auto btn-primary"
          >
            🔴 Advanced
          </button>
        </div>

        <div className="mt-12 text-gray-500 text-sm">
          <p>Focus on special characters: {}, [], (), &lt;&gt;, =, -, +, /, *, etc.</p>
          <p className="mt-2">Press ESC to reset at any time</p>
        </div>
      </div>
    </div>
  );
};
