import { apiClient } from '@/lib/api-client';
import type { Category } from '@/lib/types';

export const categoriesApi = {
  getCategories: () => apiClient.get<Category[]>('/categories'),
  createCategory: (name: string) => apiClient.post<Category>('/categories', { name }),
  updateCategory: (id: string, name: string) =>
    apiClient.put<Category>(`/categories/${id}`, { name }),
  deleteCategory: (id: string) => apiClient.delete<void>(`/categories/${id}`),
};
