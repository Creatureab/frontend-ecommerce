'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAdmin } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [params.id]);

  const fetchOrder = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.getOrder(id);
      setOrder(response);
    } catch (error: any) {
      setMessage(error.message || 'Failed to fetch order');
      router.push('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !confirm('Are you sure you want to cancel this order?')) return;

    try {
      await api.cancelOrder(order.id);
      setMessage('Order cancelled successfully');
      fetchOrder(order.id);
    } catch (error: any) {
      setMessage(error.message || 'Failed to cancel order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Order not found</div>
      </div>
    );
  }

  const canCancel = (order.status === 'pending' || order.status === 'processing') && 
                    !isAdmin && 
                    order.user.id === user?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.push('/profile')}>
              ← Back to Profile
            </Button>
            <h1 className="text-2xl font-bold">Order Details</h1>
          </div>
        </div>
      </header>

      {/* Order Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-4 p-4 bg-blue-50 text-blue-800 rounded">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{order.id.slice(-6)}</h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {order.user.userName}</p>
                    <p><span className="font-medium">Email:</span> {order.user.email}</p>
                    <p><span className="font-medium">Phone:</span> {order.user.phoneNumber}</p>
                    <p><span className="font-medium">Address:</span></p>
                    <p className="pl-4">{order.user.addressLine1}</p>
                    {order.user.addressLine2 && <p className="pl-4">{order.user.addressLine2}</p>}
                    <p className="pl-4">{order.user.city}, {order.user.postalCode}</p>
                  </div>
                </div>

                {canCancel && (
                  <Button variant="destructive" onClick={handleCancelOrder}>
                    Cancel Order
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.product.id} className="flex gap-4 border-b pb-4">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No img</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product.title}</h4>
                        <p className="text-sm text-gray-600">{item.product.category?.name ?? "Uncategorized"}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Order Total</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
