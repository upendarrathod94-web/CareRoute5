import React, { useState } from 'react';
import { Doctor } from '../../types';
import { DOCTORS_LIST } from '../../data/mockData';
import { Search, ChevronRight, Star, MapPin, ArrowLeft } from 'lucide-react';

interface Props {
  onSelectDoctor: (doctor: Doctor) => void;
  onBack: () => void;
}

const SPECIALTY_FILTERS = ['All', 'Cardiology', 'Geriatrics', 'Endocrinology', 'General Care'];

export const DoctorSearchScreen: React.FC<Props> = ({ onSelectDoctor, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredDoctors = DOCTORS_LIST.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clinic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'All' ||
      doc.specialty.toLowerCase().includes(selectedFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full p-4 sm:p-5 overflow-y-auto animate-fadeIn">
      {/* Top Header */}
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
            Find a Doctor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a specialist for your consultation
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by doctor name or specialty..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Specialty Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {SPECIALTY_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setSelectedFilter(filter)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === filter
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Doctor Cards */}
      <div className="space-y-3">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4">
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
              No doctors found matching "{searchQuery}"
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try searching "Cardiology" or "General"
            </p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <button
              key={doctor.id}
              type="button"
              onClick={() => onSelectDoctor(doctor)}
              className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all text-left shadow-xs flex items-start gap-3.5 group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${doctor.avatarBg} text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm`}
              >
                {doctor.name.replace('Dr. ', '').charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    {doctor.specialty}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{doctor.rating}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white truncate mt-0.5">
                  {doctor.name}
                </h3>

                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{doctor.clinic}</span>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                    {doctor.slots.length} demo slots open
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center group-hover:translate-x-0.5 transition-transform">
                    View Times <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
