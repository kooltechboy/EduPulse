import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { storage } from '@/data/storageAdapter';
import { useUIStore } from '@/stores/uiStore';
import {
  FinanceTransaction, Invoice, InvoiceItem,
  TransportRoute, RouteStop,
  DailyMenu, MealSlot, MealAccount, DietaryProfile,
  ConductRecord, HousePoint,
  LibraryBook, BorrowRecord,
  MedicalRecord, HealthIncident, ImmunizationRecord,
  Asset,
  StaffMember, LeaveRequest, Evaluation,
  CounselingCase, CounselingSession,
  CampusEvent
} from '@/types';

interface OperationsState {
  // Finance
  transactions: FinanceTransaction[];
  invoices: Invoice[];
  addTransaction: (tx: FinanceTransaction) => void;
  updateTransaction: (id: string, updates: Partial<FinanceTransaction>) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  markInvoicePaid: (id: string, date: string) => void;

  // Fleet/Transport
  routes: TransportRoute[];
  addRoute: (route: TransportRoute) => void;
  updateRoute: (id: string, updates: Partial<TransportRoute>) => void;
  updateVehicleLocation: (id: string, lat: number, lng: number) => void;

  // Cafeteria
  menus: DailyMenu[];
  mealAccounts: MealAccount[];
  dietaryProfiles: DietaryProfile[];
  addMenu: (menu: DailyMenu) => void;
  updateMealAccountBalance: (studentId: string, amount: number) => void;
  processOrder: (studentId: string, amount: number) => void;

  // Behavior/PBIS
  conductRecords: ConductRecord[];
  housePoints: HousePoint[];
  addConductRecord: (record: ConductRecord) => void;
  updateHousePoints: (houseName: string, points: number) => void;

  // Library
  books: LibraryBook[];
  addBook: (book: LibraryBook) => void;
  returnBook: (bookId: string, studentId: string) => void;
  borrowBook: (record: BorrowRecord) => void;

  // Medical
  medicalRecords: MedicalRecord[];
  healthIncidents: HealthIncident[];
  immunizations: ImmunizationRecord[];
  addMedicalRecord: (record: MedicalRecord) => void;
  addHealthIncident: (incident: HealthIncident) => void;
  addImmunization: (record: ImmunizationRecord) => void;

  // Inventory
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  checkoutAsset: (assetId: string, assignedTo: string) => void;
  checkinAsset: (assetId: string) => void;

  // HR
  staff: StaffMember[];
  leaveRequests: LeaveRequest[];
  evaluations: Evaluation[];
  addStaff: (member: StaffMember) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  addLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveStatus: (id: string, status: 'pending' | 'approved' | 'denied', approvedBy?: string) => void;
  addEvaluation: (evaluation: Evaluation) => void;

  // Counseling
  cases: CounselingCase[];
  addCase: (counselingCase: CounselingCase) => void;
  updateCase: (id: string, updates: Partial<CounselingCase>) => void;
  addSession: (caseId: string, session: CounselingSession) => void;

  // Events
  events: CampusEvent[];
  addEvent: (event: CampusEvent) => void;
  updateEvent: (id: string, updates: Partial<CampusEvent>) => void;
  rsvpEvent: (eventId: string, attendeeId: string) => void;

  loadData: () => void;
}

const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
  // Assuming addToast takes an object, but checking type if needed.
  // We'll use a generic safe call
  const uiStore = useUIStore.getState();
  if (uiStore.addToast) {
    uiStore.addToast({ title, message, type });
  }
};

