import React from 'react';
import { Caregiver, Appointment, Medicine, WellnessCheckin } from '../../types';
import { ASSETS_3D } from '../../assets/assetRegistry';
import {
  ArrowLeft,
  AlertTriangle,
  Calendar,
  Pill,
  Phone,
  Lock,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Heart,
  Package,
  Check,
  Clock,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  caregiver: Caregiver;
  nextAppointment?: Appointment;
  medicines: Medicine[];
  wellnessCheckin?: WellnessCheckin;
  onExitCaregiverView: () => void;
  onShowToast: (msg: string) => void;
  onPickUpRefill?: (medicine: Medicine) => void;
}

export const CaregiverDashboardScreen: React.FC<Props> = ({
  caregiver,
  nextAppointment,
  medicines,
  wellnessCheckin,
  onExitCaregiverView,
  onShowToast,
  onPickUpRefill,
}) => {
  const { permissions } = caregiver;

  const missedMeds = medicines.filter((m) => m.status === 'missed');
  const lowSupplyMeds = medicines.filter(
    (m) => (m.remainingCount ?? 30) <= (m.refillThreshold ?? 7)
  );

  return (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 overflow-y-auto bg-slate-50 dark:bg-slate-900 animate-fadeIn">
      <div className="space-y-4">
        {/* Caregiver Role Header Tag */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExitCaregiverView}
              className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
              Caregiver Portal: {caregiver.name}
            </span>
          </div>

          <button
            type="button"
            onClick={onExitCaregiverView}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Switch to Patient
          </button>
        </div>

        {/* Patient Status Overview Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Supporting Loved One
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Connected</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              M
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Margaret Lewis
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Patient • San Francisco, CA
              </p>
            </div>
          </div>

          {/* Quick Contact Margaret Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                playChime('click');
                onShowToast('Calling Margaret Lewis...');
              }}
              className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Call Margaret</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playChime('subtle');
                onShowToast('Gentle check-in message sent to Margaret!');
              }}
              className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              <span>Send Nudge</span>
            </button>
          </div>
        </div>

        {/* Feature 5 in Caregiver Portal: Margaret's Daily Wellness Status */}
        {wellnessCheckin && (
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950 text-pink-600 flex items-center justify-center text-xl">
                {wellnessCheckin.mood === 'great'
                  ? '😊'
                  : wellnessCheckin.mood === 'okay'
                  ? '🌤️'
                  : wellnessCheckin.mood === 'tired'
                  ? '🥱'
                  : '⚠️'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
                    Margaret's Wellness Pulse
                  </span>
                  <span className="text-[10px] text-slate-400">• {wellnessCheckin.timestamp}</span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                  Feeling {wellnessCheckin.mood} today
                </p>
                {wellnessCheckin.note && (
                  <p className="text-[11px] text-slate-500 italic">"{wellnessCheckin.note}"</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playChime('subtle');
                onShowToast('Sent a warm reply to Margaret!');
              }}
              className="px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300 text-xs font-semibold hover:bg-pink-100"
            >
              Reply
            </button>
          </div>
        )}

        {/* Feature 3 in Caregiver Portal: Low Supply & Refill Alert */}
        {lowSupplyMeds.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-100 font-bold text-xs">
                <Package className="w-4 h-4 text-amber-600" />
                <span>Pill Refill Needed for Margaret</span>
              </div>
              <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-md font-bold">
                Low Supply
              </span>
            </div>

            {lowSupplyMeds.map((med) => (
              <div
                key={med.id}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200/60 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {permissions.seeFullMedicineNames ? med.name : 'Blood pressure prescription'}
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300">
                    {med.remainingCount} pills left • Refill threshold is {med.refillThreshold}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playChime('success');
                    if (onPickUpRefill) onPickUpRefill(med);
                    onShowToast(`Refill request assigned to you (${caregiver.name})!`);
                  }}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs shadow-xs"
                >
                  I'll Pick It Up
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Missed Reminder Alert (if permission enabled) */}
        {permissions.receiveMissedAlerts && missedMeds.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 shadow-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-900 dark:text-amber-100">
                  Missed Reminder Alert
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-200 mt-0.5 leading-relaxed">
                  {permissions.seeFullMedicineNames
                    ? `Amlodipine 5mg reminder was missed at 09:00 AM today.`
                    : `Morning medicine dose reminder was missed today.`}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onShowToast('Calling to check on medicine...')}
                    className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] rounded-lg transition-colors"
                  >
                    Check In with Margaret
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Today's Prescriptions */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Prescription Adherence
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">
              {medicines.filter((m) => m.status === 'taken').length} of {medicines.length} taken
            </span>
          </div>

          <div className="space-y-2">
            {medicines.map((m) => (
              <div
                key={m.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {permissions.seeFullMedicineNames ? m.name : `${m.period} Dose`}
                  </p>
                  <p className="text-[11px] text-slate-500">{m.time}</p>
                </div>

                {m.status === 'taken' ? (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Taken
                  </span>
                ) : m.status === 'missed' ? (
                  <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Missed
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointment Shared with Caregiver */}
        {nextAppointment && (
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Upcoming Appointment
                </h2>
              </div>
              <span className="text-[11px] text-teal-600 font-semibold">Shared with you</span>
            </div>

            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {nextAppointment.doctorName} ({nextAppointment.specialty})
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {nextAppointment.date} at {nextAppointment.time} • {nextAppointment.clinic}
            </p>

            {nextAppointment.prepQuestions && nextAppointment.prepQuestions.length > 0 && (
              <div className="mt-2.5 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-[11px] text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Doctor Prep ({nextAppointment.prepQuestions.length} questions):
                </span>
                <p className="mt-0.5 italic">"{nextAppointment.prepQuestions[0]?.text}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 text-center">
        <button
          type="button"
          onClick={onExitCaregiverView}
          className="w-full py-3 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-bold rounded-2xl text-xs transition-colors"
        >
          Exit Caregiver View & Return to Margaret's App
        </button>
      </div>
    </div>
  );
};
