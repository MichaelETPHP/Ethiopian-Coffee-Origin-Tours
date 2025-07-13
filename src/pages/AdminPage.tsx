import React, { useState, useEffect } from 'react'
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload,
  FaSync,
} from 'react-icons/fa'

interface Booking {
  id: number
  full_name: string
  email: string
  phone: string
  country: string
  age: number
  booking_type: 'individual' | 'group'
  number_of_people: number
  selected_package: string
  status: 'pending' | 'confirmed' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
}

interface AdminUser {
  id: number
  username: string
  email: string
  role: string
}

interface LoginForm {
  username: string
  password: string
}

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  })

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    package: '',
  })

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  const [deletingBookings, setDeletingBookings] = useState<Set<number>>(
    new Set()
  )

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const userData = localStorage.getItem('adminUser')

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
        setIsAuthenticated(true)
        fetchBookings()
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        logout()
      }
    }
  }, [])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminUser', JSON.stringify(data.user))
        setUser(data.user)
        setIsAuthenticated(true)
        fetchBookings()
      } else {
        setLoginError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setIsAuthenticated(false)
    setUser(null)
    setBookings([])
  }

  const fetchBookings = async () => {
    setLoading(true)
    const token = localStorage.getItem('adminToken')

    if (!token) {
      logout()
      return
    }

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.package && { package: filters.package }),
      })

      const response = await fetch(`/api/admin/bookings?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        logout()
        return
      }

      const data = await response.json()

      if (data.success) {
        setBookings(data.bookings)
        setPagination((prev) => ({
          ...prev,
          total: data.total,
          totalPages: data.totalPages,
        }))

        // Calculate stats
        const stats = {
          total: data.total,
          pending: data.bookings.filter((b: Booking) => b.status === 'pending')
            .length,
          confirmed: data.bookings.filter(
            (b: Booking) => b.status === 'confirmed'
          ).length,
          cancelled: data.bookings.filter(
            (b: Booking) => b.status === 'cancelled'
          ).length,
        }
        setStats(stats)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (
    id: number,
    status: string,
    notes?: string
  ) => {
    const token = localStorage.getItem('adminToken')

    if (!token) {
      logout()
      return
    }

    try {
      const response = await fetch(`/api/admin/bookings?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, notes }),
      })

      if (response.status === 401) {
        logout()
        return
      }

      const data = await response.json()

      if (data.success) {
        fetchBookings() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const deleteBooking = async (id: number) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this booking? This action cannot be undone.'
      )
    ) {
      return
    }

    const token = localStorage.getItem('adminToken')

    if (!token) {
      logout()
      return
    }

    // Set loading state
    setDeletingBookings((prev) => new Set(prev).add(id))

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        logout()
        return
      }

      const data = await response.json()

      if (data.success) {
        fetchBookings() // Refresh the list
        // Show success message
        alert('Booking deleted successfully!')
      } else {
        alert(data.error || 'Failed to delete booking')
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert('Failed to delete booking. Please try again.')
    } finally {
      // Clear loading state
      setDeletingBookings((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, page: 1 })) // Reset to first page
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  // Apply filters and pagination
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings()
    }
  }, [filters, pagination.page, pagination.limit])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md'>
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4'>
              <FaSignInAlt className='text-white text-2xl' />
            </div>
            <h1 className='text-3xl font-bold text-gray-800'>Admin Login</h1>
            <p className='text-gray-600 mt-2'>Ethiopian Coffee Origin Tours</p>
          </div>

          <form onSubmit={login} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Username
              </label>
              <input
                type='text'
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                placeholder='Enter username'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Password
              </label>
              <input
                type='password'
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                placeholder='Enter password'
                required
              />
            </div>

            {loginError && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                <p className='text-red-600 text-sm'>{loginError}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-700 focus:ring-4 focus:ring-amber-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Admin Dashboard
              </h1>
              <p className='text-sm text-gray-600'>
                Welcome back, {user?.username}
              </p>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-600'>Role: {user?.role}</span>
              <button
                onClick={logout}
                className='flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-blue-100 text-blue-600'>
                <FaEye className='text-xl' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Bookings
                </p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-yellow-100 text-yellow-600'>
                <FaFilter className='text-xl' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Pending</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-green-100 text-green-600'>
                <FaEdit className='text-xl' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Confirmed</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {stats.confirmed}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-red-100 text-red-600'>
                <FaTrash className='text-xl' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Cancelled</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {stats.cancelled}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-lg shadow mb-6'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>Filters</h2>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Search
                </label>
                <div className='relative'>
                  <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                  <input
                    type='text'
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange('search', e.target.value)
                    }
                    className='pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder='Name, email, phone...'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                >
                  <option value=''>All Status</option>
                  <option value='pending'>Pending</option>
                  <option value='confirmed'>Confirmed</option>
                  <option value='cancelled'>Cancelled</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Package
                </label>
                <select
                  value={filters.package}
                  onChange={(e) =>
                    handleFilterChange('package', e.target.value)
                  }
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                >
                  <option value=''>All Packages</option>
                  <option value='Yirgacheffe'>Yirgacheffe</option>
                  <option value='Sidamo'>Sidamo</option>
                  <option value='Limu'>Limu</option>
                  <option value='Harar'>Harar</option>
                </select>
              </div>

              <div className='flex items-end'>
                <button
                  onClick={fetchBookings}
                  className='flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors'
                >
                  <FaSync />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h2 className='text-lg font-medium text-gray-900'>Bookings</h2>
          </div>

          {loading ? (
            <div className='p-8 text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto'></div>
              <p className='mt-4 text-gray-600'>Loading bookings...</p>
            </div>
          ) : (
            <>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Customer
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Package
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Type
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div>
                            <div className='text-sm font-medium text-gray-900'>
                              {booking.full_name}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {booking.email}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {booking.phone}
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-900'>
                            {booking.selected_package}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {booking.country}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-900 capitalize'>
                            {booking.booking_type}
                          </div>
                          {booking.booking_type === 'group' && (
                            <div className='text-sm text-gray-500'>
                              {booking.number_of_people} people
                            </div>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {formatDate(booking.created_at)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          <div className='flex space-x-2'>
                            <select
                              value={booking.status}
                              onChange={(e) =>
                                updateBookingStatus(booking.id, e.target.value)
                              }
                              className='text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-amber-500'
                            >
                              <option value='pending'>Pending</option>
                              <option value='confirmed'>Confirmed</option>
                              <option value='cancelled'>Cancelled</option>
                            </select>
                            <button
                              onClick={() => deleteBooking(booking.id)}
                              disabled={deletingBookings.has(booking.id)}
                              className='text-red-600 hover:text-red-800 transition duration-200 p-1 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed'
                              title='Delete booking'
                            >
                              {deletingBookings.has(booking.id) ? (
                                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-red-600'></div>
                              ) : (
                                <FaTrash className='h-4 w-4' />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
                  <div className='flex-1 flex justify-between sm:hidden'>
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50'
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50'
                    >
                      Next
                    </button>
                  </div>
                  <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
                    <div>
                      <p className='text-sm text-gray-700'>
                        Showing{' '}
                        <span className='font-medium'>
                          {(pagination.page - 1) * pagination.limit + 1}
                        </span>{' '}
                        to{' '}
                        <span className='font-medium'>
                          {Math.min(
                            pagination.page * pagination.limit,
                            pagination.total
                          )}
                        </span>{' '}
                        of{' '}
                        <span className='font-medium'>{pagination.total}</span>{' '}
                        results
                      </p>
                    </div>
                    <div>
                      <nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'>
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50'
                        >
                          Previous
                        </button>
                        {Array.from(
                          { length: Math.min(5, pagination.totalPages) },
                          (_, i) => {
                            const page = i + 1
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  page === pagination.page
                                    ? 'z-10 bg-amber-50 border-amber-500 text-amber-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            )
                          }
                        )}
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50'
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
