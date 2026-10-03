import React from 'react';
import { AccessibilitySettings, TextSize } from '../../types';
import { ASSETS_3D } from '../../assets/assetRegistry';
import { ArrowRight, Volume2, Vibrate, SunMoon, Eye, Bell } from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  onContinue: () => void;
  onBack?: () => void;
}

export const AccessibilitySetupScreen: React.FC<Props> = ({
  settings,
  onUpdateSettings,
  onContinue,
}) => {
  const handleSizeChange = (size: TextSize) => {
    playChime('click');
    triggerHaptic(40);
    onUpdateSettings({ textSize: size });
  };

  const handleToggle = (key: keyof AccessibilitySettings) => {
    playChime('subtle');
    triggerHaptic(30);
    onUpdateSettings({ [key]: !settings[key] });
  };

  return (
    <div className="flex flex-col h-full justify-between p-6 animate-fadeIn overflow-y-auto">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
            Step 2 of 3
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Personalize Experience</span>
        </div>

        {/* 3D Header Graphic */}
        <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/60 border border-blue-100/60 dark:border-slate-700">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-md border border-white dark:border-slate-600">
            <img
              src={ASSETS_3D.accessibility}
              alt="Accessibility 3D visual"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Make it easy to read
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Customize display and sound for comfort. You can change these anytime in Profile.
            </p>
          </div>
        </div>

        {/* Text Size Controls */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Text Size
            </label>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {settings.textSize}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => handleSizeChange('standard')}
              className={`py-3 rounded-xl font-medium transition-all text-sm ${
                settings.textSize === 'standard'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => handleSizeChange('large')}
              className={`py-3 rounded-xl font-medium transition-all text-base ${
                settings.textSize === 'large'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Large
            </button>
            <button
              type="button"
              onClick={() => handleSizeChange('largest')}
              className={`py-3 rounded-xl font-medium transition-all text-lg ${
                settings.textSize === 'largest'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Largest
            </button>
          </div>

          {/* Dynamic text preview box */}
          <div className="mt-2.5 p-3.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">
              Sample Live Preview:
            </p>
            <p
              className={`font-semibold text-slate-900 dark:text-white transition-all ${
                settings.textSize === 'standard'
                  ? 'text-sm'
                  : settings.textSize === 'large'
                  ? 'text-base'
                  : 'text-lg'
              }`}
            >
              "Metformin 500mg • Take with breakfast at 8:30 AM"
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/70 shadow-sm">
          {/* Dark Mode */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-slate-700 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <SunMoon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-white">Dark Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Easier on eyes at night</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('darkMode')}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative ${
                settings.darkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Loud Reminder Sound for Seniors */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">Loud Reminder Chime</p>
                  <span className="text-[10px] bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold px-1 rounded">Seniors</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Penetrating bell alarm for hearing clarity</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('loudReminderSound')}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative cursor-pointer ${
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

          {/* Voice Reminders */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-white">Voice Reminders</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Spoken alerts for doses</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('voiceReminders')}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative ${
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
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Vibrate className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-white">Vibration</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Haptic feedback for alarms</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('vibrationReminders')}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative ${
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

          {/* High Contrast */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-white">High Contrast</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Enhanced borders & bolder text</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('highContrast')}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative ${
                settings.highContrast ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 pb-2">
        <button
          type="button"
          onClick={onContinue}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 text-base transition-all"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
