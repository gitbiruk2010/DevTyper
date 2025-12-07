import React, { useState, useEffect, useRef } from 'react';
import type { GameStatus } from '../types/types';
import { calculateWPM, calculateAccuracy } from '../utils/typing';
import { cn } from '../utils/cn';
import { TypingTrack } from './TypingTrack';

interface TypingAreaProps {
  targetText: string;
  onComplete: (wpm: number, accuracy: number, errors: number, timeElapsed: number) => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({ targetText, onComplete }) => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<GameStatus>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  const [currentWPM, setCurrentWPM] = useState(0);
  const [currentAccuracy, setCurrentAccuracy] = useState(100);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (input.length === targetText.length && status === 'running') {
      finishTyping();
    }
  }, [input, targetText, status]);

  // Update real-time WPM and accuracy
  useEffect(() => {
    if (status === 'running' && startTime && input.length > 0) {
      const timeElapsedMinutes = (Date.now() - startTime) / 1000 / 60;
      const wpm = calculateWPM(input.length, timeElapsedMinutes);
      const accuracy = calculateAccuracy(input.length, errors);
      setCurrentWPM(wpm);
      setCurrentAccuracy(accuracy);
    }
  }, [input, status, startTime, errors]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (status === 'idle' && e.key.length === 1) {
      setStatus('running');
      setStartTime(Date.now());
    }

    if (e.key === 'Escape') {
      resetTyping();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value.length > targetText.length) {
      return;
    }

    const lastChar = value[value.length - 1];
    const expectedChar = targetText[value.length - 1];

    if (lastChar !== expectedChar) {
      setErrors(prev => prev + 1);
      setErrorIndices(prev => new Set([...prev, value.length - 1]));
    }

    setInput(value);
    setCurrentIndex(value.length);
  };

  const finishTyping = () => {
    if (!startTime) return;
    
    setStatus('finished');
    const timeElapsed = (Date.now() - startTime) / 1000;
    const timeElapsedMinutes = timeElapsed / 60;
    const wpm = calculateWPM(input.length, timeElapsedMinutes);
    const accuracy = calculateAccuracy(input.length, errors);
    
    onComplete(wpm, accuracy, errors, timeElapsed);
  };

  const resetTyping = () => {
    setInput('');
    setStatus('idle');
    setStartTime(null);
    setErrors(0);
    setCurrentIndex(0);
    setErrorIndices(new Set());
    setCurrentWPM(0);
    setCurrentAccuracy(100);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderTargetText = () => {
    return targetText.split('').map((char, index) => {
      let className = 'transition-colors duration-100';
      
      if (index < input.length) {
        if (errorIndices.has(index)) {
          className = cn(className, 'text-red-400 bg-red-500/20');
        } else {
          className = cn(className, 'text-green-400');
        }
      } else if (index === currentIndex) {
        className = cn(className, 'bg-blue-400/30 animate-pulse');
      } else {
        className = cn(className, 'text-gray-500');
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      {/* Game Track */}
      {status === 'running' && (
        <TypingTrack 
          progress={(input.length / targetText.length) * 100}
          wpm={currentWPM}
          accuracy={currentAccuracy}
        />
      )}

      <div className="mb-8 p-6 bg-gray-900 rounded-lg border border-gray-700">
        <div className="text-2xl font-mono leading-relaxed tracking-wide">
          {renderTargetText()}
        </div>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={status === 'idle' ? 'Start typing to begin...' : ''}
        disabled={status === 'finished'}
      />

      <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
        <div className="flex gap-6">
          <div>
            <span className="text-gray-500">Progress: </span>
            <span className="text-white font-semibold">{input.length}/{targetText.length}</span>
          </div>
          <div>
            <span className="text-gray-500">Errors: </span>
            <span className="text-red-400 font-semibold">{errors}</span>
          </div>
        </div>
        <button
          onClick={resetTyping}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          Reset (Esc)
        </button>
      </div>
    </div>
  );
};
