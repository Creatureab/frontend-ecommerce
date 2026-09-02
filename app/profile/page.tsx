'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { User, Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    city: '',
    postalCode: '',
    addressLine1: '',
    addressLine2: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setEditForm({
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        city: user.city,
        postalCode: user.postalCode,
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2,
      });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      await api.updateProfile(editForm);
      setMessage('Profile updated successfully');
      setIsEditing(false);
      // Refresh user data
      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await api.cancelOrder(orderId);
      setMessage('Order cancelled successfully');
      fetchOrders();
    } catch (error: any) {
      setMessage(error.message || 'Failed to cancel order');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
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
            <h1 className="text-2xl font-bold">My Profile</h1>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Profile Information</CardTitle>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="userName">Full Name</Label>
                      <Input
                        id="userName"
                        value={editForm.userName}
                        onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={editForm.phoneNumber}
                        onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input
                        id="addressLine1"
                        value={editForm.addressLine1}
                        onChange={(e) => setEditForm({ ...editForm, addressLine1: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressLine2">Address Line 2</Label>
                      <Input
                        id="addressLine2"
                        value={editForm.addressLine2}
                        onChange={(e) => setEditForm({ ...editForm, addressLine2: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={editForm.city}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={editForm.postalCode}
                          onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label>Full Name</Label>
                      <p className="text-gray-900">{user.userName}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <p className="text-gray-900">{user.phoneNumber}</p>
                    </div>
                    <div>
                      <Label>Address</Label>
                      <p className="text-gray-900">
                        {user.addressLine1}
                        {user.addressLine2 && `, ${user.addressLine2}`}
                      </p>
                      <p className="text-gray-900">
                        {user.city}, {user.postalCode}
                      </p>
                    </div>
                    <div>
                      <Label>Role</Label>
                      <p className="text-gray-900 capitalize">{user.role}</p>
                    </div>
                    <div>
                      <Label>Member Since</Label>
                      <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No orders yet</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">Order #{order.id.slice(-6)}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="space-y-2 mb-3">
                          {order.orderItems.map((item) => (
                            <div key={item.product.id} className="flex justify-between text-sm">
                              <span>{item.product.title} x{item.quantity}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total: ${order.totalPrice.toFixed(2)}</span>
                          {order.status === 'pending' || order.status === 'processing' ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Cancel Order
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/orders/${order.id}`)}
                            >
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {message && (
          <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded">
            {message}
          </div>
        )}
      </main>
    </div>
  );
}
