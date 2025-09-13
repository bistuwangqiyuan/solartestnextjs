import { supabase } from './supabase';
import type { User, UserRole } from '@/types';

export const auth = {
  // 登录
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // 更新最后登录时间
    if (data.user) {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);
    }

    return data;
  },

  // 注册
  async signUp(email: string, password: string, userData?: {
    fullName?: string;
    phone?: string;
    department?: string;
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData?.fullName,
          phone: userData?.phone,
          department: userData?.department,
        },
      },
    });

    if (error) throw error;

    return data;
  },

  // 登出
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 获取当前用户
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role as UserRole,
      fullName: profile.full_name || undefined,
      phone: profile.phone || undefined,
      department: profile.department || undefined,
      isActive: profile.is_active,
      createdAt: new Date(profile.created_at),
      updatedAt: new Date(profile.updated_at),
      lastLogin: profile.last_login ? new Date(profile.last_login) : undefined,
    };
  },

  // 重置密码
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  },

  // 更新密码
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },

  // 更新用户信息
  async updateProfile(userId: string, updates: {
    fullName?: string;
    phone?: string;
    department?: string;
  }) {
    const { error } = await supabase
      .from('users')
      .update({
        full_name: updates.fullName,
        phone: updates.phone,
        department: updates.department,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
  },

  // 更新用户角色（仅管理员）
  async updateUserRole(userId: string, role: UserRole) {
    const currentUser = await this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can update user roles');
    }

    const { error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;
  },

  // 禁用/启用用户（仅管理员）
  async setUserActive(userId: string, isActive: boolean) {
    const currentUser = await this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can disable/enable users');
    }

    const { error } = await supabase
      .from('users')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;
  },

  // 获取所有用户（仅管理员）
  async getAllUsers(): Promise<User[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can view all users');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(profile => ({
      id: profile.id,
      email: profile.email,
      role: profile.role as UserRole,
      fullName: profile.full_name || undefined,
      phone: profile.phone || undefined,
      department: profile.department || undefined,
      isActive: profile.is_active,
      createdAt: new Date(profile.created_at),
      updatedAt: new Date(profile.updated_at),
      lastLogin: profile.last_login ? new Date(profile.last_login) : undefined,
    }));
  },

  // 检查用户权限
  async checkPermission(requiredRole: UserRole): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user || !user.isActive) return false;

    const roleHierarchy: Record<UserRole, number> = {
      admin: 3,
      operator: 2,
      observer: 1,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  },

  // 监听认证状态变化
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // 验证邮箱
  async verifyEmail(token: string) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error) throw error;
  },

  // 重新发送验证邮件
  async resendVerificationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) throw error;
  },
};