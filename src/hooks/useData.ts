import { useState, useEffect } from 'react';

export interface Workout {
  id: string;
  type: 'swim' | 'bike' | 'run' | 'gym';
  date: string;
  distance: number;
  duration: number;
  notes?: string;
  intensity: number;
  isPlanned?: boolean;
}

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
}

export interface GymRoutine {
  id: string;
  day: string; // e.g. "Monday"
  title: string;
  description: string;
}

export function useData() {
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('ironpulse-workouts');
    return saved ? JSON.parse(saved) : [];
  });

  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(() => {
    const saved = localStorage.getItem('ironpulse-weight');
    return saved ? JSON.parse(saved) : [];
  });

  const [gymRoutines, setGymRoutines] = useState<GymRoutine[]>(() => {
    const saved = localStorage.getItem('ironpulse-gym');
    const defaults = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => ({
      id: day,
      day,
      title: "",
      description: ""
    }));
    return saved ? JSON.parse(saved) : defaults;
  });

  useEffect(() => {
    localStorage.setItem('ironpulse-workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('ironpulse-weight', JSON.stringify(weightLogs));
  }, [weightLogs]);

  useEffect(() => {
    localStorage.setItem('ironpulse-gym', JSON.stringify(gymRoutines));
  }, [gymRoutines]);

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    const newWorkout = { ...workout, id: Math.random().toString(36).substr(2, 9) };
    setWorkouts(prev => [newWorkout, ...prev]);
  };

  const updateGymRoutine = (day: string, title: string, description: string) => {
    setGymRoutines(prev => prev.map(r => r.day === day ? { ...r, title, description } : r));
  };

  const addWeightLog = (log: Omit<WeightLog, 'id'>) => {
    const newLog = { ...log, id: Math.random().toString(36).substr(2, 9) };
    setWeightLogs(prev => [newLog, ...prev]);
  };

  return { workouts, weightLogs, gymRoutines, addWorkout, addWeightLog, updateGymRoutine };
}
