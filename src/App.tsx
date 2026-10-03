import React, { useState, useEffect } from 'react';
import {
  AccessibilitySettings,
  Appointment,
  Caregiver,
  CaregiverPermissions,
  Doctor,
  MainTab,
  Medicine,
  MedicineHistoryItem,
  ScreenId,
  UserRole,
  WellnessCheckin,
  PrescriptionScanResult,
} from './types';
import {
  INITIAL_ACCESSIBILITY,
  INITIAL_APPOINTMENTS,
  INITIAL_CAREGIVERS,
  INITIAL_HISTORY,
  INITIAL_MEDICINES,
  INITIAL_WELLNESS,
  DOCTORS_LIST,
} from './data/mockData';
import {
  syncMedicineToCloud,
  deleteMedicineFromCloud,
  syncAppointmentToCloud,
  deleteAppointmentFromCloud,
  syncHistoryToCloud,
  syncCaregiverToCloud,
  syncWellnessToCloud,
  fetchUserMedicines,
  fetchUserAppointments,
  fetchUserHistory,
  fetchUserCaregivers,
  fetchUserWellness,
  validateFirestoreConnection,
} from './firebase';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MobileFrame } from './components/MobileFrame';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { VerifyEmailScreen } from './components/screens/VerifyEmailScreen';
import { VerifyPhoneScreen } from './components/screens/VerifyPhoneScreen';
import { ForgotPasswordScreen } from './components/screens/ForgotPasswordScreen';
import { RoleSelectionScreen } from './components/screens/RoleSelectionScreen';
import { AccessibilitySetupScreen } from './components/screens/AccessibilitySetupScreen';
import { PrivacyConsentScreen } from './components/screens/PrivacyConsentScreen';
import { TodayScreen } from './components/screens/TodayScreen';
import { AppointmentsScreen } from './components/screens/AppointmentsScreen';
import { DoctorSearchScreen } from './components/screens/DoctorSearchScreen';
import { DoctorProfileScreen } from './components/screens/DoctorProfileScreen';
import { AvailableSlotsScreen } from './components/screens/AvailableSlotsScreen';
import { BookingReviewScreen } from './components/screens/BookingReviewScreen';
import { BookingConfirmedScreen } from './components/screens/BookingConfirmedScreen';
import { MedicineListScreen } from './components/screens/MedicineListScreen';
import { AddMedicineScreen } from './components/screens/AddMedicineScreen';
import { MedicineReminderModal } from './components/screens/MedicineReminderModal';
import { MedicineHistoryScreen } from './components/screens/MedicineHistoryScreen';
import { CareCircleScreen } from './components/screens/CareCircleScreen';
import { InviteCaregiverScreen } from './components/screens/InviteCaregiverScreen';
import { CaregiverPermissionsScreen } from './components/screens/CaregiverPermissionsScreen';
import { CaregiverDashboardScreen } from './components/screens/CaregiverDashboardScreen';
import { NotificationSettingsScreen } from './components/screens/NotificationSettingsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { ScanScreen } from './components/screens/ScanScreen';
import { PrescriptionScannerModal } from './components/modals/PrescriptionScannerModal';
import { EmergencySosModal } from './components/modals/EmergencySosModal';
import { RefillOrderModal } from './components/modals/RefillOrderModal';
import { DoctorVisitPrepModal } from './components/appointments/DoctorVisitPrepModal';
import { ApkExportModal } from './components/modals/ApkExportModal';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { playChime, triggerHaptic, playLoudReminderSound } from './utils/audioHaptics';

