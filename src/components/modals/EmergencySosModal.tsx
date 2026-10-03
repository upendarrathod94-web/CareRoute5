import React, { useState, useEffect } from 'react';
import { Caregiver, Medicine } from '../../types';
import {
  AlertTriangle,
  Phone,
  ShieldAlert,
  X,
  MapPin,
  Heart,
  CheckCircle2,
  Volume2,
  FileHeart,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  caregiver?: Caregiver;
  medicines: Medicine[];
  initialType?: 'manual_sos' | 'fall_detected';
  onAlertDispatched?: () => void;
}

export const EmergencySosModal: React.FC<Props> = ({
  isOpen,
  onClose,
  caregiver,
  medicines,
  initialType = 'manual_sos',
  onAlertDispatched,
}) => {
  const [stage, setStage] = useState<'countdown' | 'dispatched'>('countdown');
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [showMedicalId, setShowMedicalId] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStage('countdown');
      setSecondsLeft(5);
      setShowMedicalId(false);
      return;
    }

    setStage('countdown');
    setSecondsLeft(5);
    playChime('sos-pulse');
    triggerHaptic(100);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStage('dispatched');
          playChime('alert');
          triggerHaptic(120);
          if (onAlertDispatched) onAlertDispatched();
          return 0;
        }
        playChime('sos-pulse');
        triggerHaptic(60);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onAlertDispatched]);

  if (!isOpen) return null;

  const handleCancelGrace = () => {
    playChime('success');
    triggerHaptic(40);
    onClose();
  };

  const handleImmediateDispatch = () => {
    setStage('dispatched');
    playChime('alert');
    triggerHaptic(100);
    if (onAlertDispatched) onAlertDispatched();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-red-500/50 flex flex-col max-h-[92vh]">
        {stage === 'countdown' ? (
          /* Grace Window Countdown Screen */
          <div className="p-6 text-center flex flex-col items-center justify-between min-h-[420px] bg-gradient-to-b from-red-500/10 via-transparent to-transparent">
            {/* Header Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>
                {initialType === 'fall_detected' ? 'Possible Fall Detected' : 'Emergency SOS Triggered'}
              </span>
            </div>

            {/* Pulsing Countdown Circle */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-red-500 animate-ping absolute opacity-25" />
              <div className="w-28 h-28 rounded-full bg-red-600 text-white flex flex-col items-center justify-center shadow-lg shadow-red-600/30">
                <span className="text-4xl font-black">{secondsLeft}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Seconds</span>
              </div>
            </div>

            <div className="space-y-1 max-w-xs">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Grace Period Active
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Contacting 911 and notifying your Care Circle (
                {caregiver ? caregiver.name : 'Priya Sharma'}) in {secondsLeft} seconds.
              </p>
            </div>

            {/* Cancel Button - Extra Large for Easy Tap */}
            <div className="w-full space-y-2.5 pt-4">
              <button
                type="button"
                onClick={handleCancelGrace}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 text-base transition-all"
              >
                <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
                <span>I'M OKAY — CANCEL ALARM</span>
              </button>

              <button
                type="button"
                onClick={handleImmediateDispatch}
                className="w-full py-2.5 text-xs text-red-600 dark:text-red-400 font-bold hover:underline"
              >
                Dispatch Immediately (No Delay) →
              </button>
            </div>
          </div>
        ) : (
          /* Dispatched Active Emergency Screen */
          <div className="p-5 flex flex-col justify-between overflow-y-auto space-y-4">
            <div>
              {/* Top Alert Banner */}
              <div className="p-3.5 bg-red-600 text-white rounded-2xl flex items-center justify-between mb-4 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold">Emergency Alert Dispatched</h2>
                    <p className="text-[11px] text-red-100">Help request sent to Care Circle</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Location Broadcast */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mb-3 text-xs flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Live Location Shared</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Home: 742 Evergreen Terrace, San Francisco, CA
                  </p>
                </div>
              </div>

              {/* Direct Quick-Call Contacts */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Immediate Contacts
                </p>

                {/* Call 911 */}
                <a
                  href="tel:911"
                  onClick={() => playChime('alert')}
                  className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center justify-between text-left hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xs">
                      911
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-red-900 dark:text-red-100">
                        Emergency Services
                      </h3>
                      <p className="text-[11px] text-red-700 dark:text-red-300">
                        Police • Fire • Paramedics
                      </p>
                    </div>
                  </div>
                  <Phone className="w-4 h-4 text-red-600" />
                </a>

                {/* Call Caregiver */}
                <a
                  href={`tel:${caregiver?.phone || '5552348901'}`}
                  onClick={() => playChime('click')}
                  className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between text-left hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {caregiver ? caregiver.avatarInitial : 'P'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-blue-900 dark:text-blue-100">
                        {caregiver ? caregiver.name : 'Priya Sharma'} (
                        {caregiver ? caregiver.relation : 'Daughter'})
                      </h3>
                      <p className="text-[11px] text-blue-700 dark:text-blue-300">
                        Primary Caregiver • Alert SMS Sent
                      </p>
                    </div>
                  </div>
                  <Phone className="w-4 h-4 text-blue-600" />
                </a>
              </div>

              {/* Medical ID Sheet Toggle for Paramedics */}
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMedicalId(!showMedicalId)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-between hover:bg-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <FileHeart className="w-4 h-4 text-teal-600" />
                    <span>Show Medical ID & Prescriptions</span>
                  </div>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                    {showMedicalId ? 'Hide' : 'View'}
                  </span>
                </button>

                {showMedicalId && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 animate-fadeIn">
                    <p>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Patient: </span>
                      Margaret Lewis (Age 72)
                    </p>
                    <p>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Blood Type: </span>
                      O Positive (O+)
                    </p>
                    <p>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Conditions: </span>
                      Hypertension, Type 2 Diabetes
                    </p>
                    <p>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Active Meds: </span>
                      {medicines.map((m) => `${m.name} ${m.dose}`).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Resolve Alert CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  playChime('success');
                  onClose();
                }}
                className="w-full h-12 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-1.5 text-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Safe / Close SOS Screen</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
