import React, { useState } from 'react';
import { Medicine } from '../../types';
import {
  X,
  Pill,
  Calendar,
  Building2,
  Truck,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Package,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
  onConfirmRefill: (medicineId: string, quantityToAdd: number, deliveryMethod: string) => void;
}

export const RefillOrderModal: React.FC<Props> = ({
  isOpen,
  onClose,
  medicine,
  onConfirmRefill,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'pharmacy' | 'home' | 'caregiver'>('home');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !medicine) return null;

  const remaining = medicine.remainingCount ?? 5;
  const isLow = remaining <= (medicine.refillThreshold ?? 7);

  const handleSubmit = () => {
    setIsSubmitting(true);
    playChime('click');
    triggerHaptic(50);

    setTimeout(() => {
      setIsSubmitting(false);
      playChime('success');
      triggerHaptic(80);
      onConfirmRefill(medicine.id, 30, deliveryMethod);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">Prescription Refill Request</h2>
              <p className="text-[11px] text-slate-400">Manage supply & refill orders</p>
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
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Medicine Details & Current Inventory Status */}
          <div
            className={`p-3.5 rounded-2xl border ${
              isLow
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Prescription
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {medicine.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {medicine.dose}
                </p>
              </div>

              <div
                className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                  isLow
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {isLow && <AlertTriangle className="w-3.5 h-3.5" />}
                <span>{remaining} pills left</span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400">Rx Number:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {medicine.rxNumber || 'RX-884102'}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Pharmacy:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {medicine.pharmacyName || 'Walgreens Pharmacy'}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery & Fulfillment Preference */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Choose How to Receive Refill:
            </label>

            <div className="space-y-2">
              {/* Home Delivery */}
              <button
                type="button"
                onClick={() => {
                  setDeliveryMethod('home');
                  playChime('click');
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  deliveryMethod === 'home'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Mail Delivery to Home (Free)</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Delivered in 2 business days to 742 Evergreen
                    </p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    deliveryMethod === 'home'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {deliveryMethod === 'home' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* Caregiver Pickup */}
              <button
                type="button"
                onClick={() => {
                  setDeliveryMethod('caregiver');
                  playChime('click');
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  deliveryMethod === 'caregiver'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Request Priya (Daughter) to Pick Up</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Sends pickup alert to Priya’s Caregiver app
                    </p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    deliveryMethod === 'caregiver'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {deliveryMethod === 'caregiver' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* In-Store Pickup */}
              <button
                type="button"
                onClick={() => {
                  setDeliveryMethod('pharmacy');
                  playChime('click');
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  deliveryMethod === 'pharmacy'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Pick Up Myself at Pharmacy</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Ready today at drive-thru window after 3:00 PM
                    </p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    deliveryMethod === 'pharmacy'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {deliveryMethod === 'pharmacy' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full h-13 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Refill (+30 Pills)...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Order Refill (30-Day Supply)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
