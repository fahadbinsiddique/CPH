import { create } from 'zustand';

const useUiStore = create((set) => ({
  isLoginOpen: false,
  openLoginDrawer: () => set({ isLoginOpen: true }),
  closeLoginDrawer: () => set({ isLoginOpen: false }),
}));

export default useUiStore;
