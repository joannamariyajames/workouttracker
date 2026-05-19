import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Waves, Bike, Footprints, Dumbbell, Plus } from 'lucide-react';
import { Workout } from '../hooks/useData';
import { useTheme } from './ThemeContext';
import { cn } from '../lib/utils';

interface CalendarViewProps {
  workouts: Workout[];
  onAddClick: (date: string) => void;
}

export function CalendarView({ workouts, onAddClick }: CalendarViewProps) {
  const { theme } = useTheme();
  const isBrutal = theme === 'brutalist';
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getWorkoutIcon = (type: string) => {
    switch (type) {
      case 'swim': return <Waves className="w-3 h-3 text-blue-400" />;
      case 'bike': return <Bike className="w-3 h-3 text-green-400" />;
      case 'run': return <Footprints className="w-3 h-3 text-orange-400" />;
      case 'gym': return <Dumbbell className="w-3 h-3 text-purple-400" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isBrutal && (
            <div className="p-4 rounded-2xl bg-indigo-400/10">
              <CalendarIcon className="w-8 h-8 text-indigo-400" />
            </div>
          )}
          <div>
            {isBrutal && <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white/50 border border-white/20 mb-2 inline-block">competition planner</span>}
            <h2 
              style={{ fontFamily: 'system-ui' }}
              className={cn("text-4xl font-display font-black italic tracking-tighter uppercase leading-none", isBrutal && "text-8xl brutal-title")}
            >
              CALENDAR
            </h2>
            <p className="text-xs font-bold tracking-widest opacity-40 uppercase mt-1">Schedule your training blocks</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h3 className="text-xl font-bold uppercase tracking-widest min-w-[150px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <button 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className={cn(
        "bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden",
        isBrutal && "brutal-card"
      )}>
        <div className="grid grid-cols-7 border-b border-white/10">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="px-4 py-3 text-center text-[10px] uppercase font-bold tracking-widest opacity-40">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayWorkouts = workouts.filter(w => w.date === dateStr);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <div 
                key={day.toString()}
                className={cn(
                  "min-h-[120px] p-2 border-r border-b border-white/5 relative group transition-colors",
                  !isCurrentMonth && "opacity-20",
                  isToday && "bg-white/5",
                  "hover:bg-white/10"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "text-xs font-bold font-mono px-2 py-0.5 rounded-full",
                    isToday && "bg-accent text-white"
                  )}>
                    {format(day, 'd')}
                  </span>
                  <button 
                    onClick={() => onAddClick(dateStr)}
                    className="p-1 rounded bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  {dayWorkouts.map(w => (
                    <div 
                      key={w.id}
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight truncate",
                        w.isPlanned ? "border border-white/20 opacity-60" : "bg-white/10"
                      )}
                      title={`${w.type}: ${w.notes || ''}`}
                    >
                      {getWorkoutIcon(w.type)}
                      <span className="truncate">{w.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
