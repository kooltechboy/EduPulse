export type MenuCategory = 'breakfast' | 'lunch' | 'snack' | 'beverage';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  calories: number;
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isAvailable: boolean;
  image?: string;
}

export type MealSlotType = 'breakfast' | 'lunch' | 'snack';

export interface MealSlot {
  type: MealSlotType;
  items: MenuItem[];
  servingTime: string;
}

export interface DailyMenu {
  id: string;
  date: string;
  meals: MealSlot[];
  specialNotes?: string;
}

export type MealTransactionStatus = 'completed' | 'refunded';
export type MealPaymentMethod = 'cash' | 'card' | 'account';

export interface MealTransaction {
  id: string;
  studentId: string;
  date: string;
  items: string[];
  total: number;
  paymentMethod: MealPaymentMethod;
  status: MealTransactionStatus;
}

export interface MealAccount {
  studentId: string;
  studentName: string;
  balance: number;
  transactions: MealTransaction[];
}

export interface DietaryProfile {
  studentId: string;
  restrictions: string[];
  allergies: string[];
  preferences: string[];
  parentApproved: boolean;
  notes?: string;
}
