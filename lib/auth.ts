import { supabase } from './supabase';
import type { User, UserRole } from '@/types';

// 临时类型修复
const typedSupabase = supabase as any;

// 检查Supabase是否可用
const checkSupabaseAvailable = () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please check your environment variables.');
  }
};

export const auth = {
  // 登录
  async signIn(email: string, password: string) {
    const { data, error } = await typedSupabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // 更新最后登录时间
    if (data.user) {
      try {
        await typedSupabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id)
          .select();
      } catch (error) {
        console.error('Failed to update last login:', error);
      }
    }

    return data;
  },

  // 注册
  async signUp(email: string, password: string, userData?: {
    fullName?: string;
    phone?: string;
    department?: string;
  }) {
    const { data, error } = await typedSupabase.auth.signUp({
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
    const { error } = await typedSupabase.auth.signOut();
    if (error) throw error;
  },

  // 获取当前用户
  async getCurrentUser(): Promise<User | null> {
    try {
      checkSupabaseAvailable();
      const { data: { user } } = await typedSupabase.auth.getUser();
      
      if (!user) return null;

      const { data: profile } = await typedSupabase
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
    } catch (error) {
      console.error('getCurrentUser error:', error);
      return null;
    }
  },

  // 重置密码
  async resetPassword(email: string) {
    const { error } = await typedSupabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  },

  // 更新密码
  async updatePassword(newPassword: string) {
    const { error } = await typedSupabase.auth.updateUser({
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
    const { error } = await typedSupabase
      .from('users')
      .update({
        full_name: updates.fullName,
        phone: updates.phone,
        department: updates.department,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select();

    if (error) throw error;
  },

  // 更新用户角色（仅管理员）
  async updateUserRole(userId: string, role: UserRole) {
    const currentUser = await this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can update user roles');
    }

    const { error } = await typedSupabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select();

    if (error) throw error;
  },

  // 禁用/启用用户（仅管理员）
  async setUserActive(userId: string, isActive: boolean) {
    const currentUser = await this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can disable/enable users');
    }

    const { error } = await typedSupabase
      .from('users')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select();

    if (error) throw error;
  },

  // 获取所有用户（仅管理员）
  async getAllUsers(): Promise<User[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can view all users');
    }

    const { data, error } = await typedSupabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((profile: any) => ({
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
    return typedSupabase.auth.onAuthStateChange(callback);
  },

  // 验证邮箱
  async verifyEmail(token: string) {
    const { error } = await typedSupabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error) throw error;
  },

  // 重新发送验证邮件
  async resendVerificationEmail(email: string) {
    const { error } = await typedSupabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) throw error;
  },
};