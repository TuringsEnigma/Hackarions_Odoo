import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'auth_user_data';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, // Stores { id, name, role, companyCurrency, token }
      
      // Method to set user data on successful login/signup
      login: (userData) => set({ user: userData }),
      
      // Method to clear user data on logout
      logout: () => {
        // Clear from localStorage
        localStorage.removeItem(STORAGE_KEY);
        set({ user: null });
      },
      
      // Helper to check current role
      getUserRole: () => get().user?.role || 'Guest',
      
      // Helper to check if user is authenticated
      isAuthenticated: () => !!get().user?.token,
      
      // Initialize from localStorage on app startup
      initialize: () => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const userData = JSON.parse(stored);
            // Validate token exists and is not expired (basic check)
            if (userData?.token) {
              set({ user: userData });
            } else {
              // Clear invalid data
              localStorage.removeItem(STORAGE_KEY);
            }
          }
        } catch (error) {
          console.error('Failed to initialize auth from localStorage:', error);
          localStorage.removeItem(STORAGE_KEY);
        }
      },
    }),
    {
      name: STORAGE_KEY,
      // Only persist the user data
      partialize: (state) => ({ user: state.user }),
      // Custom storage to handle errors gracefully
      storage: {
        getItem: (name) => {
          try {
            return localStorage.getItem(name);
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch (error) {
            console.error('Failed to save auth data to localStorage:', error);
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (error) {
            console.error('Failed to remove auth data from localStorage:', error);
          }
        },
      },
    }
  )
);