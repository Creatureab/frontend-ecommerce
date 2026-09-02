'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <Button onClick={() => router.push('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
            >
              Back to Store
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome, Admin</h2>
          <p className="text-gray-600 mt-2">Manage your e-commerce store from here.</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/admin/products')}
          >
            <CardHeader>
              <CardTitle className="text-lg">Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage products, inventory, and pricing</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/admin/categories')}
          >
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Organize product categories</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/admin/orders')}
          >
            <CardHeader>
              <CardTitle className="text-lg">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View and manage customer orders</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/admin/users')}
          >
            <CardHeader>
              <CardTitle className="text-lg">Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage user accounts and permissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push('/admin/products')}
              className="flex-1"
            >
              Add New Product
            </Button>
            <Button
              onClick={() => router.push('/admin/categories')}
              variant="outline"
              className="flex-1"
            >
              Add Category
            </Button>
            <Button
              onClick={() => router.push('/admin/orders')}
              variant="outline"
              className="flex-1"
            >
              View Recent Orders
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}