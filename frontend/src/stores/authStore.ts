import { create } from 'zustand';
import api from '@/api/client';
import type { AuthStore } from '@/types/auth';

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Express backend accepts JSON
      await api.post('/auth/login', { email, password });

      // Backend returns { status, data: { user } }
      const { data: meData } = await api.get('/auth/me');
      set({ user: meData.data.user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Backend expects { name, email, password }
      await api.post('/auth/register', { name: username, email, password });

      // Auto-login after registration
      await api.post('/auth/login', { email, password });

      const { data: meData } = await api.get('/auth/me');
      set({ user: meData.data.user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.get('/auth/logout');
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.data.user, isAuthenticated: true, isInitializing: false });
    } catch {
      set({ user: null, isAuthenticated: false, isInitializing: false });
    }
  },

  clearError: () => set({ error: null }),
}));
