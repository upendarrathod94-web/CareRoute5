import React, { useState } from 'react';
import { Doctor } from '../../types';
import { ArrowLeft, Calendar, Clock, MapPin, User, Check, Shield } from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  doctor: Doctor;
  date: string;
  time: string;
  onConfirm: (reason: string, notifyCaregiver: boolean) => void;
  onBack: () => void;
}

export const BookingReviewScreen: React.FC<Props> = ({
  doctor,
  date,
  time,
  onConfirm,
  onBack,
}) => {
  const [reason, setReason] = useState('Routine 6-month blood pressure checkup & refill');
  const [notifyCaregiver, setNotifyCaregiver] = useState(true);

  const handleSubmit = () => {
    playChime('success');
    triggerHaptic(70);
    onConfirm(reason, notifyCaregiver);
  };

  return (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 overflow-y-auto animate-fadeIn">
      <div>
        {/* Navigation Bar */}
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Review Appointment
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Check visit details before confirming
            </p>
          </div>
        </div>

        {/* Appointment Summary Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 mb-4 shadow-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${doctor.avatarBg} text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs`}
            >
              {doctor.name.replace('Dr. ', '').charAt(0)}
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                {doctor.specialty}
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {doctor.name}
              </h3>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="font-semibold text-slate-900 dark:text-white">
                {date}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="font-semibold text-slate-900 dark:text-white">
                {time} (30 mins)
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{doctor.clinic} • {doctor.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Patient: Margaret Lewis (DOB: 14 May 1954)</span>
            </div>
          </div>
        </div>

        {/* Reason for Visit Input */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Reason for Visit (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="e.g., Blood pressure checkup, prescription renewal, symptom review"
          />
        </div>

        {/* Caregiver notification permission toggle */}
        <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 flex items-center justify-between">
          <div className="flex items-start gap-2.5 pr-2">
            <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Notify Care Circle
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Priya will see this date so she can help arrange transportation if needed.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNotifyCaregiver(!notifyCaregiver)}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${
              notifyCaregiver ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                notifyCaregiver ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Confirm CTA */}
      <div className="pt-4 pb-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full h-14 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-2xl shadow-xs flex items-center justify-center gap-2 text-base transition-colors"
        >
          <Check className="w-5 h-5" strokeWidth={3} />
          <span>Confirm Appointment</span>
        </button>
      </div>
    </div>
  );
};
