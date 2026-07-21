export type TransactionType = 'income' | 'expense' | 'refund';
export type PaymentMethod = 'cash' | 'card' | 'bank-transfer' | 'online';
export type TransactionStatus = 'completed' | 'pending' | 'voided';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  date: string;
  reference: string;
  paymentMethod: PaymentMethod;
  createdBy: string;
  status: TransactionStatus;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  paidAmount?: number;
}

export type FeeFrequency = 'monthly' | 'quarterly' | 'semester' | 'annual' | 'one-time';

export interface FeeItem {
  name: string;
  amount: number;
  frequency: FeeFrequency;
}

export interface FeeStructure {
  id: string;
  name: string;
  tier: string;
  gradeLevel: string;
  items: FeeItem[];
  academicYear: string;
  total: number;
}
