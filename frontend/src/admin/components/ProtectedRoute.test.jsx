import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProtectedRoute from './ProtectedRoute.jsx'
import { useAuth } from '../context/AuthContext.jsx'

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(),
}))

function renderProtectedRoute(initialPath = '/admin/san-pham') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/admin/san-pham"
          element={
            <ProtectedRoute>
              <div>Private Admin Page</div>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<div>Admin Login</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects anonymous users to admin login', () => {
    useAuth.mockReturnValue({ user: null, loading: false, isAdmin: false })

    renderProtectedRoute()

    expect(screen.getByText('Admin Login')).toBeInTheDocument()
  })

  it('renders admin users', () => {
    useAuth.mockReturnValue({ user: { roles: ['ADMIN'] }, loading: false, isAdmin: true })

    renderProtectedRoute()

    expect(screen.getByText('Private Admin Page')).toBeInTheDocument()
  })

  it('blocks non-admin users', () => {
    useAuth.mockReturnValue({ user: { roles: ['CUSTOMER'] }, loading: false, isAdmin: false })

    renderProtectedRoute()

    expect(screen.getByText('Không có quyền truy cập')).toBeInTheDocument()
  })
})
