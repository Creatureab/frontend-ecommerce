import { AdminGate } from '@/features/auth/components/AdminGate';

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return <AdminGate>{children}</AdminGate>;
}
