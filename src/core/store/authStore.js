import {create} from 'zustand';

export const useAuthStore = create((set) => ({
  session: null,
  user: null,
  profile: null,
  initialized: false,
  setSession: (session) => set({session}),
  setUser: (user) => set({user}),
  setProfile: (profile) => set({profile}),
  setInitialized: (initialized) => set({initialized}),
  logout: () => set({session: null, user: null, profile: null}),
}));
