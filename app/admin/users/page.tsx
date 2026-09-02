'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminUsersPage() {
  const router = useRouter();
  const { isAdmin, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userName: '',
    city: '',
    postalCode: '',
    addressLine1: '',
    addressLine2: '',
    phoneNumber: '',
    role: 'user',
  });
  const [newRole, setNewRole] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    fetchUsers();
  }, [isAdmin, router, search, roleFilter, page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      
      const response = await api.getUsers(params);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      await api.createUser(formData);
      setMessage('User created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      setMessage(error.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await api.updateUser(selectedUser.id, formData);
      setMessage('User updated successfully');
      setShowEditModal(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      setMessage(error.message || 'Failed to update user');
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await api.changeUserRole(selectedUser.id, newRole);
      setMessage('User role updated successfully');
      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole('');
      fetchUsers();
    } catch (error: any) {
      setMessage(error.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.deleteUser(id);
      setMessage('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      setMessage(error.message || 'Failed to delete user');
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: '',
      userName: user.userName,
      city: user.city,
      postalCode: user.postalCode,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });
    setShowEditModal(true);
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      userName: '',
      city: '',
      postalCode: '',
      addressLine1: '',
      addressLine2: '',
      phoneNumber: '',
      role: 'user',
    });
    setSelectedUser(null);
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
            <h1 className="text-2xl font-bold">Admin - Users Management</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/admin/products')}>
                Products
              </Button>
              <Button variant="outline" onClick={() => router.push('/admin/orders')}>
                Orders
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Users ({users.length})</h2>
          <Button onClick={() => setShowCreateModal(true)}>Add New User</Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        {message && (
          <div className="mb-4 p-4 bg-blue-50 text-blue-800 rounded">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No users found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{user.userName}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-600">{user.phoneNumber}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>{user.addressLine1}</p>
                    {user.addressLine2 && <p>{user.addressLine2}</p>}
                    <p>
                      {user.city}, {user.postalCode}
                    </p>
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditModal(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRoleModal(user)}
                    >
                      Role
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.id === currentUser?.id}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Create New User</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userName">Full Name</Label>
                    <Input
                      id="userName"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1</Label>
                    <Input
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">Create User</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Edit User</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-password">New Password (optional)</Label>
                      <Input
                        id="edit-password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-userName">Full Name</Label>
                    <Input
                      id="edit-userName"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-phoneNumber">Phone Number</Label>
                    <Input
                      id="edit-phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-addressLine1">Address Line 1</Label>
                    <Input
                      id="edit-addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-addressLine2">Address Line 2</Label>
                    <Input
                      id="edit-addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-city">City</Label>
                      <Input
                        id="edit-city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-postalCode">Postal Code</Label>
                      <Input
                        id="edit-postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">Update User</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowEditModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Change Role Modal */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Change User Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      User: {selectedUser.userName} ({selectedUser.email})
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Current Role: {selectedUser.role.toUpperCase()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleChangeRole}>Update Role</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRoleModal(false);
                        setSelectedUser(null);
                        setNewRole('');
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
