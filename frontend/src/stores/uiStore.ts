import { create } from 'zustand';

interface Modal {
  id: string;
  content: React.ReactNode;
  type?: 'drawer' | 'center' | 'fullscreen' | 'bottom-sheet';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

interface UIState {
  modals: Modal[];
  sidebarOpen: boolean;
  loading: boolean;
  openModal: (modal: Modal) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  modals: [],
  sidebarOpen: true,
  loading: false,

  openModal: (modal) =>
    set((state) => ({
      modals: [...state.modals, modal],
    })),

  closeModal: (id) =>
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== id),
    })),

  closeAllModals: () => set({ modals: [] }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setLoading: (loading) => set({ loading }),
}));
