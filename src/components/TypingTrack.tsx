import React from 'react';

interface TypingTrackProps {
  progress: number; // 0-100
  wpm: number;
  accuracy: number;
}

export const TypingTrack: React.FC<TypingTrackProps> = ({ progress, wpm, accuracy }) => {
  return (
    <div className="mb-6 bg-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-6">
          <div>
            <div className="text-gray-400 text-xs uppercase">Speed</div>
            <div className="text-2xl font-bold text-blue-400">{wpm} <span className="text-sm text-gray-500">WPM</span></div>
          </div>
          <div>
            <div className="text-gray-400 text-xs uppercase">Accuracy</div>
            <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
          </div>
        </div>
        <div className="text-gray-400 text-sm">
          {progress.toFixed(0)}% Complete
        </div>
      </div>
      
      {/* Racing Track */}
      <div className="relative h-16 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        {/* Track Lines */}
        <div className="absolute inset-0 flex">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="flex-1 border-r border-gray-700"
              style={{ opacity: 0.3 }}
            />
          ))}
        </div>
        
        {/* Progress Bar */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%`, opacity: 0.3 }}
        />
        
        {/* Racer Icon */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
          style={{ left: `${Math.min(progress, 95)}%` }}
        >
          <div className="relative">
            {/* Racer */}
            <div className="text-4xl animate-bounce">
              🏎️
            </div>
            {/* Speed effect */}
            {wpm > 30 && (
              <div className="absolute top-1/2 -translate-y-1/2 right-full mr-2 flex gap-1">
                <div className="w-8 h-1 bg-orange-400 rounded animate-pulse" />
                <div className="w-6 h-1 bg-orange-300 rounded animate-pulse delay-75" />
                <div className="w-4 h-1 bg-orange-200 rounded animate-pulse delay-150" />
              </div>
            )}
          </div>
        </div>
        
        {/* Finish Line */}
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-white via-gray-400 to-white opacity-50">
          <div className="absolute inset-0 animate-pulse bg-yellow-300" />
        </div>
      </div>
      
      {/* Milestone markers */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Start</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>🏁 Finish</span>
      </div>
    </div>
  );
};
