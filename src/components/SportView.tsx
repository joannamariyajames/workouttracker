import React from 'react';
import { Workout } from '../hooks/useData';
import { Waves, Bike, Footprints, Clock, MapPin, Gauge, Calendar, MessageSquare, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '../lib/utils';

import { useTheme } from './ThemeContext';

interface SportViewProps {
  type: 'swim' | 'bike' | 'run';
  workouts: Workout[];
  onAddClick: () => void;
}

export function SportView({ type, workouts, onAddClick }: SportViewProps) {
  const { theme } = useTheme();
  const isBrutal = theme === 'brutalist';
  
  const sportWorkouts = workouts.filter(w => w.type === type);
  const colorClass = type === 'swim' ? 'text-blue-400' : type === 'bike' ? 'text-green-400' : 'text-orange-400';
  const accentBg = type === 'swim' ? 'bg-blue-600' : type === 'bike' ? 'bg-emerald-500' : 'bg-red-600';
  const bgClass = type === 'swim' ? 'bg-blue-400/10' : type === 'bike' ? 'bg-green-400/10' : 'bg-orange-400/10';

  const stats = {
    totalDistance: sportWorkouts.reduce((acc, curr) => acc + curr.distance, 0),
    totalTime: sportWorkouts.reduce((acc, curr) => acc + curr.duration, 0),
    avgIntensity: sportWorkouts.length > 0 ? (sportWorkouts.reduce((acc, curr) => acc + curr.intensity, 0) / sportWorkouts.length).toFixed(1) : 0,
    count: sportWorkouts.length
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isBrutal && (
            <div className={cn("p-4 rounded-2xl", bgClass)}>
              {type === 'swim' ? <Waves className={cn("w-8 h-8", colorClass)} /> : type === 'bike' ? <Bike className={cn("w-8 h-8", colorClass)} /> : <Footprints className={cn("w-8 h-8", colorClass)} />}
            </div>
          )}
          <div>
            {isBrutal && <span className={cn("px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white/50 border border-white/20 mb-2 inline-block", type === 'bike' && "text-black bg-emerald-500 border-none")}>{type} phase</span>}
            <h2 
              style={{ fontFamily: 'system-ui' }}
              className={cn("text-4xl font-display font-black italic tracking-tighter uppercase leading-none", isBrutal && "text-8xl brutal-title")}
            >
              {type}
            </h2>
            <p className={cn("text-xs font-bold tracking-widest opacity-40 uppercase mt-1", isBrutal && "mt-0")}>Preparation Progress</p>
          </div>
        </div>
        <button 
          onClick={onAddClick}
          className={cn(
            "flex items-center gap-2 bg-accent hover:opacity-90 px-6 py-3 rounded-xl font-bold tracking-widest uppercase shadow-lg shadow-accent/20 transition-all active:scale-95",
            isBrutal && "rounded-none border-2 border-white bg-transparent hover:bg-white hover:text-black shadow-none"
          )}
        >
          <Plus className="w-5 h-5" />
          Log {type}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={cn("bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-white/5", isBrutal && "brutal-card")}>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-1">Total Distance</p>
          <p className={cn("text-2xl font-bold italic tracking-tight", isBrutal && "text-5xl brutal-number")}>{stats.totalDistance.toFixed(1)} <span className="text-xs font-bold uppercase opacity-30">{type === 'swim' ? 'm' : 'km'}</span></p>
        </div>
        <div className={cn("bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-white/5", isBrutal && "brutal-card")}>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-1">Total Duration</p>
          <p className={cn("text-2xl font-bold italic tracking-tight", isBrutal && "text-5xl brutal-number")}>{stats.totalTime} <span className="text-xs font-bold uppercase opacity-30">min</span></p>
        </div>
        <div className={cn("bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-white/5", isBrutal && "brutal-card")}>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-1">Sessions</p>
          <p className={cn("text-2xl font-bold italic tracking-tight", isBrutal && "text-5xl brutal-number")}>{stats.count}</p>
        </div>
        <div className={cn("bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-white/5", isBrutal && "brutal-card")}>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-1">Avg Intensity</p>
          <p className={cn("text-2xl font-bold italic tracking-tight", isBrutal && "text-5xl brutal-number")}>{stats.avgIntensity} <span className="text-xs font-bold uppercase opacity-30">/ 10</span></p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold italic tracking-tight opacity-60 uppercase flex items-center gap-2">
          <Calendar className="w-5 h-5" /> History
        </h3>
        {sportWorkouts.length === 0 ? (
          <div className="bg-card/20 border border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              {type === 'swim' ? <Waves className="w-8 h-8 opacity-20" /> : type === 'bike' ? <Bike className="w-8 h-8 opacity-20" /> : <Footprints className="w-8 h-8 opacity-20" />}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-30">No {type} sessions logged yet.<br/>The starting line is waiting.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {sportWorkouts.map((w) => (
              <div key={w.id} className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-card/60 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="text-center min-w-[60px]">
                    <p className="text-2xl font-black italic tracking-tighter leading-none">{format(parseISO(w.date), 'dd')}</p>
                    <p className="text-[10px] font-bold uppercase opacity-40">{format(parseISO(w.date), 'MMM')}</p>
                  </div>
                  <div className="h-10 w-px bg-white/10 hidden md:block" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 opacity-40" />
                        <span className="text-sm font-bold tracking-tight">{w.distance} {type === 'swim' ? 'm' : 'km'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 opacity-40" />
                        <span className="text-sm font-bold tracking-tight">{w.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Gauge className="w-3 h-3 opacity-40" />
                        <span className="text-sm font-bold tracking-tight">RPE {w.intensity}</span>
                      </div>
                    </div>
                    {w.notes && (
                      <p className="text-xs opacity-50 italic mt-2 flex items-start gap-2">
                        <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                        {w.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className={cn(
                    "w-2 h-12 rounded-full",
                    w.intensity > 8 ? "bg-red-500" : w.intensity > 5 ? "bg-yellow-500" : "bg-green-500"
                  )} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
