import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Phone, ShieldCheck, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';
import { maskPhone } from '../../utils/authUtils';

interface Props {
  onVerifiedContinue: () => void;
  onNavigateLogin?: () => void;
}

export const VerifyPhoneScreen: React.FC<Props> = ({ onVerifiedContinue, onNavigateLogin }) => {
  const { userProfile, pendingPhone, sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const rawPhone = pendingPhone || userProfile?.phoneNumber || '+1 (555) 234-5678';
  const displayMaskedPhone = maskPhone(rawPhone);

  // Focus first slot on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      setDigits(nextDigits);
      return;
    }

    // Handle paste of full 6 digits
    if (cleaned.length > 1) {
      const nextDigits = [...digits];
      const pastedChars = cleaned.slice(0, 6).split('');
      pastedChars.forEach((ch, i) => {
        if (index + i < 6) nextDigits[index + i] = ch;
      });
      setDigits(nextDigits);
      const nextFocus = Math.min(5, index + pastedChars.length);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleaned.charAt(cleaned.length - 1);
    setDigits(nextDigits);

    // Auto-advance to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const fullCode = digits.join('');

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (fullCode.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      playChime('alert');
      return;
    }

    setVerifying(true);
    try {
      const res = await verifyPhoneOtp(fullCode);
      if (res.success) {
        playChime('success');
        triggerHaptic(60);
        setSuccessMessage('Phone number verified successfully!');
        setTimeout(() => {
          onVerifiedContinue();
        }, 600);
      } else {
        setErrorMessage(res.error || 'Incorrect code. Please try again.');
        playChime('alert');
        triggerHaptic(80);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please try again.');
      playChime('alert');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await sendPhoneOtp();
      if (res.success) {
        playChime('click');
        triggerHaptic(40);
        setSuccessMessage('A fresh verification code has been dispatched.');
        setCooldown(60);
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setErrorMessage(res.error || 'Failed to resend code.');
        if (res.cooldownRemaining) setCooldown(res.cooldownRemaining);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full justify-between p-6 sm:p-8 max-w-md mx-auto w-full animate-fadeIn pb-10">
      <div>
        <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto mb-6 shadow-xs border border-teal-200/80 dark:border-teal-800">
          <Phone className="w-8 h-8" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Verify your phone number
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            We sent a 6-digit verification code to
          </p>
          <div className="mt-3 inline-block px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
            {displayMaskedPhone}
          </div>
        </div>

        {successMessage && (
          <div className="mb-4 p-3.5 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 rounded-xl flex items-start gap-2.5 text-xs text-teal-800 dark:text-teal-200 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-teal-600 dark:text-teal-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 6-Digit OTP Input Form */}
        <form onSubmit={handleVerify} className="space-y-5 pt-2">
          <div>
            <div className="flex justify-center gap-2 sm:gap-2.5">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete="one-time-code"
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl font-bold rounded-xl bg-white dark:bg-slate-900 border transition-all outline-none ${
                    digit
                      ? 'border-teal-600 ring-1 ring-teal-600 text-teal-900 dark:text-teal-200'
                      : 'border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-2">
              Code expires in 5 minutes. Never share this code with anyone.
            </p>
          </div>

          {/* Primary Action Button: Verify */}
          <button
            type="submit"
            disabled={verifying || fullCode.length < 6}
            className="w-full h-12 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-colors cursor-pointer"
          >
            {verifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying code...</span>
              </>
            ) : (
              <>
                <span>Verify</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Secondary Action: Resend code with countdown */}
          <div className="text-center pt-1">
            <button
              type="button"
              disabled={cooldown > 0 || resending}
              onClick={handleResend}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline disabled:opacity-50 cursor-pointer"
            >
              {resending ? (
                'Requesting code...'
              ) : cooldown > 0 ? (
                `Resend code in ${cooldown}s`
              ) : (
                'Resend code'
              )}
            </button>
          </div>
        </form>
      </div>

      {onNavigateLogin && (
        <div className="pt-6 text-center border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
          >
            Back to Log in
          </button>
        </div>
      )}
    </div>
  );
};
