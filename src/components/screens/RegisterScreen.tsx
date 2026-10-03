import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Lock, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';
import { isValidEmail, isValidPhone } from '../../utils/authUtils';

interface Props {
  onNavigateLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterScreen: React.FC<Props> = ({
  onNavigateLogin,
  onRegisterSuccess,
}) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      playChime('alert');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      playChime('alert');
      return;
    }
    if (!isValidPhone(phoneNumber)) {
      setErrorMessage('Please enter a valid phone number (at least 8 digits with country code).');
      playChime('alert');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      playChime('alert');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      playChime('alert');
      return;
    }

    setLoading(true);
    try {
      await register(fullName.trim(), email.trim(), phoneNumber.trim(), password);
      playChime('success');
      triggerHaptic(60);
      onRegisterSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during account creation.');
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
          Welcome to CareRoute
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Your simple medication companion.
        </p>

        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <span className="font-medium leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Margaret Lewis"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-800 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Email Address
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
                className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-800 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                autoComplete="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-800 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-800 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-800 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="pt-6 text-center border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="font-bold text-teal-700 dark:text-teal-400 hover:underline ml-1 cursor-pointer"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};
