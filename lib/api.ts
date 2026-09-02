import { apiClient } from './api-client';
import { Product, Category, Order, User, PaginatedResponse } from './types';

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  register: (userData: any) =>
    apiClient.post('/auth/register', userData),
  
  getProfile: () =>
    apiClient.get('/auth/profile'),
  
  updateProfile: (userData: any) =>
    apiClient.put('/auth/profile', userData),

  // Products
  getProducts: (params?: { search?: string; categoryID?: string; page?: number; limit?: number }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiClient.get<PaginatedResponse<Product>>(`/products${queryString}`);
  },
  
  getProduct: (id: string) =>
    apiClient.get<Product>(`/products/${id}`),
  
  createProduct: (formData: FormData) =>
    apiClient.upload<Product>('/products', formData),
  
  updateProduct: (id: string, formData: FormData) =>
    apiClient.upload<Product>(`/products/${id}`, formData),
  
  deleteProduct: (id: string) =>
    apiClient.delete(`/products/${id}`),

  // Categories
  getCategories: () =>
    apiClient.get<Category[]>('/categories'),
  
  createCategory: (name: string) =>
    apiClient.post<Category>('/categories', { name }),
  
  updateCategory: (id: string, name: string) =>
    apiClient.put<Category>(`/categories/${id}`, { name }),
  
  deleteCategory: (id: string) =>
    apiClient.delete(`/categories/${id}`),

  // Orders
  getOrders: (params?: { search?: string; page?: number; limit?: number }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiClient.get<PaginatedResponse<Order>>(`/orders${queryString}`);
  },
  
  getOrder: (id: string) =>
    apiClient.get<Order>(`/orders/${id}`),
  
  createOrder: (orderItems: { product: string; quantity: number }[]) =>
    apiClient.post<Order>('/orders', { orderItems }),
  
  cancelOrder: (id: string) =>
    apiClient.patch<Order>(`/orders/${id}/cancel-order`, {}),
  
  updateOrderStatus: (id: string, status: string) =>
    apiClient.patch<Order>(`/orders/${id}/change-status`, { status }),
  
  deleteOrder: (id: string) =>
    apiClient.delete(`/orders/${id}`),

  // Admin Users
  getUsers: (params?: { search?: string; role?: string; page?: number; limit?: number }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiClient.get<PaginatedResponse<User>>(`/admin/users${queryString}`);
  },
  
  getUser: (id: string) =>
    apiClient.get<User>(`/admin/users/${id}`),
  
  createUser: (userData: any) =>
    apiClient.post<User>('/admin/users', userData),
  
  updateUser: (id: string, userData: any) =>
    apiClient.patch<User>(`/admin/users/${id}`, userData),
  
  changeUserRole: (id: string, role: string) =>
    apiClient.patch<User>(`/admin/users/${id}/change-role`, { role }),
  
  deleteUser: (id: string) =>
    apiClient.delete(`/admin/users/${id}`),
  
  getUserStats: () =>
    apiClient.get('/admin/users/stats/overview'),
};
