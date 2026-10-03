export type UserRole = 'patient' | 'caregiver';

export type TextSize = 'standard' | 'large' | 'largest';

export interface AccessibilitySettings {
  textSize: TextSize;
  highContrast: boolean;
  darkMode: boolean;
  voiceReminders: boolean;
  vibrationReminders: boolean;
  loudReminderSound?: boolean; // Boosted volume chime for elderly / hard of hearing
  hideLockScreenNames: boolean; // Privacy on lockscreen
  screenReaderDescriptions: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  dose: string;
  instructions: string; // e.g., "Take with a full glass of water after food"
  time: string; // e.g. "08:00"
  period: 'Morning' | 'Noon' | 'Evening' | 'Bedtime';
  status: 'pending' | 'taken' | 'snoozed' | 'missed';
  takenAt?: string;
  pillColor: string;
  shape: 'round' | 'capsule' | 'oval';
  // Pill Supply & Refill tracking
  remainingCount?: number;
  totalQuantity?: number;
  refillThreshold?: number; // threshold to trigger low supply warning, default 7
  rxNumber?: string;
  pharmacyName?: string;
}

export interface DoctorPrepQuestion {
  id: string;
  text: string;
  completed: boolean;
  category?: 'symptom' | 'medication' | 'general';
}

export interface VoiceNote {
  id: string;
  title: string;
  duration: string; // e.g. "0:45"
  timestamp: string;
  url?: string;
}

export type MoodType = 'great' | 'okay' | 'tired' | 'unwell';

export interface WellnessCheckin {
  id: string;
  date: string;
  mood: MoodType;
  note?: string;
  timestamp: string;
}

export interface EmergencyAlert {
  id: string;
  triggeredAt: string;
  status: 'counting_down' | 'dispatched' | 'cancelled';
  type: 'manual_sos' | 'fall_detected';
  location: string;
}

export interface PrescriptionScanResult {
  medicineName: string;
  dose: string;
  instructions: string;
  period: 'Morning' | 'Noon' | 'Evening' | 'Bedtime';
  time: string;
  totalQuantity: number;
  rxNumber: string;
  pharmacyName: string;
  doctorName: string;
  refillsRemaining: number;
  confidence: number;
}

export interface MedicineHistoryItem {
  id: string;
  medicineName: string;
  dose: string;
  scheduledTime: string;
  status: 'taken' | 'snoozed' | 'missed' | 'skipped';
  timestamp: string;
  dateLabel: 'Today' | 'Yesterday' | 'Earlier this week';
  caregiverAlertSent?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  address: string;
  rating: number;
  availableDays: string[];
  slots: string[];
  avatarBg: string;
  bio: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  date: string;
  time: string;
  reason: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  caregiverNotified: boolean;
  prepQuestions?: DoctorPrepQuestion[];
  voiceNotes?: VoiceNote[];
}

export interface CaregiverPermissions {
  seeAppointments: boolean;
  receiveMissedAlerts: boolean;
  seeMedicineReminders: boolean;
  seeFullMedicineNames: boolean; // toggle whether drug name is visible or just generic reminder
  emergencyContactAccess: boolean;
}

export interface Caregiver {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  avatarInitial: string;
  status: 'active' | 'pending' | 'removed';
  joinedDate: string;
  permissions: CaregiverPermissions;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ScreenId =
  | 'welcome'
  | 'login'
  | 'register'
  | 'forgot_password'
  | 'reset_password'
  | 'verify_email'
  | 'verify_phone'
  | 'role'
  | 'access_setup'
  | 'privacy_consent'
  | 'today'
  | 'appointments'
  | 'empty_appointments'
  | 'doctor_search'
  | 'doctor_profile'
  | 'available_slots'
  | 'booking_review'
  | 'booking_confirmed'
  | 'medicines'
  | 'add_medicine'
  | 'reminder_active'
  | 'medicine_history'
  | 'care_circle'
  | 'invite_caregiver'
  | 'permissions_settings'
  | 'caregiver_dashboard'
  | 'notification_settings'
  | 'profile'
  | 'scan';

export type MainTab = 'today' | 'medicines' | 'scan' | 'appointments' | 'profile' | 'circle';
