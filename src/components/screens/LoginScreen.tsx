import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, UserCheck, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  onNavigateRegister: () => void;
  onNavigateForgotPassword: () => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<Props> = ({
  onNavigateRegister,
  onNavigateForgotPassword,
  onLoginSuccess,
}) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or phone number.');
      playChime('alert');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      playChime('alert');
      return;
    }

    setLoading(true);
    try {
      await login(identifier.trim(), password);
      playChime('success');
      triggerHaptic(50);
      onLoginSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'The email / phone or password is incorrect.');
      playChime('alert');
      triggerHaptic(80);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full justify-between p-6 sm:p-8 max-w-md mx-auto w-full animate-fadeIn pb-10">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-sm shadow-xs border border-teal-200/80 dark:border-teal-800">
            CR
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
            CareRoute
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1.5">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Log in to manage your medication schedule and appointments.
        </p>

        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <span className="font-medium leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Phone Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Email / Phone
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com or phone"
                className="w-full h-12 pl-10 pr-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-800 focus:border-teal-600 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-600 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Password
              </label>
              <button
                type="button"
                onClick={onNavigateForgotPassword}
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-10 pr-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-800 focus:border-teal-600 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-600 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Primary Button: Log In */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="pt-6 text-center border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onNavigateRegister}
            className="font-bold text-teal-700 dark:text-teal-400 hover:underline ml-1 cursor-pointer"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};
