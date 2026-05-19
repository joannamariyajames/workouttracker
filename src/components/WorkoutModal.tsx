import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultType?: 'swim' | 'bike' | 'run' | 'gym';
  isPlanningMode?: boolean;
  initialDate?: string;
}

export function WorkoutModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  defaultType = 'run', 
  isPlanningMode = false,
  initialDate
}: WorkoutModalProps) {
  const [formData, setFormData] = useState({
    type: defaultType,
    date: initialDate || new Date().toISOString().split('T')[0],
    distance: '',
    duration: '',
    intensity: '5',
    notes: '',
    isPlanned: isPlanningMode
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      distance: formData.type === 'gym' ? 0 : parseFloat(formData.distance || '0'),
      duration: parseFloat(formData.duration || '0'),
      intensity: parseInt(formData.intensity)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold italic tracking-tight uppercase">
            {formData.isPlanned ? 'PLAN SESSION' : 'LOG SESSION'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="grid grid-cols-4 gap-2">
            {(['swim', 'bike', 'run', 'gym'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t })}
                className={cn(
                  "py-2 rounded-lg border border-white/10 text-[10px] font-bold uppercase transition-all",
                  formData.type === t 
                    ? "bg-accent text-white scale-105" 
                    : "bg-white/5 hover:bg-white/10 opacity-60"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className={cn("text-[10px] uppercase font-bold tracking-widest opacity-50", formData.type === 'gym' && "opacity-20")}>
                {formData.type === 'swim' ? 'Distance (m)' : 'Distance (km)'}
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0.0"
                disabled={formData.type === 'gym'}
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-accent disabled:opacity-20"
                required={formData.type !== 'gym'}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Duration (min)</label>
              <input
                type="number"
                placeholder="0"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Intensity (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.intensity}
                onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                className="accent-accent"
              />
              <div className="flex justify-between text-[10px] opacity-40">
                <span>Recovery</span>
                <span>Max</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-accent h-20 resize-none text-sm"
              placeholder={formData.type === 'gym' ? 'Routine details...' : 'Session notes...'}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-accent hover:opacity-90 py-3 rounded-lg font-bold tracking-widest uppercase mt-2 shadow-lg shadow-accent/20 transition-all active:scale-95 text-white"
          >
            {formData.isPlanned ? 'Confirm Plan' : 'Save Session'}
          </button>
        </form>
      </div>
    </div>
  );
}