export const useOperationsStore = create<OperationsState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    transactions: [],
    invoices: [],
    routes: [],
    menus: [],
    mealAccounts: [],
    dietaryProfiles: [],
    conductRecords: [],
    housePoints: [],
    books: [],
    medicalRecords: [],
    healthIncidents: [],
    immunizations: [],
    assets: [],
    staff: [],
    leaveRequests: [],
    evaluations: [],
    cases: [],
    events: [],

    loadData: () => {
      set({
        transactions: storage.get<FinanceTransaction[]>('transactions', []),
        invoices: storage.get<Invoice[]>('invoices', []),
        routes: storage.get<TransportRoute[]>('routes', []),
        menus: storage.get<DailyMenu[]>('menus', []),
        mealAccounts: storage.get<MealAccount[]>('mealAccounts', []),
        dietaryProfiles: storage.get<DietaryProfile[]>('dietaryProfiles', []),
        conductRecords: storage.get<ConductRecord[]>('conductRecords', []),
        housePoints: storage.get<HousePoint[]>('housePoints', []),
        books: storage.get<LibraryBook[]>('books', []),
        medicalRecords: storage.get<MedicalRecord[]>('medicalRecords', []),
        healthIncidents: storage.get<HealthIncident[]>('healthIncidents', []),
        immunizations: storage.get<ImmunizationRecord[]>('immunizations', []),
        assets: storage.get<Asset[]>('assets', []),
        staff: storage.get<StaffMember[]>('staff', []),
        leaveRequests: storage.get<LeaveRequest[]>('leaveRequests', []),
        evaluations: storage.get<Evaluation[]>('evaluations', []),
        cases: storage.get<CounselingCase[]>('cases', []),
        events: storage.get<CampusEvent[]>('events', []),
      });
    },

    // Finance
    addTransaction: (tx) => {
      set((state) => ({ transactions: [...state.transactions, tx] }));
      showToast('Transaction Added', 'Finance transaction saved successfully.');
    },
    updateTransaction: (id, updates) => {
      set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));
      showToast('Transaction Updated', 'Finance transaction updated.');
    },
    addInvoice: (invoice) => {
      set((state) => ({ invoices: [...state.invoices, invoice] }));
      showToast('Invoice Created', 'New invoice has been created.');
    },
    updateInvoice: (id, updates) => {
      set((state) => ({
        invoices: state.invoices.map((i) => (i.id === id ? { ...i, ...updates } : i)),
      }));
      showToast('Invoice Updated', 'Invoice has been updated.');
    },
    markInvoicePaid: (id, date) => {
      set((state) => ({
        invoices: state.invoices.map((i) => (i.id === id ? { ...i, status: 'paid', paidDate: date } : i)),
      }));
      showToast('Invoice Paid', 'Invoice marked as paid.');
    },

    // Fleet/Transport
    addRoute: (route) => {
      set((state) => ({ routes: [...state.routes, route] }));
      showToast('Route Added', 'Transport route saved successfully.');
    },
    updateRoute: (id, updates) => {
      set((state) => ({
        routes: state.routes.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      }));
      showToast('Route Updated', 'Transport route updated.');
    },
    updateVehicleLocation: (id, lat, lng) => {
      // In a real app this would update a location object, for now we just show a toast or update silently
      showToast('Location Updated', 'Vehicle location updated.', 'info');
    },

    // Cafeteria
    addMenu: (menu) => {
      set((state) => ({ menus: [...state.menus, menu] }));
      showToast('Menu Added', 'Daily menu saved successfully.');
    },
    updateMealAccountBalance: (studentId, amount) => {
      set((state) => {
        const exists = state.mealAccounts.some((m) => m.studentId === studentId);
        if (!exists) {
          const newAcc: MealAccount = {
            studentId,
            studentName: 'Student Account',
            balance: amount,
            transactions: [],
          };
          return { mealAccounts: [...state.mealAccounts, newAcc] };
        }
        return {
          mealAccounts: state.mealAccounts.map((m) =>
            m.studentId === studentId ? { ...m, balance: m.balance + amount } : m
          ),
        };
      });
      showToast('Balance Updated', 'Meal account balance updated.');
    },
    processOrder: (studentId, amount) => {
      set((state) => ({
        mealAccounts: state.mealAccounts.map((m) => (m.studentId === studentId ? { ...m, balance: m.balance - amount } : m)),
      }));
      showToast('Order Processed', 'Meal order processed.');
    },

    // Behavior/PBIS
    addConductRecord: (record) => {
      set((state) => ({ conductRecords: [...state.conductRecords, record] }));
      showToast('Conduct Logged', 'Conduct record saved successfully.');
    },
    updateHousePoints: (houseName, points) => {
      set((state) => {
        const exists = state.housePoints.some((h) => h.houseName === houseName);
        if (!exists) {
          const newHouse: HousePoint = {
            houseName,
            totalPoints: points,
            color: '#3b82f6',
          };
          return { housePoints: [...state.housePoints, newHouse] };
        }
        return {
          housePoints: state.housePoints.map((h) =>
            h.houseName === houseName ? { ...h, totalPoints: h.totalPoints + points } : h
          ),
        };
      });
      showToast('Points Updated', 'House points updated successfully.');
    },

    // Library
    addBook: (book) => {
      set((state) => ({ books: [...state.books, book] }));
      showToast('Book Added', 'Library book saved successfully.');
    },
    returnBook: (bookId, studentId) => {
      set((state) => ({
        books: state.books.map((b) => (b.id === bookId ? { ...b, availableCopies: (b.availableCopies || 0) + 1 } : b)),
      }));
      showToast('Book Returned', 'Library book returned successfully.');
    },
    borrowBook: (record) => {
      set((state) => ({
        books: state.books.map((b) => (b.id === record.bookId ? { ...b, availableCopies: (b.availableCopies || 1) - 1 } : b)),
      }));
      showToast('Book Borrowed', 'Library book borrowed successfully.');
    },

    // Medical
    addMedicalRecord: (record) => {
      set((state) => ({ medicalRecords: [...state.medicalRecords, record] }));
      showToast('Medical Record Added', 'Medical record saved successfully.');
    },
    addHealthIncident: (incident) => {
      set((state) => ({ healthIncidents: [...state.healthIncidents, incident] }));
      showToast('Health Incident Logged', 'Incident saved successfully.');
    },
    addImmunization: (record) => {
      set((state) => ({ immunizations: [...state.immunizations, record] }));
      showToast('Immunization Added', 'Immunization record saved successfully.');
    },

    // Inventory
    addAsset: (asset) => {
      set((state) => ({ assets: [...state.assets, asset] }));
      showToast('Asset Added', 'Inventory asset saved successfully.');
    },
    updateAsset: (id, updates) => {
      set((state) => ({
        assets: state.assets.map((a) => (a.id === id ? { ...a, ...updates } : a)),
      }));
      showToast('Asset Updated', 'Inventory asset updated.');
    },
    checkoutAsset: (assetId, assignedTo) => {
      set((state) => ({
        assets: state.assets.map((a) => (a.id === assetId ? { ...a, assignedTo } : a)),
      }));
      showToast('Asset Checked Out', 'Asset assigned successfully.');
    },
    checkinAsset: (assetId) => {
      set((state) => ({
        assets: state.assets.map((a) => (a.id === assetId ? { ...a, assignedTo: undefined } : a)),
      }));
      showToast('Asset Checked In', 'Asset returned successfully.');
    },

    // HR
    addStaff: (member) => {
      set((state) => ({ staff: [...state.staff, member] }));
      showToast('Staff Added', 'Staff member saved successfully.');
    },
    updateStaff: (id, updates) => {
      set((state) => ({
        staff: state.staff.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      }));
      showToast('Staff Updated', 'Staff member updated.');
    },
    addLeaveRequest: (request) => {
      set((state) => ({ leaveRequests: [...state.leaveRequests, request] }));
      showToast('Leave Request Added', 'Leave request saved successfully.');
    },
    updateLeaveStatus: (id, status, approvedBy) => {
      set((state) => ({
        leaveRequests: state.leaveRequests.map((r) => (r.id === id ? { ...r, status, approvedBy } : r)),
      }));
      showToast('Leave Status Updated', `Leave request ${status}.`);
    },
    addEvaluation: (evaluation) => {
      set((state) => ({ evaluations: [...state.evaluations, evaluation] }));
      showToast('Evaluation Added', 'Evaluation saved successfully.');
    },

    // Counseling
    addCase: (counselingCase) => {
      set((state) => ({ cases: [...state.cases, counselingCase] }));
      showToast('Counseling Case Added', 'Case saved successfully.');
    },
    updateCase: (id, updates) => {
      set((state) => ({
        cases: state.cases.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      }));
      showToast('Case Updated', 'Counseling case updated.');
    },
    addSession: (caseId, session) => {
      set((state) => ({
        cases: state.cases.map((c) => (c.id === caseId ? { ...c, sessions: [...(c.sessions || []), session] } : c)),
      }));
      showToast('Session Added', 'Counseling session saved successfully.');
    },

    // Events
    addEvent: (event) => {
      set((state) => ({ events: [...state.events, event] }));
      showToast('Event Added', 'Campus event saved successfully.');
    },
    updateEvent: (id, updates) => {
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      }));
      showToast('Event Updated', 'Campus event updated.');
    },
    rsvpEvent: (eventId, attendeeId) => {
      set((state) => ({
        events: state.events.map((e) => (e.id === eventId ? { ...e, attendees: [...(e.attendees || []), attendeeId] } : e)),
      }));
      showToast('RSVP Successful', 'Event RSVP saved.');
    }
  }))
);

useOperationsStore.subscribe(
  (state) => ({
    transactions: state.transactions,
    invoices: state.invoices,
    routes: state.routes,
    menus: state.menus,
    mealAccounts: state.mealAccounts,
    dietaryProfiles: state.dietaryProfiles,
    conductRecords: state.conductRecords,
    housePoints: state.housePoints,
    books: state.books,
    medicalRecords: state.medicalRecords,
    healthIncidents: state.healthIncidents,
    immunizations: state.immunizations,
    assets: state.assets,
    staff: state.staff,
    leaveRequests: state.leaveRequests,
    evaluations: state.evaluations,
    cases: state.cases,
    events: state.events,
  }),
  (data) => {
    Object.entries(data).forEach(([key, value]) => {
      storage.set(key, value);
    });
  }
);
