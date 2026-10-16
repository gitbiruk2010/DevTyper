import React, { useEffect, useMemo, useRef } from 'react';
import { tokenize } from '../utils/tokenize';
import { cn } from '../utils/cn';

interface CodeViewProps {
  target: string;
  typed: string;
  language: string;
  focused: boolean;
}

export const CodeView: React.FC<CodeViewProps> = ({ target, typed, language, focused }) => {
  const tokens = useMemo(() => tokenize(target, language), [target, language]);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    cursorRef.current?.scrollIntoView({ block: 'nearest' });
  }, [typed.length]);

  // Split into lines but keep global indexes so each char knows its state.
  const lines: { start: number; text: string }[] = [];
  let start = 0;
  for (const text of target.split('\n')) {
    lines.push({ start, text });
    start += text.length + 1;
  }

  const renderChar = (index: number, char: string, isNewline = false) => {
    const isTyped = index < typed.length;
    const isCursor = index === typed.length;
    const wrong = isTyped && typed[index] !== target[index];
    const shown = isNewline ? '↵' : char === ' ' && wrong ? '·' : char;

    return (
      <span
        key={index}
        ref={isCursor ? cursorRef : undefined}
        className={cn(
          'relative rounded-[3px]',
          `tok-${tokens[index] ?? 'plain'}`,
          !isTyped && 'opacity-45',
          isNewline && (isTyped && !wrong ? 'opacity-0' : 'opacity-30'),
          wrong && 'bg-neon-red/25 !text-neon-red !opacity-100 underline decoration-neon-red/60',
          isCursor && 'bg-neon-cyan/25 !opacity-100 shadow-[0_0_14px_rgb(34_211_238/0.45)]',
        )}
      >
        {isCursor && (
          <span
            aria-hidden
            className={cn('absolute -left-px top-0 h-full w-0.5 bg-neon-cyan', focused && 'animate-caret')}
          />
        )}
        {shown}
      </span>
    );
  };

  return (
    <div className="flex font-mono text-[1.35rem] leading-[2.1rem]">
      <div aria-hidden className="select-none pr-5 text-right text-ink-500">
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div className="min-w-0 flex-1 overflow-x-auto whitespace-pre">
        {lines.map((line, li) => (
          <div key={li} className="min-h-[2.1rem]">
            {line.text.split('').map((char, ci) => renderChar(line.start + ci, char))}
            {li < lines.length - 1 && renderChar(line.start + line.text.length, '\n', true)}
          </div>
        ))}
      </div>
    </div>
  );
};
