'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';
import { useAuthStore } from '@/lib/store/auth-store';
import type { User, UserRole } from '@/types';
import { User as UserIcon, Mail, Shield, Clock, MoreVertical, Edit, Trash2, Power } from 'lucide-react';

export function UserManagement() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    department: '',
    role: 'observer' as UserRole,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await auth.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName || '',
      phone: user.phone || '',
      department: user.department || '',
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      // 更新用户信息
      await auth.updateProfile(selectedUser.id, {
        fullName: editForm.fullName,
        phone: editForm.phone,
        department: editForm.department,
      });

      // 如果角色改变了，更新角色
      if (editForm.role !== selectedUser.role) {
        await auth.updateUserRole(selectedUser.id, editForm.role);
      }

      setIsEditModalOpen(false);
      loadUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('更新用户失败');
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      await auth.setUserActive(user.id, !user.isActive);
      loadUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      alert('操作失败');
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'operator':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'observer':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '管理员';
      case 'operator':
        return '操作员';
      case 'observer':
        return '观察员';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">用户管理</h3>
        <div className="text-sm text-[var(--text-secondary)]">
          共 {users.length} 个用户
        </div>
      </div>

      <div className="industrial-card p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">用户</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">角色</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">部门</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">状态</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">最后登录</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-[var(--text-muted)]" />
                      </div>
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">
                          {user.fullName || '未设置'}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                      <Shield className="w-3 h-3" />
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {user.department || '-'}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      <Power className="w-3 h-3" />
                      {user.isActive ? '正常' : '已禁用'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {user.lastLogin ? (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(user.lastLogin).toLocaleString('zh-CN')}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="p-4">
                    {currentUser?.role === 'admin' && user.id !== currentUser.id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1 hover:bg-[var(--bg-secondary)] rounded"
                          title="编辑用户"
                        >
                          <Edit className="w-4 h-4 text-[var(--text-secondary)]" />
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user)}
                          className="p-1 hover:bg-[var(--bg-secondary)] rounded"
                          title={user.isActive ? '禁用用户' : '启用用户'}
                        >
                          <Power className={`w-4 h-4 ${user.isActive ? 'text-red-400' : 'text-green-400'}`} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 编辑用户模态框 */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="industrial-card w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">编辑用户</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  姓名
                </label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="industrial-input"
                  placeholder="输入姓名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  电话
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="industrial-input"
                  placeholder="输入电话"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  部门
                </label>
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="industrial-input"
                  placeholder="输入部门"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  角色
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                  className="industrial-input"
                >
                  <option value="observer">观察员</option>
                  <option value="operator">操作员</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 industrial-button"
              >
                取消
              </button>
              <button
                onClick={handleUpdateUser}
                className="flex-1 industrial-button primary"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}