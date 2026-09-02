'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [message, setMessage] = useState('');

  const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    fetchOrders();
  }, [isAdmin, router, search, page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      
      const response = await api.getOrders(params);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await api.updateOrderStatus(selectedOrder.id, newStatus);
      setMessage('Order status updated successfully');
      setShowStatusModal(false);
      setSelectedOrder(null);
      setNewStatus('');
      fetchOrders();
    } catch (error: any) {
      setMessage(error.message || 'Failed to update order status');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      await api.deleteOrder(id);
      setMessage('Order deleted successfully');
      fetchOrders();
    } catch (error: any) {
      setMessage(error.message || 'Failed to delete order');
    }
  };

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
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
            <h1 className="text-2xl font-bold">Admin - Orders Management</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/admin/products')}>
                Products
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
          <h2 className="text-xl font-semibold">Orders ({orders.length})</h2>
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
        </div>

        {message && (
          <div className="mb-4 p-4 bg-blue-50 text-blue-800 rounded">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No orders found</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order.id.slice(-6)}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Customer: {order.user.userName} ({order.user.email})
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.orderItems.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          {item.product.images && item.product.images.length > 0 ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No img</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{item.product.title}</p>
                            <p className="text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t pt-4">
                    <div>
                      <span className="font-semibold text-lg">
                        Total: ${order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openStatusModal(order)}
                      >
                        Update Status
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id)}
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

        {/* Status Update Modal */}
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Update Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Order #{selectedOrder.id.slice(-6)} - {selectedOrder.user.userName}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Current Status: {selectedOrder.status.toUpperCase()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleUpdateStatus}>Update Status</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowStatusModal(false);
                        setSelectedOrder(null);
                        setNewStatus('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
