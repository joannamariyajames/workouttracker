import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  day: string;
  title: string;
  description: string;
}

export function useData() {

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);

  const [gymRoutines, setGymRoutines] = useState<GymRoutine[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ].map(day => ({
    id: day,
    day,
    title: "",
    description: ""
  })));

  // LOAD WORKOUTS
  useEffect(() => {

    async function loadWorkouts() {

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setWorkouts(data as Workout[]);
      }
    }

    loadWorkouts();

  }, []);

  // ADD WORKOUT
  const addWorkout = async (workout: Omit<Workout, 'id'>) => {

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const workoutData = {
      ...workout,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('workouts')
      .insert([workoutData])
      .select();

    if (!error && data) {
      setWorkouts(prev => [...(data as Workout[]), ...prev]);
    }
  };

  // GYM ROUTINES
  const updateGymRoutine = (
    day: string,
    title: string,
    description: string
  ) => {

    setGymRoutines(prev =>
      prev.map(r =>
        r.day === day
          ? { ...r, title, description }
          : r
      )
    );
  };

  // WEIGHT LOGS
  const addWeightLog = (log: Omit<WeightLog, 'id'>) => {

    const newLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9)
    };

    setWeightLogs(prev => [newLog, ...prev]);
  };

  return {
    workouts,
    weightLogs,
    gymRoutines,
    addWorkout,
    addWeightLog,
    updateGymRoutine
  };
}