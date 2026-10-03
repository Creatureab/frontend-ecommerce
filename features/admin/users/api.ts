import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse, User } from '@/lib/types';

export interface UserQuery {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export type UserPayload = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role'>> & {
  password?: string;
  role?: string;
};

const query = (params?: UserQuery) =>
  params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';

export const adminUsersApi = {
  getUsers: (params?: UserQuery) =>
    apiClient.get<PaginatedResponse<User>>(`/admin/users${query(params)}`),
  getUser: (id: string) => apiClient.get<User>(`/admin/users/${id}`),
  createUser: (payload: UserPayload) => apiClient.post<User>('/admin/users', payload),
  updateUser: (id: string, payload: UserPayload) =>
    apiClient.patch<User>(`/admin/users/${id}`, payload),
  changeUserRole: (id: string, role: string) =>
    apiClient.patch<User>(`/admin/users/${id}/change-role`, { role }),
  deleteUser: (id: string) => apiClient.delete<void>(`/admin/users/${id}`),
  getUserStats: () => apiClient.get('/admin/users/stats/overview'),
};
