import React, { useState } from 'react';
import { Medicine } from '../../types';
import {
  Plus,
  History,
  Clock,
  Check,
  AlertCircle,
  ChevronRight,
  Pill,
  Camera,
  Package,
  Trash2,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';
import { MedicineDetailModal } from '../modals/MedicineDetailModal';

interface Props {
  medicines: Medicine[];
  onAddMedicine: () => void;
  onOpenReminder: (medicine: Medicine) => void;
  onViewHistory: () => void;
  onOpenScanner?: () => void;
  onOpenRefill?: (medicine: Medicine) => void;
  onMarkMedicine?: (id: string, status: 'taken' | 'snoozed' | 'skipped') => void;
  onDeleteMedicine?: (id: string) => void;
}

export const MedicineListScreen: React.FC<Props> = ({
  medicines,
  onAddMedicine,
  onOpenReminder,
  onViewHistory,
  onOpenScanner,
  onOpenRefill,
  onMarkMedicine,
  onDeleteMedicine,
}) => {
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);

  const getFrequencyLabel = (period: string) => {
    switch (period) {
      case 'Morning':
        return 'Every morning';
      case 'Noon':
        return 'Daily at lunchtime';
      case 'Evening':
        return 'Every evening';
      case 'Bedtime':
        return 'Nightly at bedtime';
      default:
        return 'Daily';
    }
  };

  const handleMedicineClick = (med: Medicine) => {
    playChime('subtle');
    triggerHaptic(20);
    setSelectedMed(med);
  };

  return (
    <div className="flex flex-col min-h-full px-5 py-6 space-y-6 max-w-xl mx-auto w-full animate-fadeIn pb-12">
      {/* 6. Header: My Medicines */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Medicines
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your medications and schedules.
          </p>
        </div>

        {/* Primary Action: + Add Medicine */}
        <button
          type="button"
          onClick={onAddMedicine}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* Quick utility bar: Scan bottle & History */}
      <div className="flex items-center gap-2">
        {onOpenScanner && (
          <button
            type="button"
            onClick={onOpenScanner}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200/60 dark:border-slate-700"
          >
            <Camera className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Scan Bottle</span>
          </button>
        )}

        <button
          type="button"
          onClick={onViewHistory}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200/60 dark:border-slate-700"
        >
          <History className="w-3.5 h-3.5 text-slate-500" />
          <span>Past History</span>
        </button>
      </div>

      {/* Medication List */}
      <div className="space-y-3">
        {medicines.map((med) => {
          const isTaken = med.status === 'taken';
          const isMissed = med.status === 'missed';
          const isLowSupply = (med.remainingCount ?? 30) <= (med.refillThreshold ?? 7);

          return (
            <div
              key={med.id}
              onClick={() => handleMedicineClick(med)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer space-y-3"
            >
              {/* Row 1: Medicine name, dosage, and status */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {med.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                    {med.dose}
                  </p>
                </div>

                {/* Status indicator and quick delete when taken */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      isTaken
                        ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300'
                        : isMissed
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {isTaken ? '✓ Taken today' : isMissed ? 'Past due' : 'Upcoming'}
                  </span>

                  {isTaken && onDeleteMedicine && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete ${med.name} from your medicines?`)) {
                          onDeleteMedicine(med.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                      title="Delete tablet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Frequency & Next dose metadata (unboxed text discipline) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 truncate">
                  <span>Frequency: {getFrequencyLabel(med.period)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Next dose: {med.time}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isLowSupply && (
                    <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 mr-1">
                      Low stock ({med.remainingCount} left)
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Redesigned Medicine Detail Modal */}
      <MedicineDetailModal
        medicine={selectedMed}
        isOpen={!!selectedMed}
        onClose={() => setSelectedMed(null)}
        onMark={(id, status) => {
          if (onMarkMedicine) onMarkMedicine(id, status);
        }}
        onOpenRefill={onOpenRefill}
        onDelete={onDeleteMedicine}
      />
    </div>
  );
};
