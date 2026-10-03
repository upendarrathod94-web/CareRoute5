import React from 'react';
import { Appointment } from '../../types';
import { Check, Calendar, Clock, MapPin, Share2, ArrowRight } from 'lucide-react';
import { playChime } from '../../utils/audioHaptics';

interface Props {
  appointment: Appointment;
  onDone: () => void;
  onShowToast: (msg: string) => void;
}

export const BookingConfirmedScreen: React.FC<Props> = ({
  appointment,
  onDone,
  onShowToast,
}) => {
  return (
    <div className="flex flex-col h-full justify-between p-6 text-center animate-fadeIn overflow-y-auto">
      <div className="my-auto py-2">
        {/* Success Icon */}
        <div className="w-18 h-18 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto mb-4 shadow-md">
          <Check className="w-10 h-10" strokeWidth={3} />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
          Confirmed
        </span>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2 mb-2">
          Appointment Booked!
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto mb-5 leading-relaxed">
          We have reserved your consultation and added automated gentle reminders for you.
        </p>

        {/* Visit Details Ticket */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-2.5 max-w-xs mx-auto shadow-xs text-xs">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Provider
            </span>
            <p className="font-bold text-sm text-slate-900 dark:text-white">
              {appointment.doctorName}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {appointment.specialty} • {appointment.clinic}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-white">
              {appointment.date}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-white">
              {appointment.time} (30 mins)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">
              Arrive 15 minutes early for check-in
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl text-[11px] text-blue-800 dark:text-blue-300 max-w-xs mx-auto">
          🔔 Automatic reminders scheduled 24 hours and 1 hour before your visit.
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pb-2">
        <button
          type="button"
          onClick={onDone}
          className="w-full h-14 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-2xl shadow-xs flex items-center justify-center gap-2 text-base transition-colors"
        >
          <span>View My Appointments</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => {
            playChime('click');
            onShowToast('Appointment synced with your device calendar!');
          }}
          className="w-full h-12 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Add to Calendar / Share Confirmation</span>
        </button>
      </div>
    </div>
  );
};
