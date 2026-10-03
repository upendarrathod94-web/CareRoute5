import React from 'react';
import { AccessibilitySettings } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Bell,
  Clock,
  Users,
  Shield,
  Sliders,
  HelpCircle,
  ChevronRight,
  LogOut,
  Smartphone,
  Check,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { playChime } from '../../utils/audioHaptics';
import { maskPhone } from '../../utils/authUtils';

interface Props {
  settings: AccessibilitySettings;
  onNavigateAccessibility: () => void;
  onNavigateNotifications: () => void;
  onNavigateCareCircle: () => void;
  onSignOut: () => void;
  onShowToast: (msg: string) => void;
  onOpenApkModal?: () => void;
  onTestAlarm?: () => void;
  onVerifyEmail?: () => void;
  onVerifyPhone?: () => void;
}

export const ProfileScreen: React.FC<Props> = ({
  settings,
  onNavigateAccessibility,
  onNavigateNotifications,
  onNavigateCareCircle,
  onSignOut,
  onShowToast,
  onOpenApkModal,
  onTestAlarm,
  onVerifyEmail,
  onVerifyPhone,
}) => {
  const { user, userProfile, isEmailVerified, isPhoneVerified } = useAuth();

  const displayName = userProfile?.displayName || user?.displayName || 'Margaret Lewis';
  const email = userProfile?.email || user?.email || 'patient@careroute.health';
  const rawPhone = userProfile?.phoneNumber || user?.phoneNumber || '+1 (555) 234-8901';
  const phoneDisplay = maskPhone(rawPhone);

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col min-h-full px-5 py-6 space-y-6 max-w-xl mx-auto w-full animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings & Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your account, preferences, and Care Circle.
        </p>
      </div>

      {/* Clean List Rows in Simple Sections */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs overflow-hidden">
        {/* Section 1: User Identity Card */}
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-base flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                  {displayName}
                </h3>
                <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 shrink-0">
                  Patient
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {email}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Account Status & Verifications */}
        <div className="p-4 space-y-3 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Account Verification Status
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Email Verification Box */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-2xs">
              <div className="min-w-0 pr-2">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Email</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">{email}</p>
              </div>
              <div className="shrink-0">
                {isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-200/80 dark:border-teal-800">
                    <Check className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      playChime('click');
                      if (onVerifyEmail) onVerifyEmail();
                    }}
                    className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer"
                  >
                    Verify now
                  </button>
                )}
              </div>
            </div>

            {/* Phone Verification Box */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-2xs">
              <div className="min-w-0 pr-2">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Phone</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 font-mono truncate">{phoneDisplay}</p>
              </div>
              <div className="shrink-0">
                {isPhoneVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-200/80 dark:border-teal-800">
                    <Check className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      playChime('click');
                      if (onVerifyPhone) onVerifyPhone();
                    }}
                    className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer"
                  >
                    Verify now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Medication Reminders */}
        <button
          type="button"
          onClick={() => {
            if (onTestAlarm) onTestAlarm();
            else onShowToast('Medication alarm sound verified.');
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Medication Reminders
                </p>
                <span className="text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-1.5 py-0.2 rounded-md">
                  Loud Chime
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tap to test senior-optimized loud bell reminder
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800 shrink-0">
            🔊 Play Test
          </span>
        </button>

        {/* Section 4: Notifications */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            onNavigateNotifications();
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Notifications
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lock-screen name masking, vibration, and banner alerts
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {/* Section 5: Care Circle */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            onNavigateCareCircle();
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Care Circle
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Family members and trusted caregivers
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {/* Section 6: Accessibility */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            onNavigateAccessibility();
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Accessibility
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Text sizing ({settings.textSize}), dark mode, high contrast
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {/* Section 7: Install on Android Phone */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            if (onOpenApkModal) onOpenApkModal();
            else onShowToast('Opening Android Phone setup...');
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-teal-50/50 dark:bg-teal-950/20 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Download for Android Phone</span>
                <span className="text-[10px] bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold px-1.5 py-0.5 rounded-md">
                  APK / USB
                </span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Install as a native full-screen app on any Android device
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {/* Section 8: Help & Support */}
        <button
          type="button"
          onClick={() => {
            playChime('click');
            if (onOpenApkModal) onOpenApkModal();
            else onShowToast('Need help? Contact support or your healthcare provider.');
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Help & Support
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Phone install instructions, emergency contacts, FAQ
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
      </div>

      {/* Sign Out Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSignOut}
          className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};
