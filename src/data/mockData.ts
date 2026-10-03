import {
  AccessibilitySettings,
  Appointment,
  Caregiver,
  Doctor,
  Medicine,
  MedicineHistoryItem,
  WellnessCheckin,
} from '../types';

export const INITIAL_ACCESSIBILITY: AccessibilitySettings = {
  textSize: 'large',
  highContrast: false,
  darkMode: false,
  voiceReminders: true,
  vibrationReminders: true,
  loudReminderSound: true,
  hideLockScreenNames: false,
  screenReaderDescriptions: true,
};

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Metformin',
    dose: '500 mg (1 tablet)',
    instructions: 'Take with food and a full glass of water',
    time: '08:30',
    period: 'Morning',
    status: 'pending',
    pillColor: '#3B82F6',
    shape: 'round',
    remainingCount: 28,
    totalQuantity: 30,
    refillThreshold: 7,
    rxNumber: 'RX-902144',
    pharmacyName: 'Walgreens Pharmacy #4412',
  },
  {
    id: 'med-2',
    name: 'Amlodipine',
    dose: '5 mg (1 tablet)',
    instructions: 'Take once daily in the morning for blood pressure',
    time: '09:00',
    period: 'Morning',
    status: 'missed',
    pillColor: '#10B981',
    shape: 'capsule',
    remainingCount: 4, // LOW SUPPLY ALERT!
    totalQuantity: 30,
    refillThreshold: 7,
    rxNumber: 'RX-884102',
    pharmacyName: 'CVS Caremark #109',
  },
  {
    id: 'med-3',
    name: 'Lisinopril',
    dose: '10 mg (1 tablet)',
    instructions: 'Take in the evening after dinner',
    time: '19:30',
    period: 'Evening',
    status: 'pending',
    pillColor: '#F59E0B',
    shape: 'oval',
    remainingCount: 14,
    totalQuantity: 30,
    refillThreshold: 7,
    rxNumber: 'RX-554190',
    pharmacyName: 'Walgreens Pharmacy #4412',
  },
  {
    id: 'med-4',
    name: 'Calcium + Vit D3',
    dose: '600 mg (1 chewable)',
    instructions: 'Take before bedtime',
    time: '21:30',
    period: 'Bedtime',
    status: 'pending',
    pillColor: '#8B5CF6',
    shape: 'round',
    remainingCount: 45,
    totalQuantity: 60,
    refillThreshold: 10,
    rxNumber: 'OTC-11029',
    pharmacyName: 'Local Health Mart',
  },
];

export const INITIAL_HISTORY: MedicineHistoryItem[] = [
  {
    id: 'hist-1',
    medicineName: 'Metformin',
    dose: '500 mg',
    scheduledTime: '08:30',
    status: 'taken',
    timestamp: '08:35 AM',
    dateLabel: 'Today',
  },
  {
    id: 'hist-2',
    medicineName: 'Amlodipine',
    dose: '5 mg',
    scheduledTime: '09:00',
    status: 'missed',
    timestamp: '09:45 AM (30 min grace passed)',
    dateLabel: 'Today',
    caregiverAlertSent: true,
  },
  {
    id: 'hist-3',
    medicineName: 'Metformin',
    dose: '500 mg',
    scheduledTime: '08:30',
    status: 'taken',
    timestamp: '08:32 AM',
    dateLabel: 'Yesterday',
  },
  {
    id: 'hist-4',
    medicineName: 'Lisinopril',
    dose: '10 mg',
    scheduledTime: '19:30',
    status: 'taken',
    timestamp: '19:38 PM',
    dateLabel: 'Yesterday',
  },
  {
    id: 'hist-5',
    medicineName: 'Amlodipine',
    dose: '5 mg',
    scheduledTime: '09:00',
    status: 'snoozed',
    timestamp: '09:15 AM (taken at 09:20)',
    dateLabel: 'Earlier this week',
  },
];

