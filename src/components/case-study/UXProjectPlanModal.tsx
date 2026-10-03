import React, { useState } from 'react';
import { ASSETS_3D } from '../../assets/assetRegistry';
import { UX_PROJECT_PLAN } from '../../data/mockData';
import {
  Calendar,
  Users,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Eye,
  Sliders,
  Award,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  completedTaskIds: string[];
  onTriggerTask: (taskId: string) => void;
  onClose?: () => void;
}

export const UXProjectPlanModal: React.FC<Props> = ({
  completedTaskIds,
  onTriggerTask,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'research' | 'tasks' | 'designSystem' | 'resume'>('plan');
  const [copiedResume, setCopiedResume] = useState(false);

  const handleCopyResume = () => {
    navigator.clipboard?.writeText(UX_PROJECT_PLAN.resumeSnippet);
    setCopiedResume(true);
    playChime('success');
    triggerHaptic(40);
    setTimeout(() => setCopiedResume(false), 2200);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden">
      {/* Top Banner Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/60 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800">
              UI/UX Portfolio Project
            </span>
            <span className="text-xs text-slate-400">Case Study & 4-Week Sprint</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <span>CareRoute — UX Case Study</span>
          </h1>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Back to App
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 px-4 gap-1.5 overflow-x-auto shrink-0 bg-slate-900/90 scrollbar-none py-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('plan')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'plan'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          4-Week Project Plan
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('research')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'research'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Research & Personas
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tasks')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'tasks'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>Usability Testing</span>
          <span className="bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded-full text-[10px]">
            {completedTaskIds.length}/6
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('designSystem')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'designSystem'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Design System & 3D Assets
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('resume')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'resume'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Portfolio & Résumé
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* TAB 1: 4-WEEK PROJECT PLAN */}
        {activeTab === 'plan' && (
          <div className="space-y-6 max-w-3xl">
            {/* Problem Statement Card */}
            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 shadow-md">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Core Problem Statement
              </span>
              <p className="text-base text-slate-100 font-medium mt-1 leading-relaxed">
                "{UX_PROJECT_PLAN.problemStatement}"
              </p>
            </div>

            {/* 4-Week Timeline Grid */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>Four-Week Sprint Roadmap</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {UX_PROJECT_PLAN.fourWeekPlan.map((weekItem, idx) => (
                  <div
                    key={weekItem.week}
                    className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black px-2.5 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
                          {weekItem.week}
                        </span>
                        <span className="text-[11px] text-slate-400">Sprint Phase {idx + 1}</span>
                      </div>
                      <h3 className="font-bold text-white text-base mb-3">
                        {weekItem.title}
                      </h3>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {weekItem.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edge Cases Table */}
            <div className="p-5 rounded-3xl bg-slate-800/60 border border-slate-700">
              <h3 className="font-bold text-base text-white mb-3">
                Critical Edge Cases Considered
              </h3>
              <div className="space-y-2.5 text-xs">
                {UX_PROJECT_PLAN.edgeCases.map((edge, eIdx) => (
                  <div
                    key={eIdx}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <span className="font-bold text-teal-300 shrink-0 sm:w-56">
                      {edge.title}
                    </span>
                    <span className="text-slate-300">{edge.behavior}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESEARCH & PERSONA */}
        {activeTab === 'research' && (
          <div className="space-y-6 max-w-3xl">
            {/* Persona 1: Margaret Lewis (Patient) */}
            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  M
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">Margaret Lewis (Age 72)</h2>
                    <span className="text-[11px] font-semibold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-md">
                      Primary Persona: Patient
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Retired high school teacher • Lives independently in San Francisco
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <p className="font-bold text-teal-300 mb-1">Pain Points & Fears</p>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    <li>Small text on medicine bottles and medical portals causes eye strain</li>
                    <li>Worry about forgetting blood pressure pills or accidentally taking them twice</li>
                    <li>Wants family support in case of emergencies, but cherishes autonomy</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <p className="font-bold text-blue-300 mb-1">CareRoute Design Solution</p>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    <li>High contrast typography with instant 'Largest' text scaling</li>
                    <li>Big 'Taken' button with duplicate-tap protection</li>
                    <li>Granular privacy permissions: daughter only sees what Margaret approves</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Persona 2: Priya Sharma (Caregiver) */}
            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  P
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">Priya Sharma (Age 41)</h2>
                    <span className="text-[11px] font-semibold bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-md">
                      Secondary Persona: Caregiver Daughter
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Full-time Product Manager • 2 kids • Wants to ensure mother is safe
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs">
                <p className="font-bold text-teal-300 mb-1">Core Job-To-Be-Done</p>
                <p className="text-slate-300 leading-relaxed">
                  "I want to know if my mother forgets her heart medicine or has an upcoming doctor visit so I can offer a ride, without making her feel like I'm micromanaging her personal life."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: USABILITY TESTING TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Interactive Usability Tasks</h2>
                <p className="text-xs text-slate-400">
                  Try completing these 6 tasks in the prototype to observe accessibility & user flow:
                </p>
              </div>
              <span className="text-xs font-bold text-teal-400 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
                {completedTaskIds.length} / 6 Completed
              </span>
            </div>

            <div className="space-y-3">
              {UX_PROJECT_PLAN.testingTasks.map((t, idx) => {
                const isCompleted = completedTaskIds.includes(t.id);
                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-teal-950/30 border-teal-700/70'
                        : 'bg-slate-800/60 border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            isCompleted
                              ? 'bg-teal-500 text-slate-950'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4" strokeWidth={3} /> : idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">{t.instruction}</h3>
                          <p className="text-xs text-teal-300 mt-0.5">
                            How to test: {t.actionHint}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Validation: {t.solutionOutcome}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onTriggerTask(t.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                          isCompleted
                            ? 'bg-teal-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isCompleted ? 'Marked Complete' : 'Jump to Screen'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: DESIGN SYSTEM & 3D ASSETS */}
        {activeTab === 'designSystem' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">
                Custom 3D Claymorphic Asset Suite
              </h2>
              <p className="text-xs text-slate-400">
                Created to reinforce visual clarity, calming aesthetics, and elderly-friendly reassurance.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-center">
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 shadow-md">
                  <img
                    src={ASSETS_3D.pillClock}
                    alt="3D Pill Clock"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs font-bold text-white">Daily Pill Clock</p>
                <p className="text-[10px] text-slate-400">Medicine Reminders</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-center">
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 shadow-md">
                  <img
                    src={ASSETS_3D.doctorCalendar}
                    alt="3D Calendar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs font-bold text-white">Doctor Visit Desk</p>
                <p className="text-[10px] text-slate-400">Appointments</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-center">
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 shadow-md">
                  <img
                    src={ASSETS_3D.privacyShield}
                    alt="3D Privacy Shield"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs font-bold text-white">Privacy Padlock</p>
                <p className="text-[10px] text-slate-400">Care Circle Permissions</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-center">
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 shadow-md">
                  <img
                    src={ASSETS_3D.accessibility}
                    alt="3D Accessibility"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs font-bold text-white">Sensory Waves</p>
                <p className="text-[10px] text-slate-400">Accessible Display</p>
              </div>
            </div>

            {/* Design System Tokens */}
            <div className="p-5 rounded-3xl bg-slate-800/60 border border-slate-700 space-y-3">
              <h3 className="font-bold text-white text-sm">
                Design System & Accessibility Standards
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <p className="font-bold text-blue-400 mb-0.5">8px Spacing Grid</p>
                  <p className="text-slate-300">
                    Consistent 8px, 16px, 24px rhythm with 48px minimum touch targets.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <p className="font-bold text-teal-400 mb-0.5">WCAG AAA Contrast</p>
                  <p className="text-slate-300">
                    High contrast text and distinct iconography ensuring non-color-only state cues.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <p className="font-bold text-purple-400 mb-0.5">Dual Visual Themes</p>
                  <p className="text-slate-300">
                    Seamless dark mode & light mode transitions with warm neutral foundations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: RESUME & CASE STUDY COPY */}
        {activeTab === 'resume' && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Portfolio & Résumé Snippet</h2>
                <p className="text-xs text-slate-400">
                  Copyable text ready to paste directly into your portfolio or CV:
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyResume}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                {copiedResume ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedResume ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 font-mono text-xs leading-relaxed text-teal-300 border border-slate-800 select-all whitespace-pre-line">
              {UX_PROJECT_PLAN.resumeSnippet}
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-2">
              <p className="font-bold text-white">Case Study Storyline Summary:</p>
              <p>
                1. <strong>Problem:</strong> Patients face cognitive fatigue remembering complex medication schedules, while family members worry without visibility.
              </p>
              <p>
                2. <strong>Insight:</strong> Independence must come first. Caregivers should only receive alerts if the patient misses a dose, and patients must control what is visible.
              </p>
              <p>
                3. <strong>Solution:</strong> A friendly, 3D-enhanced accessible mobile app featuring large buttons, clear dose tracker, easy doctor booking, and permission-based Care Circle support.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
