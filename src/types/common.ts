import type { ReactNode } from 'react';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export type FilterOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in';

export interface FilterConfig {
  field: string;
  operator: FilterOperator;
  value: string | number | string[];
}

export interface DateRange {
  start: string;
  end: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}
