import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { ChecklistItem, ViewType } from '../types';

interface User {
  email: string;
  isUnrestricted?: boolean;
}

interface TrainingContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  checklistItems: ChecklistItem[];
  toggleChecklistItem: (id: string) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
  isCertified: boolean;
  isLoading: boolean;
}

const STORAGE_KEY_PREFIX = 'gbb-training-progress-';
const USER_KEY = 'gbb-training-user';

const initialChecklistItems: ChecklistItem[] = [
  { id: 'module-1', label: 'Module 1: Contractor Master Agreement', completed: false, moduleId: 1 },
  { id: 'module-2', label: 'Module 2: Sales Compliance Playbook', completed: false, moduleId: 2 },
  { id: 'module-3', label: 'Module 3: FAQ & Rebuttals', completed: false, moduleId: 3 },
  { id: 'module-4', label: 'Module 4: Product Comparison Matrix', completed: false, moduleId: 4 },
  { id: 'module-5', label: 'Module 5: Referral Fee Schedule', completed: false, moduleId: 5 },
  { id: 'module-6', label: 'Module 6: CRM Platform Training', completed: false, moduleId: 6 },
  { id: 'module-7', label: 'Module 7: AI Sales Simulator', completed: false, moduleId: 7 },
  { id: 'module-8', label: 'Module 8: AI Mentorship Hub', completed: false, moduleId: 8 },
  { id: 'contract', label: 'Signed Contractor Agreement (via OpenSign)', completed: false, isExternal: true },
];

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(initialChecklistItems);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  
  // Use a ref to track if we are currently loading state to prevent immediate save triggers
  const isInitialLoad = useRef(true);

  // Load progress when user changes
  useEffect(() => {
    setIsLoading(true);
    if (user) {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + user.email.toLowerCase());
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setChecklistItems(parsed);
        } catch (e) {
          console.error("Failed to parse progress:", e);
          setChecklistItems(initialChecklistItems);
        }
      } else {
        setChecklistItems(initialChecklistItems);
      }
    } else {
      setChecklistItems(initialChecklistItems);
    }
    
    // Set a small timeout to ensure state has settled before allowing saves
    const timer = setTimeout(() => {
      isInitialLoad.current = false;
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user?.email]);

  // Save progress when it changes
  useEffect(() => {
    // Only save if we are NOT in the initial load phase and have a user
    if (!isInitialLoad.current && user) {
      localStorage.setItem(STORAGE_KEY_PREFIX + user.email.toLowerCase(), JSON.stringify(checklistItems));
    }
  }, [checklistItems, user?.email]);

  const login = (email: string) => {
    const lowerEmail = email.toLowerCase();
    const isUnrestricted = 
      lowerEmail === 'sydney@goldbackbond.com' || 
      lowerEmail === 'bmegacoach1@gmail.com' || 
      lowerEmail === 'bmegacoach2@gmail.com' || 
      lowerEmail === 'bmegacoach3@gmail.com'; // Added coach 3 for future
      
    const newUser = { email, isUnrestricted };
    isInitialLoad.current = true; // Block save until the load effect settles the new user's specific data
    setUser(newUser);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    setCurrentView('dashboard');
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);
  const isCertified = completedCount === totalCount;

  return (
    <TrainingContext.Provider
      value={{
        user,
        login,
        logout,
        checklistItems,
        toggleChecklistItem,
        currentView,
        setCurrentView,
        completedCount,
        totalCount,
        progressPercentage,
        isCertified,
        isLoading,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
}

export function useTraining() {
  const context = useContext(TrainingContext);
  if (context === undefined) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
}
