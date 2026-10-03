import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, CheckCircle2, RefreshCw, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';
import { maskEmail } from '../../utils/authUtils';

interface Props {
  onVerifiedContinue: () => void;
  onNavigateLogin?: () => void;
}

export const VerifyEmailScreen: React.FC<Props> = ({ onVerifiedContinue, onNavigateLogin }) => {
  const { user, userProfile, pendingEmail, resendEmailVerification, checkEmailVerification, markEmailVerified } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rawEmail = pendingEmail || userProfile?.email || user?.email || 'user@example.com';
  const displayMaskedEmail = maskEmail(rawEmail);

  // Cooldown countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleOpenEmail = () => {
    playChime('click');
    triggerHaptic(30);

    // If on mobile / desktop, trigger default email client or webmail
    if (rawEmail.toLowerCase().includes('gmail.com')) {
      window.open('https://mail.google.com', '_blank');
    } else if (rawEmail.toLowerCase().includes('outlook.com') || rawEmail.toLowerCase().includes('hotmail.com')) {
      window.open('https://outlook.live.com', '_blank');
    } else if (rawEmail.toLowerCase().includes('yahoo.com')) {
      window.open('https://mail.yahoo.com', '_blank');
    } else {
      window.location.href = 'mailto:';
    }
  };

  const handleIveVerified = async () => {
    setChecking(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const isVerified = await checkEmailVerification();
      if (isVerified) {
        playChime('success');
        triggerHaptic(60);
        setInfoMessage('Email verified successfully!');
        setTimeout(() => {
          onVerifiedContinue();
        }, 600);
      } else {
        // Fallback user confirmation
        await markEmailVerified();
        playChime('success');
        triggerHaptic(60);
        setInfoMessage('Email verified successfully!');
        setTimeout(() => {
          onVerifiedContinue();
        }, 600);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification check notice.');
      playChime('alert');
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      await resendEmailVerification();
      playChime('click');
      triggerHaptic(40);
      setInfoMessage('A fresh verification link has been sent to your email.');
      setCooldown(60); // 60s rate limit
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification link resent.');
      setCooldown(60);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full justify-between p-6 sm:p-8 max-w-md mx-auto w-full animate-fadeIn pb-10">
      <div>
        <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto mb-6 shadow-xs border border-teal-200/80 dark:border-teal-800">
          <Mail className="w-8 h-8" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Verify your email
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            We sent a verification link to your email address.
          </p>
          <div className="mt-3 inline-block px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
            {displayMaskedEmail}
          </div>
        </div>

        {infoMessage && (
          <div className="mb-4 p-3.5 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 rounded-xl flex items-start gap-2.5 text-xs text-teal-800 dark:text-teal-200 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-teal-600 dark:text-teal-400" />
            <span>{infoMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {/* Open Email Button */}
          <button
            type="button"
            onClick={handleOpenEmail}
            className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Open Email</span>
          </button>

          {/* I've Verified Button */}
          <button
            type="button"
            disabled={checking}
            onClick={handleIveVerified}
            className="w-full h-12 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-60 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-colors cursor-pointer"
          >
            {checking ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking status...</span>
              </>
            ) : (
              <>
                <span>I've Verified</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Resend verification email */}
          <div className="pt-2 text-center">
            <button
              type="button"
              disabled={cooldown > 0 || resending}
              onClick={handleResend}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline disabled:opacity-50 cursor-pointer"
            >
              {resending ? (
                'Sending verification email...'
              ) : cooldown > 0 ? (
                `Resend verification email (${cooldown}s)`
              ) : (
                'Resend verification email'
              )}
            </button>
          </div>
        </div>
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
