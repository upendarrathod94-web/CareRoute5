import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Users, Share2, Sparkles } from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  onBack: () => void;
  onSimulateJoin: () => void;
}

export const InviteCaregiverScreen: React.FC<Props> = ({ onBack, onSimulateJoin }) => {
  const [copied, setCopied] = useState(false);
  const inviteCode = '7QK3 9RM2';

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteCode.replace(' ', ''));
    setCopied(true);
    playChime('success');
    triggerHaptic(40);
    setTimeout(() => setCopied(false), 2000);
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
              Invite a Caregiver
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Share code with your daughter, son, or spouse
            </p>
          </div>
        </div>

        {/* Info illustration */}
        <div className="text-center my-4">
          <div className="w-16 h-16 rounded-3xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Share Your 8-Character Code
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto mt-1">
            When they enter this code on their CareRoute app, you will receive a notification to approve their access.
          </p>
        </div>

        {/* Code Box */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-center mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            One-Time Secure Invite Code
          </span>
          <div className="text-3xl font-mono font-black tracking-widest text-slate-900 dark:text-white my-2 select-all">
            {inviteCode}
          </div>
          <p className="text-[11px] text-slate-500">Expires in 48 hours • Single use</p>
        </div>

        {/* Share actions */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <button
            type="button"
            onClick={handleCopy}
            className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Code Copied!' : 'Copy Code'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playChime('click');
              alert(`Sharing CareRoute invite link for code: ${inviteCode}`);
            }}
            className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Link</span>
          </button>
        </div>

        {/* Simulation button for demo testing */}
        <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold text-blue-900 dark:text-blue-200">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Interactive Testing Demo</span>
          </div>
          <p className="text-[11px] text-blue-700 dark:text-blue-300 mb-3">
            Want to test without a second device? Tap below to simulate Priya Sharma accepting this invite right now.
          </p>
          <button
            type="button"
            onClick={() => {
              playChime('success');
              triggerHaptic(60);
              onSimulateJoin();
            }}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Simulate Caregiver Joining
          </button>
        </div>
      </div>

      <div className="pt-4 pb-2">
        <button
          type="button"
          onClick={onBack}
          className="w-full h-12 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl text-xs"
        >
          Done
        </button>
      </div>
    </div>
  );
};
