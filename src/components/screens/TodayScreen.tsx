import React, { useState } from 'react';
import { Medicine, Appointment, Caregiver, WellnessCheckin } from '../../types';
import {
  Check,
  RotateCcw,
  Clock,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Package,
  Sparkles,
  Smile,
  Meh,
  Frown,
  Trash2,
  Pill,
  X,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  medicines: Medicine[];
  nextAppointment?: Appointment;
  caregivers: Caregiver[];
  wellnessCheckin?: WellnessCheckin;
  onSaveWellnessCheckin: (checkin: WellnessCheckin) => void;
  onTriggerEmergencySos: (type?: 'manual_sos' | 'fall_detected') => void;
  onOpenRefillModal: (medicine: Medicine) => void;
  onOpenPrepModal: (appointment: Appointment) => void;
  onMarkMedicine: (id: string, status: 'taken' | 'snoozed' | 'skipped') => void;
  onOpenReminderModal: (medicine: Medicine) => void;
  onNavigateAppointments: () => void;
  onNavigateCareCircle: () => void;
  onNavigateMedicines: () => void;
  onScanPrescription?: () => void;
  onOpenApkModal?: () => void;
  onDeleteMedicine?: (id: string) => void;
}

export const TodayScreen: React.FC<Props> = ({
  medicines,
  nextAppointment,
  wellnessCheckin,
  onSaveWellnessCheckin,
  onTriggerEmergencySos,
  onOpenRefillModal,
  onOpenPrepModal,
  onMarkMedicine,
  onOpenReminderModal,
  onNavigateAppointments,
  onNavigateMedicines,
  onDeleteMedicine,
}) => {
  // Sort medicines chronologically by time
  const sortedMedicines = [...medicines].sort((a, b) => a.time.localeCompare(b.time));

  // Find next pending or missed medicine
  const nextPendingMed =
    sortedMedicines.find((m) => m.status === 'pending') ||
    sortedMedicines.find((m) => m.status === 'missed') ||
    sortedMedicines.find((m) => m.status === 'snoozed');

  // Track micro-interaction state for instant visual feedback
  const [justRecordedId, setJustRecordedId] = useState<string | null>(null);

  // Tablet pending deletion confirmation
  const [pendingDeleteMed, setPendingDeleteMed] = useState<Medicine | null>(null);

  // Check low supply pill
  const lowSupplyMed = medicines.find(
    (m) => (m.remainingCount ?? 30) <= (m.refillThreshold ?? 7)
  );

  const handleTakeNow = (med: Medicine) => {
    playChime('success');
    triggerHaptic(60);
    setJustRecordedId(med.id);
    onMarkMedicine(med.id, 'taken');
    setTimeout(() => {
      setJustRecordedId(null);
    }, 4500);
  };

  const handleSnooze = (med: Medicine) => {
    playChime('subtle');
    triggerHaptic(40);
    onMarkMedicine(med.id, 'snoozed');
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteMed) return;
    playChime('click');
    triggerHaptic(60);
    if (onDeleteMedicine) {
      onDeleteMedicine(pendingDeleteMed.id);
    }
    setPendingDeleteMed(null);
  };

  const allTaken = medicines.length > 0 && medicines.every((m) => m.status === 'taken');

  return (
    <div className="flex flex-col min-h-full px-5 py-6 space-y-6 max-w-xl mx-auto w-full animate-fadeIn pb-12">
      {/* 1. Header: Greeting with CareRoute Brand in front of SOS */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
            Good morning, Margaret
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Here's your medication plan for today.
          </p>
        </div>

        {/* CareRoute Brand Pill in front of SOS button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200/90 dark:border-teal-800 text-teal-800 dark:text-teal-200 shadow-2xs">
            <Pill className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="font-extrabold text-xs tracking-tight text-teal-900 dark:text-teal-100">
              CareRoute
            </span>
          </div>

          {/* SOS Emergency button */}
          <button
            type="button"
            onClick={() => onTriggerEmergencySos('manual_sos')}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60 font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            title="Emergency SOS contact"
          >
            <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Low supply alert banner if applicable */}
      {lowSupplyMed && (
        <div className="p-3.5 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 truncate">
            <Package className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-amber-900 dark:text-amber-200">
                Low supply: {lowSupplyMed.name}
              </span>
              <span className="text-amber-700 dark:text-amber-300 ml-1">
                ({lowSupplyMed.remainingCount ?? 5} pills left)
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenRefillModal(lowSupplyMed)}
            className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg shrink-0 transition-colors cursor-pointer"
          >
            Refill
          </button>
        </div>
      )}

      {/* 2. Main Focus: NEXT MEDICINE CARD */}
      <section aria-labelledby="next-medicine-title">
        <div className="flex items-center justify-between mb-2 px-0.5">
          <span
            id="next-medicine-title"
            className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Next Medicine
          </span>
          {nextPendingMed && (
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
              {nextPendingMed.period}
            </span>
          )}
        </div>

        {nextPendingMed ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs transition-all">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                {nextPendingMed.time}
              </span>
              {nextPendingMed.status === 'missed' && (
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Past scheduled time
                </span>
              )}
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {nextPendingMed.name}
              </h2>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                {nextPendingMed.dose}
              </p>
              {nextPendingMed.instructions && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {nextPendingMed.instructions}
                </p>
              )}
            </div>

            {/* Action Buttons: Strongest CTA is TAKE NOW; if taken, provide DELETE option */}
            {justRecordedId === nextPendingMed.id ? (
              <div className="space-y-2.5 animate-fadeIn">
                <div className="h-12 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl flex items-center justify-center gap-2 text-teal-700 dark:text-teal-300 font-bold text-sm">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span>✓ TAKEN · Tablet recorded successfully!</span>
                </div>

                {onDeleteMedicine && (
                  <button
                    type="button"
                    onClick={() => setPendingDeleteMed(nextPendingMed)}
                    className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 font-bold text-xs rounded-xl border border-red-200 dark:border-red-900/60 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete this tablet option</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleTakeNow(nextPendingMed)}
                  className="flex-1 h-12 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>TAKE NOW</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSnooze(nextPendingMed)}
                  className="h-12 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>SNOOZE</span>
                </button>
              </div>
            )}
          </div>
        ) : allTaken ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 text-center shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center mb-1">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              All medicines taken for today
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You are completely up to date. You can review or delete taken tablets below.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 text-center shadow-xs">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No medications scheduled for today.
            </p>
            <button
              type="button"
              onClick={onNavigateMedicines}
              className="mt-2 text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              + Add a medicine
            </button>
          </div>
        )}
      </section>

      {/* 3. TODAY'S MEDICINES: Simple, clean timeline/list with Delete Tablet option when taken */}
      <section aria-labelledby="todays-medicines-title">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <span
            id="todays-medicines-title"
            className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Today's Medicines
          </span>
          <button
            type="button"
            onClick={onNavigateMedicines}
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Manage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs overflow-hidden">
          {sortedMedicines.map((med) => {
            const isTaken = med.status === 'taken';
            const isMissed = med.status === 'missed';
            const isSnoozed = med.status === 'snoozed';

            return (
              <div
                key={med.id}
                onClick={() => onOpenReminderModal(med)}
                className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Status Indicator */}
                  <div className="pt-0.5 shrink-0">
                    {isTaken ? (
                      <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : isMissed ? (
                      <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                        !
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                      </div>
                    )}
                  </div>

                  {/* Medicine Details */}
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                        {med.time}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {med.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {med.dose}
                    </p>
                  </div>
                </div>

                {/* Right side: Status Badge & Delete Tablet Option when taken */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      isTaken
                        ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 border border-teal-200/80 dark:border-teal-800'
                        : isMissed
                        ? 'text-amber-700 dark:text-amber-400'
                        : isSnoozed
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isTaken ? (
                      <>
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Taken</span>
                      </>
                    ) : isMissed ? (
                      'Past due'
                    ) : isSnoozed ? (
                      'Snoozed'
                    ) : (
                      'Upcoming'
                    )}
                  </span>

                  {/* If taken, provide the requested delete tablet option */}
                  {isTaken && onDeleteMedicine && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingDeleteMed(med);
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 dark:bg-red-950/50 dark:hover:bg-red-700 rounded-lg border border-red-200 dark:border-red-900/60 transition-colors flex items-center gap-1 cursor-pointer"
                      title={`Delete ${med.name} tablet option`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}

                  {!isTaken && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTakeNow(med);
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-teal-700 hover:text-white bg-teal-50 hover:bg-teal-700 dark:bg-teal-950/60 dark:hover:bg-teal-700 rounded-lg border border-teal-200/80 dark:border-teal-800 transition-colors cursor-pointer"
                    >
                      Take
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. UPCOMING APPOINTMENT: Simple, calm preview */}
      {nextAppointment && (
        <section aria-labelledby="upcoming-visit-title">
          <div className="flex items-center justify-between mb-2 px-0.5">
            <span
              id="upcoming-visit-title"
              className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Upcoming Appointment
            </span>
            <button
              type="button"
              onClick={onNavigateAppointments}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              All visits
            </button>
          </div>

          <div
            onClick={onNavigateAppointments}
            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex items-center justify-between shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {nextAppointment.doctorName}
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {nextAppointment.specialty}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {nextAppointment.date} · {nextAppointment.time}
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </section>
      )}

      {/* 5. Daily Wellness Check-In */}
      <section aria-label="Daily Check-in">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
          <span className="font-medium text-slate-600 dark:text-slate-300">
            How are you feeling today?
          </span>
          <div className="flex items-center gap-1.5">
            {(
              [
                { mood: 'great', label: 'Good', icon: Smile },
                { mood: 'okay', label: 'Okay', icon: Meh },
                { mood: 'tired', label: 'Tired', icon: Frown },
              ] as const
            ).map(({ mood, label, icon: MoodIcon }) => {
              const isSelected = wellnessCheckin?.mood === mood;
              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() =>
                    onSaveWellnessCheckin({
                      id: `well-${Date.now()}`,
                      date: 'Today',
                      mood,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    })
                  }
                  className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <MoodIcon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Confirm Tablet Delete Modal */}
      {pendingDeleteMed && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
            <button
              type="button"
              onClick={() => setPendingDeleteMed(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Delete Tablet?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pendingDeleteMed.name} ({pendingDeleteMed.dose})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
              Are you sure you want to delete this tablet? It will be removed from your daily medicine plan and future reminders.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPendingDeleteMed(null)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Keep Tablet
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
