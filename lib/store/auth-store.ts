import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';
import { auth } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: {
    fullName?: string;
    phone?: string;
    department?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  updateProfile: (updates: {
    fullName?: string;
    phone?: string;
    department?: string;
  }) => Promise<void>;
  checkPermission: (requiredRole: UserRole) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await auth.signIn(email, password);
          const user = await auth.getCurrentUser();
          set({ user, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string, userData?: {
        fullName?: string;
        phone?: string;
        department?: string;
      }) => {
        set({ isLoading: true, error: null });
        try {
          await auth.signUp(email, password, userData);
          // 注册后不自动登录，需要用户确认邮箱
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true, error: null });
        try {
          await auth.signOut();
          set({ user: null, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const user = await auth.getCurrentUser();
          set({ user, isLoading: false });
        } catch (error: any) {
          set({ user: null, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      updateProfile: async (updates: {
        fullName?: string;
        phone?: string;
        department?: string;
      }) => {
        set({ isLoading: true, error: null });
        try {
          const currentUser = await auth.getCurrentUser();
          if (!currentUser) throw new Error('No user logged in');
          
          await auth.updateProfile(currentUser.id, updates);
          const updatedUser = await auth.getCurrentUser();
          set({ user: updatedUser, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      checkPermission: async (requiredRole: UserRole) => {
        try {
          return await auth.checkPermission(requiredRole);
        } catch (error) {
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // 只持久化用户信息
    }
  )
);