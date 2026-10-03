import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  getDocFromServer,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import config from '../firebase-applet-config.json';
import {
  Medicine,
  Appointment,
  MedicineHistoryItem,
  Caregiver,
  WellnessCheckin,
  UserProfile,
} from './types';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, config.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

// Connection test
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection: running offline-first.');
      return false;
    }
    return true;
  }
}

// User Profile Operations (users/{uid})
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Failed to load user profile from Firestore:', error);
    return null;
  }
};

export const saveUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(
      docRef,
      {
        ...data,
        uid,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Failed to save user profile to Firestore:', error);
  }
};

// Scoped Subcollection: Medications (users/{uid}/medications/{medId})
export const syncMedicineToCloud = async (uid: string, med: Medicine): Promise<void> => {
  if (!uid) return;
  try {
    const docRef = doc(db, 'users', uid, 'medications', String(med.id));
    await setDoc(docRef, { ...med, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn('Medicine cloud sync offline fallback:', error);
  }
};

export const deleteMedicineFromCloud = async (uid: string, medId: string): Promise<void> => {
  if (!uid) return;
  try {
    await deleteDoc(doc(db, 'users', uid, 'medications', String(medId)));
  } catch (error) {
    console.warn('Failed to delete medicine from cloud:', error);
  }
};

export const fetchUserMedicines = async (uid: string): Promise<Medicine[]> => {
  if (!uid) return [];
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'medications'));
    const list: Medicine[] = [];
    snap.forEach((d) => list.push(d.data() as Medicine));
    return list;
  } catch (error) {
    console.warn('Failed to fetch user medicines:', error);
    return [];
  }
};

// Scoped Subcollection: Appointments (users/{uid}/appointments/{appId})
export const syncAppointmentToCloud = async (uid: string, appt: Appointment): Promise<void> => {
  if (!uid) return;
  try {
    const docRef = doc(db, 'users', uid, 'appointments', String(appt.id));
    await setDoc(docRef, { ...appt, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn('Appointment cloud sync offline fallback:', error);
  }
};

export const deleteAppointmentFromCloud = async (uid: string, apptId: string): Promise<void> => {
  if (!uid) return;
  try {
    await deleteDoc(doc(db, 'users', uid, 'appointments', String(apptId)));
  } catch (error) {
    console.warn('Failed to delete appointment from cloud:', error);
  }
};

export const fetchUserAppointments = async (uid: string): Promise<Appointment[]> => {
  if (!uid) return [];
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'appointments'));
    const list: Appointment[] = [];
    snap.forEach((d) => list.push(d.data() as Appointment));
    return list;
  } catch (error) {
    console.warn('Failed to fetch user appointments:', error);
    return [];
  }
};

// Scoped Subcollection: Medication History (users/{uid}/medicationHistory/{historyId})
export const syncHistoryToCloud = async (uid: string, item: MedicineHistoryItem): Promise<void> => {
  if (!uid) return;
  try {
    const docRef = doc(db, 'users', uid, 'medicationHistory', String(item.id));
    await setDoc(docRef, item, { merge: true });
  } catch (error) {
    console.warn('History cloud sync error:', error);
  }
};

export const fetchUserHistory = async (uid: string): Promise<MedicineHistoryItem[]> => {
  if (!uid) return [];
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'medicationHistory'));
    const list: MedicineHistoryItem[] = [];
    snap.forEach((d) => list.push(d.data() as MedicineHistoryItem));
    return list;
  } catch (error) {
    console.warn('Failed to fetch user history:', error);
    return [];
  }
};

// Scoped Subcollection: Care Circle (users/{uid}/careCircle/{caregiverId})
export const syncCaregiverToCloud = async (uid: string, caregiver: Caregiver): Promise<void> => {
  if (!uid) return;
  try {
    const docRef = doc(db, 'users', uid, 'careCircle', String(caregiver.id));
    await setDoc(docRef, caregiver, { merge: true });
  } catch (error) {
    console.warn('Caregiver cloud sync error:', error);
  }
};

export const fetchUserCaregivers = async (uid: string): Promise<Caregiver[]> => {
  if (!uid) return [];
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'careCircle'));
    const list: Caregiver[] = [];
    snap.forEach((d) => list.push(d.data() as Caregiver));
    return list;
  } catch (error) {
    console.warn('Failed to fetch user caregivers:', error);
    return [];
  }
};

// Scoped Subcollection: Wellness (users/{uid}/wellness/{entryId})
export const syncWellnessToCloud = async (uid: string, checkin: WellnessCheckin): Promise<void> => {
  if (!uid) return;
  try {
    const docRef = doc(db, 'users', uid, 'wellness', String(checkin.id));
    await setDoc(docRef, checkin, { merge: true });
  } catch (error) {
    console.warn('Wellness cloud sync error:', error);
  }
};

export const fetchUserWellness = async (uid: string): Promise<WellnessCheckin | undefined> => {
  if (!uid) return undefined;
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'wellness'));
    if (!snap.empty) {
      return snap.docs[0].data() as WellnessCheckin;
    }
    return undefined;
  } catch (error) {
    console.warn('Failed to fetch user wellness:', error);
    return undefined;
  }
};
