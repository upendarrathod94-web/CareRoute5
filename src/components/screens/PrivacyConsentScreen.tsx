import React from 'react';
import { ASSETS_3D } from '../../assets/assetRegistry';
import { Check, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

interface Props {
  onAgreeAndContinue: () => void;
}

export const PrivacyConsentScreen: React.FC<Props> = ({ onAgreeAndContinue }) => {
  return (
    <div className="flex flex-col h-full justify-between p-6 animate-fadeIn overflow-y-auto">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-full">
            Step 3 of 3
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Privacy & Trust</span>
        </div>

        {/* 3D Privacy Shield graphic */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-700 mb-3 ring-1 ring-teal-200 dark:ring-teal-900">
            <img
              src={ASSETS_3D.privacyShield}
              alt="CareRoute 3D Privacy Shield"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Your privacy, your choice
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Nothing is ever shared with family or caregivers unless you explicitly allow it.
          </p>
        </div>

        {/* Value Prop Checklist */}
        <div className="space-y-3 mb-5">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-3 shadow-xs">
            <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0 mt-0.5">
              <Check className="w-4 h-4" strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900 dark:text-white">
                Private by Default
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Your prescriptions, dose history, and health schedules remain private to your phone.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-3 shadow-xs">
            <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0 mt-0.5">
              <Check className="w-4 h-4" strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900 dark:text-white">
                Granular Permissions
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                You decide whether a caregiver sees appointments, gets missed alerts, or sees medication names.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-3 shadow-xs">
            <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0 mt-0.5">
              <Check className="w-4 h-4" strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900 dark:text-white">
                One-Tap Revocation
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                You can remove caregiver permissions or disconnect family members instantly at any moment.
              </p>
            </div>
          </div>
        </div>

        {/* Required Medical & Emergency Disclaimer */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200 font-medium">
            <strong className="block text-amber-950 dark:text-amber-100 mb-0.5">Important Safety Notice:</strong>
            CareRoute is an organizational tool and is not a doctor, pharmacy, or emergency dispatch service. For life-threatening emergencies, call 911 or visit your nearest emergency room immediately.
          </p>
        </div>
      </div>

      <div className="pt-4 pb-2">
        <button
          type="button"
          onClick={onAgreeAndContinue}
          className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-2xl shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 text-base transition-all"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Agree and Continue</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
