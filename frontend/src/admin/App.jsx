import { Navigate, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import AddProduct from './pages/AddProduct.jsx'
import Orders from './pages/Orders.jsx'
import Customers from './pages/Customers.jsx'
import Reviews from './pages/Reviews.jsx'
import Marketing from './pages/Marketing.jsx'
import Policy from './pages/Policy.jsx'
import Branches from './pages/Branches.jsx'
import Payments from './pages/Payments.jsx'
import { ADMIN_ROUTES } from './routes.js'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="san-pham" element={<Products />} />
          <Route path="danh-muc" element={<AddProduct />} />
          <Route path="don-hang" element={<Orders />} />
          <Route path="khach-hang" element={<Customers />} />
          <Route path="danh-gia" element={<Reviews />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="chinh-sach" element={<Policy />} />
          <Route path="chi-nhanh" element={<Branches />} />
          <Route path="thanh-toan" element={<Payments />} />
        </Route>
        <Route path="*" element={<Navigate to={ADMIN_ROUTES.root} replace />} />
      </Routes>
    </AuthProvider>
  )
}
