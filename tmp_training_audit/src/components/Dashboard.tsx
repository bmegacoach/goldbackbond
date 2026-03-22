import {
  Award,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  FileText,
  ShieldCheck,
  HelpCircle,
  GitCompare,
  DollarSign,
  MonitorSmartphone,
} from 'lucide-react';
import { useTraining } from '../context/TrainingContext';
import { ProgressRing } from './ProgressRing';
import { ChecklistItem } from './ChecklistItem';
import { ViewType } from '../types';

const moduleInfo: { id: ViewType; title: string; icon: React.ElementType; description: string }[] = [
  {
    id: 'module-1',
    title: 'Contractor Master Agreement',
    icon: FileText,
    description: 'USDGB token structure, attestation parties, and legal framework',
  },
  {
    id: 'module-2',
    title: 'Sales Compliance Playbook',
    icon: ShieldCheck,
    description: 'What you CAN and CANNOT do as a contractor',
  },
  {
    id: 'module-3',
    title: 'FAQ & Rebuttals',
    icon: HelpCircle,
    description: 'Product FAQs and objection handling scripts',
  },
  {
    id: 'module-4',
    title: 'Product Comparison Matrix',
    icon: GitCompare,
    description: 'USDGB vs competitors and key differentiators',
  },
  {
    id: 'module-5',
    title: 'Referral Fee Schedule',
    icon: DollarSign,
    description: 'Tiered compensation structure and bonuses',
  },
  {
    id: 'module-6',
    title: 'CRM Platform Training',
    icon: MonitorSmartphone,
    description: 'Master the GoldBackBond Agency CRM for daily operations',
  },
  {
    id: 'module-7',
    title: 'AI Sales Simulator',
    icon: BookOpen,
    description: 'Practice real-world sales scenarios with our AI-powered simulator',
  },
  {
    id: 'module-8',
    title: 'AI Mentorship Hub',
    icon: Award,
    description: 'Your daily check-in with the Elite Sales Coach and knowledge exams',
  },
];

export function Dashboard() {
  const { setCurrentView, checklistItems, completedCount, totalCount, isCertified } = useTraining();

  const isModuleCompleted = (moduleId: ViewType) => {
    const item = checklistItems.find(item => item.id === moduleId);
    return item?.completed ?? false;
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Welcome to GBB Sales Training
            </h1>
            <p className="text-neutral-600 max-w-xl">
              Complete all training modules and sign the contractor agreement to receive your
              certification and begin sales activities.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <ProgressRing size={100} strokeWidth={8} />
            <div>
              <p className="text-4xl font-bold text-neutral-900">{completedCount}/{totalCount}</p>
              <p className="text-sm text-neutral-500">Steps Complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certification Banner */}
      {isCertified ? (
        <div className="bg-gradient-to-r from-gold-500 to-gold-400 rounded-2xl p-8 mb-8 text-white shadow-gold">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Congratulations! You are CERTIFIED</h2>
              <p className="text-gold-100">
                You have completed all training modules and signed the contractor agreement.
                You are now authorized to begin sales activities.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-100 rounded-2xl p-6 mb-8 border border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-neutral-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Training In Progress</h3>
              <p className="text-sm text-neutral-500">
                Complete all {totalCount} items to receive your certification
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {moduleInfo.map(module => {
          const isCompleted = isModuleCompleted(module.id);
          const Icon = module.icon;

          return (
            <button
              key={module.id}
              onClick={() => setCurrentView(module.id)}
              className={`text-left p-6 rounded-xl border-2 transition-all duration-200 group ${
                isCompleted
                  ? 'border-success bg-success/5 hover:bg-success/10'
                  : 'border-neutral-200 bg-white hover:border-gold-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isCompleted ? 'bg-success/20' : 'bg-gold-50'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isCompleted ? 'text-success' : 'text-gold-600'}`}
                  />
                </div>
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-success" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-gold-500 transition-colors" />
                )}
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">{module.title}</h3>
              <p className="text-sm text-neutral-500 line-clamp-2">{module.description}</p>
            </button>
          );
        })}
      </div>

      {/* Action Checklist */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Training Checklist</h2>
        <div className="space-y-3">
          <ChecklistItem id="module-1" label="Module 1: Contractor Master Agreement" />
          <ChecklistItem id="module-2" label="Module 2: Sales Compliance Playbook" />
          <ChecklistItem id="module-3" label="Module 3: FAQ & Rebuttals" />
          <ChecklistItem id="module-4" label="Module 4: Product Comparison Matrix" />
          <ChecklistItem id="module-5" label="Module 5: Referral Fee Schedule" />
          <ChecklistItem id="module-6" label="Module 6: CRM Platform Training" />
          <ChecklistItem
            id="contract"
            label="Signed Contractor Agreement (via OpenSign)"
            isExternal
          />
        </div>
      </div>
    </div>
  );
}
