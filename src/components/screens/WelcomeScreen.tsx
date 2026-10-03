import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
  onExistingUser: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onGetStarted, onExistingUser }) => {
  return (
    <div className="flex flex-col min-h-full justify-between p-6 sm:p-8 text-center max-w-md mx-auto w-full animate-fadeIn pb-10">
      {/* Top Brand Tag */}
      <div className="pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          CareRoute Health
        </span>
      </div>

      {/* Main Focus Area */}
      <div className="flex flex-col items-center my-auto py-6">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-2xl mb-6 shadow-xs border border-teal-200/80 dark:border-teal-800">
          CR
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          CareRoute
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-xs mx-auto">
          Help you know what medicine to take, when to take it, and whether you already took it.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pb-2">
        <button
          type="button"
          onClick={onGetStarted}
          className="w-full h-14 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-base shadow-xs transition-colors cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onExistingUser}
          className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl text-sm transition-colors cursor-pointer"
        >
          I already have an account
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2">
          <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400" />
          <span>Private, accessible, and patient-first</span>
        </div>
      </div>
    </div>
  );
};
