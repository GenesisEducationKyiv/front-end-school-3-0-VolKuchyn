import React from 'react';
import './searchInput.css';

export interface SearchInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  'data-testid'?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  disabled = false,
  'data-testid': dataTestId = 'search-input',
}: SearchInputProps) => {
  return (
    <input
      type="text"
      className="header-search"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      data-testid={dataTestId}
    />
  );
};