'use client'

import { useAuth } from "@/app/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [loading, user, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/">
                  <Image
                    src="/logo.png"
                    alt="GREIA"
                    width={32}
                    height={32}
                  />
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Overview
                </Link>
                {user.role === 'HOST' && (
                  <>
                    <Link
                      href="/dashboard/properties"
                      className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                      My Properties
                    </Link>
                    <Link
                      href="/dashboard/bookings"
                      className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                      Bookings
                    </Link>
                  </>
                )}
                {user.role === 'USER' && (
                  <>
                    <Link
                      href="/dashboard/my-stays"
                      className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                      My Stays
                    </Link>
                    <Link
                      href="/dashboard/favorites"
                      className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                      Favorites
                    </Link>
                  </>
                )}
                <Link
                  href="/dashboard/messages"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Messages
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative ml-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">{user.name}</span>
                  {user.image && (
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={user.image}
                      alt={user.name || ''}
                      width={32}
                      height={32}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}