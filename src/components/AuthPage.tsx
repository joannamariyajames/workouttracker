import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Calendar, Key, ArrowRight, Activity, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from './ThemeContext';

interface AuthPageProps {
  onLogin: (user: any) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const { theme } = useTheme();
  const isBrutal = theme === 'brutalist';
  
  const [mode, setMode] = useState<'login' | 'signup' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, dob }),
        });
        const data = await res.json();
        if (data.success) {
          setMode('verify');
        } else {
          setError(data.error || 'Signup failed');
        }
      } else if (mode === 'verify') {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code }),
        });
        const data = await res.json();
        if (data.success) {
          onLogin(data.user);
        } else {
          setError(data.error || 'Verification failed');
        }
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, dob }),
        });
        const data = await res.json();
        if (data.success) {
          onLogin(data.user);
        } else {
          setError(data.error || 'Invalid credentials');
        }
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "w-full max-w-md p-10 bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl",
          isBrutal && "brutal-card border-4 border-white bg-black rounded-none shadow-[20px_20px_0px_0px_rgba(255,255,255,0.1)]"
        )}
      >
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <Activity className={cn("w-12 h-12 text-accent", isBrutal && "animate-none text-white")} />
          <h1 className={cn("text-4xl font-black tracking-tighter uppercase italic", isBrutal && "text-6xl brutal-title not-italic")}>
            {mode === 'verify' ? 'VERIFY' : mode === 'signup' ? 'JOIN TEAM' : 'ACCESS PORTAL'}
          </h1>
          <p className="text-xs font-bold tracking-widest uppercase opacity-40">
            {mode === 'verify' ? 'Enter the code sent to your email' : 'Elite Training Protocol'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 text-[10px] uppercase font-bold text-red-500 tracking-wider">
              Error: {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold tracking-widest opacity-40">Email Protocol</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                type="email"
                required
                value={email}
                disabled={mode === 'verify'}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@ironman.com"
                className={cn(
                  "w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent outline-none font-bold",
                  isBrutal && "rounded-none border-2 border-white focus:ring-0 focus:bg-white focus:text-black transition-colors"
                )}
              />
            </div>
          </div>

          {mode !== 'verify' && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold tracking-widest opacity-40">Verification Key (DOB)</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={cn(
                    "w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent outline-none font-bold",
                    isBrutal && "rounded-none border-2 border-white focus:ring-0 focus:bg-white focus:text-black transition-colors"
                  )}
                />
              </div>
              <p className="text-[10px] opacity-30 mt-1 uppercase italic tracking-wider">Your DOB serves as your secure account key</p>
            </div>
          )}

          {mode === 'verify' && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold tracking-widest opacity-40">6-Digit Code</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  className={cn(
                    "w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent outline-none font-mono text-xl font-bold tracking-widest",
                    isBrutal && "rounded-none border-2 border-white focus:ring-0 focus:bg-white focus:text-black"
                  )}
                />
              </div>
              <p className="text-[10px] opacity-30 mt-1 uppercase italic tracking-wider">Check server console logs for your code</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "flex items-center justify-center gap-3 w-full py-4 bg-accent text-white rounded-xl font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-accent/20",
              isBrutal && "rounded-none border-4 border-white bg-transparent hover:bg-white hover:text-black shadow-none scale-100",
              loading && "opacity-50 pointer-events-none"
            )}
          >
            {loading ? 'PROCESSING...' : mode === 'verify' ? 'VERIFY CODE' : mode === 'signup' ? 'REGISTER' : 'LOGIN'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 flex justify-center gap-4">
          {mode === 'login' ? (
            <button onClick={() => setMode('signup')} className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 underline decoration-2 underline-offset-4">
              Create New Athlete Account
            </button>
          ) : (
            <button onClick={() => setMode('login')} className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 underline decoration-2 underline-offset-4">
              Return to Login Portal
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
