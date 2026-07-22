import { describe, it, expect, beforeEach } from 'vitest';
import { useOperationsStore } from '../operationsStore';
import { storage } from '@/data/storageAdapter';

describe('operationsStore', () => {
  beforeEach(() => {
    storage.clear();
    useOperationsStore.getState().loadData();
  });

  it('should load operational datasets', () => {
    const state = useOperationsStore.getState();
    expect(state.transactions).toBeDefined();
    expect(state.invoices).toBeDefined();
    expect(state.routes).toBeDefined();
    expect(state.books).toBeDefined();
  });

  it('should add finance transaction correctly', () => {
    const count = useOperationsStore.getState().transactions.length;
    useOperationsStore.getState().addTransaction({
      id: 'tx_999',
      type: 'income',
      category: 'Tuition',
      amount: 1500,
      date: '2026-07-22',
      description: 'Tuition payment test',
      reference: 'REF-999',
      paymentMethod: 'card',
      createdBy: 'Finance Admin',
      status: 'completed',
    });

    expect(useOperationsStore.getState().transactions.length).toBe(count + 1);
  });

  it('should update house points in behavior matrix', () => {
    useOperationsStore.getState().updateHousePoints('Aether', 50);
    const house = useOperationsStore.getState().housePoints.find((h) => h.houseName === 'Aether');
    expect(house).toBeDefined();
    expect(house?.totalPoints).toBeGreaterThan(0);
  });

  it('should process cafeteria meal account balance topup', () => {
    useOperationsStore.getState().updateMealAccountBalance('usr_student_001', 25.5);
    const account = useOperationsStore.getState().mealAccounts.find((a) => a.studentId === 'usr_student_001');
    expect(account).toBeDefined();
    expect(account?.balance).toBeGreaterThan(0);
  });
});
