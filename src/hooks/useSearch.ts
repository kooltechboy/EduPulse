import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export function useSearch<T>(items: T[], searchFields: (keyof T)[], debounceMs: number = 300) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) return items;
    const lowerQuery = debouncedQuery.toLowerCase();

    return items.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (value == null) return false;
        return String(value).toLowerCase().includes(lowerQuery);
      });
    });
  }, [items, searchFields, debouncedQuery]);

  return {
    query,
    setQuery,
    filteredItems,
  };
}
