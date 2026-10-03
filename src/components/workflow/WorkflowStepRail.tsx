import React from 'react';
import { ScreenId, MainTab } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Pill,
  Calendar,
  Users,
  HeartPulse,
  Camera,
  AlertTriangle,
  Download,
  ShieldCheck,
  Clock,
  UserCheck,
} from 'lucide-react';

export interface WorkflowStep {
  stepNumber: number;
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  subScreens: {
    id: ScreenId;
    label: string;
    tab?: MainTab;
    description: string;
  }[];
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    stepNumber: 1,
    id: 'step_onboarding',
    title: 'Onboarding & Comfort',
    subtitle: 'Accessibility-first profile setup and privacy consent',
    badge: 'Step 1',
    icon: ShieldCheck,
    accentColor: 'from-blue-500 to-indigo-600',
    subScreens: [
      { id: 'welcome', label: 'Welcome Journey', description: 'Patient-first welcome visual and entry point' },
      { id: 'role', label: 'Role Selection', description: 'Choose between Patient or Caregiver persona' },
      { id: 'access_setup', label: 'Accessibility Setup', description: 'Large font size, high contrast & voice chimes' },
      { id: 'privacy_consent', label: 'Privacy Consent', description: 'Zero third-party data sharing guarantee' },
    ],
  },
  {
    stepNumber: 2,
    id: 'step_medicines',
    title: 'Daily Medicine Routine',
    subtitle: 'Dose schedules, pill clock, camera OCR & logs',
    badge: 'Step 2',
    icon: Pill,
    accentColor: 'from-teal-500 to-emerald-600',
    subScreens: [
      { id: 'today', label: 'Today Timeline', tab: 'today', description: 'Morning, afternoon & evening pill schedule' },
      { id: 'medicines', label: 'Prescription Cabinet', tab: 'medicines', description: 'Active medicines with stock countdown' },
      { id: 'add_medicine', label: 'Add Medication', tab: 'medicines', description: 'Custom doses, frequencies & pill shapes' },
      { id: 'reminder_active', label: 'Active Pill Alarm', tab: 'today', description: 'High-contrast full-screen dose alert' },
      { id: 'medicine_history', label: 'Adherence Log', tab: 'medicines', description: 'Complete record of taken, snoozed & skipped' },
    ],
  },
  {
    stepNumber: 3,
    id: 'step_doctor',
    title: 'Doctor Visits & Prep',
    subtitle: 'Specialist booking and visit preparation pocket',
    badge: 'Step 3',
    icon: Calendar,
    accentColor: 'from-sky-500 to-blue-600',
    subScreens: [
      { id: 'appointments', label: 'Upcoming Visits', tab: 'appointments', description: 'Consultation cards with directions & prep' },
      { id: 'doctor_search', label: 'Find Specialist', tab: 'appointments', description: 'Search cardiologists, neurologists & clinics' },
      { id: 'doctor_profile', label: 'Doctor Profile', tab: 'appointments', description: 'Qualifications, hospital affiliation & reviews' },
      { id: 'available_slots', label: 'Slot Selection', tab: 'appointments', description: 'Morning & afternoon consultation times' },
      { id: 'booking_review', label: 'Review & Confirm', tab: 'appointments', description: 'Finalize appointment with instant confirmation' },
    ],
  },
  {
    stepNumber: 4,
    id: 'step_caregiver',
    title: 'Care Circle & Safety',
    subtitle: 'Family caregiver sync, live status & emergency SOS',
    badge: 'Step 4',
    icon: Users,
    accentColor: 'from-purple-500 to-pink-600',
    subScreens: [
      { id: 'care_circle', label: 'Care Circle', tab: 'circle', description: 'Family members and sync connection status' },
      { id: 'invite_caregiver', label: 'Invite Caregiver', tab: 'circle', description: 'Secure 6-digit invite code generator' },
      { id: 'permissions_settings', label: 'Privacy Controls', tab: 'circle', description: 'Granular permissions for dose and visit views' },
      { id: 'caregiver_dashboard', label: 'Caregiver Portal', tab: 'circle', description: 'Remote check-in, refill status & logs' },
      { id: 'profile', label: 'Safety & Preferences', tab: 'profile', description: 'Medical ID, emergency contacts & notifications' },
    ],
  },
];

interface Props {
  currentScreen: ScreenId;
  onSelectScreen: (screenId: ScreenId) => void;
  onOpenScanner: () => void;
  onOpenSos: () => void;
  onOpenApkModal: () => void;
}

