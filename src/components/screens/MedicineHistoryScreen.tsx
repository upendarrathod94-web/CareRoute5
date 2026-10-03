import React from 'react';
import { MedicineHistoryItem } from '../../types';
import { ArrowLeft, Check, Clock, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  history: MedicineHistoryItem[];
  onBack: () => void;
}

export const MedicineHistoryScreen: React.FC<Props> = ({ history, onBack }) => {
  const dateGroups = ['Today', 'Yesterday', 'Earlier this week'] as const;

  const totalLogs = history.length;
  const takenCount = history.filter((h) => h.status === 'taken').length;
  const adherencePercent = totalLogs > 0 ? Math.round((takenCount / totalLogs) * 100) : 100;

  return (
    <div className="flex flex-col h-full p-4 sm:p-5 overflow-y-auto animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Medicine History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track dose compliance and alerts
          </p>
        </div>
      </div>

      {/* Compliance Metric Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700 mb-5 flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
            Weekly Adherence
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {adherencePercent}%
            </span>
            <span className="text-xs text-slate-500 font-medium">on-time doses</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
            Excellent consistency. Keeping your doctor and family in the loop.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-xs">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>

      {/* History Log Groupings */}
      <div className="space-y-4">
        {dateGroups.map((group) => {
          const items = history.filter((h) => h.dateLabel === group);
          if (items.length === 0) return null;

          return (
            <div key={group} className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
                {group}
              </span>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/60 shadow-xs">
                {items.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          item.status === 'taken'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300'
                            : item.status === 'missed'
                            ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300'
                        }`}
                      >
                        {item.status === 'taken' ? (
                          <Check className="w-4 h-4" strokeWidth={3} />
                        ) : item.status === 'missed' ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            {item.medicineName}
                          </h3>
                          <span className="text-xs text-slate-400 font-medium">
                            {item.dose}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.timestamp}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${
                          item.status === 'taken'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : item.status === 'missed'
                            ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
                            : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>

                      {item.caregiverAlertSent && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-300 mt-1">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Alerted Priya</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
