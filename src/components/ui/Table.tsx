import React, { useState, forwardRef } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

// ── Generic Data Table ────────────────────────────────────────────────────

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  mobileHidden?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data available',
  className = '',
}: TableProps<T>) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = String(a[sortKey] ?? '');
    const bVal = String(b[sortKey] ?? '');
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const classNames = ['ep-table-container', className].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <table className="ep-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.mobileHidden ? 'ep-hidden-mobile' : ''}
                onClick={() => col.sortable && handleSort(col.key)}
                style={{ cursor: col.sortable ? 'pointer' : 'default' }}
              >
                <div className="ep-table__th-content">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span className="ep-table__sort-icon">
                      {sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="ep-table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'ep-table__row--clickable' : ''}
              >
                {columns.map((col) => (
                  <td key={col.key} className={col.mobileHidden ? 'ep-hidden-mobile' : ''}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ── Primitive Table Sub-Components ────────────────────────────────────────
// These allow modules to compose raw HTML tables with ep- styling.

export const TableRoot = forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className = '', ...props }, ref) => (
    <div className="ep-table-container">
      <table ref={ref} className={`ep-table ${className}`.trim()} {...props} />
    </div>
  )
);
TableRoot.displayName = 'TableRoot';

export const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <thead ref={ref} className={className} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <tbody ref={ref} className={className} {...props} />
  )
);
TableBody.displayName = 'TableBody';

export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className = '', ...props }, ref) => (
    <tr ref={ref} className={`ep-table__row ${className}`.trim()} {...props} />
  )
);
TableRow.displayName = 'TableRow';

export const TableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => (
    <th ref={ref} className={`ep-table__th ${className}`.trim()} {...props} />
  )
);
TableHead.displayName = 'TableHead';

export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => (
    <td ref={ref} className={`ep-table__td ${className}`.trim()} {...props} />
  )
);
TableCell.displayName = 'TableCell';
