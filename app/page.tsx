'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search, selectedCategory, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 12 };
      if (search) params.search = search;
      if (selectedCategory) params.categoryID = selectedCategory;
      
      const response = await api.getProducts(params);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">E-Commerce Store</h1>
            <div className="flex gap-4 items-center">
              <Button
                variant="outline"
                onClick={() => router.push('/cart')}
              >
                Cart
              </Button>
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      onClick={() => router.push('/admin')}
                    >
                      Admin Dashboard
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => router.push('/profile')}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => logout()}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => router.push('/register')}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-md"
            />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
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

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">No products found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Stock: {product.countInStock}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600">
                        {product.rating.average.toFixed(1)} ({product.rating.count})
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.countInStock === 0}
                    >
                      {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2">Page {page}</span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={products.length < 12}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
}
