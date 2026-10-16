import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameStatus } from '../types/types';
import { calculateAccuracy, calculateWPM, resolveInsert } from '../utils/typing';

export interface EngineResult {
  wpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
  charCount: number;
  bestStreak: number;
  missedKeys: Record<string, number>;
}

/**
 * Keystroke engine for typing practice. Backspace is supported, Enter inserts a newline
 * (and auto-indents, like an editor) and Tab fills the expected indentation.
 */
export type KeyInput = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'preventDefault'>;

export function useTypingEngine(target: string, onFinish: (result: EngineResult) => void) {
  const [typed, setTyped] = useState('');
  const [status, setStatus] = useState<GameStatus>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [errors, setErrors] = useState(0);
  const [streak, setStreak] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);

  const typedRef = useRef('');
  const startRef = useRef<number | null>(null);
  const keystrokesRef = useRef(0);
  const errorsRef = useRef(0);
  const streakRef = useRef(0);
  const bestStreakRef = useRef(0);
  const missedRef = useRef<Record<string, number>>({});
  const finishedRef = useRef(false);

  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => {
      if (startRef.current !== null) setElapsed((performance.now() - startRef.current) / 1000);
    }, 200);
    return () => clearInterval(id);
  }, [status]);

  const reset = useCallback(() => {
    typedRef.current = '';
    startRef.current = null;
    keystrokesRef.current = 0;
    errorsRef.current = 0;
    streakRef.current = 0;
    bestStreakRef.current = 0;
    missedRef.current = {};
    finishedRef.current = false;
    setTyped('');
    setStatus('idle');
    setElapsed(0);
    setErrors(0);
    setStreak(0);
    setKeystrokes(0);
  }, []);

  const finish = (finalTyped: string) => {
    finishedRef.current = true;
    const seconds = Math.max((performance.now() - (startRef.current ?? performance.now())) / 1000, 0.5);
    let correct = 0;
    for (let i = 0; i < target.length; i++) if (finalTyped[i] === target[i]) correct++;
    setElapsed(seconds);
    setStatus('finished');
    onFinish({
      wpm: calculateWPM(correct, seconds / 60),
      accuracy: calculateAccuracy(keystrokesRef.current, errorsRef.current),
      errors: errorsRef.current,
      timeElapsed: seconds,
      charCount: target.length,
      bestStreak: bestStreakRef.current,
      missedKeys: missedRef.current,
    });
  };

  const handleKeyDown = (e: KeyInput) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      reset();
      return;
    }
    if (finishedRef.current || e.ctrlKey || e.metaKey || e.altKey) return;

    const current = typedRef.current;

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (current.length === 0) return;
      typedRef.current = current.slice(0, -1);
      streakRef.current = 0;
      setTyped(typedRef.current);
      setStreak(0);
      return;
    }

    const index = current.length;
    if (index >= target.length) return;
    const expected = target[index];

    const insert = resolveInsert(target, index, e.key);
    if (insert === null) return;
    e.preventDefault();

    if (startRef.current === null) {
      startRef.current = performance.now();
      setStatus('running');
    }

    const next = current + insert;
    typedRef.current = next;
    keystrokesRef.current += 1;

    if (insert === target.slice(index, index + insert.length)) {
      streakRef.current += 1;
      bestStreakRef.current = Math.max(bestStreakRef.current, streakRef.current);
    } else {
      errorsRef.current += 1;
      streakRef.current = 0;
      const label = expected === '\n' ? '↵' : expected === ' ' ? '␣' : expected;
      missedRef.current[label] = (missedRef.current[label] ?? 0) + 1;
    }
    setTyped(next);
    setErrors(errorsRef.current);
    setStreak(streakRef.current);
    setKeystrokes(keystrokesRef.current);

    if (next.length >= target.length) finish(next);
  };

  let correctChars = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) correctChars++;
  const liveWpm = elapsed >= 1 ? calculateWPM(correctChars, elapsed / 60) : 0;
  const liveAccuracy = calculateAccuracy(keystrokes, errors);

  return { typed, status, elapsed, errors, streak, liveWpm, liveAccuracy, handleKeyDown, reset };
}
