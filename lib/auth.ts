import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { User } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
const TOKEN_EXPIRY = '7d'

export interface TokenPayload {
  userId: string
  username: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function extractToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  return authHeader.substring(7)
}

export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    VIEWER: 0,
    ENGINEER: 1,
    ADMIN: 2,
  }

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] ?? 0
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] ?? 0

  return userLevel >= requiredLevel
}

export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any
    if (!decoded || !decoded.exp) return true

    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  } catch {
    return true
  }
}