import React, { useState, useEffect } from 'react';
import { Appointment, DoctorPrepQuestion, VoiceNote } from '../../types';
import {
  X,
  CheckSquare,
  Square,
  Plus,
  Mic,
  Square as StopSquare,
  Play,
  Pause,
  Clock,
  Sparkles,
  Calendar,
  Volume2,
  Trash2,
  HelpCircle,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onUpdateAppointment: (updated: Appointment) => void;
}

const QUESTION_SUGGESTIONS = [
  'Dizziness when standing up',
  'Review daily blood pressure readings',
  'Flu / booster shot recommendations',
  'Can we reduce dosage of any meds?',
  'Safe gentle exercises for knees',
];

export const DoctorVisitPrepModal: React.FC<Props> = ({
  isOpen,
  onClose,
  appointment,
  onUpdateAppointment,
}) => {
  const [questions, setQuestions] = useState<DoctorPrepQuestion[]>([]);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [newQuestionText, setNewQuestionText] = useState('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  useEffect(() => {
    if (appointment) {
      setQuestions(
        appointment.prepQuestions || [
          {
            id: 'q-1',
            text: 'Ask about slight dizziness when standing up in the morning',
            completed: false,
          },
          {
            id: 'q-2',
            text: 'Review 3-month blood pressure logs with Dr. Maya Rao',
            completed: true,
          },
        ]
      );
      setVoiceNotes(
        appointment.voiceNotes || [
          {
            id: 'vn-1',
            title: "Dr. Rao's diet advice: maintain low sodium & hydrate",
            duration: '0:28',
            timestamp: 'Last checkup note',
          },
        ]
      );
    }
  }, [appointment]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!isOpen || !appointment) return null;

  const toggleQuestion = (id: string) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, completed: !q.completed } : q
    );
    setQuestions(updated);
    playChime('click');
    triggerHaptic(40);
    onUpdateAppointment({ ...appointment, prepQuestions: updated, voiceNotes });
  };

  const handleAddQuestion = (text: string) => {
    if (!text.trim()) return;
    const newQ: DoctorPrepQuestion = {
      id: `q-${Date.now()}`,
      text: text.trim(),
      completed: false,
    };
    const updated = [...questions, newQ];
    setQuestions(updated);
    setNewQuestionText('');
    playChime('success');
    triggerHaptic(50);
    onUpdateAppointment({ ...appointment, prepQuestions: updated, voiceNotes });
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    playChime('subtle');
    onUpdateAppointment({ ...appointment, prepQuestions: updated, voiceNotes });
  };

  const handleStartRecord = () => {
    setIsRecording(true);
    playChime('beep');
    triggerHaptic(60);
  };

  const handleStopRecord = () => {
    setIsRecording(false);
    playChime('success');
    triggerHaptic(80);

    const seconds = recordSeconds || 12;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const durationStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const newNote: VoiceNote = {
      id: `vn-${Date.now()}`,
      title: `Doctor Instruction Note #${voiceNotes.length + 1}`,
      duration: durationStr,
      timestamp: 'Recorded just now',
    };

    const updatedNotes = [newNote, ...voiceNotes];
    setVoiceNotes(updatedNotes);
    onUpdateAppointment({ ...appointment, prepQuestions: questions, voiceNotes: updatedNotes });
  };

  const handleTogglePlayNote = (id: string) => {
    if (activePlayingId === id) {
      setActivePlayingId(null);
    } else {
      setActivePlayingId(id);
      playChime('subtle');
      setTimeout(() => {
        setActivePlayingId(null);
      }, 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">Doctor Visit Prep Pocket</h2>
              <p className="text-[11px] text-slate-400">Questions & voice instructions</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-5">
          {/* Appointment Banner */}
          <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                  {appointment.specialty}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {appointment.doctorName}
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-lg">
                {appointment.time}
              </span>
            </div>
          </div>

          {/* Section 1: Questions to Ask */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Questions for the Doctor ({questions.filter((q) => q.completed).length}/
                {questions.length})
              </h4>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                Tap to check off
              </span>
            </div>

            {/* Questions Checklist */}
            <div className="space-y-2">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-colors ${
                    q.completed
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleQuestion(q.id)}
                    className="mt-0.5 text-blue-600 dark:text-blue-400 shrink-0"
                  >
                    {q.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <span
                    onClick={() => toggleQuestion(q.id)}
                    className={`flex-1 text-xs cursor-pointer select-none leading-relaxed ${
                      q.completed ? 'line-through text-slate-400' : 'font-medium'
                    }`}
                  >
                    {q.text}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="text-slate-300 hover:text-red-500 p-0.5 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Question Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddQuestion(newQuestionText);
                }}
                placeholder="Type a question for your doctor..."
                className="flex-1 h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => handleAddQuestion(newQuestionText)}
                className="h-10 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Quick Suggested Questions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUESTION_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleAddQuestion(suggestion)}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-600 dark:text-slate-300 hover:text-teal-700 rounded-lg text-[10px] font-medium transition-colors"
                  >
                    +{suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Voice Notes & Doctor Audio Instructions */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Recorded Doctor Instructions</span>
              </h4>
              <span className="text-[11px] text-slate-400">{voiceNotes.length} memo(s)</span>
            </div>

            {/* Voice Recorder Control */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-blue-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-teal-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {isRecording ? 'Recording in progress...' : 'Record Visit Audio'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isRecording
                    ? `Time: 00:${recordSeconds < 10 ? '0' : ''}${recordSeconds}`
                    : 'Record your doctor’s spoken advice'}
                </p>
              </div>

              {isRecording ? (
                <button
                  type="button"
                  onClick={handleStopRecord}
                  className="h-10 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 animate-pulse shadow-md"
                >
                  <StopSquare className="w-4 h-4 fill-white" />
                  <span>Stop & Save</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartRecord}
                  className="h-10 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Mic className="w-4 h-4" />
                  <span>Record</span>
                </button>
              )}
            </div>

            {/* Saved Voice Notes List */}
            <div className="space-y-2">
              {voiceNotes.map((vn) => {
                const isPlaying = activePlayingId === vn.id;
                return (
                  <div
                    key={vn.id}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <button
                        type="button"
                        onClick={() => handleTogglePlayNote(vn.id)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isPlaying
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 fill-white" />
                        ) : (
                          <Play className="w-4 h-4 fill-slate-700 dark:fill-slate-200 ml-0.5" />
                        )}
                      </button>

                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {vn.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {vn.timestamp} • {vn.duration}
                        </p>
                      </div>
                    </div>

                    {isPlaying && (
                      <div className="flex items-center gap-0.5 px-2 text-teal-600">
                        <span className="w-1 h-3 bg-teal-500 rounded-full animate-pulse" />
                        <span className="w-1 h-4 bg-teal-500 rounded-full animate-pulse delay-75" />
                        <span className="w-1 h-2 bg-teal-500 rounded-full animate-pulse delay-150" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Done */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center transition-colors"
          >
            Done & Save Prep Notes
          </button>
        </div>
      </div>
    </div>
  );
};
