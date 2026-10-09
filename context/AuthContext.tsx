import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User, onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  kayitOl: (adSoyad: string, email: string, sifre: string) => Promise<void>;
  girisYap: (email: string, sifre: string) => Promise<void>;
  cikisYap: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const kayitOl = async (adSoyad: string, email: string, sifre: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, sifre);
    await updateProfile(user, { displayName: adSoyad });
    setUser({ ...user, displayName: adSoyad } as User);
  };

  const girisYap = async (email: string, sifre: string) => {
    await signInWithEmailAndPassword(auth, email, sifre);
  };

  const cikisYap = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, kayitOl, girisYap, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);