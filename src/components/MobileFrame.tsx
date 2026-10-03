import React from 'react';
import { MainTab, ScreenId, AccessibilitySettings } from '../types';
import {
  Home,
  Pill,
  Camera,
  Calendar,
  User,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../utils/audioHaptics';
import { useAuth } from '../context/AuthContext';

interface Props {
  currentScreen: ScreenId;
  currentTab: MainTab;
  accessibility: AccessibilitySettings;
  onNavigateTab: (tab: MainTab) => void;
  onJumpToScreen: (screen: ScreenId) => void;
  notificationBanner: {
    visible: boolean;
    title: string;
    message: string;
    onClick?: () => void;
  } | null;
  onDismissNotification: () => void;
  children: React.ReactNode;
  hideTopControlBar?: boolean;
}

const TAB_CONFIG: { tab: MainTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { tab: 'today', label: 'Home', icon: Home },
  { tab: 'medicines', label: 'Medicines', icon: Pill },
  { tab: 'scan', label: 'Scan', icon: Camera },
  { tab: 'appointments', label: 'Appointments', icon: Calendar },
  { tab: 'profile', label: 'Profile', icon: User },
];

export const MobileFrame: React.FC<Props> = ({
  currentScreen,
  currentTab,
  accessibility,
  onNavigateTab,
  notificationBanner,
  children,
}) => {
  const { user, userProfile } = useAuth();
  const userInitial = (userProfile?.displayName || user?.displayName || 'M').charAt(0).toUpperCase();

  // Navigation visible on main tabs and primary top-level screens
  const isNavVisible = [
    'today',
    'medicines',
    'scan',
    'appointments',
    'empty_appointments',
    'profile',
    'care_circle',
    'medicine_history',
  ].includes(currentScreen);

  const getTextScaleClass = () => {
    switch (accessibility.textSize) {
      case 'large':
        return 'text-[17px]';
      case 'largest':
        return 'text-[19px]';
      default:
        return 'text-[15px]';
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start overflow-hidden bg-[#F4F5F7] dark:bg-slate-950 font-sans">
      {/* Universal Container: Centered, clean, responsive */}
      <div
        className={`w-full h-full max-w-xl md:max-w-3xl flex flex-col relative transition-all duration-200 overflow-hidden sm:border-x sm:border-slate-200 dark:sm:border-slate-800 ${
          accessibility.darkMode
            ? 'bg-slate-950 text-slate-100'
            : 'bg-[#FAFBFB] text-slate-900'
        } ${accessibility.highContrast ? 'ring-4 ring-amber-400' : ''} ${getTextScaleClass()}`}
      >
        {/* Desktop / Tablet Clean Top Navigation Bar (Zone 1: Wordmark, Zone 2: Nav Tabs, Zone 3: Profile/Status) */}
        {isNavVisible && (
          <header className="hidden md:flex items-center justify-between px-6 h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shrink-0 z-30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                CR
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                CareRoute
              </span>
            </div>

            <nav aria-label="Desktop Navigation" className="flex items-center gap-1">
              {TAB_CONFIG.map(({ tab, label, icon: Icon }) => {
                const isActive = currentTab === tab;
                const isScan = tab === 'scan';
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      playChime('click');
                      triggerHaptic(25);
                      onNavigateTab(tab);
                    }}
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                        : isScan
                        ? 'text-teal-700 dark:text-teal-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateTab('profile')}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs hover:ring-2 hover:ring-teal-500 transition-all"
                title="Profile"
              >
                {userInitial}
              </button>
            </div>
          </header>
        )}

        {/* In-App Alert Banner (Quiet, clean toast/banner) */}
        {notificationBanner?.visible && (
          <div
            onClick={notificationBanner.onClick}
            className="absolute top-3 left-4 right-4 z-40 bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700/80 cursor-pointer animate-fadeIn"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                CR
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-teal-400">Reminder</span>
                  <span className="text-[10px] text-slate-400">now</span>
                </div>
                <p className="font-bold text-sm text-white truncate mt-0.5">
                  {notificationBanner.title}
                </p>
                <p className="text-xs text-slate-300 leading-snug">
                  {notificationBanner.message}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-teal-300 mt-1.5 text-right font-medium">Tap to view</p>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col min-h-0">
          {children}
        </div>

        {/* Mobile Fixed Bottom Navigation Bar (Home, Medicines, Scan, Appointments, Profile) */}
        {isNavVisible && (
          <nav
            aria-label="Bottom Navigation"
            className={`md:hidden min-h-[64px] pb-[env(safe-area-inset-bottom)] px-2 border-t flex items-center justify-around shrink-0 z-30 transition-colors ${
              accessibility.darkMode
                ? 'bg-slate-900/98 border-slate-800'
                : 'bg-white/98 border-slate-200/90 shadow-sm'
            }`}
          >
            {TAB_CONFIG.map(({ tab, label, icon: Icon }) => {
              const isActive = currentTab === tab;
              const isScan = tab === 'scan';

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    playChime('click');
                    triggerHaptic(30);
                    onNavigateTab(tab);
                  }}
                  className={`min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all relative ${
                    isActive
                      ? 'text-teal-700 dark:text-teal-400 font-bold'
                      : isScan
                      ? 'text-teal-600 dark:text-teal-400 font-semibold'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
                  }`}
                >
                  {isScan ? (
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
                  )}
                  <span className="text-[10px] tracking-tight whitespace-nowrap leading-none mt-0.5">
                    {label}
                  </span>
                  {isActive && !isScan && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-teal-600 dark:bg-teal-400" />
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};
