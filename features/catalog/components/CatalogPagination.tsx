'use client';

import { Button } from '@/components/ui/button';

interface CatalogPaginationProps {
  page: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export function CatalogPagination({ page, hasNextPage, onPageChange }: CatalogPaginationProps) {
  return (
    <div className="flex justify-center gap-2 mt-8">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Previous
      </Button>
      <span className="px-4 py-2">Page {page}</span>
      <Button variant="outline" onClick={() => onPageChange(page + 1)} disabled={!hasNextPage}>
        Next
      </Button>
    </div>
  );
}
