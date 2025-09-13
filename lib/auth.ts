import { supabase } from './supabase';
import type { User } from '@/types';

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
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);
    }

    return data;
  },

  // 注册
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    // 创建用户配置文件
    if (data.user) {
      await supabase.from('user_profiles').insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
        role: 'observer', // 默认角色
      });
    }

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
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      createdAt: new Date(profile.created_at),
      lastLogin: profile.last_login ? new Date(profile.last_login) : undefined,
    };
  },

  // 重置密码
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
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

  // 检查用户权限
  async checkPermission(requiredRole: 'admin' | 'operator' | 'observer'): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user) return false;

    const roleHierarchy = {
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
};