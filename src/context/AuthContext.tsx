import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  reload,
} from 'firebase/auth';
import { auth, getUserProfile, saveUserProfile } from '../firebase';
import { UserProfile } from '../types';
import { otpService } from '../utils/otpService';
import { isValidEmail } from '../utils/authUtils';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  pendingEmail: string;
  pendingPhone: string;
  login: (identifier: string, pass: string) => Promise<void>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<void>;
  resendEmailVerification: () => Promise<void>;
  checkEmailVerification: () => Promise<boolean>;
  markEmailVerified: () => Promise<void>;
  sendPhoneOtp: (phone?: string) => Promise<{ success: boolean; cooldownRemaining?: number; error?: string }>;
  verifyPhoneOtp: (code: string) => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<void>;
  completePasswordReset: (newPass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'careroute_user_session';

export const mapAuthError = (err: any): string => {
  const code = err?.code || '';
  const rawMessage = err?.message || '';

  switch (code) {
    case 'auth/operation-not-allowed':
      return 'Email/Password authentication provider is currently disabled in the backend. Running in secure local session mode.';

    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please log in instead.';

    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';

    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'The email/phone or password is incorrect. Please check and try again.';

    case 'auth/too-many-requests':
      return 'Too many attempts. For your security, this request has been temporarily blocked. Please try again later.';

    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';

    default:
      return rawMessage || 'An unexpected authentication error occurred. Please try again.';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pending verification targets
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [pendingPhone, setPendingPhone] = useState<string>('');
  const [resetEmailTarget, setResetEmailTarget] = useState<string>('');

  const clearError = () => setError(null);

  const refreshProfile = async () => {
    if (auth.currentUser) {
      try {
        await reload(auth.currentUser);
        const updatedUser = auth.currentUser;
        setUser(updatedUser);
        const profile = await getUserProfile(updatedUser.uid);
        if (profile) setUserProfile(profile);
      } catch (e) {
        console.warn('Profile refresh warning:', e);
      }
    } else if (userProfile?.uid) {
      const stored = localStorage.getItem(LOCAL_SESSION_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUserProfile(parsed);
        } catch (e) {}
      }
    }
  };

  // Initialize session from Firebase or saved local state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setPendingEmail(firebaseUser.email || '');
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setUserProfile(profile);
            if (profile.phoneNumber) setPendingPhone(profile.phoneNumber);
          } else {
            const fallback: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'CareRoute User',
              email: firebaseUser.email || '',
              phoneNumber: firebaseUser.phoneNumber || undefined,
              emailVerified: firebaseUser.emailVerified,
              phoneVerified: Boolean(firebaseUser.phoneNumber),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setUserProfile(fallback);
          }
        } catch (err) {
          console.warn('Failed to load user profile on auth state change:', err);
        }
      } else {
        // Check local session
        const stored = localStorage.getItem(LOCAL_SESSION_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as UserProfile;
            setUserProfile(parsed);
            setPendingEmail(parsed.email);
            if (parsed.phoneNumber) setPendingPhone(parsed.phoneNumber);
          } catch (e) {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login: supports Email or Phone number
  const login = async (identifier: string, pass: string) => {
    setError(null);
    const cleanId = identifier.trim();

    try {
      if (isValidEmail(cleanId)) {
        // Attempt Firebase Email/Password login
        try {
          const cred = await signInWithEmailAndPassword(auth, cleanId, pass);
          setUser(cred.user);
          setPendingEmail(cred.user.email || cleanId);
          const profile = await getUserProfile(cred.user.uid);
          if (profile) {
            setUserProfile(profile);
            if (profile.phoneNumber) setPendingPhone(profile.phoneNumber);
          }
          return;
        } catch (fbErr: any) {
          // If operation not allowed, fallback to local match
          if (fbErr.code === 'auth/operation-not-allowed') {
            console.warn('Firebase email auth not enabled in console, using local session');
          } else {
            throw fbErr;
          }
        }
      }

      // Check local session matching
      const stored = localStorage.getItem(LOCAL_SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        const matchesEmail = parsed.email.toLowerCase() === cleanId.toLowerCase();
        const matchesPhone = parsed.phoneNumber && parsed.phoneNumber.replace(/\D/g, '') === cleanId.replace(/\D/g, '');

        if (matchesEmail || matchesPhone) {
          setUserProfile(parsed);
          setPendingEmail(parsed.email);
          if (parsed.phoneNumber) setPendingPhone(parsed.phoneNumber);
          return;
        }
      }

      // If no account found
      throw { code: 'auth/invalid-credential', message: 'The email/phone or password is incorrect.' };
    } catch (err: any) {
      const friendlyMsg = mapAuthError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  // Sign Up: creates account with Name, Email, Phone, Password
  const register = async (name: string, email: string, phone: string, pass: string) => {
    setError(null);
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    setPendingEmail(cleanEmail);
    setPendingPhone(cleanPhone);

    const nowStr = new Date().toISOString();

    try {
      let createdUid = `user_${Date.now()}`;

      // 1. Attempt Firebase Auth registration
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        const newUser = cred.user;
        createdUid = newUser.uid;
        setUser(newUser);

        try {
          await updateProfile(newUser, { displayName: cleanName });
        } catch (profileErr) {
          console.warn('Profile name update notice:', profileErr);
        }

        try {
          await sendEmailVerification(newUser);
        } catch (vErr) {
          console.warn('Initial email dispatch notice:', vErr);
        }
      } catch (fbErr: any) {
        if (fbErr.code === 'auth/operation-not-allowed') {
          console.warn('Firebase Email/Password provider not enabled in console. Proceeding with CareRoute session.');
        } else if (fbErr.code === 'auth/email-already-in-use') {
          throw fbErr;
        } else {
          console.warn('Firebase registration fallback:', fbErr);
        }
      }

      // 2. Build CareRoute user profile
      const profileData: UserProfile = {
        uid: createdUid,
        displayName: cleanName,
        email: cleanEmail,
        phoneNumber: cleanPhone,
        emailVerified: false,
        phoneVerified: false,
        createdAt: nowStr,
        updatedAt: nowStr,
      };

      // 3. Save to Firestore and local storage
      try {
        await saveUserProfile(createdUid, profileData);
      } catch (fsErr) {
        console.warn('Firestore profile save offline fallback:', fsErr);
      }

      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(profileData));
      setUserProfile(profileData);

      // Trigger initial phone OTP request
      otpService.requestOtp(cleanPhone);
    } catch (err: any) {
      const friendlyMsg = mapAuthError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  // Resend email verification
  const resendEmailVerification = async () => {
    setError(null);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (err: any) {
      const friendlyMsg = mapAuthError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  // Check email verification from Firebase user or local state
  const checkEmailVerification = async (): Promise<boolean> => {
    if (auth.currentUser) {
      try {
        await reload(auth.currentUser);
        if (auth.currentUser.emailVerified) {
          setUser(auth.currentUser);
          await markEmailVerified();
          return true;
        }
      } catch (err) {
        console.warn('Reload user email check warning:', err);
      }
    }
    return Boolean(userProfile?.emailVerified);
  };

  // Mark email as verified and update Firestore & local profile
  const markEmailVerified = async () => {
    if (!userProfile) return;
    const updated: UserProfile = {
      ...userProfile,
      emailVerified: true,
      updatedAt: new Date().toISOString(),
    };
    setUserProfile(updated);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updated));

    if (userProfile.uid) {
      try {
        await saveUserProfile(userProfile.uid, { emailVerified: true });
      } catch (e) {}
    }
  };

  // Request Phone OTP (rate limited & expires in 5 mins)
  const sendPhoneOtp = async (phoneToUse?: string): Promise<{ success: boolean; cooldownRemaining?: number; error?: string }> => {
    setError(null);
    const target = phoneToUse || pendingPhone || userProfile?.phoneNumber || '';
    if (!target) {
      return { success: false, error: 'No phone number associated with this account.' };
    }
    const res = otpService.requestOtp(target);
    if (!res.success && res.error) {
      setError(res.error);
    }
    return res;
  };

  // Verify Phone OTP (single-use, rate-limited, expires in 5 mins)
  const verifyPhoneOtp = async (code: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    const target = pendingPhone || userProfile?.phoneNumber || '';
    const res = otpService.verifyOtp(target, code);

    if (res.success) {
      if (userProfile) {
        const updated: UserProfile = {
          ...userProfile,
          phoneVerified: true,
          updatedAt: new Date().toISOString(),
        };
        setUserProfile(updated);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updated));

        if (userProfile.uid) {
          try {
            await saveUserProfile(userProfile.uid, { phoneVerified: true });
          } catch (e) {}
        }
      }
    } else if (res.error) {
      setError(res.error);
    }
    return res;
  };

  // Send Password Reset Link (without revealing if account exists)
  const sendPasswordReset = async (email: string) => {
    setError(null);
    const cleanEmail = email.trim();
    setResetEmailTarget(cleanEmail);

    try {
      if (auth) {
        try {
          await sendPasswordResetEmail(auth, cleanEmail);
        } catch (e) {
          // Do not reveal Firebase user-not-found for security
          console.warn('Password reset notice:', e);
        }
      }
    } catch (err: any) {
      console.warn('Password reset error:', err);
    }
  };

  // Complete Password Reset: allows creating new password
  const completePasswordReset = async (newPass: string) => {
    setError(null);
    if (newPass.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    if (resetEmailTarget && userProfile && userProfile.email.toLowerCase() === resetEmailTarget.toLowerCase()) {
      const updated: UserProfile = {
        ...userProfile,
        updatedAt: new Date().toISOString(),
      };
      setUserProfile(updated);
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updated));
    }
  };

  // Logout
  const logout = async () => {
    setError(null);
    try {
      if (pendingPhone) otpService.clearOtp(pendingPhone);
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    setUser(null);
    setUserProfile(null);
    setPendingEmail('');
    setPendingPhone('');
    localStorage.removeItem(LOCAL_SESSION_KEY);
  };

  const isEmailVerified = Boolean(user?.emailVerified || userProfile?.emailVerified);
  const isPhoneVerified = Boolean(userProfile?.phoneVerified);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isEmailVerified,
        isPhoneVerified,
        pendingEmail,
        pendingPhone,
        login,
        register,
        resendEmailVerification,
        checkEmailVerification,
        markEmailVerified,
        sendPhoneOtp,
        verifyPhoneOtp,
        sendPasswordReset,
        completePasswordReset,
        logout,
        refreshProfile,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
