import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Lock, ShieldCheck } from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';
import { isValidEmail } from '../../utils/authUtils';

interface Props {
  onBackToLogin: () => void;
  onResetSuccess: () => void;
}

export const ForgotPasswordScreen: React.FC<Props> = ({ onBackToLogin, onResetSuccess }) => {
  const { sendPasswordReset, completePasswordReset } = useAuth();
  const [step, setStep] = useState<'request' | 'new_password'>('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkSentNotice, setLinkSentNotice] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      playChime('alert');
      return;
    }

    setLoading(true);
    try {
      // Do not reveal whether account exists
      await sendPasswordReset(email.trim());
      playChime('success');
      triggerHaptic(50);
      setLinkSentNotice(true);
      // Advance to allow creating new password
      setTimeout(() => {
        setStep('new_password');
      }, 1400);
    } catch (err: any) {
      // Security: never reveal user-not-found
      setLinkSentNotice(true);
      setTimeout(() => {
        setStep('new_password');
      }, 1400);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      playChime('alert');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      playChime('alert');
      return;
    }

    setLoading(true);
    try {
      await completePasswordReset(newPassword);
      playChime('success');
      triggerHaptic(60);
      onResetSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password.');
      playChime('alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full justify-between p-6 sm:p-8 max-w-md mx-auto w-full animate-fadeIn pb-10">
      <div>
        <button
          type="button"
          onClick={onBackToLogin}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Log in</span>
        </button>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1.5">
          Reset your password
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          We'll send you a secure password reset link.
        </p>

        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {linkSentNotice && (
          <div className="mb-4 p-3.5 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 rounded-xl flex items-start gap-2.5 text-xs text-teal-800 dark:text-teal-200 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-teal-600 dark:text-teal-400" />
            <span>If an account matches this email, a secure reset link has been dispatched.</span>
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Verified Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-12 pl-10 pr-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-800 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending reset link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSaveNewPassword} className="space-y-4 animate-fadeIn">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>Reset verified. Choose a strong new password.</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full h-12 pl-10 pr-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-800 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full h-12 pl-10 pr-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-800 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving new password...</span>
                </>
              ) : (
                <>
                  <span>Save New Password</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="pt-6 text-center border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Remember your password?{' '}
          <button
            type="button"
            onClick={onBackToLogin}
            className="font-bold text-teal-700 dark:text-teal-400 hover:underline ml-1 cursor-pointer"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};
