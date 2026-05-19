import React, { useState } from 'react';
import { X } from 'lucide-react';

interface WeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function WeightModal({ isOpen, onClose, onSubmit }: WeightModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold italic tracking-tight">LOG WEIGHT</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            ...formData,
            weight: parseFloat(formData.weight)
          });
          onClose();
        }} className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              placeholder="00.0"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-3xl font-mono text-center focus:outline-hidden focus:ring-2 focus:ring-accent"
              required
              autoFocus
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-accent hover:opacity-90 py-4 rounded-lg font-bold tracking-widest uppercase shadow-lg shadow-accent/20 transition-all active:scale-95"
          >
            Log Weight
          </button>
        </form>
      </div>
    </div>
  );
}
