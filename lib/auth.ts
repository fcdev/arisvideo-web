import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d' // Token valid for 7 days

export interface JWTPayload {
  userId: string
  email: string
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Get the current user from JWT cookie
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return null
    }

    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
      }
    })

    return user
  } catch (error) {
    return null
  }
}

/**
 * Get JWT token from cookie (for passing to Python service)
 */
export async function getToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get('token')?.value || null
  } catch (error) {
    return null
  }
}

/**
 * Set JWT token in HTTP-only cookie
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

/**
 * Clear auth cookie (logout)
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
}
