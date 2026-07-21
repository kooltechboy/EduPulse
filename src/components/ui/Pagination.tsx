import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  className = '',
}) => {
  const classNames = ['ep-pagination', className].filter(Boolean).join(' ');

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const getRangeInfo = () => {
    if (totalItems !== undefined) {
      const start = (currentPage - 1) * itemsPerPage + 1;
      const end = Math.min(currentPage * itemsPerPage, totalItems);
      return `Showing ${start}-${end} of ${totalItems}`;
    }
    return `Page ${currentPage} of ${totalPages}`;
  };

  return (
    <div className={classNames}>
      <div className="ep-pagination__info">{getRangeInfo()}</div>
      <div className="ep-pagination__controls">
        <Button
          variant="ghost"
          size="sm"
          icon={<ChevronLeft size={16} />}
          onClick={handlePrev}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        />
        <span className="ep-pagination__current">{currentPage}</span>
        <Button
          variant="ghost"
          size="sm"
          icon={<ChevronRight size={16} />}
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        />
      </div>
    </div>
  );
};
