import { Check, ExternalLink } from 'lucide-react';
import { useTraining } from '../context/TrainingContext';

export function ChecklistItem({
  id,
  label,
  isExternal = false,
}: {
  id: string;
  label: string;
  isExternal?: boolean;
}) {
  const { checklistItems, toggleChecklistItem } = useTraining();
  const item = checklistItems.find(i => i.id === id);
  const isCompleted = item?.completed ?? false;

  return (
    <label
      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isCompleted
          ? 'border-success bg-success/5'
          : 'border-neutral-200 hover:border-gold-300 hover:bg-gold-50/30'
      }`}
    >
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => toggleChecklistItem(id)}
          className="sr-only"
        />
        <div
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
            isCompleted
              ? 'bg-success border-success'
              : 'border-neutral-300 bg-white'
          }`}
        >
          {isCompleted && (
            <Check className="w-4 h-4 text-white animate-check-bounce" />
          )}
        </div>
      </div>
      <span
        className={`flex-1 font-medium ${
          isCompleted ? 'text-success' : 'text-neutral-700'
        }`}
      >
        {label}
      </span>
      {isExternal && (
        <ExternalLink className="w-4 h-4 text-neutral-400" />
      )}
    </label>
  );
}
