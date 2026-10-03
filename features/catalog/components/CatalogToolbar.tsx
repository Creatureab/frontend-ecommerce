'use client';

import type { Category } from '@/lib/types';
import { Input } from '@/components/ui/Input';

interface CatalogToolbarProps {
  search: string;
  selectedCategory: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function CatalogToolbar({
  search,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange,
}: CatalogToolbarProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md"
        />
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
