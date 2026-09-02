'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/Card';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.getProduct(id);
      setProduct(response);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (product) {
      addToCart(product, quantity);
      alert(`${quantity} item(s) added to cart!`);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, product?.countInStock || 1)));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.push('/')}>
              ← Back to Products
            </Button>
            <Button variant="outline" onClick={() => router.push('/cart')}>
              Cart
            </Button>
          </div>
        </div>
      </header>

      {/* Product Details */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <Card>
              <CardContent className="p-0">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.title}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </CardContent>
            </Card>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 object-cover border-2 rounded ${
                      currentImageIndex === index ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-lg text-gray-600">{product.category.name}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">
                ({product.countInStock} in stock)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < Math.floor(product.rating.average) ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.countInStock}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
              >
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => {
                  if (isAuthenticated) {
                    addToCart(product, quantity);
                    router.push('/checkout');
                  } else {
                    router.push('/login');
                  }
                }}
                disabled={product.countInStock === 0}
              >
                Buy Now
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              <p>Views: {product.views}</p>
              <p>Added: {new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
