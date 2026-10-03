import React, { useState } from 'react';
import { Medicine, PrescriptionScanResult } from '../../types';
import { PrescriptionScannerModal } from '../modals/PrescriptionScannerModal';
import { X, Clock, Bell, Volume2, Vibrate, Check, Camera, Sparkles, Package, Upload } from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  onSave: (newMed: Omit<Medicine, 'id'>) => void;
  onCancel: () => void;
}

const COMMON_DRUGS = [
  'Metformin',
  'Amlodipine',
  'Lisinopril',
  'Atorvastatin',
  'Levothyroxine',
  'Omeprazole',
];

export const AddMedicineScreen: React.FC<Props> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('1 tablet (500mg)');
  const [time, setTime] = useState('20:00');
  const [period, setPeriod] = useState<'Morning' | 'Noon' | 'Evening' | 'Bedtime'>('Evening');
  const [instructions, setInstructions] = useState('Take with dinner and water');
  const [remainingCount, setRemainingCount] = useState<number>(30);
  const [totalQuantity, setTotalQuantity] = useState<number>(30);
  const [rxNumber, setRxNumber] = useState('RX-');
  const [pharmacyName, setPharmacyName] = useState('Walgreens Pharmacy');
  const [reminderType, setReminderType] = useState<'alert' | 'voice' | 'vibrate'>('alert');
  const [error, setError] = useState<string | null>(null);

  // Scanner modal state
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleApplyScan = (scanResult: PrescriptionScanResult) => {
    setName(scanResult.medicineName);
    setDose(scanResult.dose);
    setTime(scanResult.time);
    setPeriod(scanResult.period);
    setInstructions(scanResult.instructions);
    setRemainingCount(scanResult.totalQuantity);
    setTotalQuantity(scanResult.totalQuantity);
    setRxNumber(scanResult.rxNumber);
    setPharmacyName(scanResult.pharmacyName);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter the name of the medicine.');
      playChime('alert');
      return;
    }

    playChime('success');
    triggerHaptic(60);

    onSave({
      name: name.trim(),
      dose: dose.trim() || '1 dose',
      instructions: instructions.trim() || 'Take as prescribed',
      time,
      period,
      status: 'pending',
      pillColor: '#2563EB',
      shape: 'round',
      remainingCount: Number(remainingCount) || 30,
      totalQuantity: Number(totalQuantity) || 30,
      refillThreshold: 7,
      rxNumber: rxNumber || undefined,
      pharmacyName: pharmacyName || undefined,
    });
  };

  return (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 overflow-y-auto animate-fadeIn">
      <div>
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Add a Medicine
            </h1>
          </div>
          <span className="text-xs text-slate-400 font-medium">New Prescription</span>
        </div>

        {/* Feature 1: Scan Bottle OCR or Upload Photo Hero Card */}
        <div className="w-full mb-4 p-3.5 bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white rounded-2xl shadow-md transition-all space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold leading-tight truncate">Capture or Upload Medicine</p>
                <span className="text-[10px] bg-teal-400/30 text-teal-200 border border-teal-300/30 px-1.5 py-0.2 rounded-md font-semibold shrink-0">
                  AI OCR
                </span>
              </div>
              <p className="text-[11px] text-teal-100/90 truncate">
                Snap bottle with camera or upload label image from files
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="py-2 px-3 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Use Camera</span>
            </button>

            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="py-2 px-3 bg-white text-teal-900 hover:bg-teal-50 active:bg-teal-100 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-teal-700" />
              <span>Upload Photo</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Drug Name Input */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Medicine Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Metformin, Lisinopril, Aspirin"
              className="w-full h-12 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {error && (
              <p className="text-[11px] text-red-600 dark:text-red-400 font-medium mt-1">
                {error}
              </p>
            )}

            {/* Quick-select chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_DRUGS.map((drug) => (
                <button
                  key={drug}
                  type="button"
                  onClick={() => setName(drug)}
                  className="px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                >
                  +{drug}
                </button>
              ))}
            </div>
          </div>

          {/* Dose Input */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Dose / Quantity
            </label>
            <input
              type="text"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="e.g. 1 tablet (500mg), 2 drops"
              className="w-full h-12 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Scheduled Time & Period */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Reminder Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-12 pl-9 pr-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Time of Day
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full h-12 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Morning">Morning</option>
                <option value="Noon">Noon</option>
                <option value="Evening">Evening</option>
                <option value="Bedtime">Bedtime</option>
              </select>
            </div>
          </div>

          {/* Supply & Inventory Tracking */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Bottle Pill Count
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={remainingCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setRemainingCount(val);
                  setTotalQuantity(val);
                }}
                className="w-full h-12 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Pharmacy / Rx #
              </label>
              <input
                type="text"
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
                placeholder="Walgreens / CVS"
                className="w-full h-12 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Reminder Delivery Type */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Remind Me With
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setReminderType('alert');
                  playChime('click');
                }}
                className={`py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 border text-[11px] font-semibold transition-all ${
                  reminderType === 'alert'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Sound Chime</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setReminderType('voice');
                  playChime('success');
                }}
                className={`py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 border text-[11px] font-semibold transition-all ${
                  reminderType === 'voice'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>Voice Reader</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setReminderType('vibrate');
                  triggerHaptic(80);
                }}
                className={`py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 border text-[11px] font-semibold transition-all ${
                  reminderType === 'vibrate'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Vibrate className="w-4 h-4" />
                <span>Vibration</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Doctor Instructions
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Take with food and a full glass of water"
              className="w-full h-11 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </form>
      </div>

      {/* Save CTA */}
      <div className="pt-4 pb-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full h-14 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-2xl shadow-xs flex items-center justify-center gap-2 text-base transition-colors"
        >
          <Check className="w-5 h-5" strokeWidth={3} />
          <span>Save Medicine Schedule</span>
        </button>
      </div>

      {/* Embedded Scanner Modal */}
      <PrescriptionScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onApplyPrescription={handleApplyScan}
      />
    </div>
  );
};
