import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { getStreak } from '../utils/streak';

const HabitContext = createContext(null);

function loadHabitsFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HABITS);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    return [];
  }
}

function loadCompletionsFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPLETIONS);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    localStorage.removeItem(STORAGE_KEYS.COMPLETIONS);
    return {};
  }
}

export function HabitProvider({ children }) {
  const [habits, setHabits] = useState(loadHabitsFromStorage);
  const [completions, setCompletions] = useState(loadCompletionsFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
  }, [completions]);

  const addHabit = useCallback((habit) => {
    const newHabit = {
      id: crypto.randomUUID(),
      ...habit,
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
    return newHabit.id;
  }, []);

  const updateHabit = useCallback((id, updates) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  }, []);

  const deleteHabit = useCallback((id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setCompletions(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const toggleCompletion = useCallback((habitId, dateStr, allowPastOrFuture = false) => {
    const key = new Date(dateStr).toDateString();
    const today = new Date().toDateString();
    if (!allowPastOrFuture && key !== today) return;
    setCompletions(prev => {
      const list = prev[habitId] || [];
      const has = list.some(d => new Date(d).toDateString() === key);
      return {
        ...prev,
        [habitId]: has
          ? list.filter(d => new Date(d).toDateString() !== key)
          : [...list, new Date(dateStr).toISOString()],
      };
    });
  }, []);

  const isCompleted = useCallback((habitId, dateStr) => {
    const key = new Date(dateStr).toDateString();
    const list = completions[habitId] || [];
    return list.some(d => new Date(d).toDateString() === key);
  }, [completions]);

  const getStreakForHabit = useCallback((habitId) => {
    return getStreak(completions, habitId);
  }, [completions]);

  const getCompletionRate = useCallback((habitId, days = 7) => {
    const list = completions[habitId] || [];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const count = list.filter(d => new Date(d) >= cutoff).length;
    return Math.round((count / days) * 100);
  }, [completions]);

  return (
    <HabitContext.Provider
      value={{
        habits,
        completions,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleCompletion,
        isCompleted,
        getStreakForHabit,
        getCompletionRate,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used within HabitProvider');
  return ctx;
}
