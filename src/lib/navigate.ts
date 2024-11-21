import { create } from 'zustand';

export type Page = 'dashboard' | 'chat' | 'history' | 'repos' | 'signin' | 'signup';

interface NavigateState {
  currentPage: Page;
  navigate: (page: Page) => void;
}

export const useNavigate = create<NavigateState>((set) => ({
  currentPage: 'dashboard',
  navigate: (page) => set({ currentPage: page }),
}));