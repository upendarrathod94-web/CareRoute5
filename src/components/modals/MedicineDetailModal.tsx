import React, { useState } from 'react';
import { Medicine } from '../../types';
import {
  X,
  Check,
  RotateCcw,
  Clock,
  Calendar,
  Package,
  AlertTriangle,
  Building2,
  FileText,
  Trash2,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
  onMark: (id: string, status: 'taken' | 'snoozed' | 'skipped') => void;
  onOpenRefill?: (medicine: Medicine) => void;
  onDelete?: (id: string) => void;
}

export const MedicineDetailModal: React.FC<Props> = ({
  medicine,
  isOpen,
  onClose,
  onMark,
  onOpenRefill,
  onDelete,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !medicine) return null;

  const isTaken = medicine.status === 'taken';

  const handleTake = () => {
    playChime('success');
    triggerHaptic(60);
    onMark(medicine.id, 'taken');
    onClose();
  };

  const handleSnooze = () => {
    playChime('subtle');
    triggerHaptic(30);
    onMark(medicine.id, 'snoozed');
    onClose();
  };

  const handleDelete = () => {
    playChime('click');
    triggerHaptic(50);
    if (onDelete) {
      onDelete(medicine.id);
    }
    setConfirmDelete(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="med-detail-name"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setConfirmDelete(false);
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Section: Visually Dominant Information */}
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Medication Details
            </span>
            {isTaken && (
              <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                ✓ Taken Today
              </span>
            )}
          </div>
          <h2
            id="med-detail-name"
            className="text-2xl font-bold text-slate-900 dark:text-white mt-1 leading-tight"
          >
            {medicine.name}
          </h2>
          <p className="text-base font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
            {medicine.dose}
          </p>
        </div>

        {/* Next Dose & Schedule Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
              Scheduled Time:
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
              {medicine.time}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
              Schedule:
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              Every {medicine.period.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Supporting Details */}
        <div className="space-y-2.5 mb-5 text-xs text-slate-600 dark:text-slate-300">
          {medicine.instructions && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                Instructions:
              </span>
              <span>{medicine.instructions}</span>
            </div>
          )}

          <div className="flex items-center justify-between p-2.5 px-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl">
            <span className="text-slate-500 dark:text-slate-400">Supply status:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {medicine.remainingCount ?? 30} tablets remaining
            </span>
          </div>
        </div>

        {/* Confirmation before deletion */}
        {confirmDelete ? (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>Delete {medicine.name}?</span>
            </div>
            <p className="text-xs text-red-700/90 dark:text-red-300/90 leading-relaxed">
              Are you sure you want to delete this tablet? It will be removed from your daily medicine schedule and reminders.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Keep Tablet
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        ) : (
          /* Primary Actions: Take Now, Snooze, Refill & Delete Tablet Option */
          <div className="space-y-2.5">
            {!isTaken ? (
              <button
                type="button"
                onClick={handleTake}
                className="w-full h-12 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Take Now</span>
              </button>
            ) : (
              <div className="h-12 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 font-bold rounded-xl flex items-center justify-center gap-2 text-sm">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Marked Taken Today</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {!isTaken && (
                <button
                  type="button"
                  onClick={handleSnooze}
                  className="h-11 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Snooze</span>
                </button>
              )}

              {onOpenRefill && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRefill(medicine);
                  }}
                  className={`h-11 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isTaken ? 'col-span-2' : ''
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Refill Prescription</span>
                </button>
              )}
            </div>

            {/* Explicit Delete Tablet Option (Prominent especially when tablet is taken) */}
            {onDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className={`w-full py-2.5 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isTaken
                    ? 'bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900/60'
                    : 'text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 border-slate-200 dark:border-slate-800 hover:border-red-200'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Tablet Option</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
