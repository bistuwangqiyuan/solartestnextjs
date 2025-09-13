import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: {
              id: 'test-id',
              email: 'test@example.com',
              role: 'operator',
              created_at: '2025-01-13T00:00:00Z',
              last_login: '2025-01-13T10:00:00Z',
            },
            error: null,
          })),
        })),
      })),
    })),
  },
}));

describe('Auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const mockUser = { id: 'test-id', email: 'test@example.com' };
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: {} },
        error: null,
      });

      const result = await auth.signIn('test@example.com', 'password123');
      
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.user).toEqual(mockUser);
    });

    it('should throw error on failed sign in', async () => {
      const mockError = new Error('Invalid credentials');
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(auth.signIn('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signUp', () => {
    it('should sign up user successfully', async () => {
      const mockUser = { id: 'new-id', email: 'new@example.com' };
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await auth.signUp('new@example.com', 'password123', 'New User');
      
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'New User',
          },
        },
      });
      expect(result.user).toEqual(mockUser);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user with profile', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: 'test-id' } },
        error: null,
      });

      const user = await auth.getCurrentUser();
      
      expect(user).toEqual({
        id: 'test-id',
        email: 'test@example.com',
        role: 'operator',
        createdAt: new Date('2025-01-13T00:00:00Z'),
        lastLogin: new Date('2025-01-13T10:00:00Z'),
      });
    });

    it('should return null if no user', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const user = await auth.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe('checkPermission', () => {
    it('should check permissions correctly', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: 'test-id' } },
        error: null,
      });

      // Mock user with operator role
      const hasOperatorPermission = await auth.checkPermission('operator');
      expect(hasOperatorPermission).toBe(true);

      const hasAdminPermission = await auth.checkPermission('admin');
      expect(hasAdminPermission).toBe(false);

      const hasObserverPermission = await auth.checkPermission('observer');
      expect(hasObserverPermission).toBe(true);
    });

    it('should return false if no user', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const hasPermission = await auth.checkPermission('observer');
      expect(hasPermission).toBe(false);
    });
  });
});