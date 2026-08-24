import { create } from 'zustand';

const useUiStore = create((set) => ({
  isLoginOpen: false,
  openLoginModal: () => set({ isLoginOpen: true }),
  closeLoginModal: () => set({ isLoginOpen: false }),
}));

export default useUiStore;
