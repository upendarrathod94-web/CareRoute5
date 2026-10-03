import React, { useState, useEffect } from 'react';
import { Medicine } from '../../types';
import {
  Check,
  RotateCcw,
  X,
  Clock,
  Volume2,
  VolumeX,
  Bell,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import {
  playChime,
  triggerHaptic,
  playLoudReminderSound,
  stopLoudReminderSound,
  speakReminderText,
} from '../../utils/audioHaptics';

interface Props {
  medicine: Medicine;
  onMark: (status: 'taken' | 'snoozed' | 'skipped') => void;
  onDismiss: () => void;
  onDelete?: (id: string) => void;
}

export const MedicineReminderModal: React.FC<Props> = ({
  medicine,
  onMark,
  onDismiss,
  onDelete,
}) => {
  const [recorded, setRecorded] = useState(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(true);
  const [volumeLevel, setVolumeLevel] = useState<'loud' | 'boost'>('loud');

  // Trigger loud reminder alarm immediately when modal mounts
  useEffect(() => {
    const soundController = playLoudReminderSound({
      repeatCount: 4,
      volumeBoost: volumeLevel === 'boost' ? 1.0 : 0.85,
      onComplete: () => {
        setIsSoundPlaying(false);
      },
    });

    // Also speak reminder text for seniors who have vision/hearing assistance
    speakReminderText(medicine.name, medicine.dose);

    return () => {
      soundController.stop();
      stopLoudReminderSound();
    };
  }, [medicine.name, medicine.dose]);

  const handleReplayLoudSound = () => {
    setIsSoundPlaying(true);
    playLoudReminderSound({
      repeatCount: 3,
      volumeBoost: 1.0, // extra boost on manual request
      onComplete: () => setIsSoundPlaying(false),
    });
    speakReminderText(medicine.name, medicine.dose);
  };

  const handleStopSound = () => {
    stopLoudReminderSound();
    setIsSoundPlaying(false);
  };

  const handleTake = () => {
    stopLoudReminderSound();
    playChime('success');
    triggerHaptic([60, 40, 80]);
    setRecorded(true);
    setTimeout(() => {
      onMark('taken');
    }, 1200);
  };

  const handleSnooze = () => {
    stopLoudReminderSound();
    playChime('subtle');
    triggerHaptic(40);
    onMark('snoozed');
  };

  const handleSkip = () => {
    stopLoudReminderSound();
    playChime('click');
    onMark('skipped');
  };

  const handleDismiss = () => {
    stopLoudReminderSound();
    onDismiss();
  };

  const getScheduleLabel = (period: string) => {
    switch (period) {
      case 'Morning':
        return 'Every morning';
      case 'Noon':
        return 'Every lunchtime';
      case 'Evening':
        return 'Every evening';
      case 'Bedtime':
        return 'Every bedtime';
      default:
        return 'Daily';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-title"
    >
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border-2 border-teal-500/30 dark:border-teal-400/30 shadow-2xl p-6 relative">
        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Loud Audio Playing Indicator for Seniors */}
        <div className="mb-4">
          <div className="flex items-center justify-between bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800/80 rounded-2xl px-3.5 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
                <Volume2 className={`w-4 h-4 ${isSoundPlaying ? 'animate-pulse text-teal-200' : ''}`} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-teal-900 dark:text-teal-200">
                    Loud Reminder Chime
                  </span>
                  {isSoundPlaying && (
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                  )}
                </div>
                <p className="text-[10px] text-teal-700 dark:text-teal-300">
                  {isSoundPlaying ? 'Playing loud bell alarm' : 'Alarm finished'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isSoundPlaying ? (
                <button
                  type="button"
                  onClick={handleStopSound}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Silence chime"
                >
                  Silence
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReplayLoudSound}
                  className="px-2.5 py-1 text-[11px] font-bold bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Play loud chime again"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Replay</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section 8: Most Important Information Visually Dominant for Seniors */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            <Bell className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Medication Due Now</span>
          </div>
          <h2
            id="reminder-title"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 leading-tight tracking-tight"
          >
            {medicine.name}
          </h2>
          <p className="text-base font-bold text-slate-700 dark:text-slate-200 mt-1">
            {medicine.dose}
          </p>
        </div>

        {/* Next dose & Schedule info */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
              Scheduled Time:
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
              {medicine.time}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
              Period:
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {getScheduleLabel(medicine.period)}
            </span>
          </div>
        </div>

        {/* Supporting details */}
        {medicine.instructions && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-slate-600 dark:text-slate-300 mb-5 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
              Instructions:
            </span>
            <span className="text-xs">{medicine.instructions}</span>
          </div>
        )}

        {/* Actions: Take Now, Snooze, Skip */}
        {recorded ? (
          <div className="space-y-3 animate-fadeIn">
            <div className="h-16 bg-teal-50 dark:bg-teal-950/80 border-2 border-teal-500 rounded-2xl flex flex-col items-center justify-center text-teal-800 dark:text-teal-300">
              <span className="font-extrabold text-lg flex items-center gap-2">
                <Check className="w-6 h-6 stroke-[3]" />
                TAKEN
              </span>
              <span className="text-xs font-semibold">Medication logged successfully!</span>
            </div>

            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  stopLoudReminderSound();
                  onDelete(medicine.id);
                  onDismiss();
                }}
                className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 font-bold text-xs rounded-xl border border-red-200 dark:border-red-900/60 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete this tablet option</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleTake}
              className="w-full h-16 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-black text-lg tracking-wide rounded-2xl flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-[0.99] cursor-pointer"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>TAKE NOW</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleSnooze}
                className="h-12 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>SNOOZE (15m)</span>
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="h-12 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 hover:text-slate-800 font-semibold rounded-xl text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                <span>SKIP DOSE</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