export const DOCTORS_LIST: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Maya Rao, MD',
    specialty: 'Cardiologist',
    clinic: 'City Heart & Vascular Center',
    address: '420 Metro Ave, Suite 300',
    rating: 4.9,
    availableDays: ['Thursday, 18 Sep', 'Friday, 19 Sep', 'Monday, 22 Sep'],
    slots: ['10:00 AM', '10:30 AM', '11:15 AM', '02:00 PM', '02:45 PM', '04:15 PM'],
    avatarBg: 'from-blue-600 to-indigo-700',
    bio: 'Specializing in preventive cardiology, hypertension control, and cardiac wellness for older adults with 16+ years experience.',
  },
  {
    id: 'doc-2',
    name: 'Dr. Arjun Iyer, MD',
    specialty: 'Internal Medicine & Geriatrics',
    clinic: 'Sunrise Community Hospital',
    address: '108 Oakwood Blvd',
    rating: 4.8,
    availableDays: ['Thursday, 18 Sep', 'Tuesday, 23 Sep'],
    slots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:15 PM'],
    avatarBg: 'from-teal-600 to-emerald-700',
    bio: 'Dedicated primary care physician focused on chronic illness management, polypharmacy simplification, and age-friendly communication.',
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rostova, MD',
    specialty: 'Endocrinologist',
    clinic: 'Mercy Diabetes & Metabolic Clinic',
    address: '75 Elmcrest Parkway',
    rating: 4.95,
    availableDays: ['Wednesday, 17 Sep', 'Friday, 19 Sep'],
    slots: ['08:45 AM', '10:15 AM', '01:00 PM', '03:45 PM'],
    avatarBg: 'from-violet-600 to-purple-700',
    bio: 'Renowned endocrinologist providing gentle, tailored dietary and insulin/medication support for Type 2 diabetes patients.',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    doctorId: 'doc-1',
    doctorName: 'Dr. Maya Rao, MD',
    specialty: 'Cardiologist',
    clinic: 'City Heart & Vascular Center',
    date: 'Thursday, 18 September 2026',
    time: '10:30 AM',
    reason: 'Routine 6-month blood pressure & heart checkup',
    status: 'confirmed',
    caregiverNotified: true,
    prepQuestions: [
      {
        id: 'q-1',
        text: 'Ask about slight dizziness when standing up in the morning',
        completed: false,
        category: 'symptom',
      },
      {
        id: 'q-2',
        text: 'Check if blood pressure reading average (132/84) is within healthy range',
        completed: true,
        category: 'general',
      },
      {
        id: 'q-3',
        text: 'Request 90-day mail delivery refill for Amlodipine & Metformin',
        completed: false,
        category: 'medication',
      },
    ],
    voiceNotes: [
      {
        id: 'vn-1',
        title: "Dr. Rao's post-visit instruction",
        duration: '0:34',
        timestamp: 'Last visit (March 12)',
      },
    ],
  },
];

export const INITIAL_WELLNESS: WellnessCheckin = {
  id: 'well-1',
  date: 'Today, 12 Sep',
  mood: 'great',
  note: 'Had a peaceful night of rest. Feeling energized for a walk in the garden.',
  timestamp: '08:15 AM',
};

export const INITIAL_CAREGIVERS: Caregiver[] = [
  {
    id: 'cg-1',
    name: 'Priya Sharma',
    relation: 'Daughter',
    phone: '+1 (555) 234-8901',
    email: 'priya.sharma@example.com',
    avatarInitial: 'P',
    status: 'active',
    joinedDate: 'Added 2 weeks ago',
    permissions: {
      seeAppointments: true,
      receiveMissedAlerts: true,
      seeMedicineReminders: true,
      seeFullMedicineNames: false, // Default privacy: generic pill reminder
      emergencyContactAccess: true,
    },
  },
];

