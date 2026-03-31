import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  HelpCircle,
  GitCompare,
  DollarSign,
  MonitorSmartphone,
  Award,
  Menu,
  X,
  Bot,
  Activity,
  LogOut,
  UserPlus
} from 'lucide-react';
import { useTraining } from '../context/TrainingContext';
import { ProgressRing } from './ProgressRing';
import { ViewType } from '../types';
import { useState } from 'react';

const navItems: { id: ViewType; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Dashboard', icon: LayoutDashboard },
  { id: 'module-1', label: 'Contractor Agreement', shortLabel: 'Module 1', icon: FileText },
  { id: 'module-2', label: 'Compliance Playbook', shortLabel: 'Module 2', icon: ShieldCheck },
  { id: 'module-3', label: 'FAQ & Rebuttals', shortLabel: 'Module 3', icon: HelpCircle },
  { id: 'module-4', label: 'Product Comparison', shortLabel: 'Module 4', icon: GitCompare },
  { id: 'module-5', label: 'Referral Fees', shortLabel: 'Module 5', icon: DollarSign },
  { id: 'module-6', label: 'CRM Platform', shortLabel: 'Module 6', icon: MonitorSmartphone },
  { id: 'module-7', label: 'AI Sales Simulator', shortLabel: 'Module 7', icon: Bot },
  { id: 'module-8', label: 'AI Mentorship Hub', shortLabel: 'Module 8', icon: Activity },
  { id: 'buy-wizard', label: 'Client Onboarding', shortLabel: 'Wizard', icon: UserPlus },
];

export function Sidebar() {
  const { currentView, setCurrentView, checklistItems, isCertified, logout } = useTraining();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isModuleCompleted = (viewId: ViewType) => {
    if (viewId === 'dashboard') return false;
    const item = checklistItems.find(item => item.id === viewId);
    return item?.completed ?? false;
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <div>
            <h1 className="font-bold text-neutral-900 text-lg leading-tight">Goldbackbond</h1>
            <p className="text-xs text-neutral-500">Sales Training</p>
          </div>
        </div>
      </div>

      {/* Progress Widget */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <ProgressRing size={56} strokeWidth={5} />
          <div>
            <p className="text-sm font-medium text-neutral-900">Training Progress</p>
            <p className="text-xs text-neutral-500">
              {checklistItems.filter(i => i.completed).length} of {checklistItems.length} complete
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = currentView === item.id;
          const isCompleted = isModuleCompleted(item.id);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${isActive
                  ? 'bg-gold-50 text-gold-700 border-l-[3px] border-gold-500 -ml-[3px] pl-[calc(0.75rem+3px)]'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-gold-600' : ''}`} />
              <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
              {isCompleted && (
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Certification Status */}
      <div className="p-4 border-t border-neutral-200">
        <div
          className={`p-4 rounded-xl ${isCertified
              ? 'bg-gradient-to-br from-gold-500 to-gold-400 text-white'
              : 'bg-neutral-100 text-neutral-600'
            }`}
        >
          <div className="flex items-center gap-3">
            <Award className={`w-6 h-6 ${isCertified ? 'text-white' : 'text-neutral-400'}`} />
            <div>
              <p className="font-semibold text-sm">
                {isCertified ? 'CERTIFIED' : 'Not Certified'}
              </p>
              <p className={`text-xs ${isCertified ? 'text-gold-100' : 'text-neutral-500'}`}>
                {isCertified ? 'Training Complete' : 'Complete all modules'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-neutral-200 mt-auto">
        <a
          href="mailto:support@goldbackbond.com"
          className="flex items-center gap-3 w-full p-3 text-neutral-500 hover:text-gold-600 hover:bg-neutral-50 rounded-xl transition-all duration-200 font-medium group mb-2"
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 group-hover:bg-gold-50 transition-colors">
            <HelpCircle className="w-5 h-5 group-hover:text-gold-600" />
          </div>
          <span className="text-sm">Contact Support</span>
        </a>
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 w-full p-3 text-neutral-500 hover:text-red-600 hover:bg-neutral-50 rounded-xl transition-all duration-200 font-medium group"
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 group-hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5 group-hover:text-red-600" />
          </div>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center">
            <span className="text-white font-bold">G</span>
          </div>
          <span className="font-bold text-neutral-900">GBB Training</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          <NavContent />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-white border-r border-neutral-200 h-screen sticky top-0">
        <NavContent />
      </aside>
    </>
  );
}
