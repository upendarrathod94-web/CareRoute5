import React from 'react';
import { Caregiver } from '../../types';
import { ASSETS_3D } from '../../assets/assetRegistry';
import { Plus, Users, ChevronRight, Eye, UserPlus } from 'lucide-react';

interface Props {
  caregivers: Caregiver[];
  onInvite: () => void;
  onSelectCaregiver: (caregiver: Caregiver) => void;
  onPreviewCaregiverDashboard: () => void;
}

export const CareCircleScreen: React.FC<Props> = ({
  caregivers,
  onInvite,
  onSelectCaregiver,
  onPreviewCaregiverDashboard,
}) => {
  const activeCaregivers = caregivers.filter((c) => c.status === 'active');

  return (
    <div className="flex flex-col h-full p-4 sm:p-5 overflow-y-auto animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Care Circle
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Trusted family support with your permission
          </p>
        </div>

        <button
          type="button"
          onClick={onInvite}
          className="h-10 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* 3D Privacy Shield Overview Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-teal-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/80 border border-teal-100 dark:border-slate-700 mb-5 flex items-center gap-3.5 shadow-xs">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm shrink-0 border-2 border-white dark:border-slate-600">
          <img
            src={ASSETS_3D.privacyShield}
            alt="3D Privacy Shield"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            You are always in control
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
            Family members can only see what you explicitly allow. You can disconnect them with one tap at any time.
          </p>
        </div>
      </div>

      {activeCaregivers.length === 0 ? (
        /* Empty State */
        <div className="my-auto flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            No one in your circle yet
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mb-5 leading-relaxed">
            Invite a family member, child, or trusted spouse to help look out for missed medicines or appointments.
          </p>
          <button
            type="button"
            onClick={onInvite}
            className="w-full max-w-xs h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Generate Invite Code</span>
          </button>
        </div>
      ) : (
        /* Connected Caregivers */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-medium">
            <span>Approved Caregivers ({activeCaregivers.length})</span>
            <span>Tap to adjust permissions</span>
          </div>

          <div className="space-y-2.5">
            {activeCaregivers.map((caregiver) => (
              <button
                key={caregiver.id}
                type="button"
                onClick={() => onSelectCaregiver(caregiver)}
                className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-600 transition-all text-left shadow-xs flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                    {caregiver.avatarInitial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {caregiver.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                        {caregiver.relation}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {caregiver.phone} • {caregiver.joinedDate}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            ))}
          </div>

          {/* Preview Caregiver's View button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onPreviewCaregiverDashboard}
              className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Preview Priya's View (Caregiver Dashboard)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
