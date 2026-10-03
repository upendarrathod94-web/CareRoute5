import React, { useState } from 'react';
import { Doctor } from '../../types';
import { ASSETS_3D } from '../../assets/assetRegistry';
import { ArrowLeft, Clock, Info, Check, ArrowRight } from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  doctor: Doctor;
  onSelectSlot: (date: string, time: string) => void;
  onBack: () => void;
}

export const AvailableSlotsScreen: React.FC<Props> = ({
  doctor,
  onSelectSlot,
  onBack,
}) => {
  const [selectedDay, setSelectedDay] = useState(doctor.availableDays[0] || 'Thursday, 18 Sep');
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
  const [simulateNoSlots, setSimulateNoSlots] = useState(false);

  // Demo slots with realistic booked vs open state
  const bookedSlots = ['11:15 AM', '04:15 PM'];

  const handleSlotClick = (time: string) => {
    playChime('click');
    triggerHaptic(40);
    setSelectedTime(time);
  };

  const handleContinue = () => {
    playChime('success');
    triggerHaptic(50);
    onSelectSlot(selectedDay, selectedTime);
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
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Choose Appointment Time
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {doctor.name} • {doctor.specialty}
            </p>
          </div>
        </div>

        {/* 3D Visual Banner */}
        <div className="flex items-center gap-3 p-3 bg-blue-50/80 dark:bg-slate-800/80 rounded-2xl border border-blue-100 dark:border-slate-700 mb-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xs shrink-0 border border-white dark:border-slate-600">
            <img
              src={ASSETS_3D.doctorCalendar}
              alt="Calendar 3D"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Flexible 30-Minute Consultations
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              All appointments include automatic SMS & phone chimes 24h and 1h prior.
            </p>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Select Date
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {doctor.availableDays.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => {
                  setSelectedDay(day);
                  playChime('subtle');
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Edge Case Simulation Toggle: No Slots Available */}
        <div className="flex items-center justify-between p-2 mb-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-xs">
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Test Edge Case: No open slots on this date?
          </span>
          <button
            type="button"
            onClick={() => setSimulateNoSlots(!simulateNoSlots)}
            className={`px-2 py-0.5 rounded-md font-bold text-[11px] transition-colors ${
              simulateNoSlots
                ? 'bg-amber-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {simulateNoSlots ? 'Simulating Zero Slots' : 'Simulate'}
          </button>
        </div>

        {simulateNoSlots ? (
          /* Edge Case: No Slots Available UI */
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center my-3">
            <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-amber-950 dark:text-amber-100">
              No Slots Available on {selectedDay}
            </h3>
            <p className="text-xs text-amber-850 dark:text-amber-200 mt-1 mb-3">
              All appointments with Dr. {doctor.name.split(' ')[1]} are filled for this date.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setSimulateNoSlots(false);
                  setSelectedDay(doctor.availableDays[1] || 'Friday, 19 Sep');
                }}
                className="py-2.5 px-3 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl"
              >
                Check Next Available Day
              </button>
              <button
                type="button"
                onClick={() => alert('You have been added to Dr. Rao’s cancellation waitlist. We will notify you if a slot opens.')}
                className="py-2 px-3 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-semibold rounded-xl"
              >
                Join Cancellation Waitlist
              </button>
            </div>
          </div>
        ) : (
          /* Normal Slot Grid */
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Available Times ({selectedDay})
              </label>
              <span className="text-[11px] text-slate-400">Click to select</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {doctor.slots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedTime === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => handleSlotClick(slot)}
                    className={`h-13 rounded-xl flex flex-col items-center justify-center p-2 text-xs transition-all border ${
                      isBooked
                        ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-300 font-semibold'
                    }`}
                  >
                    <span className="text-sm font-bold">{slot}</span>
                    <span className="text-[10px] font-medium opacity-90">
                      {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Info className="w-3.5 h-3.5 shrink-0 text-blue-500" />
              <span>Greyed-out times with the "Booked" label have already been reserved.</span>
            </div>
          </div>
        )}
      </div>

      {/* Continue CTA */}
      <div className="pt-4 pb-2">
        <button
          type="button"
          disabled={simulateNoSlots}
          onClick={handleContinue}
          className="w-full h-14 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-40 disabled:pointer-events-none text-white font-bold rounded-2xl shadow-xs flex items-center justify-center gap-2 text-base transition-colors"
        >
          <span>Continue with {selectedTime}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
