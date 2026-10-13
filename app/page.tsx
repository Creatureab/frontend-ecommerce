'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Product, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Carousel } from '@/components/carousel';
import { ProductList } from '@/components/product-list';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    const params: { page: number; limit: number; search?: string; categoryID?: string } = {
      page,
      limit: 12,
    };
    if (search) params.search = search;
    if (selectedCategory) params.categoryID = selectedCategory;

    api.getProducts(params)
      .then((response) => {
        if (active) {
          setProducts(response.data || []);
        }
      })
      .catch((error) => {
        if (active) {
          console.error('Failed to fetch products:', error);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [page, search, selectedCategory]);

  useEffect(() => {
    let active = true;
    api.getCategories()
      .then((response) => {
        if (active) {
          setCategories(response);
        }
      })
      .catch((error) => {
        if (active) {
          console.error('Failed to fetch categories:', error);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-rose-50/30">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-800">
            Cake Point · Kolhapur
          </p>
          <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-semibold text-rose-950 sm:text-4xl">
            Cakes for every celebration
          </h1>
          <p className="mt-2 max-w-2xl leading-6 text-stone-600">
            Freshly baked favourites and custom creations, made for sharing.
          </p>
        </div>

        {!loading && !search && !selectedCategory && products.length > 0 && (
          <div className="mb-8">
            <Carousel products={products.slice(0, 3)} />
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="search"
              aria-label="Search cakes"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setLoading(true);
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-md bg-white"
            />
            <select
              aria-label="Filter by category"
              value={selectedCategory}
              onChange={(e) => {
                setLoading(true);
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="min-h-11 rounded-md border border-input bg-white px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

        <ProductList products={products} loading={loading} />

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => {
              setLoading(true);
              setPage((p) => Math.max(1, p - 1));
            }}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2">Page {page}</span>
          <Button
            variant="outline"
            onClick={() => {
              setLoading(true);
              setPage((p) => p + 1);
            }}
            disabled={products.length < 12}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
}
