import React from 'react';
import { Doctor } from '../../types';
import { ArrowLeft, Star, MapPin, CheckCircle, Calendar, Shield } from 'lucide-react';

interface Props {
  doctor: Doctor;
  onProceedToSlots: () => void;
  onBack: () => void;
}

export const DoctorProfileScreen: React.FC<Props> = ({
  doctor,
  onProceedToSlots,
  onBack,
}) => {
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
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Doctor Profile
          </span>
        </div>

        {/* Doctor Header Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700 text-center mb-4">
          <div
            className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${doctor.avatarBg} text-white flex items-center justify-center font-bold text-2xl shadow-md border-4 border-white dark:border-slate-700 mb-3`}
          >
            {doctor.name.replace('Dr. ', '').charAt(0)}
          </div>

          <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-white/80 dark:bg-slate-900/60 px-2.5 py-0.5 rounded-full mb-1">
            {doctor.specialty}
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {doctor.name}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {doctor.clinic}
          </p>

          <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-blue-200/50 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{doctor.rating} Rating</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>Board Certified</span>
            </div>
          </div>
        </div>

        {/* Location & Contact Info */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-4 space-y-2 text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Clinic Location</p>
              <p className="text-slate-500 dark:text-slate-400">{doctor.address}</p>
            </div>
          </div>
        </div>

        {/* Doctor Bio */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            About Dr. {doctor.name.split(' ')[1]}
          </h2>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {doctor.bio}
          </p>
        </div>

        {/* Accessibility & Insurance Notes */}
        <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50 flex items-center gap-2.5 text-xs text-teal-800 dark:text-teal-300">
          <Shield className="w-4 h-4 shrink-0 text-teal-600" />
          <span>Wheelchair accessible clinic • Medicare and major insurance accepted</span>
        </div>
      </div>

      <div className="pt-4 pb-2">
        <button
          type="button"
          onClick={onProceedToSlots}
          className="w-full h-14 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-2xl shadow-xs flex items-center justify-center gap-2 text-base transition-colors"
        >
          <Calendar className="w-5 h-5" />
          <span>Choose Available Time Slot</span>
        </button>
      </div>
    </div>
  );
};
