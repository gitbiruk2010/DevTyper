import { useContext } from 'react';
import { StatsContext } from './statsStore';

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within StatsProvider');
  }
  return context;
};
