import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  userType: 'admin' | 'client' | null;
  setUser: (user: User | null) => void;
  setUserType: (type: 'admin' | 'client' | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userType: null,
  setUser: (user) => set({ user }),
  setUserType: (userType) => set({ userType }),
}));