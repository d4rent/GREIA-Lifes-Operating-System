'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string | null
  email: string
  role: 'USER' | 'HOST' | 'ADMIN'
  image: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (provider: string, credentials?: { email: string; password: string }) => Promise<void>
  signOut: () => Promise<void>
  signUp: (data: {
    name: string
    email: string
    password: string
    role: 'USER' | 'HOST'
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSignIn = async (
    provider: string,
    credentials?: { email: string; password: string }
  ) => {
    try {
      setError(null)
      const result = await signIn(provider, {
        ...credentials,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials')
        return
      }

      router.push('/dashboard')
    } catch (error) {
      setError('An error occurred during sign in')
    }
  }

  const handleSignUp = async (data: {
    name: string
    email: string
    password: string
    role: 'USER' | 'HOST'
  }) => {
    try {
      setError(null)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      await handleSignIn('credentials', {
        email: data.email,
        password: data.password,
      })
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An error occurred during sign up')
      }
    }
  }

  const value = {
    user: session?.user as User | null,
    loading: status === 'loading',
    error,
    signIn: handleSignIn,
    signOut,
    signUp: handleSignUp,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}