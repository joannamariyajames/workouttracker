import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SportView } from './components/SportView';
import { WeightTracker } from './components/WeightTracker';
import { WorkoutModal } from './components/WorkoutModal';
import { WeightModal } from './components/WeightModal';
import { useData } from './hooks/useData';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from 'lucide-react';
import { AuthPage } from './components/AuthPage';

import { CalendarView } from './components/CalendarView';
import { GymView } from './components/GymView';

function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isWorkoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [isWeightModalOpen, setWeightModalOpen] = useState(false);
  const [planningDate, setPlanningDate] = useState<string | undefined>(undefined);
  
  const { workouts, weightLogs, gymRoutines, addWorkout, addWeightLog, updateGymRoutine } = useData();
  const { theme } = useTheme();

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <AuthPage onLogin={setUser} />
      </div>
    );
  }

  const handleCalendarAdd = (date: string) => {
    setPlanningDate(date);
    setWorkoutModalOpen(true);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard workouts={workouts} weightLogs={weightLogs} />;
      case 'calendar':
        return <CalendarView workouts={workouts} onAddClick={handleCalendarAdd} />;
      case 'gym':
        return <GymView gymRoutines={gymRoutines} updateRoutine={updateGymRoutine} />;
      case 'swim':
      case 'bike':
      case 'run':
        return <SportView type={activeSection as any} workouts={workouts} onAddClick={() => {
          setPlanningDate(undefined);
          setWorkoutModalOpen(true);
        }} />;
      case 'weight':
        return <WeightTracker logs={weightLogs} onAddClick={() => setWeightModalOpen(true)} />;
      default:
        return <Dashboard workouts={workouts} weightLogs={weightLogs} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-bg font-sans selection:bg-accent/30 selection:text-accent overflow-x-hidden transition-colors duration-500">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} onLogout={() => setUser(null)} />
      
      <main className="flex-grow ml-64 p-12 max-w-7xl min-h-screen bg-card/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      <WorkoutModal 
        isOpen={isWorkoutModalOpen} 
        onClose={() => {
          setWorkoutModalOpen(false);
          setPlanningDate(undefined);
        }} 
        onSubmit={addWorkout}
        defaultType={['swim', 'bike', 'run', 'gym'].includes(activeSection) ? activeSection as any : 'run'}
        isPlanningMode={!!planningDate}
        initialDate={planningDate}
      />
      
      <WeightModal
        isOpen={isWeightModalOpen}
        onClose={() => setWeightModalOpen(false)}
        onSubmit={addWeightLog}
      />

      {activeSection === 'dashboard' && (
        <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
          <button 
            onClick={() => setWorkoutModalOpen(true)}
            className="w-14 h-14 bg-accent rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all group relative"
          >
            <motion.div animate={{ rotate: [0, 90, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
              <Activity className="w-6 h-6" />
            </motion.div>
            <span className="absolute right-full mr-4 bg-card px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Log Workout
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
