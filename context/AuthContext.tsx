```typescript
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
      if (firebaseUser) {
        setUser(firebaseUser);
        
        if (firebaseUser.isAnonymous) {
            // Create transient Guest User Data
            setUserData({
                id: firebaseUser.uid,
                name: 'Guest User',
                email: 'guest@animax.local',
                avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + firebaseUser.uid,
                isGuest: true,
                watchlist: [],
                history: []
            });
        } else {
            // Fetch additional user data from Firestore for real users
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              setUserData(userDoc.data() as User);
            } else {
                 setUserData(null);
            }
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
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
        ...additionalData
    };

    // Create user document in Firestore
    await setDoc(doc(db, 'users', uid), {
      ...newUserData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
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

  const value = {
    user,
    userData,
    loading,
    signup,
    login,
    loginGuest,
    logout,
    isAuthenticated: !!user
  };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
