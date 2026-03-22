import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { user } = useAuth();

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <header className="h-20 bg-slate-950/50 backdrop-blur-xl border-b border-slate-800/60 sticky top-0 z-40 transition-all duration-300">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center relative group">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800 w-64 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 focus:bg-slate-900 transition-all placeholder:text-slate-500 text-slate-200 font-medium shadow-inner"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2.5 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-primary-400 transition-all duration-300 group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900 group-hover:scale-110 transition-transform" />
          </button>

          <div className="h-8 w-[1px] bg-slate-800 mx-2" />

          <button className="flex items-center gap-3 p-1.5 pl-2 pr-4 rounded-xl hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-white font-bold border border-gold-400/30 shadow-sm group-hover:shadow group-hover:scale-105 transition-all">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-slate-200 group-hover:text-gold-400 transition-colors">{displayName}</p>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[150px]">{email}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
