import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar
} from 'recharts';
import { Workout, WeightLog } from '../hooks/useData';
import { Waves, Bike, Footprints, Scale, Trophy, Flame } from 'lucide-react';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { cn } from '../lib/utils';

import { useTheme } from './ThemeContext';

interface DashboardProps {
  workouts: Workout[];
  weightLogs: WeightLog[];
}

function StatCard({ icon: Icon, label, value, unit, color, theme }: any) {
  const isBrutal = theme === 'brutalist';

  return (
    <div className={cn(
      "bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 flex flex-col gap-2 h-full",
      isBrutal ? "brutal-card border-l-4" : ""
    )}>
      <div className="flex justify-between items-start">
        {!isBrutal && (
          <div className="p-2 rounded-lg bg-white/5">
            <Icon className={color} />
          </div>
        )}
        {isBrutal && (
          <span className={cn("px-2 py-1 text-[10px] font-bold uppercase tracking-widest", 
            label.includes('Swim') ? "bg-blue-600" : 
            label.includes('Bike') ? "bg-emerald-500 text-black" : 
            label.includes('Run') ? "bg-red-600" : 
            label.includes('Current Weight') ? "bg-purple-600" : "bg-zinc-700"
          )}>
            {label.split(' ').pop()}
          </span>
        )}
      </div>
      <p className={cn("text-[10px] uppercase font-bold tracking-widest opacity-50", isBrutal && "mt-4")}>{label}</p>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-3xl font-bold italic tracking-tighter", isBrutal && "text-6xl brutal-number")}>{value}</span>
        <span className="text-xs opacity-40 font-bold uppercase">{unit}</span>
      </div>
    </div>
  );
}

import { Dumbbell } from 'lucide-react';

export function Dashboard({ workouts, weightLogs }: DashboardProps) {
  const { theme } = useTheme();
  const isBrutal = theme === 'brutalist';
  
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), i);
    return format(d, 'yyyy-MM-dd');
  }).reverse();

  const chartData = last7Days.map(dateStr => {
    const dayWorkouts = workouts.filter(w => w.date === dateStr);
    const swim = dayWorkouts.filter(w => w.type === 'swim').reduce((acc, curr) => acc + curr.distance, 0);
    const bike = dayWorkouts.filter(w => w.type === 'bike').reduce((acc, curr) => acc + curr.distance, 0);
    const run = dayWorkouts.filter(w => w.type === 'run').reduce((acc, curr) => acc + curr.distance, 0);
    return {
      date: format(parseISO(dateStr), 'MMM d'),
      swim,
      bike,
      run
    };
  });

  const totals = {
    swim: workouts.filter(w => w.type === 'swim').reduce((acc, curr) => acc + curr.distance, 0),
    bike: workouts.filter(w => w.type === 'bike').reduce((acc, curr) => acc + curr.distance, 0),
    run: workouts.filter(w => w.type === 'run').reduce((acc, curr) => acc + curr.distance, 0),
    calories: workouts.reduce((acc, curr) => acc + (curr.duration * 10), 0) // rough estimate
  };

  const currentWeight = weightLogs.length > 0 ? weightLogs[0].weight : '--';

  return (
    <div className="flex flex-col gap-8 pb-12">
      <header className={cn("flex flex-col gap-6", isBrutal && "border-b border-white/20 pb-8 mb-4")}>
        <div className="flex items-center justify-between">
          <h2 
            style={{ fontSize: '86px', fontFamily: 'system-ui' }}
            className={cn("font-black tracking-tighter uppercase", !isBrutal && "italic", isBrutal && "leading-[0.85] italic-none")}
          >
            {isBrutal ? <>WORKOUT<br/>TRACKER</> : "Overview"}
          </h2>
          {isBrutal && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">Days to Race</p>
              <p className="text-7xl font-black tabular-nums tracking-tighter brutal-number">048</p>
            </div>
          )}
          {!isBrutal && (
            <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
              <button className="px-4 py-1 text-xs font-bold bg-accent rounded-md shadow-lg">Weekly</button>
              <button className="px-4 py-1 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity">Monthly</button>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard theme={theme} icon={Waves} label="Total Swim" value={totals.swim.toFixed(0)} unit="m" color="text-blue-400" />
        <StatCard theme={theme} icon={Bike} label="Total Bike" value={totals.bike.toFixed(1)} unit="km" color="text-green-400" />
        <StatCard theme={theme} icon={Footprints} label="Total Run" value={totals.run.toFixed(1)} unit="km" color="text-orange-400" />
        <StatCard theme={theme} icon={Scale} label="Current Weight" value={currentWeight} unit="kg" color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card/40 backdrop-blur-md p-8 rounded-3xl border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold italic tracking-tight uppercase">Training Volume</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase opacity-60">
                <div className="w-2 h-2 rounded-full bg-blue-400" /> Swim
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase opacity-60">
                <div className="w-2 h-2 rounded-full bg-green-400" /> Bike
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase opacity-60">
                <div className="w-2 h-2 rounded-full bg-orange-400" /> Run
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSwim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBike" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRun" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="swim" stroke="#60a5fa" fillOpacity={1} fill="url(#colorSwim)" strokeWidth={3} />
                <Area type="monotone" dataKey="bike" stroke="#4ade80" fillOpacity={1} fill="url(#colorBike)" strokeWidth={3} />
                <Area type="monotone" dataKey="run" stroke="#fb923c" fillOpacity={1} fill="url(#colorRun)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 flex flex-col gap-6">
          <h3 className="text-lg font-bold italic tracking-tight uppercase">Recent Activity</h3>
          <div className="flex flex-col gap-4">
            {workouts.slice(0, 5).map((w, i) => (
              <div key={w.id} className="flex items-center gap-4 group">
                <div className={cn(
                  "p-2 rounded-lg bg-white/5 transition-transform group-hover:scale-110",
                  w.type === 'swim' && "text-blue-400",
                  w.type === 'bike' && "text-green-400",
                  w.type === 'run' && "text-orange-400",
                  w.type === 'gym' && "text-purple-400"
                )}>
                  {w.type === 'swim' ? <Waves className="w-5 h-5" /> : 
                   w.type === 'bike' ? <Bike className="w-5 h-5" /> : 
                   w.type === 'run' ? <Footprints className="w-5 h-5" /> : 
                   <Dumbbell className="w-5 h-5" />}
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-bold capitalize">{w.type}</p>
                  <p className="text-[10px] opacity-40 font-bold uppercase">{format(parseISO(w.date), 'MMM d, yyyy')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold tracking-tight">
                    {w.type === 'gym' ? `${w.duration} min` : (
                      <>
                        {w.distance} <span className="text-[10px] opacity-40 uppercase">{w.type === 'swim' ? 'm' : 'km'}</span>
                      </>
                    )}
                  </p>
                  {w.type !== 'gym' && <p className="text-[10px] opacity-40 font-bold uppercase">{w.duration} min</p>}
                </div>
              </div>
            ))}
            {workouts.length === 0 && (
              <div className="h-40 flex flex-col items-center justify-center opacity-20 text-center gap-4">
                <Trophy className="w-12 h-12" />
                <p className="text-xs font-bold uppercase tracking-widest">No logs yet.<br/>Time to grind.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
