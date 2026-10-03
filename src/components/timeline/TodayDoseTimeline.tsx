import React, { useState } from 'react';
import { Medicine } from '../../types';
import {
  Clock,
  Check,
  RotateCcw,
  Sun,
  Sunset,
  Moon,
  Coffee,
  AlertTriangle,
  ChevronRight,
  Package,
  CalendarCheck,
  Sparkles,
  Pill,
  Filter,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  medicines: Medicine[];
  onMarkMedicine: (id: string, status: 'taken' | 'snoozed' | 'skipped') => void;
  onOpenReminderModal: (medicine: Medicine) => void;
  onOpenRefillModal?: (medicine: Medicine) => void;
  onScanPrescription?: () => void;
}

export const TodayDoseTimeline: React.FC<Props> = ({
  medicines,
  onMarkMedicine,
  onOpenReminderModal,
  onOpenRefillModal,
  onScanPrescription,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'upcoming' | 'completed'>('all');

  // Sort medicines chronologically by time (e.g. 08:30, 09:00, 19:30, 21:30)
  const sortedMedicines = [...medicines].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  const pendingCount = medicines.filter((m) => m.status === 'pending' || m.status === 'missed').length;
  const takenCount = medicines.filter((m) => m.status === 'taken').length;
  const totalCount = medicines.length;

  const filteredMedicines = sortedMedicines.filter((med) => {
    if (filterMode === 'upcoming') {
      return med.status === 'pending' || med.status === 'missed' || med.status === 'snoozed';
    }
    if (filterMode === 'completed') {
      return med.status === 'taken';
    }
    return true;
  });

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'Morning':
        return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'Noon':
        return <Coffee className="w-3.5 h-3.5 text-orange-500" />;
      case 'Evening':
        return <Sunset className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Bedtime':
        return <Moon className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  const nextUpcoming = sortedMedicines.find(
    (m) => m.status === 'pending' || m.status === 'missed' || m.status === 'snoozed'
  );

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 p-4 shadow-sm space-y-3.5">
      {/* Header with Title & Live Progress */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Today's Dose Timeline
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                {pendingCount} remaining
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Card-based schedule for the rest of today
            </p>
          </div>
        </div>

        {onScanPrescription && (
          <button
            type="button"
            onClick={onScanPrescription}
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-xl border border-blue-200 dark:border-blue-900/60 flex items-center gap-1 transition-colors"
          >
            <Pill className="w-3 h-3" />
            <span>Scan Bottle</span>
          </button>
        )}
      </div>

      {/* Planning Next Cue Banner */}
      {nextUpcoming && (
        <div className="p-2.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-teal-500/10 to-transparent border border-blue-200/60 dark:border-blue-800/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <p className="text-slate-800 dark:text-slate-200 text-[11px] truncate">
              <span className="font-bold text-blue-700 dark:text-blue-300">Next Due:</span>{' '}
              {nextUpcoming.name} ({nextUpcoming.dose}) at{' '}
              <span className="font-bold">{nextUpcoming.time}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenReminderModal(nextUpcoming)}
            className="text-[10px] font-bold text-blue-600 dark:text-blue-400 shrink-0 hover:underline flex items-center gap-0.5"
          >
            View Alarm
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setFilterMode('all')}
          className={`flex-1 py-1 px-2 rounded-lg text-center transition-colors text-[11px] ${
            filterMode === 'all'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('upcoming')}
          className={`flex-1 py-1 px-2 rounded-lg text-center transition-colors text-[11px] ${
            filterMode === 'upcoming'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Upcoming ({pendingCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('completed')}
          className={`flex-1 py-1 px-2 rounded-lg text-center transition-colors text-[11px] ${
            filterMode === 'completed'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Taken ({takenCount})
        </button>
      </div>

      {/* Vertically Scrollable Card-Based Timeline */}
      <div className="max-h-80 overflow-y-auto space-y-3 pr-1 py-1 custom-scrollbar">
        {filteredMedicines.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            <p className="font-semibold">No doses matching this filter</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              All scheduled medications for this view are completed or clear.
            </p>
          </div>
        ) : (
          filteredMedicines.map((med, index) => {
            const isLast = index === filteredMedicines.length - 1;
            const isTaken = med.status === 'taken';
            const isMissed = med.status === 'missed';
            const isSnoozed = med.status === 'snoozed';
            const isLowSupply = (med.remainingCount ?? 30) <= (med.refillThreshold ?? 7);

            return (
              <div key={med.id} className="relative flex items-start gap-3 group">
                {/* Timeline Axis Line & Indicator Node */}
                <div className="flex flex-col items-center shrink-0 w-7 pt-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-transform group-hover:scale-105 shadow-xs ${
                      isTaken
                        ? 'bg-emerald-500 text-white border-emerald-300 dark:border-emerald-600'
                        : isMissed
                        ? 'bg-amber-500 text-white border-amber-300 dark:border-amber-600'
                        : isSnoozed
                        ? 'bg-purple-500 text-white border-purple-300 dark:border-purple-600'
                        : 'bg-blue-600 text-white border-blue-300 dark:border-blue-500 animate-pulse'
                    }`}
                  >
                    {isTaken ? (
                      <Check className="w-3.5 h-3.5 stroke-3" />
                    ) : isMissed ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : isSnoozed ? (
                      <RotateCcw className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 min-h-[44px] my-1 ${
                        isTaken
                          ? 'bg-emerald-300 dark:bg-emerald-800'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  )}
                </div>

                {/* Card-Based Dose Item */}
                <div
                  className={`flex-1 rounded-2xl p-3 border transition-all text-xs ${
                    isTaken
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60 opacity-85'
                      : isMissed
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80 shadow-xs'
                      : isSnoozed
                      ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/60 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  {/* Top Metadata Row: Time, Period & Status */}
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px]">
                        {getPeriodIcon(med.period)}
                        <span>{med.time}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {med.period}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isTaken ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-300">
                          <Check className="w-2.5 h-2.5" />
                          Taken
                        </span>
                      ) : isMissed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/70 text-amber-800 dark:text-amber-300">
                          Missed
                        </span>
                      ) : isSnoozed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/70 text-purple-800 dark:text-purple-300">
                          Snoozed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/70 text-blue-800 dark:text-blue-300">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Medicine Name & Strength */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4
                        className={`text-sm font-bold leading-tight ${
                          isTaken
                            ? 'text-slate-600 dark:text-slate-400 line-through'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {med.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                        {med.dose}
                      </p>
                    </div>

                    {/* Supply Badge */}
                    {med.remainingCount !== undefined && (
                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 ${
                          isLowSupply
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
                        }`}
                        title="Remaining supply"
                      >
                        <Package className="w-3 h-3" />
                        <span>
                          {med.remainingCount} left {isLowSupply && '• Low!'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Instructions */}
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                    {med.instructions}
                  </p>

                  {/* Action Bar */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenReminderModal(med)}
                      className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <Clock className="w-3 h-3" />
                      <span>Details</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {!isTaken ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              playChime('subtle');
                              triggerHaptic(40);
                              onMarkMedicine(med.id, 'snoozed');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition-colors"
                          >
                            Snooze
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playChime('success');
                              triggerHaptic(60);
                              onMarkMedicine(med.id, 'taken');
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3 h-3" strokeWidth={3} />
                            <span>Take Now</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Logged for Today
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Helpful Schedule Planning Summary Footer */}
      <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {takenCount === totalCount
              ? '🎉 All medication doses completed for today! Well done.'
              : `${totalCount - takenCount} doses remaining across the day. Take with recommended meals.`}
          </span>
        </div>
      </div>
    </div>
  );
};