// UX Portfolio & Project Plan Content
export const UX_PROJECT_PLAN = {
  problemStatement:
    'Patients managing medicines and medical appointments can feel overwhelmed, while caregivers want to help without taking away their independence. CareRoute provides accessible reminders, simple appointment management, and permission-based caregiver support.',
  resumeSnippet:
    'Independent UI/UX Case Study — CareRoute\nDesigned an accessible mobile experience for medicine reminders and appointment booking. Created user flows, wireframes, a Figma design system, interactive prototypes, and caregiver privacy controls. Developed using React Native to ensure seamless cross-platform performance.',
  fourWeekPlan: [
    {
      week: 'Week 1',
      title: 'Research, Interviews & Foundations',
      tasks: [
        'Conducted 8 in-depth interviews (4 seniors 65+, 4 working adult caregivers)',
        'Synthesized pain points: complex medical jargon, fear of burdening family, accidental double-dosing',
        'Competitor benchmarking against Medisafe, MyChart, and Apple Health',
        'Defined core persona: Margaret Lewis (72, retired educator) & Priya Sharma (41, product manager daughter)',
        'Built User Journey Map tracking emotional states across medication routines',
      ],
    },
    {
      week: 'Week 2',
      title: 'Information Architecture, Sitemap & Wireframing',
      tasks: [
        'Created 5-tab core navigation architecture (Today, Visits, Medicines, Care Circle, Profile)',
        'Low-fidelity wireframing of all 20 primary mobile screens',
        'Established 8px atomic grid system with 48px-56px minimum touch target requirements',
        'Defined emergency disclaimer policy: prominent banner stating CareRoute is not an emergency service',
        'Mapped multi-branch permission matrix for caregiver delegation',
      ],
    },
    {
      week: 'Week 3',
      title: 'High-Fidelity UI, 3D Assets & Design System',
      tasks: [
        'Engineered high-contrast WCAG AAA compliant color scheme (Trustworthy Navy, Soft Sky Blue, Healing Mint Teal)',
        'Crafted custom 3D claymorphic visual assets for Medicine Schedules, Appointment Notebooks, and Privacy Padlocks',
        'Designed accessible typography scales: Standard (16px body), Large (18px body), Largest (21px body)',
        'Developed dual-role viewports: Patient View vs. Caregiver restricted oversight view',
        'Integrated tactile vibration patterns and clear audio chime prototypes',
      ],
    },
    {
      week: 'Week 4',
      title: 'Interactive Prototyping, Usability Testing & Refinements',
      tasks: [
        'Conducted moderated usability testing on 6 core tasks with 5 participants',
        'Identified confusion around missed dose guidance; replaced technical text with clear "Do not double dose" safety warning',
        'Added duplicate-tap protection preventing accidental double medicine marks',
        'Tested lock-screen privacy toggle hiding sensitive prescription names',
        'Finalized portfolio case study presentation, design tokens, and documentation',
      ],
    },
  ],
  testingTasks: [
    {
      id: 'task-1',
      instruction: 'Add a medicine reminder for 8:00 PM',
      screen: 'medicines',
      actionHint: 'Tap "+" on Medicines tab, input name and 20:00 time, tap Save',
      solutionOutcome: 'Medicine appears under evening schedule and Today screen',
    },
    {
      id: 'task-2',
      instruction: 'Mark a medicine as taken',
      screen: 'today',
      actionHint: 'Tap "Taken" on the next medicine card on the Today screen',
      solutionOutcome: 'Immediate feedback toast, card moves to handled, logged in History',
    },
    {
      id: 'task-3',
      instruction: 'Book an appointment with Dr. Maya Rao',
      screen: 'appointments',
      actionHint: 'Go to Visits -> Book -> Select Dr. Rao -> Pick 10:30 AM slot -> Confirm',
      solutionOutcome: 'Appointment confirmed with 1-hour and 1-day reminders queued',
    },
    {
      id: 'task-4',
      instruction: 'Change text size to "Largest" & preview dark mode',
      screen: 'profile',
      actionHint: 'Go to Profile -> Accessibility -> Choose Largest and toggle Dark Mode',
      solutionOutcome: 'Immediate visual scaling across all navigation, buttons, and text',
    },
    {
      id: 'task-5',
      instruction: 'Invite a caregiver and view permissions',
      screen: 'care_circle',
      actionHint: 'Go to Care Circle -> Invite -> Share code or tap "Simulate Join"',
      solutionOutcome: 'Priya Sharma appears in Care Circle with granular permission toggles',
    },
    {
      id: 'task-6',
      instruction: 'Test Caregiver View and remove caregiver access',
      screen: 'permissions_settings',
      actionHint: 'Open Priya -> tap "Preview Caregiver View", then tap "Remove Access"',
      solutionOutcome: 'Caregiver immediately loses viewing privileges with instant confirmation',
    },
  ],
  edgeCases: [
    {
      title: 'Accidentally marked taken twice',
      behavior:
        'CareRoute detects previous mark within same dosing window and warns gently: "Already marked taken today. Duplicate tap safely ignored."',
    },
    {
      title: 'Missed medicine dose',
      behavior:
        'Safe clinical copy shown: "Follow your prescription instructions or contact your doctor or pharmacist. Do not double a dose." Caregiver alerted only if permitted.',
    },
    {
      title: 'No doctor slots available',
      behavior:
        'Clean empty/booked slot indicators with one-tap waitlist alert request instead of confusing dead ends.',
    },
    {
      title: 'Phone on silent / Do Not Disturb',
      behavior:
        'Uses system critical health alarm override (with visual screen flash and high-intensity haptic vibration).',
    },
    {
      title: 'Caregiver access revoked',
      behavior:
        'Instant token invalidation. The caregiver dashboard displays "Margaret has updated her privacy settings and access is no longer active."',
    },
    {
      title: 'Emergency SOS protocol',
      behavior:
        'Prominent one-tap dial for 911 / emergency services and primary contact, with location sharing.',
    },
  ],
};
