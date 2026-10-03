'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { catalogApi } from '@/features/catalog/api';
import { categoriesApi } from '@/features/categories/api';
import type { Product, Category } from '@/lib/types';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { CatalogToolbar } from './CatalogToolbar';
import { ProductGrid } from './ProductGrid';
import { CatalogPagination } from './CatalogPagination';

const PAGE_SIZE = 12;

export function CatalogPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: { page: number; limit: number; search?: string; categoryID?: string } = {
        page,
        limit: PAGE_SIZE,
      };
      if (search) params.search = search;
      if (selectedCategory) params.categoryID = selectedCategory;

      const response = await catalogApi.getProducts(params);
      setProducts(response.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    categoriesApi
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPage(1);
  };

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    addToCart(product, 1);
    alert('Product added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CatalogToolbar
          search={search}
          selectedCategory={selectedCategory}
          categories={categories}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
        />
        <ProductGrid products={products} loading={loading} onAddToCart={handleAddToCart} />
        <CatalogPagination
          page={page}
          hasNextPage={products.length >= PAGE_SIZE}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}
