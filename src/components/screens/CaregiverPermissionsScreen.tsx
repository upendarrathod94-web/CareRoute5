import React from 'react';
import { Caregiver, CaregiverPermissions } from '../../types';
import { ArrowLeft, Shield, Calendar, BellRing, Pill, PhoneCall, Trash2, Eye } from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  caregiver: Caregiver;
  onUpdatePermissions: (newPermissions: Partial<CaregiverPermissions>) => void;
  onRemoveCaregiver: () => void;
  onPreviewCaregiverDashboard: () => void;
  onBack: () => void;
}

export const CaregiverPermissionsScreen: React.FC<Props> = ({
  caregiver,
  onUpdatePermissions,
  onRemoveCaregiver,
  onPreviewCaregiverDashboard,
  onBack,
}) => {
  const { permissions } = caregiver;

  const toggle = (key: keyof CaregiverPermissions) => {
    playChime('subtle');
    triggerHaptic(30);
    onUpdatePermissions({ [key]: !permissions[key] });
  };

  const handleRemove = () => {
    if (confirm(`Are you sure you want to revoke ${caregiver.name}'s caregiver access? They will no longer see any of your data.`)) {
      playChime('alert');
      triggerHaptic(70);
      onRemoveCaregiver();
    }
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
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {caregiver.name}'s Access
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Control what {caregiver.name} can view
            </p>
          </div>
        </div>

        {/* Member Profile Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3 mb-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            {caregiver.avatarInitial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                {caregiver.name}
              </h2>
              <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                {caregiver.relation}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {caregiver.phone} • Active in Care Circle
            </p>
          </div>
        </div>

        {/* Granular Permissions Section */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 px-1">
            Permissions Granted to {caregiver.name}
          </label>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/60 shadow-xs">
            {/* Appointments */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">
                    See Doctor Appointments
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    View upcoming dates, times, and clinic addresses
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('seeAppointments')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${
                  permissions.seeAppointments ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    permissions.seeAppointments ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Missed Reminder Alerts */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">
                    Receive Missed-Reminder Alerts
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Get an alert only if Margaret does not respond in 30 mins
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('receiveMissedAlerts')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${
                  permissions.receiveMissedAlerts ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    permissions.receiveMissedAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* See Medicine Reminders */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">
                    See Medicine Schedules
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Know which periods of the day medicine is taken
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('seeMedicineReminders')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${
                  permissions.seeMedicineReminders ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    permissions.seeMedicineReminders ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Privacy: Full Drug Names & Doses */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">
                    Show Full Drug Names & Doses
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    When off, caregiver only sees generic "Medicine Due"
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('seeFullMedicineNames')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${
                  permissions.seeFullMedicineNames ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    permissions.seeFullMedicineNames ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Emergency Contact Access */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">
                    Emergency Contact Access
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Allows calling emergency contacts directly from app
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('emergencyContactAccess')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${
                  permissions.emergencyContactAccess ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    permissions.emergencyContactAccess ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Preview View Button */}
        <button
          type="button"
          onClick={onPreviewCaregiverDashboard}
          className="w-full py-3 mb-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
        >
          <Eye className="w-4 h-4 text-teal-600" />
          <span>Preview What {caregiver.name} Sees Now</span>
        </button>
      </div>

      {/* Danger Revoke Button */}
      <div className="pt-2 pb-2">
        <button
          type="button"
          onClick={handleRemove}
          className="w-full h-12 rounded-xl border border-red-300 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Remove {caregiver.name}'s Access</span>
        </button>
      </div>
    </div>
  );
};
