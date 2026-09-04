export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  userName: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  title: string;
  category: Category | null;
  price: number;
  description: string;
  images: string[];
  countInStock: number;
  rating: {
    average: number;
    count: number;
  };
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderItems: OrderItem[];
  user: User;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
  token: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
