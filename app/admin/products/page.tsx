'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import { formatCurrency, getCategoryName } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminProductsPage() {
  const router = useRouter();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    countInStock: '',
    imageUrls: '',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getImageUrls = () =>
    formData.imageUrls.split(/\r?\n/).map((url) => url.trim()).filter(Boolean);

  const areValidImageUrls = (urls: string[]) =>
    urls.every((url) => {
      try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
      } catch {
        return false;
      }
    });

  useEffect(() => {
    if (authLoading) return;

    if (!isAdmin) {
      router.push('/');
      return;
    }
    fetchProducts();
    fetchCategories();
  }, [isAdmin, authLoading, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.getProducts({ limit: 100 });
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

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMessage('');

    const imageUrls = getImageUrls();
    if (imageUrls.length === 0) {
      setMessage('Please provide at least one product image URL');
      setIsSubmitting(false);
      return;
    }
    if (!areValidImageUrls(imageUrls)) {
      setMessage('Each image must be a valid HTTP or HTTPS URL');
      setIsSubmitting(false);
      return;
    }

    if (formData.description.length > 100) {
      setMessage('Description must be 100 characters or less');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.createProduct({
        title: formData.title,
        category: formData.category,
        price: Number(formData.price),
        description: formData.description,
        countInStock: Number(formData.countInStock),
        images: imageUrls,
      });
      console.log('Product created successfully:', response);
      setMessage('Product created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error('Failed to create product:', error);
      setMessage(error.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const imageUrls = getImageUrls();
      if (imageUrls.length === 0 || !areValidImageUrls(imageUrls)) {
        setMessage('Provide at least one valid HTTP or HTTPS image URL');
        setIsSubmitting(false);
        return;
      }

      await api.updateProduct(selectedProduct.id, {
        title: formData.title,
        category: formData.category,
        price: Number(formData.price),
        description: formData.description,
        countInStock: Number(formData.countInStock),
        images: imageUrls,
      });
      setMessage('Product updated successfully');
      setShowEditModal(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      setMessage(error.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.deleteProduct(id);
      setMessage('Product deleted successfully');
      fetchProducts();
    } catch (error: any) {
      setMessage(error.message || 'Failed to delete product');
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      category: product.category?.id ?? '',
      price: product.price.toString(),
      description: product.description,
      countInStock: product.countInStock.toString(),
      imageUrls: product.images.join('\n'),
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      price: '',
      description: '',
      countInStock: '',
      imageUrls: '',
    });
    setSelectedProduct(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.push('/')}>
              ← Back to Store
            </Button>
            <h1 className="text-2xl font-bold">Admin - Products Management</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/admin/orders')}>
                Orders
              </Button>
              <Button variant="outline" onClick={() => router.push('/admin/users')}>
                Users
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Products ({products.length})</h2>
          <Button onClick={() => setShowCreateModal(true)}>Add New Product</Button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded ${
            message.toLowerCase().includes('success')
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
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
                    <h3 className="font-semibold mb-2 line-clamp-1">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{getCategoryName(product.category)}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">{formatCurrency(product.price)}</span>
                      <span className="text-sm text-gray-500">Stock: {product.countInStock}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Product Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Create New Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="countInStock">Stock Count</Label>
                    <Input
                      id="countInStock"
                      type="number"
                      value={formData.countInStock}
                      onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                      required
                      minLength={5}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500">{formData.description.length}/100 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="images">Product Image URLs</Label>
                    <textarea
                      id="images"
                      value={formData.imageUrls}
                      onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                      placeholder="https://example.com/product-image.jpg"
                      required
                    />
                    <p className="text-xs text-gray-500">Enter one HTTP or HTTPS image URL per line.</p>
                    {getImageUrls().length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {getImageUrls().map((url, idx) => (
                          <img
                            key={`${url}-${idx}`}
                            src={url}
                            alt="Product preview"
                            className="w-full h-32 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Product'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Edit Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Product Title</Label>
                    <Input
                      id="edit-title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <select
                      id="edit-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Price</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-countInStock">Stock Count</Label>
                    <Input
                      id="edit-countInStock"
                      type="number"
                      value={formData.countInStock}
                      onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <textarea
                      id="edit-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-images">Product Image URLs</Label>
                    <textarea
                      id="edit-images"
                      value={formData.imageUrls}
                      onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                      required
                    />
                    <p className="text-xs text-gray-500">Enter one HTTP or HTTPS image URL per line. Remove a line to remove that image.</p>
                    {getImageUrls().length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {getImageUrls().map((url, idx) => (
                          <img
                            key={`${url}-${idx}`}
                            src={url}
                            alt="Product preview"
                            className="w-full h-32 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Updating...' : 'Update Product'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
