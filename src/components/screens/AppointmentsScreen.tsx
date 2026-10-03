import React, { useState } from 'react';
import { Appointment } from '../../types';
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  ChevronRight,
  FileQuestion,
  RotateCcw,
  X,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  appointments: Appointment[];
  onStartBooking: () => void;
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (appointment: Appointment) => void;
  onOpenPrepModal?: (appointment: Appointment) => void;
}

export const AppointmentsScreen: React.FC<Props> = ({
  appointments,
  onStartBooking,
  onCancelAppointment,
  onRescheduleAppointment,
  onOpenPrepModal,
}) => {
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  const upcomingAppointment = appointments[0];
  const otherAppointments = appointments.slice(1);

  const handleCancel = (id: string) => {
    playChime('alert');
    triggerHaptic(40);
    onCancelAppointment(id);
    setSelectedAppt(null);
  };

  return (
    <div className="flex flex-col min-h-full px-5 py-6 space-y-6 max-w-xl mx-auto w-full animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Appointments
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your doctor visits and reminders.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartBooking}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Book Visit</span>
        </button>
      </div>

      {appointments.length === 0 ? (
        /* Calm Empty State */
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Calendar className="w-6 h-6 text-teal-700 dark:text-teal-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            No upcoming appointments
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Schedule visits with your cardiologist, primary doctor, or specialist. Reminders are sent automatically.
          </p>
          <button
            type="button"
            onClick={onStartBooking}
            className="mt-3 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Find a Doctor & Book
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 9: Show UPCOMING APPOINTMENT first */}
          {upcomingAppointment && (
            <section aria-labelledby="upcoming-heading">
              <span
                id="upcoming-heading"
                className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2 px-0.5"
              >
                Upcoming Appointment
              </span>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {upcomingAppointment.doctorName}
                  </h3>
                  <p className="text-sm font-medium text-teal-700 dark:text-teal-400 mt-0.5">
                    {upcomingAppointment.specialty}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {upcomingAppointment.clinic}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
                    <Calendar className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                    <span>{upcomingAppointment.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{upcomingAppointment.time}</span>
                  </div>
                </div>

                {/* Actions: View Details / Prep Pocket */}
                <div className="flex items-center gap-2 pt-1">
                  {onOpenPrepModal && (
                    <button
                      type="button"
                      onClick={() => onOpenPrepModal(upcomingAppointment)}
                      className="flex-1 h-11 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FileQuestion className="w-3.5 h-3.5" />
                      <span>View Details & Questions</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onRescheduleAppointment(upcomingAppointment)}
                    className="h-11 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Reschedule</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Other Scheduled Visits */}
          {otherAppointments.length > 0 && (
            <section aria-labelledby="other-visits-heading">
              <span
                id="other-visits-heading"
                className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2 px-0.5"
              >
                Other Scheduled Visits
              </span>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs overflow-hidden">
                {otherAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {appt.doctorName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {appt.specialty} · {appt.date} at {appt.time}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {onOpenPrepModal && (
                        <button
                          type="button"
                          onClick={() => onOpenPrepModal(appt)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Details
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
