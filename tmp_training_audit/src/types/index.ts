export interface Module {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  completed: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  moduleId?: number;
  isExternal?: boolean;
}

export interface TrainingState {
  modules: Module[];
  checklistItems: ChecklistItem[];
  currentView: 'dashboard' | 'module';
  currentModuleId: number | null;
}

export type ViewType = 'dashboard' | 'module-1' | 'module-2' | 'module-3' | 'module-4' | 'module-5' | 'module-6' | 'module-7' | 'module-8' | 'buy-wizard';
