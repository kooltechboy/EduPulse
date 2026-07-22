import { create } from 'zustand';

type ModalType = 
  | 'add-student' | 'edit-student' | 'delete-student'
  | 'add-staff' | 'edit-staff'
  | 'add-course' | 'edit-course'
  | 'pay-invoice' | 'new-transaction'
  | 'new-admission' | 'log-conduct' | 'add-book'
  | 'borrow-book' | 'add-asset' | 'checkout-asset'
  | 'add-event' | 'new-case' | 'log-incident'
  | 'leave-request' | 'approve-leave' | 'add-evaluation'
  | 'new-message' | 'new-announcement'
  | 'export-audit' | 'rotate-keys'
  | 'confirm-delete' | 'confirm-action'
  | null;

interface ModalState {
  activeModal: ModalType;
  modalData: Record<string, any>; // pass any entity data into the modal
  openModal: (type: ModalType, data?: Record<string, any>) => void;
  closeModal: () => void;
  isOpen: (type: ModalType) => boolean;
}

export const useModalStore = create<ModalState>((set, get) => ({
  activeModal: null,
  modalData: {},
  openModal: (type, data = {}) => set({ activeModal: type, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: {} }),
  isOpen: (type) => get().activeModal === type,
}));
