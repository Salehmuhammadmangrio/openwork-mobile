import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setAuthHeader } from '../utils/api';

const persistToken = async (token) => {
  if (token) await AsyncStorage.setItem('ow-token', token);
  else await AsyncStorage.removeItem('ow-token');
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      activeRole: null,
      isLoading: false,
      isAuthenticated: false,
      hydrated: false,

      setHydrated: (v) => set({ hydrated: v }),

      setAuth: (user, token) => {
        const canClient = user?.role === 'client' || user?.canActAsClient;
        const canFreelancer =
          user?.role === 'freelancer' ||
          user?.canActAsFreelancer ||
          user?.role === 'admin';
        const allowed = [
          ...(canClient ? ['client'] : []),
          ...(canFreelancer ? ['freelancer'] : []),
        ];
        const fallbackRole = allowed[0] || 'freelancer';
        const current = get().activeRole;
        const nextRole = allowed.includes(current) ? current : fallbackRole;
        set({ user, token, activeRole: nextRole, isAuthenticated: true });
        setAuthHeader(token);
        persistToken(token);
      },

      setActiveRole: (role) => {
        const user = get().user;
        if (!user) return;
        const canClient = user.role === 'client' || user.canActAsClient;
        const canFreelancer =
          user.role === 'freelancer' ||
          user.canActAsFreelancer ||
          user.role === 'admin';
        const allowed = [
          ...(canClient ? ['client'] : []),
          ...(canFreelancer ? ['freelancer'] : []),
        ];
        if (allowed.includes(role)) set({ activeRole: role });
      },

      toggleRole: () => {
        const { activeRole } = get();
        const next = activeRole === 'client' ? 'freelancer' : 'client';
        get().setActiveRole(next);
      },

      updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),

      logout: async () => {
        set({ user: null, token: null, activeRole: null, isAuthenticated: false });
        setAuthHeader(null);
        await AsyncStorage.multiRemove(['ow-token', 'ow-auth', 'ow-user']);
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          get().setAuth(data.user, data.token);
          return data;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (formData) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', formData);
          get().setAuth(data.user, data.token);
          return data;
        } finally {
          set({ isLoading: false });
        }
      },

      firebaseLogin: async (idToken, provider) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/firebase-login', {
            idToken,
            provider,
          });
          get().setAuth(data.user, data.token);
          return data;
        } finally {
          set({ isLoading: false });
        }
      },

      firebaseRegister: async (idToken, provider) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/firebase-register', {
            idToken,
            provider,
          });
          get().setAuth(data.user, data.token);
          return data;
        } finally {
          set({ isLoading: false });
        }
      },

      forgotPassword: async (email) => {
        const { data } = await api.post('/auth/forgot-password', { email });
        return data;
      },

      resetPassword: async (token, password) => {
        const { data } = await api.post('/auth/reset-password', {
          token,
          password,
        });
        return data;
      },

      verifyEmail: async (token) => {
        const { data } = await api.post('/auth/verify-email', { token });
        if (data?.user) get().updateUser({ emailVerified: true });
        return data;
      },

      refreshProfile: async () => {
        try {
          const { data } = await api.get('/auth/me');
          if (data?.user) set({ user: data.user, isAuthenticated: true });
          return data?.user;
        } catch {
          return null;
        }
      },
    }),
    {
      name: 'ow-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        activeRole: s.activeRole,
        isAuthenticated: s.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setAuthHeader(state.token);
        state?.setHydrated?.(true);
      },
    }
  )
);
