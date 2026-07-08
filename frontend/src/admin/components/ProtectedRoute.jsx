import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { ADMIN_ROUTES } from '../routes.js'

export default function ProtectedRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Đang tải...
      </div>
    )
  }

  if (!user) {
    return <Navigate to={ADMIN_ROUTES.login} state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="text-lg font-semibold text-slate-800 mb-2">Không có quyền truy cập</p>
          <p className="text-sm text-slate-500">
            Tài khoản của bạn không có quyền ADMIN để truy cập trang quản trị này.
          </p>
        </div>
      </div>
    )
  }

  return children
}
