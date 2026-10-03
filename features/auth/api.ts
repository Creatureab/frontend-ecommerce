import { apiClient } from '@/lib/api-client';
import type { ApiResponse, AuthResponse, LoginResponse, User } from '@/lib/types';

export interface RegisterPayload {
  email: string;
  password: string;
  userName: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
}

export type ProfileUpdatePayload = Partial<Omit<RegisterPayload, 'password'>> & {
  password?: string;
};

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>('/auth/login', { email, password }),
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>('/auth/register', payload),
  getProfile: () => apiClient.get<ApiResponse<User>>('/auth/profile'),
  updateProfile: (payload: ProfileUpdatePayload) =>
    apiClient.put<ApiResponse<User>>('/auth/profile', payload),
};
