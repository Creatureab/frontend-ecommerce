'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!isAdmin) {
      router.push('/');
      return;
    }
    fetchCategories();
  }, [isAdmin, authLoading, router]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      await api.createCategory(categoryName);
      setMessage('Category created successfully');
      setShowCreateModal(false);
      setCategoryName('');
      fetchCategories();
    } catch (error: any) {
      setMessage(error.message || 'Failed to create category');
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    try {
      await api.updateCategory(selectedCategory.id, categoryName);
      setMessage('Category updated successfully');
      setShowEditModal(false);
      setCategoryName('');
      setSelectedCategory(null);
      fetchCategories();
    } catch (error: any) {
      setMessage(error.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await api.deleteCategory(id);
      setMessage('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      setMessage(error.message || 'Failed to delete category');
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setShowEditModal(true);
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
            <h1 className="text-2xl font-bold">Admin - Categories Management</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/admin/products')}>
                Products
              </Button>
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
          <h2 className="text-xl font-semibold">Categories ({categories.length})</h2>
          <Button onClick={() => setShowCreateModal(true)}>Add New Category</Button>
        </div>

        {message && (
          <div className="mb-4 p-4 bg-blue-50 text-blue-800 rounded">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No categories found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">{category.name}</h3>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Created: {new Date(category.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditModal(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Category Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New Category</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      value={categoryName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategoryName(e.target.value)}
                      required
                      minLength={5}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">Create Category</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateModal(false);
                        setCategoryName('');
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

        {/* Edit Category Modal */}
        {showEditModal && selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Edit Category</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateCategory} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Category Name</Label>
                    <Input
                      id="edit-name"
                      value={categoryName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategoryName(e.target.value)}
                      required
                      minLength={5}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">Update Category</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowEditModal(false);
                        setCategoryName('');
                        setSelectedCategory(null);
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
