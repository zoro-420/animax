import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { User } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signup: (email: string, password: string, additionalData: Partial<User>) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  loginGuest: () => Promise<any>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);

          if (firebaseUser.isAnonymous) {
            setUserData({
              id: firebaseUser.uid,
              name: 'Guest User',
              email: 'guest@animax.local',
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + firebaseUser.uid,
              role: 'guest',
              isGuest: true,
              watchlist: [],
              history: []
            });
          } else {
            try {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userDoc.exists()) {
                setUserData(userDoc.data() as User);
              } else {
                setUserData(null);
              }
            } catch (firestoreErr) {
              console.error("Firestore access failed (likely permission issues):", firestoreErr);
              // Fallback for when Firestore is down/blocked but Auth works
              setUserData({
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'Unknown User',
                email: firebaseUser.email || '',
                avatar: firebaseUser.photoURL || '',
                role: 'user',
                isGuest: false,
                watchlist: [],
                history: []
              } as User);
            }
          }
        } else {
          setUser(null);
          setUserData(null);
        }
      } catch (err) {
        console.error("Auth state handling error:", err);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, additionalData: Partial<User>) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const newUserData: User = {
      id: uid,
      email: email,
      name: additionalData.name || 'Anonymous',
      avatar: additionalData.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + uid,
      isGuest: false,
      watchlist: [],
      history: [],
      ...additionalData,
      role: additionalData.role || 'user'
    };

    // Create user document in Firestore
    // Create user document in Firestore
    try {
      await setDoc(doc(db, 'users', uid), {
        ...newUserData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (firestoreError) {
      console.error('Firestore error (non-blocking):', firestoreError);
      // Don't throw - user is created in Auth, Firestore doc can be created later
    }

    setUserData(newUserData);
    return userCredential;
  };

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginGuest = async () => {
    return signInAnonymously(auth);
  };

  const logout = async () => {
    return signOut(auth);
  };

  const refreshUserProfile = async () => {
    if (!auth.currentUser) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as User);
      }
    } catch (error) {
      console.error("Failed to refresh user profile:", error);
    }
  };

  const value = {
    user,
    userData,
    loading,
    signup,
    login,
    loginGuest,
    logout,
    isAuthenticated: !!user,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
