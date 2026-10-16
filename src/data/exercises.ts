import type { Exercise } from '../types/types';

// Every file in ./exercises is one language's snippets (a JSON array of Exercise).
const modules = import.meta.glob<Exercise[]>('./exercises/*.json', { eager: true, import: 'default' });

export const exercises: Exercise[] = Object.values(modules).flat();
