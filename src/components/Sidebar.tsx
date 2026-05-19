import React from 'react';
import { useTheme } from './ThemeContext';
import { 
  Activity, 
  Waves, 
  Bike, 
  Footprints, 
  Scale, 
  Settings, 
  LayoutDashboard,
  LogOut,
  User,
  Calendar as CalendarIcon,
  Dumbbell
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      id={`nav-${label.toLowerCase()}`}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left",
        active 
          ? "bg-accent shadow-lg text-white" 
          : "hover:bg-white/10 opacity-70 hover:opacity-100"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

export function Sidebar({ activeSection, onSectionChange, onLogout }: { 
  activeSection: string; 
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}) {
  const { setTheme, theme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/10 p-6 flex flex-col gap-8 bg-card/50 backdrop-blur-xl z-50">
      <div className="flex items-center gap-3">
        <Activity className="w-8 h-8 text-accent animate-pulse" />
        <h1 className="text-2xl font-display font-bold italic tracking-tighter">
          WORKOUT<span className="text-accent">TRACKER</span>
        </h1>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        <NavItem 
          icon={<LayoutDashboard />} 
          label="Dashboard" 
          active={activeSection === 'dashboard'} 
          onClick={() => onSectionChange('dashboard')} 
        />
        <NavItem 
          icon={<CalendarIcon />} 
          label="Calendar" 
          active={activeSection === 'calendar'} 
          onClick={() => onSectionChange('calendar')} 
        />
        <NavItem 
          icon={<Dumbbell />} 
          label="Gym" 
          active={activeSection === 'gym'} 
          onClick={() => onSectionChange('gym')} 
        />
        <NavItem 
          icon={<Waves />} 
          label="Swimming" 
          active={activeSection === 'swim'} 
          onClick={() => onSectionChange('swim')} 
        />
        <NavItem 
          icon={<Bike />} 
          label="Cycling" 
          active={activeSection === 'bike'} 
          onClick={() => onSectionChange('bike')} 
        />
        <NavItem 
          icon={<Footprints />} 
          label="Running" 
          active={activeSection === 'run'} 
          onClick={() => onSectionChange('run')} 
        />
        <NavItem 
          icon={<Scale />} 
          label="Weight" 
          active={activeSection === 'weight'} 
          onClick={() => onSectionChange('weight')} 
        />
      </nav>

      <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-widest opacity-50 px-4">Appearance</p>
          <div className="flex gap-2 px-4 mb-4">
            {(['stealth', 'elite', 'endurance', 'brutalist'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                  t === 'stealth' && "bg-slate-900 border-green-500",
                  t === 'elite' && "bg-blue-600 border-slate-200",
                  t === 'endurance' && "bg-orange-500 border-slate-900",
                  t === 'brutalist' && "bg-black border-white",
                  theme === t ? "scale-125 ring-2 ring-white/20" : "opacity-40"
                )}
                title={`Switch to ${t} theme`}
              />
            ))}
          </div>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left hover:bg-red-500/10 text-red-500/70 hover:text-red-500"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold uppercase text-xs tracking-widest">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
