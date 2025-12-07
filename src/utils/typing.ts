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
