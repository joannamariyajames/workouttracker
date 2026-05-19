import React, { useState } from 'react';
import { GymRoutine } from '../hooks/useData';
import { Dumbbell, Save, CheckCircle2 } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface GymViewProps {
  gymRoutines: GymRoutine[];
  updateRoutine: (day: string, title: string, description: string) => void;
}

export function GymView({ gymRoutines, updateRoutine }: GymViewProps) {
  const { theme } = useTheme();
  const isBrutal = theme === 'brutalist';
  const [savedDay, setSavedDay] = useState<string | null>(null);

  const handleSave = (day: string, title: string, description: string) => {
    updateRoutine(day, title, description);
    setSavedDay(day);
    setTimeout(() => setSavedDay(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex items-center gap-4">
        {!isBrutal && (
          <div className="p-4 rounded-2xl bg-slate-400/10">
            <Dumbbell className="w-8 h-8 text-slate-400" />
          </div>
        )}
        <div>
          {isBrutal && <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white/50 border border-white/20 mb-2 inline-block">strength training</span>}
          <h2 
            style={{ fontFamily: 'system-ui' }}
            className={cn("text-4xl font-display font-black italic tracking-tighter uppercase leading-none", isBrutal && "text-8xl brutal-title")}
          >
            GYM
          </h2>
          <p className="text-xs font-bold tracking-widest opacity-40 uppercase mt-1">Weekly Routine & Strength Logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {gymRoutines.map((routine) => (
          <div 
            key={routine.day}
            className={cn(
              "bg-card/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 flex flex-col gap-4 group transition-all",
              isBrutal && "brutal-card"
            )}
          >
            <div className="flex justify-between items-center">
              <h3 className={cn("text-xl font-bold uppercase tracking-tighter", isBrutal && "text-3xl brutal-title")}>
                {routine.day}
              </h3>
              <div className="flex items-center gap-2">
                {savedDay === routine.day && (
                  <motion.span 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Saved
                  </motion.span>
                )}
                <button 
                  onClick={() => handleSave(routine.day, routine.title, routine.description)}
                  className={cn(
                    "p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100",
                    isBrutal && "opacity-100 border border-white rounded-none hover:bg-white hover:text-black"
                  )}
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <input 
                type="text"
                value={routine.title}
                onChange={(e) => updateRoutine(routine.day, e.target.value, routine.description)}
                placeholder="Workout Title (e.g. Leg Day, Push A...)"
                className={cn(
                  "bg-white/5 border border-white/10 rounded-xl p-4 font-bold tracking-tight text-lg focus:outline-hidden focus:ring-2 focus:ring-accent transition-all",
                  isBrutal && "rounded-none border-2 border-white focus:ring-0 focus:bg-white/10"
                )}
              />
              <textarea 
                value={routine.description}
                onChange={(e) => updateRoutine(routine.day, routine.title, e.target.value)}
                placeholder="Routine details (exercises, reps, sets...)"
                className={cn(
                  "bg-white/5 border border-white/10 rounded-xl p-4 min-h-[120px] focus:outline-hidden focus:ring-2 focus:ring-accent font-medium text-sm transition-all",
                  isBrutal && "rounded-none border-2 border-white focus:ring-0 focus:bg-white/10"
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
