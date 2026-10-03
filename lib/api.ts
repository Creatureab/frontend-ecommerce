// Compatibility facade for route pages during the incremental feature migration.
// New feature code imports its own API module directly.
import { adminUsersApi } from '@/features/admin/users/api';
import { authApi } from '@/features/auth/api';
import { categoriesApi } from '@/features/categories/api';
import { catalogApi } from '@/features/catalog/api';
import { ordersApi } from '@/features/orders/api';

export const api = {
  ...authApi,
  ...catalogApi,
  ...categoriesApi,
  ...ordersApi,
  ...adminUsersApi,
};
