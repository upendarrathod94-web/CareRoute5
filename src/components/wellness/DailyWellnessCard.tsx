import React, { useState } from 'react';
import { MoodType, WellnessCheckin } from '../../types';
import { Heart, Sparkles, Check, Edit3, MessageCircle, Smile, Frown, Coffee } from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  currentCheckin?: WellnessCheckin;
  onSaveCheckin: (checkin: WellnessCheckin) => void;
  caregiverName?: string;
}

const MOODS: { type: MoodType; label: string; emoji: string; sub: string; color: string }[] = [
  {
    type: 'great',
    label: 'Great',
    emoji: '😊',
    sub: 'Full of energy',
    color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100',
  },
  {
    type: 'okay',
    label: 'Doing Okay',
    emoji: '🌤️',
    sub: 'Steady day',
    color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100',
  },
  {
    type: 'tired',
    label: 'A Bit Tired',
    emoji: '🥱',
    sub: 'Taking it slow',
    color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100',
  },
  {
    type: 'unwell',
    label: 'In Pain',
    emoji: '⚠️',
    sub: 'Need extra care',
    color: 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-950 dark:text-red-100',
  },
];

const QUICK_TAGS = ['Slept well', 'Walked in garden', 'Mild knee ache', 'Good appetite', 'Resting today'];

export const DailyWellnessCard: React.FC<Props> = ({
  currentCheckin,
  onSaveCheckin,
  caregiverName = 'Priya',
}) => {
  const [isEditing, setIsEditing] = useState(!currentCheckin);
  const [selectedMood, setSelectedMood] = useState<MoodType>(currentCheckin?.mood || 'great');
  const [note, setNote] = useState(currentCheckin?.note || '');

  const handleSelectMood = (mood: MoodType) => {
    setSelectedMood(mood);
    playChime(mood === 'great' || mood === 'okay' ? 'success' : 'alert');
    triggerHaptic(50);
  };

  const handleConfirm = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const checkin: WellnessCheckin = {
      id: `well-${Date.now()}`,
      date: 'Today',
      mood: selectedMood,
      note: note.trim() || undefined,
      timestamp: timeStr,
    };
    onSaveCheckin(checkin);
    setIsEditing(false);
    playChime('success');
    triggerHaptic(60);
  };

  const activeMoodObj = MOODS.find((m) => m.type === (currentCheckin?.mood || selectedMood));

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-pink-500/20" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Daily Wellness Pulse
            </h3>
          </div>
        </div>

        {currentCheckin && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Update</span>
          </button>
        )}
      </div>

      {!isEditing && currentCheckin ? (
        /* Completed Checkin Banner */
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{activeMoodObj?.emoji}</span>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Feeling {activeMoodObj?.label} today
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Checked in at {currentCheckin.timestamp} • Shared with {caregiverName}
              </p>
              {currentCheckin.note && (
                <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 italic">
                  "{currentCheckin.note}"
                </p>
              )}
            </div>
          </div>

          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </div>
        </div>
      ) : (
        /* Interactive Mood Selector */
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            How are you feeling this morning, Margaret?
          </p>

          <div className="grid grid-cols-2 gap-2">
            {MOODS.map((m) => {
              const isSelected = selectedMood === m.type;
              return (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => handleSelectMood(m.type)}
                  className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all ${
                    isSelected
                      ? m.color + ' shadow-xs scale-[1.01]'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className="text-xl">{m.emoji}</span>
                  <div>
                    <p className="text-xs font-bold leading-tight">{m.label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{m.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Note Tags */}
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setNote((prev) => (prev ? `${prev}, ${tag}` : tag));
                    playChime('click');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-pink-950/40 hover:text-pink-600 transition-colors"
                >
                  +{tag}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add an optional note for Priya..."
              className="w-full h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full h-10 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
            <span>Save Morning Wellness Check-In</span>
          </button>
        </div>
      )}
    </div>
  );
};