export const WorkflowStepRail: React.FC<Props> = ({
  currentScreen,
  onSelectScreen,
  onOpenScanner,
  onOpenSos,
  onOpenApkModal,
}) => {
  // Determine which step is active based on currentScreen
  const currentStepIndex = WORKFLOW_STEPS.findIndex((step) =>
    step.subScreens.some((sub) => sub.id === currentScreen)
  );
  const activeStep = currentStepIndex !== -1 ? WORKFLOW_STEPS[currentStepIndex] : WORKFLOW_STEPS[1];

  const handleNextScreen = () => {
    // Flatten all screens
    const allScreens = WORKFLOW_STEPS.flatMap((step) => step.subScreens.map((s) => s.id));
    const currentIndex = allScreens.indexOf(currentScreen);
    if (currentIndex !== -1 && currentIndex < allScreens.length - 1) {
      onSelectScreen(allScreens[currentIndex + 1]);
    } else {
      onSelectScreen(allScreens[0]);
    }
  };

  const handlePrevScreen = () => {
    const allScreens = WORKFLOW_STEPS.flatMap((step) => step.subScreens.map((s) => s.id));
    const currentIndex = allScreens.indexOf(currentScreen);
    if (currentIndex > 0) {
      onSelectScreen(allScreens[currentIndex - 1]);
    }
  };

  return (
    <aside className="w-full lg:w-84 xl:w-96 flex flex-col bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/80 shrink-0 select-none overflow-y-auto">
      {/* Step Guide Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
              Interactive Flow Steps
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Step {activeStep.stepNumber} of {WORKFLOW_STEPS.length}
          </span>
        </div>

        <h2 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
          <span>Defined App Workflow</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevScreen}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Previous Screen in Flow"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextScreen}
              className="p-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white transition-colors"
              title="Next Screen in Flow"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </h2>
        <p className="text-xs text-slate-400 mt-1 leading-snug">
          Click any step or screen below to immediately guide the mobile device to that screen.
        </p>

        {/* Step Progress Pills */}
        <div className="grid grid-cols-4 gap-1.5 mt-3">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isStepActive = step.stepNumber === activeStep.stepNumber;
            const isStepPassed = step.stepNumber < activeStep.stepNumber;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectScreen(step.subScreens[0].id)}
                className={`h-1.5 rounded-full transition-all ${
                  isStepActive
                    ? 'bg-teal-400 shadow-sm shadow-teal-500/50'
                    : isStepPassed
                    ? 'bg-teal-700'
                    : 'bg-slate-800'
                }`}
                title={`Jump to ${step.title}`}
              />
            );
          })}
        </div>
      </div>

      {/* Steps Accordion List */}
      <div className="p-3 space-y-2.5 flex-1">
        {WORKFLOW_STEPS.map((step) => {
          const StepIcon = step.icon;
          const isStepActive = step.stepNumber === activeStep.stepNumber;

          return (
            <div
              key={step.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isStepActive
                  ? 'bg-slate-800/80 border-teal-500/50 shadow-lg shadow-teal-950/40'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Step Header Button */}
              <button
                type="button"
                onClick={() => onSelectScreen(step.subScreens[0].id)}
                className="w-full p-3 text-left flex items-start justify-between gap-3 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                      isStepActive
                        ? 'bg-gradient-to-tr from-teal-500 to-emerald-600 ring-2 ring-teal-400/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                        {step.badge}
                      </span>
                      <span className="text-xs font-bold text-white">{step.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 text-slate-400 transition-transform mt-1 shrink-0 ${
                    isStepActive ? 'rotate-90 text-teal-400' : ''
                  }`}
                />
              </button>

              {/* Sub-Screens inside step */}
              {isStepActive && (
                <div className="px-2.5 pb-2.5 pt-1 border-t border-slate-700/60 space-y-1 bg-slate-950/30 animate-fadeIn">
                  {step.subScreens.map((sub) => {
                    const isSubActive = currentScreen === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => onSelectScreen(sub.id)}
                        className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                          isSubActive
                            ? 'bg-teal-600 text-white font-bold shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSubActive ? 'bg-white' : 'bg-slate-600'
                              }`}
                            />
                            <span className="truncate">{sub.label}</span>
                          </div>
                          <p
                            className={`text-[10px] truncate mt-0.5 ${
                              isSubActive ? 'text-teal-100' : 'text-slate-500'
                            }`}
                          >
                            {sub.description}
                          </p>
                        </div>

                        {isSubActive && (
                          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fast Feature Actions Bar (Keep operations immediate) */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
          Instant Mobile Actions
        </span>

        <div className="grid grid-cols-2 gap-2">
          {/* Pill Camera OCR */}
          <button
            type="button"
            onClick={onOpenScanner}
            className="p-2 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700/50 text-blue-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-blue-400" />
            <span>Scan Rx</span>
          </button>

          {/* Emergency SOS */}
          <button
            type="button"
            onClick={onOpenSos}
            className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-700/50 text-red-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>SOS Alert</span>
          </button>
        </div>

        {/* APK Install Button */}
        <button
          type="button"
          onClick={onOpenApkModal}
          className="w-full p-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Get Android APK & Install</span>
        </button>
      </div>
    </aside>
  );
};
