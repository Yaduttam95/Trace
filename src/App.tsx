import { useState, useEffect } from 'react';
import CaptureForm from './components/CaptureForm';
import Inbox from './components/Inbox';
import { Sun, Moon, Inbox as InboxIcon, Edit3 } from 'lucide-react';

const logoUrl = '/Logo.png';

function App() {
  const [view, setView] = useState<'capture' | 'inbox'>('capture');
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${theme === 'dark' ? 'dark bg-neutral-950 text-neutral-100' : 'bg-slate-50 text-slate-900'}`}>
      
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border-b border-slate-200 dark:border-neutral-900 px-4 md:px-8 py-3 flex items-center justify-between transition-colors duration-500">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Trace Logo" className="h-8 md:h-10 object-contain drop-shadow-sm" />
        </div>
        
        <div className="flex items-center bg-slate-100 dark:bg-neutral-900/80 p-1 rounded-full border border-slate-200 dark:border-neutral-800 shadow-inner">
          <button 
            onClick={() => setView('capture')}
            className={`flex items-center gap-1.5 px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
              view === 'capture' 
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-neutral-700' 
                : 'text-slate-500 dark:text-neutral-500 hover:text-slate-700 dark:hover:text-neutral-300'
            }`}
          >
            <Edit3 size={16} /> <span className="hidden xs:inline">Capture</span>
          </button>
          <button 
            onClick={() => setView('inbox')}
            className={`flex items-center gap-1.5 px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
              view === 'inbox' 
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-neutral-700' 
                : 'text-slate-500 dark:text-neutral-500 hover:text-slate-700 dark:hover:text-neutral-300'
            }`}
          >
            <InboxIcon size={16} /> <span className="hidden xs:inline">Inbox</span>
          </button>
        </div>

        <button 
          onClick={toggleTheme}
          className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-center text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-neutral-800 transition-all outline-none focus:ring-2 focus:ring-teal-500/50"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>

      <main className="pt-24 pb-12 w-full flex flex-col items-center">
        {view === 'capture' ? <CaptureForm /> : <Inbox />}
      </main>
      
    </div>
  );
}

export default App;
