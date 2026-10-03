import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse, Product } from '@/lib/types';

export interface ProductQuery {
  search?: string;
  categoryID?: string;
  page?: number;
  limit?: number;
}

const query = (params?: ProductQuery) =>
  params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';

export const catalogApi = {
  getProducts: (params?: ProductQuery) =>
    apiClient.get<PaginatedResponse<Product>>(`/products${query(params)}`),
  getProduct: (id: string) => apiClient.get<Product>(`/products/${id}`),
  createProduct: (formData: FormData) => apiClient.upload<Product>('/products', formData),
  updateProduct: (id: string, formData: FormData) =>
    apiClient.upload<Product>(`/products/${id}`, formData, 'PUT'),
  deleteProduct: (id: string) => apiClient.delete<void>(`/products/${id}`),
};
