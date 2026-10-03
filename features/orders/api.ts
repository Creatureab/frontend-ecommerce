import { apiClient } from '@/lib/api-client';
import type { Order, OrderCreationResponse, PaginatedResponse } from '@/lib/types';

export interface OrderQuery {
  search?: string;
  page?: number;
  limit?: number;
}

const query = (params?: OrderQuery) =>
  params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';

export const ordersApi = {
  getOrders: (params?: OrderQuery) =>
    apiClient.get<PaginatedResponse<Order>>(`/orders${query(params)}`),
  getOrder: (id: string) => apiClient.get<Order>(`/orders/${id}`),
  createOrder: (orderItems: { product: string; quantity: number }[]) =>
    apiClient.post<OrderCreationResponse>('/orders', { orderItems }),
  cancelOrder: (id: string) => apiClient.patch<Order>(`/orders/${id}/cancel-order`, {}),
  updateOrderStatus: (id: string, status: string) =>
    apiClient.patch<Order>(`/orders/${id}/change-status`, { status }),
  deleteOrder: (id: string) => apiClient.delete<void>(`/orders/${id}`),
};
