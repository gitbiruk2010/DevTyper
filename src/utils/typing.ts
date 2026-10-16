export const calculateWPM = (charsTyped: number, timeElapsedMinutes: number): number => {
  if (timeElapsedMinutes === 0) return 0;
  return Math.round((charsTyped / 5) / timeElapsedMinutes);
};

export const calculateAccuracy = (totalKeyStrokes: number, errors: number): number => {
  if (totalKeyStrokes === 0) return 100;
  return Math.round(((totalKeyStrokes - errors) / totalKeyStrokes) * 100);
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const whitespaceRun = (text: string, from: number) => {
  let end = from;
  while (end < text.length && (text[end] === ' ' || text[end] === '\t')) end++;
  return text.slice(from, end);
};

/**
 * What a key press inserts at the cursor, editor style: Enter after the expected newline also
 * inserts the next line's indentation, and Tab fills the expected indentation.
 * Returns null for keys that insert nothing.
 */
export const resolveInsert = (target: string, index: number, key: string): string | null => {
  const expected = target[index];
  if (key === 'Enter') return expected === '\n' ? '\n' + whitespaceRun(target, index + 1) : '\n';
  if (key === 'Tab') return /[ \t]/.test(expected) ? whitespaceRun(target, index) : '\t';
  return key.length === 1 ? key : null;
};
