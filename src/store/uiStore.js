import { create } from 'zustand';

export const useUIStore = create((set) => ({
  modal: null,
  modalData: null,
  openModal: (name, data = null) => set({ modal: name, modalData: data }),
  closeModal: () => set({ modal: null, modalData: null }),
  toast: null,
  showToast: (toast) => set({ toast }),
  hideToast: () => set({ toast: null }),
}));
