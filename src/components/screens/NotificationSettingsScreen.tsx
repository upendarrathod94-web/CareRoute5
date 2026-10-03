import React from 'react';
import { AccessibilitySettings } from '../../types';
import { ArrowLeft, Bell, Volume2, Vibrate, Shield, Smartphone, EyeOff } from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  onBack: () => void;
  onTestNotification: () => void;
}

export const NotificationSettingsScreen: React.FC<Props> = ({
  settings,
  onUpdateSettings,
  onBack,
  onTestNotification,
}) => {
  const toggle = (key: keyof AccessibilitySettings) => {
    playChime('subtle');
    triggerHaptic(30);
    onUpdateSettings({ [key]: !settings[key] });
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
              Notifications & Privacy
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize alerts, lock-screen text, and sounds
            </p>
          </div>
        </div>

        {/* Lock Screen Privacy Card (Key Spec requirement!) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700 mb-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <EyeOff className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                  Hide Medicine Names on Lock Screen
                </h2>
                <button
                  type="button"
                  onClick={() => toggle('hideLockScreenNames')}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${
                    settings.hideLockScreenNames ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.hideLockScreenNames ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                When turned on, notifications on your locked phone will display <em>"Time for your medicine"</em> instead of the exact drug name, preventing strangers from seeing your medical condition.
              </p>
            </div>
          </div>
        </div>

        {/* Alert Delivery Modes */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 px-1">
            Reminder Methods
          </label>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/60 shadow-xs">
            {/* Extra Loud Reminder Chime for Seniors */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-xs text-slate-900 dark:text-white">
                      Extra Loud Reminder Chime
                    </p>
                    <span className="text-[10px] bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold px-1.5 py-0.2 rounded-md">
                      For Seniors
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    High volume, penetrating bell melody designed for age-related hearing loss
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('loudReminderSound')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${
                  settings.loudReminderSound !== false ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.loudReminderSound !== false ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Voice */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">
                    Voice Spoken Reminders
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Speaks: "Margaret, it's time for your morning medicine."
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('voiceReminders')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${
                  settings.voiceReminders ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.voiceReminders ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Vibration */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center shrink-0">
                  <Vibrate className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">
                    Distinct Vibration Pulses
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Unique tactile vibration rhythm so you recognize medicine alarms
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('vibrationReminders')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${
                  settings.vibrationReminders ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.vibrationReminders ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Screen Reader */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">
                    Screen-Reader Friendly Labels
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Clear accessibility ARIA announcements for TalkBack / VoiceOver
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('screenReaderDescriptions')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${
                  settings.screenReaderDescriptions ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.screenReaderDescriptions ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Live Notification Preview Trigger */}
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Simulate Lock-Screen Alert</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            Trigger a test alert to check how the lock-screen banner and loud senior reminder chime ring on your phone.
          </p>
          <button
            type="button"
            onClick={onTestNotification}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span>Test Loud Medicine Reminder Chime</span>
          </button>
        </div>
      </div>

      <div className="pt-4 pb-2">
        <button
          type="button"
          onClick={onBack}
          className="w-full h-12 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-2xl text-xs"
        >
          Back
        </button>
      </div>
    </div>
  );
};
