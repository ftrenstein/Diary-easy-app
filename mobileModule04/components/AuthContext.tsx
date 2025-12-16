import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Platform } from 'react-native';

// Get GoogleSignin only if not on web
let GoogleSignin: any = null;
if (Platform.OS !== 'web') {
  try {
    GoogleSignin =
      require('@react-native-google-signin/google-signin').GoogleSignin;
  } catch (e) {
    console.log('Google Sign-In not available');
  }
}

// Get AsyncStorage only if not on web
let AsyncStorage: any = null;
if (Platform.OS !== 'web') {
  try {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
  } catch (e) {
    console.log('AsyncStorage not available');
  }
}

// Storage abstraction for web and native
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('localStorage error:', error);
        return null;
      }
    } else {
      if (!AsyncStorage) return null;
      try {
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.error('AsyncStorage error:', error);
        return null;
      }
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('localStorage error:', error);
      }
    } else {
      if (!AsyncStorage) return;
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.error('AsyncStorage error:', error);
      }
    }
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('localStorage error:', error);
      }
    } else {
      if (!AsyncStorage) return;
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.error('AsyncStorage error:', error);
      }
    }
  },
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  firstName: string;
  lastName: string;
  usermail?: string;
  login: () => void;
  logout: () => Promise<void>;
  saveUserProfile: (firstName: string, lastName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [usermail, setusermail] = useState('');

  useEffect(() => {
    // Load user profile from storage
    const loadUserProfile = async () => {
      try {
        const storedFirstName = await storage.getItem('userFirstName');
        const storedLastName = await storage.getItem('userLastName');
        const storedusermail = await storage.getItem('usermail');
        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
        if (storedusermail) setusermail(storedusermail);
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    };

    loadUserProfile();

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthenticated(!!firebaseUser);
      console.log('Authentication state:', !!firebaseUser);

      // If user logs in and we have their display name, save it
      if (firebaseUser && firebaseUser.displayName) {
        const [first, ...lastParts] = firebaseUser.displayName.split(' ');
        const last = lastParts.join(' ');
        await saveUserProfile(first || '', last || '');
      }
    });

    return () => unsubscribe();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const saveUserProfile = async (first: string, last: string) => {
    try {
      await storage.setItem('userFirstName', first);
      await storage.setItem('userLastName', last);
      setFirstName(first);
      setLastName(last);
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Google if available
      if (GoogleSignin) {
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          console.log('Google Sign-In logged out');
        } catch (googleError) {
          console.log('Google Sign-In logout error:', googleError);
        }
      }

      // Sign out from Firebase
      await signOut(auth);

      // Clear storage
      await storage.removeItem('userFirstName');
      await storage.removeItem('userLastName');

      // Clear state
      setIsAuthenticated(false);
      setUser(null);
      setFirstName('');
      setLastName('');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        firstName,
        lastName,
        login,
        logout,
        saveUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
