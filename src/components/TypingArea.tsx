import React, { useEffect, useRef, useState } from 'react';
import type { Exercise } from '../types/types';
import { useTypingEngine } from '../hooks/useTypingEngine';
import type { EngineResult } from '../hooks/useTypingEngine';
import { getLanguage } from '../data/languages';
import { formatTime } from '../utils/typing';
import { CodeView } from './CodeView';
import { TypingTrack } from './TypingTrack';

interface TypingAreaProps {
  exercise: Exercise;
  bestWPM: number;
  onComplete: (result: EngineResult) => void;
}

const Stat: React.FC<{ label: string; value: React.ReactNode; accent?: string }> = ({ label, value, accent }) => (
  <div className="min-w-[4.5rem]">
    <div className="text-[0.65rem] uppercase tracking-widest text-mist">{label}</div>
    <div className="font-mono text-2xl font-bold tabular-nums" style={{ color: accent }}>
      {value}
    </div>
  </div>
);

export const TypingArea: React.FC<TypingAreaProps> = ({ exercise, bestWPM, onComplete }) => {
  const target = exercise.text;
  const language = getLanguage(exercise.source_language);
  const { typed, status, elapsed, errors, streak, liveWpm, liveAccuracy, handleKeyDown, reset } = useTypingEngine(
    target,
    onComplete,
  );
  const [focused, setFocused] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.focus();
  }, []);

  // If focus was lost (e.g. the Start button disappeared), the first key press refocuses the editor and still counts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement === document.body && boxRef.current) {
        boxRef.current.focus();
        handleKeyDown(e);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const progress = (typed.length / target.length) * 100;
  const ghost =
    bestWPM > 0 && status === 'running' ? Math.min(((elapsed / 60) * bestWPM * 5 * 100) / target.length, 100) : null;
  const accuracyColor = liveAccuracy >= 95 ? '#a3e635' : liveAccuracy >= 85 ? '#fbbf24' : '#fb7185';

  return (
    <div className="animate-fade-up space-y-4">
      <div className="glass flex flex-wrap items-end justify-between gap-4 px-6 py-4">
        <div className="flex flex-wrap gap-6">
          <Stat
            label="Speed"
            value={
              <>
                {liveWpm}
                <span className="ml-1 text-xs text-mist">WPM</span>
              </>
            }
            accent={language.color}
          />
          <Stat label="Accuracy" value={`${liveAccuracy}%`} accent={accuracyColor} />
          <Stat label="Time" value={formatTime(Math.floor(elapsed))} />
          <Stat label="Errors" value={errors} accent={errors ? '#fb7185' : undefined} />
          <Stat label="Streak" value={streak} accent={streak >= 10 ? '#fbbf24' : undefined} />
        </div>
        <div className="w-40 text-right">
          <div className="mb-1 text-xs text-mist">
            {typed.length}/{target.length} chars
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-ink-600">
            <div
              className="h-full rounded-full transition-[width] duration-150"
              style={{ width: `${progress}%`, background: language.color }}
            />
          </div>
        </div>
      </div>

      <TypingTrack progress={progress} ghostProgress={ghost} wpm={liveWpm} streak={streak} color={language.color} />

      <div
        ref={boxRef}
        tabIndex={0}
        role="textbox"
        aria-label={`Type the ${language.name} snippet`}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="relative cursor-text overflow-hidden rounded-2xl border bg-ink-900 shadow-2xl outline-none transition-colors"
        style={{ borderColor: focused ? `${language.color}88` : 'rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2 border-b border-white/[0.06] bg-ink-800 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-neon-red/80" />
          <span className="h-3 w-3 rounded-full bg-neon-amber/80" />
          <span className="h-3 w-3 rounded-full bg-neon-lime/80" />
          <span className="ml-3 font-mono text-xs text-mist">
            {exercise.source_language} / {exercise.focus}
          </span>
        </div>
        <div className="max-h-[42vh] overflow-y-auto px-6 py-5">
          <CodeView target={target} typed={typed} language={exercise.source_language} focused={focused} />
        </div>
        {!focused && status !== 'finished' && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-950/70 backdrop-blur-sm">
            <span className="animate-glow rounded-full border border-white/10 bg-ink-800 px-5 py-2 text-sm text-snow">
              Click here to focus, then start typing
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-mist">
        <span>
          <span className="kbd">Backspace</span> fixes a typo · <span className="kbd">Enter</span> new line (auto-indent)
          · <span className="kbd">Tab</span> indent
        </span>
        <button
          onClick={() => {
            reset();
            boxRef.current?.focus();
          }}
          className="btn-ghost"
        >
          Restart <span className="kbd">Esc</span>
        </button>
      </div>
    </div>
  );
};
