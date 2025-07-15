import React from 'react';
import './filterSelect.css';

interface FilterSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  disabled?: boolean;
  'data-testid'?: string;
  'data-loading'?: boolean;
  'aria-disabled'?: boolean;
}

export const FilterSelect = ({
  value,
  onChange,
  options,
  disabled = false,
  'data-testid': dataTestId = 'filter-genre',
  'data-loading': dataLoading,
  'aria-disabled': ariaDisabled,
}: FilterSelectProps) => {
  return (
    <select
      className="filter-select"
      value={value}
      onChange={onChange}
      disabled={disabled}
      data-testid={dataTestId}
      data-loading={dataLoading}
      aria-disabled={ariaDisabled}
    >
      <option value="">All genres</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
