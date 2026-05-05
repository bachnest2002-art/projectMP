'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  email: string
  role: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        router.push('/login')
      }
    }
    fetchUser()
  }, [router])

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Welcome, {user.email} ({user.role})</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {user.role === 'admin' && <AdminDashboard />}
          {user.role === 'customer' && <CustomerDashboard />}
          {user.role === 'crm' && <CRMDashboard />}
          {user.role === 'ra' && <RADashboard />}
        </div>
      </main>
    </div>
  )
}

function AdminDashboard() {
  return <div>Admin Dashboard Content</div>
}

function CustomerDashboard() {
  return <div>Customer Dashboard Content</div>
}

function CRMDashboard() {
  return <div>CRM Dashboard Content</div>
}

function RADashboard() {
  return <div>RA Dashboard Content</div>
}