function CareRouteApp() {
  const { user, userProfile, loading, isEmailVerified, logout } = useAuth();

  // Navigation & Role State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    const session = typeof window !== 'undefined' ? localStorage.getItem('careroute_user_session') : null;
    return session ? 'today' : 'welcome';
  });
  const [currentTab, setCurrentTab] = useState<MainTab>('today');
  const [userRole, setUserRole] = useState<UserRole>('patient');

  // App Data State (Available immediately with local fallback and cloud sync)
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(INITIAL_ACCESSIBILITY);
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [history, setHistory] = useState<MedicineHistoryItem[]>(INITIAL_HISTORY);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [caregivers, setCaregivers] = useState<Caregiver[]>(INITIAL_CAREGIVERS);
  const [wellnessCheckin, setWellnessCheckin] = useState<WellnessCheckin | undefined>(INITIAL_WELLNESS);

  // Booking Flow State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(DOCTORS_LIST[0]);
  const [pendingDate, setPendingDate] = useState<string>('Thursday, 18 Sep');
  const [pendingTime, setPendingTime] = useState<string>('10:30 AM');
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment>(INITIAL_APPOINTMENTS[0]);

  // Active Reminder Modal State
  const [activeReminderMed, setActiveReminderMed] = useState<Medicine | null>(null);

  // Modals State
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [emergencySos, setEmergencySos] = useState<{
    isOpen: boolean;
    type: 'manual_sos' | 'fall_detected';
  }>({ isOpen: false, type: 'manual_sos' });
  const [activeRefillMed, setActiveRefillMed] = useState<Medicine | null>(null);
  const [activePrepAppt, setActivePrepAppt] = useState<Appointment | null>(null);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);

  // Toast & Notification Banner Simulation
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notificationBanner, setNotificationBanner] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onClick?: () => void;
  } | null>(null);

  // Edge case simulation flags
  const [isOffline, setIsOffline] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(true);

  // Connection test on boot
  useEffect(() => {
    validateFirestoreConnection().then((connected) => {
      setFirebaseConnected(connected);
      if (!connected) setIsOffline(true);
    });
  }, []);

  // Firestore Cloud Synchronization (Active when authenticated; runs seamlessly in background)
  useEffect(() => {
    let isMounted = true;

    if (!user?.uid) {
      return;
    }

    const loadUserData = async () => {
      try {
        const [cloudMeds, cloudAppts, cloudHistory, cloudCgs, cloudWell] = await Promise.all([
          fetchUserMedicines(user.uid),
          fetchUserAppointments(user.uid),
          fetchUserHistory(user.uid),
          fetchUserCaregivers(user.uid),
          fetchUserWellness(user.uid),
        ]);

        if (!isMounted) return;

        if (cloudMeds.length > 0) {
          setMedicines(cloudMeds);
        } else {
          // Initialize default medicines scoped to user's UID in Firestore
          INITIAL_MEDICINES.forEach((m) => syncMedicineToCloud(user.uid, m));
        }

        if (cloudAppts.length > 0) {
          setAppointments(cloudAppts);
        } else {
          INITIAL_APPOINTMENTS.forEach((a) => syncAppointmentToCloud(user.uid, a));
        }

        if (cloudHistory.length > 0) {
          setHistory(cloudHistory);
        }

        if (cloudCgs.length > 0) {
          setCaregivers(cloudCgs);
        }

        if (cloudWell) {
          setWellnessCheckin(cloudWell);
        }

        setFirebaseConnected(true);
      } catch (error) {
        console.warn('Failed to load user-scoped data:', error);
      }
    };

    loadUserData();
    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Switch Tabs
  const handleNavigateTab = (tab: MainTab) => {
    setCurrentTab(tab);
    if (tab === 'today') setCurrentScreen('today');
    else if (tab === 'medicines') setCurrentScreen('medicines');
    else if (tab === 'scan') setCurrentScreen('scan');
    else if (tab === 'appointments') {
      setCurrentScreen(appointments.length === 0 ? 'empty_appointments' : 'appointments');
    } else if (tab === 'circle') setCurrentScreen('care_circle');
    else if (tab === 'profile') setCurrentScreen('profile');
  };

  // Jump to specific screen
  const handleJumpToScreen = (screen: ScreenId) => {
    setCurrentScreen(screen);
    if (['today', 'reminder_active'].includes(screen)) {
      setCurrentTab('today');
    } else if (['medicines', 'add_medicine', 'medicine_history'].includes(screen)) {
      setCurrentTab('medicines');
    } else if (screen === 'scan') {
      setCurrentTab('scan');
    } else if (
      [
        'appointments',
        'empty_appointments',
        'doctor_search',
        'doctor_profile',
        'available_slots',
        'booking_review',
        'booking_confirmed',
      ].includes(screen)
    ) {
      setCurrentTab('appointments');
    } else if (
      ['care_circle', 'invite_caregiver', 'permissions_settings', 'caregiver_dashboard'].includes(screen)
    ) {
      setCurrentTab('profile');
    } else if (['profile', 'notification_settings', 'access_setup', 'role', 'privacy_consent'].includes(screen)) {
      setCurrentTab('profile');
    }
  };

  // Medicine Actions
  const handleMarkMedicine = (id: string, status: 'taken' | 'snoozed' | 'skipped') => {
    const med = medicines.find((m) => m.id === id);
    if (!med) return;

    if (med.status === 'taken' && status === 'taken') {
      showToast('Already marked taken! Duplicate tap ignored safely.');
      playChime('alert');
      return;
    }

    let updatedRemaining = med.remainingCount;
    if (status === 'taken' && med.remainingCount !== undefined) {
      updatedRemaining = Math.max(0, med.remainingCount - 1);
    }

    const updatedMedicineList = medicines.map((m) =>
      m.id === id
        ? {
            ...m,
            status,
            remainingCount: updatedRemaining,
          }
        : m
    );
    setMedicines(updatedMedicineList);

    const updatedTarget = updatedMedicineList.find((m) => m.id === id);
    if (updatedTarget && user?.uid) {
      syncMedicineToCloud(user.uid, updatedTarget);
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const historyItem: MedicineHistoryItem = {
      id: `hist-${Date.now()}`,
      medicineName: med.name,
      dose: med.dose,
      scheduledTime: med.time,
      status,
      timestamp: `${nowStr} (${status.charAt(0).toUpperCase() + status.slice(1)})`,
      dateLabel: 'Today',
    };
    setHistory((prev) => [historyItem, ...prev]);
    if (user?.uid) {
      syncHistoryToCloud(user.uid, historyItem);
    }

    if (status === 'taken') {
      if (updatedRemaining !== undefined && updatedRemaining <= (med.refillThreshold ?? 7)) {
        showToast(`${med.name} logged as taken! Only ${updatedRemaining} pills left in supply.`);
      } else {
        showToast(`${med.name} logged as taken! Great work.`);
      }
    } else if (status === 'snoozed') {
      showToast('Reminder snoozed for 15 minutes.');
    } else {
      showToast(`${med.name} skipped for this scheduled period.`);
    }

    if (activeReminderMed) setActiveReminderMed(null);
  };

  // Delete Tablet / Medicine Handler
  const handleDeleteMedicine = (id: string) => {
    const target = medicines.find((m) => m.id === id);
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    if (user?.uid) {
      deleteMedicineFromCloud(user.uid, id);
    }
    showToast(`${target?.name || 'Tablet'} deleted successfully.`);
    playChime('click');
    if (activeReminderMed?.id === id) {
      setActiveReminderMed(null);
    }
  };

  // Prescription Scan Result Handler
  const handleApplyPrescriptionScan = (scan: PrescriptionScanResult) => {
    const newMed: Medicine = {
      id: `med-${Date.now()}`,
      name: scan.medicineName,
      dose: scan.dose,
      instructions: scan.instructions,
      time: scan.time,
      period: scan.period,
      status: 'pending',
      pillColor: '#0d9488',
      shape: 'round',
      remainingCount: scan.totalQuantity,
      totalQuantity: scan.totalQuantity,
      refillThreshold: 7,
      rxNumber: scan.rxNumber,
      pharmacyName: scan.pharmacyName,
    };
    setMedicines((prev) => [...prev, newMed]);
    if (user?.uid) {
      syncMedicineToCloud(user.uid, newMed);
    }
    showToast(`Prescription OCR added: ${newMed.name} (${newMed.dose})!`);
    setCurrentScreen('medicines');
    setCurrentTab('medicines');
  };

  // Refill Fulfillment Handler
  const handleConfirmRefill = (medicineId: string, quantityToAdd: number, deliveryMethod: string) => {
    const med = medicines.find((m) => m.id === medicineId);
    if (!med) return;

    const updatedMed = {
      ...med,
      remainingCount: (med.remainingCount ?? 0) + quantityToAdd,
    };

    setMedicines((prev) => prev.map((m) => (m.id === medicineId ? updatedMed : m)));
    if (user?.uid) {
      syncMedicineToCloud(user.uid, updatedMed);
    }

    const deliveryText =
      deliveryMethod === 'home'
        ? 'Home delivery placed (2 business days)'
        : deliveryMethod === 'caregiver'
        ? 'Caregiver notified for pickup'
        : 'Ready for pharmacy drive-thru pickup today';

    showToast(`Refill requested (+${quantityToAdd} pills)! ${deliveryText}.`);
  };

  // Doctor Visit Prep Notes Handler
  const handleUpdateAppointment = (updatedAppt: Appointment) => {
    setAppointments((prev) => prev.map((a) => (a.id === updatedAppt.id ? updatedAppt : a)));
    if (user?.uid) {
      syncAppointmentToCloud(user.uid, updatedAppt);
    }
    showToast('Doctor visit prep questions updated!');
  };

  // Wellness Check-In Handler
  const handleSaveWellnessCheckin = (checkin: WellnessCheckin) => {
    setWellnessCheckin(checkin);
    if (user?.uid) {
      syncWellnessToCloud(user.uid, checkin);
    }
    showToast(`Morning check-in saved (${checkin.mood})!`);
  };

  // Add Medicine
  const handleSaveMedicine = (newMed: Omit<Medicine, 'id'>) => {
    const created: Medicine = {
      ...newMed,
      id: `med-${Date.now()}`,
    };
    setMedicines((prev) => [...prev, created]);
    if (user?.uid) {
      syncMedicineToCloud(user.uid, created);
    }
    showToast(`${created.name} added to ${created.period} schedule!`);
    setCurrentScreen('medicines');
    setCurrentTab('medicines');
  };

  // Appointment Booking Flow
  const handleStartBooking = () => {
    setCurrentScreen('doctor_search');
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setCurrentScreen('doctor_profile');
  };

  const handleProceedToSlots = () => {
    setCurrentScreen('available_slots');
  };

  const handleSelectSlot = (date: string, time: string) => {
    setPendingDate(date);
    setPendingTime(time);
    setCurrentScreen('booking_review');
  };

  const handleConfirmBooking = (reason: string, notifyCaregiver: boolean) => {
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      clinic: selectedDoctor.clinic,
      date: pendingDate,
      time: pendingTime,
      reason,
      status: 'confirmed',
      caregiverNotified: notifyCaregiver,
    };

    setAppointments((prev) => [newAppt, ...prev]);
    setConfirmedAppt(newAppt);
    if (user?.uid) {
      syncAppointmentToCloud(user.uid, newAppt);
    }
    setCurrentScreen('booking_confirmed');
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    if (user?.uid) {
      deleteAppointmentFromCloud(user.uid, id);
    }
    showToast('Appointment successfully cancelled.');
  };

  // Care Circle Actions
  const handleSimulateCaregiverJoin = () => {
    const newCg: Caregiver = {
      id: 'cg-1',
      name: 'Priya Sharma',
      relation: 'Daughter',
      phone: '+1 (555) 234-8901',
      email: 'priya.sharma@example.com',
      avatarInitial: 'P',
      status: 'active',
      joinedDate: 'Joined just now',
      permissions: {
        seeAppointments: true,
        receiveMissedAlerts: true,
        seeMedicineReminders: true,
        seeFullMedicineNames: false,
        emergencyContactAccess: true,
      },
    };
    setCaregivers([newCg]);
    if (user?.uid) {
      syncCaregiverToCloud(user.uid, newCg);
    }
    showToast('Priya Sharma accepted invite and joined your Care Circle!');
    setCurrentScreen('care_circle');
    setCurrentTab('profile');
  };

  const handleUpdateCaregiverPermissions = (newPerms: Partial<CaregiverPermissions>) => {
    setCaregivers((prev) =>
      prev.map((c) =>
        c.id === 'cg-1'
          ? { ...c, permissions: { ...c.permissions, ...newPerms } }
          : c
      )
    );
    const updatedCg = caregivers.find((c) => c.id === 'cg-1');
    if (updatedCg && user?.uid) {
      syncCaregiverToCloud(user.uid, {
        ...updatedCg,
        permissions: { ...updatedCg.permissions, ...newPerms },
      });
    }
    showToast('Caregiver permissions updated.');
  };

  const handleRemoveCaregiver = () => {
    setCaregivers((prev) =>
      prev.map((c) => (c.id === 'cg-1' ? { ...c, status: 'removed' } : c))
    );
    showToast("Priya Sharma's caregiver access has been revoked.");
    setCurrentScreen('care_circle');
  };

  // Accessibility update
  const handleUpdateAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...newSettings }));
  };

  // Test Notification Trigger
  const handleTestNotification = () => {
    const med = medicines[0] || INITIAL_MEDICINES[0];
    const isNameHidden = accessibility.hideLockScreenNames;
    const title = isNameHidden ? 'Time for your medicine' : `Time for ${med.name}`;
    const message = isNameHidden
      ? 'A scheduled prescription dose is due now.'
      : `${med.dose} • Tap to record taken or snooze`;

    if (accessibility.loudReminderSound !== false) {
      playLoudReminderSound({ repeatCount: 3, volumeBoost: 0.9 });
    } else {
      playChime('alert');
    }
    triggerHaptic([350, 150, 350, 150, 500]);

    setNotificationBanner({
      visible: true,
      title,
      message,
      onClick: () => {
        setNotificationBanner(null);
        setActiveReminderMed(med);
      },
    });

    setTimeout(() => {
      setNotificationBanner((prev) => (prev?.title === title ? null : prev));
    }, 7000);
  };

  // Sign out / reset session
  const handleSignOut = async () => {
    try {
      await logout();
      setCurrentScreen('welcome');
      setCurrentTab('today');
      showToast('Logged out securely.');
    } catch (err) {
      console.warn('Sign out error:', err);
    }
  };

  // Render current screen inside Mobile Frame
  const renderScreenContent = () => {
    switch (currentScreen) {
      // Authentication Screens
      case 'welcome':
        return (
          <WelcomeScreen
            onGetStarted={() => setCurrentScreen('register')}
            onExistingUser={() => setCurrentScreen('login')}
          />
        );

      case 'login':
        return (
          <LoginScreen
            onNavigateRegister={() => setCurrentScreen('register')}
            onNavigateForgotPassword={() => setCurrentScreen('forgot_password')}
            onLoginSuccess={() => {
              setCurrentScreen('today');
              setCurrentTab('today');
              showToast('Logged in successfully.');
            }}
          />
        );

      case 'register':
        return (
          <RegisterScreen
            onNavigateLogin={() => setCurrentScreen('login')}
            onRegisterSuccess={() => {
              showToast('Account created! Please verify your email.');
              setCurrentScreen('verify_email');
            }}
          />
        );

      case 'verify_email':
        return (
          <VerifyEmailScreen
            onVerifiedContinue={() => {
              showToast('Email verified! Now verify your phone number.');
              setCurrentScreen('verify_phone');
            }}
            onNavigateLogin={() => setCurrentScreen('login')}
          />
        );

      case 'verify_phone':
        return (
          <VerifyPhoneScreen
            onVerifiedContinue={() => {
              setCurrentScreen('today');
              setCurrentTab('today');
              showToast('Account fully verified! Welcome to CareRoute.');
            }}
            onNavigateLogin={() => setCurrentScreen('login')}
          />
        );

      case 'forgot_password':
        return (
          <ForgotPasswordScreen
            onBackToLogin={() => setCurrentScreen('login')}
            onResetSuccess={() => {
              showToast('Password updated successfully. Please log in.');
              setCurrentScreen('login');
            }}
          />
        );

      case 'role':
        return (
          <RoleSelectionScreen
            selectedRole={userRole}
            onSelectRole={(role) => setUserRole(role)}
            onContinue={() => {
              if (userRole === 'caregiver') {
                setCurrentScreen('caregiver_dashboard');
              } else {
                setCurrentScreen('access_setup');
              }
            }}
          />
        );

      case 'access_setup':
        return (
          <AccessibilitySetupScreen
            settings={accessibility}
            onUpdateSettings={handleUpdateAccessibility}
            onContinue={() => setCurrentScreen('privacy_consent')}
          />
        );

      case 'privacy_consent':
        return (
          <PrivacyConsentScreen
            onAgreeAndContinue={() => {
              showToast('Welcome to CareRoute!');
              setCurrentScreen('today');
              setCurrentTab('today');
            }}
          />
        );

      case 'today':
        return (
          <TodayScreen
            medicines={medicines}
            nextAppointment={appointments[0]}
            caregivers={caregivers}
            wellnessCheckin={wellnessCheckin}
            onSaveWellnessCheckin={handleSaveWellnessCheckin}
            onTriggerEmergencySos={(type) =>
              setEmergencySos({ isOpen: true, type: type || 'manual_sos' })
            }
            onOpenRefillModal={(med) => setActiveRefillMed(med)}
            onOpenPrepModal={(appt) => setActivePrepAppt(appt)}
            onMarkMedicine={handleMarkMedicine}
            onOpenReminderModal={(med) => setActiveReminderMed(med)}
            onNavigateAppointments={() => {
              setCurrentTab('appointments');
              setCurrentScreen(appointments.length === 0 ? 'empty_appointments' : 'appointments');
            }}
            onNavigateCareCircle={() => {
              setCurrentTab('profile');
              setCurrentScreen('care_circle');
            }}
            onNavigateMedicines={() => {
              setCurrentTab('medicines');
              setCurrentScreen('medicines');
            }}
            onScanPrescription={() => setIsScannerOpen(true)}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            onDeleteMedicine={handleDeleteMedicine}
          />
        );

      case 'empty_appointments':
      case 'appointments':
        return (
          <AppointmentsScreen
            appointments={currentScreen === 'empty_appointments' ? [] : appointments}
            onStartBooking={handleStartBooking}
            onCancelAppointment={handleCancelAppointment}
            onRescheduleAppointment={(appt) => {
              setSelectedDoctor(DOCTORS_LIST.find((d) => d.id === appt.doctorId) || DOCTORS_LIST[0]);
              setCurrentScreen('available_slots');
            }}
            onOpenPrepModal={(appt) => setActivePrepAppt(appt)}
          />
        );

      case 'doctor_search':
        return (
          <DoctorSearchScreen
            onSelectDoctor={handleSelectDoctor}
            onBack={() => {
              setCurrentTab('appointments');
              setCurrentScreen('appointments');
            }}
          />
        );

      case 'doctor_profile':
        return (
          <DoctorProfileScreen
            doctor={selectedDoctor}
            onProceedToSlots={handleProceedToSlots}
            onBack={() => setCurrentScreen('doctor_search')}
          />
        );

      case 'available_slots':
        return (
          <AvailableSlotsScreen
            doctor={selectedDoctor}
            onSelectSlot={handleSelectSlot}
            onBack={() => setCurrentScreen('doctor_profile')}
          />
        );

      case 'booking_review':
        return (
          <BookingReviewScreen
            doctor={selectedDoctor}
            date={pendingDate}
            time={pendingTime}
            onConfirm={handleConfirmBooking}
            onBack={() => setCurrentScreen('available_slots')}
          />
        );

      case 'booking_confirmed':
        return (
          <BookingConfirmedScreen
            appointment={confirmedAppt}
            onDone={() => {
              setCurrentTab('appointments');
              setCurrentScreen('appointments');
            }}
            onShowToast={showToast}
          />
        );

      case 'medicines':
        return (
          <MedicineListScreen
            medicines={medicines}
            onAddMedicine={() => setCurrentScreen('add_medicine')}
            onOpenReminder={(med) => setActiveReminderMed(med)}
            onViewHistory={() => setCurrentScreen('medicine_history')}
            onOpenScanner={() => setCurrentScreen('scan')}
            onOpenRefill={(med) => setActiveRefillMed(med)}
            onMarkMedicine={handleMarkMedicine}
            onDeleteMedicine={handleDeleteMedicine}
          />
        );

      case 'scan':
        return (
          <ScanScreen
            onApplyPrescription={handleApplyPrescriptionScan}
            onNavigateHome={() => handleNavigateTab('today')}
          />
        );

      case 'add_medicine':
        return (
          <AddMedicineScreen
            onSave={handleSaveMedicine}
            onCancel={() => setCurrentScreen('medicines')}
          />
        );

      case 'reminder_active':
        return (
          <MedicineReminderModal
            medicine={medicines[0] || INITIAL_MEDICINES[0]}
            onMark={(status) => handleMarkMedicine(medicines[0]?.id || 'med-1', status)}
            onDismiss={() => setCurrentScreen('today')}
            onDelete={handleDeleteMedicine}
          />
        );

      case 'medicine_history':
        return (
          <MedicineHistoryScreen
            history={history}
            onBack={() => setCurrentScreen('medicines')}
          />
        );

      case 'care_circle':
        return (
          <CareCircleScreen
            caregivers={caregivers}
            onInvite={() => setCurrentScreen('invite_caregiver')}
            onSelectCaregiver={() => setCurrentScreen('permissions_settings')}
            onPreviewCaregiverDashboard={() => setCurrentScreen('caregiver_dashboard')}
          />
        );

      case 'invite_caregiver':
        return (
          <InviteCaregiverScreen
            onBack={() => setCurrentScreen('care_circle')}
            onSimulateJoin={handleSimulateCaregiverJoin}
          />
        );

      case 'permissions_settings':
        return (
          <CaregiverPermissionsScreen
            caregiver={caregivers[0]}
            onUpdatePermissions={handleUpdateCaregiverPermissions}
            onRemoveCaregiver={handleRemoveCaregiver}
            onPreviewCaregiverDashboard={() => setCurrentScreen('caregiver_dashboard')}
            onBack={() => setCurrentScreen('care_circle')}
          />
        );

      case 'caregiver_dashboard':
        return (
          <CaregiverDashboardScreen
            caregiver={caregivers[0]}
            nextAppointment={appointments[0]}
            medicines={medicines}
            wellnessCheckin={wellnessCheckin}
            onPickUpRefill={(med) => setActiveRefillMed(med)}
            onExitCaregiverView={() => {
              setCurrentScreen('care_circle');
              setUserRole('patient');
            }}
            onShowToast={showToast}
          />
        );

      case 'notification_settings':
        return (
          <NotificationSettingsScreen
            settings={accessibility}
            onUpdateSettings={handleUpdateAccessibility}
            onBack={() => setCurrentScreen('profile')}
            onTestNotification={handleTestNotification}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            settings={accessibility}
            onNavigateAccessibility={() => setCurrentScreen('access_setup')}
            onNavigateNotifications={() => setCurrentScreen('notification_settings')}
            onNavigateCareCircle={() => {
              setCurrentTab('profile');
              setCurrentScreen('care_circle');
            }}
            onSignOut={handleSignOut}
            onShowToast={showToast}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            onTestAlarm={handleTestNotification}
            onVerifyEmail={() => setCurrentScreen('verify_email')}
            onVerifyPhone={() => setCurrentScreen('verify_phone')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#ECEEF1] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans overflow-hidden select-none">
      {/* Offline Alert Bar if offline */}
      {isOffline && (
        <div className="bg-amber-950/95 border-b border-amber-800 text-amber-200 px-4 py-1.5 text-xs flex items-center justify-center gap-2 shrink-0 z-50">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Offline Mode:</strong> CareRoute is operating offline-first with cached data.
          </span>
        </div>
      )}

      {/* Main Responsive Frame */}
      <main className="flex-1 w-full h-full flex flex-col items-center justify-start overflow-hidden min-h-0">
        <MobileFrame
          currentScreen={currentScreen}
          currentTab={currentTab}
          accessibility={accessibility}
          onNavigateTab={handleNavigateTab}
          onJumpToScreen={handleJumpToScreen}
          notificationBanner={notificationBanner}
          onDismissNotification={() => setNotificationBanner(null)}
          hideTopControlBar={true}
        >
          {renderScreenContent()}
        </MobileFrame>
      </main>

      {/* Floating Active Medicine Reminder Modal */}
      {activeReminderMed && (
        <MedicineReminderModal
          medicine={activeReminderMed}
          onMark={(status) => handleMarkMedicine(activeReminderMed.id, status)}
          onDismiss={() => setActiveReminderMed(null)}
          onDelete={handleDeleteMedicine}
        />
      )}

      {/* Prescription Camera OCR Scanner Modal */}
      <PrescriptionScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onApplyPrescription={handleApplyPrescriptionScan}
      />

      {/* Emergency SOS & Fall Alert */}
      <EmergencySosModal
        isOpen={emergencySos.isOpen}
        onClose={() => setEmergencySos((prev) => ({ ...prev, isOpen: false }))}
        caregiver={caregivers.find((c) => c.status === 'active')}
        medicines={medicines}
        initialType={emergencySos.type}
        onAlertDispatched={() => {
          showToast('SOS dispatched! Live GPS & Medical ID sent to caregiver.');
        }}
      />

      {/* Pill Supply & Refill Modal */}
      <RefillOrderModal
        isOpen={!!activeRefillMed}
        onClose={() => setActiveRefillMed(null)}
        medicine={activeRefillMed}
        onConfirmRefill={handleConfirmRefill}
      />

      {/* Doctor Visit Prep Pocket Modal */}
      <DoctorVisitPrepModal
        isOpen={!!activePrepAppt}
        onClose={() => setActivePrepAppt(null)}
        appointment={activePrepAppt}
        onUpdateAppointment={handleUpdateAppointment}
      />

      {/* APK & PWA Export Guide Modal */}
      <ApkExportModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        sharedUrl="https://ais-pre-gfux2mlyxqwlm3366l3r25-633381026259.asia-southeast1.run.app"
      />

      {/* Feedback Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white border border-slate-700 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn max-w-sm text-center">
          <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CareRouteApp />
    </AuthProvider>
  );
}
