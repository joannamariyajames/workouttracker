import React from 'react';
import { WeightLog } from '../hooks/useData';
import { Scale, TrendingDown, TrendingUp, Calendar, Trash2, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '../lib/utils';

import { useTheme } from './ThemeContext';

interface WeightTrackerProps {
  logs: WeightLog[];
  onAddClick: () => void;
}

export function WeightTracker({ logs, onAddClick }: WeightTrackerProps) {
  const { theme } = useTheme();
  const isBrutal = theme === 'brutalist';
  
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const chartData = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(l => ({
    date: format(parseISO(l.date), 'MMM d'),
    weight: l.weight
  }));

  const currentWeight = logs.length > 0 ? sortedLogs[0].weight : null;
  const startWeight = logs.length > 0 ? sortedLogs[logs.length - 1].weight : null;
  const diff = (currentWeight && startWeight) ? (currentWeight - startWeight).toFixed(1) : '0.0';

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isBrutal && (
            <div className="p-4 rounded-2xl bg-purple-400/10">
              <Scale className="w-8 h-8 text-purple-400" />
            </div>
          )}
          <div>
            {isBrutal && <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white/50 border border-white/20 mb-2 inline-block">physiology</span>}
            <h2 
              style={{ fontFamily: 'system-ui' }}
              className={cn("text-4xl font-display font-black italic tracking-tighter uppercase leading-none", isBrutal && "text-8xl brutal-title")}
            >
              Biometrics
            </h2>
            <p className="text-xs font-bold tracking-widest opacity-40 uppercase mt-1">Weight & Body Composition</p>
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
          Log Weight
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cn("bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-white/5", isBrutal && "brutal-card")}>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-1">Current Weight</p>
          <p className={cn("text-3xl font-bold italic tracking-tight", isBrutal && "text-6xl brutal-number")}>{currentWeight || '--'} <span className="text-xs font-bold uppercase opacity-30">kg</span></p>
        </div>
        <div className={cn("bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-white/5", isBrutal && "brutal-card")}>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-1">Total Change</p>
          <div className="flex items-center gap-2">
            <p className={cn(
              "text-3xl font-bold italic tracking-tight",
              isBrutal ? "text-6xl brutal-number" : (parseFloat(diff) < 0 ? "text-green-400" : parseFloat(diff) > 0 ? "text-red-400" : "")
            )}>
              {parseFloat(diff) > 0 ? `+${diff}` : diff}
            </p>
            <span className="text-xs font-bold uppercase opacity-30">kg</span>
            {parseFloat(diff) < 0 ? <TrendingDown className="text-green-400 w-5 h-5" /> : parseFloat(diff) > 0 ? <TrendingUp className="text-red-400 w-5 h-5" /> : null}
          </div>
        </div>
        <div className={cn("bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-white/5", isBrutal && "brutal-card")}>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-1">Monthly Trend</p>
          <p className={cn("text-2xl font-bold italic tracking-tight opacity-40 italic", isBrutal && "text-4xl brutal-number")}>STABLE</p>
        </div>
      </div>

      {logs.length > 1 && (
        <div className="bg-card/40 backdrop-blur-md p-8 rounded-3xl border border-white/5">
          <h3 className="text-sm font-bold tracking-widest uppercase opacity-40 mb-8">Weight Trendline</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  domain={['dataMin - 2', 'dataMax + 2']}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}
                  dx={-10}
                />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                   itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#c084fc" strokeWidth={4} dot={{ r: 4, fill: '#c084fc' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold italic tracking-tight opacity-60 uppercase flex items-center gap-2">
          <Calendar className="w-5 h-5" /> Daily Logs
        </h3>
        {logs.length === 0 ? (
          <div className="bg-card/20 border border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 text-center">
            <Scale className="w-16 h-16 opacity-10" />
            <p className="text-xs font-bold uppercase tracking-widest opacity-30">No weight logs yet.<br/>Track your transformation.</p>
          </div>
        ) : (
          <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest opacity-40">Date</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest opacity-40 text-center">Weight</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest opacity-40 text-right">Trend</th>
                </tr>
              </thead>
              <tbody>
                {sortedLogs.map((log, i) => {
                  const prev = sortedLogs[i + 1];
                  const diff = prev ? (log.weight - prev.weight).toFixed(1) : null;
                  return (
                    <tr key={log.id} className="border-b last:border-0 border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold">{format(parseISO(log.date), 'MMMM d, yyyy')}</td>
                      <td className="px-6 py-4 text-2xl font-mono italic font-bold tracking-tight text-center">{log.weight.toFixed(1)} <span className="text-[10px] opacity-30 not-italic">kg</span></td>
                      <td className="px-6 py-4 text-right">
                        {diff && (
                          <span className={cn(
                            "text-xs font-bold font-mono",
                            parseFloat(diff) < 0 ? "text-green-400" : parseFloat(diff) > 0 ? "text-red-400" : "opacity-30"
                          )}>
                            {parseFloat(diff) > 0 ? `+${diff}` : diff}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
