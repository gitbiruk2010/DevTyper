import React from 'react';

interface TypingTrackProps {
  progress: number; // 0-100
  ghostProgress: number | null; // 0-100, pace of your personal best
  wpm: number;
  streak: number;
  color: string;
}

export const TypingTrack: React.FC<TypingTrackProps> = ({ progress, ghostProgress, wpm, streak, color }) => {
  const car = Math.min(progress, 96);
  const fast = wpm >= 40;
  return (
    <div className="relative h-[4.5rem] overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900">
      {/* road */}
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-t-2 border-dashed border-ink-500/70" />
      <div
        className="absolute inset-y-0 left-0 transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%`, background: `linear-gradient(90deg, transparent, ${color}33)` }}
      />
      {/* checkpoints */}
      {[25, 50, 75].map(p => (
        <div key={p} className="absolute inset-y-3 w-px bg-white/5" style={{ left: `${p}%` }} />
      ))}
      {/* ghost */}
      {ghostProgress !== null && (
        <div
          className="absolute top-1/2 -translate-y-1/2 text-2xl opacity-35 grayscale transition-[left] duration-200 ease-linear"
          style={{ left: `${Math.min(ghostProgress, 96)}%` }}
          title="Your personal best pace"
        >
          🏎️
        </div>
      )}
      {/* player */}
      <div
        className="absolute top-1/2 -translate-y-1/2 transition-[left] duration-200 ease-out"
        style={{ left: `${car}%` }}
      >
        {fast && (
          <div className="absolute right-full top-1/2 mr-1 flex -translate-y-1/2 flex-col gap-1">
            <span className="h-0.5 w-8 animate-glow rounded bg-neon-amber" />
            <span className="ml-2 h-0.5 w-5 animate-glow rounded bg-neon-pink" />
          </div>
        )}
        <span className="text-3xl drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">🏎️</span>
        {streak >= 10 && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-neon-amber px-2 text-[0.65rem] font-bold text-ink-950">
            🔥 {streak}
          </span>
        )}
      </div>
      <div className="absolute inset-y-0 right-0 flex w-5 items-center justify-center bg-[conic-gradient(#fff_25%,#111_0_50%,#fff_0_75%,#111_0)] bg-[length:10px_10px] opacity-80" />
    </div>
  );
};
