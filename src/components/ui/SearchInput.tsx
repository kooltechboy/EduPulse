import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './Input';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  delay?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  delay = 300,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(val);
    }, delay);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <div className={`ep-search-input ${className}`}>
      <Input
        type="search"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        icon={<Search size={18} />}
      />
      {localValue && (
        <button
          type="button"
          className="ep-search-input__clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
