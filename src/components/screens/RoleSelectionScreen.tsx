import React from 'react';
import { UserRole } from '../../types';
import { User, Users, Check, ArrowRight, Shield } from 'lucide-react';

interface Props {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onContinue: () => void;
}

export const RoleSelectionScreen: React.FC<Props> = ({
  selectedRole,
  onSelectRole,
  onContinue,
}) => {
  return (
    <div className="flex flex-col min-h-full justify-between p-6 sm:p-8 max-w-md mx-auto w-full animate-fadeIn pb-10">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Step 1 of 3
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Account Setup</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Who is using CareRoute?
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
          This helps us customize medication reminders, text sizes, and family support settings.
        </p>

        <div className="space-y-3.5">
          {/* Patient Role Option */}
          <button
            type="button"
            onClick={() => onSelectRole('patient')}
            className={`w-full p-5 rounded-2xl border text-left transition-all relative flex items-start gap-4 cursor-pointer ${
              selectedRole === 'patient'
                ? 'border-teal-700 bg-teal-50/50 dark:bg-teal-950/40 dark:border-teal-600 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                selectedRole === 'patient'
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <User className="w-5 h-5" />
            </div>

            <div className="flex-1 pr-6">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-slate-900 dark:text-white">
                  I'm the patient
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                Manage my medications, follow my schedule, and track daily doses.
              </p>
            </div>

            {selectedRole === 'patient' && (
              <div className="absolute top-5 right-5 w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Caregiver Role Option */}
          <button
            type="button"
            onClick={() => onSelectRole('caregiver')}
            className={`w-full p-5 rounded-2xl border text-left transition-all relative flex items-start gap-4 cursor-pointer ${
              selectedRole === 'caregiver'
                ? 'border-teal-700 bg-teal-50/50 dark:bg-teal-950/40 dark:border-teal-600 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                selectedRole === 'caregiver'
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Users className="w-5 h-5" />
            </div>

            <div className="flex-1 pr-6">
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                I'm a caregiver
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                Support a family member with their medication schedules, with their permission.
              </p>
            </div>

            {selectedRole === 'caregiver' && (
              <div className="absolute top-5 right-5 w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}
          </button>
        </div>

        <div className="mt-6 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
          <Shield className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Caregivers can only see information explicitly permitted by the patient. Permissions can be changed at any time.
          </p>
        </div>
      </div>

      <div className="pt-6 pb-2">
        <button
          type="button"
          onClick={onContinue}
          className="w-full h-14 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-base shadow-xs transition-colors cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
